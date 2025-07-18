import React from 'react'
import Navbar from '../components/Navbar'
import SearchForm from '../components/SearchForm'
import Banner from '../components/Banner'
import CarousalCites from '../components/CarousalCites'
import { Outlet } from 'react-router-dom'
import Demobanner from '../components/Demobanner'

const FlightSearch = () => {
  return (
    <div className=" flex flex-col gap-8">

      <div className='w-full min-h-full mb-[15%]'>
        <Demobanner />
      </div>

      <div className='flex max-w-7xl min-w-7xl mx-auto bg-gray-100 h-20'>
        <CarousalCites />
      </div>
    </div>
  )
}

export default FlightSearch