import crypto from "node:crypto";
import { adminDb } from "./_firebaseAdmin.js";
import { calculateFallbackPricing, isFirestoreConnectivityError } from "./_storeFallback.js";

const FIRESTORE_TIMEOUT_MS = 12000;

function withFirestoreTimeout(promise, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const error = new Error(`${label} timed out`);
      error.code = 14;
      reject(error);
    }, FIRESTORE_TIMEOUT_MS);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

const SHIPPING_THRESHOLD = 3000;
const SHIPPING_FEE = 99;
const CURRENCY = "INR";

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function normalizeItems(items = []) {
  if (!Array.isArray(items) || !items.length) {
    throw validationError("Cart is empty");
  }

  return items.map((item) => {
    const productId = String(item.productId || item.id || "").trim();
    if (!productId) throw validationError("A product in your cart is missing its ID");

    return {
      productId,
      quantity: Math.max(1, Number(item.quantity) || 1),
      selectedSize: String(item.selectedSize || ""),
    };
  });
}

function totalQuantityByProduct(items) {
  return items.reduce((totals, item) => {
    totals.set(item.productId, (totals.get(item.productId) || 0) + item.quantity);
    return totals;
  }, new Map());
}

function fingerprintPayload(items, pricing) {
  return {
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
    })),
    subtotal: pricing.subtotal,
    shippingFee: pricing.shippingFee,
    total: pricing.total,
    currency: pricing.currency,
  };
}

export async function calculateStorePricing(orderData = {}) {
  try {
    const items = normalizeItems(orderData.items);
    const quantitiesByProduct = totalQuantityByProduct(items);
    const productsById = new Map();

    await Promise.all(
      [...quantitiesByProduct.keys()].map(async (productId) => {
        const productSnap = await withFirestoreTimeout(
          adminDb.collection("storeProducts").doc(productId).get(),
          "Fetching store product",
        );
        if (!productSnap.exists()) {
          throw validationError("A product in your cart is no longer available");
        }

        const product = productSnap.data();
        if (product.isActive === false) {
          throw validationError(`${product.name || "This product"} is currently unavailable`);
        }

        const requestedQuantity = quantitiesByProduct.get(productId);
        const currentStock = Number(product.stock) || 0;
        if (currentStock < requestedQuantity) {
          throw validationError(`${product.name || "This product"} has only ${currentStock} left in stock`);
        }

        productsById.set(productId, product);
      }),
    );

    const pricedItems = items.map((item) => {
      const product = productsById.get(item.productId);
      const unitPrice = Number(product.price) || 0;

      return {
        ...item,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    });

    const subtotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingFee = subtotal > 0 && subtotal < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
    const total = subtotal + shippingFee;
    const pricing = {
      items,
      pricedItems,
      subtotal,
      shippingFee,
      total,
      amountInPaise: Math.round(total * 100),
      currency: CURRENCY,
    };
    const fingerprint = crypto
      .createHash("sha256")
      .update(JSON.stringify(fingerprintPayload(items, pricing)))
      .digest("hex");

    return {
      ...pricing,
      fingerprint,
    };
  } catch (error) {
    if (isFirestoreConnectivityError(error)) {
      return calculateFallbackPricing(orderData);
    }
    throw error;
  }
}

export function publicPricing(pricing) {
  return {
    subtotal: pricing.subtotal,
    shippingFee: pricing.shippingFee,
    total: pricing.total,
    amountInPaise: pricing.amountInPaise,
    currency: pricing.currency,
  };
}

export function buildVerifiedOnlineOrder(orderData = {}, payment = {}, pricing) {
  const customer = orderData.customer || {};

  return {
    items: pricing.items,
    customer,
    paymentMethod: "online",
    shippingFee: pricing.shippingFee,
    userId: orderData.userId || null,
    userEmail: orderData.userEmail || customer.email || "",
    payment: {
      verified: true,
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpayOrderId: payment.razorpay_order_id,
      razorpaySignature: payment.razorpay_signature,
    },
  };
}
