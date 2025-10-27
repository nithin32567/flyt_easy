import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ContactInfoModal from '../../components/modals/ContactInfoModal';
import GuestDetailsModal from '../../components/modals/GuestDetailsModal';
import { User, Users, CreditCard, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { storeHotelItineraryResponse, isHotelItineraryValid } from '../../utils/bookingUtils';

const HotelBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [hotelData, setHotelData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchData, setSearchData] = useState(null);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  
  const [contactInfo, setContactInfo] = useState(null);
  const [guestDetails, setGuestDetails] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [headerHeight, setHeaderHeight] = useState(128);
  
  useEffect(() => {
    const hotelSearchData = JSON.parse(localStorage.getItem('hotelSearchData') || '{}');
    const hotelDetailsData = JSON.parse(localStorage.getItem('hotelDetailsData') || '{}');
    const selectedRoomData = JSON.parse(localStorage.getItem('selectedRoomData') || '{}');
    
    
    setSearchData(hotelSearchData);
    setHotelData(hotelDetailsData);
    setSelectedRoom(selectedRoomData);
    
    if (!hotelSearchData.searchId || (!selectedRoomData.id && !selectedRoomData.roomId)) {
      navigate('/hotel-search');
    }
  }, [navigate]);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const headerDiv = document.querySelector('.header-wrapper-div');
      if (headerDiv) {
        const height = headerDiv.offsetHeight;
        setHeaderHeight(height);
      } else {
        const width = window.innerWidth;
        if (width < 540) {
          setHeaderHeight(80);
        } else if (width < 768) {
          setHeaderHeight(90);
        } else {
          setHeaderHeight(128);
        }
      }
    };

    calculateHeaderHeight();
    setTimeout(calculateHeaderHeight, 100);
    setTimeout(calculateHeaderHeight, 200);

    window.addEventListener('resize', calculateHeaderHeight);
    window.addEventListener('scroll', calculateHeaderHeight);

    return () => {
      window.removeEventListener('resize', calculateHeaderHeight);
      window.removeEventListener('scroll', calculateHeaderHeight);
    };
  }, []);
  
  const handleContactInfoSubmit = (data) => {
    setContactInfo(data);
    setCurrentStep(2);
  };
  
  const handleGuestDetailsSubmit = (data) => {
    setGuestDetails(data);
    setCurrentStep(3);
  };
  
  const handleBookingSubmit = async () => {
    if (!contactInfo || !guestDetails.length || !selectedRoom) {
      alert('Please complete all required information');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const searchTracingKey = localStorage.getItem('searchTracingKey');
      
      if (!token) {
        alert('Session expired. Please login again.');
        navigate('/');
        return;
      }
      
      if (!searchTracingKey) {
        alert('Search session expired. Please search again.');
        navigate('/hotel-search');
        return;
      }
      
      const checkInDate = new Date(searchData?.checkIn);
      const checkOutDate = new Date(searchData?.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkInDate < today) {
        alert('Check-in date must be today or in the future.');
        return;
      }
      
      if (checkOutDate <= checkInDate) {
        alert('Check-out date must be after check-in date.');
        return;
      }
      
      const hotelItineraryPayload = {
        TUI: searchTracingKey,
        ServiceEnquiry: "",
        ContactInfo: {
          Title: contactInfo.title,
          FName: contactInfo.firstName,
          LName: contactInfo.lastName,
          Mobile: contactInfo.mobile,
          Email: contactInfo.email,
          Address: contactInfo.address,
          State: contactInfo.state,
          City: contactInfo.city,
          PIN: contactInfo.pin,
          GSTCompanyName: contactInfo.gstCompanyName || "",
          GSTTIN: contactInfo.gstTin || "",
          GSTMobile: contactInfo.gstMobile || "",
          GSTEmail: contactInfo.gstEmail || "",
          UpdateProfile: false,
          IsGuest: contactInfo.isGuest || false,
          CountryCode: contactInfo.countryCode || "IN",
          MobileCountryCode: contactInfo.mobileCountryCode || "+91",
          NetAmount: selectedRoom.recommendationTotal?.toString() || selectedRoom.totalRate?.toString() || "0",
          DestMobCountryCode: "",
          DestMob: ""
        },
        Auxiliaries: [
          {
            Code: "PROMO",
            Parameters: [
              { Type: "Code", Value: "" },
              { Type: "ID", Value: "" },
              { Type: "Amount", Value: "" }
            ]
          },
          {
            Code: "CUSTOMER DETAILS",
            parameters: [
              { Type: "Nationality", Value: "IN" },
              { Type: "Country of Residence", Value: "IN" }
            ]
          }
        ],

        Rooms: guestDetails.map((room, index) => {
          const adults = room.guests.filter(g => g.paxType === 'A');
          const children = room.guests.filter(g => g.paxType === 'C');
          
          if (adults.length === 0) {
            throw new Error(`Room ${index + 1} must have at least 1 adult.`);
          }
          
          // Get stored room data with child ages from HotelRoomsModal
          const storedRoomData = JSON.parse(localStorage.getItem('hotelRoomData') || '{}');
          const roomData = storedRoomData.roomData || [];
          const currentRoomData = roomData[index];
          
          const pricingData = JSON.parse(localStorage.getItem('hotelPricingData') || '{}');
          const roomGroups = pricingData.pricing?.roomGroup || [];
          
          const roomGroup = roomGroups[index] || roomGroups[0];
          const occupancy = roomGroup?.occupancies?.[0];
          // Use room index (1-based) for occupancyId, not the occupancy ID from pricing data
          const occupancyId = index + 1;
          
          
          let guestCode = '';
          
          if (adults.length > 0) {
            const adultAges = adults.map(() => 25);
            guestCode += `|${occupancyId}|${adults.length}:A:${adultAges.join(':')}`;
          }
          
          if (children.length > 0) {
            // Use child ages from stored room data instead of guest details
            const childAges = currentRoomData?.childAges || children.map(() => 5);
            guestCode += `|${children.length}:C:${childAges.join(':')}`;
          }
          
          guestCode += '|';
          
          
          const roomId = roomGroup?.room?.id;
          
          
          return {
            RoomId: roomId,
            GuestCode: guestCode,
            SupplierName: roomGroup?.providerName,
            RoomGroupId: roomGroup?.id,
            Guests: room.guests.map((guest, guestIndex) => {
              let age;
              if (guest.paxType === 'A') {
                age = "";
              } else if (guest.paxType === 'C') {
                // Use child age from stored room data, maintaining proper chronology
                // Find the correct child index within this room's children
                const childrenInThisRoom = room.guests.filter(g => g.paxType === 'C');
                const childIndexInRoom = childrenInThisRoom.findIndex(g => g === guest);
                const childAge = currentRoomData?.childAges?.[childIndexInRoom] || 5;
                age = childAge;
              }
              
              
              
              return {
                GuestID: "0",
                Operation: "I", // Changed from "U" to "I" for new bookings
                Title: guest.paxType === 'C' ? 'Mstr' : guest.title,
                FirstName: guest.firstName,
                MiddleName: guest.middleName || "",
                LastName: guest.lastName,
                MobileNo: guest.mobileNo || "",
                PaxType: guest.paxType,
                Age: age,
                Email: guest.email || "",
                Pan: guest.pan || "",
                EmployeeId: guest.employeeId || "",
                corporateCompanyID: guest.corporateCompanyId || ""
              };
            })
          };
        }),
        NetAmount: selectedRoom.recommendationTotal?.toString() || selectedRoom.totalRate?.toString() || "0",
        ClientID: localStorage.getItem("ClientID") || "FVI6V120g22Ei5ztGK0FIQ==",
        DeviceID: "",
        AppVersion: "",
        SearchId: searchData?.searchId || "",
        RecommendationId: selectedRoom.recommendationId || selectedRoom.roomId,
        LocationName: searchData?.location || null,
        HotelCode: selectedRoom?.hotelCode || hotelData?.content?.hotel?.id || hotelData?.id || "",
        CheckInDate: searchData?.checkIn ? (() => {
          const [month, day, year] = searchData.checkIn.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        })() : "",
        CheckOutDate: searchData?.checkOut ? (() => {
          const [month, day, year] = searchData.checkOut.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        })() : "",
        TravelingFor: "NTF"
      };
      
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/create-itinerary`,
        hotelItineraryPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'search-tracing-key': searchTracingKey || ''
          }
        }
      );
      
      
      if (response.data.status === 'success') {
        const itineraryData = response.data.itinerary;
        
        
        if (isHotelItineraryValid(itineraryData)) {
          const stored = storeHotelItineraryResponse(itineraryData);
          if (stored) {
          } else {
          }
          
          await initiateHotelPayment(itineraryData);
        } else {
          throw new Error('Invalid itinerary response');
        }
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
      
    } catch (error) {
      console.error('Hotel booking error:', error);
      
      setErrorMessage('Session timed out. Please search again.');
      setShowErrorPopup(true);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiateHotelPayment = async (itineraryData) => {
    try {
      
      const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        alert("Failed to load Razorpay SDK. Please check your connection.");
        return;
      }
      
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/create-razorpay-order`,
        {
          amount: selectedRoom.recommendationTotal || selectedRoom.totalRate,
          currency: 'INR',
          receipt: `hotel_${Date.now()}`,
          notes: {
            hotel: hotelData?.content?.hotel?.name || hotelData?.hotel?.name,
            checkIn: searchData?.checkIn,
            checkOut: searchData?.checkOut,
            transactionId: itineraryData.TransactionID
          }
        }
      );

      if (!orderResponse.data.success) {
        throw new Error('Failed to create payment order');
      }


      const options = {
        key: "rzp_test_9Hi6wVlmuLeJ77",
        amount: orderResponse.data.order.amount,
        currency: orderResponse.data.order.currency,
        name: 'FlytEasy',
        description: `Hotel Booking - ${hotelData?.content?.hotel?.name || hotelData?.hotel?.name}`,
        order_id: orderResponse.data.order.id,
        handler: async function (response) {
          try {

            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/api/hotel/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            );

            if (verifyResponse.data.success) {
              
              await callHotelStartPay(itineraryData);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            alert(`Payment verification failed: ${error.message}`);
          }
        },
        prefill: {
          name: `${contactInfo.firstName} ${contactInfo.lastName}`,
          email: contactInfo.email,
          contact: contactInfo.mobile
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      
      setErrorMessage('Session timed out. Please search again.');
      setShowErrorPopup(true);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  const callHotelStartPay = async (itineraryData) => {
    try {
      
      setIsPaymentProcessing(true);
      setPaymentStatus('Processing payment and confirming booking...');
      
      const token = localStorage.getItem('token');
      const searchTracingKey = localStorage.getItem('searchTracingKey');
      
      const startPayPayload = {
        TransactionID: itineraryData.TransactionID,
        PaymentAmount: selectedRoom.totalRate,
        NetAmount: selectedRoom.totalRate,
        ClientID: localStorage.getItem("ClientID") || "FVI6V120g22Ei5ztGK0FIQ==",
        TUI: searchTracingKey,
        Hold: false,
        Promo: null,
        PaymentType: "",
        BankCode: "",
        GateWayCode: "",
        MerchantID: 0,
        PaymentCharge: 0,
        Card: {
          Number: "",
          Expiry: "",
          CVV: "",
          CHName: "",
          FName: null,
          LName: null,
          Address: "",
          City: "",
          State: "",
          Country: "",
          PIN: "",
          International: false,
          SaveCard: false,
          EMIMonths: "0",
          Token: null,
          NumberAlias: null
        },
        VPA: "",
        CardAlias: "",
        QuickPay: null,
        RMSSignature: "",
        TargetCurrency: "",
        TargetAmount: 0,
        ThirdPartyInfo: null,
        TripType: null,
        Authorization: token,
        QTransactionID: 0,
        OnlinePayment: false,
        DepositPayment: true,
        ReleaseDate: "/Date(-62135596800000)/",
        BrowserKey: "b80b98aafbba086e46e6643566cd67d7",
        BrowserKeyFromToken: "b80b98aafbba086e46e6643566cd67d7",
        AgentInfo: "333-1234-asdf-551234-1-306"
      };


      const startPayResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/start-pay`,
        startPayPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );


      if (startPayResponse.data.success) {
        if (startPayResponse.data.shouldPoll) {
          setPaymentStatus('Booking in progress, please wait...');
          await pollHotelBookingStatus(itineraryData);
        } else if (startPayResponse.data.status === "SUCCESS") {
          setPaymentStatus('Booking confirmed successfully!');
          localStorage.setItem('hotelTransactionID', itineraryData.TransactionID);
          
          setTimeout(() => {
            setIsPaymentProcessing(false);
            navigate('/hotel-booking-confirmation');
          }, 2000);
        }
      } else {
        throw new Error(startPayResponse.data.message || 'StartPay failed');
      }

    } catch (error) {
      console.error('Hotel StartPay error:', error);
      setIsPaymentProcessing(false);
      
      setErrorMessage('Session timed out. Please search again.');
      setShowErrorPopup(true);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  const pollHotelBookingStatus = async (itineraryData) => {
    try {
      
      const token = localStorage.getItem('token');
      const maxAttempts = 10;
      let attempts = 0;

      const pollStatus = async () => {
        attempts++;
        
        const statusResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/hotel/get-itinerary-status`,
          {
            TUI: itineraryData.TUI,
            TransactionID: itineraryData.TransactionID,
            ClientID: localStorage.getItem("ClientID") || "FVI6V120g22Ei5ztGK0FIQ=="
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );


        if (statusResponse.data.success && statusResponse.data.status === "SUCCESS") {
          setPaymentStatus('Booking confirmed successfully!');
          
          localStorage.setItem('hotelTransactionID', itineraryData.TransactionID);
          
          setTimeout(() => {
            setIsPaymentProcessing(false);
            navigate('/hotel-booking-confirmation');
          }, 2000);
        } else if (statusResponse.data.status === "FAILED") {
          setIsPaymentProcessing(false);
          throw new Error(statusResponse.data.message || 'Hotel booking failed');
        } else if (attempts < maxAttempts && statusResponse.data.shouldPoll) {
          setPaymentStatus(`Booking in progress... (${attempts}/${maxAttempts})`);
          setTimeout(pollStatus, 3000);
        } else {
          setIsPaymentProcessing(false);
          throw new Error('Hotel booking timeout - please contact support');
        }
      };

      pollStatus();

    } catch (error) {
      console.error('Hotel booking status polling error:', error);
      setIsPaymentProcessing(false);
      
      setErrorMessage('Session timed out. Please search again.');
      setShowErrorPopup(true);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };
  
  if (!hotelData || !selectedRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--PrimaryColor)] mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" style={{ paddingTop: `${headerHeight}px` }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Complete Your Hotel Booking</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-[var(--PrimaryColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">{hotelData.hotel?.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-[var(--PrimaryColor)]"  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{searchData?.checkIn} to {searchData?.checkOut}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--PrimaryColor)] to-[var(--PrimaryColor)] rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-[var(--PrimaryColor)]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 1 ? 'bg-gradient-to-br from-[var(--PrimaryColor)] to-[var(--PrimaryColor)] text-white shadow-lg' : 'bg-gray-200'}`}>
                <User className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <span className="font-semibold text-lg">Contact Info</span>
                <p className="text-sm text-gray-500">Your contact details</p>
              </div>
            </div>
            
            <div className={`flex-1 h-1 mx-6 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-[var(--PrimaryColor)] to-[var(--PrimaryColor)]' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${currentStep >= 2 ? 'text-[var(--PrimaryColor)]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 2 ? 'bg-gradient-to-br from-[var(--PrimaryColor)] to-[var(--PrimaryColor)] text-white shadow-lg' : 'bg-gray-200'}`}>
                <Users className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <span className="font-semibold text-lg">Guest Details</span>
                <p className="text-sm text-gray-500">Guest information</p>
              </div>
            </div>
            
            <div className={`flex-1 h-1 mx-6 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'bg-gradient-to-r from-[var(--PrimaryColor)] to-[var(--PrimaryColor)]' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${currentStep >= 3 ? 'text-[var(--PrimaryColor)]' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 3 ? 'bg-gradient-to-br from-[var(--PrimaryColor)] to-[var(--PrimaryColor)] text-white shadow-lg' : 'bg-gray-200'}`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <span className="font-semibold text-lg">Payment</span>
                <p className="text-sm text-gray-500">Secure payment</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--PrimaryColor)] to-[var(--PrimaryColor)] rounded-xl flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                    <p className="text-gray-600">Please provide your contact details for the booking</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    We need your contact information to process your hotel booking and send you confirmation details.
                  </p>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full bg-gradient-to-r from-[var(--PrimaryColor)] to-[var(--PrimaryColor)] text-white py-4 px-6 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-center">
                      <User className="w-5 h-5 mr-2" />
                      Add Contact Information
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--PrimaryColor)] to-[var(--PrimaryColor)] rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Guest Details</h2>
                    <p className="text-gray-600">Please provide details for all guests staying in the room</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Add information for all guests who will be staying in the room. This information is required for hotel check-in.
                  </p>
                  <button
                    onClick={() => setIsGuestModalOpen(true)}
                    className="w-full bg-gradient-to-r from-[var(--PrimaryColor)] to-[var(--PrimaryColor)] text-white py-4 px-6 rounded-xl hover:bg-[var(--PrimaryColor)] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-center">
                      <Users className="w-5 h-5 mr-2" />
                      Add Guest Details
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Review & Book</h2>
                    <p className="text-gray-600">Review your details and proceed to payment</p>
                  </div>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">
                        {contactInfo?.title} {contactInfo?.firstName} {contactInfo?.lastName}
                      </p>
                      <p className="text-gray-600">{contactInfo?.email}</p>
                      <p className="text-gray-600">{contactInfo?.mobile}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-[var(--PrimaryColor)]" />
                      Guest Details
                    </h3>
                    {guestDetails.map((room, roomIndex) => (
                      <div key={roomIndex} className="mb-4 last:mb-0">
                        <p className="font-semibold text-gray-800 mb-2">Room {roomIndex + 1}</p>
                        <div className="space-y-1">
                          {room.guests.map((guest, guestIndex) => (
                            <p key={guestIndex} className="text-gray-600 ml-4">
                              {guest.title} {guest.firstName} {guest.lastName}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleBookingSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[var(--YellowColor)] to-[var(--YellowColor)] text-white py-4 px-6 rounded-xl hover:bg-[var(--PrimaryColor)] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-lg"
                >
                  <div className="flex items-center justify-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                  </div>
                </button>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">Booking Successful!</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Your hotel booking has been confirmed. You will receive a confirmation email shortly.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-[var(--YellowColor)] to-[var(--YellowColor)] text-white py-3 px-8 rounded-xl hover:bg-[var(--PrimaryColor)] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 sticky top-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--PrimaryColor)] to-[var(--PrimaryColor)] rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Booking Summary</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[var(--PrimaryColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                        {hotelData?.content?.hotel?.name || hotelData?.hotel?.name}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {hotelData?.content?.hotel?.contact?.address?.[0]?.city || hotelData?.hotel?.contact?.address?.[0]?.city}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[var(--PrimaryColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Stay Details
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Check-in</p>
                      <p className="font-bold text-gray-900">{searchData?.checkIn}</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Check-out</p>
                      <p className="font-bold text-gray-900">{searchData?.checkOut}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[var(--PrimaryColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                    </svg>
                    Room Information
                  </h5>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Room Type</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {selectedRoom?.room?.name || selectedRoom?.roomName || 'Selected Room'}
                      </p>
                      {selectedRoom?.room?.description && (
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{selectedRoom.room.description}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Occupancy</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {selectedRoom?.occupancies?.[0]?.numOfAdults || 0} Adults
                        </p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {selectedRoom?.occupancies?.[0]?.numOfChildren || 0} Children
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Board Basis</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {selectedRoom?.boardBasis?.description || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Provider</p>
                      <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                        <p className="font-semibold text-indigo-900">{selectedRoom?.providerName}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[var(--PrimaryColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Room Features
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom?.refundable && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Refundable
                      </span>
                    )}
                    {selectedRoom?.onlineCancellable && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Online Cancellable
                      </span>
                    )}
                    {selectedRoom?.specialRequestSupported && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Special Requests
                      </span>
                    )}
                    {selectedRoom?.room?.smokingAllowed === false && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Non-Smoking
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Price Breakdown
                  </h5>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Base Rate</span>
                      <span className="font-semibold text-gray-900">₹{selectedRoom?.baseRate?.toLocaleString() || '0'}</span>
                    </div>
                    
                    {selectedRoom?.taxes && selectedRoom.taxes.length > 0 && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Taxes & Fees</span>
                        <span className="font-semibold text-gray-900">₹{selectedRoom.taxes.reduce((sum, tax) => sum + tax.amount, 0).toLocaleString()}</span>
                      </div>
                    )}
                    
                    {selectedRoom?.commission && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-green-600">Commission</span>
                        <span className="font-semibold text-green-600">₹{selectedRoom.commission.amount?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-green-200 pt-3 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                        <span className="text-2xl font-bold text-green-600">₹{(selectedRoom?.recommendationTotal || selectedRoom?.totalRate || '0').toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ContactInfoModal
        isOpen={isContactModalOpen}
        setIsOpen={setIsContactModalOpen}
        onApply={handleContactInfoSubmit}
        initial={contactInfo}
      />
      
      <GuestDetailsModal
        isOpen={isGuestModalOpen}
        setIsOpen={setIsGuestModalOpen}
        onApply={handleGuestDetailsSubmit}
        roomCount={searchData?.rooms || 1}
        adults={searchData?.adults || 1}
        children={searchData?.children || 0}
        roomData={searchData?.roomData || null}
      />
      
      {isPaymentProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--PrimaryColor)] mx-auto mb-4"></div>
              
              <div className="mb-4">
                <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--PrimaryColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Your Hotel Booking
              </h3>
              
              <p className="text-gray-600 mb-4">
                {paymentStatus}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-[var(--PrimaryColor)] h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Please don't close this window</p>
                <p>This may take a few moments...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Session Timeout
              </h3>
              
              <p className="text-gray-600 mb-6">
                {errorMessage}
              </p>
              
              <div className="text-sm text-gray-500 mb-4">
                <p>Redirecting to home page in 3 seconds...</p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelBooking;
