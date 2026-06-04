import {
  Timestamp,
} from "firebase-admin/firestore";
import { adminDb } from "./_firebaseAdmin.js";
import {
  getFallbackPaymentAttempt,
  isFirestoreConnectivityError,
  markFallbackPaymentAttemptCompleted,
  saveFallbackPaymentAttempt,
} from "./_storeFallback.js";

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

const paymentAttemptsCollection = "storePaymentAttempts";

export async function savePaymentAttempt(razorpayOrder, pricing) {
  try {
    const paymentAttemptRef = adminDb.collection(paymentAttemptsCollection).doc(razorpayOrder.id);
    await withFirestoreTimeout(
      paymentAttemptRef.set({
        razorpayOrderId: razorpayOrder.id,
        amount: pricing.amountInPaise,
        currency: pricing.currency,
        cartFingerprint: pricing.fingerprint,
        status: "created",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }),
      "Saving payment attempt",
    );
  } catch (error) {
    if (isFirestoreConnectivityError(error)) {
      await saveFallbackPaymentAttempt(razorpayOrder, pricing);
      return;
    }
    throw error;
  }
}

export async function getPaymentAttempt(razorpayOrderId) {
  try {
    const paymentAttemptSnap = await withFirestoreTimeout(
      adminDb.collection(paymentAttemptsCollection).doc(razorpayOrderId).get(),
      "Reading payment attempt",
    );
    if (!paymentAttemptSnap.exists()) {
      throw new Error("Payment session was not found. Please start checkout again.");
    }

    return paymentAttemptSnap.data();
  } catch (error) {
    if (isFirestoreConnectivityError(error)) {
      return getFallbackPaymentAttempt(razorpayOrderId);
    }
    throw error;
  }
}

export async function markPaymentAttemptCompleted(razorpayOrderId, storeOrderId) {
  try {
    await withFirestoreTimeout(
      adminDb.collection(paymentAttemptsCollection).doc(razorpayOrderId).update({
        status: "completed",
        storeOrderId,
        updatedAt: Timestamp.now(),
      }),
      "Updating payment attempt",
    );
  } catch (error) {
    if (isFirestoreConnectivityError(error)) {
      await markFallbackPaymentAttemptCompleted(razorpayOrderId, storeOrderId);
      return;
    }
    throw error;
  }
}
