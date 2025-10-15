import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import HotelForm from "./HotelForm";

const HotelSearch = ({
  token,
  adults,
  children
}) => {
  const [searchterm, setSearchterm] = useState("");
  const [hotelSearchResults, setHotelSearchResults] = useState([]);
  const [selectedHotelLocation, setSelectedHotelLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState(null);
  const [searchTracingKey, setSearchTracingKey] = useState(null);
  const [initResponse, setInitResponse] = useState(null);
  const [hotelRates, setHotelRates] = useState([]);
  const [hotelRatesLoading, setHotelRatesLoading] = useState(false);
  const [hotelFilters, setHotelFilters] = useState([]);
  const [hotelFiltersLoading, setHotelFiltersLoading] = useState(false);
  const [hotelContent, setHotelContent] = useState(null);
  const [hotelContentLoading, setHotelContentLoading] = useState(false);

  console.log(hotelSearchResults, "hotelSearchResults========================= hotel search");
  console.log("Current search state:", { searchId, searchTracingKey, selectedHotelLocation });

  // Debounced autosuggest function
  const debouncedAutosuggest = useCallback(
    (() => {
      let timeoutId;
      return (term) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (term && term.length >= 3) {
            performAutosuggest(term);
          } else {
            setHotelSearchResults([]);
          }
        }, 300); // 300ms delay
      };
    })(),
    []
  );

  // Effect to trigger autosuggest when searchterm changes
  useEffect(() => {
    if (searchterm && searchterm.length >= 3) {
      debouncedAutosuggest(searchterm);
    } else {
      setHotelSearchResults([]);
      setIsLoading(false);
      // Clear selected location when search term changes
      if (selectedHotelLocation) {
        setSelectedHotelLocation(null);
        setSearchId(null);
        setSearchTracingKey(null);
        setInitResponse(null);
      }
    }
  }, [searchterm, debouncedAutosuggest, selectedHotelLocation]);

  // Effect to proceed with hotel search when searchId and searchTracingKey are available
  useEffect(() => {
    if (searchId && searchTracingKey && selectedHotelLocation) {
      console.log("Search credentials available, proceeding with hotel search...");
      proceedWithHotelSearch(searchId, searchTracingKey);
    }
  }, [searchId, searchTracingKey, selectedHotelLocation]);

  // Perform autosuggest API call
  const performAutosuggest = async (term) => {
    if (!term || term.length < 3) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/hotel/autosuggest?term=${term}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log(response, "response from the backend========================= hotel search autosuggest response");
      setHotelSearchResults(response.data.locations || []);
    } catch (error) {
      console.log(error, "error from the backend========================= hotel search");
      setHotelSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  async function hotelSearch(e) {
    e.preventDefault();
    console.log("=== HOTEL SEARCH BUTTON CLICKED ===");
    console.log("Search term:", searchterm);
    console.log("Selected location:", selectedHotelLocation);
    
    if (!selectedHotelLocation) {
      alert("Please select a location from the dropdown first");
      return;
    }
    
    if (!searchterm) {
      alert("Please enter a valid search term");
      return;
    }
    
    try {
      console.log("Initiating hotel search with selected location:", selectedHotelLocation);
      await initHotelSearch(selectedHotelLocation);
    } catch (error) {
      console.error("Failed to initiate hotel search:", error);
      alert("Failed to search hotels. Please try again.");
    }
  }

  // Function to handle hotel location selection
  const handleHotelLocationSelect = (location) => {
    console.log("=== LOCATION SELECTED ===");
    console.log("Selected location:", location);
    setSelectedHotelLocation(location);
    console.log("Location stored, ready for search button click");
  }

  // Function to fetch hotel rates
  const fetchHotelRates = async (searchId) => {
    try {
      console.log("=== FETCHING HOTEL RATES ===");
      console.log("Search ID for rates:", searchId);
      
      setHotelRatesLoading(true);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/rates/${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log("=== HOTEL RATES RESPONSE ===");
      console.log("Full rates response:", response.data);
      console.log("=== END RATES RESPONSE ===");
      
      setHotelRates(response.data.hotels || []);
      return response.data;
      
    } catch (error) {
      console.log("❌ Error fetching hotel rates:", error);
      console.log("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    } finally {
      setHotelRatesLoading(false);
    }
  };

  // Function to fetch hotel filters
  const fetchHotelFilters = async (searchId) => {
    try {
      console.log("=== FETCHING HOTEL FILTERS ===");
      console.log("Search ID for filters:", searchId);
      
      setHotelFiltersLoading(true);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/filters/${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log("=== HOTEL FILTERS RESPONSE ===");
      console.log("Full filters response:", response.data);
      console.log("=== END FILTERS RESPONSE ===");
      
      setHotelFilters(response.data.filters || []);
      return response.data;
      
    } catch (error) {
      console.log("❌ Error fetching hotel filters:", error);
      console.log("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    } finally {
      setHotelFiltersLoading(false);
    }
  };

  // Function to fetch hotel content
  const fetchHotelContent = async (searchId, hotelId) => {
    try {
      console.log("=== FETCHING HOTEL CONTENT ===");
      console.log("Search ID for content:", searchId);
      console.log("Hotel ID for content:", hotelId);
      
      setHotelContentLoading(true);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/content/${searchId}/${hotelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log("=== HOTEL CONTENT RESPONSE ===");
      console.log("Full content response:", response.data);
      console.log("=== END CONTENT RESPONSE ===");
      
      setHotelContent(response.data);
      return response.data;
      
    } catch (error) {
      console.log("❌ Error fetching hotel content:", error);
      console.log("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    } finally {
      setHotelContentLoading(false);
    }
  };

  // Function to proceed with hotel search after getting searchId and searchTracingKey
  const proceedWithHotelSearch = async (searchId, searchTracingKey) => {
    try {
      console.log("=== PROCEEDING WITH HOTEL SEARCH ===");
      console.log("Search ID:", searchId);
      console.log("Search Tracing Key:", searchTracingKey);
      
      // Fetch hotel rates and filters using the searchId
      await Promise.all([
        fetchHotelRates(searchId),
        fetchHotelFilters(searchId)
      ]);
      
      console.log("=== HOTEL SEARCH FLOW COMPLETED ===");
      
    } catch (error) {
      console.error("Failed to proceed with hotel search:", error);
    }
  };

  const initHotelSearch = async (selectedLocation) => {
    try {
      console.log("=== INITIATING HOTEL SEARCH ===");
      console.log("Selected location for init:", selectedLocation);
      
      // Default values for hotel search
      const checkInDate = new Date();
      const checkOutDate = new Date();
      checkOutDate.setDate(checkInDate.getDate() + 1);
      
      const payload = {
        geoCode: {
          lat: selectedLocation.coordinates.lat.toString(),
          long: selectedLocation.coordinates.long.toString()
        },
        locationId: selectedLocation.id,
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

      console.log("=== INIT API PAYLOAD ===");
      console.log("Payload being sent:", JSON.stringify(payload, null, 2));
      console.log("=== END PAYLOAD ===");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/init`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log("=== INIT API RESPONSE ===");
      console.log("Full response:", response.data);
      console.log("=== END RESPONSE ===");
      
      // Store the response data
      setInitResponse(response.data);
      
      // Extract and store searchId and searchTracingKey
      if (response.data.searchId) {
        setSearchId(response.data.searchId);
        localStorage.setItem('hotelSearchId', response.data.searchId);
        console.log("✅ Search ID stored:", response.data.searchId);
      }
      
      if (response.data.searchTracingKey) {
        setSearchTracingKey(response.data.searchTracingKey);
        console.log("✅ Search Tracing Key stored:", response.data.searchTracingKey);
      }
      
      console.log("=== HOTEL SEARCH INIT COMPLETED ===");
      return response.data;
      
    } catch (error) {
      console.log("❌ Error from hotel search init:", error);
      console.log("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  }

  return (
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
      hotelRates={hotelRates}
      hotelRatesLoading={hotelRatesLoading}
      hotelFilters={hotelFilters}
      hotelFiltersLoading={hotelFiltersLoading}
      hotelContent={hotelContent}
      hotelContentLoading={hotelContentLoading}
      fetchHotelContent={fetchHotelContent}
      searchId={searchId}
    />
  );
};

export default HotelSearch;