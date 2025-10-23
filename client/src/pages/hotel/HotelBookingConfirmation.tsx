import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, MapPin, Calendar, Users, CreditCard, Phone, Mail, Clock } from 'lucide-react';
import axios from 'axios';

const HotelBookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    importantInfo: false
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Check if we have a bookingId from URL params (viewing from profile)
        const urlParams = new URLSearchParams(location.search);
        const bookingId = urlParams.get('bookingId');
        
        if (bookingId) {
          // Fetch booking from database
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/hotel/bookings/${bookingId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          if (response.data.success) {
            setBookingData(response.data.data.bookingData);
            console.log('=== HOTEL BOOKING FROM DATABASE ===');
            console.log(JSON.stringify(response.data.data.bookingData, null, 2));
            console.log('=== END HOTEL BOOKING FROM DATABASE ===');
          } else {
            throw new Error(response.data.message || 'Failed to retrieve booking');
          }
        } else {
          // Original flow - get booking data from localStorage
          const storedBookingData = localStorage.getItem('hotelBookingData');
          const transactionId = localStorage.getItem('hotelTransactionID');
          const tui = localStorage.getItem('searchTracingKey');
          const clientId = localStorage.getItem('ClientID') || 'FVI6V120g22Ei5ztGK0FIQ==';
          
          if (!transactionId || !tui) {
            throw new Error('Missing booking information');
          }

          // Call retrieve booking API
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/hotel/retrieve-booking`,
            {
              TUI: null,
              ReferenceType: "T",
              ReferenceNumber: transactionId,
              ServiceType: null,
              ClientID: clientId,
              RequestMode: "RB",
              Contact: null,
              Name: null
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          if (response.data.Code === "200" && response.data.Msg?.includes("Success")) {
            setBookingData(response.data);
            console.log('=== HOTEL BOOKING RETRIEVED ===');
            console.log(JSON.stringify(response.data, null, 2));
            console.log('=== END HOTEL BOOKING RETRIEVED ===');
          } else {
            throw new Error(response.data.Msg?.join(' ') || 'Failed to retrieve booking');
          }
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [location.search]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const time = timeString || '';
    return `${formattedDate} ${time}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'B0': return 'text-green-600 bg-green-100';
      case 'B1': return 'text-blue-600 bg-blue-100';
      case 'B2': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBookingStatusText = (status) => {
    switch (status) {
      case 'B0': return 'Confirmed';
      case 'B1': return 'Pending';
      case 'B2': return 'Cancelled';
      default: return status;
    }
  };

  const formatHeading = (heading) => {
    if (!heading) return 'General';
    // Add spaces before capital letters and convert to title case
    return heading
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Retrieval Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Booking Data</h2>
          <p className="text-gray-600 mb-6">Unable to retrieve booking information.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Booking Confirmed!</h1>
          <p className="text-gray-600">Your hotel reservation has been successfully confirmed.</p>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Booking Status</h2>
              <p className="text-gray-600">Reference: {bookingData.TransactionId}</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${getBookingStatusColor(bookingData.BookingStatus)}`}>
              <span className="font-semibold">{getBookingStatusText(bookingData.BookingStatus)}</span>
            </div>
          </div>
        </div>

        {/* Hotel Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hotel Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-start space-x-4">
                {bookingData.HotelInfo?.heroimage && (
                  <img
                    src={bookingData.HotelInfo.heroimage}
                    alt={bookingData.HotelInfo.Name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{bookingData.HotelInfo?.Name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {bookingData.HotelInfo?.HotelAddress?.AddressLine1}, {bookingData.HotelInfo?.HotelAddress?.City}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <span className="text-sm">⭐ {bookingData.HotelInfo?.StarRating} Star Hotel</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">{bookingData.HotelInfo?.Phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {bookingData.HotelInfo?.HotelAddress?.City}, {bookingData.HotelInfo?.HotelAddress?.Country}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-semibold text-gray-900">{formatDateTime(bookingData.CheckInDate, bookingData.CheckInTime)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-semibold text-gray-900">{formatDateTime(bookingData.CheckOutDate, bookingData.CheckOutTime)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-semibold text-gray-900">
                  {bookingData.Rooms?.reduce((total, room) => 
                    total + parseInt(room.NumberOfAdults) + parseInt(room.NumberOfChildren), 0
                  )} Guests
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-semibold text-gray-900">₹{bookingData.NetFare?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Details */}
        {bookingData.Rooms && bookingData.Rooms.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Details</h2>
            <div className="space-y-4">
              {bookingData.Rooms.map((room, index) => (
                <div key={room.ID} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{room.Name}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {room.Refundable === 'True' ? 'Refundable' : 'Non-Refundable'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-semibold text-gray-900">{room.Capacity} Guest{room.Capacity !== '1' ? 's' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Adults</p>
                      <p className="font-semibold text-gray-900">{room.NumberOfAdults}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Children</p>
                      <p className="font-semibold text-gray-900">{room.NumberOfChildren}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Rate</p>
                      <p className="font-semibold text-gray-900">₹{room.RoomRates?.[0]?.TotalRate?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Guest Details */}
                  {room.Guests && room.Guests.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Guest Information</h4>
                      <div className="space-y-2">
                        {room.Guests.map((guest, guestIndex) => (
                          <div key={guestIndex} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium text-gray-900">
                                {guest.Title} {guest.FirstName} {guest.LastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {guest.PaxType === 'A' ? 'Adult' : 'Child'} • Age: {guest.Age}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {bookingData.ContactInfo && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{bookingData.ContactInfo.Email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-semibold text-gray-900">{bookingData.ContactInfo.Mobile}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-900">
                    {bookingData.ContactInfo.Address}, {bookingData.ContactInfo.City}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotel Facilities */}
        {bookingData.HotelFacilities && bookingData.HotelFacilities.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hotel Facilities</h2>
            <div className="flex flex-wrap gap-2">
              {bookingData.HotelFacilities.map((facility, index) => (
                facility.name && (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {facility.name}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        {/* Important Information Accordion */}
        {bookingData.MoreInfo && bookingData.MoreInfo.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, importantInfo: !prev.importantInfo }))}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-semibold text-gray-900">Important Information</h2>
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.importantInfo ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {expandedSections.importantInfo && (
              <div className="px-6 pb-6">
                <div className="space-y-6 pt-4">
                  {/* Group by type */}
                  {(() => {
                    const groupedInfo = bookingData.MoreInfo.reduce((acc, info) => {
                      if (!info.Description) return acc;
                      const type = info.Code || info.Name || 'General';
                      if (!acc[type]) acc[type] = [];
                      acc[type].push(info);
                      return acc;
                    }, {});

                    return Object.entries(groupedInfo).map(([type, items]) => (
                      <div key={type} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <div className="w-1 h-6 bg-indigo-500 mr-3 rounded"></div>
                          {formatHeading(type)}
                        </h3>
                        <div className="space-y-2">
                          {items.map((item, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <p className="text-gray-600 text-sm leading-relaxed">{item.Description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto bg-gray-600 text-white py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Print Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingConfirmation;
