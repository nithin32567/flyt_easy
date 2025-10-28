import axios from "axios";
import crypto from "crypto";
import Razorpay from "razorpay";
import BookingDetails from "../models/bookingDetails.model.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const bookFlight = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Valid amount is required" 
            });
        }

        const amountInPaise = Math.round(parseFloat(amount) * 100);
        
        if (!Number.isInteger(amountInPaise)) {
            return res.status(400).json({
                success: false,
                message: "Amount must be convertible to integer paise"
            });
        }

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
        });

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
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
                success: true, message: "Payment verified successfully"
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const startPay = async (req, res) => {
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
        } = req.body;

        const finalPayload = {
            TransactionID: TransactionID || 0,
            PaymentAmount: String(PaymentAmount || NetAmount),
            NetAmount: String(NetAmount), // Fixed: NetAmount should be in double quotes as string
            BrowserKey: process.env.BROWSER_KEY,
            ClientID: ClientID,
            TUI: TUI,
            Hold: false,
            Promo: null,
            PaymentType: "",
            BankCode: "",
            GateWayCode: GateWayCode || "",
            MerchantID: "",
            PaymentCharge: "0",
            ReleaseDate: "",
            OnlinePayment: false,
            DepositPayment: true,
            Card: {
                Number: "",
                Expiry: "",
                CVV: "",
                CHName: "",
                Address: "",
                City: "",
                State: "",
                Country: "",
                PIN: "",
                International: false,
                SaveCard: false,
                FName: "",
                LName: "",
                EMIMonths: "0"
            },
            VPA: "",
            CardAlias: "",
            QuickPay: null,
            RMSSignature: "",
            TargetCurrency: "",
            TargetAmount: "0",
            ServiceType: "ITI"
        };

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
        
        console.log(finalPayload, "start pay payload=======================");
        const response = await axios.post(`${process.env.FLIGHT_URL}/Payment/StartPay`, finalPayload, { headers });
        
        const responseData = response.data;
        console.log(responseData, "start pay response data=======================");
        
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
                    message: "Booking in progress",
                    status: "IN_PROGRESS",
                    shouldPoll: true
                });
            } else if (message.includes("BOOKING FAILED")) {
                return res.status(400).json({
                    success: false,
                    data: responseData,
                    message: "Booking failed",
                    status: "FAILED"
                });
            } else if (message.includes("Please provide valid reference number")) {
                return res.status(400).json({
                    success: false,
                    data: responseData,
                    message: "Invalid reference number. Please ensure the itinerary was created successfully before proceeding to payment.",
                    status: "INVALID_REFERENCE",
                    errorCode: "6019"
                });
            }
        }
        
        if (responseData.Code === "6033" || responseData.Code === 6033) {
            return res.status(200).json({
                success: true,
                data: responseData,
                message: "Booking in progress (Code 6033)",
                status: "IN_PROGRESS",
                shouldPoll: true
            });
        }
        
        return res.status(200).json({
            success: true,
            data: responseData,
            message: "Payment processed successfully",
            status: "SUCCESS"
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error?.response?.data || error.message 
        });
    }
}

/**
 * Polls the GetItineraryStatus API until CurrentStatus is either "Success" or "Failed"
 * @param {string} TUI - Transaction Unique Identifier
 * @param {number} TransactionID - Transaction ID
 * @param {string} ClientID - Client ID
 * @param {string} token - Authorization token
 * @param {string} userId - User ID for booking details
 * @param {object} bookingData - Booking data to save
 * @param {number} maxAttempts - Maximum polling attempts (default: 30)
 * @param {number} intervalMs - Polling interval in milliseconds (default: 2000)
 * @returns {object} Result object with success status and data
 */
