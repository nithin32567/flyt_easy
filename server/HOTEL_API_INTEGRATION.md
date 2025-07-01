# Hotel API Integration Guide

## Overview

The FlytEasy application now includes a complete hotel booking system integrated with B2B Hotel APIs. This system allows users to search, book, and manage hotel reservations alongside flight bookings.

## API Endpoints

### 1. Hotel Signature API
**URL:** `https://b2bapiutils.benzyinfotech.com`  
**Purpose:** Authentication and token generation for hotel APIs  
**Function:** Generate JWT tokens for hotel API access

### 2. Hotel Search & Booking API
**URL:** `https://travelportal.benzyinfotech.com/`  
**Purpose:** Hotel search, availability, and booking operations  
**Functions:** 
- Search hotels
- Check availability
- Get room rates
- Hotel details

### 3. Hotel Itinerary API
**URL:** `https://b2bapihotels.benzyinfotech.com/`  
**Purpose:** Manage hotel bookings and itineraries  
**Functions:**
- Retrieve booking details
- Manage itineraries
- Booking confirmations

### 4. Payment & Booking Management API
**URL:** `https://b2bapiflights.benzyinfotech.com`  
**Purpose:** Payment processing and booking retrieval  
**Functions:**
- StartPay (payment initiation)
- Retrieve booking information
- Payment status

## Frontend Pages

### 1. Hotel Search Page (`/hotel-search.html`)
- **Features:**
  - Destination selection with search functionality
  - Check-in/Check-out date picker
  - Guests & Rooms selection
  - Popular destinations showcase
  - Special offers display

- **Key Components:**
  - Destination modal with search
  - Guests & Rooms modal
  - Date validation (check-out after check-in)
  - Responsive design for mobile

### 2. Hotel Results Page (`/hotel-results.html`)
- **Features:**
  - Hotel listing with images and details
  - Advanced filtering options
  - Price comparison
  - Amenities display
  - Star ratings

- **Filter Options:**
  - Price per night
  - Star rating (2-5 stars)
  - Amenities (WiFi, Parking, Pool, Gym, Restaurant)
  - Location (Airport, City Center, Beach)

## Backend Integration

### Environment Variables Required

```env
# Hotel Signature API
HOTEL_SIGNATURE_API=https://b2bapiutils.benzyinfotech.com/Utils/Signature
HOTEL_MERCHANT_ID=your_merchant_id
HOTEL_API_KEY=your_api_key
HOTEL_CLIENT_ID=your_client_id
HOTEL_PASSWORD=your_password
HOTEL_BROWSER_KEY=your_browser_key
HOTEL_KEY=your_key

# Hotel Search & Booking API
HOTEL_API_URL=https://travelportal.benzyinfotech.com
HOTEL_SEARCH_PATH=/api/hotel/search
HOTEL_DETAILS_PATH=/api/hotel/details
HOTEL_BOOKING_PATH=/api/hotel/book
HOTEL_RETRIEVE_BOOKING_PATH=/api/hotel/retrieve
HOTEL_CANCELLATION_PATH=/api/hotel/cancel

# Hotel Payment API
HOTEL_PAYMENT_API_URL=https://b2bapiflights.benzyinfotech.com
HOTEL_STARTPAY_PATH=/api/hotel/startpay
```

### API Endpoints

#### 1. Hotel Signature
```javascript
POST /api/hotel/signature
{
  "clientId": "your_client_id",
  "clientPassword": "your_password"
}
```

#### 2. Hotel Search
```javascript
POST /api/hotel/search
{
  "destination": "Mumbai",
  "checkIn": "2025-06-25",
  "checkOut": "2025-06-27",
  "rooms": 1,
  "adults": 2,
  "children": 0,
  "infants": 0
}
```

#### 3. Hotel Details
```javascript
POST /api/hotel/details
{
  "hotelId": "HOTEL123",
  "sessionId": "SESSION456"
}
```

#### 4. Hotel Booking
```javascript
POST /api/hotel/book
{
  "hotelId": "HOTEL123",
  "sessionId": "SESSION456",
  "roomDetails": [...],
  "guestDetails": [...],
  "contactInfo": {...},
  "paymentInfo": {...}
}
```

