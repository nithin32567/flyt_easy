// Test script to verify hotel content API
const axios = require('axios');

const testHotelContentAPI = async () => {
  try {
    console.log('Testing Hotel Content API...');
    
    // Test parameters
    const searchId = 'test-search-id';
    const hotelId = 'test-hotel-id';
    const baseUrl = 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/hotel/content/${searchId}/${hotelId}`;
    
    console.log('API URL:', apiUrl);
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Data:', response.data);
    
  } catch (error) {
    console.log('❌ API Error:', error.message);
    if (error.response) {
      console.log('❌ Error Status:', error.response.status);
      console.log('❌ Error Data:', error.response.data);
    }
  }
};

// Run the test
testHotelContentAPI();
