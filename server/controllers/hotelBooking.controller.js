import Razorpay from "razorpay";

export const createHotelRazorpayOrder = async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Razorpay expects amount in paise (multiply by 100)
    const order = await razorpay.orders.create({
      amount: amount * 100, // e.g. 5000 INR => 500000 paise
      currency: currency || "INR",
      receipt: receipt || `hotel_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};