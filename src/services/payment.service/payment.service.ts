import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const createOrder = async (amount: number, currency: string) => {
  const options = {
    amount: amount * 100, // Razorpay expects amount in paisa
    currency,
    receipt: `order_rcpt_${Date.now()}`,
  };

  return await razorpay.orders.create(options);
};

export const verifyPayment = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expectedSignature === signature;
};
