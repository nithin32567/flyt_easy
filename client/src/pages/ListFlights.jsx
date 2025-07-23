import React, { useEffect, useState } from "react";
import FlightCard from "../components/FlightCard";

const ListFlights = () => {
  const trips = JSON.parse(localStorage.getItem("trips"))
  const [flights, setFlights] = useState(trips[0].Journey)
  const [selectedFlight, setSelectedFlight] = useState(null)
  useEffect(() => {
    setFlights(trips[0].Journey)
  }, [])

  console.log(flights[0])
  return <div className="mt-30 max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {
      flights.map((flight, index) => (
        <FlightCard key={index} flight={flight} setSelectedFlight={setSelectedFlight} />
      ))
    }
  </div>;
};

export default ListFlights;
