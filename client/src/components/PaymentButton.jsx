import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useWebSettingsData } from "../hooks/useWebSettingsData";

const PaymentButton = ({ amount, name, email, contact, TUI }) => {
    const token = localStorage.getItem("token");
    const transactionID = JSON.parse(localStorage.getItem("TransactionID"));
    const clientID = localStorage.getItem("ClientID");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // WebSettings hook for payment gateway ordering
    const { getPaymentGateways } = useWebSettingsData();
    
    // Get payment gateway order from WebSettings
    const paymentGatewayOrder = getPaymentGateways();
    
    // Get the primary payment gateway code
    const getPrimaryGatewayCode = () => {
        if (paymentGatewayOrder && paymentGatewayOrder.length > 0) {
            return paymentGatewayOrder[0].Code || "";
        }
        return ""; // Default to empty if no gateway specified
    };
    
    // Use the itinerary TUI if available, otherwise fall back to the passed TUI
    const finalTUI = localStorage.getItem("itineraryTUI") || TUI;
    
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
            const testTUI = finalTUI || "test-tui-123";
            const testTransactionID = transactionID || "test-transaction-123";
            
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/test-get-itinerary-status-simple`, {
                TUI: testTUI,
                TransactionID: testTransactionID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            
            
            alert(`Test successful! Status: ${response.data.status}, Message: ${response.data.message}`);
        } catch (error) {
            alert(`Test failed: ${error.message}`);
        }
    };

    async function startPay() {
        // Validate TransactionID
        if (!transactionID || transactionID === 0) {
            throw new Error('Invalid TransactionID. Please create itinerary first.');
        }
        
        const payload = {
            TransactionID: transactionID,
            PaymentAmount: String(amount), // Fixed: Should be string with double quotes
            NetAmount: String(amount), // Fixed: Should be string with double quotes
            BrowserKey: "caecd3cd30225512c1811070dce615c1",
            ClientID: clientID,
            TUI: finalTUI,
            Hold: false,
            Promo: null,
            PaymentType: "",
            BankCode: "",
            GateWayCode: getPrimaryGatewayCode(), // Use primary gateway from WebSettings
            MerchantID: "",
            PaymentCharge: "0", // Fixed: Should be string
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
            TargetAmount: "0", // Fixed: Should be string
            ServiceType: "ITI"
        }
        
        console.log('=== FRONTEND: FLIGHT START PAY API CALL ===');
        console.log('Flight Start Pay Payload ===>');
        console.log(JSON.stringify(payload, null, 2));
        console.log('=== END FLIGHT START PAY PAYLOAD ===');
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/startpay`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            
            console.log('=== FRONTEND: FLIGHT START PAY API RESPONSE ===');
            console.log('Flight Start Pay Response JSON ===>');
            console.log(JSON.stringify(response.data, null, 2));
            console.log('=== END FLIGHT START PAY RESPONSE ===');
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async function getItineraryStatus(TUI, TransactionID) {
        try {
            const payload = {
                TUI: TUI,
                TransactionID: TransactionID,
                ClientID: clientID
            };
            
            console.log('=== FRONTEND: FLIGHT GET ITINERARY STATUS API CALL ===');
            console.log('Flight Get Itinerary Status Payload ===>');
            console.log(JSON.stringify(payload, null, 2));
            console.log('=== END FLIGHT GET ITINERARY STATUS PAYLOAD ===');
            
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/get-itinerary-status`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            
            console.log('=== FRONTEND: FLIGHT GET ITINERARY STATUS API RESPONSE ===');
            console.log('Flight Get Itinerary Status Response JSON ===>');
            console.log(JSON.stringify(response.data, null, 2));
            console.log('=== END FLIGHT GET ITINERARY STATUS RESPONSE ===');
            
            return response.data;
        } catch (error) {
            // console.error('=== GET ITINERARY STATUS ERROR ===');
            // console.error('Error message:', error.message);
            // console.error('Error code:', error.code);
            // console.error('Error response status:', error.response?.status);
            // console.error('Error response data:', JSON.stringify(error.response?.data, null, 2));
            // console.error('Error response headers:', error.response?.headers);
            // console.error('Full error object:', error);
            // console.error('==================================');
            throw error;
        }
    }

    async function retrieveBooking(TUI, TransactionID) {
        try {
            const payload = {
                TUI: TUI,
                ReferenceNumber: TransactionID,
                ReferenceType: "T",
                ClientID: clientID
            };
            
            console.log('=== FRONTEND: FLIGHT RETRIEVE BOOKING API CALL ===');
            console.log('Flight Retrieve Booking Payload ===>');
            console.log(JSON.stringify(payload, null, 2));
            console.log('=== END FLIGHT RETRIEVE BOOKING PAYLOAD ===');
            
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/retrieve-booking`, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            
            console.log('=== FRONTEND: FLIGHT RETRIEVE BOOKING API RESPONSE ===');
            console.log('Flight Retrieve Booking Response JSON ===>');
            console.log(JSON.stringify(response.data, null, 2));
            console.log('=== END FLIGHT RETRIEVE BOOKING RESPONSE ===');
            
            return response.data;
        } catch (error) {
            // console.error('=== RETRIEVE BOOKING ERROR ===');
            // console.error('Error message:', error.message);
            // console.error('Error code:', error.code);
            // console.error('Error response status:', error.response?.status);
            // console.error('Error response data:', JSON.stringify(error.response?.data, null, 2));
            // console.error('Error response headers:', error.response?.headers);
            // console.error('Full error object:', error);
            // console.error('==============================');
            throw error;
        }
    }

    async function pollBookingStatus(TUI, TransactionID, maxAttempts = 30) {
        let attempts = 0;
        
        // console.log('=== STARTING BOOKING STATUS POLLING ===');
        // console.log('TUI:', TUI);
        // console.log('TransactionID:', TransactionID);
        // console.log('Max Attempts:', maxAttempts);
        // console.log('=======================================');
        
        while (attempts < maxAttempts) {
            try {
                // console.log(`\n--- Polling Attempt ${attempts + 1}/${maxAttempts} ---`);
                const statusResponse = await getItineraryStatus(TUI, TransactionID);
                
                // console.log('Status Response Analysis:');
                // console.log('- Status:', statusResponse.status);
                // console.log('- Success:', statusResponse.success);
                // console.log('- Should Poll:', statusResponse.shouldPoll);
                // console.log('- Message:', statusResponse.message);
                // console.log('- CurrentStatus from API:', statusResponse.data?.CurrentStatus);
                // console.log('- PaymentStatus from API:', statusResponse.data?.PaymentStatus);
                // console.log('- Code from API:', statusResponse.data?.Code);
                // console.log('- Waiting for CurrentStatus to be Success or Failed...');
                
                // Check if the status response indicates completion
                if (statusResponse.status === "SUCCESS") {
                    // console.log('✅ Booking completed successfully! Calling RetrieveBooking...');
                    // Only call RetrieveBooking after GetItineraryStatus returns Success
                    const bookingResponse = await retrieveBooking(TUI, TransactionID);
                    if (bookingResponse.success) {
                        localStorage.setItem("bookingDetails", JSON.stringify(bookingResponse.data));
                        // console.log('✅ Booking details retrieved and stored successfully');
                        return { success: true, bookingData: bookingResponse.data };
                    } else {
                        // console.error('❌ Failed to retrieve booking details:', bookingResponse);
                        return { success: false, message: "Failed to retrieve booking details" };
                    }
                } else if (statusResponse.status === "FAILED") {
                    const errorMessage = statusResponse.message || statusResponse.errorDetails?.join(' ') || "Booking failed";
                    // console.log('❌ Booking failed:', errorMessage);
                    return { success: false, message: errorMessage, errorCode: statusResponse.errorCode };
                } else if (statusResponse.status === "IN_PROGRESS" || statusResponse.shouldPoll) {
                    // Still in progress, wait and try again
                    // console.log('⏳ Booking still in progress, waiting 2 seconds before next attempt...');
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    attempts++;
                } else {
                    // Handle unexpected status
                    // console.log('⚠️ Unexpected status received, continuing to poll...');
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    attempts++;
                }
            } catch (error) {
                // console.error('❌ Error polling booking status:', error);
                // console.error('Error details:', {
                //     message: error.message,
                //     response: error.response?.data,
                //     status: error.response?.status
                // });
                
                // If it's a network error, continue polling
                if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
                    // console.log('🔄 Network error detected, continuing to poll...');
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    // For other errors, increment attempts and continue
                    // console.log('🔄 Error occurred, continuing to poll...');
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }
        
        // console.log('⏰ Polling timeout reached after', maxAttempts, 'attempts');
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
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/razorpay/bookFlight`, {
                amount: amount,
            });

            const options = {
                key: "rzp_test_9Hi6wVlmuLeJ77",
                amount: response.data.order.amount,
                currency: response.data.order.currency,
                name: "Flyteasy Booking",
                description: "Flight Payment",
                order_id: response.data.order.id,
                handler: async function (response) {
                    try {
                        // 2. Verify payment signature
                        const verify = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/razorpay/verifyPayment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        if (verify.data.success) {
                            
                            // 3. Start payment process
                            try {
                                const startPayResponse = await startPay();
                            
                                if (startPayResponse.shouldPoll) {
                                    // 4. Poll for booking status
                                    const pollingResult = await pollBookingStatus(finalTUI, transactionID);
                                    
                                    if (pollingResult.success) {
                                        alert("✅ Payment and Booking Successful!");
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
                            } catch (startPayError) {
                                // console.error('StartPay error:', startPayError);
                                alert(`❌ Payment Processing Failed: ${startPayError.message}`);
                                navigate("/payment-error");
                            }
                        } else {
                            // console.error('Payment verification failed:', verify.data);
                            alert("❌ Payment Verification Failed!");
                        }
                    } catch (error) {
                        // console.error('Error in payment verification:', error);
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

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", function (response) {
                // console.error('Payment failed:', response);
                alert(`❌ Payment Failed: ${response.error.description}`);
                setLoading(false);
            });
        } catch (err) {
            // console.error('Error in handlePayment:', err);
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
