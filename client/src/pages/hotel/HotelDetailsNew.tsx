import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HotelLoadingScreen from '../../components/HotelLoadingScreen';
import HotelPictures from '../../components/hotel/HotelPictures';
import HotelDetails from '../../components/hotel/HotelDetails';
import HotelRooms from '../../components/hotel/HotelRooms';
import FatalErrorModal from '../../components/FatalErrorModal';
import { Star, MapPin } from 'lucide-react';
import { fetchWithAxiosRetries } from '../../utils/fetchWithRetries';
import { validateSearchContext, clearStaleSearchData, updateSearchTimestamp, ensureSearchTracingKeyMaintenance } from '../../utils/validateSearchContext';

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
  const [showFatalError, setShowFatalError] = useState(false);
  const [fatalError, setFatalError] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Function to show fatal error modal
  const showFatalErrorModal = (title: string, description: string) => {
    setFatalError({ title, description });
    setShowFatalError(true);
  };

  // Function to handle fatal error modal actions
  const handleFatalErrorPrimary = () => {
    // Clear all hotel-related data and redirect to home
    localStorage.removeItem('hotelSearchId');
    localStorage.removeItem('searchId');
    localStorage.removeItem('searchTracingKey');
    localStorage.removeItem('hotelSearchData');
    localStorage.removeItem('hotelSearchResults');
    localStorage.removeItem('allHotels');
    localStorage.removeItem('hotelDetailsData');
    localStorage.removeItem('hotelPricingData');
    localStorage.removeItem('hotelPricingError');
    navigate('/');
  };

  const handleFatalErrorSecondary = () => {
    // Retry the entire sequence
    setShowFatalError(false);
    setFatalError(null);
    fetchHotelDetails(true);
  };

  useEffect(() => {
    if (hotelId) {
      // Clear stale data first
      clearStaleSearchData();
      
      // Ensure search tracing key is properly maintained
      ensureSearchTracingKeyMaintenance();
      
      // Validate search context before proceeding
      const validation = validateSearchContext();
      if (!validation.isValid) {
        // console.error('Search context validation failed:', validation.errors);
        
        // If search tracing key is missing, redirect immediately to root
        if (validation.errors.includes('Search Tracing Key is missing')) {
          // console.log('Search Tracing Key missing, redirecting to root immediately');
          navigate('/');
          return;
        }
        
        showFatalErrorModal(
          'Session Expired',
          'Your search session has expired or is missing required data. Please search again.'
        );
        return;
      }

      if (validation.needsRefresh) {
        // console.log('Search context is stale, but proceeding with retry');
      }

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

      // Validate search context again before making API calls
      const validation = validateSearchContext();
      if (!validation.isValid) {
        // console.error('Search context validation failed during fetch:', validation.errors);
        
        // If search tracing key is missing, redirect immediately to root
        if (validation.errors.includes('Search Tracing Key is missing')) {
          // console.log('Search Tracing Key missing during fetch, redirecting to root immediately');
          navigate('/');
          return;
        }
        
        showFatalErrorModal(
          'Session Expired',
          'Your search session has expired or is missing required data. Please search again.'
        );
        return;
      }

      const { context } = validation;
      if (!context) {
        // console.error('Context is null after validation');
        showFatalErrorModal(
          'Session Expired',
          'Your search session has expired or is missing required data. Please search again.'
        );
        return;
      }
      
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      
      // console.log('=== HOTEL DETAILS API CALL ===');
      // console.log('Hotel ID:', hotelId);
      // console.log('Search ID:', context.searchId);
      // console.log('Search Tracing Key:', context.searchTracingKey);
      
      // Create axios instance with retry configuration
      const axiosInstance = axios.create({
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context.token}`,
          'search-tracing-key': context.searchTracingKey
        }
      });

      // Step 1: Fetch hotel details (content + rooms) with retry
      const detailsUrl = `${baseUrl}/api/hotel/details/${context.searchId}/${hotelId}`;
      // console.log('Details API URL:', detailsUrl);
      
      const detailsResult = await fetchWithAxiosRetries(
        axiosInstance,
        detailsUrl,
        { method: 'GET' },
        { retries: 2, backoff: 300 }
      );

      if (!detailsResult.ok) {
        // console.error('Hotel details API failed:', detailsResult.error);
        
        // Check for specific error codes
        if (detailsResult.errorCode === '1211' || detailsResult.body?.rooms?.code === '1211') {
          showFatalErrorModal(
            'No Rooms Available',
            'No rooms were found for this hotel. This might be due to availability changes or session expiry. Please search again.'
          );
          return;
        }
        
        showFatalErrorModal(
          'Unable to Load Hotel Details',
          'We encountered an error while loading the hotel details. Please try again or search for a different hotel.'
        );
        return;
      }

      // console.log('=== HOTEL DETAILS API SUCCESS ===');
      // console.log('Response:', JSON.stringify(detailsResult.body, null, 2));

      // Check if rooms API failed with specific error
      // console.log('=== ROOMS API STATUS CHECK ===');
      // console.log('Rooms data exists:', !!detailsResult.body.rooms);
      // console.log('Rooms status:', detailsResult.body.rooms?.status);
      // console.log('Rooms code:', detailsResult.body.rooms?.code);
      // console.log('Rooms message:', detailsResult.body.rooms?.message);
      // console.log('Full rooms data:', JSON.stringify(detailsResult.body.rooms, null, 2));
      
      // Check for various error conditions
      const hasRoomsError = detailsResult.body.rooms && (
        detailsResult.body.rooms.status === 'failure' || 
        detailsResult.body.rooms.code === '1211' ||
        detailsResult.body.rooms.message === 'No rooms found' ||
        detailsResult.body.rooms.message === 'Rooms API failed: No rooms found'
      );
      
      // console.log('Has rooms error:', hasRoomsError);
      
      if (hasRoomsError) {
        // console.error('Rooms API failed:', detailsResult.body.rooms.message);
        // console.error('Rooms API code:', detailsResult.body.rooms.code);
        
        showFatalErrorModal(
          'No Rooms Found',
          'No rooms are currently available for this hotel. Please try a different hotel or search again.'
        );
        return;
      }
      
      // Step 2: Fetch pricing data if rooms are available
      let pricingData = null;
      let pricingSuccess = false;
      
      if (detailsResult.body.rooms && 
          detailsResult.body.rooms.status === 'success' && 
          detailsResult.body.rooms.recommendations &&
          detailsResult.body.rooms.recommendations.length > 0) {
        
        // console.log('=== PRICING API DECISION LOGIC ===');
        // console.log('Rooms data exists:', !!detailsResult.body.rooms);
        // console.log('Rooms status:', detailsResult.body.rooms.status);
        // console.log('Rooms recommendations length:', detailsResult.body.rooms.recommendations.length);
        
        try {
          const firstRecommendation = detailsResult.body.rooms.recommendations[0];
          // console.log('First recommendation:', JSON.stringify(firstRecommendation, null, 2));
          
          if (firstRecommendation && firstRecommendation.roomGroup && firstRecommendation.roomGroup.length > 0) {
            const firstRoomGroup = firstRecommendation.roomGroup[0];
            const priceProvider = firstRoomGroup.providerName;
            const roomRecommendationId = firstRecommendation.id;
            
            // console.log('=== PRICING API PARAMETERS ===');
            // console.log('Price Provider:', priceProvider);
            // console.log('Room Recommendation ID:', roomRecommendationId);
            
            if (priceProvider && roomRecommendationId) {
              const pricingUrl = `${baseUrl}/api/hotel/pricing/${context.searchId}/${hotelId}/${priceProvider}/${roomRecommendationId}`;
              // console.log('Pricing API URL:', pricingUrl);
              
              const pricingResult = await fetchWithAxiosRetries(
                axiosInstance,
                pricingUrl,
                { method: 'GET' },
                { retries: 2, backoff: 300 }
              );
              
              if (pricingResult.ok) {
                pricingData = pricingResult.body;
                pricingSuccess = true;
                // console.log('=== PRICING API SUCCESS ===');
                // console.log('Pricing data:', JSON.stringify(pricingData, null, 2));
                
                // Store pricing data
                localStorage.setItem('hotelPricingData', JSON.stringify(pricingData));
              } else {
                // console.error('Pricing API failed:', pricingResult.error);
                // Don't treat pricing failure as fatal, just log it
              }
            } else {
              // console.error('Missing pricing API parameters:', {
              //   priceProvider: !!priceProvider,
              //   roomRecommendationId: !!roomRecommendationId
              // });
            }
          } else {
            // console.error('No room group found in first recommendation');
          }
        } catch (pricingError: any) {
          // console.error('=== PRICING API ERROR ===');
          // console.error('Error:', pricingError);
          // Don't treat pricing failure as fatal
        }
      } else {
        // console.log('=== PRICING API NOT CALLED ===');
        // console.log('Reason: Rooms data conditions not met');
        // console.log('Rooms status:', detailsResult.body.rooms?.status);
        // console.log('Has recommendations:', !!detailsResult.body.rooms?.recommendations);
      }
      
      // Combine all responses
      const combinedData = {
        ...detailsResult.body,
        pricing: pricingData,
        apiStatus: {
          ...detailsResult.body.apiStatus,
          pricing: pricingSuccess ? 'success' : 'failed'
        }
      };
      
      setHotelData(combinedData);
      
      // Store hotel data in localStorage for booking process
      localStorage.setItem('hotelDetailsData', JSON.stringify(combinedData));
      // console.log('=== STORED HOTEL DATA IN LOCALSTORAGE ===');
      // console.log('Hotel Data stored successfully');
      
      // Update search timestamp to keep session alive
      updateSearchTimestamp();
      
      // Clear any previous errors
      setError(null);
      
    } catch (err: any) {
      // console.error('=== FATAL ERROR IN FETCH HOTEL DETAILS ===');
      // console.error('Error:', err);
      
      showFatalErrorModal(
        'Unable to Load Hotel Details',
        'We encountered an unexpected error while loading the hotel details. Please try again or search for a different hotel.'
      );
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
        subtitle="Please wait while we load the hotel details"
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
      {/* Fatal Error Modal */}
      <FatalErrorModal
        isOpen={showFatalError}
        onClose={() => setShowFatalError(false)}
        title={fatalError?.title}
        description={fatalError?.description}
        onPrimary={handleFatalErrorPrimary}
        onSecondary={handleFatalErrorSecondary}
        primaryText="Go to Search"
        secondaryText="Retry"
        autoRedirect={true}
        redirectDelay={5000}
      />
      
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
    
      </div>
    </div>
  );
};

export default HotelDetailsNew;



