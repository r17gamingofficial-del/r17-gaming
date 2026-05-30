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
    const { amount, currency = "INR", receipt } = req.body || {};
    const amountInPaise = Number(amount);

    if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({ error: "A valid amount in paise is required" });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: receipt || `r17_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      return res.status(razorpayResponse.status).json({
        error: data?.error?.description || "Unable to create Razorpay order",
      });
    }

    return res.status(200).json({
      keyId,
      order: data,
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Unable to create Razorpay order",
    });
  }
}
