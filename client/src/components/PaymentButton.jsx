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
            DepositPayment: false,
            VPA: "",
            PaymentAmount: amount.toString(),
            TransactionID: transactionID,
            TargetCurrency: "",
            RMSSignature: "",
            QuickPay: "null",
            PaymentCharge: "0",
            CardType: "default",
            ServiceType: "ITI",
            NetAmount: amount.toString(),
            PaymentType: "",
            TargetAmount: "0",
            OnlinePayment: false,
            BrowserKey: "caecd3cd30225512c1811070dce615c1",
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
            ClientID: clientID,
            Hold: false
        }
        try {
            console.log('Starting payment with payload:', payload);
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/startpay`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            console.log('StartPay response:', response.data);
            return response.data;
        } catch (error) {
            console.error('StartPay error:', error);
            throw error;
        }
    }

    async function getItineraryStatus(TUI, TransactionID) {
        try {
            console.log('Checking itinerary status...');
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/get-itinerary-status`, {
                TUI: TUI,
                TransactionID: TransactionID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            console.log('GetItineraryStatus response:', response.data);
            
            // Return the response data which contains the status information
            return response.data;
        } catch (error) {
            console.error('GetItineraryStatus error:', error);
            throw error;
        }
    }

    async function retrieveBooking(TUI, TransactionID) {
        try {
            console.log('Retrieving booking details...');
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/retrieve-booking`, {
                TUI: TUI,
                ReferenceNumber: TransactionID,
                ReferenceType: "T",
                ClientID: clientID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            console.log('RetrieveBooking response:', response.data);
            
            // Return the response data which contains the booking details
            return response.data;
        } catch (error) {
            console.error('RetrieveBooking error:', error);
            throw error;
        }
    }

    async function pollBookingStatus(TUI, TransactionID, maxAttempts = 30) {
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            try {
                console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
                const statusResponse = await getItineraryStatus(TUI, TransactionID);
                
                console.log('Status response:', statusResponse);
                
                // Check if the status response indicates completion
                if (statusResponse.status === "SUCCESS") {
                    console.log('Booking completed successfully, retrieving booking details...');
                    // Only call RetrieveBooking after GetItineraryStatus returns Success
                    const bookingResponse = await retrieveBooking(TUI, TransactionID);
                    if (bookingResponse.success) {
                        console.log('Booking details retrieved successfully:', bookingResponse.data);
                        localStorage.setItem("bookingDetails", JSON.stringify(bookingResponse.data));
                        return { success: true, bookingData: bookingResponse.data };
                    } else {
                        console.error('Failed to retrieve booking details:', bookingResponse);
                        return { success: false, message: "Failed to retrieve booking details" };
                    }
                } else if (statusResponse.status === "FAILED") {
                    console.log('Booking failed');
                    return { success: false, message: "Booking failed" };
                } else {
                    // Still in progress, wait and try again
                    console.log(`Booking still in progress, attempt ${attempts + 1}/${maxAttempts}`);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    attempts++;
                }
            } catch (error) {
                console.error('Error polling booking status:', error);
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            }
        }
        
        return { success: false, message: "Booking status polling timeout" };
    }

    const handlePayment = async () => {
        setLoading(true);

        try {
            const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
            if (!res) {
                alert("Failed to load Razorpay SDK. Please check your connection.");
                setLoading(false);
                return;
            }

            // 1. Create order on backend
            console.log('Creating Razorpay order...');
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/razorpay/bookFlight`, {
                amount: amount,
            });
            console.log('Razorpay order created:', response.data.order);

            const options = {
                key: "rzp_test_9Hi6wVlmuLeJ77",
                amount: response.data.order.amount,
                currency: response.data.order.currency,
                name: "Flyteasy Booking",
                description: "Flight Payment",
                order_id: response.data.order.id,
                handler: async function (response) {
                    console.log('Payment successful, verifying...', response);
                    try {
                        // 2. Verify payment signature
                        const verify = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/razorpay/verifyPayment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        console.log('Payment verification response:', verify.data);
                        
                        if (verify.data.success) {
                            console.log('Payment verified successfully, starting payment...');
                            
                            // 3. Start payment process
                            const startPayResponse = await startPay();
                            console.log('StartPay completed:', startPayResponse);
                            
                            if (startPayResponse.shouldPoll) {
                                // 4. Poll for booking status
                                console.log('Starting booking status polling...');
                                const pollingResult = await pollBookingStatus(TUI, transactionID);
                                
                                if (pollingResult.success) {
                                    alert("✅ Payment and Booking Successful!");
                                    console.log('Navigating to payment success page...');
                                    setTimeout(() => {
                                        navigate("/payment-success");
                                    }, 1000);
                                } else {
                                    alert(`❌ Booking Failed: ${pollingResult.message}`);
                                    navigate("/payment-error");
                                }
                            } else if (startPayResponse.status === "SUCCESS") {
                                alert("✅ Payment Successful!");
                                setTimeout(() => {
                                    navigate("/payment-success");
                                }, 1000);
                            } else {
                                alert("❌ Payment Failed!");
                                navigate("/payment-error");
                            }
                        } else {
                            console.error('Payment verification failed:', verify.data);
                            alert("❌ Payment Verification Failed!");
                        }
                    } catch (error) {
                        console.error('Error in payment verification:', error);
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

            console.log('Opening Razorpay with options:', options);
            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", function (response) {
                console.error('Payment failed:', response);
                alert(`❌ Payment Failed: ${response.error.description}`);
                setLoading(false);
            });
        } catch (err) {
            console.error('Error in handlePayment:', err);
            alert("Something went wrong");
            setLoading(false);
        }
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
