# Updated Booking Flow Documentation

## Overview

This document describes the updated booking flow that properly implements the GetItineraryStatus polling mechanism and RetrieveBooking flow as per the requirements.

## Key Changes Made

### 1. GetItineraryStatus Polling Logic

**File:** `server/controllers/bookFlight.controller.js`

The `getItineraryStatus` function now properly checks the `CurrentStatus` field from the API response:

```javascript
// Check the current status - this is the key field that determines if booking is complete
if (responseData.CurrentStatus === "Success") {
    return res.status(200).json({
        success: true,
        data: responseData,
        message: "Booking completed successfully",
        status: "SUCCESS",
        shouldPoll: false
    });
} else if (responseData.CurrentStatus === "Failed") {
    return res.status(400).json({
        success: false,
        data: responseData,
        message: "Booking failed",
        status: "FAILED",
        shouldPoll: false
    });
} else {
    // Still in progress - continue polling
    return res.status(200).json({
        success: true,
        data: responseData,
        message: "Booking still in progress",
        status: "IN_PROGRESS",
        shouldPoll: true
    });
}
```

### 2. RetrieveBooking Enhancement

**File:** `server/controllers/retrieveBooking.controller.js`

The `retrieveBooking` function now includes better validation to ensure the response contains complete booking data:

```javascript
// Check if the response contains the expected booking data
if (data.Code === "200" && data.TransactionID) {
    return res.status(200).json({
        success: true,
        message: "Booking retrieved successfully",
        data: data
    });
} else {
    return res.status(400).json({
        success: false,
        message: data.Msg?.[0] || "Failed to retrieve booking - incomplete response",
        data: data
    });
}
```

### 3. Client-Side Polling Implementation

**File:** `client/src/components/PaymentButton.jsx`

The `pollBookingStatus` function now implements the correct polling logic:

```javascript
async function pollBookingStatus(TUI, TransactionID, maxAttempts = 30) {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        try {
            console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
            const statusResponse = await getItineraryStatus(TUI, TransactionID);
            
            console.log('Status response:', statusResponse);
            
            // Check if the status response indicates completion
            if (statusResponse.status === "SUCCESS") {
                console.log('Booking completed successfully, retrieving booking details...');
                // Only call RetrieveBooking after GetItineraryStatus returns Success
                const bookingResponse = await retrieveBooking(TUI, TransactionID);
                if (bookingResponse.success) {
                    console.log('Booking details retrieved successfully:', bookingResponse.data);
                    localStorage.setItem("bookingDetails", JSON.stringify(bookingResponse.data));
                    return { success: true, bookingData: bookingResponse.data };
                } else {
                    console.error('Failed to retrieve booking details:', bookingResponse);
                    return { success: false, message: "Failed to retrieve booking details" };
                }
            } else if (statusResponse.status === "FAILED") {
                console.log('Booking failed');
                return { success: false, message: "Booking failed" };
            } else {
                // Still in progress, wait and try again
                console.log(`Booking still in progress, attempt ${attempts + 1}/${maxAttempts}`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                attempts++;
            }
        } catch (error) {
            console.error('Error polling booking status:', error);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        }
    }
    
    return { success: false, message: "Booking status polling timeout" };
}
```

### 4. PaymentSuccess Page Update

**File:** `client/src/pages/PaymentSucccess.jsx`

The PaymentSuccess page now properly uses the booking data from localStorage (stored during the payment process) and falls back to API call if needed:

```javascript
useEffect(() => {
    console.log('PaymentSuccess useEffect triggered');
    // First try to get booking data from localStorage (from payment process)
    const storedBookingData = localStorage.getItem("bookingDetails");
    if (storedBookingData) {
        console.log('Found booking data in localStorage');
        setBookingData(JSON.parse(storedBookingData));
    } else {
        // If not in localStorage, fetch from API
        console.log('No booking data in localStorage, fetching from API...');
        fetchBookingDetails();
    }
}, []);
```

