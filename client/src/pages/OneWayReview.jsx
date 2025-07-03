import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function formatDateTime(dt) {
  if (!dt) return { time: '--:--', date: '--' };
  const d = new Date(dt);
  return {
    time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
    date: d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' })
  };
}

const OneWayReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pricerData, setPricerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flight, setFlight] = useState(null);

  // Get flight data from location.state or localStorage
  useEffect(() => {
    const flightFromState = location.state?.flightData;   
    const flightFromStorage = localStorage.getItem('selectedFlight');
    
    if (flightFromState) {
      setFlight(flightFromState);
      // Store in localStorage for reload persistence
      localStorage.setItem('selectedFlight', JSON.stringify(flightFromState));
    } else if (flightFromStorage) {
      setFlight(JSON.parse(flightFromStorage));
    } else {
      // No flight data available, redirect to search
      navigate('/flight-search');
      return;
    }
  }, [location.state, navigate]);

  // Get pricer data once flight is available
  useEffect(() => {
    if (flight) {
      getPricer();
    }
  }, [flight]);

  const TUI=localStorage.getItem('TUI');

  const smartPrice = JSON.parse(localStorage.getItem('smartPrice'));
  const clientId = localStorage.getItem('clientId');
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
  async function getPricer() {
    if (!smartPrice?.TUI || !clientId) {
      console.error('Missing TUI or ClientID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/getPricer`, {
        method: 'POST',
        body: JSON.stringify({
          ClientID: clientId,
          TUI: TUI
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      console.log('getPricer response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pricer data');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'No pricer data available');
      }
      
      // Use data.data if the response is wrapped, otherwise use data directly
      const pricerData = data.data || data;
      setPricerData(pricerData);
      
      // Store pricer data in localStorage for persistence
      localStorage.setItem('pricerData', JSON.stringify(pricerData));
      
    } catch (error) {
      console.error('Error fetching pricer data:', error);
      // Try to get from localStorage if API fails
      const storedPricerData = localStorage.getItem('pricerData');
      if (storedPricerData) {
        try {
          setPricerData(JSON.parse(storedPricerData));
        } catch (parseError) {
          console.error('Error parsing stored pricer data:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <div className="mt-4 text-gray-600">Loading flight details...</div>
        </div>
      </div>
    );
  }

  if (!pricerData || !flight) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          Failed to load flight details. Please try again.
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

  // Extract data from API response
  const journey = pricerData.Trips?.[0]?.Journey?.[0];
  const segments = journey?.Segments || [];
  const fares = segments[0]?.Fares || {};
  const grossAmount = pricerData.GrossAmount;
  const netAmount = pricerData.NetAmount;
  const baggage = pricerData.SSR?.find(ssr => ssr.Code === 'BAG');
  const rules = pricerData.Rules || [];

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-blue-900 text-white rounded-t px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="font-bold text-lg flex-1">{pricerData.FromName?.split('|')[0]} → {pricerData.ToName?.split('|')[0]}</div>
          <div className="text-sm flex-1 text-right">
            {formatDateTime(segments[0]?.Flight?.DepartureTime).date} | {journey?.Stops} Stop | {journey?.Duration}
          </div>
        </div>
        <div className="bg-white rounded-b shadow p-6">
          {/* Flight Segments */}
          <div className="relative flex flex-col gap-0 pl-8">
            {/* Vertical bar */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 z-0" />
            {segments.map((segment, idx) => {
              const flight = segment.Flight;
              return (
                <div key={idx} className="relative flex flex-col md:flex-row md:items-center md:justify-between py-6 border-b last:border-b-0">
                  {/* Dot for segment */}
                  <div className="absolute left-[-32px] top-8 w-4 h-4 bg-blue-900 rounded-full border-2 border-white z-10" />
                  <div className="flex-1">
                    <div className="font-bold text-lg">{formatDateTime(flight.DepartureTime).time}</div>
                    <div className="text-xs text-gray-500">{formatDateTime(flight.DepartureTime).date}</div>
                    <div className="mt-1 text-sm font-semibold">{flight.DepAirportName?.split('|')[0]} [{flight.DepartureCode}]</div>
                    <div className="text-xs text-gray-400">Terminal {flight.DepartureTerminal}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-900 font-bold">{flight.Duration}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold">{flight.Airline?.split('|')[0]}</span>
                      <span className="text-xs text-gray-500">{flight.FlightNo}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{flight.AirCraft} {flight.EquipmentType}</div>
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

          {/* Fare Details */}
          <div className="mt-6">
            <div className="font-bold mb-2">Fare Details</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Gross Fare: <span className="font-semibold">₹{grossAmount?.toLocaleString()}</span></div>
              <div>Net Fare: <span className="font-semibold">₹{netAmount?.toLocaleString()}</span></div>
              <div>Base Fare: <span className="font-semibold">₹{fares.TotalBaseFare?.toLocaleString()}</span></div>
              <div>Tax: <span className="font-semibold">₹{fares.TotalTax?.toLocaleString()}</span></div>
              <div>Commission: <span className="font-semibold">₹{fares.TotalCommission?.toLocaleString()}</span></div>
              <div>Service Tax: <span className="font-semibold">₹{fares.TotalServiceTax?.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Baggage Policy */}
          <div className="mt-6">
            <div className="font-bold mb-2">Baggage Policy</div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span role="img" aria-label="baggage">🧳</span> 
                {baggage?.Description || 'Cabin Baggage - Adult-7 Kg'}
              </div>
            </div>
          </div>

          {/* Rules */}
          {rules.length > 0 && (
            <div className="mt-6">
              <div className="font-bold mb-2">Fare Rules</div>
              {rules.map((rule, idx) => (
                <div key={idx} className="mb-3 p-3 bg-gray-50 rounded">
                  <div className="font-semibold text-blue-900">{rule.OrginDestination}</div>
                  {rule.Rule?.map((r, i) => (
                    <div key={i} className="mt-2">
                      <div className="font-semibold text-sm">{r.Head}:</div>
                      {r.Info?.map((info, j) => (
                        <div key={j} className="text-xs text-gray-700 ml-2">
                          {info.Description} {info.AdultAmount && `(₹${info.AdultAmount})`}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Flight Info */}
          <div className="mt-6">
            <div className="font-bold mb-2">Flight Information</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Fare Class: <span className="font-semibold">{segments[0]?.Flight?.FareClass}</span></div>
              <div>Cabin: <span className="font-semibold">{segments[0]?.Flight?.Cabin}</span></div>
              <div>Refundable: <span className="font-semibold">{segments[0]?.Flight?.Refundable === 'Y' ? 'Yes' : 'No'}</span></div>
              <div>Promo Code: <span className="font-semibold">{journey?.Promo || 'N/A'}</span></div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex items-center justify-between px-8 py-4 z-50">
        <div className="text-lg font-bold">Total Amount<br /><span className="text-2xl text-blue-900">₹ {grossAmount?.toLocaleString() || '--'}</span></div>
        <button 
          onClick={() => navigate('/pax-details', { state: { flight, pricerData } })} 
          className="bg-blue-900 text-white px-8 py-3 rounded font-bold text-lg hover:bg-blue-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OneWayReview; 