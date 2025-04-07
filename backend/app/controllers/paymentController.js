const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  const options = {
    amount: amount, // convert to paisa
    currency: currency || "INR",
    receipt: receipt || `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Order creation failed" });
  }
};

exports.verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }
};
exports.successCallback = async (req, res) => {
  console.log("✅ Payment success callback:", req.body.payment_Id);
  res.json({ success: true, message: "Payment confirmed by frontend" });
};
