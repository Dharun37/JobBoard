"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  jobId: string;
  userId: string;
  description: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function RazorpayPayment({
  amount,
  jobId,
  userId,
  description,
  onSuccess,
  onError,
}: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false);
  const isDevelopment = process.env.NODE_ENV === "development";

  // Show warning if not in development mode
  if (!isDevelopment) {
    return (
      <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
        <p className="text-orange-800 text-sm">
          ⚠️ Razorpay payments are only available in development mode.
        </p>
      </div>
    );
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      // Create order
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          jobId,
          userId,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      // Configure Razorpay options
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Job Board",
        description: description,
        order_id: order.orderId,
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          try {
            // Verify payment on server
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                jobId,
              }),
            });

            if (verifyResponse.ok) {
              toast.success("Payment successful!");
              onSuccess?.();
              // Redirect to success page
              window.location.href = "/payment/success";
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
            onError?.(error);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          jobId,
          userId,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            // Redirect to cancel page
            window.location.href = "/payment/cancel";
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment");
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Development Mode Indicator */}
      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
        <span>🧪</span>
        <span>TEST MODE - Use Razorpay test cards</span>
      </div>
      
      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? "Processing..." : `Pay ₹${amount} (Test)`}
      </Button>
    </div>
  );
}