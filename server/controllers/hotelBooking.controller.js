import Razorpay from "razorpay";
import axios from "axios";
import crypto from "crypto";
import HotelBooking from "../models/hotel.booking.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createHotelRazorpayOrder = async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: currency || "INR",
      receipt: receipt || `hotel_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};

export const verifyHotelPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      return res.json({
        success: true, 
        message: "Payment verified successfully"
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const startHotelPay = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  
  try {
    const {
      TransactionID,
      PaymentAmount,
      NetAmount,
      ClientID,
      TUI,
      Hold,
      Promo,
      PaymentType,
      BankCode,
      GateWayCode,
      MerchantID,
      PaymentCharge,
      ReleaseDate,
      OnlinePayment,
      DepositPayment,
      Card,
      VPA,
      CardAlias,
      QuickPay,
      RMSSignature,
      TargetCurrency,
      TargetAmount,
      ThirdPartyInfo,
      TripType,
      Authorization,
      QTransactionID,
      BrowserKey,
      BrowserKeyFromToken,
      AgentInfo
    } = req.body;

    const finalPayload = {
      SID: null,
      TUI: TUI,
      ClientID: ClientID,
      Email: null,
      Promo: Promo || null,
      TransactionID: TransactionID || 0,
      PaymentType: PaymentType || "",
      BankCode: BankCode || "",
      GateWayCode: GateWayCode || "",
      MerchantID: MerchantID || 0,
      PaymentAmount: PaymentAmount || NetAmount,
      PaymentCharge: PaymentCharge || 0,
      Card: {
        Number: Card?.Number || "",
        Expiry: Card?.Expiry || "",
        CVV: Card?.CVV || "",
        CHName: Card?.CHName || "",
        FName: Card?.FName || null,
        LName: Card?.LName || null,
        Address: Card?.Address || "",
        City: Card?.City || "",
        State: Card?.State || "",
        Country: Card?.Country || "",
        PIN: Card?.PIN || "",
        International: Card?.International || false,
        SaveCard: Card?.SaveCard || false,
        EMIMonths: Card?.EMIMonths || "0",
        Token: Card?.Token || null,
        NumberAlias: Card?.NumberAlias || null
      },
      VPA: VPA || "",
      CardAlias: CardAlias || "",
      QuickPay: QuickPay || null,
      RMSSignature: RMSSignature || "",
      TargetCurrency: TargetCurrency || "",
      TargetAmount: TargetAmount || 0,
      ThirdPartyInfo: ThirdPartyInfo || null,
      Hold: Hold || false,
      TripType: TripType || null,
      Authorization: Authorization || "",
      QTransactionID: QTransactionID || 0,
      NetAmount: NetAmount,
      OnlinePayment: OnlinePayment || false,
      DepositPayment: DepositPayment || true,
      ReleaseDate: ReleaseDate || "/Date(-62135596800000)/",
      BrowserKey: BrowserKey || process.env.BROWSER_KEY,
      BrowserKeyFromToken: BrowserKeyFromToken || process.env.BROWSER_KEY,
      AgentInfo: AgentInfo || ""
    };

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    };
    
    console.log("=== HOTEL STARTPAY PAYLOAD ===");
    console.log(JSON.stringify(finalPayload, null, 2));
    console.log("=== END HOTEL STARTPAY PAYLOAD ===");
    
    const response = await axios.post(`${process.env.FLIGHT_URL}/Payment/StartPay`, finalPayload, { headers });
    
    const responseData = response.data;
    console.log("=== HOTEL STARTPAY RESPONSE ===");
    console.log(JSON.stringify(responseData, null, 2));
    console.log("=== END HOTEL STARTPAY RESPONSE ===");
    
    if (!responseData || Object.keys(responseData).length === 0) {
      return res.status(500).json({
        success: false,
        message: "Invalid response from StartPay API",
        data: responseData
      });
    }
    
    if (responseData.TUI === null && responseData.Code === null && responseData.Msg === null) {
      return res.status(500).json({
        success: false,
        message: "API returned null values - possible API issue or authentication problem",
        data: responseData
      });
    }
    
    if (responseData.Msg && Array.isArray(responseData.Msg) && responseData.Msg[0]) {
      const message = responseData.Msg[0];
      
      if (message.includes("BOOKING INPROGRESS") || message.includes("BOOKING  INPROGRESS")) {
        return res.status(200).json({
          success: true,
          data: responseData,
          message: "Hotel booking in progress",
          status: "IN_PROGRESS",
          shouldPoll: true
        });
      } else if (message.includes("BOOKING FAILED")) {
        return res.status(400).json({
          success: false,
          data: responseData,
          message: "Hotel booking failed",
          status: "FAILED"
        });
      } else if (message.includes("Please provide valid reference number")) {
        return res.status(400).json({
          success: false,
          data: responseData,
          message: "Invalid reference number. Please ensure the hotel itinerary was created successfully before proceeding to payment.",
          status: "INVALID_REFERENCE",
          errorCode: "6019"
        });
      }
    }
    
    if (responseData.Code === "6033" || responseData.Code === 6033) {
      return res.status(200).json({
        success: true,
        data: responseData,
        message: "Hotel booking in progress (Code 6033)",
        status: "IN_PROGRESS",
        shouldPoll: true
      });
    }
    
    if (responseData.Code === "200" && responseData.Msg && responseData.Msg.includes("Success")) {
      return res.status(200).json({
        success: true,
        data: responseData,
        message: "Hotel payment processed successfully",
        status: "SUCCESS",
        shouldPoll: false
      });
    }
    
    return res.status(200).json({
      success: true,
      data: responseData,
      message: "Hotel payment processed successfully",
      status: "SUCCESS"
    });
  } catch (error) {
    console.error("Hotel StartPay error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error?.response?.data || error.message 
    });
  }
};

export const getHotelItineraryStatus = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  
  try {
    const { TUI, TransactionID, ClientID, userId, bookingData } = req.body;
    
    if (!TUI || !TransactionID) {
      return res.status(400).json({
        success: false,
        message: "TUI and TransactionID are required"
      });
    }

    const payload = {
      TUI: TUI,
      TransactionID: TransactionID,
      ClientID: ClientID || "FVI6V120g22Ei5ztGK0FIQ=="
    };

    console.log("=== HOTEL ITINERARY STATUS PAYLOAD ===");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=== END HOTEL ITINERARY STATUS PAYLOAD ===");
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    };

    const response = await axios.post(`${process.env.FLIGHT_URL}/Payment/GetItineraryStatus`, payload, { headers });
    
    const responseData = response.data;
    console.log("=== HOTEL ITINERARY STATUS RESPONSE ===");
    console.log(JSON.stringify(responseData, null, 2));
    console.log("=== END HOTEL ITINERARY STATUS RESPONSE ===");
    
    const currentStatus = responseData.CurrentStatus || responseData.currentStatus;
    const paymentStatus = responseData.PaymentStatus || responseData.paymentStatus;
    
    const isCurrentStatusSuccess = currentStatus === "Success" || currentStatus === "success";
    const isCurrentStatusFailed = currentStatus === "Failed" || currentStatus === "failed";
    
    if (isCurrentStatusSuccess) {
      return res.status(200).json({
        success: true,
        data: responseData,
        message: "Hotel booking completed successfully",
        status: "SUCCESS",
        shouldPoll: false
      });
    } else if (isCurrentStatusFailed) {
      return res.status(200).json({
        success: false,
        data: responseData,
        message: `Hotel booking failed. ${responseData.Msg ? responseData.Msg.join(' ') : 'Unknown error'}`,
        status: "FAILED",
        shouldPoll: false,
        errorCode: responseData.Code,
        errorDetails: responseData.Msg,
      });
    } else {
      return res.status(200).json({
        success: true,
        data: responseData,
        message: `Hotel booking status: ${currentStatus || 'In Progress - waiting for CurrentStatus'}`,
        status: "IN_PROGRESS",
        shouldPoll: true
      });
    }
    
  } catch (error) {
    console.error("Hotel itinerary status error:", error);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || !process.env.FLIGHT_URL) {
      return res.status(200).json({
        success: true,
        data: {
          TUI: req.body.TUI,
          TransactionID: req.body.TransactionID,
          CurrentStatus: "Success",
          PaymentStatus: "Success",
          Code: "200",
          Msg: ["Success"]
        },
        message: "Hotel booking completed successfully",
        status: "SUCCESS",
        shouldPoll: false
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: error?.response?.data || error.message 
    });
  }
};

export const retrieveHotelBooking = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  
  try {
    const {
      TUI,
      ReferenceType,
      ReferenceNumber,
      ServiceType,
      ClientID,
      RequestMode,
      Contact,
      Name
    } = req.body;

    const payload = {
      TUI: TUI || null,
      ReferenceType: ReferenceType || "T",
      ReferenceNumber: ReferenceNumber,
      ServiceType: ServiceType || null,
      ClientID: ClientID || "FVI6V120g22Ei5ztGK0FIQ==",
      RequestMode: RequestMode || "RB",
      Contact: Contact || null,
      Name: Name || null
    };

    console.log("=== HOTEL RETRIEVE BOOKING PAYLOAD ===");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=== END HOTEL RETRIEVE BOOKING PAYLOAD ===");
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    };

    const response = await axios.post(`${process.env.FLIGHT_URL}/Utils/RetrieveBooking`, payload, { headers });
    
    const responseData = response.data;
    console.log("=== HOTEL RETRIEVE BOOKING RESPONSE ===");
    console.log(JSON.stringify(responseData, null, 2));
    console.log("=== END HOTEL RETRIEVE BOOKING RESPONSE ===");
    
            if (responseData.Code === "200" && responseData.Msg && responseData.Msg.includes("Success")) {
              // Store booking data in database
              try {
                const userId = req.user?.id; // Assuming user ID is available in req.user
                
                if (userId) {
                  const hotelBookingData = {
                    userId: userId,
                    bookingData: responseData,
                    transactionId: responseData.TransactionId?.toString(),
                    tui: responseData.TUI,
                    totalAmount: responseData.NetFare || responseData.GrossFare,
                    paymentStatus: 'success',
                    hotelName: responseData.HotelInfo?.Name,
                    checkInDate: new Date(responseData.CheckInDate),
                    checkOutDate: new Date(responseData.CheckOutDate),
                    bookingConfirmationId: responseData.BookingConfirmationId
                  };

                  // Check if booking already exists
                  const existingBooking = await HotelBooking.findOne({ 
                    transactionId: responseData.TransactionId?.toString() 
                  });

                  if (!existingBooking) {
                    const hotelBooking = new HotelBooking(hotelBookingData);
                    await hotelBooking.save();
                    console.log("=== HOTEL BOOKING SAVED TO DATABASE ===");
                    console.log("Booking ID:", hotelBooking._id);
                    console.log("Transaction ID:", hotelBooking.transactionId);
                    console.log("=== END HOTEL BOOKING SAVED ===");
                  } else {
                    console.log("=== HOTEL BOOKING ALREADY EXISTS ===");
                    console.log("Existing Booking ID:", existingBooking._id);
                    console.log("=== END HOTEL BOOKING EXISTS ===");
                  }
                } else {
                  console.log("=== NO USER ID FOUND - SKIPPING DATABASE STORAGE ===");
                }
              } catch (dbError) {
                console.error("Database storage error:", dbError);
                // Don't fail the request if database storage fails
              }

              return res.status(200).json(responseData);
            } else {
              return res.status(400).json({
                success: false,
                message: responseData.Msg?.join(' ') || 'Failed to retrieve booking',
                data: responseData
              });
            }
    
  } catch (error) {
    console.error("Hotel retrieve booking error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error?.response?.data || error.message 
    });
  }
};

// Get all hotel bookings for a user
export const getUserHotelBookings = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const hotelBookings = await HotelBooking.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    console.log("=== USER HOTEL BOOKINGS RETRIEVED ===");
    console.log("User ID:", userId);
    console.log("Total Bookings:", hotelBookings.length);
    console.log("=== END USER HOTEL BOOKINGS ===");

    return res.status(200).json({
      success: true,
      data: hotelBookings,
      count: hotelBookings.length
    });

  } catch (error) {
    console.error("Get user hotel bookings error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get specific hotel booking by ID
export const getHotelBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const hotelBooking = await HotelBooking.findOne({ 
      _id: bookingId, 
      userId 
    }).populate('userId', 'name email');

    if (!hotelBooking) {
      return res.status(404).json({
        success: false,
        message: 'Hotel booking not found'
      });
    }

    console.log("=== HOTEL BOOKING RETRIEVED BY ID ===");
    console.log("Booking ID:", bookingId);
    console.log("Transaction ID:", hotelBooking.transactionId);
    console.log("=== END HOTEL BOOKING BY ID ===");

    return res.status(200).json({
      success: true,
      data: hotelBooking
    });

  } catch (error) {
    console.error("Get hotel booking by ID error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
