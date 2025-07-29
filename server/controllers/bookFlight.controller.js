import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


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
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}