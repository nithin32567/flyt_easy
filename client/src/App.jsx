import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import FlightSearch from './pages/FlightSearch'
import FlightListing from './pages/FlightListing'
import OneWayReview from './pages/OneWayReview'
import PaxDetails from './pages/Pax-details'
import Luggage from './components/Luggage'
import BookingConfirmation from './pages/BookingConfirmation'

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
        <Route path="/hotels" element={<Hotels />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App