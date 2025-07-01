import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, orderId, flight, pricerData, passengers, contact } = location.state || {};

  if (!paymentId || !orderId) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          Invalid booking confirmation. Please go back to search.
          <button 
            onClick={() => navigate('/flight-search')} 
            className="block mt-4 bg-blue-900 text-white px-4 py-2 rounded"
          >
            Go Back to Search
          </button>
        </div>
      </div>
    );
  }

  const formatDateTime = (dt) => {
    if (!dt) return { time: '--:--', date: '--' };
    const d = new Date(dt);
    return {
      time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
      date: d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' })
    };
  };

  const journey = pricerData.Trips?.[0]?.Journey?.[0];
  const segments = journey?.Segments || [];

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <div className="max-w-2xl mx-auto mt-8">
        {/* Success Header */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
          <p className="text-green-600">Your flight has been successfully booked and payment completed.</p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="font-bold text-lg mb-4">Payment Details</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Payment ID:</span>
              <span className="font-mono">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-bold">₹{pricerData.GrossAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="text-green-600 font-semibold">✓ Successful</span>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="font-bold text-lg mb-4">Flight Details</div>
          <div className="bg-blue-900 text-white rounded-t px-6 py-4 mb-4">
            <div className="font-bold text-lg">{pricerData.FromName?.split('|')[0]} → {pricerData.ToName?.split('|')[0]}</div>
            <div className="text-sm">
              {formatDateTime(segments[0]?.Flight?.DepartureTime).date} | {journey?.Stops} Stop | {journey?.Duration}
            </div>
          </div>
          
          {segments.map((segment, idx) => {
            const flight = segment.Flight;
            return (
              <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between py-4 border-b last:border-b-0">
                <div className="flex-1">
                  <div className="font-bold text-lg">{formatDateTime(flight.DepartureTime).time}</div>
                  <div className="text-xs text-gray-500">{formatDateTime(flight.DepartureTime).date}</div>
                  <div className="mt-1 text-sm font-semibold">{flight.DepAirportName?.split('|')[0]} [{flight.DepartureCode}]</div>
                  <div className="text-xs text-gray-400">Terminal {flight.DepartureTerminal}</div>
                </div>
                <div className="flex flex-col items-center my-2">
                  <div className="text-blue-900 font-bold">{flight.Duration}</div>
                  <div className="text-xs text-gray-500">{flight.Airline?.split('|')[0]} {flight.FlightNo}</div>
                </div>
                <div className="flex-1 text-right">
                  <div className="font-bold text-lg">{formatDateTime(flight.ArrivalTime).time}</div>
                  <div className="text-xs text-gray-500">{formatDateTime(flight.ArrivalTime).date}</div>
                  <div className="mt-1 text-sm font-semibold">{flight.ArrAirportName?.split('|')[0]} [{flight.ArrivalCode}]</div>
                  <div className="text-xs text-gray-400">Terminal {flight.ArrivalTerminal}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Passenger Details */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="font-bold text-lg mb-4">Passenger Details</div>
          <div className="space-y-3">
            {passengers.adults.map((adult, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-semibold">Adult {adult.index}</span>
                <span>{adult.firstName} {adult.lastName}</span>
              </div>
            ))}
            {passengers.children.map((child, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-semibold">Child {child.index}</span>
                <span>{child.firstName} {child.lastName}</span>
              </div>
            ))}
            {passengers.infants.map((infant, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-semibold">Infant {infant.index}</span>
                <span>{infant.firstName} {infant.lastName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="font-bold text-lg mb-4">Contact Information</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-icons text-gray-500">phone</span>
              <span>{contact.countryCode} {contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-gray-500">email</span>
              <span>{contact.email}</span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="font-bold text-yellow-800 mb-2">Important Information</div>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Please arrive at the airport 2 hours before departure for domestic flights</li>
            <li>• Carry a valid government ID proof for all passengers</li>
            <li>• Check your email for e-ticket and booking confirmation</li>
            <li>• Contact airline for any flight changes or cancellations</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex items-center justify-between px-8 py-4 z-50">
        <div className="text-sm text-gray-600">
          Need help? Contact us at support@flyteasy.com
        </div>
        <button 
          onClick={() => navigate('/flight-search')} 
          className="bg-blue-900 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800"
        >
          Book Another Flight
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation; 