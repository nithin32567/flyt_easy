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
import ProtectedRoute from "./components/ProtectedRoute";
import { FlightProvider } from "./contexts/FlightContext";
import { WebSettingsProvider, useWebSettings } from "./contexts/WebSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";

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
        {/* Public routes - accessible without authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/dmo" element={<Home />} />
        <Route path="/demobanner" element={<Demobanner />} />
        <Route path="/header-section" element={<HeaderSection />} />
        <Route path="/footer1" element={<Footer1 />} />
        <Route path="/footer" element={<Footer />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/flight-search" element={
          <ProtectedRoute>
            <FlightSearch />
          </ProtectedRoute>
        } />
        <Route path="/flight-list" element={
          <ProtectedRoute>
            <ListFlights />
          </ProtectedRoute>
        } />
        <Route path="/review" element={
          <ProtectedRoute>
            <OneWayReview />
          </ProtectedRoute>
        } />
        <Route path="/create-itenary" element={
          <ProtectedRoute>
            <Createitenary />
          </ProtectedRoute>
        } />
        <Route path="/booking-confirmation" element={
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        } />
        <Route path="/payment-error" element={
          <ProtectedRoute>
            <PaymentError />
          </ProtectedRoute>
        } />
        <Route path="/hotel-booking" element={
          <ProtectedRoute>
            <HotelBooking />
          </ProtectedRoute>
        } />
        <Route path="/hotel-details/:hotelId" element={
          <ProtectedRoute>
            <HotelDetails />
          </ProtectedRoute>
        } />
        <Route path="/hotel-payment-success" element={
          <ProtectedRoute>
            <HotelPaymentSuccess />
          </ProtectedRoute>
        } />
        <Route path="/payment-success" element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        } />
        <Route path="/one-way-review" element={
          <ProtectedRoute>
            <OneWayReview />
          </ProtectedRoute>
        } />
        {/* <Route path="/flight-listing" element={<FlightListing />} /> */}
      </Routes>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <WebSettingsProvider>
        <FlightProvider>
          <AppContent />
        </FlightProvider>
      </WebSettingsProvider>
    </AuthProvider>
  );
};

export default App;

