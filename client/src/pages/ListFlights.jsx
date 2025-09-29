import React, { useEffect, useState } from "react";
import FlightCard from "../components/FlightCard";
import FlightFilter from "../components/FlightFilter";
import { useFlight } from "../contexts/FlightContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListFlights = () => {
  const {
    filteredFlights,
    filteredReturnFlights,
    selectedFlight,
    selectedReturnFlight,
    setSelectedFlight,
    setSelectedReturnFlight,
    setFlights,
    setReturnFlights,
    loading,
    error
  } = useFlight();
  const [trips, setTrips] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("trips")) || null;
    } catch {
      return null;
    }
  });
  
  const navigate = useNavigate();
  useEffect(() => {
    if (!trips) {
      navigate("/", { replace: true });
    } else {
      // Update context with flight data
      setFlights(trips[0]?.Journey || []);
      if (trips.length > 1) {
        setReturnFlights(trips[1]?.Journey || []);
      }
    }
  }, [trips, navigate, setFlights, setReturnFlights]);

  const TUI = localStorage.getItem("TUI");
  const tripType = localStorage.getItem("tripType");

  useEffect(() => {
    if (trips == null) {
      // Try to reload trips from localStorage one more time
      const storedTrips = localStorage.getItem("trips");
      if (storedTrips) {
        try {
          const parsedTrips = JSON.parse(storedTrips);
          setTrips(parsedTrips);
          return; // Don't navigate away if we found trips
        } catch (error) {
          console.error("Error parsing trips from localStorage:", error);
        }
      }
      
      // If still no trips, navigate away
      navigate("/");
      alert("No Flights Found, Please try again!!!");
    }
  }, [trips, navigate]);
  const handleBookFlight = async () => {
    if(!tripType){
      alert("No Trip Type Found, Please try again!!!")
      navigate("/")
      return
    }

    // Validate flight selection based on trip type
    if (tripType === "RT") {
      if (!selectedFlight || !selectedReturnFlight) {
        alert("Please select both onward and return flights for round trip")
        return
      }
    } else if (!selectedFlight) {
      alert("Please select a flight")
      return
    }

    // Prepare trips array based on trip type
    let tripsToSend = [];
    
    if (tripType === "RT") {
      // For round trip, send both onward and return flights
      tripsToSend = [selectedFlight, selectedReturnFlight];
    } else {
      // For one way or multi city, send selected flights
      tripsToSend = [selectedFlight];
    }

    console.log("Sending trips:", tripsToSend, "TripType:", tripType)
    
    try {
      const clientID = localStorage.getItem("ClientID");
      const payload = {
        Trips: tripsToSend,
        ClientID: clientID,
        Mode: "AS",
        Options: "",
        token: localStorage.getItem("token"),
        TUI: TUI,
        TripType: tripType
      };
      
      console.log("=== SMART PRICE API CALL ===");
      console.log("Final Payload being sent:", JSON.stringify(payload, null, 2));
      console.log("=============================");
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/smart-price`, payload)
      
      console.log("=== SMART PRICE API RESPONSE ===");
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));
      console.log("Full Response Object:", response);
      console.log("================================");
      
      if (response.status === 200) {
        console.log("inside the if condition")
        const pricerTUI = response.data.TUI
        localStorage.setItem("pricerTUI", pricerTUI)
        //if success getPricer Api Call
        console.log(response.data, '================================= response smart price');

        await getPricer()
      } else {
        console.error("Smart price API returned non-200 status:", response.status)
        alert("Failed to process flight pricing. Please try again.")
      }
    } catch (error) {
      console.log("=== SMART PRICE API ERROR ===");
      console.error("Error calling smart-price API:", error);
      console.log("Error object:", JSON.stringify(error, null, 2));
      console.log("=============================");
      
      if (error.response) {
        // Server responded with error status
        console.log("=== ERROR RESPONSE DETAILS ===");
        console.error("Error Status:", error.response.status);
        console.error("Error Headers:", error.response.headers);
        console.error("Error Data:", JSON.stringify(error.response.data, null, 2));
        console.log("==============================");
        alert(`Error: ${error.response.data?.Msg || "Failed to process flight pricing. Please try again."}`)
      } else if (error.request) {
        // Request was made but no response received
        console.log("=== NO RESPONSE ERROR ===");
        console.error("No response received:", error.request);
        console.log("Request details:", JSON.stringify(error.request, null, 2));
        console.log("==========================");
        alert("Network error. Please check your connection and try again.")
      } else {
        // Something else happened
        console.log("=== UNKNOWN ERROR ===");
        console.error("Error:", error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));
        console.log("=====================");
        alert("An unexpected error occurred. Please try again.")
      }
    }
  }

  const getPricer = async () => {
    try {
      const pricerTUI = localStorage.getItem("pricerTUI")
      const payload = {
        TUI: pricerTUI,
        token: localStorage.getItem("token"),
        ClientID: localStorage.getItem("ClientID")
      };
      
      console.log("=== GET PRICER API CALL ===");
      console.log("Final Payload being sent:", JSON.stringify(payload, null, 2));
      console.log("===========================");
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/get-pricer`, payload)
      
      console.log("=== GET PRICER API RESPONSE ===");
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));
      console.log("Full Response Object:", response);
      console.log("===============================");
      
      if (response.status === 200) {
        const data = response.data
        console.log(data, "data=========================")
        localStorage.setItem("pricerData", JSON.stringify(data.data))
        localStorage.setItem("netamount", data.data.NetAmount.toString()) 
        localStorage.setItem("oneWayReviewData", JSON.stringify(data.data))
        localStorage.setItem("pricerTUI", data.data.TUI)
        navigate("/one-way-review")
      } else {
        console.log("inside the else condition")
        alert("Something went wrong, Please try again!!!")
        navigate("/")
      }
    } catch (error) {
      console.log("=== GET PRICER API ERROR ===");
      console.error("Error calling get-pricer API:", error);
      console.log("Error object:", JSON.stringify(error, null, 2));
      console.log("=============================");
      
      if (error.response) {
        console.log("=== ERROR RESPONSE DETAILS ===");
        console.error("Error Status:", error.response.status);
        console.error("Error Headers:", error.response.headers);
        console.error("Error Data:", JSON.stringify(error.response.data, null, 2));
        console.log("==============================");
        alert(`Error: ${error.response.data?.Msg || "Failed to get pricing details. Please try again."}`)
      } else if (error.request) {
        console.log("=== NO RESPONSE ERROR ===");
        console.error("No response received:", error.request);
        console.log("Request details:", JSON.stringify(error.request, null, 2));
        console.log("==========================");
        alert("Network error. Please check your connection and try again.")
      } else {
        console.log("=== UNKNOWN ERROR ===");
        console.error("Error:", error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));
        console.log("=====================");
        alert("An unexpected error occurred. Please try again.")
      }
      navigate("/")
    }
  }

  if (loading) {
    return (
      <div className="pt-40 flex justify-center items-center">
        <div className="text-xl">Loading flights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-40 flex justify-center items-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="pt-40">
      <h1 className="text-center text-2xl font-bold mb-4">
        {tripType === "RT" ? "Select Onward and Return Flights" : "Flight List"}
      </h1>
      
      {/* Flight Filter */}
      <div className="max-w-7xl mx-auto mb-6">
        <FlightFilter />
      </div>
      
      {/* Onward Flights Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {tripType === "RT" ? "Onward Flights" : "Available Flights"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlights.length > 0 ? filteredFlights.map((flight, index) => (
            <FlightCard 
              key={`onward-${index}`} 
              flight={flight} 
              setSelectedFlight={setSelectedFlight}
              isSelected={selectedFlight?.Index === flight.Index}
              tripType="onward"
            />
          )) : <div className="text-center text-2xl font-bold col-span-full">No onward flights found</div>}
        </div>
      </div>

      {/* Return Flights Section (only for Round Trip) */}
      {tripType === "RT" && (
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Return Flights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReturnFlights.length > 0 ? filteredReturnFlights.map((flight, index) => (
              <FlightCard 
                key={`return-${index}`} 
                flight={flight} 
                setSelectedFlight={setSelectedReturnFlight}
                isSelected={selectedReturnFlight?.Index === flight.Index}
                tripType="return"
              />
            )) : <div className="text-center text-2xl font-bold col-span-full">No return flights found</div>}
          </div>
        </div>
      )}

    {/* Book Flight Button */}
    <div className="max-w-7xl mx-auto text-center sticky bottom-0 w-full bg-white rounded-lg py-4 mt-4">
      <button 
        onClick={handleBookFlight}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
        disabled={!selectedFlight || (tripType === "RT" && !selectedReturnFlight)}
      >
        {tripType === "RT" ? "Book Round Trip" : "Book Flight"}
      </button>
    </div>
  </div>
  )
};

export default ListFlights;
