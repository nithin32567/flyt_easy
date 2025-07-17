import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import FlightSearch from './pages/FlightSearch'
import FlightListing from './pages/FlightListing'
import OneWayReview from './pages/OneWayReview'
import PaxDetails from './pages/Pax-details'
import Luggage from './components/Luggage'
import BookingConfirmation from './pages/BookingConfirmation'
import PaymentError from './pages/PaymentError'
import PaymentSuccess from './pages/PaymentSuccess'
import HotelBooking from './pages/HotelBooking'
import HotelDetails from './pages/HotelDetails'
import HotelPaymentSuccess from './pages/HotelPaymentSuccess'
import Dmo from './pages/Dmo'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<FlightSearch />} />
        <Route path="/flight-listing" element={<FlightListing />} />
        <Route path="/one-way-review" element={<OneWayReview />} />
        <Route path="/pax-details" element={<PaxDetails />} />
        <Route path="/luggage" element={<Luggage />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/payment-error" element={<PaymentError />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/hotel-booking" element={<HotelBooking />} />
        <Route path="/hotel-details/:hotelId" element={<HotelDetails />} />
        <Route path="/hotel-payment-success" element={<HotelPaymentSuccess />} />
        <Route path="/dmo" element={<Dmo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App