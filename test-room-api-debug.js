const axios = require('axios');
require('dotenv').config();

const testRoomApi = async () => {
  try {
    console.log('=== ROOM API DEBUG TEST ===');
    
    // Replace these with actual values from your request
    const searchId = 'YOUR_SEARCH_ID';
    const hotelId = 'YOUR_HOTEL_ID';
    const authToken = 'YOUR_AUTH_TOKEN';
    const searchTracingKey = 'YOUR_SEARCH_TRACING_KEY';
    const userSessionKey = 'YOUR_USER_SESSION_KEY';
    
    const baseUrl = process.env.HOTEL_URL;
    console.log('Base URL:', baseUrl);
    
    if (!baseUrl) {
      console.error('❌ HOTEL_URL not configured in environment');
      return;
    }
    
    const headers = {
      'Authorization': authToken,
      'Content-Type': 'application/json'
    };
    
    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }
    
    if (userSessionKey) {
      headers['user-session-key'] = userSessionKey;
    }
    
    console.log('Headers:', JSON.stringify(headers, null, 2));
    
    // Test Content API
    console.log('\n--- Testing Content API ---');
    const contentUrl = `${baseUrl}/api/hotels/${searchId}/${hotelId}/content`;
    console.log('Content API URL:', contentUrl);
    
    try {
      const contentResponse = await axios.get(contentUrl, { headers });
      console.log('✅ Content API Success');
      console.log('Status:', contentResponse.status);
      console.log('Data keys:', Object.keys(contentResponse.data));
    } catch (contentError) {
      console.error('❌ Content API Failed');
      console.error('Status:', contentError.response?.status);
      console.error('Message:', contentError.message);
      console.error('Response data:', contentError.response?.data);
    }
    
    // Test Rooms API
    console.log('\n--- Testing Rooms API ---');
    const roomsUrl = `${baseUrl}/api/hotels/search/result/${searchId}/${hotelId}/rooms`;
    console.log('Rooms API URL:', roomsUrl);
    
    try {
      const roomsResponse = await axios.get(roomsUrl, { headers });
      console.log('✅ Rooms API Success');
      console.log('Status:', roomsResponse.status);
      console.log('Data keys:', Object.keys(roomsResponse.data));
    } catch (roomsError) {
      console.error('❌ Rooms API Failed');
      console.error('Status:', roomsError.response?.status);
      console.error('Message:', roomsError.message);
      console.error('Response data:', roomsError.response?.data);
      console.error('Response headers:', roomsError.response?.headers);
    }
    
    // Test with different header combinations
    console.log('\n--- Testing with minimal headers ---');
    const minimalHeaders = {
      'Authorization': authToken,
      'Content-Type': 'application/json'
    };
    
    try {
      const roomsResponseMinimal = await axios.get(roomsUrl, { headers: minimalHeaders });
      console.log('✅ Rooms API with minimal headers - Success');
      console.log('Status:', roomsResponseMinimal.status);
    } catch (roomsErrorMinimal) {
      console.error('❌ Rooms API with minimal headers - Failed');
      console.error('Status:', roomsErrorMinimal.response?.status);
      console.error('Message:', roomsErrorMinimal.message);
      console.error('Response data:', roomsErrorMinimal.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testRoomApi();

