import React, { useEffect, useState } from "react";
import FlightCard from "../components/FlightCard";
import FilterSidebar from "../components/flight/FilterSidebar";
import { useFlight } from "../contexts/FlightContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Filter, X, Menu } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(128);

  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    const calculateHeaderHeight = () => {
      const headerDiv = document.querySelector('.header-wrapper-div');
      if (headerDiv) {
        const height = headerDiv.offsetHeight;
        setHeaderHeight(height);
      } else {
        // Fallback heights based on screen size
        const width = window.innerWidth;
        if (width < 540) {
          setHeaderHeight(80);
        } else if (width < 768) {
          setHeaderHeight(90);
        } else {
          setHeaderHeight(128);
        }
      }
    };

    checkMobile();

    // Calculate header height after a short delay to ensure DOM is ready
    setTimeout(calculateHeaderHeight, 100);

    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', calculateHeaderHeight);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', calculateHeaderHeight);
    };
  }, []);

  // Recalculate header height when component mounts
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const headerDiv = document.querySelector('.header-wrapper-div');
      if (headerDiv) {
        const height = headerDiv.offsetHeight;
        setHeaderHeight(height);
      } else {
        // Fallback heights based on screen size
        const width = window.innerWidth;
        if (width < 540) {
          setHeaderHeight(80);
        } else if (width < 768) {
          setHeaderHeight(90);
        } else {
          setHeaderHeight(128);
        }
      }
    };

    // Calculate immediately and after a delay
    calculateHeaderHeight();
    setTimeout(calculateHeaderHeight, 200);
  }, []);

  useEffect(() => {
    if (!trips) {
      navigate("/", { replace: true });
    } else {
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
      const storedTrips = localStorage.getItem("trips");
      if (storedTrips) {
        try {
          const parsedTrips = JSON.parse(storedTrips);
          setTrips(parsedTrips);
          return;
        } catch (error) {
        }
      }

      navigate("/");
      alert("No Flights Found, Please try again!!!");
    }
  }, [trips, navigate]);
  const handleBookFlight = async () => {
    if (!tripType) {
      alert("No Trip Type Found, Please try again!!!")
      navigate("/")
      return
    }

    if (tripType === "RT") {
      if (!selectedFlight || !selectedReturnFlight) {
        alert("Please select both onward and return flights for round trip")
        return
      }
    } else if (!selectedFlight) {
      alert("Please select a flight")
      return
    }

    let tripsToSend = [];

    if (tripType === "RT") {
      tripsToSend = [selectedFlight, selectedReturnFlight];
    } else {
      tripsToSend = [selectedFlight];
    }


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


      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/smart-price`, payload)


      if (response.status === 200) {
        const pricerTUI = response.data.TUI
        localStorage.setItem("pricerTUI", pricerTUI)

        await getPricer()
      } else {
        alert("Failed to process flight pricing. Please try again.")
      }
    } catch (error) {

      if (error.response) {
        alert(`Error: ${error.response.data?.Msg || "Failed to process flight pricing. Please try again."}`)
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.")
      } else {
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


      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/get-pricer`, payload)


      if (response.status === 200) {
        const data = response.data
        localStorage.setItem("pricerData", JSON.stringify(data.data))
        localStorage.setItem("netamount", data.data.NetAmount.toString())
        localStorage.setItem("oneWayReviewData", JSON.stringify(data.data))
        localStorage.setItem("pricerTUI", data.data.TUI)
        navigate("/one-way-review")
      } else {
        alert("Something went wrong, Please try again!!!")
        navigate("/")
      }
    } catch (error) {

      if (error.response) {
        alert(`Error: ${error.response.data?.Msg || "Failed to get pricing details. Please try again."}`)
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.")
      } else {
        alert("An unexpected error occurred. Please try again.")
      }
      navigate("/")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl">Loading flights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flight-list-main">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`flight-filter-toggle ${sidebarOpen ? 'active' : ''}`}
        style={{ top: `${headerHeight + 20}px` }}
        aria-label="Toggle filters"
      >
        {isMobile ? <Menu className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
        <span className="text-sm font-medium">
          {isMobile
            ? (sidebarOpen ? 'Hide' : 'Filters')
            : (sidebarOpen ? 'Hide Filters' : 'Show Filters')
          }
        </span>
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="flight-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`flight-sidebar transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <FilterSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div
        className={`flight-list-content transition-all duration-300 ${sidebarOpen && !isMobile ? 'sidebar-open' : ''}`}
        style={{ paddingTop: `${headerHeight}px` }}
      >
        {/* Header */}
        <div className="flight-list-header py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
              {tripType === "RT" ? "Select Onward and Return Flights" : "Available Flights"}
            </h1>
          </div>
        </div>

        {/* Content Container */}
        <div className=" mx-auto px-4  py-6">
          {/* Onward Flights */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {tripType === "RT" ? "Onward Flights" : ""}
            </h2>
            <div className="flight-card-grid">
              {filteredFlights.length > 0 ? filteredFlights.map((flight, index) => (
                <div key={`onward-${index}`} className="flight-card-container">
                  <FlightCard
                    flight={flight}
                    setSelectedFlight={setSelectedFlight}
                    isSelected={selectedFlight?.Index === flight.Index}
                    tripType="onward"
                  />
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-2xl font-bold text-gray-500">No onward flights found</div>
                </div>
              )}
            </div>
          </div>

          {/* Return Flights */}
          {tripType === "RT" && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Return Flights</h2>
              <div className="flight-card-grid">
                {filteredReturnFlights.length > 0 ? filteredReturnFlights.map((flight, index) => (
                  <div key={`return-${index}`} className="flight-card-container">
                    <FlightCard
                      flight={flight}
                      setSelectedFlight={setSelectedReturnFlight}
                      isSelected={selectedReturnFlight?.Index === flight.Index}
                      tripType="return"
                    />
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-2xl font-bold text-gray-500">No return flights found</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="flight-bottom-bar">
          <div className="flight-bottom-content">
            <div className="flight-selection-info">
              <div className="flight-selection-title">
                {tripType === "RT" ? "Round Trip Selection" : "Flight Selection"}
              </div>
              <div className="flight-selection-status">
                {selectedFlight ? (
                  <span className="text-green-600">✓ {selectedFlight.AirlineName} Selected</span>
                ) : (
                  <span className="text-gray-500">No flight selected</span>
                )}
                {tripType === "RT" && (
                  <span className="ml-2 sm:ml-4">
                    {selectedReturnFlight ? (
                      <span className="text-green-600">✓ Return Selected</span>
                    ) : (
                      <span className="text-gray-500">No return flight selected</span>
                    )}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleBookFlight}
              className={`flight-book-button ${!selectedFlight || (tripType === "RT" && !selectedReturnFlight) ? 'disabled' : ''
                }`}
              disabled={!selectedFlight || (tripType === "RT" && !selectedReturnFlight)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span>
                {tripType === "RT" ? "Book Round Trip" : "Book Flight"}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ListFlights;
