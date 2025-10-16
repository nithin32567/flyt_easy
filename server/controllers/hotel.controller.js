// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// export const autosuggest = async (req, res) => {
//   try {
//     const { term } = req.query;

//     const response = await axios.get(`${process.env.HOTEL_URL}/api/content/autosuggest`, {
//       params: { term },
//     });

//     const data = response.data;

//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const initHotelSearch = async (req, res) => {
//   try {
//     const payload = req.body;

//     const authHeader = req.headers.authorization;

//     const response = await axios.post(`${process.env.HOTEL_URL}/api/hotels/search/init`, payload, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': authHeader
//       }
//     });

//     const data = response.data;
//     res.status(200).json(data);
//   } catch (error) {
//     if (error.response) {
//       res.status(500).json({
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data
//       });
//     } else if (error.request) {
//       res.status(500).json({
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data
//       });
//     } else {
//       res.status(500).json({
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data
//       });
//     }
//   }
// };

// export const getHotelRates = async (req, res) => {
//   try {
//     const { searchId } = req.params;

//     const authHeader = req.headers.authorization;

//     const ratesApiUrl = `${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/rate`;

//     const response = await axios.get(ratesApiUrl, {
//       headers: {
//         'Authorization': authHeader,
//         'Content-Type': 'application/json'
//       }
//     });

//     const data = response.data;
//     res.status(200).json(data);
//   } catch (error) {
//     if (error.response) {
//       res.status(500).json({
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data
//       });
//     } else if (error.request) {
//       res.status(500).json({
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data
//       });
//     } else {
//       res.status(500).json({
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data
//       });
//     }
//   }
// };

// export const getHotelFilterData = async (req, res) => {
//   try {
//     const { searchId } = req.params;

//     if (!searchId) {
//       return res.status(400).json({
//         message: "Search ID is required",
//         status: 400
//       });
//     }

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         message: "Authorization header is required",
//         status: 401
//       });
//     }

//     const filterApiUrl = `${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/filterdata`;

//     const userSessionKey = req.headers['user-session-key'];
//     const searchTracingKey = req.headers['search-tracing-key'];
    
//     const headers = {
//       'Authorization': authHeader,
//       'Content-Type': 'application/json'
//     };
    
//     if (userSessionKey) {
//       headers['user-session-key'] = userSessionKey;
//     }
//     if (searchTracingKey) {
//       headers['search-tracing-key'] = searchTracingKey;
//     }

//     const response = await axios.get(filterApiUrl, {
//       headers: headers
//     });

//     const data = response.data;

//     if (data.status === 'failure' || data.code) {
//       return res.status(200).json({
//         filters: [],
//         status: 'success',
//         message: 'No filter data available',
//         originalError: data
//       });
//     }

//     res.status(200).json(data);
//   } catch (error) {
//     if (error.response) {
//       if (error.response.data && error.response.data.status === 'failure') {
//         return res.status(200).json({
//           filters: [],
//           status: 'success',
//           message: 'No filter data available due to external API error',
//           originalError: error.response.data
//         });
//       }
//     }

//     res.status(200).json({
//       filters: [],
//       status: 'success',
//       message: 'No filter data available due to server error',
//       originalError: error.message
//     });
//   }
// };

// export const getHotelContent = async (req, res) => {
//   try {
//     const { searchId, hotelId } = req.params;
//     console.log("searchId", searchId);
//     console.log("hotelId", hotelId);

//     if (!searchId || !hotelId) {
//       return res.status(400).json({
//         message: "Missing required parameters: searchId and hotelId",
//         status: 400
//       });
//     }

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         message: "Authorization header is required",
//         status: 401
//       });
//     }

//     const externalApiUrl = `${process.env.HOTEL_URL}/api/hotels/${searchId}/${hotelId}/content`;

//     const response = await axios.get(externalApiUrl, {
//       headers: {
//         'Authorization': authHeader,
//         'Content-Type': 'application/json'
//       }
//     });

