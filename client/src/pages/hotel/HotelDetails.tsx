import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

console.log('HotelDetails component imported successfully');

interface HotelContent {
  hotel: {
    id: string;
    name: string;
    starRating: number;
    descriptions: Array<{
      type: string;
      text: string;
    }>;
    contact: {
      address: Array<{
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
      }>;
      phones: Array<{
        type: string;
        number: string;
      }>;
    };
    facilityGroups: Array<{
      name: string;
      facilities: Array<{
        name: string;
        description?: string;
      }>;
    }>;
    images: Array<{
      url: string;
      alt?: string;
      type?: string;
    }>;
    policies: Array<{
      type: string;
      text: string;
    }>;
    checkinInfo: {
      beginTime: string;
      endTime: string;
      instructions: string[];
      minAge: number;
    };
    checkoutInfo: {
      time: string;
    };
    nearByAttractions: Array<{
      name: string;
      distance: number;
      unit: string;
    }>;
    reviews: Array<{
      rating: number;
      text: string;
      author: string;
      date: string;
    }>;
  };
  status: string;
}

interface RoomDetails {
  recommendations?: Array<{
    id: string;
    roomGroup: Array<{
      id: string;
      code: string | null;
      availability: number;
      description: string | null;
      needsPriceCheck: boolean;
      isPackageRate: boolean | null;
      providerId: string;
      providerName: string;
      room: {
        id: string;
        standardRoomId: string;
        standardRoomName: string;
        name: string;
        description: string;
        beds: any;
        smokingAllowed: boolean;
        facilities: any[];
        images: any[];
      };
      roomCount: number;
      occupancies: Array<{
        occupancyId: number;
        numOfAdults: number;
        numOfChildren: number;
        childAges: number[];
      }>;
      type: string;
      baseRate: number;
      totalRate: number;
      minSellingRate: number;
      publishedRate: number;
      taxes: Array<{
        amount: number;
        description: string | null;
        type: string | null;
      }>;
      fees: any;
      discounts: any[];
      otherRateComponents: Array<{
        amount: number;
        description: string;
        type: string;
      }>;
      commission: {
        amount: number;
        description: string;
        type: string | null;
      };
      dailyRates: Array<{
        amount: number;
        date: string;
        taxIncluded: boolean;
        discount: number;
      }>;
      pointEquivalent: number;
      refundable: boolean;
      allGuestsInfoRequired: boolean;
      onlineCancellable: boolean;
      specialRequestSupported: boolean;
      payAtHotel: any;
      cardRequired: boolean;
      policies: any;
      boardBasis: {
        description: string | null;
        type: string;
      };
      offers: any[];
      cancellationPolicies: Array<{
        text: string;
        rules: any;
      }>;
      includes: any[];
      additionalCharges: any;
      depositRequired: boolean;
      gstAllowed: boolean;
      depositAmount: any;
      guaranteeRequired: boolean;
      gstOnCommission: number;
    }>;
    total: number;
    publishedRate: number;
    groupId: number;
  }>;
  stayPeriod?: {
    start: string;
    end: string;
  };
  searchId?: string;
  searchTracingKey?: string | null;
  status: string;
  message?: string;
  code?: string;
}

interface PricingContent {
  hotel: {
    id: string;
    name: string;
    relevanceScore: number;
    providerFamily: string;
    providerHotelId: string;
    language: string | null;
    providerName: string;
    geoCode: {
      lat: number;
      long: number;
    };
    neighbourhoods: any[];
    contact: {
      address: {
        line1: string;
        line2: string | null;
        destinationCode: string;
        city: string;
        state: string | null;
        country: string;
        postalCode: string;
      };
      phones: string[];
      faxes: any;
      emails: any;
      website: any;
    };
    chainCode: string;
    chainName: string;
    type: string;
    website: any;
    descriptions: Array<{
      type: string;
      text: string;
    }>;
    category: string;
    starRating: number;
    facilityGroups: Array<{
      id: number;
      groupId: number;
      name: string;
    }>;
    facilities: Array<{
      id: number;
      groupId: number;
      name: string;
    }>;
    nearByAttractions: Array<{
      name: string;
      distance: string;
      unit: string;
      description: string | null;
      type: string | null;
    }>;
    images: Array<{
      caption: string;
      category: string;
      type: string | null;
      roomCodes: any[];
      size: string;
      url: string;
    }>;
    policies: any[];
    fees: any[];
    reviews: any[];
    checkinInfo: {
      beginTime: string;
      endTime: string | null;
      instructions: any;
      specialInstructions: any;
      minAge: number;
    };
    checkoutInfo: {
      time: string;
    };
    heroImage: string;
    distance: number;
    locationName: string;
  };
  status: string;
}

