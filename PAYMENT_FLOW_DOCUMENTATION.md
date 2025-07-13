# Payment Gateway Flow Documentation

## Overview
This document describes the complete payment gateway flow implemented in the FlytEasy flight booking application.

## Flow Overview

### 1. User Journey
1. **Flight Search** → User searches for flights
2. **Flight Selection** → User selects a flight and proceeds to review
3. **Passenger Details** → User fills in contact and passenger information
4. **Payment Gateway** → User is redirected to Razorpay payment gateway
5. **Payment Processing** → Payment is processed and verified
6. **Success/Error** → User is redirected based on payment outcome

### 2. Payment Flow Implementation

#### Step 1: Create Itinerary
- **File**: `client/src/pages/Pax-details.jsx`
- **Function**: `createItineraryAndPayment()`
- **API Endpoint**: `POST /api/create-itinerary`
- **Purpose**: Creates the flight itinerary with passenger details

#### Step 2: Create Payment Order
- **File**: `server/controllers/bookFlight.controller.js`
- **Function**: `bookFlight()`
- **API Endpoint**: `POST /api/razorpay/bookFlight`
- **Purpose**: Creates a Razorpay order for payment processing

#### Step 3: Initialize Payment Gateway
- **File**: `client/src/pages/Pax-details.jsx`
- **Implementation**: Razorpay checkout integration
- **Purpose**: Opens the payment gateway modal for user payment

#### Step 4: Payment Verification
- **File**: `server/controllers/bookFlight.controller.js`
- **Function**: `verifyPayment()`
- **API Endpoint**: `POST /api/razorpay/verifyPayment`
- **Purpose**: Verifies the payment signature and processes the booking

### 3. Error Handling

#### Payment Failures
- **File**: `client/src/pages/PaymentError.jsx`
- **Triggers**: 
  - Payment gateway failure
  - Network errors
  - Invalid payment data
- **Actions**: 
  - Display error details
  - Provide retry options
  - Show support information

#### Flow Errors
- **Validation**: Required field validation
- **API Errors**: Proper error messages and redirects
- **Network Issues**: Graceful error handling

### 4. Success Flow

#### Booking Confirmation
- **File**: `client/src/pages/BookingConfirmation.jsx`
- **Features**:
  - Display booking details
  - Show payment information
  - Provide next steps
  - Print receipt option

### 5. Environment Configuration

#### Client Configuration
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_public_key
VITE_BASE_URL=http://localhost:3000
```

#### Server Configuration
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### 6. API Endpoints

#### Create Itinerary
```
POST /api/create-itinerary
Headers: Authorization: Bearer <token>
Body: {
  TUI: string,
  ContactInfo: object,
  Travellers: array,
  NetAmount: number,
  // ... other fields
}
```

#### Create Payment Order
```
POST /api/razorpay/bookFlight
Headers: Authorization: Bearer <token>
Body: {
  amount: number,
  currency: string,
  receipt: string,
  itineraryId: string,
  notes: object
}
```

#### Verify Payment
```
POST /api/razorpay/verifyPayment
Headers: Authorization: Bearer <token>
Body: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  itineraryId: string
}
```

### 7. Security Features

#### Payment Verification
- HMAC SHA256 signature verification
- Order ID and Payment ID validation
- Secure key management

#### Data Validation
- Required field validation
- Amount validation
- Currency validation

### 8. User Experience Features

#### Loading States
- Processing button state
- Loading spinners
- Disabled form during processing

#### Error Recovery
- Retry payment option
- Clear error messages
- Support contact information

#### Success Experience
- Clear confirmation message
- Booking details display
- Next steps guidance

### 9. Testing

#### Test Scenarios
1. **Successful Payment Flow**
   - Complete booking with valid payment
   - Verify booking confirmation

2. **Payment Failure Scenarios**
   - Insufficient funds
   - Invalid card details
   - Network timeouts
   - Gateway errors

3. **Error Recovery**
   - Retry payment functionality
   - Error page navigation
   - Support contact

### 10. Deployment Considerations

#### Environment Variables
- Ensure all Razorpay keys are properly configured
- Use production keys for live environment
- Secure key storage

#### SSL/TLS
- HTTPS required for payment processing
- Secure communication with Razorpay

#### Monitoring
- Payment success/failure logging
- Error tracking
- Performance monitoring

## Files Modified/Created

### Client Side
- `client/src/pages/Pax-details.jsx` - Updated payment flow
- `client/src/pages/BookingConfirmation.jsx` - Success page
- `client/src/pages/PaymentError.jsx` - Error handling page
- `client/src/App.jsx` - Added PaymentError route

### Server Side
- `server/controllers/bookFlight.controller.js` - Enhanced payment processing
- `server/routes/razorpay.routes.js` - Payment routes

## Next Steps

1. **Configure Razorpay Keys**: Update environment variables with actual Razorpay credentials
2. **Test Payment Flow**: Test with Razorpay test mode
3. **Production Deployment**: Deploy with production keys
4. **Monitoring**: Set up payment monitoring and alerts
5. **Analytics**: Track payment success rates and user behavior 