## Complete Booking Flow

### 1. Payment Initiation
- User initiates payment through Razorpay
- Payment is processed and verified

### 2. StartPay Process
- `startPay` API is called to begin the booking process
- Returns transaction details and polling requirement

### 3. GetItineraryStatus Polling
- System polls `GetItineraryStatus` API every 2 seconds
- Continues until `CurrentStatus` is either "Success" or "Failed"
- Maximum 30 attempts (60 seconds total)

### 4. RetrieveBooking (Only on Success)
- Only called after `GetItineraryStatus` returns "Success"
- Retrieves complete booking details including PNR
- Stores booking data in localStorage

### 5. Success/Error Handling
- On success: Navigate to payment success page with complete booking details
- On failure: Navigate to payment error page with error message

## API Endpoints

### GetItineraryStatus
- **URL:** `POST /api/flights/get-itinerary-status`
- **Purpose:** Check booking status during processing
- **Response:** Status with polling instructions

### RetrieveBooking
- **URL:** `POST /api/flights/retrieve-booking`
- **Purpose:** Get complete booking details after successful processing
- **Response:** Complete booking information including PNR, passenger details, etc.

## Expected Response Structure

### GetItineraryStatus Response
```json
{
    "success": true,
    "data": {
        "CurrentStatus": "Success|Failed|InProgress",
        "TransactionID": 250034496,
        // ... other status fields
    },
    "status": "SUCCESS|FAILED|IN_PROGRESS",
    "shouldPoll": true|false
}
```

### RetrieveBooking Response
```json
{
    "success": true,
    "data": {
        "TUI": "6d1be68f-c7c5-4303-8637-b034c762d206|...",
        "TransactionID": 250034496,
        "NetAmount": 10982.00,
        "GrossAmount": 11559.0,
        "From": "BOM",
        "To": "DEL",
        "FromName": "Chhatrapati Shivaji |Mumbai",
        "ToName": "Indira Gandhi International |New Delhi",
        "OnwardDate": "2025-08-18",
        "Trips": [
            {
                "Journey": [
                    {
                        "Segments": [
                            {
                                "Flight": {
                                    "APNR": "O5Z5FR",
                                    "FlightNo": "5243",
                                    // ... complete flight details
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        "Pax": [
            {
                "ID": 27167,
                "Title": "Mr",
                "FName": "Devaraj",
                "LName": "raj",
                // ... complete passenger details
            }
        ],
        "ContactInfo": [
            {
                "Title": "MR",
                "FName": "Benzy",
                "LName": "Infotech",
                // ... complete contact details
            }
        ],
        "Code": "200",
        "Msg": ["Success"]
    }
}
```

## Testing

A test script has been created (`test_booking_flow.js`) to verify the complete flow:

```bash
node test_booking_flow.js
```

This script tests:
1. Individual API endpoints
2. Complete polling flow
3. Error handling
4. Response structure validation

## Key Benefits

1. **Proper Polling:** Ensures GetItineraryStatus is called repeatedly until completion
2. **Complete Data:** RetrieveBooking only called after successful status
3. **Error Handling:** Proper error messages and fallback mechanisms
4. **Data Persistence:** Booking details stored in localStorage for immediate access
5. **User Experience:** Clear status updates and proper navigation

## Troubleshooting

### Common Issues

1. **Polling Timeout:** Increase `maxAttempts` in `pollBookingStatus` function
2. **Incomplete Response:** Check if `CurrentStatus` field is present in GetItineraryStatus response
3. **Missing PNR:** Ensure RetrieveBooking is only called after GetItineraryStatus returns "Success"
4. **Data Not Persisting:** Verify localStorage is working and booking data is properly stored

### Debug Steps

1. Check browser console for detailed logging
2. Verify API responses in Network tab
3. Check localStorage for stored booking data
4. Use test script to validate API endpoints
5. Review server logs for backend errors 