#### 5. Hotel Payment
```javascript
POST /api/hotel/payment
{
  "bookingId": "BOOKING789",
  "amount": 8500,
  "paymentMethod": "credit_card",
  "cardDetails": {...}
}
```

## Implementation Details

### 1. Authentication Flow

1. **Hotel Token Generation:**
   - User initiates hotel search
   - Backend calls hotel signature API
   - JWT token received and stored
   - Token used for subsequent hotel API calls

2. **Token Management:**
   - Hotel tokens stored separately from flight tokens
   - Automatic token refresh before expiry
   - Error handling for expired tokens

### 2. Search Flow

1. **User Input:**
   - Destination selection
   - Date range selection
   - Guest count configuration

2. **API Call:**
   - Frontend sends search parameters
   - Backend validates and formats request
   - Hotel search API called with token

3. **Results Processing:**
   - Hotel data transformed for frontend
   - Images, amenities, and pricing extracted
   - Results cached for performance

### 3. Booking Flow

1. **Hotel Selection:**
   - User selects hotel from results
   - Hotel details retrieved
   - Room options displayed

2. **Guest Information:**
   - Guest details collected
   - Contact information gathered
   - Validation performed

3. **Payment Processing:**
   - Payment method selection
   - Card details collection
   - Payment API integration

4. **Confirmation:**
   - Booking confirmation received
   - Email/SMS notification sent
   - Booking details stored

## Frontend Features

### 1. Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Adaptive layouts for different screen sizes

### 2. User Experience
- Intuitive navigation
- Loading states and animations
- Error handling with user-friendly messages
- Progress indicators for multi-step processes

### 3. Search Functionality
- Real-time destination search
- Date validation and constraints
- Guest count management
- Filter and sort options

### 4. Hotel Display
- High-quality hotel images
- Star ratings and reviews
- Amenities icons
- Price comparison
- Special offers highlighting

## Error Handling

### 1. API Errors
- Network connectivity issues
- Invalid API responses
- Authentication failures
- Rate limiting

### 2. User Input Validation
- Required field validation
- Date range validation
- Guest count limits
- Payment information validation

### 3. Booking Errors
- Room availability issues
- Payment processing failures
- Booking confirmation errors

## Security Features

### 1. Token Security
- Secure token storage
- Automatic token refresh
- Token validation on each request

### 2. Data Protection
- Sensitive data encryption
- Secure payment processing
- GDPR compliance

### 3. Input Validation
- Server-side validation
- SQL injection prevention
- XSS protection

## Testing

### 1. Unit Testing
- API endpoint testing
- Controller function testing
- Utility function testing

### 2. Integration Testing
- End-to-end booking flow
- API integration testing
- Payment processing testing

### 3. User Acceptance Testing
- User interface testing
- Cross-browser compatibility
- Mobile responsiveness testing

## Deployment

### 1. Environment Setup
- Production environment variables
- API endpoint configuration
- Database setup

### 2. Monitoring
- API response monitoring
- Error logging and alerting
- Performance monitoring

### 3. Maintenance
- Regular API updates
- Security patches
- Performance optimization

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check API credentials
   - Verify token expiration
   - Validate request headers

2. **Search Failures**
   - Validate search parameters
   - Check API endpoint availability
   - Verify date formats

3. **Booking Errors**
   - Confirm room availability
   - Validate guest information
   - Check payment processing

### Debug Information

```javascript
// Check hotel token status
console.log('Hotel Token:', hotelTokenManager.getToken());
console.log('Is Authenticated:', hotelTokenManager.isAuthenticated());

// Check API response
console.log('Search Response:', searchResponse);
console.log('Booking Response:', bookingResponse);
```

## Support

For issues with the Hotel API integration:

1. Check browser console for error messages
2. Verify API endpoint configuration
3. Test with valid credentials
4. Contact development team with error logs

## Future Enhancements

### 1. Advanced Features
- Hotel reviews and ratings
- Photo galleries
- Virtual tours
- Loyalty programs

### 2. Integration Improvements
- Real-time availability updates
- Dynamic pricing
- Package deals (flight + hotel)
- Mobile app integration

### 3. User Experience
- Personalized recommendations
- Booking history
- Favorite hotels
- Price alerts 