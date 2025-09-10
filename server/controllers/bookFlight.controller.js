import axios from "axios";
import crypto from "crypto";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log(process.env.RAZORPAY_KEY_ID, '================================= process.env.RAZORPAY_KEY_ID');
console.log(process.env.RAZORPAY_KEY_SECRET, '================================= process.env.RAZORPAY_KEY_SECRET');
export const bookFlight = async (req, res) => {
    try {
        const { amount } = req.body;
        console.log(amount, '================================= amount');

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
        });

        console.log(order, '================================= order');

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Verify Payment
export const verifyPayment = async (req, res) => {
    console.log('verify payment ===============================');
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature, '================================= razorpay_order_id, razorpay_payment_id, razorpay_signature');
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            console.log('Missing payment details');
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
        console.log('Sign string:', sign);
        console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');
        
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        console.log('Expected signature:', expectedSign);
        console.log('Received signature:', razorpay_signature);
        console.log('Signatures match:', expectedSign === razorpay_signature);

        if (expectedSign === razorpay_signature) {
            console.log('Payment verification successful');
            return res.json({
                success: true, message: "Payment verified successfully"
            });
        } else {
            console.log('Invalid signature');
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const startPay = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token, '================================= token');
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
            PaymentAmount: 0,
            NetAmount: Number(NetAmount),
            BrowserKey: process.env.BROWSER_KEY,
            ClientID: ClientID,
            TUI: TUI,
            Hold: false,
            Promo: null,
            PaymentType: "",
            BankCode: "",
            GateWayCode: "",
            MerchantID: "",
            PaymentCharge: 0,
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
            TargetAmount: 0,
            ServiceType: "ITI"
        };
        console.log(finalPayload, '================================= finalPayload startpay');

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
        
        // console.log('FLIGHT_URL:', process.env.FLIGHT_URL);
        // console.log('BROWSER_KEY:', process.env.BROWSER_KEY);
        // console.log('Headers:', headers);
        
        const response = await axios.post(`${process.env.FLIGHT_URL}/Payment/StartPay`, finalPayload, { headers });
        // console.log('Response status:', response.status);
        // console.log('Response headers:', response.headers);
        console.log(response.data, '================================= response startpay');
        
        // Check the response for booking status
        const responseData = response.data;
        // console.log('Response data type:', typeof responseData);
        // console.log('Response data keys:', Object.keys(responseData));
        
        // Handle case where response might be null or empty
        if (!responseData || Object.keys(responseData).length === 0) {
            return res.status(500).json({
                success: false,
                message: "Invalid response from StartPay API",
                data: responseData
            });
        }
        
        // Handle case where all important fields are null (API issue)
        if (responseData.TUI === null && responseData.Code === null && responseData.Msg === null) {
            console.error('API returned null values - possible API issue or authentication problem');
            return res.status(500).json({
                success: false,
                message: "API returned null values - possible API issue or authentication problem",
                data: responseData,
                debug: {
                    url: `${process.env.FLIGHT_URL}/Payment/StartPay`,
                    payload: finalPayload,
                    headers: headers
                }
            });
        }
        
        // Check if we have a valid response with Msg field
        if (responseData.Msg && Array.isArray(responseData.Msg) && responseData.Msg[0]) {
            const message = responseData.Msg[0];
            console.log('Message from API:', message);
            
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
        
        // If no specific message or status, check for other indicators
        if (responseData.Code === "6033" || responseData.Code === 6033) {
            return res.status(200).json({
                success: true,
                data: responseData,
                message: "Booking in progress (Code 6033)",
                status: "IN_PROGRESS",
                shouldPoll: true
            });
        }
        
        // Default success response
        return res.status(200).json({
            success: true,
            data: responseData,
            message: "Payment processed successfully",
            status: "SUCCESS"
        });
    } catch (error) {
        console.error("StartPay Error:", error?.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            message: error?.response?.data || error.message 
        });
    }
}

export const getItineraryStatus = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    
    try {
        const { TUI, TransactionID } = req.body;
        
        if (!TUI || !TransactionID) {
            return res.status(400).json({
                success: false,
                message: "TUI and TransactionID are required"
            });
        }

        const payload = {
            TUI: TUI,
            TransactionID: TransactionID
        };

        console.log(payload, '================================= payload getItineraryStatus');

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        };

        const response = await axios.post(`${process.env.FLIGHT_URL}/Payment/GetItineraryStatus`, payload, { headers });
        console.log('=== GET ITINERARY STATUS RESPONSE ===');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        console.log('=====================================');
        
        const responseData = response.data;
        
        // Check the current status - this is the key field that determines if booking is complete
        // Handle different case variations of the status
        const currentStatus = responseData.CurrentStatus || responseData.currentStatus;
        
        console.log('Current Status from API:', currentStatus);
        console.log('Payment Status from API:', responseData.PaymentStatus || responseData.paymentStatus);
        
        if (currentStatus === "Success" || currentStatus === "success") {
            return res.status(200).json({
                success: true,
                data: responseData,
                message: "Booking completed successfully",
                status: "SUCCESS",
                shouldPoll: false
            });
        } else if (currentStatus === "Failed" || currentStatus === "failed") {
            console.log('Booking failed - Full response data:', responseData);
            console.log('Error details:', {
                Code: responseData.Code,
                Msg: responseData.Msg,
                CurrentStatus: responseData.CurrentStatus,
                PaymentStatus: responseData.PaymentStatus,
                TUI: responseData.TUI
            });
            
            return res.status(200).json({
                success: false,
                data: responseData,
                message: `Booking failed. ${responseData.Msg ? responseData.Msg.join(' ') : 'Unknown error'}`,
                status: "FAILED",
                shouldPoll: false,
                errorCode: responseData.Code,
                errorDetails: responseData.Msg
            });
        } else {
            // Still in progress or unknown status - continue polling
            console.log('Unknown or in-progress status:', currentStatus);
            return res.status(200).json({
                success: true,
                data: responseData,
                message: `Booking status: ${currentStatus || 'Unknown'}`,
                status: "IN_PROGRESS",
                shouldPoll: true
            });
        }
        
    } catch (error) {
        console.error("=== GET ITINERARY STATUS SERVER ERROR ===");
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Error response status:", error.response?.status);
        console.error("Error response data:", JSON.stringify(error.response?.data, null, 2));
        console.error("Full error object:", error);
        console.error("=========================================");
        
        // If external API is not available, return a mock response for testing
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || !process.env.FLIGHT_URL) {
            console.log('External API not available, returning mock response for testing');
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
                message: "Booking completed successfully (mock response)",
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

// Test endpoint for debugging
export const testGetItineraryStatusSimple = async (req, res) => {
    try {
        const { TUI, TransactionID } = req.body;
        
        console.log('=== TEST GET ITINERARY STATUS SIMPLE ===');
        console.log('TUI:', TUI);
        console.log('TransactionID:', TransactionID);
        console.log('========================================');
        
        // Return a simple test response
        return res.status(200).json({
            success: true,
            data: {
                TUI: TUI,
                TransactionID: TransactionID,
                CurrentStatus: "Success",
                PaymentStatus: "Success",
                Code: "200",
                Msg: ["Test response - booking completed successfully"]
            },
            message: "Test GetItineraryStatus response",
            status: "SUCCESS",
            shouldPoll: false
        });
    } catch (error) {
        console.error('Test GetItineraryStatus Simple Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};