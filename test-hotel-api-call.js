const axios = require('axios');

const testHotelApiCall = async () => {
  try {
    console.log('=== TESTING HOTEL API CALL ===');
    
    // Replace with actual values from your localStorage
    const searchId = 'YOUR_SEARCH_ID_HERE';
    const hotelId = 'YOUR_HOTEL_ID_HERE';
    const token = 'YOUR_TOKEN_HERE';
    const searchTracingKey = 'YOUR_SEARCH_TRACING_KEY_HERE';
    
    const baseUrl = 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/hotel/details/${searchId}/${hotelId}`;
    
    console.log('API URL:', apiUrl);
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'search-tracing-key': searchTracingKey || ''
      }
    });
    
    console.log('✅ API Call Successful');
    console.log('Response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));
    console.log('API Status:', response.data.apiStatus);
    
  } catch (error) {
    console.error('❌ API Call Failed');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

// Instructions for the user
console.log('=== INSTRUCTIONS ===');
console.log('1. First, perform a hotel search in your frontend');
console.log('2. Open browser dev tools and check localStorage for:');
console.log('   - hotelSearchId');
console.log('   - searchTracingKey');
console.log('   - token');
console.log('3. Replace the placeholder values in this script with actual values');
console.log('4. Run: node test-hotel-api-call.js');
console.log('5. Check the server console for detailed debug logs');
console.log('');

// Uncomment the line below after updating the values
// testHotelApiCall();

