import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import flightIcon from "../assets/img/flight-icon.png";
import hotelIcon from "../assets/img/hotel-booking.png";
import HotelSearch from "./HotelSearch";
import ShowAirports from "./modals/ShowAirports";
import TravellerAddModal from "./modals/TravellerAddModal";
import { CalanderModal } from "./modals/CalanderModal";
import MultiCitySearch from "./MultiCitySearch";
import axios from "axios";

const FlightHotelWearchWrapper = () => {
  const [isActiveFlightTab, setIsActiveFlightTab] = useState(true);
  const [tripType, setTripType] = useState("ON");
  const [from, setFrom] = useState("BOM");
  const [to, setTo] = useState("DEL");
  const [travelClass, setTravelClass] = useState("Economy");
  const [airports, setAirports] = useState([]);
  const [travellerModalOpen, setTravellerModalOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [label, setLabel] = useState("From");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  const [isCalanderModalOpen, setIsCalanderModalOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
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
        console.error("Error fetching airports:", error);
      }
    }
    fetchAirports();
  }, []);

  const getExpSearch = async (TUI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/flights/get-exp-search`,
        {
          TUI,
          token,
        }
      );

      console.log(
        response,
        "response from the backend========================= get exp search"
      );
      if (response.statusText === "OK") {
        console.log("inside the if condition");
        const trips = response.data.data.Trips;
        console.log(trips, "trips=========================");
        localStorage.setItem("trips", JSON.stringify(trips));
        const TUI = response.data.data.TUI;
        console.log(TUI, "TUI=========================");
        localStorage.setItem("TUI", TUI);
        navigate("/flight-list");
      }
    } catch (error) {
      console.log(error, "error from the backend=========================");
    }
  };

  // Express Searchhea
  async function handleExpressSearch(e) {
    e.preventDefault();
    

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
          From: from,
          To: to,
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
    console.log(payload, "payload to the backend========================= 221");
    localStorage.removeItem("trips");
    localStorage.removeItem("TUI");
    localStorage.removeItem("pricerTUI");
    localStorage.removeItem("pricerData");
    localStorage.removeItem("searchTUI");
    localStorage.removeItem("searchPayload");
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
      console.log(data, "data from the backend========================= 221");
      const TUI = data.TUI;
      await getExpSearch(TUI);
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

    console.log(payload, "multi-city payload to the backend=========================");
    localStorage.removeItem("trips");
    localStorage.removeItem("TUI");
    localStorage.removeItem("pricerTUI");
    localStorage.removeItem("pricerData");
    localStorage.removeItem("searchTUI");
    localStorage.removeItem("searchPayload");
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
    <div>
      <section>
        <div className="container">
          <div className="booking-tabs-wrapper">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item items-center justify-center" role="presentation">
                <button
                  onClick={() => setIsActiveFlightTab(true)}
                  className={`nav-link ${isActiveFlightTab ? "active" : ""} `}
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected={isActiveFlightTab}
                >
                  <img src={flightIcon} alt="Flight Booking" />
                  Flight Booking
                </button>
              </li>
              <li className="nav-item items-center justify-center" role="presentation">
                <button
                  onClick={() => setIsActiveFlightTab(false)}
                  className={`nav-link ${!isActiveFlightTab ? "active" : ""}`}
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected={!isActiveFlightTab}
                >
                  <img src={hotelIcon} alt="Hotel Booking" /> Hotel Booking
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              {isActiveFlightTab && (
                <div
                  className="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div className="onewar-roundtrip">
                    <ul>
                      <li>
                        <label>
                          <input
                            onChange={() => setTripType("ON")}
                            type="radio"
                            name="trip"
                            id="oneway"
                            checked={tripType === "ON"}
                          />{" "}
                          One Way 
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            onChange={() => setTripType("RT")}
                            type="radio"
                            name="trip"
                            id="roundtrip"
                            checked={tripType === "RT"}
                          />{" "}
                          Round Trip
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            onChange={() => setTripType("MC")}
                            type="radio"
                            name="trip"
                            id="multicity"
                            checked={tripType === "MC"}
                          />{" "}
                          Multi City
                        </label>
                      </li>
                    </ul>
                  </div>
                  {tripType === "MC" ? (
                    <MultiCitySearch
                      airports={airports}
                      onSearch={handleMultiCitySearch}
                      isSearching={isSearching}
                      adults={adults}
                      children={children}
                      infants={infants}
                      travelClass={travelClass}
                      onTravellerClick={() => setTravellerModalOpen(true)}
                    />
                  ) : (
                    <div className="row">
                      <div className="col-lg-5">
                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <button
                              className="select-items"
                              onClick={() => {
                                setIsOpen(true);
                                setLabel("From");
                              }}
                            >
                              <h6>FROM</h6>
                              <h2>
                                {from?.Name || "Mumbai"} {from?.Code || "BOM"}
                              </h2>
                              <p>
                                [{from?.Code || "BOM"}] {from?.Name || "Mumbai"}
                              </p>
                            </button>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <button
                              className="select-items"
                              onClick={() => {
                                setIsOpen(true);
                                setLabel("To");
                              }}
                            >
                              <h6>To</h6>
                              <h2>
                                {to?.Name || "New Delhi"} {to?.Code || "DEL"}
                              </h2>
                              <p>
                                [{to?.Code || "DEL"}] {to?.Name || "New Delhi"}
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <div className="row">
                          <div className="col-lg-3 col-md-4 col-6">
                            <button
                              className="select-items"
                              onClick={() => {
                                setIsCalanderModalOpen(true);
                                setDateType("departure");
                              }}
                            >
                              <h6>DEPART</h6>
                              <h2>
                                {departureDate.getDate()}{" "}
                                <span>
                                  {departureDate.toLocaleString("default", {
                                    month: "short",
                                  })}
                                </span>
                              </h2>
                              <p>
                                {departureDate.toLocaleString("default", {
                                  weekday: "long",
                                })}
                              </p>
                            </button>
                          </div>
                          {tripType === "RT" && (
                            <div className="col-lg-3 col-md-4 col-6">
                              <button
                                className="select-items"
                                onClick={() => {
                                  setIsCalanderModalOpen(true);
                                  setDateType("return");
                                }}
                              >
                                <h6>RETURN</h6>
                                <h2>
                                  {returnDate.getDate()}{" "}
                                  <span>
                                    {returnDate.toLocaleString("default", {
                                      month: "short",
                                    })}
                                  </span>
                                </h2>
                                <p>
                                  {returnDate.toLocaleString("default", {
                                    weekday: "long",
                                  })}
                                </p>
                              </button>
                            </div>
                          )}
                          <div className="col-lg-3 col-md-4">
                            <button
                              className="select-items"
                              onClick={() => setTravellerModalOpen(true)}
                            >
                              <h6>Travellers</h6>
                              <h2>
                                {adults + children + infants}{" "}
                                <span>Travellers</span>
                              </h2>
                              <p>{travelClass}</p>
                            </button>
                          </div>
                          <div className="col-lg-3">
                            <button
                              className="search-btn"
                              onClick={handleExpressSearch}
                              disabled={isSearching}
                            >
                              {isSearching ? "Searching..." : "Search"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bookingcheckbox">
                    <ul>
                      <li>
                        <label>
                          <input onChange={() => setIsDirect(!isDirect)} checked={isDirect} type="checkbox" name="" id="" /> Direct Flights
                        </label>
                      </li>
                      <li>
                        <label>
                          <input onChange={() => setIsDefenceFare(!isDefenceFare)} checked={isDefenceFare} type="checkbox" name="" id="" /> Defence Fare
                        </label>
                      </li>
                      <li>
                        <label>
                          <input onChange={() => setIsStudentFare(!isStudentFare)} checked={isStudentFare} type="checkbox" name="" id="" /> Student Fare
                        </label>
                      </li>
                      <li>
                        <label>
                          <input onChange={() => setIsSeniorCitizenFare(!isSeniorCitizenFare)} checked={isSeniorCitizenFare} type="checkbox" name="" id="" /> Senior Citizen
                          Fare
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              {!isActiveFlightTab && (
                <div
                  className="tab-pane fade show active"
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <div className="onewar-roundtrip">
                    <ul>
                      <li>
                        <label>
                          <input
                            type="radio"
                            name="trips"
                            id=""
                            defaultChecked=""
                          />{" "}
                          Upto 4 Rooms
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="radio" name="trips" id="" /> Group Deals
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="row">
                    <div className="col-lg-5">
                      <div className="row">
                        <div className="col-lg-7 col-md-6">
                          <button className="select-items">
                            <h6>City, Property name or Location</h6>
                            <h2>Goa</h2>
                            <p>India</p>
                          </button>
                        </div>
                        <div className="col-lg-5 col-md-6">
                          <button className="select-items">
                            <h6>Rooms &amp; Guests</h6>
                            <h2>
                              1 <span>Rooms</span> 2 <span>Adults</span>
                            </h2>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7">
                      <div className="row">
                        <div className="col-lg-3 col-md-4 col-6">
                          <button className="select-items">
                            <h6>Check-In</h6>
                            <h2>
                              16 <span>Jul'25</span>
                            </h2>
                            <p>Sunday</p>
                          </button>
                        </div>
                        <div className="col-lg-3 col-md-4 col-6">
                          <button className="select-items">
                            <h6>Check-Out</h6>
                            <h2>
                              16 <span>Jul'25</span>
                            </h2>
                            <p>Sunday</p>
                          </button>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <button className="select-items">
                            <h6>Price per Night</h6>
                            <h2>
                              <span>₹0-₹1500</span>
                            </h2>
                          </button>
                        </div>
                        <div className="col-lg-3">
                          <button className="search-btn">Search</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="trendingsearches">
                    <h5>Trending Searches:</h5>
                    <ul>
                      <li>
                        <button>Dubai, United Arab Emirates</button>
                      </li>
                      <li>
                        <button>Mumbai, India</button>
                      </li>
                      <li>
                        <button>London, United Kingdom</button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default FlightHotelWearchWrapper;
