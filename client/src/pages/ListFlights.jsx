import React, { useEffect, useState } from "react";
import FlightCard from "../components/FlightCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListFlights = () => {
  const [trips, setTrips] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("trips")) || null;
    } catch {
      return null;
    }
  });
  console.log(trips)

  const [flights, setFlights] = useState(trips?.[0]?.Journey || []);
  const [selectedFlight, setSelectedFlight] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (!trips) {
      navigate("/", { replace: true });
    }
  }, [trips, navigate]);
  const TUI = localStorage.getItem("TUI")
  const tripType = localStorage.getItem("tripType")
  useEffect(() => {
    if (trips == null) {
      navigate("/")
      alert("No Flights Found, Please try again!!!")
    }
  }, [trips, navigate])
  const handleBookFlight = async () => {
    // console.log(selectedFlight, "selectedFlight=========================")
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/smart-price`, {
      Trips: [selectedFlight],
      ClientID: "FVI6V120g22Ei5ztGK0FIQ==",
      Mode: "AS",
      Options: "",
      token: localStorage.getItem("token"),
      TUI: TUI,
      TripType: tripType || "ON"
    })
    if (response.statusText === "OK") {
      console.log("inside the if condition")
      const pricerTUI = response.data.TUI
      localStorage.setItem("pricerTUI", pricerTUI)
      //if success getPricer Api Call

      await getPricer(pricerTUI)
    }
  }

  const getPricer = async () => {
    const pricerTUI = localStorage.getItem("pricerTUI")
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/get-pricer`, {
      TUI: pricerTUI,
      token: localStorage.getItem("token")
    })
    console.log(response, "response=========================")
    if (response.statusText === "OK") {
      const data = response.data
      console.log(data, "data=========================")
      localStorage.setItem("pricerData", JSON.stringify(data.data))
      localStorage.setItem("oneWayReviewData", JSON.stringify(data.data))
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

  useEffect(() => {
    if (selectedFlight) {
      handleBookFlight()
    }
  }, [selectedFlight])

  // console.log(flights[0])
  return <div className=" max-w-7xl p-12 py-40 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {
      // if flights is not empty then show the flights
      
      flights.length > 0 ? flights.map((flight, index) => (
        <FlightCard key={index} flight={flight} setSelectedFlight={setSelectedFlight} />
      )) : <div className="text-center text-2xl font-bold">No flights found</div>
    }
    
    
  </div>;
};

export default ListFlights;
