import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const tabs = ["One Way", "Round Trip", "Multi City"];

// Dummy airport data for UI scaffolding


const AirportModal = ({ open, onClose, onSelect, label, airports }) => {
  const [search, setSearch] = useState('');
  const filtered = airports.filter(a =>
    a.CityName.toLowerCase().includes(search.toLowerCase()) ||
    a.Name.toLowerCase().includes(search.toLowerCase()) ||
    a.Code.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-96 max-w-full p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">{label}</span>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Enter city or airport"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="text-xs text-green-700 mb-2">Important airports</div>
        <div className="max-h-60 overflow-y-auto">
          {filtered.map(a => (
            <div
              key={a.Code}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => { onSelect(a); onClose(); }}
            >
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold w-12 text-center">{a.Code}</span>
              <div className="flex-1">
                <div className="font-semibold text-sm">{a.CityName}</div>
                <div className="text-xs text-gray-500">{a.Name}</div>
              </div>
              <div className="text-xs text-gray-400">{a.Country}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TravellersClassModal = ({
  open, onClose, onApply, initial
}) => {
  const [adults, setAdults] = useState(initial.adults || 1);
  const [children, setChildren] = useState(initial.children || 0);
  const [infants, setInfants] = useState(initial.infants || 0);
  const [travelClass, setTravelClass] = useState(initial.travelClass || 'Economy');

  useEffect(() => {
    setAdults(initial.adults || 1);
    setChildren(initial.children || 0);
    setInfants(initial.infants || 0);
    setTravelClass(initial.travelClass || 'Economy');
  }, [open, initial]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-96 max-w-full p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">TRAVELLERS & CLASS</span>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span>Adults</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="px-2 py-1 border rounded">-</button>
              <span>{adults}</span>
              <button type="button" onClick={() => setAdults(adults + 1)} className="px-2 py-1 border rounded">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Children</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="px-2 py-1 border rounded">-</button>
              <span>{children}</span>
              <button type="button" onClick={() => setChildren(children + 1)} className="px-2 py-1 border rounded">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Infants</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setInfants(Math.max(0, infants - 1))} className="px-2 py-1 border rounded">-</button>
              <span>{infants}</span>
              <button type="button" onClick={() => setInfants(infants + 1)} className="px-2 py-1 border rounded">+</button>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            {['Economy', 'Premium Economy', 'Business'].map(cls => (
              <button
                key={cls}
                type="button"
                className={`px-3 py-1 rounded ${travelClass === cls ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setTravelClass(cls)}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
        <button
          className="w-full bg-blue-800 text-white py-2 rounded font-semibold hover:bg-blue-900 transition-colors"
          onClick={() => {
            onApply({ adults, children, infants, travelClass });
            onClose();
          }}
        >
          APPLY
        </button>
      </div>
    </div>
  );
};

const SearchForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travellers, setTravellers] = useState(1);
  const [travelClass, setTravelClass] = useState("Economy");
  const [modal, setModal] = useState(null); // 'from' or 'to' or null
  const [airports, setAirports] = useState([]);
  const [travellerModalOpen, setTravellerModalOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
  const token = localStorage.getItem('token');
  useEffect(() => {

    if (!token) {
      navigate('/login');
    }


    fetchAirports();
  }, []);

  // fetching the airports from the backend
  async function fetchAirports() {
    try {
      const response = await fetch(`${baseUrl}/api/airport`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAirports(data);
      console.log(data, 'from the backend=========================');
    } catch (error) {
      console.error('Error fetching airports:', error);
    }
  }




  async function handleExpressSearch(e) {
    e.preventDefault();

    if (!from || !to || !departure) {
      alert('Please select From, To, and Departure Date');
      return;
    }
    
    setIsSearching(true);
    const clientId = localStorage.getItem('clientId');
    const payload = {
      ADT: adults,
      CHD: children,
      INF: infants,
      Cabin: travelClass === 'Economy' ? 'E' : travelClass === 'Premium Economy' ? 'PE' : 'B',
      Source: 'CF',
      Mode: 'AS',
      ClientID: clientId,
      FareType: activeTab === 0 ? 'ON' : 'RT',
      Trips: [
        {
          From: from.Code,
          To: to.Code,
          OnwardDate: departure,
          ReturnDate: activeTab === 1 ? returnDate : '',
          TUI: ''
        }
      ],
      Parameters: {
        Airlines: '',
        GroupType: '',
        Refundable: '',
        IsDirect: false,
        IsStudentFare: false,
        IsNearbyAirport: false
      }
    };
    try {
      const response = await fetch(`${baseUrl}/api/flight/express-search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log(data, "data from the backend========================= 220", data.data.TUI, 'express search data tui');
      if (data.success && data.data?.TUI) {
        console.log("success and calling the getExpSearch================== 212 ", data.data.TUI, 'submitting the tui to the backend')
        
        // Poll GetExpSearch until Complete is true or timeout
        const pollGetExpSearch = async () => {
          const startTime = Date.now();
          const timeout = 50000; // 50 seconds timeout
          const pollInterval = 2000; // Poll every 2 seconds
          
          while (Date.now() - startTime < timeout) {
            try {
              const payload = {
                TUI: data.data.TUI,
                ClientID: clientId
              }
              
              const expSearchRes = await fetch(`${baseUrl}/api/flight/get/getExpSearch`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              });
              
              const expSearchData = await expSearchRes.json();
              console.log(expSearchData, 'GetExpSearch Response');
              
              if (expSearchData.success) {
                // Check if the search is complete
                if (expSearchData.data?.Completed === 'True') {
                  console.log('Search completed successfully');
                  if (expSearchData.data?.Trips?.[0]?.Journey) {
                    localStorage.setItem('search-tui', expSearchData.data.TUI);
                    localStorage.setItem('searchPayload', JSON.stringify(payload));
                    navigate('/flight-listing', { state: { flights: expSearchData.data.Trips[0].Journey } });
                    return;
                  } else {
                    console.error('No flights found in completed search');
                    alert('No flights found for your search criteria.');
                    return;
                  }
                } else {
                  console.log('Search still in progress, polling again...');
                  // Wait before next poll
                  await new Promise(resolve => setTimeout(resolve, pollInterval));
                }
              } else {
                console.error('GetExpSearch failed:', expSearchData);
                alert('Search failed. Please try again.');
                return;
              }
            } catch (error) {
              console.error('Error polling GetExpSearch:', error);
              alert('Search failed. Please try again.');
              return;
            }
          }
          
          // Timeout reached
          console.error('Search timeout - 50 seconds exceeded');
          alert('Search is taking longer than expected. Please try again.');
        };
        
        // Start polling
        await pollGetExpSearch();
      }
    } catch (error) {
      console.error('Error from the backend:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }
  return (
    <div className="bg-white rounded shadow p-4">
      {/* Tabs */}
      <div className="flex mb-4">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`flex-1 py-2 font-semibold border-b-2 ${activeTab === idx ? 'border-blue-800 text-blue-800 bg-blue-100' : 'border-gray-200 text-gray-600 bg-white'}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Form */}
      <form className="space-y-4" onSubmit={handleExpressSearch}>
        <div>
          <label className="block text-xs text-gray-500">From</label>
          <div
            className="w-full border rounded px-3 py-2 mt-1 bg-white cursor-pointer"
            onClick={() => setModal('from')}
          >
            {from ? (
              <>
                <div className="font-semibold text-sm">{from.CityName}</div>
                <div className="text-xs text-gray-500">{from.Name}</div>
              </>
            ) : (
              <span className="text-gray-400">Select departure airport</span>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500">To</label>
          <div
            className="w-full border rounded px-3 py-2 mt-1 bg-white cursor-pointer"
            onClick={() => setModal('to')}
          >
            {to ? (
              <>
                <div className="font-semibold text-sm">{to.CityName}</div>
                <div className="text-xs text-gray-500">{to.Name}</div>
              </>
            ) : (
              <span className="text-gray-400">Select arrival airport</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500">Departure Date</label>
            <input type="date" className="w-full border rounded px-3 py-2 mt-1" value={departure} onChange={e => setDeparture(e.target.value)} />
          </div>
          {activeTab !== 0 && (
            <div className="flex-1">
              <label className="block text-xs text-gray-500">Return</label>
              <input type="date" className="w-full border rounded px-3 py-2 mt-1" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-500">Travellers & Class</label>
          <div
            className="w-full border rounded px-3 py-2 mt-1 bg-white cursor-pointer"
            onClick={() => setTravellerModalOpen(true)}
          >
            {`${adults + children + infants} Traveller${adults + children + infants > 1 ? 's' : ''} | ${travelClass}`}
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSearching}
          className={`w-full text-white py-2 rounded font-semibold transition-colors ${
            isSearching 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-800 hover:bg-blue-900'
          }`}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>
      <AirportModal
        open={modal === 'from'}
        onClose={() => setModal(null)}
        onSelect={setFrom}
        label="From"
        airports={airports}
      />
      <AirportModal
        open={modal === 'to'}
        onClose={() => setModal(null)}
        onSelect={setTo}
        label="To"
        airports={airports}
      />
      <TravellersClassModal
        open={travellerModalOpen}
        onClose={() => setTravellerModalOpen(false)}
        onApply={({ adults, children, infants, travelClass }) => {
          setAdults(adults);
          setChildren(children);
          setInfants(infants);
          setTravelClass(travelClass);
        }}
        initial={{ adults, children, infants, travelClass }}
      />
    </div>
  );
};

export default SearchForm; 