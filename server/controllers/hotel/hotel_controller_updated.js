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
export const initHotelSearchWithRatesAndContents = async (req, res) => {
  try {
    const payload = req.body;
    const authHeader = req.headers.authorization;
    const { page = 1, limit = 50 } = req.query;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
        status: 401
      });
    }

    const initResponse = await axios.post(`${process.env.HOTEL_URL}/api/hotels/search/init`, payload, {
      headers: {
        'Content-Type': 'application/json', 'Authorization': authHeader
      }
    });

    console.log(initResponse.data);
    const initData = initResponse.data;

    if (!initData.searchId) {
      return res.status(400).json({
        message: "Search ID not received from init API",
        status: 400
      });
    }

    const searchId = initData.searchId;
    const searchTracingKey = initData.searchTracingKey;
    
    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
    }

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
    }

    let contentData = null;
    if (contentResponse.status === 'fulfilled') {
      contentData = contentResponse.value.data;
    }

    let filterData = null;
    if (ratesResponse.status === 'fulfilled') {
      try {
        const filterResponse = await axios.get(`${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/filterdata`, {
          headers: headers
        });
        filterData = filterResponse.data;
      } catch (filterError) {
        
      }
    }

    const combinedResponse = {
      status: 'success',
      init: initData,
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
export const fetchHotelPage = async (req, res) => {
  try {
    const { searchId, page = 1, limit = 50 } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader) {jj
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

    const contentResponse = await axios.get(
      `${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/content?limit=${limit}&offset=${(page - 1) * limit}&filterdata=false`,
      { headers }
    );

    console.log(contentResponse.data);
    const contentData = contentResponse.data;

    res.status(200).json({
      status: 'success',
      content: contentData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: contentData?.total || 0,
        totalPages: Math.ceil((contentData?.total || 0) / limit)
      },
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
export const fetchHotelDetailsWithContentAndRooms = async (req, res) => {
  console.log('🚀 fetchHotelDetailsWithContentAndRooms function called!');
  console.log('Request params:', req.params);
  console.log('Request headers:', req.headers);
  
  try {
    const { searchId, hotelId } = req.params;
    console.log('=== HOTEL DETAILS API CALL ===');
    console.log('SearchId:', searchId, 'HotelId:', hotelId);
    
    const authHeader = req.headers.authorization;
    const searchTracingKey = req.headers['search-tracing-key'];
    const userSessionKey = req.headers['user-session-key'];

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

    if (searchTracingKey) {
      headers['search-tracing-key'] = searchTracingKey;
      console.log('SearchTracingKey added to headers');
    }

    if (userSessionKey) {
      headers['user-session-key'] = userSessionKey;
      console.log('UserSessionKey added to headers');
    }

    console.log('Headers being sent:', JSON.stringify(headers, null, 2));

    const contentApiUrl = `${process.env.HOTEL_URL}/api/hotels/${searchId}/${hotelId}/content`;
    const roomsApiUrl = `${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/${hotelId}/rooms`;

    console.log('Content API URL:', contentApiUrl);
    console.log('Rooms API URL:', roomsApiUrl);

    const [contentResponse, roomsResponse] = await Promise.allSettled([
      axios.get(contentApiUrl, { headers }),
      axios.get(roomsApiUrl, { headers })
    ]);

    // Process content response
    let contentData = null;
    let contentSuccess = false;
    let contentError = null;
    
    if (contentResponse.status === 'fulfilled') {
      contentData = contentResponse.value.data;
      contentSuccess = true;
      console.log('✅ Content API success - Status:', contentResponse.value.status);
    } else {
      contentError = contentResponse.reason;
      console.error('❌ Content API failed:');
      console.error('Error message:', contentError?.message);
      console.error('Error response status:', contentError?.response?.status);
      console.error('Error response data:', contentError?.response?.data);
    }

    // Process rooms response
    let roomsData = null;
    let roomsSuccess = false;
    let roomsError = null;
    
    if (roomsResponse.status === 'fulfilled') {
      roomsData = roomsResponse.value.data;
      roomsSuccess = true;
      console.log('✅ Rooms API success - Status:', roomsResponse.value.status);
    } else {
      roomsError = roomsResponse.reason;
      console.error('❌ Rooms API failed:');
      console.error('Error message:', roomsError?.message);
      console.error('Error response status:', roomsError?.response?.status);
      console.error('Error response data:', roomsError?.response?.data);
      console.error('Error response headers:', roomsError?.response?.headers);
    }

    // Check if both APIs failed
    if (!contentSuccess && !roomsSuccess) {
      return res.status(500).json({
        message: "Both Content and Rooms APIs failed",
        status: 500,
        searchId: searchId,
        hotelId: hotelId,
        timestamp: new Date().toISOString(),
        errors: {
          content: contentError ? {
            message: contentError.message,
            status: contentError.response?.status,
            data: contentError.response?.data
          } : null,
          rooms: roomsError ? {
            message: roomsError.message,
            status: roomsError.response?.status,
            data: roomsError.response?.data
          } : null
        }
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
      userSessionKey: userSessionKey,
      timestamp: new Date().toISOString(),
      apiStatus: {
        content: contentSuccess ? 'success' : 'failed',
        rooms: roomsSuccess ? 'success' : 'failed'
      },
      errors: {
        content: contentError ? {
          message: contentError.message,
          status: contentError.response?.status,
          data: contentError.response?.data
        } : null,
        rooms: roomsError ? {
          message: roomsError.message,
          status: roomsError.response?.status,
          data: roomsError.response?.data
        } : null
      }
    };

    console.log('Combined hotel details response prepared');
    console.log('API Status - Content:', combinedResponse.apiStatus.content, 'Rooms:', combinedResponse.apiStatus.rooms);
    
    res.status(200).json(combinedResponse);

  } catch (error) {
    console.error('❌ Unexpected error in fetchHotelDetailsWithContentAndRooms:', error);
    
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



