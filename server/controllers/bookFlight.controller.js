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
            DepositPayment: true,
            VPA: "",
            PaymentAmount: "0",
            TransactionID: TransactionID || 0,
            TargetCurrency: "",
            RMSSignature: "",
            QuickPay: "null",
            PaymentCharge: "0",
            CardType: "default",
            ServiceType: "ITI",
            NetAmount: NetAmount.toString(),
            PaymentType: "",
            TargetAmount: "0",
            OnlinePayment:  false,
            BrowserKey: process.env.BROWSER_KEY,
            TUI: TUI,
            BankCode: "",
            MerchantID: "",
            ReleaseDate: "",
            CardAlias: "",
            Card: {
                CHName: "",
                CVV: "",
                Address: "",
                SaveCard: false,
                LName: "",
                City: "",
                FName: "",
                Number: "",
                PIN: "",
                State: "",
                Country: "",
                EMIMonths: "0",
                Expiry: "",
                International: false
            },
            Promo: "",
            GateWayCode: "",
            ClientID: ClientID,
            Hold: false
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
        console.log(response.data, '================================= response getItineraryStatus');
        
        const responseData = response.data;
        
        // Check the current status - this is the key field that determines if booking is complete
        if (responseData.CurrentStatus === "Success") {
            return res.status(200).json({
                success: true,
                data: responseData,
                message: "Booking completed successfully",
                status: "SUCCESS",
                shouldPoll: false
            });
        } else if (responseData.CurrentStatus === "Failed") {
            return res.status(400).json({
                success: false,
                data: responseData,
                message: "Booking failed",
                status: "FAILED",
                shouldPoll: false
            });
        } else {
            // Still in progress - continue polling
            return res.status(200).json({
                success: true,
                data: responseData,
                message: "Booking still in progress",
                status: "IN_PROGRESS",
                shouldPoll: true
            });
        }
        
    } catch (error) {
        console.error("GetItineraryStatus Error:", error?.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            message: error?.response?.data || error.message 
        });
    }
}