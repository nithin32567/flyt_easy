import axios from "axios";

// Hotel Signature API - Generate token for hotel APIs
export const generateHotelToken = async (req, res) => {
  try {
    const { clientId, clientPassword } = req.body;
    console.log('Hotel Signature API called with:', { clientId, clientPassword });

    if (!clientId || !clientPassword) {
      return res.status(400).json({
        success: false,
        message: "Client ID and password are required",
      });
    }

    // Validate credentials (you may need to adjust these based on your hotel API requirements)
    if (clientId.trim() !== process.env.HOTEL_CLIENT_ID?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hotel Client ID is incorrect",
      });
    }

    if (clientPassword.trim() !== process.env.HOTEL_PASSWORD?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hotel password is incorrect",
      });
    }

    const payload = {
      MerchantID: process.env.HOTEL_MERCHANT_ID,
      ApiKey: process.env.HOTEL_API_KEY,
      ClientID: clientId?.trim(),
      Password: clientPassword?.trim(),
      AgentCode: "",
      BrowserKey: process.env.HOTEL_BROWSER_KEY,
      Key: process.env.HOTEL_KEY,
    };

    console.log('Hotel Signature payload:', payload);

    const response = await axios.post(process.env.HOTEL_SIGNATURE_API, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log('Hotel Signature response:', response.data);

    const token = response.data?.Token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Hotel token not received",
      });
    }

    return res.status(200).json({
      success: true,
      token: token,
      message: "Hotel token generated successfully",
    });
  } catch (err) {
    console.error('Hotel Signature API Error:', err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate hotel token",
      error: err.message,
    });
  }
};

// Hotel Search API
export const searchHotels = async (req, res) => {
  try {
    const {
      destination,
      checkIn,
      checkOut,
      guests,
      rooms = 1,
      adults = 2,
      children = 0,
      infants = 0
    } = req.body;

    console.log('Hotel search request:', req.body);

    if (!req.hotelToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing Hotel Token",
      });
    }

    // Prepare payload for hotel search API
    const payload = {
      CheckIn: checkIn,
      CheckOut: checkOut,
      Rooms: rooms,
      Adults: adults,
      Children: children,
      Infants: infants,
      Destination: destination,
      ClientID: req.clientId,
      // Add any other required fields based on your hotel API documentation
    };

    console.log('Hotel search payload:', payload);

    const response = await axios.post(
      `${process.env.HOTEL_API_URL}${process.env.HOTEL_SEARCH_PATH}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.hotelToken}`,
          ClientID: req.clientId,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Hotel search response:', response.data);

    return res.status(200).json({
      success: true,
      message: "Hotel search completed successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Hotel Search Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Hotel search failed",
      error: error?.response?.data || error.message,
    });
  }
};

// Hotel Details API
export const getHotelDetails = async (req, res) => {
  try {
    const { hotelId, sessionId } = req.body;

    if (!req.hotelToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing Hotel Token",
      });
    }

    const payload = {
      HotelId: hotelId,
      SessionId: sessionId,
      ClientID: req.clientId,
    };

    console.log('Hotel details payload:', payload);

    const response = await axios.post(
      `${process.env.HOTEL_API_URL}${process.env.HOTEL_DETAILS_PATH}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.hotelToken}`,
          ClientID: req.clientId,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Hotel details response:', response.data);

    return res.status(200).json({
      success: true,
      message: "Hotel details retrieved successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Hotel Details Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get hotel details",
      error: error?.response?.data || error.message,
    });
  }
};

// Hotel Booking API
export const bookHotel = async (req, res) => {
  try {
    const {
      hotelId,
      sessionId,
      roomDetails,
      guestDetails,
      contactInfo,
      paymentInfo
    } = req.body;

    if (!req.hotelToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing Hotel Token",
      });
    }

    const payload = {
      HotelId: hotelId,
      SessionId: sessionId,
      RoomDetails: roomDetails,
      GuestDetails: guestDetails,
      ContactInfo: contactInfo,
      PaymentInfo: paymentInfo,
      ClientID: req.clientId,
    };

    console.log('Hotel booking payload:', payload);

    const response = await axios.post(
      `${process.env.HOTEL_API_URL}${process.env.HOTEL_BOOKING_PATH}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.hotelToken}`,
          ClientID: req.clientId,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Hotel booking response:', response.data);

    return res.status(200).json({
      success: true,
      message: "Hotel booking completed successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Hotel Booking Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Hotel booking failed",
      error: error?.response?.data || error.message,
    });
  }
};

// Hotel Booking Retrieval API
export const getHotelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!req.hotelToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing Hotel Token",
      });
    }

    const payload = {
      BookingId: bookingId,
      ClientID: req.clientId,
    };

    console.log('Hotel booking retrieval payload:', payload);

    const response = await axios.post(
      `${process.env.HOTEL_API_URL}${process.env.HOTEL_RETRIEVE_BOOKING_PATH}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.hotelToken}`,
          ClientID: req.clientId,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Hotel booking retrieval response:', response.data);

    return res.status(200).json({
      success: true,
      message: "Hotel booking retrieved successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Hotel Booking Retrieval Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve hotel booking",
      error: error?.response?.data || error.message,
    });
  }
};

// Hotel Payment API
export const startHotelPayment = async (req, res) => {
  try {
    const {
      bookingId,
      amount,
      paymentMethod,
      cardDetails
    } = req.body;

    if (!req.hotelToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing Hotel Token",
      });
    }

    const payload = {
      BookingId: bookingId,
      Amount: amount,
      PaymentMethod: paymentMethod,
      CardDetails: cardDetails,
      ClientID: req.clientId,
    };

    console.log('Hotel payment payload:', payload);

    const response = await axios.post(
      `${process.env.HOTEL_PAYMENT_API_URL}${process.env.HOTEL_STARTPAY_PATH}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.hotelToken}`,
          ClientID: req.clientId,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Hotel payment response:', response.data);

    return res.status(200).json({
      success: true,
      message: "Hotel payment initiated successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Hotel Payment Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Hotel payment failed",
      error: error?.response?.data || error.message,
    });
  }
};

// Hotel Cancellation API
export const cancelHotelBooking = async (req, res) => {
  try {
    const { bookingId, reason } = req.body;

    if (!req.hotelToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing Hotel Token",
      });
    }

    const payload = {
      BookingId: bookingId,
      Reason: reason,
      ClientID: req.clientId,
    };

    console.log('Hotel cancellation payload:', payload);

    const response = await axios.post(
      `${process.env.HOTEL_API_URL}${process.env.HOTEL_CANCELLATION_PATH}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.hotelToken}`,
          ClientID: req.clientId,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Hotel cancellation response:', response.data);

    return res.status(200).json({
      success: true,
      message: "Hotel booking cancelled successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Hotel Cancellation Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Hotel cancellation failed",
      error: error?.response?.data || error.message,
    });
  }
}; 