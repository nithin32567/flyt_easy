import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HotelLoadingScreen from '../../components/HotelLoadingScreen';
import HotelPictures from '../../components/hotel/HotelPictures';
import HotelDetails from '../../components/hotel/HotelDetails';
import HotelRooms from '../../components/hotel/HotelRooms';
import { Star, MapPin } from 'lucide-react';

interface HotelDetailsResponse {
  status: string;
  content: any;
  rooms: any;
  searchId: string;
  hotelId: string;
  searchTracingKey?: string;
  timestamp: string;
  apiStatus: {
    content: string;
    rooms: string;
  };
}

const HotelDetailsNew: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotelData, setHotelData] = useState<HotelDetailsResponse | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (hotelId) {
      fetchHotelDetails();
    } else {
      setError('Hotel ID is required');
      setLoading(false);
    }
  }, [hotelId]);

  const fetchHotelDetails = async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const searchId = localStorage.getItem('hotelSearchId');
      if (!searchId) {
        setError('No search session found. Please search for hotels first.');
        setLoading(false);
        setIsRetrying(false);
        return;
      }

      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      const token = localStorage.getItem("token");
      const searchTracingKey = localStorage.getItem('searchTracingKey');

      const apiUrl = `${baseUrl}/api/hotel/details/${searchId}/${hotelId}`;
      
      const response = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'search-tracing-key': searchTracingKey || ''
        }
      });

      console.log('Hotel details response:', response.data);
      setHotelData(response.data);
      
      // Clear any previous errors if the API call was successful
      if (response.data && (response.data.status === 'success' || response.data.content)) {
        setError(null);
      }
    } catch (err: any) {
      console.error('Error fetching hotel details:', err);
      setError(`Failed to load hotel details: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
      setIsRetrying(false);
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

  if (loading) {
    return (
      <HotelLoadingScreen
        isVisible={true}
        title="Loading Hotel Details"
        subtitle="Calling Content and Rooms APIs in parallel as per workflow"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Hotel</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => fetchHotelDetails()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hotelData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🏨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Not Found</h2>
          <p className="text-gray-600 mb-4">The hotel you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {hotelData.content?.hotel?.name || 'Hotel Name Not Available'}
              </h1>
              <div className="flex items-center mb-2">
                {renderStars(hotelData.content?.hotel?.starRating || 0)}
                <span className="ml-2 text-gray-600">
                  {hotelData.content?.hotel?.starRating || 0} Star Hotel
                </span>
              </div>
              {hotelData.content?.hotel?.contact?.address?.[0] && (
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {hotelData.content.hotel.contact.address[0].line1}, {hotelData.content.hotel.contact.address[0].city}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              ← Back to Search
            </button>
          </div>
        </div>

        {/* Hotel Images Carousel */}
        <HotelPictures images={hotelData.content?.hotel?.images || []} />

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">API Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${
                hotelData.apiStatus.content === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span>Content API: {hotelData.apiStatus.content}</span>
            </div>
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${
                hotelData.apiStatus.rooms === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span>Rooms API: {hotelData.apiStatus.rooms}</span>
            </div>
          </div>
          {hotelData.rooms?.status === 'failure' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-600 mr-2">⚠️</span>
                  <span className="text-yellow-800">
                    <strong>Rooms API Response:</strong> {hotelData.rooms.message}
                  </span>
                </div>
                <button
                  onClick={() => fetchHotelDetails(true)}
                  disabled={isRetrying}
                  className={`text-sm font-medium underline transition-colors ${
                    isRetrying 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-yellow-700 hover:text-yellow-900'
                  }`}
                >
                  {isRetrying ? 'Retrying...' : 'Retry Rooms API'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Data */}
        {hotelData.content && (
          <HotelDetails hotel={hotelData.content.hotel} />
        )}

        {/* Rooms Data */}
        {hotelData.rooms && (
          <HotelRooms 
            rooms={hotelData.rooms}
            onNavigateBack={() => navigate(-1)}
            onRetry={() => fetchHotelDetails(true)}
          />
        )}

        {/* Raw Data for Debugging */}
        {/* <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Raw API Response</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(hotelData, null, 2)}
          </pre>
        </div> */}
      </div>
    </div>
  );
};

export default HotelDetailsNew;
