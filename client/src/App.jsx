import React, { useEffect} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import FlightSearch from "./pages/FlightSearch";
import OneWayReview from "./components/OneWayReview";
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentError from "./pages/PaymentError";
import PaymentSuccess from "./pages/PaymentSucccess";
import HotelBooking from "./pages/HotelBooking";
import HotelDetails from "./pages/HotelDetails";
import HotelPaymentSuccess from "./pages/HotelPaymentSuccess";
import Home from "./pages/Home";
import ListFlights from "./pages/ListFlights";
import Createitenary from "./pages/Createitenary";
import HeaderWrapper from "./components/HeaderWrapper";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { FlightProvider } from "./contexts/FlightContext";
import { WebSettingsProvider, useWebSettings } from "./contexts/WebSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";

const AppContent = () => {
  const navigate = useNavigate();
  const { fetchWebSettings, loading: webSettingsLoading } = useWebSettings();

  useEffect(() => {

    const initializeApp = async () => {
      try {
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
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, []); 

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

