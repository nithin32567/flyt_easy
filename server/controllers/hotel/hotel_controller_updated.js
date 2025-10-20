import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const autosuggest = async (req, res) => {
    try {
        const { term } = req.query;

        if (!process.env.HOTEL_URL) {
            return res.status(500).json({ message: 'Hotel API URL not configured' });
        }

        const response = await axios.get(`${process.env.HOTEL_URL}/api/content/autosuggest`, {
            params: { term },
        });

        console.log(response.data);
        const data = response.data;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const initHotelSearch = async (req, res) => {
  try {
    const payload = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    console.log('=== HOTEL INIT API CALL ===');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const initResponse = await axios.post(`${process.env.HOTEL_URL}/api/hotels/search/init`, payload, {
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': authHeader
      }
    });

    console.log('=== INIT API RESPONSE ===');
    console.log('Status:', initResponse.status);
    console.log('Data:', JSON.stringify(initResponse.data, null, 2));
    
    const initData = initResponse.data;

    if (!initData.searchId) {
      return res.status(400).json({
        message: "Search ID not received from init API",
        status: 400
      });
    }

    const response = {
      status: 'success',
      init: initData,
      searchId: initData.searchId,
      searchTracingKey: initData.searchTracingKey,
      timestamp: new Date().toISOString()
    };

    console.log('=== INIT API FINAL RESPONSE ===');
    console.log(JSON.stringify(response, null, 2));

    res.status(200).json(response);

  } catch (error) {
    console.error('=== INIT API ERROR ===');
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

export const fetchHotelContentAndRates = async (req, res) => {
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

    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    console.log('=== HOTEL CONTENT & RATES API CALL ===');
    console.log('Search ID:', searchId);
    console.log('Search Tracing Key:', searchTracingKey);
    console.log('Page:', page, 'Limit:', limit);

    const [ratesResponse, contentResponse] = await Promise.allSettled([
      axios.get(`${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/rate`, {
        headers: headers
      }),
      axios.get(`${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/content?limit=${limit}&offset=${(page - 1) * limit}&filterdata=false`, {
        headers: headers
      })
    ]);

    let ratesData = null;
    if (ratesResponse.status === 'fulfilled') {
      ratesData = ratesResponse.value.data;
      console.log('=== RATES API RESPONSE ===');
      console.log('Status:', ratesResponse.value.status);
      console.log('Data:', JSON.stringify(ratesData, null, 2));
    } else {
      console.error('=== RATES API ERROR ===');
      console.error('Error:', ratesResponse.reason?.message);
    }

    let contentData = null;
    if (contentResponse.status === 'fulfilled') {
      contentData = contentResponse.value.data;
      console.log('=== CONTENT API RESPONSE ===');
      console.log('Status:', contentResponse.value.status);
      console.log('Data:', JSON.stringify(contentData, null, 2));
    } else {
      console.error('=== CONTENT API ERROR ===');
      console.error('Error:', contentResponse.reason?.message);
    }

    let filterData = null;
    if (ratesResponse.status === 'fulfilled') {
      try {
        const filterResponse = await axios.get(`${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/filterdata`, {
          headers: headers
        });
        filterData = filterResponse.data;
        console.log('=== FILTER DATA RESPONSE ===');
        console.log(JSON.stringify(filterData, null, 2));
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

    console.log('=== CONTENT & RATES FINAL RESPONSE ===');
    console.log(JSON.stringify(combinedResponse, null, 2));

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

    const contentResponse = await axios.get(
      `${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/content?limit=${limit}&offset=${(page - 1) * limit}&filterdata=false`,
      { headers }
    );

    console.log('=== HOTEL PAGE API RESPONSE ===');
    console.log('Status:', contentResponse.status);
    console.log('Data:', JSON.stringify(contentResponse.data, null, 2));
    
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

    console.log('=== HOTEL PAGE FINAL RESPONSE ===');
    console.log(JSON.stringify(response, null, 2));

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
  try {
    const { searchId, hotelId } = req.params;
    const { priceProvider } = req.query;
    console.log(searchId, hotelId,"searchId and hotelId {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{")
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
    console.log(searchTracingKey,"searchTracingKey ============================================>")
    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

    // Build content API URL with priceProvider if provided
    let contentUrl = `${process.env.HOTEL_URL}/api/hotels/${searchId}/${hotelId}/content`;
    if (priceProvider) {
      contentUrl += `?priceProvider=${priceProvider}`;
    }

    const [contentResponse, roomsResponse] = await Promise.allSettled([
      axios.get(contentUrl, {
        headers: headers
      }),
      axios.get(`${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/${hotelId}/rooms`, {
        headers: headers
      })
    ]);

    // console.log(roomsResponse,"response of the room api")
    // console.log(contentResponse,"response of the content api")

    // Process content response
    let contentData = null;
    let contentSuccess = false;
    if (contentResponse.status === 'fulfilled') {
      contentData = contentResponse.value.data;
      contentSuccess = true;
      console.log('Content API success');
    } else {
      console.error('Content API failed:', contentResponse.reason?.message);
    }

    // Process rooms response
    let roomsData = null;
    let roomsSuccess = false;
    if (roomsResponse.status === 'fulfilled') {
      roomsData = roomsResponse.value.data;
      roomsSuccess = true;
      console.log('Rooms API success');
    } else {
      console.error('Rooms API failed:', roomsResponse.reason?.message);
      console.error('Rooms API error details:', roomsResponse.reason?.response?.data);
      
      // Set a proper failure response for rooms
      roomsData = {
        status: 'failure',
        code: '1211',
        message: 'No rooms found',
        reason: roomsResponse.reason?.response?.data || roomsResponse.reason?.message
      };
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
      priceProvider: priceProvider,
      timestamp: new Date().toISOString(),
      apiStatus: {
        content: contentSuccess ? 'success' : 'failed',
        rooms: roomsSuccess ? 'success' : 'failed'
      }
    };

    console.log('Combined hotel details response prepared');
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
  try {
    const { searchId, hotelId, priceProvider, roomRecommendationId } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    if (!searchId || !hotelId || !priceProvider || !roomRecommendationId) {
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

    const pricingResponse = await axios.get(
      `${process.env.HOTEL_URL}/api/hotels/search/${searchId}/${hotelId}/price/${priceProvider}/${roomRecommendationId}`,
      { headers }
    );

    console.log('Pricing API response:', pricingResponse.data);
    const pricingData = pricingResponse.data;

    res.status(200).json({
      status: 'success',
      pricing: pricingData,
      searchId: searchId,
      hotelId: hotelId,
      priceProvider: priceProvider,
      roomRecommendationId: roomRecommendationId,
      searchTracingKey: searchTracingKey,
      timestamp: new Date().toISOString()
    });

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
    console.log('Search ID:', searchId);
    console.log('Filters:', JSON.stringify(filters, null, 2));
    console.log('Limit:', limit, 'Offset:', offset);

    const filterResponse = await axios.post(
      `${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}?limit=${limit}&offset=${offset}`,
      filters,
      { headers }
    );

    console.log('=== FILTER HOTELS API RESPONSE ===');
    console.log('Status:', filterResponse.status);
    console.log('Data:', JSON.stringify(filterResponse.data, null, 2));
    
    const filterData = filterResponse.data;

    res.status(200).json({
      status: 'success',
      hotels: filterData,
      searchId: searchId,
      searchTracingKey: searchTracingKey,
      filters: filters,
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

    const filterDataResponse = await axios.get(
      `${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/filterdata`,
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

export const createItineraryForHotelRoom = async (req, res) => {
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

    console.log('=== CREATE ITINERARY API CALL ===');
    console.log('Headers being sent:', JSON.stringify(headers, null, 2));
    console.log('Itinerary Data:', JSON.stringify(itineraryData, null, 2));
    console.log('API URL:', `${process.env.HOTEL_URL}/api/hotels/CreateItinerary`);

    const itineraryResponse = await axios.post(
      `${process.env.HOTEL_URL}/api/hotels/CreateItinerary`,
      itineraryData,
      { headers }
    );

    console.log('=== CREATE ITINERARY API RESPONSE ===');
    console.log('Status:', itineraryResponse.status);
    console.log('Response Headers:', JSON.stringify(itineraryResponse.headers, null, 2));
    console.log('Data:', JSON.stringify(itineraryResponse.data, null, 2));
    
    const itineraryResult = itineraryResponse.data;

    res.status(200).json({
      status: 'success',
      itinerary: itineraryResult,
      searchTracingKey: searchTracingKey,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('=== CREATE ITINERARY API ERROR ===');
    console.error('Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Response:', error.response?.data);
    console.error('Error Status:', error.response?.status);
    console.error('Error Headers:', error.response?.headers);
    
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



