import React, { useEffect } from "react";

import googleplay from "../assets/img/googleplay.png";
import appstore from "../assets/img/appstore.png";
import qrCode from "../assets/img/qr-code.jpg";

import BannerWrapper from "../components/Banner-Wrapper";
import FlightHotelWearchWrapper from "../components/flight-hotel-search-wrapper";

import UnveilMagicCarousal from "../components/UnveilMagicCarousal";
import FlightLogosCarousal from "../components/FlightLogosCarousal";
import HomeBotttom from "../components/HomeBotttom";
import AuthStatus from "../components/AuthStatus";
import { clearSearchData, clearAllBookingData, debugLocalStorage } from "../utils/clearBookingData";

const Home = () => {
  // Only clear search data if user is starting a new search (not in middle of booking)
  useEffect(() => {
    // Check if user is coming from a completed booking or starting fresh
    const isNewSearch = !localStorage.getItem('trips') || localStorage.getItem('bookingSuccess');
    
    if (isNewSearch) {
      clearSearchData();
      // console.log('✅ Cleared search data on home page load (new search)');
    } else {
      // console.log('✅ Preserving existing search data (user in booking flow)');
    }
  }, []);

  // Debug functions for testing
  const handleDebugLocalStorage = () => {
    debugLocalStorage();
  };

  const handleClearAllData = () => {
    clearAllBookingData();
    alert('All booking data cleared! Check console for details.');
  };

  return (
    <>
      {/* <AuthStatus /> */}
      <BannerWrapper />
      <FlightHotelWearchWrapper/>
      <UnveilMagicCarousal />
      <FlightLogosCarousal />
      <div className="container">
        <div className="getappnow-wrapper">
          <div className="row">
            <div className="col-lg-6">
              <h3>
                Plan, Book &amp; Travel On-the-Go <br />
                Get the App Now!
              </h3>
              <div className="row">
                <div className="col-lg-8 col-md-8">
                  <input type="text" placeholder="Enter Your Mobile Number" />
                </div>
                <div className="col-lg-4 col-md-4">
                  <button>Send</button>
                </div>
              </div>
            </div>
            <div className="col-lg-2" />
            <div className="col-lg-4">
              <div className="apps-qrcode">
                <div className="downloadapp-buttons">
                  <a href="">
                    <img src={googleplay} alt="Goolge Play" />
                  </a>
                  <a href="">
                    <img src={appstore} alt="Appstore" />
                  </a>
                </div>
                <span>
                  <img src={qrCode} alt="QR Code" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeBotttom />
      
      {/* Debug buttons - remove in production */}
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        {/* <button onClick={handleDebugLocalStorage} style={{ margin: '5px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}>
          Debug localStorage
        </button>
        <button onClick={handleClearAllData} style={{ margin: '5px', padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}>
          Clear All Data
        </button> */}
      </div>
    </>
  );
};

export default Home;
