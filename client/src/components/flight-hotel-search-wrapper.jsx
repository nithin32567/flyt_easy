import React, { useState, useEffect } from "react";
import TabNavigation from "./TabNavigation";
import FlightSearch from "./FlightSearch";
import HotelSearch from "./HotelSearch";

const FlightHotelWearchWrapper = () => {
  const [isActiveFlightTab, setIsActiveFlightTab] = useState(true);
  const [airports, setAirports] = useState([]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const token = localStorage.getItem("token");
  const [ClientID, setClientID] = useState(localStorage.getItem("ClientID"));

  // fetch airports
  useEffect(() => {
    async function fetchAirports() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/flights/airports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        // console.error("Error fetching airports:", error);
      }
    }
    fetchAirports();
  }, []);


  return (
    <div>
      <section>
        <div style={{ zIndex: 1 }} className="container">
          <div className="booking-tabs-wrapper">
            <TabNavigation 
              isActiveFlightTab={isActiveFlightTab} 
              setIsActiveFlightTab={setIsActiveFlightTab} 
            />
            <div className="tab-content" id="myTabContent">
              {isActiveFlightTab && (
                <FlightSearch
                  airports={airports}
                  setAirports={setAirports}
                  token={token}
                  ClientID={ClientID}
                />
              )}
              {!isActiveFlightTab && (
                <HotelSearch
                  token={token}
                  adults={adults}
                  children={children}
                  setAdults={setAdults}
                  setChildren={setChildren}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FlightHotelWearchWrapper;
