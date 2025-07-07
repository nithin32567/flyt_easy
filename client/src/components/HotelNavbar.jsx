import React from 'react'

const HotelNavbar = () => {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">
                Hotel Dashboard
              </h1>
            </div>
          </div>
          
          {/* Right side - Navigation items (optional) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Bookings
              </a>
              <a href="#" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Guests
              </a>
              <a href="#" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default HotelNavbar