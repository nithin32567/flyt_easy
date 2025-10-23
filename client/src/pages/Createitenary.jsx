import React, { useState, useEffect } from 'react';
import ContactInfoForm from '../components/ContactInfoForm';
import TravelersList from '../components/TravelersList';
import SSRToggle from '../components/SSRToggle';
import SSRServicesSelection from '../components/SSRServicesSelection';
import { User, Users, Package, CheckCircle } from 'lucide-react';
import { validateItinerary } from '../utils/validation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PaymentButton from '../components/PaymentButton';
import TravelCheckListDisplay from '../components/TravelCheckListDisplay';
import { useWebSettingsData } from '../hooks/useWebSettingsData';
import { clearBookingData } from '../utils/clearBookingData';
import useHeaderHeight from '../hooks/useHeaderHeight';

const Createitenary = () => {
  const headerHeight = useHeaderHeight();
  const [currentStep, setCurrentStep] = useState(1);
  const [contactInfo, setContactInfo] = useState(null);
  const [travelers, setTravelers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [ssrEnabled, setSsrEnabled] = useState(false);
  const [availableSSRServices, setAvailableSSRServices] = useState([]);
  const [selectedSSRServices, setSelectedSSRServices] = useState([]);
  const [loadingSSR, setLoadingSSR] = useState(false);
  const [isDataValid, setIsDataValid] = useState(false);
  const pricerTUI = localStorage.getItem("pricerTUI")
  const pricerDataString = localStorage.getItem("pricerData");
  const pricerData = pricerDataString ? JSON.parse(pricerDataString) : null;
  // const reviewData = JSON.parse(localStorage.getItem("oneWayReviewData"));
  const netAmount = localStorage.getItem("netamount") // Use the exact value without parsing
  
  // Hotel booking detection - only true if we're specifically in hotel booking flow
  const hotelSearchDataString = localStorage.getItem("hotelSearchData");
  const hotelSearchData = hotelSearchDataString ? JSON.parse(hotelSearchDataString) : null;
  const isHotelBooking = !!hotelSearchData && localStorage.getItem("bookingType") === "hotel";
  const hotelSearchTracingKey = localStorage.getItem("searchTracingKey");
  const [itenarySuccess, setItenarySuccess] = useState(false);
  const [travelCheckListData, setTravelCheckListData] = useState(null);
  const navigate = useNavigate();
  
  // Get search payload to determine traveler count
  const searchPayloadString = localStorage.getItem("searchPayload");
  const searchPayload = searchPayloadString ? JSON.parse(searchPayloadString) : null;
  
  // WebSettings hook for airline feature support
  const { isAirlineSupported, getAirlineFeatures, webSettings } = useWebSettingsData();

  // Function to generate travelers based on search payload
  const generateTravelersFromSearchPayload = () => {
    if (!searchPayload) return [];
    
    const generatedTravelers = [];
    let travelerId = 1;
    
    // Add adults
    for (let i = 0; i < searchPayload.ADT; i++) {
      generatedTravelers.push({
        ID: travelerId++,
        Title: '',
        FName: '',
        LName: '',
        PTC: 'ADT',
        Age: '',
        Gender: '',
        Nationality: '',
        DOB: '',
        PassportNo: '',
        PLI: '',
        PDOE: '',
        VisaType: ''
      });
    }
    
    // Add children
    for (let i = 0; i < searchPayload.CHD; i++) {
      generatedTravelers.push({
        ID: travelerId++,
        Title: '',
        FName: '',
        LName: '',
        PTC: 'CHD',
        Age: '',
        Gender: '',
        Nationality: '',
        DOB: '',
        PassportNo: '',
        PLI: '',
        PDOE: '',
        VisaType: ''
      });
    }
    
    // Add infants
    for (let i = 0; i < searchPayload.INF; i++) {
      generatedTravelers.push({
        ID: travelerId++,
        Title: '',
        FName: '',
        LName: '',
        PTC: 'INF',
        Age: '',
        Gender: '',
        Nationality: '',
        DOB: '',
        PassportNo: '',
        PLI: '',
        PDOE: '',
        VisaType: ''
      });
    }
    
    return generatedTravelers;
  };

  // Function to generate travelers based on hotel search data
  const generateTravelersFromHotelData = () => {
    if (!hotelSearchData) return [];
    
    const generatedTravelers = [];
    let travelerId = 1;
    
    // For hotel bookings, we generate travelers based on total adults and children
    // Each room can have multiple adults/children
    const totalAdults = hotelSearchData.adults || 1;
    const totalChildren = hotelSearchData.children || 0;
    
    // Add adults
    for (let i = 0; i < totalAdults; i++) {
      generatedTravelers.push({
        ID: travelerId++,
        Title: '',
        FName: '',
        LName: '',
        PTC: 'ADT',
        Age: '',
        Gender: '',
        Nationality: '',
        DOB: '',
        PassportNo: '',
        PLI: '',
        PDOE: '',
        VisaType: ''
      });
    }
    
    // Add children
    for (let i = 0; i < totalChildren; i++) {
      generatedTravelers.push({
        ID: travelerId++,
        Title: '',
        FName: '',
        LName: '',
        PTC: 'CHD',
        Age: '',
        Gender: '',
        Nationality: '',
        DOB: '',
        PassportNo: '',
        PLI: '',
        PDOE: '',
        VisaType: ''
      });
    }
    
    return generatedTravelers;
  };


  // Use the TUI from pricerData (GetPricer response) instead of the old pricerTUI
  // For hotel bookings, use the searchTracingKey as TUI
  const currentTUI = isHotelBooking ? hotelSearchTracingKey : (pricerData?.TUI || pricerTUI);
  
  // Use NetAmount directly from pricerData to avoid any conversion issues
  // For hotel bookings, get NetAmount from hotel booking data or use a default
  const netAmountNumber = isHotelBooking ? 
    (hotelSearchData?.netAmount || 0) : 
    (pricerData?.NetAmount || (netAmount ? Number(netAmount) : 0));
  
  // Calculate total amount including SSR services
  const calculateTotalAmount = () => {
    const baseAmount = netAmountNumber;
    const paidSSRServices = selectedSSRServices.filter(service => service.Charge > 0);
    // Since SSR is applied to first passenger only, don't multiply by travelers.length
    const ssrAmount = paidSSRServices.reduce((total, service) => {
      const amount = service.SSRNetAmount || service.Charge;
      return total + amount; // Don't multiply by travelers.length
    }, 0);
    return baseAmount + ssrAmount;
  };
  
  const totalAmountWithSSR = calculateTotalAmount();
  
  
  // Validate data and generate travelers in useEffect to avoid setState during render
  useEffect(() => {
    
    // For hotel bookings, validate hotel data
    if (isHotelBooking) {
      if (!hotelSearchData) {
        alert('Missing hotel search data. Please try searching for hotels again.');
        navigate('/');
        return;
      }
      
      if (!hotelSearchTracingKey) {
        alert('Missing hotel search tracing key. Please try searching for hotels again.');
        navigate('/');
        return;
      }
      
      // For hotel bookings, we need to ensure NetAmount is available
      if (!hotelSearchData.netAmount && netAmountNumber === 0) {
        console.warn('Hotel booking NetAmount not found, using default value');
        // You might want to prompt the user or redirect to hotel selection
      }
    } else {
      // For flight bookings, validate flight data
      if (!pricerData) {
        alert('Missing pricing data. Please try searching for flights again.');
        navigate('/');
        return;
      }
      
      if (!pricerData.TUI && !pricerTUI) {
        alert('Missing pricing TUI. Please try searching for flights again.');
        navigate('/');
        return;
      }
    }
    
    // Clear any existing booking data to avoid conflicts
    localStorage.removeItem("TransactionID");
    localStorage.removeItem("itineraryTUI");
    
    // Generate travelers based on search payload if travelers array is empty
    if (travelers.length === 0) {
      if (isHotelBooking && hotelSearchData) {
        // Generate travelers for hotel booking based on rooms, adults, children
        const generatedTravelers = generateTravelersFromHotelData();
        setTravelers(generatedTravelers);
      } else if (searchPayload) {
        // Generate travelers for flight booking
        const generatedTravelers = generateTravelersFromSearchPayload();
        setTravelers(generatedTravelers);
      }
    }
    
    setIsDataValid(true);
  }, [pricerData, pricerTUI, navigate, searchPayload, travelers.length, isHotelBooking, hotelSearchData, hotelSearchTracingKey]);

  // proper date validation with current date should be added 

  // Sample data for testing


  const steps = [
    { id: 1, title: 'Contact Information', icon: User },
    { id: 2, title: 'Travelers', icon: Users },
    { id: 3, title: 'Additional Services', icon: Package },
    { id: 4, title: 'Review & Submit', icon: CheckCircle }
  ];

  const handleContactInfoSave = (data) => {
    setContactInfo(data);
    setCurrentStep(2);
  };

  const handleTravelersChange = (newTravelers) => {
    setTravelers(newTravelers);
  };

  // SSR Functions
  const fetchSSRServices = async () => {
    if (!currentTUI) return;
    
    // Check if session is too old (more than 30 minutes)
    const sessionStartTime = localStorage.getItem('sessionStartTime');
    if (sessionStartTime) {
      const sessionAge = Date.now() - parseInt(sessionStartTime);
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
      
      if (sessionAge > thirtyMinutes) {
        alert('Your session has expired. Please search for flights again to get fresh pricing.');
        navigate('/');
        return;
      }
    }
    
    setLoadingSSR(true);
    try {
      // WebSettings is now called after ExpressSearch, no need to call it here
      
      const ssrPayload = {
        TUI: currentTUI,
        PaidSSR: true, // Always request paid SSR services when fetching
        FareType: pricerData?.FareType || "ON", // Add FareType from pricerData
        Amount: netAmountNumber // Pass the NetAmount from GetSPricer
      };
      
      console.log("=== SSR API CALL (fetchSSRServices) ===");
      console.log("SSR Payload:", JSON.stringify(ssrPayload, null, 2));
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/flights/get-ssr-services`,
        ssrPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      console.log("SSR Response Data:", JSON.stringify(response.data, null, 2));
      console.log("=====================================");

      if (response.data.success) {
        const services = response.data.data.services || [];
        setAvailableSSRServices(services);
      }
    } catch (error) {
      // Error fetching SSR services
    } finally {
      setLoadingSSR(false);
    }
  };

  const handleSSRToggle = (enabled) => {
    // Check if airline supports SSR before enabling
    if (enabled && pricerData?.Trips) {
      const trip = pricerData.Trips[0]; // Get first trip
      const airlineCode = trip?.Segments?.[0]?.AirlineCode;
      const isDomestic = trip?.IsDomestic;
      
      if (airlineCode && !isAirlineSupported(airlineCode, 'SSR', isDomestic)) {
        alert(`SSR services are not available for ${airlineCode} airline`);
        return;
      }
    }
    
    setSsrEnabled(enabled);
    if (enabled) {
      fetchSSRServices();
    } else {
      setAvailableSSRServices([]);
      setSelectedSSRServices([]);
    }
  };

  const handleSSRServiceSelection = (services) => {
    setSelectedSSRServices(services);
  };

  // Handle SSR fare changes
  const handleSSRFareChange = (message) => {
    if (message && message.includes('change in the ssr fare')) {
      const match = message.match(/Previous Amt:-?(\d+\.?\d*)\s*\|\s*New Amt:-?(\d+\.?\d*)/);
      if (match) {
        const previousAmount = parseFloat(match[1]);
        const newAmount = parseFloat(match[2]);
        const difference = newAmount - previousAmount;
        
        // Show user-friendly message with better guidance
        const userMessage = `SSR fare has changed by ₹${Math.abs(difference).toLocaleString()}. ` +
          `Previous amount: ₹${previousAmount.toLocaleString()}, ` +
          `New amount: ₹${newAmount.toLocaleString()}. ` +
          `\n\nThis usually happens when:\n` +
          `• The pricing session has expired\n` +
          `• The airline has updated their SSR prices\n` +
          `• There's a temporary pricing issue\n\n` +
          `Please try refreshing the page and selecting your services again, or choose a different flight.`;
        
        return userMessage;
      }
    }
    return message;
  };

  const handleNextToSSR = () => {
    // Validate travelers before proceeding
    if (searchPayload) {
      const { ADT, CHD, INF } = searchPayload;
      const totalRequired = ADT + CHD + INF;
      
      if (travelers.length < totalRequired) {
        alert(`Please add ${totalRequired} travelers. Required: ${ADT} adults, ${CHD} children, ${INF} infants`);
        return;
      }
      
      const incompleteTravelers = travelers.filter(t => !t.FName || !t.LName || !t.DOB || !t.Gender || !t.Nationality);
      if (incompleteTravelers.length > 0) {
        alert('Please complete all traveler details. Click "Edit" on each traveler to fill in missing information.');
        return;
      }
    }
    
    setCurrentStep(3);
  };

  const handleNextToReview = () => {
    setCurrentStep(4);
  };

  // Handle hotel booking submission
  const handleHotelBookingSubmit = async () => {
    try {
      console.log("=== HOTEL BOOKING SUBMISSION ===");
      console.log("Using searchTracingKey as TUI:", hotelSearchTracingKey);
      console.log("Hotel search data:", hotelSearchData);
      
      // Prepare hotel itinerary payload
      const hotelItineraryPayload = {
        TUI: hotelSearchTracingKey,
        ServiceEnquiry: "",
        ContactInfo: {
          Title: contactInfo?.Title || "Mr",
          FName: contactInfo?.FName || "",
          LName: contactInfo?.LName || "",
          Mobile: contactInfo?.Mobile || "",
          Email: contactInfo?.Email || "",
          Address: contactInfo?.Address || "",
          State: contactInfo?.State || "",
          City: contactInfo?.City || "",
          PIN: contactInfo?.PIN || "",
          GSTCompanyName: contactInfo?.GSTCompanyName || "",
          GSTTIN: contactInfo?.GSTTIN || "",
          GSTMobile: contactInfo?.GSTMobile || "",
          GSTEmail: contactInfo?.GSTEmail || "",
          UpdateProfile: false,
          IsGuest: contactInfo?.IsGuest || false,
          CountryCode: contactInfo?.CountryCode || "IN",
          MobileCountryCode: contactInfo?.MobileCountryCode || "+91",
          NetAmount: netAmountNumber,
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
        Rooms: travelers.map((traveler, index) => ({
          RoomId: `room_${index}`,
          GuestCode: `|1|1:A:25|`,
          SupplierName: "Travex",
          RoomGroupId: `roomgroup_${index}`,
          Guests: [{
            GuestID: `guest_${index}`,
            Operation: "U",
            Title: traveler.Title || "Mr",
            FirstName: traveler.FName || "",
            MiddleName: "",
            LastName: traveler.LName || "",
            MobileNo: contactInfo?.Mobile || "",
            PaxType: traveler.PTC === "ADT" ? "A" : "C",
            Age: traveler.Age || "",
            Email: contactInfo?.Email || "",
            Pan: traveler.PassportNo || "",
            ProfileType: "T",
            EmployeeId: "",
            corporateCompanyID: ""
          }]
        })),
        NetAmount: netAmountNumber.toString(),
        ClientID: localStorage.getItem("ClientID") || "",
        DeviceID: "",
        AppVersion: "",
        SearchId: hotelSearchData?.searchId || "",
        RecommendationId: hotelSearchData?.searchId || "",
        LocationName: hotelSearchData?.location?.name || null,
        HotelCode: hotelSearchData?.hotelCode || "",
        CheckInDate: hotelSearchData?.checkIn || "",
        CheckOutDate: hotelSearchData?.checkOut || "",
        TravelingFor: "NTF"
      };

      console.log("=== HOTEL CREATE ITINERARY PAYLOAD ===");
      console.log("Payload being sent:", JSON.stringify(hotelItineraryPayload, null, 2));
      console.log("=== END PAYLOAD ===");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/create-itinerary`,
        hotelItineraryPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "search-tracing-key": hotelSearchTracingKey
          }
        }
      );

      console.log("=== HOTEL CREATE ITINERARY RESPONSE ===");
      console.log("Response Status:", response.status);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));
      console.log("=== END RESPONSE ===");

      if (response.data.success) {
        localStorage.setItem("TransactionID", response.data.data.TransactionID);
        if (response.data.data.TUI) {
          localStorage.setItem("itineraryTUI", response.data.data.TUI);
        }
        setItenarySuccess(true);
      } else {
        alert(`Failed to create hotel itinerary: ${response.data.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error("Hotel booking submission error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create hotel itinerary';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleSubmit = async () => {
    // Validate the complete itinerary
    const validation = validateItinerary(contactInfo, travelers);
    setValidationErrors(validation.errors);

    if (validation.isValid) {
      // Handle hotel bookings differently
      if (isHotelBooking) {
        await handleHotelBookingSubmit();
        return;
      }
      // Check if session is too old (more than 30 minutes)
      const sessionStartTime = localStorage.getItem('sessionStartTime');
      if (sessionStartTime) {
        const sessionAge = Date.now() - parseInt(sessionStartTime);
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        if (sessionAge > thirtyMinutes) {
          alert('Your session has expired. Please search for flights again to get fresh pricing.');
          navigate('/');
          return;
        }
      }
      
      // Additional validation for required data
      if (!currentTUI) {
        alert('Missing pricing data. Please try searching for flights again.');
        return;
      }
      
      if (!netAmountNumber || netAmountNumber <= 0) {
        alert('Invalid pricing data. Please try searching for flights again.');
        return;
      }

      const itineraryData = {
        ContactInfo: contactInfo,
        Travellers: travelers
      };

      try {
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }

        // Clear any existing Transaction ID to avoid duplicate ID errors
        localStorage.removeItem("TransactionID");
        localStorage.removeItem("itineraryTUI");
        
        // Get fresh pricing data to ensure NetAmount is correct
        // This is critical to avoid TUI/NetAmount mismatch errors
        
        let finalNetAmount = netAmountNumber;
        let freshTUI = currentTUI;
        try {
          const payload = {
            TUI: currentTUI,
            token: localStorage.getItem("token"),
            ClientID: localStorage.getItem("ClientID")
          };
          
          console.log("=== GET PRICER API CALL (CreateItinerary) ===");
          console.log("Final Payload being sent:", JSON.stringify(payload, null, 2));
          console.log("=============================================");
          
          const pricingResponse = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/flights/get-pricer`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

          console.log("=== GET PRICER API RESPONSE (CreateItinerary) ===");
          console.log("Response Status:", pricingResponse.status);
          console.log("Response Headers:", pricingResponse.headers);
          console.log("Response Data:", JSON.stringify(pricingResponse.data, null, 2));
          console.log("Full Response Object:", pricingResponse);
          console.log("===============================================");
          
          if (pricingResponse.data.Code === "200" && pricingResponse.data.data) {
            finalNetAmount = Number(pricingResponse.data.data.NetAmount) || netAmountNumber;
            freshTUI = pricingResponse.data.data.TUI || currentTUI;
            
            // Update localStorage with fresh data
            localStorage.setItem("pricerData", JSON.stringify(pricingResponse.data.data));
            localStorage.setItem("netamount", pricingResponse.data.data.NetAmount.toString());
            localStorage.setItem("pricerTUI", freshTUI);
          }
        } catch (pricingError) {
          console.log("=== GET PRICER API ERROR (CreateItinerary) ===");
          console.error("Error calling get-pricer API:", pricingError);
          console.log("Error object:", JSON.stringify(pricingError, null, 2));
          console.log("=============================================");
          // Error getting fresh pricing, using stored amount
        }

        // Get Travel Check List after getPricer (REQUIRED before CreateItinerary)
        let travelCheckListData = null;
        try {
          const checkListPayload = {
            TUI: freshTUI,
            ClientID: localStorage.getItem("ClientID")
          };
          
          
          const checkListResponse = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/flights/get-travel-check-list`,
            checkListPayload,
            { headers }
          );
          
          
          if (checkListResponse.data.success) {
            travelCheckListData = checkListResponse.data.data;
            setTravelCheckListData(travelCheckListData);
            
            // Store travel checklist data for potential use
            localStorage.setItem("travelCheckList", JSON.stringify(travelCheckListData));
          } else {
          }
        } catch (checkListError) {
          console.error('Failed to fetch travel checklist', {
            message: checkListError.message,
            response: checkListError.response?.data,
            status: checkListError.response?.status
          });
          // Continue with CreateItinerary even if travel checklist fails
        }

        // Refresh SSR services to get updated pricing before creating itinerary
        let updatedSSRServices = selectedSSRServices;
        if (selectedSSRServices.length > 0) {
          try {
            
            // WebSettings is now called after ExpressSearch, no need to call it here
            
            const ssrPayload = {
              TUI: freshTUI,
              PaidSSR: true,
              FareType: pricerData?.FareType || "ON",
              Amount: finalNetAmount
            };
            
            console.log("=== SSR API CALL (handleSubmit - refresh SSR) ===");
            console.log("SSR Payload:", JSON.stringify(ssrPayload, null, 2));
            
            const ssrResponse = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/api/flights/get-ssr-services`,
              ssrPayload,
              {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
              }
            );
            
            console.log("SSR Response Data:", JSON.stringify(ssrResponse.data, null, 2));
            console.log("==================================================");

            if (ssrResponse.data.success) {
              const freshServices = ssrResponse.data.data.services || [];
              // Update selected services with fresh pricing
              updatedSSRServices = selectedSSRServices.map(selectedService => {
                const freshService = freshServices.find(service => service.ID === selectedService.ID);
                return freshService || selectedService;
              });
            }
          } catch (ssrError) {
          }
        }

        // Filter out free services (Charge: 0) - only send paid services
        const paidSSRServices = updatedSSRServices.filter(service => service.Charge > 0);
        // Note: SSR amount will be calculated by the API based on SSR data
        
        // Convert SSR services to the correct format for the API
        // The API expects SSR array with FUID, PaxID, and SSID fields
        // Each SSR service should be mapped to each passenger
        const ssrForAPI = [];
        
        // Get FUID from pricer data - extract from Trips structure
        let fuidMapping = {};
        if (pricerData && pricerData.Trips) {
          pricerData.Trips.forEach((trip, tripIndex) => {
            if (trip.Journey) {
              trip.Journey.forEach((journey, journeyIndex) => {
                if (journey.Segments) {
                  journey.Segments.forEach((segment, segmentIndex) => {
                    if (segment.FUID) {
                      // Map FUID to trip and journey for proper SSR assignment
                      const key = `${tripIndex}-${journeyIndex}-${segmentIndex}`;
                      fuidMapping[key] = segment.FUID;
                    }
                  });
                }
              });
            }
          });
        }
        
        
        // If no FUID mapping found, use default values based on trip type
        const defaultFUIDs = pricerData?.FareType === 'RT' ? [1, 2] : [1];
        
        // Apply SSR services per passenger selection
        // If user selected 1 baggage, it should only apply to 1 passenger, not all
        paidSSRServices.forEach(service => {
          // For now, apply the service to the first passenger only
          // This matches the user's expectation: "1 baggage for 1 passenger"
          const firstTraveler = travelers[0];
          const fuidToUse = defaultFUIDs[0]; // Use first FUID for simplicity
          
          ssrForAPI.push({
            FUID: fuidToUse, // Flight Unique ID from pricer data
            PaxID: firstTraveler.ID || 1, // Apply to first passenger only
            SSID: service.ID // SSR Service ID
          });
        });
        
        
        // Calculate SSR amount - since we're applying to first passenger only, 
        // the amount should be the cost of one service, not multiplied by passengers
        const ssrAmount = paidSSRServices.reduce((total, service) => {
          const serviceAmount = service.SSRNetAmount || service.Charge || 0;
          return total + serviceAmount;
        }, 0);
        

        // Get additional pricing data from localStorage
        const storedPricerData = localStorage.getItem("pricerData");
        const freshPricerData = storedPricerData ? JSON.parse(storedPricerData) : null;
        
        // Calculate passenger counts
        const passengerCounts = travelers.reduce((counts, traveler) => {
          counts[traveler.PTC] = (counts[traveler.PTC] || 0) + 1;
          return counts;
        }, {});

        // Calculate AirlineNetFare (NetAmount - SSRAmount)
        const airlineNetFare = finalNetAmount - ssrAmount;
        
        // Calculate GrossAmount (NetAmount + any additional charges)
        const grossAmount = finalNetAmount;

        const payload = {
          TUI: freshTUI,
          ContactInfo: contactInfo,
          Travellers: travelers,
          PLP: null,
          SSR: ssrForAPI,
          CrossSell: [],
          NetAmount: finalNetAmount,
          SSRAmount: ssrAmount,
          ClientID: "",
          DeviceID: "",
          AppVersion: "",
          CrossSellAmount: 0
        };

        console.log("=== CREATE ITINERARY FINAL PAYLOAD (FRONTEND) ===");
        console.log("Using Fresh TUI:", freshTUI);
        console.log("Using Fresh NetAmount:", finalNetAmount);
        console.log("Cleared Transaction ID to avoid duplicates");
        console.log("Final Payload being sent:", JSON.stringify(payload, null, 2));
        console.log("=============================================");
        
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/create-itinerary`, payload, { headers });
        
        console.log("=== CREATE ITINERARY RESPONSE (FRONTEND) ===");
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));
        console.log("Full Response Object:", response);
        console.log("==========================================");
        
        
        if (response.data.success) {
          
          localStorage.setItem("TransactionID", response.data.data.TransactionID);
          if (response.data.data.TUI) {
            localStorage.setItem("itineraryTUI", response.data.data.TUI);
          }
          setItenarySuccess(true);
        } else {
          
          // Handle SSR fare change messages
          const errorMessage = response.data.message || 'Unknown error';
          const userFriendlyMessage = handleSSRFareChange(errorMessage);
          
          // Check if it's an SSR fare change error and offer retry
          if (errorMessage.includes('change in the ssr fare')) {
            const shouldRetry = confirm(`${userFriendlyMessage}\n\nWould you like to retry with updated pricing?`);
            if (shouldRetry) {
              // Clear selected SSR services and refresh
              setSelectedSSRServices([]);
              setSsrEnabled(false);
              // Refresh the page to get fresh pricing
              window.location.reload();
              return;
            }
          }
          
          // Handle duplicate Transaction ID error
          if (errorMessage.includes('6688') || errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
            const shouldRetry = confirm(`Transaction ID conflict detected. This usually happens when a previous booking attempt is still in progress.\n\nWould you like to clear the booking data and try again?`);
            if (shouldRetry) {
              // Clear all booking data and refresh
              clearBookingData();
              window.location.reload();
              return;
            }
          }
          
          alert(`Failed to create itinerary: ${userFriendlyMessage}`);
        }

      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create itinerary';
        
        // Handle SSR fare change messages in catch block too
        const userFriendlyMessage = handleSSRFareChange(errorMessage);
        
        // Check if it's an SSR fare change error and offer retry
        if (errorMessage.includes('change in the ssr fare')) {
          const shouldRetry = confirm(`${userFriendlyMessage}\n\nWould you like to retry with updated pricing?`);
          if (shouldRetry) {
            // Clear selected SSR services and refresh
            setSelectedSSRServices([]);
            setSsrEnabled(false);
            // Refresh the page to get fresh pricing
            window.location.reload();
            return;
          }
        }
        
        // Handle duplicate Transaction ID error in catch block too
        if (errorMessage.includes('6688') || errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
          const shouldRetry = confirm(`Transaction ID conflict detected. This usually happens when a previous booking attempt is still in progress.\n\nWould you like to clear the booking data and try again?`);
          if (shouldRetry) {
            // Clear all booking data and refresh
            clearBookingData();
            window.location.reload();
            return;
          }
        }
        
        alert(`Error: ${userFriendlyMessage}`);
      }
    } else {
      // Show validation errors
      alert('Please fix the validation errors before submitting.');
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-full">
            <ContactInfoForm
              contactData={contactInfo}
              onSave={handleContactInfoSave}
            />
   
          </div>
        );
      case 2:
        return (
          <div className="w-full">
            <TravelersList
              travelers={travelers}
              onTravelersChange={handleTravelersChange}
              searchPayload={searchPayload}
              requiredTravelers={searchPayload ? { adults: searchPayload.ADT, children: searchPayload.CHD, infants: searchPayload.INF } : null}
            />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextToSSR}
                  disabled={travelers.length === 0}
                  className="w-full sm:w-auto bg-[#f48f22] hover:bg-[#16437c] text-white py-2 px-6 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {isHotelBooking ? (
              // For hotel bookings, skip SSR and go directly to review
              <div className="text-center py-8">
                <div className="text-lg text-gray-600 mb-4">
                  Additional services are not available for hotel bookings.
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextToReview}
                    className="w-full sm:w-auto bg-[#f48f22] hover:bg-[#16437c] text-white py-2 px-6 rounded-md font-semibold transition-colors"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            ) : (
              // For flight bookings, show SSR services
              <>
                <div className="space-y-6">
                  <SSRToggle
                    isEnabled={ssrEnabled}
                    onToggle={handleSSRToggle}
                    availableServices={availableSSRServices}
                  />
                  
                  {ssrEnabled && (
                    <SSRServicesSelection
                      availableServices={availableSSRServices}
                      selectedServices={selectedSSRServices}
                      onServiceSelectionChange={handleSSRServiceSelection}
                      travelers={travelers}
                    />
                  )}
                </div>
                
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextToReview}
                      className="w-full sm:w-auto bg-[#f48f22] hover:bg-[#16437c] text-white py-2 px-6 rounded-md font-semibold transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 4:
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Review Itinerary</h2>

              {/* Validation Errors Display */}
              {(() => {
                const hasGeneralError = validationErrors.general;
                const hasContactErrors = validationErrors.contactInfo && Object.keys(validationErrors.contactInfo).length > 0;
                const hasTravelerErrors = validationErrors.travelers && validationErrors.travelers.some(travelerErrors =>
                  Object.keys(travelerErrors).length > 0
                );

                const hasAnyErrors = hasGeneralError || hasContactErrors || hasTravelerErrors;

                return hasAnyErrors ? (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
                    <ul className="space-y-1">
                      {hasGeneralError && (
                        <li className="text-red-700">• {validationErrors.general}</li>
                      )}
                      {hasContactErrors && (
                        <li className="text-red-700">• Contact Information has errors</li>
                      )}
                      {hasTravelerErrors && (
                        <li className="text-red-700">• Traveler information has errors</li>
                      )}
                    </ul>
                  </div>
                ) : null;
              })()}

              {/* Contact Information Review */}
              <div className="border-b border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Contact Information</h3>
                {contactInfo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="break-words">
                      <span className="font-medium">Name:</span> {contactInfo.Title} {contactInfo.FName} {contactInfo.LName}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">Mobile:</span> {contactInfo.Mobile}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">Email:</span> {contactInfo.Email}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">Address:</span> {contactInfo.Address}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">City:</span> {contactInfo.City}, {contactInfo.State}
                    </div>
                    <div className="break-words">
                      <span className="font-medium">PIN:</span> {contactInfo.PIN}
                    </div>
                  </div>
                )}
              </div>

              {/* Travelers Review */}
              <div className="border-b border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Travelers ({travelers.length})</h3>
                <div className="space-y-3">
                  {travelers.map((traveler, index) => (
                    <div key={traveler.ID} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-[#f48f22] text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium break-words">{traveler.Title} {traveler.FName} {traveler.LName}</span>
                          <span className="text-gray-500 ml-2">({traveler.PTC})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SSR Services Review - Only for flight bookings */}
              {!isHotelBooking && ssrEnabled && selectedSSRServices.length > 0 && (
                <div className="border-b border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                    Additional Services ({selectedSSRServices.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedSSRServices.map((service, index) => (
                      <div key={service.ID || index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-medium break-words">{service.Description}</span>
                              <span className="text-gray-500 ml-2">({service.Code})</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-green-600">₹{(service.SSRNetAmount || service.Charge).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total Additional Services:</span>
                        <span className="font-bold text-green-600">
                          ₹{selectedSSRServices.reduce((total, service) => total + (service.SSRNetAmount || service.Charge), 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        * Applied to first passenger only. Final amount will be calculated by the airline
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Amount Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">Total Amount Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Base Fare:</span>
                    <span className="font-medium text-blue-800">₹{netAmountNumber.toLocaleString()}</span>
                  </div>
                  {!isHotelBooking && selectedSSRServices.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Additional Services:</span>
                      <span className="font-medium text-blue-800">
                        ₹{selectedSSRServices.reduce((total, service) => total + (service.SSRNetAmount || service.Charge), 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-blue-200 pt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-blue-800">Total Amount:</span>
                      <span className="text-blue-800">
                        ₹{(isHotelBooking ? netAmountNumber : (netAmountNumber + selectedSSRServices.reduce((total, service) => total + (service.SSRNetAmount || service.Charge), 0))).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md font-semibold transition-colors"
                >
                  Back
                </button>
                {!itenarySuccess ? (
                  <button
                    onClick={handleSubmit}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-semibold transition-colors"
                  >
                    Create Itinerary
                  </button>
                ) : (
                  <div className="w-full sm:w-auto">
                    <PaymentButton
                      TUI={localStorage.getItem("itineraryTUI") || currentTUI}
                      amount={totalAmountWithSSR}
                      name={contactInfo.FName}
                      email={contactInfo.Email}
                      contact={contactInfo.Mobile}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Show loading state while validating data
  if (!isDataValid) {
    return (
      <div 
        className="min-h-screen bg-gray-50 flex justify-center items-center"
        style={{ paddingTop: `${headerHeight + 20}px` }}
      >
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading itinerary data...</div>
          <div className="text-sm text-gray-500 mt-2">Please wait while we validate your booking information</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{ paddingTop: `${headerHeight + 20}px` }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Itinerary</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Enter contact information and add travelers for your trip</p>
          {isHotelBooking && hotelSearchData && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Hotel Booking!</strong> We've automatically created {hotelSearchData.adults + hotelSearchData.children} traveler form{hotelSearchData.adults + hotelSearchData.children > 1 ? 's' : ''} based on your hotel search 
                ({hotelSearchData.adults} Adult{hotelSearchData.adults > 1 ? 's' : ''}{hotelSearchData.children > 0 ? `, ${hotelSearchData.children} Child${hotelSearchData.children > 1 ? 'ren' : ''}` : ''}). 
                Just click "Edit" on each traveler to fill in their details, or use "Load Dummy Data" for quick testing.
              </p>
            </div>
          )}
          {!isHotelBooking && searchPayload && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Good news!</strong> We've automatically created {searchPayload.ADT + searchPayload.CHD + searchPayload.INF} traveler form{searchPayload.ADT + searchPayload.CHD + searchPayload.INF > 1 ? 's' : ''} based on your search selection 
                ({searchPayload.ADT} Adult{searchPayload.ADT > 1 ? 's' : ''}{searchPayload.CHD > 0 ? `, ${searchPayload.CHD} Child${searchPayload.CHD > 1 ? 'ren' : ''}` : ''}{searchPayload.INF > 0 ? `, ${searchPayload.INF} Infant${searchPayload.INF > 1 ? 's' : ''}` : ''}). 
                Just click "Edit" on each traveler to fill in their details, or use "Load Dummy Data" for quick testing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Travel Checklist Display */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TravelCheckListDisplay travelCheckListData={travelCheckListData} />
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col sm:flex-row items-center ${isActive ? 'text-[#f48f22]' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-[#f48f22] bg-[#f48f22] text-white' :
                      isCompleted ? 'border-green-600 bg-green-600 text-white' :
                        'border-gray-300 bg-white'
                      }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <span className="ml-2 font-medium text-xs sm:text-sm mt-1 sm:mt-0">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="py-4 sm:py-6">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Createitenary;