# Razorpay Test Mode Setup

This project uses Razorpay **ONLY in development/test mode** for payment processing.

## 🧪 Test Mode Configuration

### Environment Setup
All Razorpay configuration is in `.env` file with test credentials:

```bash
# Razorpay Configuration (DEVELOPMENT/TEST MODE ONLY)
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

### Getting Test Credentials

1. **Sign up at Razorpay**: https://razorpay.com
2. **For Website URL**: Use `http://localhost:3000`
3. **Business Type**: Select "Individual" or "Testing"
4. **Get Test Keys**: 
   - Go to Dashboard → Settings → API Keys
   - Generate Test API Keys (they start with `rzp_test_`)
   - Copy Key ID and Key Secret

### Test Cards for Development (INDIAN CARDS ONLY)

Use these **Indian test card details** for payments:

| Card Number | CVV | Expiry | Type | Status |
|-------------|-----|--------|------|--------|
| **4000 0000 0000 0002** | 123 | 12/25 | Indian Visa | ✅ Success |
| **5267 3181 8797 5449** | 123 | 12/25 | Indian Mastercard | ✅ Success |
| **6074 6979 9999 0016** | 123 | 12/25 | RuPay Card | ✅ Success |
| 4000 0000 0000 0119 | 123 | 12/25 | Visa | ❌ CVV Error |
| 4000 0000 0000 0010 | 123 | 12/25 | Visa | ❌ Generic Decline |

**🚨 Important**: International cards (like 4111 1111 1111 1111) are NOT supported even in test mode.

**UPI Test**: Use `success@razorpay` for successful UPI payments

### Safety Features

✅ **Development Only**: Razorpay only works when `NODE_ENV=development`
✅ **Test Keys**: All keys are prefixed with `rzp_test_`
✅ **No Real Charges**: All transactions are simulated
✅ **Visual Indicators**: UI shows "TEST MODE" badges

## 🚫 Production Mode

In production mode:
- Razorpay APIs return 403 errors
- Payment components show warning messages
- No real payment processing occurs

## 🔧 Usage

```tsx
import { RazorpayPayment } from "@/components/general/RazorpayPayment";

// Use in your component
<RazorpayPayment
  amount={99}
  jobId="job_123"
  userId="user_456"
  description="Job Posting - 30 Days"
/>
```

## 📝 Notes

- **Webhook URL**: Set to `http://localhost:3000/api/webhook/razorpay` in Razorpay dashboard
- **Currency**: All amounts are in INR (Indian Rupees)
- **Test Environment**: Perfect for development and testing
- **No Production Risk**: Completely isolated from live payments