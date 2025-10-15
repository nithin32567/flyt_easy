const axios = require('axios');

// Test the hotel itinerary creation API
async function testHotelItineraryAPI() {
  try {
    console.log('=== Testing Hotel Itinerary Creation API ===');
    
    const baseUrl = 'http://localhost:3000';
    
    // First, get the signature token
    console.log('1. Getting signature token...');
    const signatureResponse = await axios.get(`${baseUrl}/api/signature`);
    const token = signatureResponse.data.token;
    console.log('Token received:', token ? 'Present' : 'Missing');
    
    if (!token) {
      throw new Error('No token received from signature API');
    }
    
    // Test payload based on the sample provided
    const itineraryPayload = {
      "TUI": "281e2665-5219-488a-9211-a5a250c9b7be",
      "ServiceEnquiry": "",
      "ContactInfo": {
        "Title": "Ms",
        "FName": "REXY",
        "LName": "RAJU",
        "Mobile": "1234123412",
        "Email": "test@test.com",
        "Address": "AKBAR ONLINE BOOKING COMPANY PVT LTD",
        "State": "Maharashtra",
        "City": "Near Crawford market Mumbai",
        "PIN": "400003",
        "GSTCompanyName": "",
        "GSTTIN": "",
        "GSTMobile": "",
        "GSTEmail": "",
        "UpdateProfile": true,
        "IsGuest": false,
        "CountryCode": "IN",
        "MobileCountryCode": "+91",
        "NetAmount": "1637"
      },
      "Auxiliaries": [
        {
          "Code": "PROMO",
          "Parameters": [
            {
              "Type": "Code",
              "Value": ""
            },
            {
              "Type": "ID",
              "Value": ""
            },
            {
              "Type": "Amount",
              "Value": ""
            }
          ]
        }
      ],
      "Rooms": [
        {
          "RoomId": "cf243f1f-151f-4a73-9b04-7dbd1a804b51",
          "GuestCode": "|1|1:A:25|",
          "SupplierName": "Fab",
          "RoomGroupId": "6878352d-956a-4c5b-9812-882b3f725335",
          "Guests": [
            {
              "GuestID": "YGVj",
              "Operation": "U",
              "Title": "Ms",
              "FirstName": "REXY",
              "MiddleName": "",
              "LastName": "RAJU",
              "MobileNo": "",
              "PaxType": "A",
              "Age": "",
              "Email": "",
              "Pan": ""
            }
          ]
        }
      ],
      "NetAmount": "1637",
      "ClientID": "Duh0NJDTryMpAfQvqvWnPw==",
      "DeviceID": "",
      "AppVersion": "",
      "SearchId": "36c42725-fcf0-4faf-8ad8-7f9b21368c45",
      "RecommendationId": "aab02f5b-b699-42c2-9ed7-65712d93400c",
      "LocationName": null,
      "HotelCode": "15402936",
      "CheckInDate": "2021-03-04",
      "CheckOutDate": "2021-03-05",
      "TravelingFor": "NTF"
    };
    
    console.log('2. Creating hotel itinerary...');
    console.log('Payload:', JSON.stringify(itineraryPayload, null, 2));
    
    const response = await axios.post(`${baseUrl}/api/hotel/create-itinerary`, itineraryPayload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('=== ITINERARY CREATION SUCCESS ===');
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.TransactionID) {
      console.log('✅ Transaction ID:', response.data.TransactionID);
    }
    if (response.data.TUI) {
      console.log('✅ TUI:', response.data.TUI);
    }
    if (response.data.NetAmount) {
      console.log('✅ Net Amount:', response.data.NetAmount);
    }
    if (response.data.Code) {
      console.log('✅ Code:', response.data.Code);
    }
    if (response.data.Msg) {
      console.log('✅ Messages:', response.data.Msg);
    }
    
    console.log('=== END TEST SUCCESS ===');
    
  } catch (error) {
    console.error('=== TEST FAILED ===');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    
    console.error('=== END TEST FAILED ===');
  }
}

// Run the test
testHotelItineraryAPI();
