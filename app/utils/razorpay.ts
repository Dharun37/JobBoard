import Razorpay from "razorpay";
import { createHmac } from "crypto";

console.log("🔧 Razorpay Environment Check:", {
  NODE_ENV: process.env.NODE_ENV,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? "✅ Set" : "❌ Missing",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? "✅ Set" : "❌ Missing",
});

// Initialize Razorpay with better error handling
function createRazorpayInstance(): Razorpay | null {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("❌ Razorpay credentials missing:", {
        keyId: keyId ? "Present" : "Missing",
        keySecret: keySecret ? "Present" : "Missing"
      });
      return null;
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    console.log("✅ Razorpay initialized successfully");
    return instance;
  } catch (error) {
    console.error("❌ Failed to initialize Razorpay:", error);
    return null;
  }
}

export const razorpay = createRazorpayInstance();

// Razorpay configuration for frontend
export const razorpayConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  environment: process.env.NODE_ENV,
};

// Helper function to verify payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + "|" + paymentId)
      .digest("hex");
    
    return expectedSignature === signature;
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return false;
  }
}