const HotelDetails: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  
  console.log('=== HOTEL DETAILS COMPONENT RENDERED ===');
  console.log('URL params:', { hotelId });
  console.log('Current URL:', window.location.href);
  
  // Show alert for debugging
  if (hotelId) {
    console.log('Hotel ID found:', hotelId);
  } else {
    console.error('No hotel ID found in URL params');
  }
  
  const [hotelContent, setHotelContent] = useState<HotelContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [roomLoading, setRoomLoading] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [hotelRates, setHotelRates] = useState<any | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [pricingContent, setPricingContent] = useState<any | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  useEffect(() => {
    console.log('HotelDetails component mounted with:', { hotelId });
    if (hotelId) {
      // Call both APIs in parallel as per workflow
      fetchHotelDetailsAndRooms();
    } else {
      console.log('Missing required data:', { hotelId });
      setError('Hotel ID is required');
      setLoading(false);
    }
  }, [hotelId]);

  const fetchHotelDetailsAndRooms = async () => {
    try {
      setLoading(true);
      setRoomLoading(true);
      setRatesLoading(true);
      setPricingLoading(true);
      setError(null);
      setRoomError(null);
      setRatesError(null);
      setPricingError(null);
      
      // Get searchId from localStorage or use a fallback for testing
      const searchId = localStorage.getItem('hotelSearchId') || '3f0b9d5d-e2cd-4c7a-88a0-2449ea5d741a';
      console.log('Using searchId:', searchId);
      
      if (!searchId) {
        setError('No search session found. Please search for hotels first.');
        setRoomError('No search session found. Please search for hotels first.');
        setRatesError('No search session found. Please search for hotels first.');
        setPricingError('No search session found. Please search for hotels first.');
        return;
      }
      
      console.log('Fetching hotel details, rooms, rates, and pricing in parallel for:', { searchId, hotelId });
      
      // Use the same base URL pattern as other components
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      
      // Prepare API URLs - no authentication headers needed as server handles this
      const contentApiUrl = `${baseUrl}/api/hotel/content/${searchId}/${hotelId}`;
      const roomsApiUrl = `${baseUrl}/api/hotel/rooms/${searchId}/${hotelId}`;
      const ratesApiUrl = `${baseUrl}/api/hotel/rates/${searchId}`;
      
      console.log('Content API URL:', contentApiUrl);
      console.log('Rooms API URL:', roomsApiUrl);
      console.log('Rates API URL:', ratesApiUrl);
      
      // Get authentication token
      const token = localStorage.getItem("token");
      
      // Prepare parallel API calls with authentication
      const apiCalls = [
        // Content API
        axios.get(contentApiUrl, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        // Rooms API
        axios.get(roomsApiUrl, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        // Rates API
        axios.get(ratesApiUrl, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      ];
      
      // Call all APIs in parallel using Promise.all
      const responses = await Promise.all(apiCalls);
      const [contentResponse, roomsResponse, ratesResponse] = responses;
      
      // Handle content API response
      console.log('Hotel content API response:', contentResponse.data);
      setHotelContent(contentResponse.data);
      
      // Handle rooms API response
      console.log('Room details API response:', roomsResponse.data);
      console.log('Response status:', roomsResponse.status);
      console.log('Response data keys:', Object.keys(roomsResponse.data));
      
      // Check if the response has the expected structure
      if (roomsResponse.data.recommendations && roomsResponse.data.recommendations.length > 0) {
        console.log('Found recommendations:', roomsResponse.data.recommendations.length);
        setRoomDetails(roomsResponse.data);
        
        // Extract provider name for pricing API
        const firstRoom = roomsResponse.data.recommendations[0]?.roomGroup?.[0];
        if (firstRoom?.providerName) {
          const providerName = firstRoom.providerName;
          console.log('Found provider name from rooms:', providerName);
          
          // Call pricing API with provider name
          try {
            const pricingApiUrl = `${baseUrl}/api/hotel/pricing/${searchId}/${hotelId}?priceProvider=${encodeURIComponent(providerName)}`;
            console.log('Pricing API URL:', pricingApiUrl);
            
            const pricingResponse = await axios.get(pricingApiUrl, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            console.log('=== PRICING CONTENT API SUCCESS ===');
            console.log('Pricing API response:', pricingResponse.data);
            console.log('Response status:', pricingResponse.status);
            console.log('Response data keys:', Object.keys(pricingResponse.data));
            console.log('=== END PRICING CONTENT API SUCCESS ===');
            
            setPricingContent(pricingResponse.data);
          } catch (pricingErr: any) {
            console.log('Pricing API error:', pricingErr);
            setPricingError('Pricing information not available');
          }
        } else {
          console.log('No provider name found in rooms data');
          setPricingError('Pricing API not available - no provider name found in rooms data');
        }
      } else {
        console.log('No recommendations found in response');
        console.log('Full response data:', JSON.stringify(roomsResponse.data, null, 2));
        
        // Handle different response formats
        if (roomsResponse.data.status === 'failure' && roomsResponse.data.message === 'No rooms found') {
          console.log('API returned: No rooms found for this hotel');
          setRoomError('No rooms available for this hotel at the moment. Please try a different hotel or check back later.');
        } else if (roomsResponse.data.status === 'success' && roomsResponse.data.message) {
          console.log('API returned success but no room data');
          setRoomError('No room details available for this hotel');
        } else {
          setRoomError(`Room details unavailable: ${roomsResponse.data.message || 'Unknown error'}`);
        }
      }
      
      // Handle rates API response
      console.log('Hotel rates API response:', ratesResponse.data);
      console.log('Rates response status:', ratesResponse.status);
      console.log('Rates response data keys:', Object.keys(ratesResponse.data));
      
      if (ratesResponse.data && ratesResponse.data.status === 'success') {
        console.log('Hotel rates loaded successfully');
        setHotelRates(ratesResponse.data);
      } else {
        console.log('Hotel rates not available');
        setRatesError('Hotel rates not available for this search');
      }
      
    } catch (err: any) {
      console.error('Error in parallel API calls:', err);
      setError('Failed to load hotel information. Please try again.');
      setRoomError('Failed to load room information. Please try again.');
      setRatesError('Failed to load rates information. Please try again.');
      setPricingError('Failed to load pricing information. Please try again.');
    } finally {
      setLoading(false);
      setRoomLoading(false);
      setRatesLoading(false);
      setPricingLoading(false);
    }
  };


  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get searchId from localStorage or use a fallback for testing
      const searchId = localStorage.getItem('hotelSearchId') || '3f0b9d5d-e2cd-4c7a-88a0-2449ea5d741a';
      console.log('Using searchId:', searchId);
      
      if (!searchId) {
        setError('No search session found. Please search for hotels first.');
        return;
      }
      
      console.log('Fetching hotel details for:', { searchId, hotelId });
      
      // Use the same base URL pattern as other components
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      
      const apiUrl = `${baseUrl}/api/hotel/content/${searchId}/${hotelId}`;
      console.log('API URL:', apiUrl);
      
      const response = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Hotel content API response:', response.data);
      setHotelContent(response.data);
    } catch (err: any) {
      console.error('Error fetching hotel details:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      if (err.response?.status === 404) {
        setError('Hotel not found. Please try a different hotel.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError('Failed to load hotel details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomDetails = async () => {
    try {
      setRoomLoading(true);
      setRoomError(null);
      
      const searchId = localStorage.getItem('hotelSearchId') || '3f0b9d5d-e2cd-4c7a-88a0-2449ea5d741a';
      console.log('Fetching room details for:', { searchId, hotelId });
      
      if (!searchId) {
        setRoomError('No search session found. Please search for hotels first.');
        return;
      }
      
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      
      const apiUrl = `${baseUrl}/api/hotel/rooms/${searchId}/${hotelId}`;
      console.log('Room details API URL:', apiUrl);
      
      const response = await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Room details API response:', response.data);
      console.log('Response status:', response.status);
      console.log('Response data keys:', Object.keys(response.data));
      
      // Check if the response has the expected structure
      if (response.data.recommendations && response.data.recommendations.length > 0) {
        console.log('Found recommendations:', response.data.recommendations.length);
        setRoomDetails(response.data);
      } else {
        console.log('No recommendations found in response');
        console.log('Full response data:', JSON.stringify(response.data, null, 2));
        
        // Handle different response formats
        if (response.data.status === 'failure' && response.data.message === 'No rooms found') {
          console.log('API returned: No rooms found for this hotel');
          setRoomError('No rooms available for this hotel at the moment. Please try a different hotel or check back later.');
        } else if (response.data.status === 'success' && response.data.message) {
          console.log('API returned success but no room data');
          setRoomError('No room details available for this hotel');
        } else {
          setRoomError(`Room details unavailable: ${response.data.message || 'Unknown error'}`);
        }
      }
    } catch (err: any) {
      console.error('Error fetching room details:', err);
      console.error('Room details error:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      if (err.response?.status === 404) {
        setRoomError('Room details not found for this hotel.');
      } else if (err.response?.status === 401) {
        setRoomError('Authentication failed. Please login again.');
      } else {
        setRoomError('Failed to load room details. Please try again.');
      }
    } finally {
      setRoomLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const createHotelItinerary = async (roomData: any) => {
    try {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(null);
      
      console.log('Creating hotel itinerary for room:', roomData);
      
      const searchId = localStorage.getItem('hotelSearchId') || '3f0b9d5d-e2cd-4c7a-88a0-2449ea5d741a';
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      
      // Prepare the itinerary payload based on the sample
      const itineraryPayload = {
        "TUI": "281e2665-5219-488a-9211-a5a250c9b7be",
        "ServiceEnquiry": "",
        "ContactInfo": {
          "Title": "Ms",
          "FName": "REXY",
          "LName": "RAJU",
          "Mobile": "1234123412",
          "Email": "test@test.com",
          "Address": "AKBAR ONLINE BOOKING COMPANY PVT LTD",
          "State": "Maharashtra",
          "City": "Near Crawford market Mumbai",
          "PIN": "400003",
          "GSTCompanyName": "",
          "GSTTIN": "",
          "GSTMobile": "",
          "GSTEmail": "",
          "UpdateProfile": true,
          "IsGuest": false,
          "CountryCode": "IN",
          "MobileCountryCode": "+91",
          "NetAmount": roomData.totalRate?.toString() || "0"
        },
        "Auxiliaries": [
          {
            "Code": "PROMO",
            "Parameters": [
              {
                "Type": "Code",
                "Value": ""
              },
              {
                "Type": "ID",
                "Value": ""
              },
              {
                "Type": "Amount",
                "Value": ""
              }
            ]
          }
        ],
        "Rooms": [
          {
            "RoomId": roomData.id || "cf243f1f-151f-4a73-9b04-7dbd1a804b51",
            "GuestCode": "|1|1:A:25|",
            "SupplierName": roomData.providerName || "Fab",
            "RoomGroupId": roomData.roomGroupId || "6878352d-956a-4c5b-9812-882b3f725335",
            "Guests": [
              {
                "GuestID": "YGVj",
                "Operation": "U",
                "Title": "Ms",
                "FirstName": "REXY",
                "MiddleName": "",
                "LastName": "RAJU",
                "MobileNo": "",
                "PaxType": "A",
                "Age": "",
                "Email": "",
                "Pan": ""
              }
            ]
          }
        ],
        "NetAmount": roomData.totalRate?.toString() || "0",
        "ClientID": "Duh0NJDTryMpAfQvqvWnPw==",
        "DeviceID": "",
        "AppVersion": "",
        "SearchId": searchId,
        "RecommendationId": roomData.id || "aab02f5b-b699-42c2-9ed7-65712d93400c",
        "LocationName": null,
        "HotelCode": hotelId || "15402936",
        "CheckInDate": roomDetails?.stayPeriod?.start || "2021-03-04",
        "CheckOutDate": roomDetails?.stayPeriod?.end || "2021-03-05",
        "TravelingFor": "NTF"
      };
      
      console.log('Itinerary payload:', JSON.stringify(itineraryPayload, null, 2));
      
      const response = await axios.post(`${baseUrl}/api/hotel/create-itinerary`, itineraryPayload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Itinerary creation response:', response.data);
      setBookingSuccess(response.data);
      
    } catch (err: any) {
      console.error('Error creating hotel itinerary:', err);
      setBookingError(`Failed to create itinerary: ${err.response?.data?.message || err.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
      />
    ));
  };

  const renderImageGallery = () => {
    if (!hotelContent?.hotel.images || hotelContent.hotel.images.length === 0) {
      return (
        <div className="hotel-image-placeholder">
          <i className="fas fa-hotel fa-4x text-muted"></i>
          <p className="text-muted mt-2">No images available</p>
        </div>
      );
    }

    return (
      <div className="hotel-image-gallery">
        <div className="main-image-container">
          <img
            src={hotelContent.hotel.images[selectedImageIndex]?.url}
            alt={hotelContent.hotel.images[selectedImageIndex]?.alt || 'Hotel image'}
            className="main-hotel-image"
          />
          <div className="image-overlay">
            <button
              className="btn btn-light btn-sm"
              onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
              disabled={selectedImageIndex === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="btn btn-light btn-sm"
              onClick={() => setSelectedImageIndex(Math.min(hotelContent.hotel.images.length - 1, selectedImageIndex + 1))}
              disabled={selectedImageIndex === hotelContent.hotel.images.length - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        {hotelContent.hotel.images.length > 1 && (
          <div className="image-thumbnails">
            {hotelContent.hotel.images.slice(0, 6).map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.alt || `Hotel image ${index + 1}`}
                className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderFacilities = () => {
    if (!hotelContent?.hotel?.facilityGroups || !Array.isArray(hotelContent.hotel.facilityGroups) || hotelContent.hotel.facilityGroups.length === 0) {
      return null;
    }

    return (
      <div className="hotel-facilities">
        <h4 className="mb-3">
          <i className="fas fa-concierge-bell me-2"></i>
          Hotel Facilities
        </h4>
        <div className="row">
          {hotelContent.hotel.facilityGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="col-md-6 mb-3">
              <div className="facility-group">
                <h6 className="facility-group-title">{group?.name || 'Facilities'}</h6>
                <div className="facility-list">
                  {group?.facilities && Array.isArray(group.facilities) && group.facilities.map((facility, facilityIndex) => (
                    <div key={facilityIndex} className="facility-item">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      <span>{facility?.name || 'Facility'}</span>
                      {facility?.description && (
                        <small className="text-muted d-block ms-4">{facility.description}</small>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNearbyAttractions = () => {
    if (!hotelContent?.hotel?.nearByAttractions || !Array.isArray(hotelContent.hotel.nearByAttractions) || hotelContent.hotel.nearByAttractions.length === 0) {
      return null;
    }

    return (
      <div className="nearby-attractions">
        <h4 className="mb-3">
          <i className="fas fa-map-marker-alt me-2"></i>
          Nearby Attractions
        </h4>
        <div className="row">
          {hotelContent.hotel.nearByAttractions.slice(0, 6).map((attraction, index) => (
            <div key={index} className="col-md-6 mb-3">
              <div className="attraction-item">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">{attraction?.name || 'Attraction'}</h6>
                  <span className="badge bg-primary">
                    {attraction?.distance || 0} {attraction?.unit || 'km'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    if (!hotelContent?.hotel?.reviews || !Array.isArray(hotelContent.hotel.reviews) || hotelContent.hotel.reviews.length === 0) {
      return null;
    }

    return (
      <div className="hotel-reviews">
        <h4 className="mb-3">
          <i className="fas fa-star me-2"></i>
          Guest Reviews
        </h4>
        <div className="row">
          {hotelContent.hotel.reviews.slice(0, 3).map((review, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="review-card">
                <div className="review-rating mb-2">
                  {renderStars(review?.rating || 0)}
                </div>
                <p className="review-text">"{review?.text || 'No review text available'}"</p>
                <div className="review-author">
                  <strong>{review?.author || 'Anonymous'}</strong>
                  <small className="text-muted d-block">{review?.date || 'No date'}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRoomDetails = () => {
    if (!roomDetails) {
      return null;
    }

    return (
      <div className="room-details-section">
        <h4 className="mb-3">
          <i className="fas fa-bed me-2"></i>
          Available Rooms & Rates
        </h4>
        
        {roomDetails.stayPeriod && (
          <div className="stay-period-info mb-3">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Stay Period</h6>
                <p className="mb-0">
                  <strong>Check-in:</strong> {roomDetails.stayPeriod.start} | 
                  <strong> Check-out:</strong> {roomDetails.stayPeriod.end}
                </p>
              </div>
            </div>
          </div>
        )}

        {roomDetails.recommendations && roomDetails.recommendations.length > 0 ? (
          <div className="room-recommendations">
            {roomDetails.recommendations.map((recommendation, recIndex) => (
              <div key={recIndex} className="recommendation-card mb-4">
                <div className="card">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Room Group {recommendation.groupId}</h6>
                      <div className="total-rate">
                        <strong className="text-primary">
                          {formatPrice(recommendation.total)}
                        </strong>
                        <small className="text-muted d-block">Total Rate</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    {recommendation.roomGroup && recommendation.roomGroup.length > 0 ? (
                      <div className="room-options">
                        {recommendation.roomGroup.map((room, roomIndex) => (
                          <div key={roomIndex} className="room-option mb-3" style={{ 
                            border: '1px solid #e9ecef', 
                            borderRadius: '8px', 
                            padding: '1rem', 
                            backgroundColor: '#f8f9fa' 
                          }}>
                            <div className="row">
                              <div className="col-md-8">
                                <h6 className="room-name">{room.room.name}</h6>
                                <div className="room-description text-muted" style={{ 
                                  lineHeight: '1.6',
                                  fontSize: '0.9rem'
                                }}>
                                  {room.room.description ? (
                                    <div 
                                      dangerouslySetInnerHTML={{ __html: room.room.description }}
                                      style={{
                                        lineHeight: '1.6'
                                      }}
                                    />
                                  ) : (
                                    <p>No description available</p>
                                  )}
                                </div>
                                
                                <div className="room-details">
                                  <div className="row">
                                    <div className="col-sm-6">
                                      <small className="text-muted">
                                        <i className="fas fa-users me-1"></i>
                                        Adults: {room.occupancies[0]?.numOfAdults || 0} | 
                                        Children: {room.occupancies[0]?.numOfChildren || 0}
                                      </small>
                                    </div>
                                    <div className="col-sm-6">
                                      <small className="text-muted">
                                        <i className="fas fa-bed me-1"></i>
                                        Room Count: {room.roomCount}
                                      </small>
                                    </div>
                                  </div>
                                  
                                  <div className="room-features mt-2">
                                    <div className="d-flex flex-wrap gap-2">
                                      {room.refundable && (
                                        <span className="badge bg-success">Refundable</span>
                                      )}
                                      {room.room.smokingAllowed && (
                                        <span className="badge bg-warning">Smoking Allowed</span>
                                      )}
                                      {!room.room.smokingAllowed && (
                                        <span className="badge bg-success">Non-Smoking</span>
                                      )}
                                      {room.onlineCancellable && (
                                        <span className="badge bg-info">Online Cancellable</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-md-4">
                                <div className="room-pricing" style={{ 
                                  backgroundColor: '#fff', 
                                  border: '1px solid #dee2e6', 
                                  borderRadius: '8px', 
                                  padding: '1rem' 
                                }}>
                                  <div className="price-breakdown" style={{ fontSize: '0.9rem' }}>
                                    <div className="d-flex justify-content-between">
                                      <span>Base Rate:</span>
                                      <span>{formatPrice(room.baseRate)}</span>
                                    </div>
                                    {room.taxes && room.taxes.length > 0 && (
                                      <div className="d-flex justify-content-between">
                                        <span>Taxes:</span>
                                        <span>{formatPrice(room.taxes.reduce((sum, tax) => sum + tax.amount, 0))}</span>
                                      </div>
                                    )}
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                      <strong>Total Rate:</strong>
                                      <strong className="text-primary">{formatPrice(room.totalRate)}</strong>
                                    </div>
                                  </div>
                                  
                                  <div className="booking-actions mt-3">
                                    <button 
                                      className="btn btn-primary w-100"
                                      onClick={() => createHotelItinerary(room)}
                                      disabled={bookingLoading}
                                    >
                                      {bookingLoading ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                          Creating Itinerary...
                                        </>
                                      ) : (
                                        <>
                                          <i className="fas fa-calendar-check me-2"></i>
                                          Book Now
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  
                                  {room.cancellationPolicies && room.cancellationPolicies.length > 0 && (
                                    <div className="cancellation-policy mt-2" style={{ 
                                      fontSize: '0.8rem', 
                                      maxHeight: '100px', 
                                      overflowY: 'auto' 
                                    }}>
                                      <small className="text-muted">
                                        <strong>Cancellation Policy:</strong><br />
                                        <div dangerouslySetInnerHTML={{ 
                                          __html: room.cancellationPolicies[0]?.text || 'No policy available' 
                                        }} />
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No room options available</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-rooms">
            <div className="card">
              <div className="card-body text-center">
                <i className="fas fa-bed fa-3x text-muted mb-3"></i>
                <h5>No Rooms Available</h5>
                <p className="text-muted">No room options found for this hotel.</p>
                <div className="mt-3">
                  <small className="text-muted">
                    <strong>API Response:</strong> {roomDetails?.status || 'Unknown status'} | 
                    <strong> Message:</strong> {roomDetails?.message || 'No message'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="hotel-details-loading">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="mb-3">Loading Hotel Details</h4>
            <p className="text-muted mb-4">Please wait while we fetch the hotel information, rooms, rates, and pricing...</p>
            <div className="mb-3">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Loading: Content API, Rooms API, Rates API, and Pricing API in parallel
              </small>
            </div>
            
            {/* Loading skeleton */}
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="skeleton-loader me-3" style={{ width: '60px', height: '60px', borderRadius: '8px' }}></div>
                      <div className="flex-grow-1">
                        <div className="skeleton-loader mb-2" style={{ height: '24px', width: '70%' }}></div>
                        <div className="skeleton-loader mb-1" style={{ height: '16px', width: '50%' }}></div>
                        <div className="skeleton-loader" style={{ height: '16px', width: '40%' }}></div>
                      </div>
                    </div>
                    
                    <div className="skeleton-loader mb-3" style={{ height: '200px', width: '100%', borderRadius: '8px' }}></div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="skeleton-loader mb-2" style={{ height: '20px', width: '80%' }}></div>
                        <div className="skeleton-loader mb-1" style={{ height: '16px', width: '100%' }}></div>
                        <div className="skeleton-loader mb-1" style={{ height: '16px', width: '90%' }}></div>
                        <div className="skeleton-loader" style={{ height: '16px', width: '70%' }}></div>
                      </div>
                      <div className="col-md-6">
                        <div className="skeleton-loader mb-2" style={{ height: '20px', width: '80%' }}></div>
                        <div className="skeleton-loader mb-1" style={{ height: '16px', width: '100%' }}></div>
                        <div className="skeleton-loader mb-1" style={{ height: '16px', width: '90%' }}></div>
                        <div className="skeleton-loader" style={{ height: '16px', width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
                <div className="mt-4">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Search ID: {localStorage.getItem('hotelSearchId') || 'Not found'} | 
                    Hotel ID: {hotelId}
                  </small>
                </div>
            
            <div className="mt-3">
              <div className="progress" style={{ width: '300px', margin: '0 auto' }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated" 
                     role="progressbar" 
                     style={{ width: '100%' }}
                     aria-valuenow={100} 
                     aria-valuemin={0} 
                     aria-valuemax={100}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hotel-details-error">
        <div className="container">
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4>Error Loading Hotel Details</h4>
            <p className="text-muted">{error}</p>
            <div className="mt-3">
              <small className="text-muted">
                Search ID: {localStorage.getItem('hotelSearchId') || 'Not found'} | 
                Hotel ID: {hotelId}
              </small>
            </div>
            <div className="mt-3">
              {error.includes('Authentication') ? (
                <button className="btn btn-primary me-2" onClick={() => navigate('/login')}>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login Required
                </button>
              ) : (
                <button className="btn btn-primary me-2" onClick={fetchHotelDetails}>
                  <i className="fas fa-refresh me-2"></i>
                  Retry
                </button>
              )}
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left me-2"></i>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotelContent || !hotelContent.hotel) {
    return (
      <div className="hotel-details-empty">
        <div className="container">
          <div className="text-center py-5">
            <i className="fas fa-hotel fa-3x text-muted mb-3"></i>
            <h4>Hotel Not Found</h4>
            <p className="text-muted">The hotel you're looking for doesn't exist or data is not available.</p>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-2"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-details-page" style={{ padding: '20px 0' }}>
      <div className="container">
        {/* Header Section */}
        <div className="hotel-header mb-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="hotel-name">{hotelContent?.hotel?.name || 'Hotel Name Not Available'}</h1>
              <div className="hotel-rating mb-2">
                {renderStars(hotelContent?.hotel?.starRating || 0)}
                <span className="ms-2 text-muted">({hotelContent?.hotel?.starRating || 0} Star Hotel)</span>
              </div>
              {hotelContent?.hotel?.contact?.address && Array.isArray(hotelContent.hotel.contact.address) && hotelContent.hotel.contact.address.length > 0 && hotelContent.hotel.contact.address[0] && (
                <p className="hotel-address text-muted">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {hotelContent.hotel.contact.address[0]?.line1 || 'Address not available'}, {hotelContent.hotel.contact.address[0]?.city || 'City not available'}
                </p>
              )}
            </div>
            <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-2"></i>
              Back to Search
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        {hotelContent?.hotel && (
          <div className="hotel-images-section mb-5">
            {renderImageGallery()}
          </div>
        )}

        {/* Room Details Section - Display after images */}
        {(roomLoading || ratesLoading || pricingLoading) && (
          <div className="room-details-loading mb-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '2rem', height: '2rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h6>Loading All Hotel Details</h6>
                <p className="text-muted mb-0">Fetching content, rooms, rates, and pricing information in parallel...</p>
                <div className="mt-2">
                  <small className="text-muted">
                    {roomLoading && <span className="me-3"><i className="fas fa-bed me-1"></i>Rooms</span>}
                    {ratesLoading && <span className="me-3"><i className="fas fa-dollar-sign me-1"></i>Rates</span>}
                    {pricingLoading && <span className="me-3"><i className="fas fa-calculator me-1"></i>Pricing</span>}
                    <span><i className="fas fa-info-circle me-1"></i>Content</span>
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}

        {(roomError || ratesError || pricingError) && (
          <div className="room-details-error mb-4">
            <div className="card">
              <div className="card-body">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Room, Rates & Pricing Availability</strong>
                  {roomError && (
                    <div className="mb-2">
                      <strong>Rooms:</strong> {roomError}
                      {roomDetails && (
                        <div className="mt-1">
                          <small className="text-muted">
                            <strong>API Response:</strong> {roomDetails.status} | 
                            <strong> Code:</strong> {roomDetails.code} | 
                            <strong> Message:</strong> {roomDetails.message}
                          </small>
                        </div>
                      )}
                    </div>
                  )}
                  {ratesError && (
                    <div className="mb-2">
                      <strong>Rates:</strong> {ratesError}
                    </div>
                  )}
                  {pricingError && (
                    <div className="mb-2">
                      <strong>Pricing:</strong> {pricingError}
                    </div>
                  )}
                  <div className="mt-3">
                    <button className="btn btn-outline-info btn-sm me-2" onClick={fetchHotelDetailsAndRooms}>
                      <i className="fas fa-refresh me-1"></i>
                      Check Again
                    </button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
                      <i className="fas fa-arrow-left me-1"></i>
                      Back to Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Success/Error Messages */}
        {bookingSuccess && (
          <div className="booking-success mb-4">
            <div className="alert alert-success">
              <h5 className="alert-heading">
                <i className="fas fa-check-circle me-2"></i>
                Itinerary Created Successfully!
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Transaction ID:</strong> {bookingSuccess.TransactionID}</p>
                  <p><strong>TUI:</strong> {bookingSuccess.TUI}</p>
                  <p><strong>Net Amount:</strong> {formatPrice(bookingSuccess.NetAmount)}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Status Code:</strong> {bookingSuccess.Code}</p>
                  <p><strong>Messages:</strong> {bookingSuccess.Msg?.join(', ') || 'Success'}</p>
                </div>
              </div>
              <hr />
              <div className="mt-3">
                <h6>Full Response:</h6>
                <pre className="bg-light p-3 rounded" style={{ fontSize: '0.8rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {JSON.stringify(bookingSuccess, null, 2)}
                </pre>
              </div>
              <div className="mt-3">
                <button className="btn btn-outline-success me-2" onClick={() => setBookingSuccess(null)}>
                  <i className="fas fa-times me-1"></i>
                  Close
                </button>
                <button className="btn btn-success" onClick={() => window.print()}>
                  <i className="fas fa-print me-1"></i>
                  Print Details
                </button>
              </div>
            </div>
          </div>
        )}

        {bookingError && (
          <div className="booking-error mb-4">
            <div className="alert alert-danger">
              <h5 className="alert-heading">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Booking Failed
              </h5>
              <p>{bookingError}</p>
              <div className="mt-3">
                <button className="btn btn-outline-danger me-2" onClick={() => setBookingError(null)}>
                  <i className="fas fa-times me-1"></i>
                  Close
                </button>
                <button className="btn btn-danger" onClick={() => setBookingError(null)}>
                  <i className="fas fa-retry me-1"></i>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Room Details Content - Display after images */}
        {roomDetails && roomDetails.recommendations && roomDetails.recommendations.length > 0 && (
          <div className="room-details-content mb-5">
            {renderRoomDetails()}
          </div>
        )}

        {/* Hotel Rates Section */}
        {hotelRates && (
          <div className="hotel-rates-section mb-5">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">
                  <i className="fas fa-dollar-sign me-2"></i>
                  Hotel Rates Information
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h6>Search Results Summary</h6>
                    <p><strong>Status:</strong> {hotelRates.status || 'Unknown'}</p>
                    {hotelRates.message && (
                      <p><strong>Message:</strong> {hotelRates.message}</p>
                    )}
                    {hotelRates.data && (
                      <div className="mt-3">
                        <h6>Rate Data</h6>
                        <pre className="bg-light p-3 rounded" style={{ fontSize: '0.8rem', maxHeight: '300px', overflowY: 'auto' }}>
                          {JSON.stringify(hotelRates.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Content Section */}
        {pricingContent && (
          <div className="pricing-content-section mb-5">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">
                  <i className="fas fa-calculator me-2"></i>
                  Pricing Content Details
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h6>Provider-Specific Pricing Information</h6>
                    <p><strong>Status:</strong> {pricingContent.status || 'Unknown'}</p>
                    {pricingContent.message && (
                      <p><strong>Message:</strong> {pricingContent.message}</p>
                    )}
                    {pricingContent.hotel && (
                      <div className="mt-3">
                        <h6>Hotel Pricing Data</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <p><strong>Hotel ID:</strong> {pricingContent.hotel.id}</p>
                            <p><strong>Hotel Name:</strong> {pricingContent.hotel.name}</p>
                            <p><strong>Provider:</strong> {pricingContent.hotel.providerName}</p>
                            <p><strong>Provider Family:</strong> {pricingContent.hotel.providerFamily}</p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Star Rating:</strong> {pricingContent.hotel.starRating}</p>
                            <p><strong>Chain:</strong> {pricingContent.hotel.chainName}</p>
                            <p><strong>Location:</strong> {pricingContent.hotel.locationName}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-3">
                      <h6>Full Pricing Response</h6>
                      <pre className="bg-light p-3 rounded" style={{ fontSize: '0.8rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {JSON.stringify(pricingContent, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Hotel Information */}
        {hotelContent?.hotel && (
          <div className="row">
            <div className="col-lg-8">
              {/* Descriptions */}
              {hotelContent?.hotel?.descriptions && Array.isArray(hotelContent.hotel.descriptions) && hotelContent.hotel.descriptions.length > 0 && (
                <div className="hotel-descriptions mb-4">
                  <h4 className="mb-3">
                    <i className="fas fa-info-circle me-2"></i>
                    About This Hotel
                  </h4>
                  {hotelContent.hotel.descriptions.map((desc, index) => (
                    <div key={index} className="description-item mb-3">
                      <h6 className="description-type">{desc?.type || 'Description'}</h6>
                      <div 
                        className="description-text"
                        dangerouslySetInnerHTML={{ __html: desc?.text || 'No description available' }}
                        style={{
                          lineHeight: '1.6',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Facilities */}
              {renderFacilities()}

              {/* Nearby Attractions */}
              {renderNearbyAttractions()}
              
              {/* Additional Attractions Info - Handle HTML content */}
              {hotelContent?.hotel?.descriptions && hotelContent.hotel.descriptions.some(desc => 
                desc?.text && (desc.text.includes('attractions') || desc.text.includes('Attractions') || desc.text.includes('Distances are displayed'))
              ) && (
                <div className="additional-attractions-info mb-4">
                  <h4 className="mb-3">
                    <i className="fas fa-landmark me-2"></i>
                    Attractions Information
                  </h4>
                  {hotelContent.hotel.descriptions
                    .filter(desc => desc?.text && (desc.text.includes('attractions') || desc.text.includes('Attractions') || desc.text.includes('Distances are displayed')))
                    .map((desc, index) => (
                      <div key={index} className="attractions-description">
                        <div 
                          dangerouslySetInnerHTML={{ __html: desc.text }}
                          style={{
                            lineHeight: '1.6',
                            fontSize: '0.9rem',
                            color: '#666'
                          }}
                        />
                      </div>
                    ))
                  }
                </div>
              )}

            {/* Reviews */}
            {renderReviews()}
            </div>

            <div className="col-lg-4">
              {/* Hotel Info Card */}
              <div className="hotel-info-card">
                <h5 className="card-title">
                  <i className="fas fa-hotel me-2"></i>
                  Hotel Information
                </h5>
                
                {/* Check-in/Check-out Info */}
                <div className="checkin-checkout-info mb-3">
                  <h6>Check-in & Check-out</h6>
                  <div className="checkin-info">
                    <strong>Check-in:</strong> {hotelContent?.hotel?.checkinInfo?.beginTime || 'Not specified'} - {hotelContent?.hotel?.checkinInfo?.endTime || 'Not specified'}
                  </div>
                  <div className="checkout-info">
                    <strong>Check-out:</strong> {hotelContent?.hotel?.checkoutInfo?.time || 'Not specified'}
                  </div>
                  <div className="min-age">
                    <strong>Minimum Age:</strong> {hotelContent?.hotel?.checkinInfo?.minAge || 0} years
                  </div>
                </div>

                {/* Contact Information */}
                {hotelContent?.hotel?.contact?.phones && Array.isArray(hotelContent.hotel.contact.phones) && hotelContent.hotel.contact.phones.length > 0 && (
                  <div className="contact-info mb-3">
                    <h6>Contact Information</h6>
                    {hotelContent.hotel.contact.phones.map((phone, index) => (
                      <div key={index} className="phone-item">
                        <i className="fas fa-phone me-2"></i>
                        {phone?.number || 'No phone number'} ({phone?.type || 'Unknown'})
                      </div>
                    ))}
                  </div>
                )}

                {/* Policies */}
                {hotelContent?.hotel?.policies && Array.isArray(hotelContent.hotel.policies) && hotelContent.hotel.policies.length > 0 && (
                  <div className="policies-info">
                    <h6>Hotel Policies</h6>
                    {hotelContent.hotel.policies.map((policy, index) => (
                      <div key={index} className="policy-item">
                        <strong>{policy?.type || 'Policy'}:</strong>
                        <p className="policy-text">{policy?.text || 'No policy text available'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;