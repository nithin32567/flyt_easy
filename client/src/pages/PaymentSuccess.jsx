import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState(null);
    const [contactInfo, setContactInfo] = useState(null);
    const [travellers, setTravellers] = useState([]);

    useEffect(() => {
        const review = localStorage.getItem('oneWayReviewData');
        const contact = localStorage.getItem('contactInfo');
        const pax = localStorage.getItem('travellers');
        if (review) setReviewData(JSON.parse(review));
        if (contact) setContactInfo(JSON.parse(contact));
        if (pax) setTravellers(JSON.parse(pax));
    }, []);

    if (!reviewData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    // Extract flight and fare details
    const onwardJourney = reviewData?.Trips?.[0]?.Journey?.[0] || {};
    const segments = onwardJourney?.Segments || [];
    const firstSegment = segments[0]?.Flight || {};
    const lastSegment = segments[segments.length - 1]?.Flight || {};
    const airline = firstSegment.Airline?.split('|')[0] || null;
    const flightNo = firstSegment.FlightNo || null;
    const depTime = firstSegment.DepartureTime ? new Date(firstSegment.DepartureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    const arrTime = lastSegment.ArrivalTime ? new Date(lastSegment.ArrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    const depCity = firstSegment.DepAirportName?.split('|')[1] || null;
    const arrCity = lastSegment.ArrAirportName?.split('|')[1] || null;
    const from = reviewData?.FromName?.split('|')[0] || null;
    const to = reviewData?.ToName?.split('|')[0] || null;
    const date = reviewData?.OnwardDate || null;
    const duration = onwardJourney?.Duration || null;
    const stops = onwardJourney?.Stops || null;
    const bookingRef = reviewData?.TUI?.split('|')[2] || null;
    const terminal = `${firstSegment.DepartureTerminal || '-'} → ${lastSegment.ArrivalTerminal || '-'}`;
    const netAmount = reviewData?.NetAmount ?? onwardJourney?.NetFare ?? null;
    const grossAmount = reviewData?.GrossAmount ?? onwardJourney?.GrossFare ?? null;
    const baseFare = onwardJourney?.Fares?.PTCFare?.[0]?.Fare ?? null;
    const taxes = onwardJourney?.Fares?.PTCFare?.[0]?.Tax ?? null;
    const email = contactInfo?.Email || null;
    const passengers = Array.isArray(travellers) && travellers.length > 0 ? travellers : null;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header: Payment Completed */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col items-center">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Payment Completed!</h2>
                        <p className="text-gray-600 mb-2">Your ticket and boarding pass will be sent to:</p>
                        <div className="bg-gray-100 rounded px-4 py-2 text-blue-700 font-medium mb-1">{email ?? <span className="text-gray-400">No email</span>}</div>
                        <span className="text-green-600 text-sm">Email sent successfully</span>
                    </div>
                </div>

                {/* Flight Details */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2">{airline ?? '—'}</span>
                            <span className="text-gray-500">{flightNo ?? '—'}</span>
                        </div>
                        <div className="text-gray-500 text-sm">Date: <span className="font-medium text-gray-900">{date ?? '—'}</span></div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col items-center md:items-start">
                            <span className="text-2xl font-bold text-blue-900">{depTime ?? '—'}</span>
                            <span className="text-gray-700">{from ?? '—'}</span>
                            <span className="text-xs text-gray-500">{depCity ?? '—'}</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <div className="h-1 w-16 bg-gray-200 rounded my-2 md:my-0 md:mx-4"></div>
                            <span className="text-gray-500 text-sm">{duration ?? '—'}</span>
                            <span className="text-gray-400 text-xs">{stops ? `${stops} Stop${stops === '1' ? '' : 's'}` : '—'}</span>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <span className="text-2xl font-bold text-blue-900">{arrTime ?? '—'}</span>
                            <span className="text-gray-700">{to ?? '—'}</span>
                            <span className="text-xs text-gray-500">{arrCity ?? '—'}</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-gray-500">
                        <span>Terminal {terminal}</span>
                        <span>Booking Reference: <span className="font-semibold text-gray-900">{bookingRef ?? '—'}</span></span>
                    </div>
                </div>

                {/* Passenger Details */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-blue-900">Passenger Details</h3>
                    <div className="divide-y divide-gray-200">
                        {passengers ? passengers.map((p, idx) => (
                            <div key={idx} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <span className="font-semibold text-gray-900">{p.FName ?? null} {p.LName ?? null}</span>
                                    <span className="bg-gray-100 text-gray-700 rounded px-2 py-1 text-xs">Seat: {p.Seat ?? '—'}</span>
                                    <span className="bg-gray-100 text-gray-700 rounded px-2 py-1 text-xs">Meal: {p.Meal ?? '—'}</span>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 rounded px-2 py-1 text-xs font-semibold mt-2 md:mt-0">{p.PTC ?? null}</span>
                            </div>
                        )) : <div className="text-gray-400">No passenger data</div>}
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-blue-900">Price Breakdown</h3>
                    <div className="divide-y divide-gray-200">
                        <div className="flex justify-between py-2 text-gray-700">
                            <span>Base Fare</span>
                            <span className="font-medium">₹{baseFare?.toLocaleString() ?? '—'}</span>
                        </div>
                        <div className="flex justify-between py-2 text-gray-700">
                            <span>Taxes & Fees</span>
                            <span className="font-medium">₹{taxes?.toLocaleString() ?? '—'}</span>
                        </div>
                        <div className="flex justify-between py-2 text-lg font-bold text-blue-900 mt-2">
                            <span>Total</span>
                            <span>₹{netAmount?.toLocaleString() ?? '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <button
                        onClick={() => navigate('/search')}
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
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Flight Receipt',
                                    text: `Booking Ref: ${bookingRef ?? ''}\nAmount: ₹${netAmount ?? ''}`,
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
                        onClick={() => navigate('/')}
                        className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                        Book Hotel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;