import crypto from "node:crypto";
import {
  getPaymentAttempt,
  markPaymentAttemptCompleted,
} from "./_paymentAttempts.js";
import { createStoreOrder } from "./_storeOrders.js";
import {
  buildVerifiedOnlineOrder,
  calculateStorePricing,
} from "./_storePricing.js";

const RAZORPAY_TIMEOUT_MS = 15000;

function isRazorpayNetworkError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.name === "AbortError" ||
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("certificate") ||
    message.includes("tls")
  );
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(left || "");
  const rightBuffer = Buffer.from(right || "");
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function fetchRazorpayOrder(orderId, keyId, keySecret) {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RAZORPAY_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (isRazorpayNetworkError(error)) {
      const networkError = new Error(
        "Unable to verify payment right now because Razorpay is unreachable. Please retry in a moment.",
      );
      networkError.statusCode = 502;
      throw networkError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.description || "Unable to verify Razorpay order");
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: "Razorpay credentials are not configured" });
  }

  try {
    const payload = req.body || {};
    const payment = payload.payment || payload;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = payment;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay payment verification fields" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (!safeCompare(expectedSignature, razorpay_signature)) {
      return res.status(400).json({ verified: false, error: "Invalid payment signature" });
    }

    if (!payload.orderData) {
      return res.status(200).json({ verified: true });
    }

    const pricing = await calculateStorePricing(payload.orderData);
    const paymentAttempt = await getPaymentAttempt(razorpay_order_id);
    const razorpayOrder = await fetchRazorpayOrder(razorpay_order_id, keyId, keySecret);

    if (paymentAttempt.status === "completed") {
      return res.status(409).json({
        verified: false,
        error: "This payment has already been used to create an order",
      });
    }

    if (paymentAttempt.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        verified: false,
        error: "Payment order does not match the server checkout session",
      });
    }

    if (
      Number(razorpayOrder.amount) !== pricing.amountInPaise ||
      Number(paymentAttempt.amount) !== pricing.amountInPaise
    ) {
      return res.status(400).json({
        verified: false,
        error: "Paid amount does not match the cart total",
      });
    }

    if (razorpayOrder.currency !== pricing.currency || paymentAttempt.currency !== pricing.currency) {
      return res.status(400).json({
        verified: false,
        error: "Payment currency does not match the cart",
      });
    }

    if (
      razorpayOrder.notes?.cart_fingerprint !== pricing.fingerprint ||
      paymentAttempt.cartFingerprint !== pricing.fingerprint
    ) {
      return res.status(400).json({
        verified: false,
        error: "Payment order does not match the current cart",
      });
    }

    const storeOrder = await createStoreOrder(
      buildVerifiedOnlineOrder(payload.orderData, payment, pricing),
    );
    await markPaymentAttemptCompleted(razorpay_order_id, storeOrder.id);

    return res.status(200).json({ verified: true, order: storeOrder });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({
      verified: false,
      error: error?.message || "Unable to verify Razorpay payment",
    });
  }
}
