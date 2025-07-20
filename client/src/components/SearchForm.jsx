import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import flightIcon from '../assets/img/flight-icon.png'
import hotelIcon from '../assets/img/hotel-booking.png'
import HotelSearch from './HotelSearch'
import CarousalCites from './CarousalCites'

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
  const [isActiveFlightTab, setIsActiveFlightTab] = useState(true);
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

  const baseUrl = import.meta.env.VITE_BASE_URL
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
      // console.log(data, 'from the backend=========================');
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
      IsMultipleCarrier: false,
      IsRefundable: false,
      preferedAirlines: null,
      TUI: "",
      Trips: [
        {
          From: from.Code,
          To: to.Code,
          OnwardDate: departure,
          ReturnDate: activeTab === 1 ? returnDate : '',
          TUI: ''
        }
      ]
    };
    localStorage.setItem("searchPayload", JSON.stringify(payload));
    // console.log(payload, "payload to searchPayload local storage");
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
      console.log(data, "data from the backend========================= 221")
      localStorage.setItem("expressSearchTUI", data.TUI)
      if (data.success && data.data?.TUI) {
        console.log("success and calling the getExpSearch================== 212")

        // Poll GetExpSearch until Completed is 'True' or timeout
        const pollGetExpSearch = async () => {
          const startTime = Date.now();
          const timeout = 50000; // 50 seconds timeout
          const pollInterval = 2000; // Poll every 2 seconds

          while (Date.now() - startTime < timeout) {
            try {
              const expSearchRes = await fetch(`${baseUrl}/api/flight/get/getExpSearch`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ TUI: data.data.TUI })
              });

              const expSearchData = await expSearchRes.json();
              console.log(expSearchData, 'GetExpSearch Response');

              if (expSearchData.success) {
                // Check if the search is complete
                if (expSearchData.data?.Completed === 'True') {
                  console.log('Search completed successfully');
                  localStorage.setItem("getExpSearchTUI", expSearchData.data.TUI)
                  if (expSearchData.data?.Trips?.[0]?.Journey) {
                    // localStorage.setItem('search-tui', expSearchData.data.TUI);
                    navigate('/flight-listing', { state: { flights: expSearchData.data.Trips[0].Journey } });
                    return;
                  } else {
                    console.error('No flights found in completed search');
                    alert('No flights found for your search criteria.');
                    return;
                  }
                } else {
                  console.log('Search still in progress (Completed: False), polling again...');
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
      console.log(error, 'error from the backend=========================');
    } finally {
      setIsSearching(false);
    }
  }
  return (
    <section>
      <div className='max-w-[90%] mx-auto px-4 md:px-0'>
        <div className='bg-white rounded-md shadow-md'>
          <ul className='flex flex-col sm:flex-row bg-gray-200 items-center gap-2 sm:gap-4 py-4 rounded-t-md px-4 md:px-8' id="myTab" role="tablist">
            <li className='flex items-center gap-2 w-full sm:w-auto justify-center' role="presentation">
              <button onClick={() => setIsActiveFlightTab(true)} className='flex items-center gap-2 text-sm md:text-base'
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                <img className='w-8 h-8 md:w-10 md:h-10' src={flightIcon} alt="Flight Booking" />
                <span className='hidden sm:inline'>Flight Booking</span>
                <span className='sm:hidden'>Flight</span>
              </button>
            </li>
            <li className='flex items-center gap-2 w-full sm:w-auto justify-center' role="presentation">
              <button onClick={() => setIsActiveFlightTab(false)} className='flex items-center gap-2 text-sm md:text-base'
                id="profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                <img className='w-8 h-8 md:w-10 md:h-10' src={hotelIcon} alt="Hotel Booking" />
                <span className='hidden sm:inline'>Hotel Booking</span>
                <span className='sm:hidden'>Hotel</span>
              </button>
            </li>
          </ul>
          <div id="myTabContent" className='p-4 md:p-8 space-y-4'>
            {isActiveFlightTab && (
              <div
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >

                <div className='flex flex-col lg:flex-row items-start lg:items-center gap-4 border-b pt-4 pb-8 md:pb-12 border-gray-200' >
                  <ul className='flex flex-wrap items-center gap-2 md:gap-4 text-sm md:text-base'>
                    <li className='flex px-2 md:px-4 rounded-3xl hover:bg-gray-200 py-1 md:py-2 cursor-pointer'>
                      <label className='cursor-pointer'>
                        <input type="radio" name="trip" id="" defaultChecked="" className='mr-2' />{" "}
                        One Way
                      </label>
                    </li>
                    <li className='flex px-2 md:px-4 rounded-3xl hover:bg-gray-200 py-1 md:py-2'>
                      <label className='cursor-pointer'>
                        <input type="radio" name="trip" id="" className='mr-2' /> Round Trip
                      </label>
                    </li>
                    <li className='flex px-2 md:px-4 rounded-3xl hover:bg-gray-200 py-1 md:py-2'>
                      <label className='cursor-pointer'>
                        <input type="radio" name="trip" id="" className='mr-2' /> Multi City
                      </label>
                    </li>
                  </ul>
                </div>

                {/* FORM SUBMIT SECTIONS  */}
                <div className='flex flex-col lg:flex-row items-stretch lg:items-center gap-4 border-b border-gray-200'>
                  <div className='w-full lg:w-1/2'>
                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4'>
                      <div className='w-full sm:w-1/2'>
                        <button className='text-left bg-white rounded-md p-3 md:p-4 w-full h-full'>
                          <h6 className='text-xs md:text-sm'>FROM</h6>
                          <h2 className='text-lg md:text-2xl font-bold'>Mumbai</h2>
                          <p className='text-xs text-gray-500 truncate'>[BOM] Chhatrapati Shivaji International</p>
                        </button>
                      </div>
                      <div className='w-full sm:w-1/2'>
                        <button className='text-left bg-white rounded-md p-3 md:p-4 w-full h-full'>
                          <h6 className='text-xs md:text-sm'>To</h6>
                          <h2 className='text-lg md:text-2xl font-bold'>New Delhi</h2>
                          <p className='text-xs text-gray-500 truncate'>[DEL] Indira Gandhi International</p>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className='w-full lg:w-1/2'>
                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4'>
                      <div className='w-full sm:w-1/3'>
                        <button className='text-left bg-white rounded-md p-3 md:p-4 w-full h-full'>
                          <h6 className='text-xs md:text-sm'>DEPART</h6>
                          <h2 className='text-lg md:text-xl font-bold'>
                            16 <span className='text-black'>Jul'25</span>
                          </h2>
                          <p className='text-xs text-gray-500 truncate'>Wednesday</p>
                        </button>
                      </div>
                      <div className='w-full sm:w-1/3'>
                        <button className='text-left bg-white rounded-md p-3 md:p-4 w-full h-full'>
                          <h6 className='text-xs md:text-sm'>RETURN</h6>
                          <h2 className='text-lg md:text-xl font-bold'>
                            16 <span className='text-black'>Jul'25</span>
                          </h2>
                          <p className='text-xs text-gray-500 truncate'>Tuesday</p>
                        </button>
                      </div>
                      <div className='w-full sm:w-1/3'>
                        <button className='text-left bg-white rounded-md p-3 md:p-4 w-full h-full'>
                          <h6 className='text-xs md:text-sm'>Travellers</h6>
                          <h2 className='text-lg md:text-xl text-center justify-center items-center flex gap-1 font-bold'>
                            2 <span className='text-black'>{" "} Travellers</span>
                          </h2>
                          <p className='text-xs text-gray-500 truncate'>Economy</p>
                        </button>
                      </div>
                      <div className='w-full sm:w-1/3'>
                        <button className='bg-[#f48f22] text-white rounded-md px-6 md:px-12 py-3 w-full text-sm md:text-base'>Search</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <ul className='flex flex-wrap items-center gap-2 md:gap-4 py-4 md:py-8 px-2 md:px-4 text-xs md:text-sm'>
                    <li className='flex items-center gap-2'>
                      <label>
                        <input type="checkbox" name="" id="" /> Direct Flights
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Defence Fare
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Student Fare
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Senior Citizen Fare
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {!isActiveFlightTab && (
              <HotelSearch />
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default SearchForm; 