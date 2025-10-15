const axios = require('axios');

// Test the updated hotel pricing API endpoint
async function testHotelPricingAPI() {
  const baseURL = 'http://localhost:5000/api/hotel';
  
  // Test parameters - replace with actual values from your previous API calls
  const searchId = 'your-search-id-here';
  const hotelId = '15254729'; // Example from the sample response
  const providerName = 'Agoda'; // Example from the sample response
  const recommendationId = '4452e3d6-3550-4230-b3e1-8e59183aecd6'; // Example from the sample response
  
  // You'll need to get this from your authentication flow
  const authToken = 'your-auth-token-here';
  
  try {
    console.log('=== TESTING HOTEL PRICING API ===');
    console.log('Endpoint:', `${baseURL}/pricing/${searchId}/${hotelId}/${providerName}/${recommendationId}`);
    console.log('Method: GET');
    console.log('Authorization: Bearer', authToken ? '***' : 'NOT PROVIDED');
    console.log('');
    
    const response = await axios.get(
      `${baseURL}/pricing/${searchId}/${hotelId}/${providerName}/${recommendationId}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('=== API RESPONSE SUCCESS ===');
    console.log('Status:', response.status);
    console.log('Response Data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Analyze the response structure
    if (response.data.hotelId) {
      console.log('\n=== RESPONSE ANALYSIS ===');
      console.log('Hotel ID:', response.data.hotelId);
      console.log('Price ID:', response.data.priceId);
      console.log('Status:', response.data.status);
      console.log('Is Potential Suspect:', response.data.isPotentialSuspect);
      
      if (response.data.roomGroup && Array.isArray(response.data.roomGroup)) {
        console.log('\nRoom Groups:');
        response.data.roomGroup.forEach((room, index) => {
          console.log(`\nRoom Group ${index + 1}:`);
          console.log('  ID:', room.id);
          console.log('  Availability:', room.availability);
          console.log('  Provider:', room.providerName);
          console.log('  Base Rate:', room.baseRate);
          console.log('  Total Rate:', room.totalRate);
          console.log('  Published Rate:', room.publishedRate);
          console.log('  Refundable:', room.refundable);
          console.log('  Card Required:', room.cardRequired);
          
          if (room.room) {
            console.log('  Room Name:', room.room.name);
            console.log('  Room ID:', room.room.id);
          }
          
          if (room.taxes && Array.isArray(room.taxes)) {
            console.log('  Taxes:');
            room.taxes.forEach(tax => {
              console.log(`    ${tax.description}: ${tax.amount}`);
            });
          }
          
          if (room.cancellationPolicies && Array.isArray(room.cancellationPolicies)) {
            console.log('  Cancellation Policies:', room.cancellationPolicies.length);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('=== API TEST ERROR ===');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

// Instructions for running the test
console.log('=== HOTEL PRICING API TEST ===');
console.log('');
console.log('To test the updated pricing endpoint:');
console.log('1. Make sure your server is running on localhost:5000');
console.log('2. Update the test parameters above with actual values:');
console.log('   - searchId: Get this from your hotel search init response');
console.log('   - hotelId: Get this from your hotel rates response');
console.log('   - providerName: Get this from your hotel rates response (e.g., "Agoda")');
console.log('   - recommendationId: Get this from your hotel rates response');
console.log('   - authToken: Get this from your authentication flow');
console.log('');
console.log('3. Run: node test-hotel-pricing-api.js');
console.log('');
console.log('Expected endpoint structure:');
console.log('GET /api/hotel/pricing/:searchId/:hotelId/:providerName/:recommendationId');
console.log('');

// Uncomment the line below to run the test
// testHotelPricingAPI();
