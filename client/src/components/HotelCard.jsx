import React from 'react'

// Dummy hotel data for demonstration


const HotelCard = ({ location }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Card Header */}
      <div className="p-6">
        {/* Location Name */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {location.name}
          </h3>
          {location.code && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2 flex-shrink-0">
              {location.code.toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Full Name */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {location.fullName}
        </p>
        
        {/* Location Details */}
        <div className="space-y-2">
          {/* Type Badge */}
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Type:
            </span>
            <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {location.type}
            </span>
          </div>
          
          {/* Country */}
          {location.country && (
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Country:
              </span>
              <span className="ml-2 text-xs text-gray-700">
                {location.country}
              </span>
            </div>
          )}
          
          {/* Coordinates */}
          {location.coordinates && (
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Location:
              </span>
              <span className="ml-2 text-xs text-gray-700">
                {location.coordinates.lat.toFixed(4)}, {location.coordinates.long.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            ID: {location.id}
          </span>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default HotelCard