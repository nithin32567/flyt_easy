import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FlightBookingDetails = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/bookings/${bookingId}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await response.json();
        // console.log('Booking details fetched:', data);
        setBooking(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, user, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Booking Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const bookingData = booking.bookingData;
  const trips = bookingData?.Trips || [];
  const passengers = bookingData?.Pax || [];
  const contactInfo = bookingData?.ContactInfo || [];
  const ssr = bookingData?.SSR || [];
  const rules = bookingData?.Rules || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Booking Details</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </span>
            </div>
            <p className="text-blue-100 mt-2">
              Transaction ID: {booking.transactionId}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Flight Information</h2>
                {trips.map((trip, tripIndex) => (
                  <div key={tripIndex} className="mb-6">
                    {trip.Journey?.map((journey, journeyIndex) => {
                      // Get flight details from the first segment
                      const flight = journey.Segments?.[0]?.Flight;
                      const departureTime = flight?.DepartureTime;
                      const arrivalTime = flight?.ArrivalTime;
                      const departureCode = flight?.DepartureCode || bookingData.From;
                      const arrivalCode = flight?.ArrivalCode || bookingData.To;
                      const airline = flight?.Airline?.split('|')[0] || 'Flight';
                      const flightNo = flight?.FlightNo || 'N/A';
                      const depAirportName = flight?.DepAirportName || bookingData.FromName;
                      const arrAirportName = flight?.ArrAirportName || bookingData.ToName;
                      const duration = flight?.Duration || journey.Duration;

                      return (
                        <div key={journeyIndex} className="border rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <span className="text-2xl font-bold">{departureCode}</span>
                              <span className="mx-2">→</span>
                              <span className="text-2xl font-bold">{arrivalCode}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{airline}</div>
                              <div className="text-sm text-gray-600">{flightNo}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Departure</div>
                              <div>{departureTime ? formatDate(departureTime) : 'N/A'}</div>
                              <div>{departureTime ? formatTime(departureTime) : 'N/A'}</div>
                              <div className="text-gray-600">{depAirportName}</div>
                            </div>
                            <div>
                              <div className="font-medium">Arrival</div>
                              <div>{arrivalTime ? formatDate(arrivalTime) : 'N/A'}</div>
                              <div>{arrivalTime ? formatTime(arrivalTime) : 'N/A'}</div>
                              <div className="text-gray-600">{arrAirportName}</div>
                            </div>
                          </div>
                          {duration && (
                            <div className="mt-3 text-sm text-gray-600">
                              <span className="font-medium">Duration:</span> {duration}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>
                {passengers.map((passenger, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {passenger.Title} {passenger.FName} {passenger.LName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {passenger.PTC} • {passenger.Gender} • Age: {passenger.Age}
                        </div>
                        {passenger.PassportNo && (
                          <div className="text-sm text-gray-600">
                            Passport: {passenger.PassportNo}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <h2 className="text-xl font-semibold mb-4 mt-6">Contact Information</h2>
                {contactInfo.map((contact, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="font-medium">
                      {contact.Title} {contact.FName} {contact.LName}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>📧 {contact.Email}</div>
                      <div>📱 {contact.MobileCountryCode} {contact.Mobile}</div>
                      {contact.Address && (
                        <div>📍 {contact.Address}, {contact.City}, {contact.State} {contact.PIN}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="text-2xl font-bold">₹{booking.totalAmount}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Payment Status</div>
                  <div className="text-lg font-semibold text-green-600 capitalize">
                    {booking.paymentStatus}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Booking Date</div>
                  <div className="text-lg font-semibold">
                    {formatDate(booking.bookingDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* SSR Information */}
            {ssr.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Special Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ssr.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{service.Description}</div>
                          <div className="text-sm text-gray-600">{service.Code}</div>
                          {service.PieceDescription && (
                            <div className="text-sm text-gray-600">{service.PieceDescription}</div>
                          )}
                        </div>
                        {service.Charge > 0 && (
                          <div className="text-right">
                            <div className="font-semibold">₹{service.Charge}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Rules */}
            {rules.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Booking Rules</h2>
                {rules.map((rule, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="font-medium mb-2">{rule.OrginDestination} - {rule.Provider}</div>
                    {rule.Rule && rule.Rule.length > 0 && (
                      <div className="space-y-2">
                        {rule.Rule.map((ruleItem, ruleIndex) => (
                          <div key={ruleIndex}>
                            {ruleItem.Head && (
                              <div className="font-medium text-gray-800">{ruleItem.Head}</div>
                            )}
                            {ruleItem.Info && ruleItem.Info.length > 0 && (
                              <div className="ml-4 space-y-1">
                                {ruleItem.Info.map((info, infoIndex) => (
                                  <div key={infoIndex} className="text-sm text-gray-600">
                                    {info.Description}: ₹{info.AdultAmount}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => navigate('/bookings')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to Bookings
              </button>
              {booking.status === 'current' && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                      // Implement cancel booking functionality
                      // console.log('Cancel booking:', booking._id);
                    }
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBookingDetails;