import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearBookingData } from '../utils/clearBookingData';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const bookingSuccess = localStorage.getItem('bookingSuccess');
    if (bookingSuccess) {
      setBookingData(JSON.parse(bookingSuccess));
    } else {
      // If no booking data, redirect to search
      navigate('/search');
    }
  }, [navigate]);

  const handleNewBooking = () => {
    // Clear all booking-related localStorage items to prevent conflicts
    clearBookingData();
    navigate('/search');
  };

  if (!bookingData) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-40">
      <div className="max-w-2xl mx-auto pt-8 px-4">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your flight has been successfully booked and payment completed.</p>
          </div>

          {/* Flight Details */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Flight Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{bookingData?.flightInfo?.FromName?.split('|')[0]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{bookingData?.flightInfo?.ToName?.split('|')[0]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{bookingData?.flightInfo?.OnwardDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-medium text-green-600">₹{bookingData?.amount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment ID</p>
                <p className="font-medium text-sm">{bookingData?.paymentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium text-sm">{bookingData?.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Itinerary ID</p>
                <p className="font-medium text-sm">{bookingData?.itineraryId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-green-600">Paid</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleNewBooking}
              className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Book Another Flight
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Print Receipt
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• You will receive a confirmation email with your booking details</li>
            <li>• Check your email for the e-ticket and boarding pass</li>
            <li>• Arrive at the airport 2 hours before departure for domestic flights</li>
            <li>• Keep your booking reference handy for any queries</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;