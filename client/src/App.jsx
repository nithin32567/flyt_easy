import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
import FlightSearch from "./pages/FlightSearch";
import FlightListing from "./pages/FlightListing";
import OneWayReview from "./pages/OneWayReview";
import PaxDetails from "./pages/Pax-details";
import Luggage from "./components/Luggage";
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentError from "./pages/PaymentError";
import PaymentSuccess from "./pages/PaymentSuccess";
import HotelBooking from "./pages/HotelBooking";
import HotelDetails from "./pages/HotelDetails";
import HotelPaymentSuccess from "./pages/HotelPaymentSuccess";
import Dmo from "./pages/Dmo";
import Demobanner from "./components/Demobanner";
import HeaderSection from "./components/HeaderSection";
import ListFlights from "./pages/ListFlights";

const App = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchSignature = async () => {
      const response = await fetch(
        `/api/signature`
      );
      const data = await response.json();
      // console.log(data, "data");
      localStorage.setItem("token", data.token);
      localStorage.setItem("ClientID", data.ClientID);
    };
    fetchSignature();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollPosition(window.scrollY);
    });
    return () => {
      window.removeEventListener("scroll", () => {
        setScrollPosition(window.scrollY);
      });
    };
  }, []);

  const headerStyle =
    scrollPosition > 200
      ? "w-full fixed top-0 left-0 right-0 z-90 shadow-md bg-white"
      : "fixed -top-3 left-0 right-0 z-90 max-w-[95%] mx-auto rounded-xl my-12 shadow-md";
  return (
    <div className=" ">
      <div className={headerStyle}>
        <HeaderSection />
      </div>

      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/" element={<FlightSearch />} />
          <Route path="/flight-list" element={<ListFlights />} />
          <Route path="/one-way-review" element={<OneWayReview />} />
          <Route path="/pax-details" element={<PaxDetails />} />
          <Route path="/luggage" element={<Luggage />} />
          <Route
            path="/booking-confirmation"
            element={<BookingConfirmation />}
          />
          <Route path="/payment-error" element={<PaymentError />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/hotel-booking" element={<HotelBooking />} />
          <Route path="/hotel-details/:hotelId" element={<HotelDetails />} />
          <Route
            path="/hotel-payment-success"
            element={<HotelPaymentSuccess />}
          />
          <Route path="/dmo" element={<Dmo />} />
          <Route path="/demobanner" element={<Demobanner />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
