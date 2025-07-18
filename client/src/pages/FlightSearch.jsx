import React from 'react'
import Navbar from '../components/Navbar'
import SearchForm from '../components/SearchForm'
import Banner from '../components/Banner'
import CarousalCites from '../components/CarousalCites'
import { Outlet } from 'react-router-dom'
import Demobanner from '../components/Demobanner'
import Card from '../components/Card'
import StayCard from '../components/StayCard'

const FlightSearch = () => {
  return (
    <div className=" flex flex-col gap-12">

      <div className='w-full min-h-full mb-[15%]'>
        <Demobanner />
      </div>

      <div className='flex flex-col  max-w-7xl h-full mx-auto    px-4 md:px-0'>
        <div className="flex items-center justify-between">
          <h3 className='text-3xl font-extrabold'>Hot Deals on the Move!</h3>
          <button className='text-sm text-orange-600'>View All</button>
        </div>
        <div>
          <CarousalCites card={Card} />
        </div>
      </div>
      <div className='flex flex-col  max-w-7xl h-full mx-auto    px-4 md:px-0'>
        <div className="flex items-center justify-between">
          <h3 className='text-3xl font-extrabold'>Stays Selected with Care</h3>
          <button className='text-sm text-orange-600'>View All</button>
        </div>
        <div>
          <CarousalCites card={StayCard} />
        </div>
      </div>
    </div>
  )
}

export default FlightSearch