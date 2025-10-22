import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// API Endpoints Configuration
const HOTEL_UTILS_URL = 'https://b2bapiutils.benzyinfotech.com';
const HOTEL_SEARCH_URL = 'https://travelportalapi.benzyinfotech.com';
const HOTEL_ITINERARY_URL = 'https://b2bapihotels.benzyinfotech.com';
const HOTEL_BOOKING_URL = 'https://b2bapiflights.benzyinfotech.com';

export const autosuggest = async (req, res) => {
    try {
        const { term } = req.query;

        // Using HOTEL_SEARCH_URL constant

        const response = await axios.get(`${HOTEL_SEARCH_URL}/api/content/autosuggest`, {
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

    // Using HOTEL_SEARCH_URL constant
    const initResponse = await axios.post(`${HOTEL_SEARCH_URL}/api/hotels/search/init`, payload, {
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

    // Using HOTEL_SEARCH_URL constant
    const [ratesResponse, contentResponse] = await Promise.allSettled([
      axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/rate`, {
        headers: headers
      }),
      axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/content?limit=${limit}&offset=${(page - 1) * limit}&filterdata=false`, {
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
        const filterResponse = await axios.get(`${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/filterdata`, {
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

    // Using HOTEL_SEARCH_URL constant
    const contentResponse = await axios.get(
      `${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}/content?limit=${limit}&offset=${(page - 1) * limit}&filterdata=false`,
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

    // Using HOTEL_SEARCH_URL constant
    // Build content API URL with priceProvider if provided
    let contentUrl = `${HOTEL_SEARCH_URL}/api/hotels/${searchId}/${hotelId}/content`;
    if (priceProvider) {
      contentUrl += `?priceProvider=${priceProvider}`;
    }

    console.log('=== HOTEL DETAILS API CALL ===');
    console.log('Search ID:', searchId);
    console.log('Hotel ID:', hotelId);
    console.log('Price Provider:', priceProvider);
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
        response: roomsResponse,
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

    console.log('=== HOTEL PRICING API CALL ===');
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
    console.log('Status:', pricingResponse.status);
    console.log('Headers:', JSON.stringify(pricingResponse.headers, null, 2));
    console.log('Complete Response Data:', JSON.stringify(pricingResponse.data, null, 2));
    
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

    console.log('=== PRICING API FINAL RESPONSE ===');
    console.log(JSON.stringify(response, null, 2));

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
    console.log('Search ID:', searchId);
    console.log('Filters:', JSON.stringify(filters, null, 2));
    console.log('Limit:', limit, 'Offset:', offset);

    // Using HOTEL_SEARCH_URL constant
    const filterResponse = await axios.post(
      `${HOTEL_SEARCH_URL}/api/hotels/search/result/${searchId}?limit=${limit}&offset=${offset}`,
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

    // Log headers for debugging
    console.log('=== REQUEST HEADERS ===');
    console.log('Authorization:', authHeader ? 'Present' : 'Missing');
    console.log('Search Tracing Key:', searchTracingKey || 'Not provided');
    console.log('Content-Type:', headers['Content-Type']);

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

    // Validate and transform the payload according to API provider structure
    const transformedPayload = {
      TUI: itineraryData.TUI || searchTracingKey,
      ServiceEnquiry: itineraryData.ServiceEnquiry || "",
      ContactInfo: {
        Title: itineraryData.ContactInfo?.Title || "Mr",
        FName: itineraryData.ContactInfo?.FName || "",
        LName: itineraryData.ContactInfo?.LName || "",
        Mobile: itineraryData.ContactInfo?.Mobile || "",
        Email: itineraryData.ContactInfo?.Email || "",
        Address: itineraryData.ContactInfo?.Address || "",
        State: itineraryData.ContactInfo?.State || "",
        City: itineraryData.ContactInfo?.City || "",
        PIN: itineraryData.ContactInfo?.PIN || "",
        GSTCompanyName: itineraryData.ContactInfo?.GSTCompanyName || "",
        GSTTIN: itineraryData.ContactInfo?.GSTTIN || "",
        GSTMobile: itineraryData.ContactInfo?.GSTMobile || "",
        GSTEmail: itineraryData.ContactInfo?.GSTEmail || "",
        UpdateProfile: true,
        IsGuest: itineraryData.ContactInfo?.IsGuest !== undefined ? itineraryData.ContactInfo.IsGuest : false,
        CountryCode: itineraryData.ContactInfo?.CountryCode || "IN",
        MobileCountryCode: itineraryData.ContactInfo?.MobileCountryCode || "+91",
        NetAmount: "",
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
        },
        {
          Code: "CUSTOMER DETAILS",
          parameters: [
            { Type: "Nationality", Value: "IN" },
            { Type: "Country of Residence", Value: "IN" }
          ]
        }
      ],
      Rooms: itineraryData.Rooms?.map(room => ({
        RoomId: room.RoomId || "",
        GuestCode: room.GuestCode || "|1|1:A:25|",
        SupplierName: room.SupplierName || "",
        RoomGroupId: room.RoomGroupId || "",
        Guests: room.Guests?.map(guest => ({
          GuestID: "0",
          Operation: "",
          Title: guest.Title || "Mr",
          FirstName: guest.FirstName || "",
          MiddleName: guest.MiddleName || "",
          LastName: guest.LastName || "",
          MobileNo: guest.MobileNo || "",
          PaxType: guest.PaxType || "A",
          Age: guest.Age || "",
          Email: guest.Email || "",
          Pan: guest.Pan || "",
          ProfileType: guest.ProfileType || "T",
          EmployeeId: guest.EmployeeId || "",
          corporateCompanyID: guest.corporateCompanyID || ""
        })) || []
      })) || [],
      NetAmount: itineraryData.NetAmount || "",
      ClientID: itineraryData.ClientID || "FVI6V120g22Ei5ztGK0FIQ==",
      DeviceID: itineraryData.DeviceID || "",
      AppVersion: itineraryData.AppVersion || "",
      SearchId: itineraryData.SearchId || "",
      RecommendationId: itineraryData.RecommendationId || "",
      LocationName: null,
      HotelCode: itineraryData.HotelCode || "",
      CheckInDate: formatDateToString(itineraryData.CheckInDate),
      CheckOutDate: formatDateToString(itineraryData.CheckOutDate),
      TravelingFor: itineraryData.TravelingFor || "NTF"
    };

    // Using HOTEL_ITINERARY_URL constant
    console.log('=== CREATE ITINERARY API CALL ===');
    console.log('Headers being sent:', JSON.stringify(headers, null, 2));
    console.log('Itinerary Data:', JSON.stringify(transformedPayload, null, 2));
    console.log('API URL:', `${HOTEL_ITINERARY_URL}/Hotel/CreateItinerary`);
    
    // Debug: Check critical fields
    console.log('=== PAYLOAD VALIDATION ===');
    console.log('TUI:', transformedPayload.TUI);
    console.log('SearchId:', transformedPayload.SearchId);
    console.log('RecommendationId:', transformedPayload.RecommendationId);
    console.log('HotelCode:', transformedPayload.HotelCode);
    console.log('CheckInDate:', transformedPayload.CheckInDate);
    console.log('CheckOutDate:', transformedPayload.CheckOutDate);
    console.log('NetAmount:', transformedPayload.NetAmount);
    console.log('LocationName:', transformedPayload.LocationName);
    console.log('ContactInfo NetAmount:', transformedPayload.ContactInfo?.NetAmount);
    console.log('Rooms count:', transformedPayload.Rooms?.length);
    console.log('First room GuestID:', transformedPayload.Rooms?.[0]?.Guests?.[0]?.GuestID);
    console.log('First room Operation:', transformedPayload.Rooms?.[0]?.Guests?.[0]?.Operation);
    console.log('First room SupplierName:', transformedPayload.Rooms?.[0]?.SupplierName);
    console.log('UpdateProfile:', transformedPayload.ContactInfo?.UpdateProfile);
    
    // Detailed comparison with API provider sample
    console.log('=== DETAILED COMPARISON WITH API PROVIDER SAMPLE ===');
    console.log('=== EXPECTED vs ACTUAL ===');
    console.log('TUI: Expected=81ebfeb2-1790-4b78-9c0e-1183619e6fad, Actual=' + transformedPayload.TUI);
    console.log('ServiceEnquiry: Expected="", Actual=' + transformedPayload.ServiceEnquiry);
    console.log('ContactInfo.Title: Expected=Mr, Actual=' + transformedPayload.ContactInfo?.Title);
    console.log('ContactInfo.UpdateProfile: Expected=true, Actual=' + transformedPayload.ContactInfo?.UpdateProfile);
    console.log('ContactInfo.IsGuest: Expected=false, Actual=' + transformedPayload.ContactInfo?.IsGuest);
    console.log('ContactInfo.CountryCode: Expected=IN, Actual=' + transformedPayload.ContactInfo?.CountryCode);
    console.log('ContactInfo.MobileCountryCode: Expected=+91, Actual=' + transformedPayload.ContactInfo?.MobileCountryCode);
    console.log('ContactInfo.NetAmount: Expected="", Actual=' + transformedPayload.ContactInfo?.NetAmount);
    console.log('Auxiliaries[0].Code: Expected=PROMO, Actual=' + transformedPayload.Auxiliaries?.[0]?.Code);
    console.log('Auxiliaries[1].Code: Expected=CUSTOMER DETAILS, Actual=' + transformedPayload.Auxiliaries?.[1]?.Code);
    console.log('Rooms[0].GuestID: Expected=0, Actual=' + transformedPayload.Rooms?.[0]?.Guests?.[0]?.GuestID);
    console.log('Rooms[0].Operation: Expected="", Actual=' + transformedPayload.Rooms?.[0]?.Guests?.[0]?.Operation);
    console.log('Rooms[0].PaxType: Expected=A, Actual=' + transformedPayload.Rooms?.[0]?.Guests?.[0]?.PaxType);
    console.log('Rooms[0].ProfileType: Expected=T, Actual=' + transformedPayload.Rooms?.[0]?.Guests?.[0]?.ProfileType);
    console.log('NetAmount: Expected=2330, Actual=' + transformedPayload.NetAmount);
    console.log('ClientID: Expected=FVI6V120g22Ei5ztGK0FIQ==, Actual=' + transformedPayload.ClientID);
    console.log('LocationName: Expected=null, Actual=' + transformedPayload.LocationName);
    console.log('CheckInDate: Expected=2023-07-19, Actual=' + transformedPayload.CheckInDate);
    console.log('CheckOutDate: Expected=2023-07-20, Actual=' + transformedPayload.CheckOutDate);
    console.log('TravelingFor: Expected=NTF, Actual=' + transformedPayload.TravelingFor);

    const itineraryResponse = await axios.post(
      `https://b2bapihotels.benzyinfotech.com/Hotel/CreateItinerary`,
      transformedPayload,
      { headers }
    );

    console.log('=== CREATE ITINERARY API RESPONSE ===');
    console.log('Status:', itineraryResponse.status);
    console.log('Status Text:', itineraryResponse.statusText);
    console.log('Response Headers:', JSON.stringify(itineraryResponse.headers, null, 2));
    console.log('Data:', JSON.stringify(itineraryResponse.data, null, 2));
    
    const itineraryResult = itineraryResponse.data;

    // Check if the API response indicates an error
    const isApiError = itineraryResult.Code && itineraryResult.Code !== '200' && itineraryResult.Code !== '0';
    const hasErrorMessage = itineraryResult.Msg && itineraryResult.Msg.length > 0 && 
                           itineraryResult.Msg.some(msg => msg.toLowerCase().includes('error'));

    if (isApiError || hasErrorMessage) {
      console.error('=== API RETURNED ERROR ===');
      console.error('Error Code:', itineraryResult.Code);
      console.error('Error Messages:', itineraryResult.Msg);
      
      return res.status(400).json({
        status: 'error',
        message: 'Hotel API returned an error',
        apiError: {
          code: itineraryResult.Code,
          messages: itineraryResult.Msg,
          transactionId: itineraryResult.TransactionID,
          netAmount: itineraryResult.NetAmount
        },
        searchTracingKey: searchTracingKey,
        timestamp: new Date().toISOString()
      });
    }

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



