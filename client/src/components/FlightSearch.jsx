import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearSearchData, debugLocalStorage } from "../utils/clearBookingData";
import FlightForm from "./FlightForm";
import ShowAirports from "./modals/ShowAirports";
import TravellerAddModal from "./modals/TravellerAddModal";
import { CalanderModal } from "./modals/CalanderModal";

const FlightSearch = ({
  airports,
  setAirports,
  token,
  ClientID
}) => {
  const [tripType, setTripType] = useState("ON");
  const [from, setFrom] = useState({ Code: "BOM", Name: "Mumbai" });
  const [to, setTo] = useState({ Code: "DEL", Name: "New Delhi" });
  const [travelClass, setTravelClass] = useState("Economy");
  const [travellerModalOpen, setTravellerModalOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [label, setLabel] = useState("From");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [isCalanderModalOpen, setIsCalanderModalOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [dateType, setDateType] = useState("departure");
  const [isDirect, setIsDirect] = useState(false);
  const [isDefenceFare, setIsDefenceFare] = useState(false);
  const [isStudentFare, setIsStudentFare] = useState(false);
  const [isSeniorCitizenFare, setIsSeniorCitizenFare] = useState(false);
  const [isNearbyAirport, setIsNearbyAirport] = useState(false);

  useEffect(() => {
    localStorage.setItem("tripType", tripType);
  }, [tripType]);

  // Clear any stale booking data when component mounts (user navigates to home)
  useEffect(() => {
    // Only clear search data if starting a completely new search
    // Don't clear if user is in middle of booking flow
    const hasExistingTrips = localStorage.getItem('trips');
    const isBookingComplete = localStorage.getItem('bookingSuccess');
    
    if (!hasExistingTrips || isBookingComplete) {
      clearSearchData();
      console.log('✅ Cleared search data on component mount (new search)');
    } else {
      console.log('✅ Preserving existing search data (user in booking flow)');
    }
    
    // Debug: Show what's in localStorage
    debugLocalStorage();
  }, []);

  const getExpSearch = async (TUI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/flights/get-exp-search`,
        {
          TUI,
          token,
          ClientID
        }
      );

      console.log("=== GET EXP SEARCH RESPONSE ===");
      console.log("Payload sent to API:", response.data.payload);
      console.log("Response from API:", response.data.response);
      console.log("Full response data:", response.data);
      console.log("=================================");
      if (response.statusText === "OK") {
        console.log("inside the if condition");
        const trips = response.data.data.Trips;
        console.log(trips, "trips=========================");
        localStorage.setItem("trips", JSON.stringify(trips));
        const TUI = response.data.data.TUI;
        console.log(TUI, "TUI=========================");
        localStorage.setItem("TUI", TUI);
        
        // Call WebSettings after ExpressSearch completes with the ExpressSearch TUI
        try {
          const webSettingsResponse = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/flights/web-settings`,
            {
              ClientID: localStorage.getItem("ClientID"),
              TUI: TUI // Use the ExpressSearch TUI
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          console.log("WebSettings called with ExpressSearch TUI:", webSettingsResponse.data);
        } catch (webSettingsError) {
          console.error("Error calling WebSettings:", webSettingsError);
        }
        
        navigate("/flight-list");
      }
    } catch (error) {
      console.log(error, "error from the backend=========================");
    }
  };

  // Express Search
  async function handleExpressSearch(e) {
    e.preventDefault();

    // Validation for different trip types
    if (tripType === "ON") {
      if (!from || !to || !departureDate) {
        alert("Please select From, To, and Departure Date");
        return;
      }
    } else if (tripType === "RT") {
      if (!from || !to || !departureDate || !returnDate) {
        alert("Please select From, To, Departure Date and Return Date");
        return;
      }
      // Ensure return date is not before departure date (allows same day round trips)
      const departureDateOnly = new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate());
      const returnDateOnly = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate());
      
      if (returnDateOnly < departureDateOnly) {
        alert("Return date cannot be before departure date");
        return;
      }
    }
    if (!localStorage.getItem("ClientID")) {
      alert("Unauthorized Access Missing ClientID");
      return;
    }

    setIsSearching(true);

    const payload = {
      ADT: adults,
      CHD: children,
      INF: infants,
      Cabin:
        travelClass === "Economy"
          ? "E"
          : travelClass === "Premium Economy"
            ? "PE"
            : "B",
      Source: "CF",
      Mode: "AS",
      ClientID: localStorage.getItem("ClientID"),
      FareType: tripType,
      IsMultipleCarrier: false,
      IsRefundable: false,
      preferedAirlines: null,
      TUI: "",
      Trips: tripType === "MC" ? [] : [
        {
          From: typeof from === 'object' ? from.Code : from,
          To: typeof to === 'object' ? to.Code : to,
          OnwardDate: departureDate.toISOString().split("T")[0],
          ReturnDate: tripType === "RT" ? returnDate.toISOString().split("T")[0] : "",
          TUI: "",
        },
      ],
      token: token,
      IsDirect: isDirect,
      IsStudentFare: isStudentFare,
      IsNearbyAirport: isNearbyAirport,
    };
    console.log("Trip Type:", tripType);
    console.log("From:", from);
    console.log("To:", to);
    console.log("Departure Date:", departureDate);
    console.log("Return Date:", returnDate);
    console.log(payload, "payload to the backend========================= 221");
    // Clear previous search data to prevent conflicts
    clearSearchData();
    localStorage.setItem("searchPayload", JSON.stringify(payload));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/flights/express-search`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          token: token,
        }
      );
      const data = await response.json();
      console.log("=== EXPRESS SEARCH RESPONSE ===");
      console.log("Payload sent to API:", data.payload);
      console.log("Response from API:", data.response);
      console.log("Full response data:", data);
      console.log("===============================");
      const TUI = data.TUI;
      await getExpSearch(TUI).then((response) => {
        console.log(response, "response from the backend========================= 221 get exp search");
      })
      console.log(TUI, "TUI=========================");
      localStorage.setItem("searchTUI", TUI);
      localStorage.setItem("searchTUI", data.TUI);
      if (data.success && data.data?.TUI) {
        console.log(
          "success and calling the getExpSearch================== 212"
        );
      }
    } catch (error) {
      console.log(error, "error from the backend=========================");
    } finally {
      setIsSearching(false);
    }
  }

  function handleApplyTraveller(data) {
    setAdults(data.adults);
    setChildren(data.children);
    setInfants(data.infants);
    setTravelClass(data.travelClass);
  }

  // Handle multi-city search
  async function handleMultiCitySearch(trips) {
    if (!localStorage.getItem("ClientID")) {
      alert("Unauthorized Access Missing ClientID");
      return;
    }

    setIsSearching(true);

    const payload = {
      ADT: adults,
      CHD: children,
      INF: infants,
      Cabin:
        travelClass === "Economy"
          ? "E"
          : travelClass === "Premium Economy"
            ? "PE"
            : "B",
      Source: "CF",
      Mode: "AS",
      ClientID: localStorage.getItem("ClientID"),
      FareType: "MC",
      IsMultipleCarrier: false,
      IsRefundable: false,
      preferedAirlines: null,
      TUI: "",
      Trips: trips,
      token: token,
      IsDirect: isDirect,
      IsStudentFare: isStudentFare,
      IsNearbyAirport: isNearbyAirport,
    };

    console.log(payload, "multi-city payload to the express search=========================");
    // Clear previous search data to prevent conflicts
    clearSearchData();
    localStorage.setItem("searchPayload", JSON.stringify(payload));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/flights/express-search`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          token: token,
        }
      );
      const data = await response.json();
      console.log(data, "multi-city data from the backend=========================");
      const TUI = data.TUI;
      await getExpSearch(TUI);
      console.log(TUI, "multi-city TUI=========================");
      localStorage.setItem("searchTUI", TUI);
      localStorage.setItem("searchTUI", data.TUI);
      if (data.success && data.data?.TUI) {
        console.log(
          "multi-city success and calling the getExpSearch=================="
        );
      }
    } catch (error) {
      console.log(error, "multi-city error from the backend=========================");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <>
      <FlightForm
        tripType={tripType}
        setTripType={setTripType}
        from={from}
        to={to}
        departureDate={departureDate}
        returnDate={returnDate}
        adults={adults}
        children={children}
        infants={infants}
        travelClass={travelClass}
        isSearching={isSearching}
        isDirect={isDirect}
        isDefenceFare={isDefenceFare}
        isStudentFare={isStudentFare}
        isSeniorCitizenFare={isSeniorCitizenFare}
        isNearbyAirport={isNearbyAirport}
        setIsDirect={setIsDirect}
        setIsDefenceFare={setIsDefenceFare}
        setIsStudentFare={setIsStudentFare}
        setIsSeniorCitizenFare={setIsSeniorCitizenFare}
        setIsNearbyAirport={setIsNearbyAirport}
        setIsOpen={setIsOpen}
        setLabel={setLabel}
        setIsCalanderModalOpen={setIsCalanderModalOpen}
        setDateType={setDateType}
        setTravellerModalOpen={setTravellerModalOpen}
        handleExpressSearch={handleExpressSearch}
        handleMultiCitySearch={handleMultiCitySearch}
        airports={airports}
      />
      
      {/* Modals */}
      <ShowAirports
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        airports={airports}
        onSelect={label === "From" ? setFrom : setTo}
        label={label}
      />
      <TravellerAddModal
        isOpen={travellerModalOpen}
        setIsOpen={setTravellerModalOpen}
        initial={{ adults, children, infants, travelClass }}
        onApply={handleApplyTraveller}
      />
      {isCalanderModalOpen && (
        <CalanderModal
          isOpen={isCalanderModalOpen}
          setIsOpen={setIsCalanderModalOpen}
          setDate={dateType === "departure" ? setDepartureDate : setReturnDate}
        />
      )}
    </>
  );
};

export default FlightSearch;
