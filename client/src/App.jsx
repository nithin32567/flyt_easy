import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
// import Login from "./pages/Login";
import FlightSearch from "./pages/FlightSearch";
// import FlightListing from "./pages/FlightListing";
import OneWayReview from "./components/OneWayReview";
// import PaxDetails from "./pages/Pax-details";
// import Luggage from "./components/Luggage";
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentError from "./pages/PaymentError";
import PaymentSuccess from "./pages/PaymentSucccess";
import HotelBooking from "./pages/HotelBooking";
import HotelDetails from "./pages/HotelDetails";
import HotelPaymentSuccess from "./pages/HotelPaymentSuccess";
import Home from "./pages/Home";
import Demobanner from "./components/Demobanner";
import HeaderSection from "./components/HeaderSection";
import ListFlights from "./pages/ListFlights";
import Createitenary from "./pages/Createitenary";
import Footer1 from "./components/Footer1";
import HeaderWrapper from "./components/HeaderWrapper";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import { FlightProvider } from "./contexts/FlightContext";
import { WebSettingsProvider, useWebSettings } from "./contexts/WebSettingsContext";

// Component to handle app initialization
const AppContent = () => {
  const navigate = useNavigate();
  const { fetchWebSettings, loading: webSettingsLoading } = useWebSettings();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First fetch signature for authentication
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/signature`
        );
        const data = await response.json();
        console.log(data, "signature data");
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("ClientID", data.ClientID);
        if (data?.TUI) {
          localStorage.setItem("TUI", data.TUI);
        }
        
        // WebSettings will now be called after ExpressSearch completes
        // No need to call it here during app initialization
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, []); // Empty dependency array - only run once on mount

  if (webSettingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <HeaderWrapper />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/flight-list" element={<ListFlights />} />
        <Route path="/review" element={<OneWayReview />} />
        <Route path="/create-itenary" element={<Createitenary />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/payment-error" element={<PaymentError />} />
        <Route path="/hotel-booking" element={<HotelBooking />} />
        <Route path="/hotel-details/:hotelId" element={<HotelDetails />} />
        <Route path="/hotel-payment-success" element={<HotelPaymentSuccess />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/dmo" element={<Home />} />
        <Route path="/demobanner" element={<Demobanner />} />

        <Route path="/header-section" element={<HeaderSection />} />
        <Route path="/footer1" element={<Footer1 />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/flight-search" element={<FlightSearch />} />
        {/* <Route path="/flight-listing" element={<FlightListing />} /> */}
        <Route path="/one-way-review" element={<OneWayReview />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <WebSettingsProvider>
      <FlightProvider>
        <AppContent />
      </FlightProvider>
    </WebSettingsProvider>
  );
};

export default App;

