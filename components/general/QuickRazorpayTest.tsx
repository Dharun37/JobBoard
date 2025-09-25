"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SimpleRazorpay } from "../general/SimpleRazorpay";

export function QuickRazorpayTest() {
  const [showPayment, setShowPayment] = useState(false);

  if (showPayment) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test Razorpay Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>Amount:</strong> ₹99</p>
                <p><strong>Description:</strong> Job Posting - 30 Days</p>
              </div>
              
              <SimpleRazorpay
                amount={99}
                jobId="test-job-123"
                userId="test-user-456"
                description="Job Posting - 30 Days (Test)"
              />
              
              <Button 
                variant="outline" 
                onClick={() => setShowPayment(false)}
                className="w-full"
              >
                ← Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Quick Razorpay Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Test the Razorpay payment integration with a sample job posting.
            </p>
            
            <div className="bg-blue-50 p-3 rounded text-sm">
              <p className="font-medium text-blue-800">Use these test card details:</p>
              <p>Card: <code>4111 1111 1111 1111</code></p>
              <p>CVV: <code>123</code></p>
              <p>Expiry: <code>12/25</code></p>
            </div>
            
            <Button onClick={() => setShowPayment(true)} className="w-full">
              Test Payment (₹99)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}