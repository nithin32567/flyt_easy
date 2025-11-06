import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import flightIcon from "../assets/img/flight-icon.png";
import hotelIcon from "../assets/img/hotel-booking.png";
import HotelSearch from "./HotelSearch";
import CarousalCites from "./CarousalCites";
import ShowAirports from "./modals/ShowAirports";
import TravellerAddModal from "./modals/TravellerAddModal";
import { CalanderModal } from "./modals/CalanderModal";
import { setDate } from "date-fns";
import { clearSearchData } from "../utils/clearBookingData";
import axios from "axios";

const SearchForm = () => {
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
  // // console.log(token, "token========================= 221");

  const [isCalanderModalOpen, setIsCalanderModalOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  // const token = localStorage.getItem("token");
  // !calander date state
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());

  const [dateType, setDateType] = useState("departure");
  // fetch  airports
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
        // // console.log(data, 'from the backend=========================');
      } catch (error) {
        // console.error("Error fetching airports:", error);
      }
    }
    fetchAirports();
  }, []);

  const getExpSearch = async (TUI) => {
    const payload = {
      TUI,
      token,
    };
    
    console.log('=== FRONTEND: FLIGHT GET EXP SEARCH API CALL ===');
    console.log('Flight Get Exp Search Payload ===>');
    console.log(JSON.stringify(payload, null, 2));
    console.log('=== END FLIGHT GET EXP SEARCH PAYLOAD ===');
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/flights/get-exp-search`,
        payload
      );
      
      console.log('=== FRONTEND: FLIGHT GET EXP SEARCH API RESPONSE ===');
      console.log('Flight Get Exp Search Response JSON ===>');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('=== END FLIGHT GET EXP SEARCH RESPONSE ===');

      // console.log("=== GET EXP SEARCH RESPONSE ===");
      // console.log("Payload sent to API:", response.data.payload);
      // console.log("Response from API:", response.data.response);
      // console.log("Full response data:", response.data);
      // console.log("=================================");
      if (response.statusText === "OK") {
        // console.log("inside the if condition");
        const trips = response.data.data.Trips;
        // console.log(trips, "trips=========================");
        localStorage.setItem("trips", JSON.stringify(trips));
        const TUI = response.data.data.TUI;
        // console.log(TUI, "TUI=========================");
        localStorage.setItem("TUI", TUI);
        
        // Call WebSettings after ExpressSearch completes with the ExpressSearch TUI
        try {
          const { fetchWebSettings } = await import('../contexts/WebSettingsContext');
          const webSettingsPayload = {
            ClientID: localStorage.getItem("ClientID"),
            TUI: TUI
          };
          
          console.log('=== FRONTEND: FLIGHT WEB SETTINGS API CALL ===');
          console.log('Flight Web Settings Payload ===>');
          console.log(JSON.stringify(webSettingsPayload, null, 2));
          console.log('=== END FLIGHT WEB SETTINGS PAYLOAD ===');
          
          const webSettingsResponse = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/flights/web-settings`,
            webSettingsPayload,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          
          console.log('=== FRONTEND: FLIGHT WEB SETTINGS API RESPONSE ===');
          console.log('Flight Web Settings Response JSON ===>');
          console.log(JSON.stringify(webSettingsResponse.data, null, 2));
          console.log('=== END FLIGHT WEB SETTINGS RESPONSE ===');
          // console.log("WebSettings called with ExpressSearch TUI:", webSettingsResponse.data);
        } catch (webSettingsError) {
          // console.error("Error calling WebSettings:", webSettingsError);
        }
        
        navigate("/flight-list");
      }
    } catch (error) {
      // console.log(error, "error from the backend=========================");
    }
  };

  // !Express Search
  async function handleExpressSearch(e) {
    e.preventDefault();

    if (tripType === "ON") {
      if (!from || !to || !departureDate) {
        alert("Please select From, To, and Departure Date");
        return;
      }
    } else {
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
      Trips: [
        {
          From: from,
          To: to,
          OnwardDate: departureDate.toISOString().split("T")[0],
          ReturnDate: returnDate.toISOString().split("T")[0],

          TUI: "",
        },
      ],
      token: token,
    };
    // console.log(payload, "payload to the backend========================= 221");
    // Clear previous search data to prevent conflicts
    clearSearchData();
    localStorage.setItem("searchPayload", JSON.stringify(payload));
    
    console.log('=== FRONTEND: FLIGHT EXPRESS SEARCH API CALL ===');
    console.log('Flight Express Search Payload ===>');
    console.log(JSON.stringify(payload, null, 2));
    console.log('=== END FLIGHT EXPRESS SEARCH PAYLOAD ===');
    
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
      
      console.log('=== FRONTEND: FLIGHT EXPRESS SEARCH API RESPONSE ===');
      console.log('Flight Express Search Response JSON ===>');
      console.log(JSON.stringify(data, null, 2));
      console.log('=== END FLIGHT EXPRESS SEARCH RESPONSE ===');
      // console.log("=== EXPRESS SEARCH RESPONSE ===");
      // console.log("Payload sent to API:", data.payload);
      // console.log("Response from API:", data.response);
      // console.log("Full response data:", data);
      // console.log("===============================");
      const TUI = data.TUI;
      await getExpSearch(TUI);
      // console.log(TUI, "TUI=========================");
      localStorage.setItem("searchTUI", TUI);
      localStorage.setItem("searchTUI", data.TUI);
      if (data.success && data.data?.TUI) {
        // console.log(
        //   "success and calling the getExpSearch================== 212"
        // );
      }
    } catch (error) {
      // console.log(error, "error from the backend=========================");
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

  return (
    <div className="w-full  ">
      <div className="w-full  mx-auto">
        <div className="bg-white w-full rounded-md  shadow-md">
          <ul
            className="flex bg-gray-200 items-center gap-2 sm:gap-4 rounded-t-md"
            id="myTab"
            role="tablist"
          >
            <li
              className="flex items-start w-full  sm:w-auto "
              role="presentation"
            >
              <button
                onClick={() => setIsActiveFlightTab(true)}
                className={`flex items-center gap-2 text-sm md:text-base w-full py-4 px-4 rounded-tl-2xl  ${
                  isActiveFlightTab ? "bg-white" : "bg-gray-200"
                }`}
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                <img
                  className="w-8 h-8 md:w-10 md:h-10"
                  src={flightIcon}
                  alt="Flight Booking"
                />
                <span className=" uppercase text-xs sm:text-base font-semibold ">Flight Booking</span>
                {/* <span className="sm:hidden">Flight</span> */}
              </button>
            </li>
            <li
              className="flex items-center gap-2 w-full sm:w-auto justify-center"
              role="presentation"
            >
              <button
                onClick={() => setIsActiveFlightTab(false)}
                className={`flex items-center gap-2 text-sm md:text-base w-full py-4 px-4 rounded-tr-2xl ${
                  !isActiveFlightTab ? "bg-white" : "bg-gray-200"
                }`}
                id="profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                <img
                  className="w-8 h-8 md:w-10 md:h-10"
                  src={hotelIcon}
                  alt="Hotel Booking"
                />
                <span className="uppercase  text-xs sm:text-base font-semibold">Hotel Booking</span>
                {/* <span className="sm:hidden">Hotel</span> */}
              </button>
            </li>
          </ul>
          <div id="myTabContent" className="p-4 md:p-8 space-y-4">
            {isActiveFlightTab && (
              <div id="home" role="tabpanel" aria-labelledby="home-tab">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 border-b pt-4 pb-8 md:pb-12 border-gray-200">
                  {/* !TRIP TYPE RADIO BUTTONS */}
                  <ul className="flex flex-wrap items-center gap-2 md:gap-4 text-sm md:text-base">
                    <li className="flex px-2 md:px-4 rounded-3xl hover:bg-gray-200 py-1 md:py-2 cursor-pointer">
                      <label className="cursor-pointer">
                        <input
                          onClick={() => setTripType("ON")}
                          type="radio"
                          name="trip"
                          id=""
                          defaultChecked=""
                          className="mr-2"
                        />{" "}
                        One Way
                      </label>
                    </li>
                    <li className="flex px-2 md:px-4 rounded-3xl hover:bg-gray-200 py-1 md:py-2">
                      <label className="cursor-pointer">
                        <input
                          onClick={() => setTripType("RT")}
                          type="radio"
                          name="trip"
                          id=""
                          className="mr-2"
                        />{" "}
                        Round Trip
                      </label>
                    </li>
                    <li className="flex px-2 md:px-4 rounded-3xl hover:bg-gray-200 py-1 md:py-2">
                      <label className="cursor-pointer">
                        <input
                          onClick={() => setTripType("MC")}
                          type="radio"
                          name="trip"
                          id=""
                          className="mr-2"
                        />{" "}
                        Multi City
                      </label>
                    </li>
                  </ul>
                </div>

                {/* FORM SUBMIT SECTIONS  */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 border-b border-gray-200">
                  <div className="w-full lg:w-1/2">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <div
                        onClick={() => {
                          setIsOpen(true);
                          setLabel("From");
                        }}
                        className="w-full sm:w-1/2 cursor-pointer"
                      >
                        <button className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full cursor-pointer hover:bg-gray-100">
                          <h6 className="text-xs md:text-sm">FROM</h6>
                          <h2 className="text-lg md:text-2xl font-bold">
                            {from?.Name || "Mumbai"} {from?.Code || "BOM"}
                          </h2>
                          <p className="text-xs text-gray-500 truncate">
                            [{from?.Code || "BOM"}] {from?.Name || "Mumbai"}
                          </p>
                        </button>
                      </div>
                      <div
                        onClick={() => {
                          setIsOpen(true);
                          setLabel("To");
                        }}
                        className="w-full sm:w-1/2 cursor-pointer"
                      >
                        <button className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full cursor-pointer hover:bg-gray-100">
                          <h6 className="text-xs md:text-sm">To</h6>
                          <h2 className="text-lg md:text-2xl font-bold">
                            {to?.Name || "New Delhi"} {to?.Code || "DEL"}
                          </h2>
                          <p className="text-xs text-gray-500 truncate">
                            [{to?.Code || "DEL"}] {to?.Name || "New Delhi"}
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <div className="w-full sm:w-1/3">
                        <button
                          onClick={() => {
                            setIsCalanderModalOpen(true);
                            setDateType("departure");
                          }}
                          className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full cursor-pointer hover:bg-gray-100"
                        >
                          <h6 className="text-xs md:text-sm">DEPART</h6>
                          <h2 className="text-lg md:text-xl font-bold">
                            {departureDate.getDate()}{" "}
                            <span className="text-black">
                              {departureDate.toLocaleString("default", {
                                month: "short",
                              })}
                            </span>
                          </h2>
                          <p className="text-xs text-gray-500 truncate">
                            Wednesday
                          </p>
                        </button>
                      </div>
                      <div className="w-full sm:w-1/3">
                        <button
                          onClick={() => {
                            setIsCalanderModalOpen(true);
                            setDateType("return");
                          }}
                          className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full cursor-pointer hover:bg-gray-100"
                        >
                          <h6 className="text-xs md:text-sm">RETURN</h6>
                          <h2 className="text-lg md:text-xl font-bold">
                            {returnDate.getDate()}{" "}
                            <span className="text-black">
                              {returnDate.toLocaleString("default", {
                                month: "short",
                              })}
                            </span>
                          </h2>
                          <p className="text-xs text-gray-500 truncate">
                            Tuesday
                          </p>
                        </button>
                      </div>
                      <div
                        onClick={() => setTravellerModalOpen(true)}
                        className="w-full sm:w-1/3 cursor-pointer"
                      >
                        <button className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full">
                          <h6 className="text-xs md:text-sm">Travellers</h6>
                          <h2 className="text-lg md:text-xl text-left justify-start items-center flex gap-1 font-bold">
                            {adults + children + infants}{" "}
                            <span className="text-black"> Travellers</span>
                          </h2>
                          <p className="text-xs text-gray-500 truncate">
                            {travelClass}
                          </p>
                        </button>
                      </div>
                      <div className="w-full sm:w-1/3">
                        <button
                          onClick={handleExpressSearch}
                          className="bg-[#f48f22] font-semibold text-white rounded-md px-6 md:px-12 py-3 w-full text-sm md:text-base"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <ul className="flex flex-wrap items-center gap-2 md:gap-4 py-4 md:py-8 px-2 md:px-4 text-xs md:text-sm">
                    <li className="flex items-center gap-2">
                      <label>
                        <input type="checkbox" name="" id="" /> Direct Flights
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Defence Fare
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Student Fare
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Senior Citizen
                        Fare
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {!isActiveFlightTab && <HotelSearch />}
          </div>
        </div>
      </div>
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
        // onApply={handleApplyTraveller}
        initial={{ adults, children, infants, travelClass }}
        onApply={handleApplyTraveller}
      />
      {/* !calander modal */}
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

export default SearchForm;
