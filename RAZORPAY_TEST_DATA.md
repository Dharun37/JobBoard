# Razorpay Test Payment Details

##  Test UPI IDs

For testing UPI payments in Razorpay test mode, you can use these test UPI IDs:

###  Success Test UPI IDs
```
success@razorpay
success@upi
```

###  Failure Test UPI IDs
```
failure@razorpay
failure@upi
```

## 💳 Test Credit/Debit Cards

### Successful Test Cards
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits (e.g., 123)
Expiry: Any future date (e.g., 12/25)
Name: Any name
```

```
Card Number: 5555 5555 5555 4444
CVV: Any 3 digits (e.g., 123)
Expiry: Any future date (e.g., 12/25)
Name: Any name
```

### Failed Payment Test Cards
```
Card Number: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

##  Test NetBanking

### Successful Test Banks
- **HDFC Bank** - Select any option, it will succeed
- **ICICI Bank** - Select "Success" option
- **SBI** - Select "Success" option

### Failed Test Banks
- Select "Failure" option in any test bank

##  Test Wallets

### Successful Test Wallets
- **PayZapp** - Use any mobile number, OTP will be 123456
- **Mobikwik** - Use any mobile number, OTP will be 123456

##  Testing Workflow

1. **Start a payment** from your job posting form
2. **Choose UPI** as payment method
3. **Enter test UPI ID**: `success@razorpay`
4. **Payment will be processed** automatically in test mode
5. **Webhook will be triggered** (check your terminal logs)
6. **Job status will be updated** to PUBLISHED

##  Debugging Tips

### Check Terminal Logs
```bash
# Watch for these logs when testing payments:
- " Creating Razorpay TEST order:"
- " Razorpay initialized successfully"
- "Payment successful for job [jobId]"
```

### Test Webhook Locally
```bash
# Use ngrok to expose localhost for webhook testing
npx ngrok http 3000

# Update webhook URL in Razorpay dashboard:
# https://your-ngrok-url.ngrok.io/api/webhook/razorpay
```

##  Important Notes

1. **Test Mode Only**: These test credentials only work in Razorpay test mode
2. **No Real Money**: No actual money is charged in test mode
3. **Instant Processing**: Test payments are processed immediately
4. **Development Only**: Current setup only works in development environment

##  Environment Variables (Already Set)

```env
RAZORPAY_KEY_ID=rzp_test_RL5D6JYVYuCc4e
RAZORPAY_KEY_SECRET=p4TJ1C5wUdKJgalFfwHuiEiJ
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RL5D6JYVYuCc4e
```

##  UPI Testing Steps

1. Go to your job posting form
2. Fill out job details
3. Click "Post Job" (may require payment)
4. Select "UPI" as payment method
5. Enter: `success@razorpay`
6. Click "Pay Now"
7. Payment will succeed automatically
8. Check your job status - should be PUBLISHED

## Quick Test

Want to test right now? Here's what to do:

1. **Go to**: http://localhost:3000/post-job
2. **Fill the form** with any job details
3. **Select payment method**: UPI
4. **Enter UPI ID**: `success@razorpay`
5. **Submit** and watch the magic happen! 

---

*Happy testing! *