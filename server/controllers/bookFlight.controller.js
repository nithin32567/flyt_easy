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
    // console.log(token, '================================= token');
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
            PaymentAmount: PaymentAmount || 0,
            NetAmount: NetAmount || 0,
            BrowserKey: process.env.BROWSER_KEY,
            ClientID: ClientID,
            TUI: TUI,
            Hold: Hold || false,
            Promo: Promo || null,
            PaymentType: PaymentType || "",
            BankCode: BankCode || "",
            GateWayCode: GateWayCode || "",
            MerchantID: MerchantID || "",
            PaymentCharge: PaymentCharge || 0,
            ReleaseDate: ReleaseDate || "",
            OnlinePayment: OnlinePayment || false,
            DepositPayment: DepositPayment || false,
            Card: {
                Number: Card?.Number || "",
                Expiry: Card?.Expiry || "",
                CVV: Card?.CVV || "",
                CHName: Card?.CHName || "",
                Address: Card?.Address || "",
                City: Card?.City || "",
                State: Card?.State || "",
                Country: Card?.Country || "",
                PIN: Card?.PIN || "",
                International: Card?.International || false,
                SaveCard: Card?.SaveCard || false,
                FName: Card?.FName || "",
                LName: Card?.LName || "",
                EMIMonths: Card?.EMIMonths || "0"
            },
            VPA: VPA || "",
            CardAlias: CardAlias || "",
            QuickPay: QuickPay || null,
            RMSSignature: RMSSignature || "",
            TargetCurrency: TargetCurrency || "",
            TargetAmount: TargetAmount || 0,

            ServiceType: "ITI"
        };

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        const response = await axios.post(`${process.env.FLIGHT_URL}/Payment/StartPay`, finalPayload, { headers });
        console.log(response.data, '================================= response');
        
        return res.status(200).json({
            success: true,
            data: response.data,
            message: "Payment processed successfully"
        });
    } catch (error) {
        console.error("StartPay Error:", error?.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            message: error?.response?.data || error.message 
        });
    }
}