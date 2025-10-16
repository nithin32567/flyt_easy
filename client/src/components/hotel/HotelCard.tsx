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
    // Get searchId from localStorage
    const searchId = localStorage.getItem('hotelSearchId');
    if (searchId) {
      navigate(`/hotel-details/${hotel.id}`);
    } else {
      console.error('No search session found');
      // Fallback to onSelect if provided
      if (onSelect) {
        onSelect(hotel.id);
      }
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
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="relative">
        {hotel.heroImage ? (
          <img
            src={hotel.heroImage}
            alt={hotel.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🏨</span>
              </div>
              <p className="text-gray-500 text-sm">No Image Available</p>
            </div>
          </div>
        )}
        
        {hotel.isRecommended && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Recommended
          </div>
        )}
        
        {hotel.freeBreakfast && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Free Breakfast
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {renderStars(hotel.starRating)}
              </div>
              <span className="text-sm text-gray-500">
                {hotel.starRating} Star
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-sm line-clamp-1">{hotel.address}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">{hotel.distance} km from center</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{hotel.userReview.rating}</span>
              <span className="text-gray-500 ml-1">
                ({hotel.userReview.count} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex-grow">
          <div className="flex flex-wrap gap-2">
            {topFacilities.map((facility) => (
              <div
                key={facility.id}
                className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs text-gray-600"
              >
                {getFacilityIcon(facility.name)}
                <span>{facility.name}</span>
              </div>
            ))}
            {hotel.facilities.length > 6 && (
              <div className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                +{hotel.facilities.length - 6} more
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4 mt-auto">
          {hotel.rate ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatPrice(hotel.rate.total)}
                  </div>
                  <div className="text-sm text-gray-500">
                    per night
                  </div>
                </div>
                <div className="text-right">
                  {hotel.freeCancellation && (
                    <div className="text-green-600 text-sm font-medium mb-1">
                      Free Cancellation
                    </div>
                  )}
                  {hotel.payAtHotel && (
                    <div className="text-blue-600 text-sm">
                      Pay at Hotel
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="text-gray-500 text-sm mb-2">
                Pricing not available
              </div>
            </div>
          )}
          
          <button
            onClick={handleViewDetails}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            View Details & Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
