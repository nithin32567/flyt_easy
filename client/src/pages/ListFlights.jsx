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
    
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/smart-price`, {
      Trips: tripsToSend,
      ClientID: "FVI6V120g22Ei5ztGK0FIQ==",
      Mode: "AS",
      Options: "",
      token: localStorage.getItem("token"),
      TUI: TUI,
      TripType: tripType
    })
    if (response.statusText === "OK") {
      console.log("inside the if condition")
      const pricerTUI = response.data.TUI
      localStorage.setItem("pricerTUI", pricerTUI)
      //if success getPricer Api Call
      console.log(response.data, '================================= response smart price');

      await getPricer()
    }
  }

  const getPricer = async () => {
    const pricerTUI = localStorage.getItem("pricerTUI")
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/get-pricer`, {
      TUI: pricerTUI,
      token: localStorage.getItem("token")
    })
    console.log(response, "response========================= get pricer")
    if (response.statusText === "OK") {
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
    if (!response) {
      alert("Something went wrong, Please try again!!!")
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
