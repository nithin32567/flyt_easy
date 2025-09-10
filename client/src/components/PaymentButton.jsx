import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentButton = ({ amount, name, email, contact, TUI }) => {
    const token = localStorage.getItem("token");
    console.log(amount, name, email, contact, '================================= amount, name, email, contact');
    console.log('PaymentButton received TUI:', TUI);
    console.log('itineraryTUI from localStorage:', localStorage.getItem("itineraryTUI"));
    const transactionID = JSON.parse(localStorage.getItem("TransactionID"));
    const clientID = localStorage.getItem("ClientID");
    console.log('TransactionID from localStorage:', transactionID);
    console.log('ClientID from localStorage:', clientID);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Use the itinerary TUI if available, otherwise fall back to the passed TUI
    const finalTUI = localStorage.getItem("itineraryTUI") || TUI;
    console.log('Final TUI being used for payment:', finalTUI);
    
    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Test function for debugging get-itinerary-status
    const testGetItineraryStatus = async () => {
        try {
            console.log('=== TESTING GET ITINERARY STATUS ===');
            const testTUI = finalTUI || "test-tui-123";
            const testTransactionID = transactionID || "test-transaction-123";
            
            console.log('Test TUI:', testTUI);
            console.log('Test TransactionID:', testTransactionID);
            
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/test-get-itinerary-status-simple`, {
                TUI: testTUI,
                TransactionID: testTransactionID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            
            console.log('=== TEST RESPONSE ===');
            console.log('Response status:', response.status);
            console.log('Response data:', JSON.stringify(response.data, null, 2));
            console.log('===================');
            
            alert(`Test successful! Status: ${response.data.status}, Message: ${response.data.message}`);
        } catch (error) {
            console.error('=== TEST ERROR ===');
            console.error('Error:', error);
            console.error('Error response:', error.response?.data);
            console.error('===============');
            alert(`Test failed: ${error.message}`);
        }
    };

    async function startPay() {
        const payload = {
            TransactionID: transactionID,
            PaymentAmount: 0,
            NetAmount: amount,
            BrowserKey: "caecd3cd30225512c1811070dce615c1",
            ClientID: clientID,
            TUI: finalTUI,
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
        }
        try {
            console.log('Starting payment with payload:', payload);
            console.log('StartPay payload details:', {
                TUI: payload.TUI,
                TransactionID: payload.TransactionID,
                NetAmount: payload.NetAmount,
                ClientID: payload.ClientID
            });
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
            console.log('TUI:', TUI);
            console.log('TransactionID:', TransactionID);
            console.log('API URL:', `${import.meta.env.VITE_BASE_URL}/api/flights/get-itinerary-status`);
            
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/get-itinerary-status`, {
                TUI: TUI,
                TransactionID: TransactionID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            console.log('=== GET ITINERARY STATUS FRONTEND RESPONSE ===');
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            console.log('Response data:', JSON.stringify(response.data, null, 2));
            console.log('===============================================');
            
            // Return the response data which contains the status information
            return response.data;
        } catch (error) {
            console.error('=== GET ITINERARY STATUS ERROR ===');
            console.error('Error message:', error.message);
            console.error('Error code:', error.code);
            console.error('Error response status:', error.response?.status);
            console.error('Error response data:', JSON.stringify(error.response?.data, null, 2));
            console.error('Error response headers:', error.response?.headers);
            console.error('Full error object:', error);
            console.error('==================================');
            throw error;
        }
    }

    async function retrieveBooking(TUI, TransactionID) {
        try {
            console.log('Retrieving booking details...');
            console.log('TUI:', TUI);
            console.log('TransactionID:', TransactionID);
            console.log('ClientID:', clientID);
            console.log('API URL:', `${import.meta.env.VITE_BASE_URL}/api/flights/retrieve-booking`);
            
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
            console.log('Response status:', response.status);
            
            // Return the response data which contains the booking details
            return response.data;
        } catch (error) {
            console.error('RetrieveBooking error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
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
                    console.log('Booking failed:', statusResponse);
                    const errorMessage = statusResponse.message || statusResponse.errorDetails?.join(' ') || "Booking failed";
                    return { success: false, message: errorMessage, errorCode: statusResponse.errorCode };
                } else if (statusResponse.status === "IN_PROGRESS") {
                    // Still in progress, wait and try again
                    console.log(`Booking still in progress, attempt ${attempts + 1}/${maxAttempts}`);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    attempts++;
                } else {
                    // Handle unexpected status
                    console.log(`Unexpected status: ${statusResponse.status}, attempt ${attempts + 1}/${maxAttempts}`);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    attempts++;
                }
            } catch (error) {
                console.error('Error polling booking status:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                
                // If it's a network error, continue polling
                if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
                    console.log('Network error, continuing to poll...');
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    // For other errors, increment attempts and continue
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
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
                                const pollingResult = await pollBookingStatus(finalTUI, transactionID);
                                
                                if (pollingResult.success) {
                                    alert("✅ Payment and Booking Successful!");
                                    console.log('Navigating to payment success page...');
                                    setTimeout(() => {
                                        navigate("/payment-success");
                                    }, 1000);
                                } else {
                                    const errorMsg = pollingResult.errorCode ? 
                                        `❌ Booking Failed (Code: ${pollingResult.errorCode}): ${pollingResult.message}` :
                                        `❌ Booking Failed: ${pollingResult.message}`;
                                    alert(errorMsg);
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
        <div className="flex gap-2">
            <button
                onClick={handlePayment}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                {loading ? "Processing..." : `Pay ₹${amount}`}
            </button>
            <button
                onClick={testGetItineraryStatus}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm"
            >
                Test API
            </button>
        </div>
    );
};

export default PaymentButton;
