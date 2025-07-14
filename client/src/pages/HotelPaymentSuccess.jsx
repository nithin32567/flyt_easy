import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HotelPaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom"));
  const hotel = JSON.parse(localStorage.getItem("hotel"));
  const amount = selectedRoom.price;
  const paymentId = location.state?.paymentId || 'MOCKPAY123456';
  const room = selectedRoom;
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col items-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Hotel Booking Confirmed!</h2>
          <p className="text-gray-600 mb-2">Your hotel booking and payment are successful.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold mb-2 text-blue-900">Hotel Details</h3>
          <div className="mb-2 font-medium">{hotel?.name ?? '—'}</div>
          <div className="text-gray-600 mb-2">{hotel?.location ?? '—'}</div>
          <div className="text-gray-500 mb-2">Room: <span className="font-semibold text-gray-900">{room?.type ?? '—'}</span></div>
          <div className="text-gray-500 mb-2">Features: <span className="text-gray-700">{room?.features?.join(', ') ?? '—'}</span></div>
          <div className="text-gray-500 mb-2">Amount Paid: <span className="font-semibold text-green-700">₹{amount?.toLocaleString() ?? '—'}</span></div>
          <div className="text-gray-500 mb-2">Payment ID: <span className="text-gray-700">{paymentId ?? '—'}</span></div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Print Receipt
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Hotel Booking Receipt',
                  text: `Hotel: ${hotel?.name ?? ''}\nRoom: ${room?.type ?? ''}\nAmount: ₹${amount ?? ''}`,
                  url: window.location.href
                });
              } else {
                alert('Sharing not supported on this device.');
              }
            }}
            className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            Share Receipt
          </button>
          <button
            onClick={() => navigate('/hotel-booking')}
            className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            Book Another Hotel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelPaymentSuccess; 