import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// API Endpoints Configuration
const HOTEL_UTILS_URL = process.env.HOTEL_UTILS_URL || 'https://b2bapiutils.benzyinfotech.com';
const HOTEL_SEARCH_URL = process.env.HOTEL_SEARCH_URL || 'https://travelportalapi.benzyinfotech.com';
const HOTEL_ITINERARY_URL = process.env.HOTEL_ITINERARY_URL || 'https://b2bapihotels.benzyinfotech.com';
const HOTEL_BOOKING_URL = process.env.HOTEL_BOOKING_URL || 'https://b2bapiflights.benzyinfotech.com';

export const autosuggest = async (req, res) => {
  try {
    const { term } = req.query;

    // Using HOTEL_SEARCH_URL constant

    const response = await axios.get(`https://travelportal.akbartravels.com/api/content/autosuggest`, {
      
      params: { term },
    });
    console.log(term,"term ============================================> term")
    // console.log(response.data);
    const data = response.data;
    console.log(data, "data ============================================> autosuggest data")
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const initHotelSearch = async (req, res) => {
  console.log('=== BACKEND: HOTEL INIT REQUEST ===');
  console.log('Hotel Init Payload ===>');
  console.log(JSON.stringify(req.body, null, 2));
  console.log('=== END HOTEL INIT PAYLOAD ===');
  
  try {
    const payload = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    // Validate and fix payload structure for rooms with children
    if (payload.rooms && Array.isArray(payload.rooms)) {
      console.log('=== ROOM VALIDATION ===');
      console.log('Original rooms:', JSON.stringify(payload.rooms, null, 2));

      payload.rooms = payload.rooms.map((room, index) => {
        console.log(`Processing room ${index + 1}:`, JSON.stringify(room, null, 2));

        // Ensure adults and children are strings
        const adults = parseInt(room.adults) || 1;
        const children = parseInt(room.children) || 0;

        // Validate adults count (minimum 1, maximum 4)
        if (adults < 1 || adults > 4) {
          console.warn(`Invalid adults count: ${adults} for room ${index + 1}, defaulting to "1"`);
          room.adults = "1";
        } else {
          room.adults = String(adults);
        }

        // Validate children count (maximum 3)
        if (children < 0 || children > 3) {
          console.warn(`Invalid children count: ${children} for room ${index + 1}, defaulting to "0"`);
          room.children = "0";
        } else {
          room.children = String(children);
        }

        // Handle childAges array
        if (parseInt(room.children) > 0) {
          if (!room.childAges || !Array.isArray(room.childAges)) {
            console.warn(`No childAges array for room ${index + 1} with ${room.children} children, creating default ages`);
            room.childAges = Array(parseInt(room.children)).fill("5");
          } else {
            // Ensure childAges are strings, not numbers
            room.childAges = room.childAges.map((age, ageIndex) => {
              const strAge = String(age);
              const numAge = parseInt(age);
              if (isNaN(numAge) || numAge < 0 || numAge > 17) {
                console.warn(`Invalid child age: ${age} for room ${index + 1}, child ${ageIndex + 1}, defaulting to "5"`);
                return "5";
              }
              return strAge;
            });

            // Validate that childAges array length matches children count
            if (room.childAges.length !== parseInt(room.children)) {
              console.warn(`Child ages count (${room.childAges.length}) doesn't match children count (${room.children}) for room ${index + 1}`);
              // Pad with default age "5" if needed, or truncate if too many
              if (room.childAges.length < parseInt(room.children)) {
                while (room.childAges.length < parseInt(room.children)) {
                  room.childAges.push("5");
                }
              } else {
                room.childAges = room.childAges.slice(0, parseInt(room.children));
              }
            }
          }
        } else {
          // No children, ensure childAges is empty or undefined
          room.childAges = [];
        }

        console.log(`Processed room ${index + 1}:`, JSON.stringify(room, null, 2));
        return room;
      });

      console.log('=== ROOM VALIDATION COMPLETE ===');
      console.log('Validated rooms:', JSON.stringify(payload.rooms, null, 2));
    }

    console.log('=== HOTEL INIT API CALL ===');
    console.log('Original Payload:', JSON.stringify(req.body, null, 2));
    console.log('Validated Payload:', JSON.stringify(payload, null, 2));

    // Using HOTEL_SEARCH_URL constant
    const initResponse = await axios.post(`${HOTEL_SEARCH_URL}/api/hotels/search/init`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    console.log('=== BACKEND: HOTEL INIT RESPONSE ===');
    console.log('Hotel Init Response JSON ===>');
    console.log(JSON.stringify(initResponse.data, null, 2));
    console.log('=== END HOTEL INIT RESPONSE ===');

    const initData = initResponse.data;

    if (!initData.searchId) {
      console.error('=== INIT API FAILED - NO SEARCH ID ===');
      console.error('Response data:', JSON.stringify(initData, null, 2));
      return res.status(400).json({
        message: "Search ID not received from init API",
        status: 400,
        details: initData,
        validatedPayload: payload
      });
    }

    const response = {
      status: 'success',
      init: initData,
      searchId: initData.searchId,
      searchTracingKey: initData.searchTracingKey,
      timestamp: new Date().toISOString()
    };

    console.log('=== BACKEND: HOTEL INIT RESPONSE TO CLIENT ===');
    console.log('Hotel Init Response to Client JSON ===>');
    console.log(JSON.stringify(response, null, 2));
    console.log('=== END HOTEL INIT RESPONSE TO CLIENT ===');

    res.status(200).json(response);

  } catch (error) {
    console.error('=== INIT API ERROR ===');
    console.error('Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Stack:', error.stack);

    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Response Headers:', JSON.stringify(error.response.headers, null, 2));

      // Check for specific room configuration errors
      const errorData = error.response.data;
      let errorMessage = errorData?.message || error.message;
      let statusCode = error.response.status;

      if (errorData && typeof errorData === 'object') {
        // Check for room-related errors
        if (errorData.message && errorData.message.toLowerCase().includes('room')) {
          errorMessage = 'Room configuration error: ' + errorData.message;
          statusCode = 422; // Unprocessable Entity
        } else if (errorData.message && errorData.message.toLowerCase().includes('child')) {
          errorMessage = 'Child age configuration error: ' + errorData.message;
          statusCode = 422;
        } else if (errorData.message && errorData.message.toLowerCase().includes('adult')) {
          errorMessage = 'Adult count configuration error: ' + errorData.message;
          statusCode = 422;
        }
      }

      return res.status(statusCode).json({
        message: errorMessage,
        status: statusCode,
        data: errorData,
        originalPayload: req.body,
        validatedPayload: payload
      });
    } else if (error.request) {
      console.error('Request Error - No response received');
      console.error('Request Details:', error.request);
      return res.status(503).json({
        message: "External hotel API is not available",
        status: 503,
        originalPayload: req.body
      });
    } else {
      console.error('Unknown Error:', error);
      return res.status(500).json({
        message: error.message,
        status: 500,
        originalPayload: req.body
      });
    }
  }
};
export const fetchHotelContentAndRates = async (req, res) => {
  console.log('=== BACKEND: HOTEL CONTENT AND RATES REQUEST ===');
  console.log('Hotel Content and Rates Payload ===>');
  console.log(JSON.stringify({
    searchId: req.params.searchId,
    page: req.query.page,
    limit: req.query.limit,
    searchTracingKey: req.headers['search-tracing-key']
  }, null, 2));
  console.log('=== END HOTEL CONTENT AND RATES PAYLOAD ===');
  
  try {
    const { searchId } = req.params;
    const authHeader = req.headers.authorization;
    const { page = 1, limit = 50 } = req.query;
    const searchTracingKey = req.headers['search-tracing-key'];

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    if (!searchId) {
      return res.status(400).json({
        message: "Search ID is required",
        status: 400
      });
    }

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };
    console.log(headers, "headers ============================================> fetchHotelContentAndRates headers")
    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    console.log('=== HOTEL CONTENT & RATES API CALL ===');
    console.log('Search ID:', searchId);
    console.log('Search Tracing Key:', searchTracingKey);
    console.log('Page:', page, 'Limit:', limit);

    // Poll Rate API until search status is completed
    const pollRateAPI = async (searchId, headers, maxAttempts = 10, delayMs = 2000) => {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`=== RATE API POLLING ATTEMPT ${attempt}/${maxAttempts} ===`);
          const response = await axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/rate`, {
            headers: headers
          });
          
          const ratesData = response.data;
          console.log(`Rate API Response - Search Status: ${ratesData.searchStatus}`);
          
          if (ratesData.searchStatus === 'completed' || ratesData.searchStatus === 'success') {
            console.log('=== RATE API COMPLETED ===');
            return { success: true, data: ratesData };
          }
          
          if (attempt < maxAttempts) {
            console.log(`Search still in progress, waiting ${delayMs}ms before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
        } catch (error) {
          console.error(`Rate API polling attempt ${attempt} failed:`, error.message);
          if (attempt === maxAttempts) {
            return { success: false, error: error.message };
          }
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
      
      console.warn('Rate API polling reached maximum attempts without completion');
      return { success: false, error: 'Maximum polling attempts reached' };
    };

    // Poll rates API and get content in parallel
    const [ratesPollResult, contentResponse] = await Promise.allSettled([
      pollRateAPI(searchId, headers),
      axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/content?limit=${limit}&offset=${(page - 1) * limit}&filterdata=false`, {
        headers: headers
      })
    ]);

    let ratesData = null;
    if (ratesPollResult.status === 'fulfilled' && ratesPollResult.value.success) {
      ratesData = ratesPollResult.value.data;
      console.log('=== RATES API RESPONSE (POLLED) ===');
      console.log('Status:', ratesData.searchStatus);
      console.log('Total Hotels:', ratesData.hotels?.length || 0);
    } else {
      console.error('=== RATES API POLLING ERROR ===');
      if (ratesPollResult.status === 'fulfilled') {
        console.error('Polling failed:', ratesPollResult.value.error);
      } else {
        console.error('Polling error:', ratesPollResult.reason?.message);
      }
    }

    let contentData = null;
    if (contentResponse.status === 'fulfilled') {
      contentData = contentResponse.value.data;
      // console.log('=== CONTENT API RESPONSE ===');
      // console.log('Status:', contentResponse.value.status);
      // console.log('Data: contentData', JSON.stringify(contentData, null, 2));
    } else {
      // console.error('=== CONTENT API ERROR ===');
      console.error('Error:', contentResponse.reason?.message);
    }

    let filterData = null;
    if (ratesPollResult.status === 'fulfilled' && ratesPollResult.value.success) {
      try {
        const filterResponse = await axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/filterdata`, {
          headers: headers
        });
        filterData = filterResponse.data;
        console.log('=== FILTER DATA RESPONSE ===');
        console.log('Filter data retrieved successfully');
      } catch (filterError) {
        console.error('Filter data error:', filterError.message);
      }
    }

    const combinedResponse = {
      status: 'success',
      rates: ratesData,
      content: contentData,
      filterData: filterData,
      searchId: searchId,
      searchTracingKey: searchTracingKey,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: contentData?.total || 0,
        totalPages: Math.ceil((contentData?.total || 0) / limit)
      },
      timestamp: new Date().toISOString()
    };

    console.log('=== BACKEND: HOTEL CONTENT AND RATES RESPONSE TO CLIENT ===');
    console.log('Hotel Content and Rates Response to Client JSON ===>');
    console.log(JSON.stringify(combinedResponse, null, 2));
    console.log('=== END HOTEL CONTENT AND RATES RESPONSE TO CLIENT ===');

    res.status(200).json(combinedResponse);

  } catch (error) {
    console.error('=== CONTENT & RATES API ERROR ===');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
      return res.status(error.response.status).json({
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      return res.status(503).json({
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      return res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  }
};
export const fetchHotelPage = async (req, res) => {
  console.log('=== BACKEND: HOTEL PAGE REQUEST ===');
  console.log('Hotel Page Payload ===>');
  console.log(JSON.stringify({
    searchId: req.query.searchId,
    page: req.query.page,
    limit: req.query.limit,
    searchTracingKey: req.headers['search-tracing-key']
  }, null, 2));
  console.log('=== END HOTEL PAGE PAYLOAD ===');
  
  try {
    const { searchId, page = 1, limit = 50 } = req.query;
    const authHeader = req.headers.authorization;
    const searchTracingKey = req.headers['search-tracing-key'];

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    if (!searchId) {
      return res.status(400).json({
        message: "Search ID is required",
        status: 400
      });
    }

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    console.log('=== HOTEL PAGE API CALL ===');
    console.log('Search ID:', searchId);
    console.log('Page:', page, 'Limit:', limit);
    console.log('Search Tracing Key:', searchTracingKey);

    // Using HOTEL_SEARCH_URL constant
    const contentResponse = await axios.get(
      `${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/content?limit=${limit}&offset=${(page - 1) * limit}&filterdata=false`,
      { headers }
    );

    console.log('=== BACKEND: HOTEL PAGE RESPONSE ===');
    console.log('Hotel Page Response JSON ===>');
    console.log(JSON.stringify(contentResponse.data, null, 2));
    console.log('=== END HOTEL PAGE RESPONSE ===');

    const contentData = contentResponse.data;

    const response = {
      status: 'success',
      content: contentData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: contentData?.total || 0,
        totalPages: Math.ceil((contentData?.total || 0) / limit)
      },
      timestamp: new Date().toISOString()
    };

    console.log('=== BACKEND: HOTEL PAGE RESPONSE TO CLIENT ===');
    console.log('Hotel Page Response to Client JSON ===>');
    console.log(JSON.stringify(response, null, 2));
    console.log('=== END HOTEL PAGE RESPONSE TO CLIENT ===');

    res.status(200).json(response);

  } catch (error) {
    console.error('=== HOTEL PAGE API ERROR ===');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
      return res.status(error.response.status).json({
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      return res.status(503).json({
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      return res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  }
};
export const fetchHotelDetailsWithContentAndRooms = async (req, res) => {
  console.log('=== BACKEND: HOTEL DETAILS REQUEST ===');
  console.log('Hotel Details Payload ===>');
  console.log(JSON.stringify({
    searchId: req.params.searchId,
    hotelId: req.params.hotelId,
    priceProvider: req.query.priceProvider,
    searchTracingKey: req.headers['search-tracing-key']
  }, null, 2));
  console.log('=== END HOTEL DETAILS PAYLOAD ===');
  
  try {
    const { searchId, hotelId } = req.params;
    const { priceProvider } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    if (!searchId || !hotelId) {
      return res.status(400).json({
        message: "Search ID and Hotel ID are required",
        status: 400
      });
    }

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    const searchTracingKey = req.headers['search-tracing-key'];
    console.log(searchTracingKey, "searchTracingKey ============================================>")
    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    // Using HOTEL_SEARCH_URL constant
    // Build content API URL with priceProvider if provided
    let contentUrl = `${HOTEL_SEARCH_URL}/api/hotels/${searchId}/${hotelId}/content`;
    if (priceProvider) {
      contentUrl += `?priceProvider=${priceProvider}`;
    }

    console.log('=== HOTEL DETAILS API CALL ===');
    console.log('Search ID:', searchId);
    console.log('Hotel ID:', hotelId);
    console.log('Price Provider (query):', priceProvider);
    console.log('Search Tracing Key:', searchTracingKey);
    console.log('Content URL:', contentUrl);
    console.log('Rooms URL:', `${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/${hotelId}/rooms`);

    const [contentResponse, roomsResponse] = await Promise.allSettled([
      axios.get(contentUrl, {
        headers: headers
      }),
      axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/${hotelId}/rooms`, {
        headers: headers
      })
    ]);

    console.log(roomsResponse, "response of the room api")
    console.log(contentResponse, "response of the content api")

    // Process content response
    let contentData = null;
    let contentSuccess = false;
    if (contentResponse.status === 'fulfilled') {
      contentData = contentResponse.value.data;
      contentSuccess = true;
      console.log('Content API success');
      console.log('Content data structure:', JSON.stringify(contentData, null, 2));
    } else {
      console.error('Content API failed:', contentResponse.reason?.message);
      console.error('Content API error details:', contentResponse.reason?.response?.data);
    }

    // Process rooms response
    let roomsData = null;
    let roomsSuccess = false;
    let extractedPriceProvider = priceProvider; // Default to query param if provided

    if (roomsResponse.status === 'fulfilled') {
      roomsData = roomsResponse.value.data;

      // Check if the rooms data indicates an error (like code 1211)
      if (roomsData && (roomsData.code === '1211' || roomsData.status === 'failure' || roomsData.message === 'No rooms found')) {
        console.error('Rooms API returned error in response:', roomsData);
        roomsSuccess = false;
        // Keep the error data as is
      } else {
        roomsSuccess = true;
        console.log('Rooms API success');

        // Extract price provider from rooms response if not provided in query
        if (!extractedPriceProvider && roomsData && roomsData.recommendations && roomsData.recommendations.length > 0) {
          console.log('Rooms data structure:', JSON.stringify(roomsData, null, 2));
          const firstRecommendation = roomsData.recommendations[0];
          console.log('First recommendation:', JSON.stringify(firstRecommendation, null, 2));
          if (firstRecommendation.roomGroup && firstRecommendation.roomGroup.length > 0) {
            extractedPriceProvider = firstRecommendation.roomGroup[0].providerName;
            console.log('Extracted price provider from rooms response:', extractedPriceProvider);
          }
        }
      }
    } else {
      console.error('Rooms API failed:', roomsResponse.reason?.message);
      console.error('Rooms API error details:', roomsResponse.reason?.response?.data);

      // Set a proper failure response for rooms
      roomsData = {
        status: 'failure',
        code: '1211',
        message: 'No rooms found',
        response: roomsResponse,
        reason: roomsResponse.reason?.response?.data || roomsResponse.reason?.message
      };
    }

    // If we extracted a price provider and didn't have one in query, make another content call
    if (extractedPriceProvider && !priceProvider && roomsSuccess) {
      console.log('Making additional content API call with extracted price provider:', extractedPriceProvider);
      try {
        const contentUrlWithProvider = `${HOTEL_SEARCH_URL}/api/hotels/${searchId}/${hotelId}/content?priceProvider=${extractedPriceProvider}`;
        console.log('Additional content API URL:', contentUrlWithProvider);
        const additionalContentResponse = await axios.get(contentUrlWithProvider, { headers });
        contentData = additionalContentResponse.data;
        contentSuccess = true;
        console.log('Additional content API call successful with price provider');
        console.log('Additional content data structure:', JSON.stringify(contentData, null, 2));
      } catch (error) {
        console.error('Additional content API call failed:', error.message);
        console.error('Additional content API error details:', error.response?.data);
      }
    }

    // Check if both APIs failed
    if (!contentSuccess && !roomsSuccess) {
      return res.status(500).json({
        message: "Both Content and Rooms APIs failed",
        status: 500,
        searchId: searchId,
        hotelId: hotelId,
        timestamp: new Date().toISOString()
      });
    }

    // Combine responses
    const combinedResponse = {
      status: 'success',
      content: contentData,
      rooms: roomsData,
      searchId: searchId,
      hotelId: hotelId,
      searchTracingKey: searchTracingKey,
      priceProvider: extractedPriceProvider,
      timestamp: new Date().toISOString(),
      apiStatus: {
        content: contentSuccess ? 'success' : 'failed',
        rooms: roomsSuccess ? 'success' : 'failed'
      }
    };

    console.log('=== FINAL API STATUS ===');
    console.log('Content success:', contentSuccess);
    console.log('Rooms success:', roomsSuccess);
    console.log('Rooms data status:', roomsData?.status);
    console.log('Rooms data code:', roomsData?.code);
    console.log('Rooms data message:', roomsData?.message);
    console.log('Final price provider:', extractedPriceProvider);
    console.log('Content data exists:', !!contentData);
    console.log('Content data hotel exists:', !!contentData?.hotel);
    console.log('Content data hotel name:', contentData?.hotel?.name);

    console.log('=== BACKEND: HOTEL DETAILS RESPONSE TO CLIENT ===');
    console.log('Hotel Details Response to Client JSON ===>');
    console.log(JSON.stringify(combinedResponse, null, 2));
    console.log('=== END HOTEL DETAILS RESPONSE TO CLIENT ===');
    
    res.status(200).json(combinedResponse);

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      return res.status(503).json({
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      return res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  }
};
export const fetchHotelPricing = async (req, res) => {
  console.log('=== BACKEND: HOTEL PRICING REQUEST ===');
  console.log('Hotel Pricing Payload ===>');
  console.log(JSON.stringify({
    searchId: req.params.searchId,
    hotelId: req.params.hotelId,
    priceProvider: req.params.priceProvider,
    roomRecommendationId: req.params.roomRecommendationId,
    searchTracingKey: req.headers['search-tracing-key']
  }, null, 2));
  console.log('=== END HOTEL PRICING PAYLOAD ===');
  
  try {
    const { searchId, hotelId, priceProvider, roomRecommendationId } = req.params;
    const authHeader = req.headers.authorization;
    console.log('Search ID:', searchId);
    console.log('Hotel ID:', hotelId);
    console.log('Price Provider:', priceProvider);
    console.log('Room Recommendation ID:', roomRecommendationId);
    console.log('Authorization Header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      console.error('Authorization header is missing');
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    if (!searchId || !hotelId || !priceProvider || !roomRecommendationId) {
      console.error('Missing required parameters:', {
        searchId: !!searchId,
        hotelId: !!hotelId,
        priceProvider: !!priceProvider,
        roomRecommendationId: !!roomRecommendationId
      });
      return res.status(400).json({
        message: "Search ID, Hotel ID, Price Provider, and Room Recommendation ID are required",
        status: 400
      });
    }

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    const searchTracingKey = req.headers['search-tracing-key'];
    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    console.log('Request headers:', JSON.stringify(headers, null, 2));
    console.log('Search Tracing Key:', searchTracingKey);

    const pricingUrl = `${HOTEL_SEARCH_URL}/api/hotels/search/${searchId}/${hotelId}/price/${priceProvider}/${roomRecommendationId}`;
    console.log('Pricing API URL:', pricingUrl);

    // Using HOTEL_SEARCH_URL constant
    const pricingResponse = await axios.get(pricingUrl, { headers });

    console.log('=== PRICING API RESPONSE ===');
    // console.log('Status:', pricingResponse.status);
    // console.log('Headers:', JSON.stringify(pricingResponse.headers, null, 2));
    // console.log('Complete Response Data:', JSON.stringify(pricingResponse.data, null, 2));

    const pricingData = pricingResponse.data;

    const response = {
      status: 'success',
      pricing: pricingData,
      searchId: searchId,
      hotelId: hotelId,
      priceProvider: priceProvider,
      roomRecommendationId: roomRecommendationId,
      searchTracingKey: searchTracingKey,
      timestamp: new Date().toISOString()
    };

    console.log('=== BACKEND: HOTEL PRICING RESPONSE TO CLIENT ===');
    console.log('Hotel Pricing Response to Client JSON ===>');
    console.log(JSON.stringify(response, null, 2));
    console.log('=== END HOTEL PRICING RESPONSE TO CLIENT ===');

    res.status(200).json(response);

  } catch (error) {
    console.error('=== PRICING API ERROR ===');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Stack:', error.stack);

    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      return res.status(error.response.status).json({
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('Request Error - No response received');
      console.error('Request Details:', error.request);
      return res.status(503).json({
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      console.error('Unknown Error:', error);
      return res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  }
};
export const filterHotels = async (req, res) => {
  try {
    const { searchId } = req.params;
    const filters = req.body;
    const authHeader = req.headers.authorization;
    const { limit = 50, offset = 0 } = req.query;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    if (!searchId) {
      return res.status(400).json({
        message: "Search ID is required",
        status: 400
      });
    }

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    const searchTracingKey = req.headers['search-tracing-key'];
    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    console.log('=== FILTER HOTELS API CALL ===');
    // console.log('Search ID:', searchId);
    // console.log('Original Filters:', JSON.stringify(filters, null, 2));
    // console.log('Limit:', limit, 'Offset:', offset);

    // Transform filters to match external API format (based on Postman collection)
    const transformedFilters = {
      filters: {}
    };

    console.log('=== FILTER TRANSFORMATION DEBUG ===');
    // console.log('Original filters received:', JSON.stringify(filters, null, 2));

    Object.entries(filters).forEach(([key, value]) => {
      // console.log(`Processing filter: ${key} = ${JSON.stringify(value)}`);

      if (value === null || value === undefined) {
        // console.log(`Skipping null/undefined filter: ${key}`);
        return;
      }

      // Handle PriceGroup filter specifically (matches Postman format)
      if (key === 'PriceGroup' && value && typeof value === 'object') {
        if (value.min !== undefined && value.max !== undefined) {
          transformedFilters.filters.priceGroups = [{
            minPrice: value.min,
            maxPrice: value.max
          }];
          // console.log(`PriceGroup transformed: minPrice=${value.min}, maxPrice=${value.max}`);
        }
      }
      // Handle StarRating filter
      else if (key === 'StarRating' && Array.isArray(value)) {
        transformedFilters.filters.starRating = value;
        // console.log(`StarRating transformed: ${JSON.stringify(value)}`);
      }
      // Handle HotelName filter
      else if (key === 'HotelName' && typeof value === 'string') {
        transformedFilters.filters.hotelName = value;
        // console.log(`HotelName transformed: ${value}`);
      }
      // Handle Locations filter
      else if (key === 'Locations' && Array.isArray(value)) {
        transformedFilters.filters.locations = value;
        // console.log(`Locations transformed: ${JSON.stringify(value)}`);
      }
      // Handle Attraction filter
      else if (key === 'Attraction' && Array.isArray(value)) {
        transformedFilters.filters.attractions = value;
        // console.log(`Attraction transformed: ${JSON.stringify(value)}`);
      }
      // Handle Facilities filter
      else if (key === 'Facilities' && Array.isArray(value)) {
        transformedFilters.filters.facilities = value;
        // console.log(`Facilities transformed: ${JSON.stringify(value)}`);
      }
      // Handle Distance filter
      else if (key === 'Distance' && value && typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
        transformedFilters.filters.distance = {
          min: value.min,
          max: value.max
        };
        // console.log(`Distance transformed: min=${value.min}, max=${value.max}`);
      }
      // Handle other range filters
      else if (value && typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
        transformedFilters.filters[key] = {
          min: value.min,
          max: value.max
        };
        // console.log(`${key} range transformed: min=${value.min}, max=${value.max}`);
      }
      // Handle array values
      else if (Array.isArray(value)) {
        transformedFilters.filters[key] = value;
        // console.log(`${key} array transformed: ${JSON.stringify(value)}`);
      }
      // Handle primitive values
      else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        transformedFilters.filters[key] = value;
        // console.log(`${key} primitive transformed: ${value}`);
      }
      else {
        // console.log(`Unknown filter type for ${key}: ${typeof value}`);
      }
    });

    console.log('=== FILTER TRANSFORMATION COMPLETE ===');
    // console.log('Transformed filters:', JSON.stringify(transformedFilters, null, 2));

    // Using HOTEL_SEARCH_URL constant (matches Postman collection format)
    const filterResponse = await axios.post(
      `${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}?limit=${limit}&offset=${offset}`,
      transformedFilters,
      { headers }
    );

    console.log('=== FILTER HOTELS API RESPONSE ===');
    // console.log('Status:', filterResponse.status);
    // console.log('Data:', JSON.stringify(filterResponse.data, null, 2));

    const filterData = filterResponse.data;

    res.status(200).json({
      status: 'success',
      hotels: filterData,
      searchId: searchId,
      searchTracingKey: searchTracingKey,
      filters: transformedFilters,
      originalFilters: filters,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('=== FILTER HOTELS API ERROR ===');
    console.error('Error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      return res.status(503).json({
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      return res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  }
};
export const getFilterData = async (req, res) => {
  try {
    const { searchId } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    if (!searchId) {
      return res.status(400).json({
        message: "Search ID is required",
        status: 400
      });
    }

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    const searchTracingKey = req.headers['search-tracing-key'];
    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    console.log('=== GET FILTER DATA API CALL ===');
    console.log('Search ID:', searchId);

    // Using HOTEL_SEARCH_URL constant
    const filterDataResponse = await axios.get(
      `${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/filterdata`,
      { headers }
    );

    console.log('=== GET FILTER DATA API RESPONSE ===');
    console.log('Status:', filterDataResponse.status);
    console.log('Data:', JSON.stringify(filterDataResponse.data, null, 2));

    const filterData = filterDataResponse.data;

    res.status(200).json({
      status: 'success',
      filterData: filterData,
      searchId: searchId,
      searchTracingKey: searchTracingKey,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('=== GET FILTER DATA API ERROR ===');
    console.error('Error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      return res.status(503).json({
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      return res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  }
};
// Enhanced workflow following B2C API pattern
export const fetchHotelSearchWorkflow = async (req, res) => {
  try {
    const { searchId } = req.params;
    const authHeader = req.headers.authorization;
    const searchTracingKey = req.headers['search-tracing-key'];

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    if (!searchId) {
      return res.status(400).json({
        message: "Search ID is required",
        status: 400
      });
    }

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    console.log('=== HOTEL SEARCH WORKFLOW ===');
    console.log('Search ID:', searchId);
    console.log('Search Tracing Key:', searchTracingKey);

    // Step 1: Get Content and Rates in parallel (Availability Phase)
    console.log('=== STEP 1: AVAILABILITY PHASE ===');
    const [contentResponse, ratesResponse] = await Promise.allSettled([
      axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/content?limit=50&offset=0&filterdata=false`, {
        headers: headers
      }),
      axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/rate`, {
        headers: headers
      })
    ]);

    let contentData = null;
    let ratesData = null;

    if (contentResponse.status === 'fulfilled') {
      contentData = contentResponse.value.data;
      console.log('Content API success');
    } else {
      console.error('Content API failed:', contentResponse.reason?.message);
    }

    if (ratesResponse.status === 'fulfilled') {
      ratesData = ratesResponse.value.data;
      console.log('Rates API success');
    } else {
      console.error('Rates API failed:', ratesResponse.reason?.message);
    }

    // Step 2: Get Filter Data (only after rates are available)
    console.log('=== STEP 2: FILTER DATA PHASE ===');
    let filterData = null;
    if (ratesResponse.status === 'fulfilled') {
      try {
        const filterResponse = await axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/filterdata`, {
          headers: headers
        });
        filterData = filterResponse.data;
        console.log('Filter data API success');
      } catch (filterError) {
        console.error('Filter data error:', filterError.message);
      }
    }

    const workflowResponse = {
      status: 'success',
      workflow: 'B2C Hotel API Workflow',
      phase: 'Availability',
      content: contentData,
      rates: ratesData,
      filterData: filterData,
      searchId: searchId,
      searchTracingKey: searchTracingKey,
      timestamp: new Date().toISOString()
    };

    console.log('=== WORKFLOW RESPONSE ===');
    console.log(JSON.stringify(workflowResponse, null, 2));

    res.status(200).json(workflowResponse);

  } catch (error) {
    console.error('=== HOTEL SEARCH WORKFLOW ERROR ===');
    console.error('Error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      return res.status(503).json({
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      return res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  }
};

export const createItineraryForHotelRoom = async (req, res) => {
  console.log('=== BACKEND: HOTEL CREATE ITINERARY REQUEST ===');
  console.log('Hotel Create Itinerary Payload ===>');
  console.log(JSON.stringify(req.body, null, 2));
  console.log('=== END HOTEL CREATE ITINERARY PAYLOAD ===');
  
  try {
    const itineraryData = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    if (!itineraryData) {
      return res.status(400).json({
        message: "Itinerary data is required",
        status: 400
      });
    }

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    const searchTracingKey = req.headers['search-tracing-key'];
    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    // Enhanced logging for debugging
    console.log('=== HOTEL CREATE ITINERARY REQUEST ===');
    console.log('Authorization:', authHeader ? 'Present' : 'Missing');
    console.log('Search Tracing Key:', searchTracingKey || 'Not provided');
    console.log('Content-Type:', headers['Content-Type']);
    console.log('Request Body Keys:', Object.keys(itineraryData));
    console.log('TUI from request:', itineraryData.TUI);
    console.log('SearchId from request:', itineraryData.SearchId);
    console.log('RecommendationId from request:', itineraryData.RecommendationId);
    console.log('HotelCode from request:', itineraryData.HotelCode);
    console.log('NetAmount from request:', itineraryData.NetAmount);
    console.log('Rooms count:', itineraryData.Rooms?.length || 0);

    // Convert dates to the required format (YYYY-MM-DD string format)
    const formatDateToString = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    // Validate required fields
    const requiredFields = ['SearchId', 'RecommendationId', 'HotelCode', 'CheckInDate', 'CheckOutDate'];
    const missingFields = requiredFields.filter(field => !itineraryData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
        status: 400,
        missingFields
      });
    }

    // Validate pricing data
    if (!itineraryData.NetAmount || itineraryData.NetAmount === '' || itineraryData.NetAmount === '0') {
      return res.status(400).json({
        message: 'NetAmount is required and must be greater than 0',
        status: 400,
        field: 'NetAmount'
      });
    }

    // Validate date format and ensure dates are in the future
    const checkInDate = new Date(itineraryData.CheckInDate);
    const checkOutDate = new Date(itineraryData.CheckOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({
        message: 'Check-in date must be today or in the future',
        status: 400,
        field: 'CheckInDate'
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: 'Check-out date must be after check-in date',
        status: 400,
        field: 'CheckOutDate'
      });
    }

    // Validate and transform the payload according to API provider structure
    const transformedPayload = {
      TUI: itineraryData.TUI || searchTracingKey,
      ServiceEnquiry: itineraryData.ServiceEnquiry || "",
      ContactInfo: {
        Title: itineraryData.ContactInfo?.Title || "Mr",
        FName: itineraryData.ContactInfo?.FName || "",
        LName: itineraryData.ContactInfo?.LName || "",
        Mobile: itineraryData.ContactInfo?.Mobile || "",
        Phone: null, // Add Phone field as null
        Email: itineraryData.ContactInfo?.Email || "",
        Address: itineraryData.ContactInfo?.Address || "",
        State: itineraryData.ContactInfo?.State || "",
        City: itineraryData.ContactInfo?.City || "",
        PIN: itineraryData.ContactInfo?.PIN || "",
        GSTCompanyName: itineraryData.ContactInfo?.GSTCompanyName || "",
        GSTTIN: itineraryData.ContactInfo?.GSTTIN || "",
        GSTMobile: itineraryData.ContactInfo?.GSTMobile || "",
        GSTEmail: itineraryData.ContactInfo?.GSTEmail || "",
        UpdateProfile: false, // Changed to false to match working payload
        IsGuest: itineraryData.ContactInfo?.IsGuest !== undefined ? itineraryData.ContactInfo.IsGuest : true, // Changed to true to match working payload
        CountryCode: itineraryData.ContactInfo?.CountryCode || "IN",
        MobileCountryCode: itineraryData.ContactInfo?.MobileCountryCode || "+91",
        NetAmount: "", // Fixed: Empty string instead of itineraryData.NetAmount
        DestMobCountryCode: itineraryData.ContactInfo?.DestMobCountryCode || "",
        DestMob: itineraryData.ContactInfo?.DestMob || ""
      },
      Auxiliaries: [
        {
          Code: "PROMO",
          Parameters: [
            { Type: "Code", Value: "" },
            { Type: "ID", Value: "" },
            { Type: "Amount", Value: "" }
          ]
        }
      ],
      Rooms: itineraryData.Rooms?.map((room, index) => {
        // Always regenerate GuestCode to ensure proper sorting of child ages
        let guestCode;
        if (room.Guests && room.Guests.length > 0) {
          // Group guests by PaxType (A for Adult, C for Child)
          const adults = room.Guests.filter(guest => guest.PaxType === 'A');
          const children = room.Guests.filter(guest => guest.PaxType === 'C');

          let occupancyParts = [];
          const roomIndex = index + 1; // Room index starts from 1

          // Add adults occupancy
          if (adults.length > 0) {
            const adultAges = adults.map(guest => guest.Age || '25').join(':');
            occupancyParts.push(`|${roomIndex}|${adults.length}:A:${adultAges}`);
          }

          // Add children occupancy
          if (children.length > 0) {
            const childAges = children.map(guest => guest.Age || '5').sort((a, b) => parseInt(a) - parseInt(b)).join(':');
            occupancyParts.push(`|${children.length}:C:${childAges}`);
          }

          guestCode = occupancyParts.join('') + '|';
        } else {
          // Default fallback for single adult
          guestCode = `|${index + 1}|1:A:25|`;
        }

        // Generate GuestID using base64 encoding of guest name
        const generateGuestID = (firstName, lastName) => {
          const fullName = `${firstName}${lastName}`.toUpperCase();
          return Buffer.from(fullName).toString('base64').substring(0, 4);
        };

        return {
          RoomId: room.RoomId || "", // Use RoomId from client (Pricing Response → RoomGroup → Room → Id)
          GuestCode: guestCode,
          SupplierName: room.SupplierName || "", // Use SupplierName from client (Pricing Response → RoomGroup → providerName)
          RoomGroupId: room.RoomGroupId || "",
          Guests: room.Guests?.map(guest => ({
            GuestID: "0",
            Operation: "I",
            Title: guest.PaxType === "C" ? "Mstr" : (guest.Title || "Mr"), // Child title should be "Mstr"
            FirstName: guest.FirstName || "",
            MiddleName: guest.MiddleName || "",
            LastName: guest.LastName || "",
            MobileNo: guest.MobileNo || "",
            PaxType: guest.PaxType || "A",
            Age: guest.PaxType === "A" ? "" : (guest.Age ? parseInt(guest.Age) : 5), // Empty for adults, actual age for children as number
            Email: guest.Email || "",
            Pan: guest.Pan || "",
            EmployeeId: guest.EmployeeId || "",
            corporateCompanyID: guest.corporateCompanyID || ""
          })) || []
        };
      }) || [],
      IsAllowDuplicate: false, // Add missing IsAllowDuplicate field
      NetAmount: itineraryData.NetAmount || "",
      ClientID: itineraryData.ClientID || "FVI6V120g22Ei5ztGK0FIQ==",
      DeviceID: itineraryData.DeviceID || "",
      AppVersion: itineraryData.AppVersion || "",
      SearchId: itineraryData.SearchId || "",
      RecommendationId: itineraryData.RecommendationId || "",
      LocationName: null, // Fixed: Set to null to match working payload
      HotelCode: itineraryData.HotelCode || "",
      CheckInDate: formatDateToString(itineraryData.CheckInDate),
      CheckOutDate: formatDateToString(itineraryData.CheckOutDate),
      TravelingFor: itineraryData.TravelingFor || "NTF"
    };

    // Enhanced payload logging
    // console.log('=== TRANSFORMED PAYLOAD ===');
    // console.log('1. TUI (Init Response → searchtracingkey):', transformedPayload.TUI);
    // console.log('2. SearchId:', transformedPayload.SearchId);
    // console.log('3. RecommendationId (MoreRooms Response → recommendations → id):', transformedPayload.RecommendationId);
    // console.log('4. HotelCode:', transformedPayload.HotelCode);
    // console.log('5. NetAmount:', transformedPayload.NetAmount);
    // console.log('6. Rooms count:', transformedPayload.Rooms?.length);
    // console.log('7. First room RoomId (Pricing Response → RoomGroup → Room → Id):', transformedPayload.Rooms?.[0]?.RoomId);
    // console.log('8. First room SupplierName (Pricing Response → RoomGroup → providerName):', transformedPayload.Rooms?.[0]?.SupplierName);
    // console.log('9. First room GuestCode:', transformedPayload.Rooms?.[0]?.GuestCode);
    console.log('Complete payload:', JSON.stringify(transformedPayload, null, 2));

    // // Debug: Check critical fields
    // console.log('=== PAYLOAD VALIDATION ===');
    // console.log('TUI:', transformedPayload.TUI);
    // console.log('SearchId:', transformedPayload.SearchId);
    // console.log('RecommendationId:', transformedPayload.RecommendationId);
    // console.log('HotelCode:', transformedPayload.HotelCode);
    // console.log('CheckInDate:', transformedPayload.CheckInDate);
    // console.log('CheckOutDate:', transformedPayload.CheckOutDate);
    // console.log('NetAmount:', transformedPayload.NetAmount);
    // console.log('LocationName:', transformedPayload.LocationName);
    // console.log('ContactInfo NetAmount:', transformedPayload.ContactInfo?.NetAmount);
    // console.log('Rooms count:', transformedPayload.Rooms?.length);
    // console.log('First room GuestID:', transformedPayload.Rooms?.[0]?.Guests?.[0]?.GuestID);
    // console.log('First room Operation:', transformedPayload.Rooms?.[0]?.Guests?.[0]?.Operation);
    // console.log('First room SupplierName:', transformedPayload.Rooms?.[0]?.SupplierName);
    // console.log('UpdateProfile:', transformedPayload.ContactInfo?.UpdateProfile);

    // // Detailed comparison with API provider sample
    // console.log('=== DETAILED COMPARISON WITH API PROVIDER SAMPLE ===');
    // console.log('=== EXPECTED vs ACTUAL ===');
    // console.log('TUI: Expected=81ebfeb2-1790-4b78-9c0e-1183619e6fad, Actual=' + transformedPayload.TUI);
    // console.log('ServiceEnquiry: Expected="", Actual=' + transformedPayload.ServiceEnquiry);
    // console.log('ContactInfo.Title: Expected=Mr, Actual=' + transformedPayload.ContactInfo?.Title);
    // console.log('ContactInfo.UpdateProfile: Expected=true, Actual=' + transformedPayload.ContactInfo?.UpdateProfile);
    // console.log('ContactInfo.IsGuest: Expected=false, Actual=' + transformedPayload.ContactInfo?.IsGuest);
    // console.log('ContactInfo.CountryCode: Expected=IN, Actual=' + transformedPayload.ContactInfo?.CountryCode);
    // console.log('ContactInfo.MobileCountryCode: Expected=+91, Actual=' + transformedPayload.ContactInfo?.MobileCountryCode);
    // console.log('ContactInfo.NetAmount: Expected="", Actual=' + transformedPayload.ContactInfo?.NetAmount);
    // console.log('Auxiliaries[0].Code: Expected=PROMO, Actual=' + transformedPayload.Auxiliaries?.[0]?.Code);
    // console.log('Auxiliaries[1].Code: Expected=CUSTOMER DETAILS, Actual=' + transformedPayload.Auxiliaries?.[1]?.Code);
    // console.log('Rooms[0].GuestID: Expected=0, Actual=' + transformedPayload.Rooms?.[0]?.Guests?.[0]?.GuestID);
    // console.log('Rooms[0].Operation: Expected="", Actual=' + transformedPayload.Rooms?.[0]?.Guests?.[0]?.Operation);
    // console.log('Rooms[0].PaxType: Expected=A, Actual=' + transformedPayload.Rooms?.[0]?.Guests?.[0]?.PaxType);
    // console.log('Rooms[0].ProfileType: Expected=T, Actual=' + transformedPayload.Rooms?.[0]?.Guests?.[0]?.ProfileType);
    // console.log('NetAmount: Expected=2330, Actual=' + transformedPayload.NetAmount);
    // console.log('ClientID: Expected=FVI6V120g22Ei5ztGK0FIQ==, Actual=' + transformedPayload.ClientID);
    // console.log('LocationName: Expected=null, Actual=' + transformedPayload.LocationName);
    // console.log('CheckInDate: Expected=2023-07-19, Actual=' + transformedPayload.CheckInDate);
    // console.log('CheckOutDate: Expected=2023-07-20, Actual=' + transformedPayload.CheckOutDate);
    // console.log('TravelingFor: Expected=NTF, Actual=' + transformedPayload.TravelingFor);

    // Add retry mechanism for pricing failures
    let itineraryResponse;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        console.log(`=== ATTEMPT ${retryCount + 1} ===`);
        console.log('Making Create Itinerary API call...');

        itineraryResponse = await axios.post(
          `${HOTEL_ITINERARY_URL}/Hotel/CreateItinerary`,
          transformedPayload,
          { headers }
        );

        // If we get here, the request was successful
        break;

      } catch (error) {
        retryCount++;
        console.error(`=== ATTEMPT ${retryCount} FAILED ===`);
        console.error('Error:', error.message);

        if (retryCount > maxRetries) {
          throw error; // Re-throw if we've exhausted retries
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log('=== BACKEND: HOTEL CREATE ITINERARY RESPONSE ===');
    console.log('Hotel Create Itinerary Response JSON ===>');
    console.log(JSON.stringify(itineraryResponse.data, null, 2));
    console.log('=== END HOTEL CREATE ITINERARY RESPONSE ===');

    const itineraryResult = itineraryResponse.data;

    // Check if the API response indicates an error
    const isApiError = itineraryResult.Code && itineraryResult.Code !== '200' && itineraryResult.Code !== '0';
    const hasErrorMessage = itineraryResult.Msg && itineraryResult.Msg.length > 0 &&
      itineraryResult.Msg.some(msg => msg.toLowerCase().includes('error'));

    if (isApiError || hasErrorMessage) {
      console.error('=== API RETURNED ERROR ===');
      console.error('Error Code:', itineraryResult.Code);
      console.error('Error Messages:', itineraryResult.Msg);

      // Handle specific error codes
      let errorMessage = 'Hotel API returned an error';
      let statusCode = 400;

      if (itineraryResult.Code === '5102') {
        errorMessage = 'Pricing response failure - The pricing information is invalid or expired. Please try searching again.';
        statusCode = 422; // Unprocessable Entity
      } else if (itineraryResult.Code === '5101') {
        errorMessage = 'Room availability issue - The selected room is no longer available.';
        statusCode = 409; // Conflict
      } else if (itineraryResult.Code === '5103') {
        errorMessage = 'Hotel booking validation failed - Please check your booking details.';
        statusCode = 400;
      }

      return res.status(statusCode).json({
        status: 'error',
        message: errorMessage,
        apiError: {
          code: itineraryResult.Code,
          messages: itineraryResult.Msg,
          transactionId: itineraryResult.TransactionID,
          netAmount: itineraryResult.NetAmount
        },
        searchTracingKey: searchTracingKey,
        timestamp: new Date().toISOString(),
        suggestion: itineraryResult.Code === '5102' ? 'Please refresh the hotel search and try booking again' : null
      });
    }

    const responseToSend = {
      status: 'success',
      itinerary: itineraryResult,
      searchTracingKey: searchTracingKey,
      timestamp: new Date().toISOString()
    };
    
    console.log('=== BACKEND: HOTEL CREATE ITINERARY RESPONSE TO CLIENT ===');
    console.log('Hotel Create Itinerary Response to Client JSON ===>');
    console.log(JSON.stringify(responseToSend, null, 2));
    console.log('=== END HOTEL CREATE ITINERARY RESPONSE TO CLIENT ===');
    
    res.status(200).json(responseToSend);

  } catch (error) {
    console.error('=== CREATE ITINERARY API ERROR ===');
    console.error('Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Response Data:', error.response?.data);
    console.error('Error Status:', error.response?.status);
    console.error('Error Headers:', JSON.stringify(error.response?.headers, null, 2));

    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data,
        errorCode: error.code
      });
    } else if (error.request) {
      return res.status(503).json({
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      return res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  }
};



