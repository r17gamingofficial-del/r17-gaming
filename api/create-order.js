import { savePaymentAttempt } from "./_paymentAttempts.js";
import { calculateStorePricing, publicPricing } from "./_storePricing.js";

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
    const pricing = await calculateStorePricing(req.body || {});
    const receipt = `r17_${Date.now().toString(36)}`;

    if (!Number.isInteger(pricing.amountInPaise) || pricing.amountInPaise <= 0) {
      return res.status(400).json({ error: "A valid payable amount is required" });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), RAZORPAY_TIMEOUT_MS);
    let razorpayResponse;
    try {
      razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: pricing.amountInPaise,
          currency: pricing.currency,
          receipt,
          notes: {
            source: "r17-store",
            cart_fingerprint: pricing.fingerprint,
          },
        }),
        signal: controller.signal,
      });
    } catch (error) {
      if (isRazorpayNetworkError(error)) {
        return res.status(502).json({
          error: "Unable to reach Razorpay right now. Please check your connection and try again.",
        });
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }

    const data = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      return res.status(razorpayResponse.status).json({
        error: data?.error?.description || "Unable to create Razorpay order",
      });
    }

    await savePaymentAttempt(data, pricing);

    return res.status(200).json({
      keyId,
      order: data,
      pricing: publicPricing(pricing),
    });
  } catch (error) {
    return res.status(error?.statusCode || 500).json({
      error: error?.message || "Unable to create Razorpay order",
    });
  }
}
