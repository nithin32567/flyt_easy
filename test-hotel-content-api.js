// Test script to verify hotel content API endpoint
const axios = require('axios');

const testHotelContentAPI = async () => {
  try {
    console.log('=== TESTING HOTEL CONTENT API ===');
    
    // Test parameters - use the searchId from the terminal output
    const searchId = '3f0b9d5d-e2cd-4c7a-88a0-2449ea5d741a'; // From the terminal output
    const hotelId = 'test-hotel-id';
    const baseUrl = 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/hotel/content/${searchId}/${hotelId}`;
    
    console.log('API URL:', apiUrl);
    console.log('Search ID:', searchId);
    console.log('Hotel ID:', hotelId);
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ API Error:', error.message);
    if (error.response) {
      console.log('❌ Error Status:', error.response.status);
      console.log('❌ Error Data:', error.response.data);
    }
  }
};

// Test the hotel API test endpoint first
const testHotelAPI = async () => {
  try {
    console.log('=== TESTING HOTEL API TEST ENDPOINT ===');
    const response = await axios.get('http://localhost:3000/api/hotel/test');
    console.log('✅ Hotel API Test Response:', response.data);
  } catch (error) {
    console.log('❌ Hotel API Test Error:', error.message);
  }
};

// Run the tests
const runTests = async () => {
  await testHotelAPI();
  console.log('\n');
  await testHotelContentAPI();
};

runTests();
