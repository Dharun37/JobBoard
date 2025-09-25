import { QuickRazorpayTest } from "@/components/general/QuickRazorpayTest";

export default function TestPaymentPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">🧪 Razorpay Payment Test</h1>
      <div className="max-w-md mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800">Test Mode Active</h3>
          <p className="text-sm text-yellow-700 mb-2">
            <strong>Indian Cards Only!</strong> Use these test cards:
          </p>
          <div className="text-xs text-yellow-600 space-y-1">
            <div><strong>✅ Success:</strong> 4000 0000 0000 0002</div>
            <div><strong>✅ Mastercard:</strong> 5267 3181 8797 5449</div>
            <div><strong>✅ RuPay:</strong> 6074 6979 9999 0016</div>
          </div>
        </div>
        <QuickRazorpayTest />
      </div>
    </div>
  );
}