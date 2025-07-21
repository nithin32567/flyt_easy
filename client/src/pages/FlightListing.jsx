import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterSearch from "../components/FilterSearch";

function formatTime(timeStr) {
  if (!timeStr) return "--:--";
  const t = timeStr.split("T")[1];
  return t ? t.slice(0, 5) : "--:--";
}

function getStops(flight) {
  if (flight.Stops === 0) return "Non Stop";
  if (flight.Stops === 1) return "1 Stop";
  return `${flight.Stops} Stops`;
}

function getLayoverInfo(flight) {
  if (
    !flight.Connections ||
    !Array.isArray(flight.Connections) ||
    flight.Connections.length === 0
  )
    return null;
  // Each connection: { Layover: "01h 15m", City: "Raipur" }
  return flight.Connections.map((conn, idx) => (
    <div key={idx} className="text-xs text-red-500 flex items-center gap-1">
      <span>
        ⟲ {conn.Layover} layover at {conn.City}
      </span>
    </div>
  ));
}

function getHour(timeStr) {
  if (!timeStr) return null;
  const t = timeStr.split("T")[1];
  if (!t) return null;
  return parseInt(t.slice(0, 2), 10);
}

const priceRanges = [
  { min: 5000, max: 10000 },
  { min: 10000, max: 20000 },
  { min: 20000, max: 30000 },
  { min: 30000, max: Infinity },
];
const timeRanges = [
  { start: 0, end: 5 },
  { start: 5, end: 12 },
  { start: 12, end: 18 },
  { start: 18, end: 24 },
];

// const smartPrice=localStorage.getItem('smartPrice');

const FlightListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flights = location.state?.flights || [];
  const [filters, setFilters] = useState({});
  const clientId = localStorage.getItem("clientId");
  const token = localStorage.getItem("token");
  const TUI = localStorage.getItem("search-tui");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const searchPayload = JSON.parse(localStorage.getItem("searchPayload"));
  console.log(searchPayload, "searchPayload=========================");

  // const searchTui=localStorage.getItem('search-tui');
  // const clientId=localStorage.getItem('clientId');

  // smart price api call ==================================================
  const getSmartPrice = async (flight) => {
    console.log(flight, "flight");
    const searchTUI = localStorage.getItem("getExpSearchTUI");
    console.log(searchTUI, "getExpSearchTUI before sending to smart price");

    const payload = {
      // Trips:[
      //  {
      //   Amount:flight.GrossFare,
      //   Index:flight.Index,
      //   OrderID:1,
      //   TUI:searchTui
      //  }
      // ],
      // ClientID:clientId,
      // Mode:searchPayload.Mode,
      // Options:"A",`
      // Source:searchPayload.Source,
      // TripType:searchPayload.FareType,
      //send as plane
      Amount: flight.GrossFare,
      Index: flight.Index,
      OrderID: 1,
      TUI: searchTUI,
      ClientID: "",
      Mode: "AS",
      Options: "A",
      Source: "SF",
      TripType: "ON",
    };

    const response = await fetch(`${baseUrl}/api/smartPrice`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    console.log(data, "SmartPrice response");
    if (data.success) {
      console.log(
        "success                                              ================================"
      );
      localStorage.setItem(
        "oneWayReviewData",
        JSON.stringify(data.data.pricerData)
      );
      navigate("/one-way-review");
    } else {
      console.log(
        "failed                                              ================================"
      );
      alert("Failed to execute SmartPricer");
    }
  };

  useEffect(() => {
    if (!flights || flights.length === 0) {
      navigate("/search");
    }
  }, [flights, navigate]);

  // Extract unique airlines
  const airlines = useMemo(() => {
    const set = new Set();
    flights.forEach((f) => {
      (f.AirlineName || "").split("|").forEach((a) => a && set.add(a.trim()));
    });
    return Array.from(set);
  }, [flights]);

  // Filtering logic
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      // Price
      if (filters.price != null) {
        const { min, max } = priceRanges[filters.price];
        if (flight.GrossFare < min || flight.GrossFare > max) return false;
      }
      // Time
      if (filters.times && filters.times.length > 0) {
        const depHour = getHour(flight.DepartureTime);
        if (
          !filters.times.some(
            (idx) =>
              depHour >= timeRanges[idx].start && depHour < timeRanges[idx].end
          )
        )
          return false;
      }
      // Stops
      if (filters.stops && filters.stops.length > 0) {
        if (!filters.stops.includes(flight.Stops)) return false;
      }
      // Airlines
      if (filters.airlines && filters.airlines.length > 0) {
        const airlineList = (flight.AirlineName || "")
          .split("|")
          .map((a) => a.trim());
        if (!airlineList.some((a) => filters.airlines.includes(a)))
          return false;
      }
      return true;
    });
  }, [flights, filters]);

  if (!flights || flights.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 relative">
      <FilterSearch airlines={airlines} onFilterChange={setFilters} />
      <div className="pr-80">
        {" "}
        {/* Add padding for sidebar */}
        {filteredFlights.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500 mt-8">
            No flights found for the selected criteria.
          </div>
        ) : (
          filteredFlights.map((flight, idx) => (
            <div
              key={idx}
              className="bg-white rounded shadow p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-bold text-lg">
                    {flight.AirlineName?.split("|")[0] || "Unknown Airline"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {flight.FlightNo}
                  </span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-semibold">
                    {formatTime(flight.DepartureTime)}
                  </span>
                  <span className="text-xs text-gray-500">{flight.From}</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-semibold">
                    {formatTime(flight.ArrivalTime)}
                  </span>
                  <span className="text-xs text-gray-500">{flight.To}</span>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm">{flight.Duration || "--"}</span>
                  <span className="text-xs text-gray-500">
                    {getStops(flight)}
                  </span>
                  {getLayoverInfo(flight)}
                </div>
              </div>
              <div className="flex flex-col items-center mt-4 md:mt-0">
                <span className="text-xl font-bold text-blue-700">
                  ₹{flight.GrossFare || "N/A"}
                </span>
                <button
                  onClick={() => {
                    // localStorage.setItem('flight-data', JSON.stringify(flight));
                    getSmartPrice(flight);
                  }}
                  className="mt-2 bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
                >
                  Book
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FlightListing;
