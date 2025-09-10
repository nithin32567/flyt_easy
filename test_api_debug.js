#!/usr/bin/env node

/**
 * API Debug Test Script
 * This script helps debug the GetItineraryStatus and RetrieveBooking API calls
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.VITE_BASE_URL || 'http://localhost:3000';
const FLIGHT_URL = process.env.FLIGHT_URL;

console.log('🔍 API Debug Test Script');
console.log('========================');
console.log('Base URL:', BASE_URL);
console.log('Flight URL:', FLIGHT_URL);
console.log('');

// Test data from the sample files
const testData = {
    TUI: "7008dcf5-a91c-4a7d-80ba-989e6792df0c|c3aa7083-bcc5-4f96-bb5a-2f906c05eb7f|20250410124031",
    TransactionID: 250029840,
    ClientID: "FVI6V120g22Ei5ztGK0FIQ=="
};

async function testGetItineraryStatus() {
    console.log('🧪 Testing GetItineraryStatus API...');
    console.log('Payload:', testData);
    
    try {
        const response = await axios.post(`${BASE_URL}/api/flights/get-itinerary-status`, {
            TUI: testData.TUI,
            TransactionID: testData.TransactionID
        }, {
            headers: {
                "Authorization": "Bearer test-token",
                "Content-Type": "application/json"
            }
        });
        
        console.log('✅ GetItineraryStatus Response:');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.log('❌ GetItineraryStatus Error:');
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
        console.log('Message:', error.message);
        return null;
    }
}

async function testRetrieveBooking() {
    console.log('\n🧪 Testing RetrieveBooking API...');
    console.log('Payload:', testData);
    
    try {
        const response = await axios.post(`${BASE_URL}/api/flights/retrieve-booking`, {
            TUI: testData.TUI,
            ReferenceNumber: testData.TransactionID,
            ReferenceType: "T",
            ClientID: testData.ClientID
        }, {
            headers: {
                "Authorization": "Bearer test-token",
                "Content-Type": "application/json"
            }
        });
        
        console.log('✅ RetrieveBooking Response:');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.log('❌ RetrieveBooking Error:');
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
        console.log('Message:', error.message);
        return null;
    }
}

async function testExternalAPI() {
    console.log('\n🧪 Testing External Flight API...');
    
    if (!FLIGHT_URL) {
        console.log('❌ FLIGHT_URL not configured');
        return;
    }
    
    try {
        // Test GetItineraryStatus
        console.log('Testing external GetItineraryStatus...');
        const statusResponse = await axios.post(`${FLIGHT_URL}/Payment/GetItineraryStatus`, {
            TUI: testData.TUI,
            TransactionID: testData.TransactionID
        }, {
            headers: {
                "Authorization": "Bearer test-token",
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        
        console.log('✅ External GetItineraryStatus Response:');
        console.log('Status:', statusResponse.status);
        console.log('Data:', JSON.stringify(statusResponse.data, null, 2));
        
        // Test RetrieveBooking
        console.log('\nTesting external RetrieveBooking...');
        const retrieveResponse = await axios.post(`${FLIGHT_URL}/Utils/RetrieveBooking`, {
            ReferenceType: "T",
            TUI: testData.TUI,
            ReferenceNumber: testData.TransactionID,
            ClientID: testData.ClientID
        }, {
            headers: {
                "Authorization": "Bearer test-token",
                "Content-Type": "application/json"
            }
        });
        
        console.log('✅ External RetrieveBooking Response:');
        console.log('Status:', retrieveResponse.status);
        console.log('Data:', JSON.stringify(retrieveResponse.data, null, 2));
        
    } catch (error) {
        console.log('❌ External API Error:');
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
        console.log('Message:', error.message);
    }
}

async function runTests() {
    console.log('Starting API tests...\n');
    
    // Test internal APIs
    await testGetItineraryStatus();
    await testRetrieveBooking();
    
    // Test external APIs
    await testExternalAPI();
    
    console.log('\n🏁 Tests completed!');
}

// Run the tests
runTests().catch(console.error);
