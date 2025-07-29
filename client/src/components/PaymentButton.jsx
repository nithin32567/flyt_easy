import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";




const PaymentButton = ({ amount, name, email, contact, TUI }) => {
    const token = localStorage.getItem("token");
    console.log(amount, name, email, contact, '================================= amount, name, email, contact');
    const transactionID = JSON.parse(localStorage.getItem("TransactionID"));
    const clientID = localStorage.getItem("ClientID");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    async function startPay() {
        const payload = {
            TransactionID: transactionID,
            PaymentAmount: amount,
            NetAmount: amount,
            ClientID: clientID,
            TUI: TUI,
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/startpay`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            console.log(response.data, '================================= response');
        } catch (error) {
            console.log(error, '================================= error');
        }
    }

    const handlePayment = async () => {
        setLoading(true);

        const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            alert("Failed to load Razorpay SDK. Please check your connection.");
            setLoading(false);
            return;
        }

        try {
            // 1. Create order on backend
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/razorpay/bookFlight`, {
                amount: amount,

            },
            );
            console.log(response.data.order, '================================= response');

            const options = {
                key: "rzp_test_9Hi6wVlmuLeJ77",
                amount: response.data.order.amount,
                currency: response.data.order.currency,
                name: "Flyteasy Booking",
                description: "Flight Payment",
                order_id: response.data.order.id,
                handler: async function (response) {
                    console.log(response, '================================= response');
                    // 2. Verify payment signature
                    const verify = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/razorpay/verifyPayment`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });
                    console.log(verify.data, '================================= verify');
                    if (verify.data.success) {
                        await startPay();
                        alert("✅ Payment Successful!");
                        navigate("/payment-success");
                    } else {
                        alert("❌ Payment Verification Failed!");
                    }
                },
                prefill: {
                    name: name,
                    email: email,
                    contact: contact
                },
                theme: {
                    color: "#3399cc",
                },
            };

            console.log(options, '================================= options');


            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", function (response) {
                alert(`❌ Payment Failed: ${response.error.description}`);
            });
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }

        setLoading(false);
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
        >
            {loading ? "Processing..." : `Pay ₹${amount}`}
        </button>
    );
};

export default PaymentButton;
