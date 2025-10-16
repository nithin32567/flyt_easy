// Test script to verify the new combined hotel search API
const axios = require('axios');

const testCombinedHotelSearchAPI = async () => {
  try {
    console.log('Testing Combined Hotel Search API...');
    
    // Test parameters
    const baseUrl = 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/hotel/search-with-rates-content`;
    
    // Sample payload based on the Postman collection
    const payload = {
      geoCode: {
        lat: "9.961343",
        long: "76.29705"
      },
      locationId: "7381",
      currency: "INR",
      culture: "en-US",
      checkIn: "01/24/2024",
      checkOut: "01/25/2024",
      rooms: [
        {
          adults: "1",
          children: "0",
          childAges: []
        }
      ],
      agentCode: "14005",
      destinationCountryCode: "IN",
      nationality: "IN",
      countryOfResidence: "IN",
      channelId: "b2bIndiaDeals",
      affiliateRegion: "B2B_India",
      segmentId: "",
      companyId: "1",
      gstPercentage: 0,
      tdsPercentage: 0
    };
    
    console.log('API URL:', apiUrl);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Data:', JSON.stringify(response.data, null, 2));
    
    // Verify the response structure
    if (response.data.status === 'success') {
      console.log('✅ Response status is success');
    }
    
    if (response.data.searchId) {
      console.log('✅ Search ID received:', response.data.searchId);
    }
    
    if (response.data.init) {
      console.log('✅ Init data received');
    }
    
    if (response.data.rates) {
      console.log('✅ Rates data received');
    }
    
    if (response.data.content) {
      console.log('✅ Content data received');
    }
    
    if (response.data.filterData) {
      console.log('✅ Filter data received');
    }
    
  } catch (error) {
    console.log('❌ API Error:', error.message);
    if (error.response) {
      console.log('❌ Error Status:', error.response.status);
      console.log('❌ Error Data:', error.response.data);
    }
  }
};

// Run the test
testCombinedHotelSearchAPI();
