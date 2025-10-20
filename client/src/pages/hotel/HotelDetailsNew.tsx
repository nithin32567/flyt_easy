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
  pricing?: any;
  searchId: string;
  hotelId: string;
  searchTracingKey?: string;
  timestamp: string;
  apiStatus: {
    content: string;
    rooms: string;
    pricing?: string;
  };
}

const HotelDetailsNew: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotelData, setHotelData] = useState<HotelDetailsResponse | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Function to clear stale localStorage data
  const clearStaleData = () => {
    const now = Date.now();
    const lastSearchTime = localStorage.getItem('lastSearchTime');
    
    // If search was done more than 1 hour ago, clear some data
    if (lastSearchTime && (now - parseInt(lastSearchTime)) > 3600000) {
      console.log('Clearing stale search data');
      localStorage.removeItem('allHotels');
      localStorage.removeItem('hotelSearchResults');
    }
  };

  useEffect(() => {
    if (hotelId) {
      clearStaleData();
      fetchHotelDetails();
    } else {
      setError('Hotel ID is required');
      setLoading(false);
    }
  }, []);

  const fetchHotelDetails = async (isRetry = false) => {
    if(!hotelId) {
      setError('Hotel ID is required');
      setLoading(false);
      return;
    }
    
    try {
      if (isRetry) {
        setIsRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      const token = localStorage.getItem("token");
      const searchTracingKey = localStorage.getItem('searchTracingKey');
      
      // Get searchId from multiple possible sources
      let searchId = localStorage.getItem('hotelSearchId') || 
                    localStorage.getItem('searchId') || 
                    (localStorage.getItem('hotelSearchResults') && JSON.parse(localStorage.getItem('hotelSearchResults')!).searchId);
      
      console.log('=== HOTEL DETAILS API CALL ===');
      console.log('Hotel ID:', hotelId);
      console.log('Search ID:', searchId);
      console.log('Token exists:', !!token);
      console.log('Search Tracing Key:', searchTracingKey);
      
      if(!searchId){
        setError('Hotel Search ID is required');
        console.error('No searchId found in localStorage');
        setLoading(false);
        return;
      }
      if(!token){
        setError('Token is required');
        console.error('No token found in localStorage');
        setLoading(false);
        return;
      }
      if(!searchTracingKey){
        setError('Search Tracing Key is required');
        console.error('No searchTracingKey found in localStorage');
        setLoading(false);
        return;
      }
 

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
      
      // Check if rooms API failed
      if (response.data.rooms && response.data.rooms.status === 'failure') {
        console.error('Rooms API failed:', response.data.rooms.message);
        console.error('Rooms API code:', response.data.rooms.code);
        
        // If rooms API failed, we can still show hotel details but no rooms
        setHotelData({
          ...response.data,
          rooms: {
            status: 'failure',
            message: 'No rooms available',
            recommendations: []
          }
        });
        setLoading(false);
        return;
      }
      
      // Extract pricing information from rooms data for pricing API call
      let pricingData = null;
      let pricingSuccess = false;
      
      if (response.data.rooms && response.data.rooms.status === 'success' && response.data.rooms.recommendations) {
        try {
          // Get the first recommendation and room group for pricing API call
          const firstRecommendation = response.data.rooms.recommendations[0];
          if (firstRecommendation && firstRecommendation.roomGroup && firstRecommendation.roomGroup.length > 0) {
            const firstRoomGroup = firstRecommendation.roomGroup[0];
            const priceProvider = firstRoomGroup.providerName;
            const roomRecommendationId = firstRecommendation.id;
            
            console.log('Calling pricing API with:', { priceProvider, roomRecommendationId });
            
            const pricingResponse = await axios.get(
              `${baseUrl}/api/hotel/pricing/${searchId}/${hotelId}/${priceProvider}/${roomRecommendationId}`,
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'search-tracing-key': searchTracingKey || ''
                }
              }
            );
            
            pricingData = pricingResponse.data;
            pricingSuccess = true;
            console.log('Pricing API success:', pricingData);
          }
        } catch (pricingError: any) {
          console.error('Pricing API failed:', pricingError);
          pricingSuccess = false;
        }
      }
      
      // Combine all responses
      const combinedData = {
        ...response.data,
        pricing: pricingData,
        apiStatus: {
          ...response.data.apiStatus,
          pricing: pricingSuccess ? 'success' : 'failed'
        }
      };
      
      setHotelData(combinedData);
      
      // Store hotel data in localStorage for booking process
      localStorage.setItem('hotelDetailsData', JSON.stringify(combinedData));
      console.log('=== STORED HOTEL DATA IN LOCALSTORAGE ===');
      console.log('Hotel Data:', combinedData);
      console.log('Hotel ID:', combinedData.content?.hotel?.id);
      console.log('=== END STORED HOTEL DATA ===');
      
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
          <div className="grid grid-cols-3 gap-4">
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
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${
                hotelData.apiStatus.pricing === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span>Pricing API: {hotelData.apiStatus.pricing || 'not called'}</span>
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

        {/* Pricing Data */}
        {hotelData.pricing && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Pricing Details</h2>
            <div className="space-y-4">
              {hotelData.pricing.pricing?.roomGroup?.map((roomGroup: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {roomGroup.room?.name || 'Room Details'}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Provider:</span>
                          <span className="font-medium">{roomGroup.providerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <span>{roomGroup.availability} rooms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Room Count:</span>
                          <span>{roomGroup.roomCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Refundable:</span>
                          <span className={roomGroup.refundable ? 'text-green-600' : 'text-red-600'}>
                            {roomGroup.refundable ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Price Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Base Rate:</span>
                          <span>₹{roomGroup.baseRate?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Rate:</span>
                          <span>₹{roomGroup.totalRate?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Published Rate:</span>
                          <span>₹{roomGroup.publishedRate?.toLocaleString()}</span>
                        </div>
                        {roomGroup.taxes && roomGroup.taxes.length > 0 && (
                          <div className="mt-2">
                            <div className="font-medium text-gray-700 mb-1">Taxes & Fees:</div>
                            {roomGroup.taxes.map((tax: any, taxIndex: number) => (
                              <div key={taxIndex} className="flex justify-between text-xs">
                                <span>{tax.description}:</span>
                                <span>₹{tax.amount?.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Final Price:</span>
                          <span className="text-green-600">₹{roomGroup.totalRate?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
