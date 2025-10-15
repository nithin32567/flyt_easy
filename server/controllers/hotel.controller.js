import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.HOTEL_URL, "process.env.HOTEL_URL ========================= hotel search");

export const autosuggest = async (req, res) => {
  console.log(process.env.HOTEL_URL, "process.env.HOTEL_URL ========================= hotel search");
  try {
    const { term } = req.query;
    console.log(req.query, "req.query ========================= hotel search");
    console.log(term, "term ========================= hotel search");

    const response = await axios.get(`${process.env.HOTEL_URL}/api/content/autosuggest`, {
      params: { term },
    });

    const data = response.data;

    console.log(data, "data ========================= hotel search");
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const initHotelSearch = async (req, res) => {
  console.log(process.env.HOTEL_URL, "process.env.HOTEL_URL ========================= hotel search init");
  try {
    const payload = req.body;
    console.log(payload, "payload ========================= hotel search init");
    
    // Get the Authorization header from the incoming request
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);

    const response = await axios.post(`${process.env.HOTEL_URL}/api/hotels/search/init`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader // Pass the authorization header to the external API
      }
    });

    const data = response.data;
    console.log(data, "data ========================= hotel search init");
    res.status(200).json(data);
  } catch (error) {
    console.error("Hotel init API error:", error);
    
    // Log more detailed error information
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    
    res.status(500).json({ 
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
};

export const getHotelRates = async (req, res) => {
  console.log(process.env.HOTEL_URL, "process.env.HOTEL_URL ========================= hotel rates");
  try {
    const { searchId } = req.params;
    console.log("Search ID for rates:", searchId);
    
    // Get the Authorization header from the incoming request
    const authHeader = req.headers.authorization;
    console.log("Authorization header for rates:", authHeader);

    const response = await axios.get(`${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/rate`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    console.log("Hotel rates response:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Hotel rates API error:", error);
    
    // Log more detailed error information
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    
    res.status(500).json({ 
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
};

export const getHotelFilterData = async (req, res) => {
  console.log(process.env.HOTEL_URL, "process.env.HOTEL_URL ========================= hotel filter data");
  try {
    const { searchId } = req.params;
    console.log("Search ID for filter data:", searchId);
    
    // Get the Authorization header from the incoming request
    const authHeader = req.headers.authorization;
    console.log("Authorization header for filter data:", authHeader);

    const response = await axios.get(`${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/filterdata`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    console.log("Hotel filter data response:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Hotel filter data API error:", error);
    
    // Log more detailed error information
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    
    res.status(500).json({ 
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
};

export const getHotelContent = async (req, res) => {
  console.log("=== HOTEL CONTENT API CALLED ===");
  console.log("Hotel URL:", process.env.HOTEL_URL);
  console.log("Request params:", req.params);
  console.log("Request headers:", req.headers);
  
  try {
    const { searchId, hotelId } = req.params;
    console.log("Search ID for content:", searchId);
    console.log("Hotel ID for content:", hotelId);
    
    if (!searchId || !hotelId) {
      console.error("Missing required parameters");
      return res.status(400).json({ 
        message: "Missing required parameters: searchId and hotelId",
        status: 400
      });
    }
    
    // Get the Authorization header from the incoming request
    const authHeader = req.headers.authorization;
    console.log("Authorization header for content:", authHeader);

    if (!authHeader) {
      console.error("No authorization header provided");
      return res.status(401).json({ 
        message: "Authorization header is required",
        status: 401
      });
    }

    const externalApiUrl = `${process.env.HOTEL_URL}/api/hotels/${searchId}/${hotelId}/content`;
    console.log("External API URL:", externalApiUrl);

    const response = await axios.get(externalApiUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    console.log("=== HOTEL CONTENT API SUCCESS ===");
    console.log("External API response status:", response.status);
    console.log("External API response data keys:", Object.keys(data));
    console.log("Hotel data keys:", data.hotel ? Object.keys(data.hotel) : 'No hotel data');
    console.log("=== END HOTEL CONTENT API SUCCESS ===");
    
    res.status(200).json(data);
  } catch (error) {
    console.error("=== HOTEL CONTENT API ERROR ===");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    
    // Log more detailed error information
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response statusText:", error.response.statusText);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
      
      // Return appropriate status code based on external API response
      return res.status(error.response.status).json({ 
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error("Error request:", error.request);
      return res.status(503).json({ 
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      console.error("Error message:", error.message);
      return res.status(500).json({ 
        message: error.message,
        status: 500
      });
    }
  }
};

export const getHotelRooms = async (req, res) => {
  console.log("=== HOTEL ROOMS API CALLED ===");
  console.log("Hotel URL:", process.env.HOTEL_URL);
  console.log("Request params:", req.params);
  console.log("Request headers:", req.headers);
  
  try {
    const { searchId, hotelId } = req.params;
    console.log("Search ID for rooms:", searchId);
    console.log("Hotel ID for rooms:", hotelId);
    
    if (!searchId || !hotelId) {
      console.error("Missing required parameters");
      return res.status(400).json({ 
        message: "Missing required parameters: searchId and hotelId",
        status: 400
      });
    }
    
    // Get the Authorization header from the incoming request
    const authHeader = req.headers.authorization;
    console.log("Authorization header for rooms:", authHeader);

    if (!authHeader) {
      console.error("No authorization header provided");
      return res.status(401).json({ 
        message: "Authorization header is required",
        status: 401
      });
    }

    const externalApiUrl = `${process.env.HOTEL_URL}/api/hotels/search/result/${searchId}/${hotelId}/rooms`;
    console.log("External API URL for rooms:", externalApiUrl);

    const response = await axios.get(externalApiUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    console.log("=== HOTEL ROOMS API SUCCESS ===");
    console.log("External API response status:", response.status);
    console.log("External API response data keys:", Object.keys(data));
    console.log("Recommendations count:", data.recommendations ? data.recommendations.length : 0);
    console.log("=== END HOTEL ROOMS API SUCCESS ===");
    
    res.status(200).json(data);
  } catch (error) {
    console.error("=== HOTEL ROOMS API ERROR ===");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    
    // Log more detailed error information
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response statusText:", error.response.statusText);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
      
      // Return appropriate status code based on external API response
      return res.status(error.response.status).json({ 
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error("Error request:", error.request);
      return res.status(503).json({ 
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      console.error("Error message:", error.message);
      return res.status(500).json({ 
        message: error.message,
        status: 500
      });
    }
  }
};

export const getHotelPricing = async (req, res) => {
  console.log("=== HOTEL PRICING API CALLED ===");
  console.log("Hotel URL:", process.env.HOTEL_URL);
  console.log("Request params:", req.params);
  console.log("Request query:", req.query);
  console.log("Request headers:", req.headers);
  
  try {
    const { searchId, hotelId, providerName, recommendationId } = req.params;
    
    console.log("Search ID for pricing:", searchId);
    console.log("Hotel ID for pricing:", hotelId);
    console.log("Provider Name:", providerName);
    console.log("Recommendation ID:", recommendationId);
    
    if (!searchId || !hotelId || !providerName || !recommendationId) {
      console.error("Missing required parameters");
      return res.status(400).json({ 
        message: "Missing required parameters: searchId, hotelId, providerName, and recommendationId",
        status: 400
      });
    }
    
    // Get the Authorization header from the incoming request
    const authHeader = req.headers.authorization;
    console.log("Authorization header for pricing:", authHeader);

    if (!authHeader) {
      console.error("No authorization header provided");
      return res.status(401).json({ 
        message: "Authorization header is required",
        status: 401
      });
    }

    const externalApiUrl = `${process.env.HOTEL_URL}/api/hotels/search/${searchId}/${hotelId}/price/${providerName}/${recommendationId}`;
    console.log("External API URL for pricing:", externalApiUrl);

    const response = await axios.get(externalApiUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    console.log("=== HOTEL PRICING API SUCCESS ===");
    console.log("External API response status:", response.status);
    console.log("External API response data keys:", Object.keys(data));
    
    // Detailed logging of the response structure
    if (data.hotelId) {
      console.log("Hotel ID:", data.hotelId);
    }
    if (data.roomGroup && Array.isArray(data.roomGroup)) {
      console.log("Number of room groups:", data.roomGroup.length);
      data.roomGroup.forEach((room, index) => {
        console.log(`Room Group ${index + 1}:`);
        console.log("  - ID:", room.id);
        console.log("  - Availability:", room.availability);
        console.log("  - Provider Name:", room.providerName);
        console.log("  - Base Rate:", room.baseRate);
        console.log("  - Total Rate:", room.totalRate);
        console.log("  - Published Rate:", room.publishedRate);
        console.log("  - Refundable:", room.refundable);
        console.log("  - Card Required:", room.cardRequired);
        if (room.room) {
          console.log("  - Room Name:", room.room.name);
          console.log("  - Room ID:", room.room.id);
        }
        if (room.taxes && Array.isArray(room.taxes)) {
          console.log("  - Taxes:", room.taxes.map(tax => `${tax.description}: ${tax.amount}`).join(", "));
        }
        if (room.cancellationPolicies && Array.isArray(room.cancellationPolicies)) {
          console.log("  - Cancellation Policies:", room.cancellationPolicies.length);
        }
      });
    }
    if (data.priceId) {
      console.log("Price ID:", data.priceId);
    }
    if (data.status) {
      console.log("Status:", data.status);
    }
    if (data.isPotentialSuspect !== undefined) {
      console.log("Is Potential Suspect:", data.isPotentialSuspect);
    }
    
    console.log("Full pricing data:", JSON.stringify(data, null, 2));
    console.log("=== END HOTEL PRICING API SUCCESS ===");
    
    res.status(200).json(data);
  } catch (error) {
    console.error("=== HOTEL PRICING API ERROR ===");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    
    // Log more detailed error information
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response statusText:", error.response.statusText);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
      
      // Return appropriate status code based on external API response
      return res.status(error.response.status).json({ 
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error("Error request:", error.request);
      return res.status(503).json({ 
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      console.error("Error message:", error.message);
      return res.status(500).json({ 
        message: error.message,
        status: 500
      });
    }
  }
};

export const createItinerary = async (req, res) => {
  console.log("=== CREATE HOTEL ITINERARY API CALLED ===");
  console.log("Hotel URL:", process.env.HOTEL_URL);
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);
  
  try {
    const payload = req.body;
    console.log("Itinerary payload:", JSON.stringify(payload, null, 2));
    
    if (!payload) {
      console.error("Missing request body");
      return res.status(400).json({ 
        message: "Request body is required",
        status: 400
      });
    }
    
    // Get the Authorization header from the incoming request
    const authHeader = req.headers.authorization;
    console.log("Authorization header for itinerary:", authHeader);

    if (!authHeader) {
      console.error("No authorization header provided");
      return res.status(401).json({ 
        message: "Authorization header is required",
        status: 401
      });
    }

    const externalApiUrl = `${process.env.HOTEL_URL}/Hotel/CreateItinerary`;
    console.log("External API URL for itinerary:", externalApiUrl);

    const response = await axios.post(externalApiUrl, payload, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    console.log("=== CREATE ITINERARY API SUCCESS ===");
    console.log("External API response status:", response.status);
    console.log("External API response data keys:", Object.keys(data));
    console.log("Transaction ID:", data.TransactionID);
    console.log("TUI:", data.TUI);
    console.log("Net Amount:", data.NetAmount);
    console.log("Code:", data.Code);
    console.log("Messages:", data.Msg);
    console.log("=== END CREATE ITINERARY API SUCCESS ===");
    
    res.status(200).json(data);
  } catch (error) {
    console.error("=== CREATE ITINERARY API ERROR ===");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    
    // Log more detailed error information
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response statusText:", error.response.statusText);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
      
      // Return appropriate status code based on external API response
      return res.status(error.response.status).json({ 
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error("Error request:", error.request);
      return res.status(503).json({ 
        message: "External hotel API is not available",
        status: 503
      });
    } else {
      console.error("Error message:", error.message);
      return res.status(500).json({ 
        message: error.message,
        status: 500
      });
    }
  }
};