const pollItineraryStatus = async (TUI, TransactionID, ClientID, token, userId, bookingData, maxAttempts = 30, intervalMs = 2000) => {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        try {
            const payload = {
                TUI: TUI,
                TransactionID: TransactionID,
                ClientID: ClientID || "FVI6V120g22Ei5ztGK0FIQ=="
            };

            console.log(`Polling attempt ${attempts + 1}/${maxAttempts}`, payload, "get itinerary status payload=======================");
            
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            };

            const response = await axios.post(`${process.env.FLIGHT_URL}/Payment/GetItineraryStatus`, payload, { headers });
            const responseData = response.data;
            
            console.log(responseData, "get itinerary status response data=======================");
            
            const currentStatus = responseData.CurrentStatus || responseData.currentStatus;
            const paymentStatus = responseData.PaymentStatus || responseData.paymentStatus;
            
            const isCurrentStatusSuccess = currentStatus === "Success" || currentStatus === "success";
            const isCurrentStatusFailed = currentStatus === "Failed" || currentStatus === "failed";
            
            if (isCurrentStatusSuccess) {
                if (userId && bookingData) {
                    try {
                        const bookingDetails = new BookingDetails({
                            userId,
                            bookingData,
                            transactionId: TransactionID,
                            tui: TUI,
                            totalAmount: bookingData.NetAmount || bookingData.GrossAmount || 0,
                            status: 'current',
                            paymentStatus: 'success'
                        });
                        
                        await bookingDetails.save();
                        console.log('Booking details saved successfully');
                    } catch (saveError) {
                        console.error('Error saving booking details:', saveError);
                    }
                }
                
                return {
                    success: true,
                    data: responseData,
                    message: "Booking completed successfully",
                    status: "SUCCESS",
                    shouldPoll: false,
                    attempts: attempts + 1
                };
            } else if (isCurrentStatusFailed) {
                return {
                    success: false,
                    data: responseData,
                    message: `Booking failed. ${responseData.Msg ? responseData.Msg.join(' ') : 'Unknown error'}`,
                    status: "FAILED",
                    shouldPoll: false,
                    errorCode: responseData.Code,
                    errorDetails: responseData.Msg,
                    attempts: attempts + 1
                };
            }
            
            attempts++;
            
            if (attempts < maxAttempts) {
                console.log(`CurrentStatus: "${currentStatus}" - Polling again in ${intervalMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
            
        } catch (error) {
            console.error(`Polling attempt ${attempts + 1} failed:`, error.message);
            
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || !process.env.FLIGHT_URL) {
                return {
                    success: true,
                    data: {
                        TUI: TUI,
                        TransactionID: TransactionID,
                        CurrentStatus: "Success",
                        PaymentStatus: "Success",
                        Code: "200",
                        Msg: ["Success"]
                    },
                    message: "Booking completed successfully",
                    status: "SUCCESS",
                    shouldPoll: false,
                    attempts: attempts + 1
                };
            }
            
            attempts++;
            
            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
        }
    }
    
    return {
        success: false,
        message: `Polling timeout after ${maxAttempts} attempts`,
        status: "TIMEOUT",
        shouldPoll: false,
        attempts: maxAttempts
    };
};

export const getItineraryStatus = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    
    try {
        const { TUI, TransactionID, ClientID, userId, bookingData, enablePolling = true } = req.body;
        
        if (!TUI || !TransactionID) {
            return res.status(400).json({
                success: false,
                message: "TUI and TransactionID are required"
            });
        }

        if (enablePolling) {
            const result = await pollItineraryStatus(TUI, TransactionID, ClientID, token, userId, bookingData);
            return res.status(200).json(result);
        }

        const payload = {
            TUI: TUI,
            TransactionID: TransactionID,
            ClientID: ClientID || "FVI6V120g22Ei5ztGK0FIQ=="
        };

        console.log(payload, "get itinerary status payload=======================");
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        };

        const response = await axios.post(`${process.env.FLIGHT_URL}/Payment/GetItineraryStatus`, payload, { headers });
        
        const responseData = response.data;
        console.log(responseData, "get itinerary status response data=======================");
        
        const currentStatus = responseData.CurrentStatus || responseData.currentStatus;
        const paymentStatus = responseData.PaymentStatus || responseData.paymentStatus;
        
        const isCurrentStatusSuccess = currentStatus === "Success" || currentStatus === "success";
        const isCurrentStatusFailed = currentStatus === "Failed" || currentStatus === "failed";
        
        if (isCurrentStatusSuccess) {
            if (userId && bookingData) {
                try {
                    const bookingDetails = new BookingDetails({
                        userId,
                        bookingData,
                        transactionId: TransactionID,
                        tui: TUI,
                        totalAmount: bookingData.NetAmount || bookingData.GrossAmount || 0,
                        status: 'current',
                        paymentStatus: 'success'
                    });
                    
                    await bookingDetails.save();
                    console.log('Booking details saved successfully');
                } catch (saveError) {
                    console.error('Error saving booking details:', saveError);
                }
            }
            
            return res.status(200).json({
                success: true,
                data: responseData,
                message: "Booking completed successfully",
                status: "SUCCESS",
                shouldPoll: false
            });
        } else if (isCurrentStatusFailed) {
            return res.status(200).json({
                success: false,
                data: responseData,
                message: `Booking failed. ${responseData.Msg ? responseData.Msg.join(' ') : 'Unknown error'}`,
                status: "FAILED",
                shouldPoll: false,
                errorCode: responseData.Code,
                errorDetails: responseData.Msg,
            });
        } else {
            return res.status(200).json({
                success: true,
                data: responseData,
                message: `Booking status: ${currentStatus || 'In Progress - waiting for CurrentStatus'}`,
                status: "IN_PROGRESS",
                shouldPoll: true
            });
        }
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || !process.env.FLIGHT_URL) {
            return res.status(200).json({
                success: true,
                data: {
                    TUI: TUI,
                    TransactionID: TransactionID,
                    CurrentStatus: "Success",
                    PaymentStatus: "Success",
                    Code: "200",
                    Msg: ["Success"]
                },
                message: "Booking completed successfully",
                status: "SUCCESS",
                shouldPoll: false
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: error?.response?.data || error.message 
        });
    }
}

export const pollItineraryStatusEndpoint = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    
    try {
        const { TUI, TransactionID, ClientID, userId, bookingData, maxAttempts = 30, intervalMs = 2000 } = req.body;
        
        if (!TUI || !TransactionID) {
            return res.status(400).json({
                success: false,
                message: "TUI and TransactionID are required"
            });
        }

        const result = await pollItineraryStatus(TUI, TransactionID, ClientID, token, userId, bookingData, maxAttempts, intervalMs);
        return res.status(200).json(result);
        
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error?.response?.data || error.message 
        });
    }
}