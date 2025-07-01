import React from 'react'
import Navbar from '../components/Navbar'
import SearchForm from '../components/SearchForm'

const FlightSearch = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto py-6">
        <SearchForm />
      </div>
    </div>
  )
}

export default FlightSearch