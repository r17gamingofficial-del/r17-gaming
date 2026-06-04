import {
  Timestamp,
} from "firebase-admin/firestore";
import { adminDb } from "./_firebaseAdmin.js";
import {
  createFallbackStoreOrder,
  isFirestoreConnectivityError,
} from "./_storeFallback.js";

const FIRESTORE_TIMEOUT_MS = 15000;

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

const storeOrdersCollection = adminDb.collection("storeOrders");

export async function createStoreOrder(orderData) {
  try {
    const itemRequests = Array.isArray(orderData.items) ? orderData.items : [];
    if (!itemRequests.length) throw new Error("Cart is empty");

    const normalizedItems = itemRequests.map((item) => {
      const productId = String(item.productId || item.id || "").trim();
      if (!productId) throw new Error("A product in your cart is missing its ID");

      return {
        productId,
        quantity: Math.max(1, Number(item.quantity) || 1),
        selectedSize: item.selectedSize || "",
      };
    });

    const productQuantities = normalizedItems.reduce((totals, item) => {
      totals.set(item.productId, (totals.get(item.productId) || 0) + item.quantity);
      return totals;
    }, new Map());

    const orderRef = storeOrdersCollection.doc();
    const orderNumber = `R17-${Date.now().toString(36).toUpperCase()}`;

    return withFirestoreTimeout(adminDb.runTransaction(async (transaction) => {
      const orderItems = [];
      let subtotal = 0;
      const productsById = new Map();

      for (const productId of productQuantities.keys()) {
        const productRef = adminDb.collection("storeProducts").doc(productId);
        const productSnap = await transaction.get(productRef);

        if (!productSnap.exists()) {
          throw new Error("A product in your cart is no longer available");
        }

        const product = productSnap.data();
        if (product.isActive === false) {
          throw new Error(`${product.name} is currently unavailable`);
        }

        const currentStock = Number(product.stock) || 0;
        const requestedQuantity = productQuantities.get(productId);
        if (currentStock < requestedQuantity) {
          throw new Error(`${product.name} has only ${currentStock} left in stock`);
        }

        productsById.set(productId, {
          product,
          productRef,
          currentStock,
          requestedQuantity,
        });
      }

      for (const item of normalizedItems) {
        const { product } = productsById.get(item.productId);
        const unitPrice = Number(product.price) || 0;
        subtotal += unitPrice * item.quantity;
        orderItems.push({
          productId: item.productId,
          name: product.name || "",
          category: product.category || "",
          image: product.image || "",
          selectedSize: item.selectedSize,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        });
      }

      const shippingFee = Number(orderData.shippingFee) || 0;
      const total = subtotal + shippingFee;
      const paymentMethod = orderData.paymentMethod || "cod";
      const payment = orderData.payment || {};
      const isOnlinePayment = paymentMethod === "online";

      if (isOnlinePayment && payment.verified !== true) {
        throw new Error("Online payment must be verified before creating the order");
      }

      const order = {
        orderNumber,
        items: orderItems,
        customer: orderData.customer || {},
        userId: orderData.userId || null,
        userEmail: orderData.userEmail || orderData.customer?.email || "",
        subtotal,
        shippingFee,
        total,
        currency: "INR",
        paymentMethod,
        paymentGateway: isOnlinePayment ? "razorpay" : "manual",
        paymentStatus: isOnlinePayment ? "paid" : "cod_pending",
        razorpayPaymentId: payment.razorpayPaymentId || "",
        razorpayOrderId: payment.razorpayOrderId || "",
        razorpaySignature: payment.razorpaySignature || "",
        fulfillmentStatus: "processing",
        status: "placed",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      for (const { productRef, currentStock, requestedQuantity } of productsById.values()) {
        transaction.update(productRef, {
          stock: currentStock - requestedQuantity,
          updatedAt: Timestamp.now(),
        });
      }
      transaction.set(orderRef, order);
      return { id: orderRef.id, ...order };
    }), "Creating store order transaction");
  } catch (error) {
    if (isFirestoreConnectivityError(error)) {
      return createFallbackStoreOrder(orderData);
    }
    throw error;
  }
}