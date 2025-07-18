import React from 'react'
import Navbar from '../components/Navbar'
import SearchForm from '../components/SearchForm'
import Banner from '../components/Banner'

const FlightSearch = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Banner />

      <div className=" mx-auto py-6">
        <SearchForm />
      </div>
    </div>
  )
}

export default FlightSearch