//     const data = response.data;
//     console.log("data of the hotel content", data);

//     res.status(200).json(data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json({
//         message: error.response.data?.message || error.message,
//         status: error.response.status,
//         data: error.response.data
//       });
//     } else if (error.request) {
//       return res.status(503).json({
//         message: "External hotel API is not available",
//         status: 503
//       });
//     } else {
//       return res.status(500).json({
//         message: error.message,
//         status: 500
//       });
//     }
//   }
// };

// export const getHotelRooms = async (req, res) => {
//   try {
//     const { searchId, hotelId } = req.params;

//     if (!searchId || !hotelId) {
//       return res.status(400).json({
//         message: "Missing required parameters: searchId and hotelId",
//         status: 400
//       });
//     }

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         message: "Authorization header is required",
//         status: 401
//       });
//     }

//     const externalApiUrl = `${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/${hotelId}/rooms`;

//     const response = await axios.get(externalApiUrl, {
//       headers: {
//         'Authorization': authHeader,
//         'Content-Type': 'application/json'
//       }
//     });

//     const data = response.data;

//     res.status(200).json(data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json({
//         message: error.response.data?.message || error.message,
//         status: error.response.status,
//         data: error.response.data
//       });
//     } else if (error.request) {
//       return res.status(503).json({
//         message: "External hotel API is not available",
//         status: 503
//       });
//     } else {
//       return res.status(500).json({
//         message: error.message,
//         status: 500
//       });
//     }
//   }
// };

// export const getHotelPricing = async (req, res) => {
//   try {
//     const { searchId, hotelId } = req.params;
//     const { priceProvider } = req.query;

//     if (!searchId || !hotelId || !priceProvider) {
//       return res.status(400).json({
//         message: "Missing required parameters: searchId, hotelId, and priceProvider",
//         status: 400
//       });
//     }

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         message: "Authorization header is required",
//         status: 401
//       });
//     }

//     const providerName = priceProvider;
//     const recommendationId = "default";
    
//     const externalApiUrl = `${process.env.HOTEL_URL}/api/hotels/search/${searchId}/${hotelId}/price/${providerName}/${recommendationId}`;

//     const response = await axios.get(externalApiUrl, {
//       headers: {
//         'Authorization': authHeader,
//         'Content-Type': 'application/json'
//       }
//     });

//     const data = response.data;

//     res.status(200).json(data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json({
//         message: error.response.data?.message || error.message,
//         status: error.response.status,
//         data: error.response.data
//       });
//     } else if (error.request) {
//       return res.status(503).json({
//         message: "External hotel API is not available",
//         status: 503
//       });
//     } else {
//       return res.status(500).json({
//         message: error.message,
//         status: 500
//       });
//     }
//   }
// };

// export const createItinerary = async (req, res) => {
//   try {
//     const payload = req.body;

//     if (!payload) {
//       return res.status(400).json({
//         message: "Request body is required",
//         status: 400
//       });
//     }

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         message: "Authorization header is required",
//         status: 401
//       });
//     }

//     const searchTracingKey = req.headers['search-tracing-key'];

//     const headers = {
//       'Authorization': authHeader,
//       'Content-Type': 'application/json'
//     };

//     if (searchTracingKey) {
//       headers['search-tracing-key'] = searchTracingKey;
//     }

//     const baseUrl = process.env.HOTEL_URL.replace(/\/$/, '');
//     const externalApiUrl = `${baseUrl}/Hotel/CreateItinerary`;

//     const response = await axios.post(externalApiUrl, payload, {
//       headers: headers
//     });

//     const data = response.data;

//     res.status(200).json(data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json({
//         message: error.response.data?.message || error.message,
//         status: error.response.status,
//         data: error.response.data
//       });
//     } else if (error.request) {
//       return res.status(503).json({
//         message: "External hotel API is not available",
//         status: 503
//       });
//     } else {
//       return res.status(500).json({
//         message: error.message,
//         status: 500
//       });
//     }
//   }
// };