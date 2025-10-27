import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Utensils, Dumbbell, Coffee, Shield, Users, Clock } from 'lucide-react';

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    starRating: number;
    address: string;
    distance: number;
    heroImage: string | null;
    facilities: Array<{
      id: number;
      groupId: number;
      name: string;
    }>;
    userReview: {
      provider: string;
      count: number;
      rating: number;
    };
    rate?: {
      total: number;
      baseRate: number;
      currency: string;
      ratePerNight: number;
    };
    isRecommended?: boolean;
    freeBreakfast?: boolean;
    freeCancellation?: boolean;
    payAtHotel?: boolean;
  };
  onSelect?: (hotelId: string) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect }) => {
  const navigate = useNavigate();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = () => {
    // Get searchId from multiple possible sources
    const hotelSearchResults = localStorage.getItem('hotelSearchResults');
    const searchId = localStorage.getItem('hotelSearchId') || 
                    localStorage.getItem('searchId') || 
                    (hotelSearchResults ? JSON.parse(hotelSearchResults).searchId : null);
    
    if (searchId) {
      // console.log('Navigating to hotel details with searchId:', searchId);
      navigate(`/hotel-details/${hotel.id}`);
    } else {
      // console.error('No search session found, redirecting to home');
      // Redirect to home if no search session
      window.location.href = '/';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getFacilityIcon = (facilityName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Internet': <Wifi className="w-4 h-4" />,
      'Parking': <Car className="w-4 h-4" />,
      'Breakfast': <Coffee className="w-4 h-4" />,
      'Restaurant': <Utensils className="w-4 h-4" />,
      'Fitness Facility': <Dumbbell className="w-4 h-4" />,
      'Safe deposit box': <Shield className="w-4 h-4" />,
      'Family Friendly': <Users className="w-4 h-4" />,
      'Room service': <Clock className="w-4 h-4" />,
    };
    return iconMap[facilityName] || <div className="w-4 h-4 bg-gray-300 rounded" />;
  };

  const topFacilities = hotel.facilities.slice(0, 6);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden w-full flex flex-col sm:flex-row sm:h-96 h-auto">
      {/* Image Section - Top on mobile, Left on desktop */}
      <div className="relative w-full sm:w-80 sm:flex-shrink-0 h-48 sm:h-full">
        {hotel.heroImage ? (
          <img
            src={hotel.heroImage}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl sm:text-2xl">🏨</span>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm">No Image Available</p>
            </div>
          </div>
        )}
        
        {hotel.isRecommended && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Recommended
          </div>
        )}
        
        {hotel.freeBreakfast && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Free Breakfast
          </div>
        )}
      </div>

      {/* Content Section - Bottom on mobile, Right on desktop */}
      <div className="p-3 sm:p-4 flex flex-col justify-between min-w-0 h-full flex-1">
        {/* Top Section - Hotel Info */}
        <div className="flex-1">
          <div className="mb-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 mb-1">
              {hotel.name}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {renderStars(hotel.starRating)}
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {hotel.starRating} Star
                </span>
              </div>
              <div className="flex items-center">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-xs sm:text-sm font-medium">{hotel.userReview.rating}</span>
                <span className="text-gray-500 ml-1 text-xs sm:text-sm">
                  ({hotel.userReview.count})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start text-gray-600 mb-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm line-clamp-2">{hotel.address}</span>
          </div>

          <div className="text-xs sm:text-sm text-gray-600 mb-3">
            <span>{hotel.distance} km from center</span>
          </div>

          {/* Key Facilities - Responsive layout */}
          <div className="flex flex-wrap gap-1 mb-2">
            {topFacilities.slice(0, 2).map((facility) => (
              <div
                key={facility.id}
                className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs text-gray-600"
              >
                {getFacilityIcon(facility.name)}
                <span className="hidden sm:inline">{facility.name}</span>
              </div>
            ))}
            {hotel.facilities.length > 2 && (
              <div className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                +{hotel.facilities.length - 2}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Price and Booking */}
        <div className="border-t pt-3">
          {hotel.rate ? (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
              <div>
                <div className="text-lg sm:text-xl font-bold text-indigo-600">
                  {formatPrice(hotel.rate.total)}
                </div>
                <div className="text-xs text-gray-500">per night</div>
              </div>
              <div className="text-left sm:text-right">
                {hotel.freeCancellation && (
                  <div className="text-green-600 text-xs font-medium">
                    Free Cancellation
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-2 mb-3">
              <div className="text-gray-500 text-sm">Pricing not available</div>
            </div>
          )}
          
          <button
            onClick={handleViewDetails}
            className="bg-[var(--YellowColor)] hover:bg-[var(--PrimaryColor)] w-full text-white font-semibold py-3 sm:py-2 px-4 rounded-lg transition-colors duration-200 text-sm min-h-[44px] flex items-center justify-center"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
