import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/bookings/user/${user._id}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    } catch (err) {
      alert('Failed to cancel booking: ' + err.message);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-gray-600">Manage your flight bookings and view booking history</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setFilter('current')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'current' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Current ({bookings.filter(b => b.status === 'current').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'completed' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed ({bookings.filter(b => b.status === 'completed').length})
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'cancelled' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
              </button>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No bookings found' : `No ${filter} bookings found`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'You haven\'t made any bookings yet.' 
                : `You don't have any ${filter} bookings.`
              }
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Book a Flight
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const bookingData = booking.bookingData;
              const trips = bookingData?.Trips || [];
              const firstTrip = trips[0]?.Journey?.[0];
              const passengers = bookingData?.Pax || [];

              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {firstTrip ? `${firstTrip.From} → ${firstTrip.To}` : 'Flight Booking'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Transaction ID: {booking.transactionId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Booked on: {formatDate(booking.bookingDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{booking.totalAmount}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {booking.paymentStatus}
                        </div>
                      </div>
                    </div>

                    {firstTrip && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600">Departure</div>
                          <div className="font-medium">{formatDate(firstTrip.DepartureTime)}</div>
                          <div className="text-sm text-gray-600">{formatTime(firstTrip.DepartureTime)}</div>
                          <div className="text-sm text-gray-600">{firstTrip.FromName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Arrival</div>
                          <div className="font-medium">{formatDate(firstTrip.ArrivalTime)}</div>
                          <div className="text-sm text-gray-600">{formatTime(firstTrip.ArrivalTime)}</div>
                          <div className="text-sm text-gray-600">{firstTrip.ToName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Flight Details</div>
                          <div className="font-medium">{firstTrip.AirlineName}</div>
                          <div className="text-sm text-gray-600">{firstTrip.FlightNumber}</div>
                          <div className="text-sm text-gray-600">{passengers.length} Passenger(s)</div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {passengers.length} Passenger(s) • {trips.length} Trip(s)
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/booking-details/${booking._id}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          View Details
                        </button>
                        {booking.status === 'current' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
