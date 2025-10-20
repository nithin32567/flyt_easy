import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HotelForm from "./HotelForm";
import { CalanderModal } from "./modals/CalanderModal";
import HotelRoomsModal from "./modals/HotelRoomsModal";
import HotelPriceModal from "./modals/HotelPriceModal";
import HotelLoadingScreen from "./HotelLoadingScreen";

const HotelSearch = ({
  adults,
  children,
  setAdults,
  setChildren
}) => {
  const navigate = useNavigate();
  const [searchterm, setSearchterm] = useState("");
  const [hotelSearchResults, setHotelSearchResults] = useState([]);
  const [selectedHotelLocation, setSelectedHotelLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Date and filter states
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [isCalanderModalOpen, setIsCalanderModalOpen] = useState(false);
  const [dateType, setDateType] = useState("checkIn");
  const [rooms, setRooms] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
  const [isRoomsModalOpen, setIsRoomsModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  async function hotelSearch(e) {
    e.preventDefault();
    
    if (!selectedHotelLocation) {
      alert("Please select a location from the dropdown first");
      return;
    }
    
    if (!searchterm) {
      alert("Please enter a valid search term");
      return;
    }

    setIsLoading(true);
    
    // Clear previous search data before starting new search
    localStorage.removeItem('hotelSearchId');
    localStorage.removeItem('searchTracingKey');
    localStorage.removeItem('hotelSearchData');
    localStorage.removeItem('hotelSearchResults');
    localStorage.removeItem('allHotels');
    
    console.log('=== FRONTEND: CLEARED PREVIOUS SEARCH DATA ===');
    
    try {
      // Prepare the payload according to the Postman collection
      const payload = {
        geoCode: {
          lat: selectedHotelLocation.lat || "9.961343",
          long: selectedHotelLocation.long || "76.29705"
        },
        locationId: selectedHotelLocation.id || "7381",
        currency: "INR",
        culture: "en-US",
        checkIn: checkInDate.toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        }),
        checkOut: checkOutDate.toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        }),
        rooms: [
          {
            adults: adults.toString(),
            children: children.toString(),
            childAges: []
          }
        ],
        agentCode: "14005",
        destinationCountryCode: "IN",
        nationality: "IN",
        countryOfResidence: "IN",
        channelId: "b2bIndiaDeals",
        affiliateRegion: "B2B_India",
        segmentId: "",
        companyId: "1",
        gstPercentage: 0,
        tdsPercentage: 0
      };

      console.log('=== FRONTEND: HOTEL SEARCH INITIATED ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      // Step 1: Call init API
      console.log('=== FRONTEND: CALLING INIT API ===');
      const initResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/init`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('=== FRONTEND: INIT API RESPONSE ===');
      console.log('Status:', initResponse.status);
      console.log('Data:', JSON.stringify(initResponse.data, null, 2));
      
      const initData = initResponse.data;
      
      if (!initData.searchId) {
        throw new Error('Search ID not received from init API');
      }

      // Store search IDs for subsequent API calls - these persist until next init request
      localStorage.setItem('hotelSearchId', initData.searchId);
      localStorage.setItem('searchTracingKey', initData.searchTracingKey);
      
      console.log('=== FRONTEND: STORED IN LOCALSTORAGE ===');
      console.log('Search ID stored:', initData.searchId);
      console.log('Search Tracing Key stored:', initData.searchTracingKey);

      // Step 2: Call content and rates APIs in parallel
      console.log('=== FRONTEND: CALLING CONTENT & RATES API ===');
      const contentRatesResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/content-rates/${initData.searchId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'search-tracing-key': initData.searchTracingKey || ''
          }
        }
      );

      console.log('=== FRONTEND: CONTENT & RATES API RESPONSE ===');
      console.log('Status:', contentRatesResponse.status);
      console.log('Data:', JSON.stringify(contentRatesResponse.data, null, 2));

      // Combine the responses
      const combinedResponse = {
        status: 'success',
        init: initData.init,
        rates: contentRatesResponse.data.rates,
        content: contentRatesResponse.data.content,
        filterData: contentRatesResponse.data.filterData,
        searchId: initData.searchId,
        searchTracingKey: initData.searchTracingKey,
        pagination: contentRatesResponse.data.pagination,
        timestamp: new Date().toISOString()
      };

      console.log('=== FRONTEND: COMBINED RESPONSE ===');
      console.log(combinedResponse);
      
      // Store the search results
      setHotelSearchResults(combinedResponse);
      
      // Store search data in localStorage for the results page
      const searchData = {
        location: selectedHotelLocation.name || searchterm,
        checkIn: checkInDate.toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        }),
        checkOut: checkOutDate.toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        }),
        guests: adults,
        rooms: rooms,
        adults: adults,
        children: children,
        priceRange: priceRange,
        searchId: initData.searchId,
        searchTracingKey: initData.searchTracingKey
      };
      
      localStorage.setItem('hotelSearchData', JSON.stringify(searchData));
      localStorage.setItem('hotelSearchResults', JSON.stringify(combinedResponse));
      localStorage.setItem('bookingType', 'hotel');
      
      console.log('=== FRONTEND: SEARCH DATA STORED ===');
      console.log('Search Data:', JSON.stringify(searchData, null, 2));
      
      // Navigate to hotel results page
      if (combinedResponse.status === 'success') {
        navigate('/hotel-results');
      }
      
    } catch (error) {
      console.error('=== FRONTEND: HOTEL SEARCH ERROR ===');
      console.error('Error:', error.message);
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
      }
      alert('Hotel search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleHotelLocationSelect = (location) => {
    setSelectedHotelLocation(location);
  }

  // Date picker handlers
  const handleDateSelect = (dateType) => {
    setDateType(dateType);
    setIsCalanderModalOpen(true);
  };

  const handleDateChange = (date) => {
    if (dateType === "checkIn") {
      setCheckInDate(date);
      // Ensure check-out is at least one day after check-in
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      if (checkOutDate <= date) {
        setCheckOutDate(nextDay);
      }
    } else {
      setCheckOutDate(date);
    }
  };

  const handleRoomsSelect = () => {
    setIsRoomsModalOpen(true);
  };

  const handleRoomsApply = (data) => {
    setRooms(data.rooms);
    setAdults(data.adults);
    setChildren(data.children);
    setIsRoomsModalOpen(false);
  };

  const handlePriceSelect = () => {
    setIsPriceModalOpen(true);
  };

  const handlePriceApply = (data) => {
    setPriceRange(data.priceRange);
    setIsPriceModalOpen(false);
  };

  return (
    <>
      <HotelForm
        searchterm={searchterm}
        setSearchterm={setSearchterm}
        adults={adults}
        children={children}
        hotelSearch={hotelSearch}
        hotelSearchResults={hotelSearchResults}
        handleHotelLocationSelect={handleHotelLocationSelect}
        selectedHotelLocation={selectedHotelLocation}
        isLoading={isLoading}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        rooms={rooms}
        priceRange={priceRange}
        handleDateSelect={handleDateSelect}
        handleRoomsSelect={handleRoomsSelect}
        handlePriceSelect={handlePriceSelect}
        setRooms={setRooms}
        setPriceRange={setPriceRange}
      />
      
      {/* Loading Screen */}
      <HotelLoadingScreen isVisible={isLoading} />
      
      {/* Date Picker Modal */}
      {isCalanderModalOpen && (
        <CalanderModal
          isOpen={isCalanderModalOpen}
          setIsOpen={setIsCalanderModalOpen}
          setDate={handleDateChange}
        />
      )}
      
      {/* Rooms Modal */}
      <HotelRoomsModal
        isOpen={isRoomsModalOpen}
        setIsOpen={setIsRoomsModalOpen}
        onApply={handleRoomsApply}
        initial={{ rooms, adults, children }}
      />
      
      {/* Price Modal */}
      <HotelPriceModal
        isOpen={isPriceModalOpen}
        setIsOpen={setIsPriceModalOpen}
        onApply={handlePriceApply}
        initial={priceRange}
      />
    </>
  );
};

export default HotelSearch;