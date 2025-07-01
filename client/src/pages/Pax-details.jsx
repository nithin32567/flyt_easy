import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaxDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;
  const pricerData = location.state?.pricerData;
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
  const [contact, setContact] = useState({ phone: '', email: '' });
  const [adults, setAdults] = useState([]);
  const [children, setChildren] = useState([]);
  const [infants, setInfants] = useState([]);
  const [showAddAdult, setShowAddAdult] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showAddInfant, setShowAddInfant] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: '+91',
    phone: '',
    email: ''
  });

  // Initialize passenger arrays based on API data
  useEffect(() => {
    if (pricerData) {
      const adtCount = pricerData.ADT || 0;
      const chdCount = pricerData.CHD || 0;
      const infCount = pricerData.INF || 0;

      // Initialize adults
      if (adults.length === 0 && adtCount > 0) {
        setAdults(Array(adtCount).fill(null).map((_, i) => ({ 
          type: 'ADT', 
          index: i + 1,
          name: '',
          title: 'Mr',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          passportNumber: '',
          passportExpiry: ''
        })));
      }

      // Initialize children
      if (children.length === 0 && chdCount > 0) {
        setChildren(Array(chdCount).fill(null).map((_, i) => ({ 
          type: 'CHD', 
          index: i + 1,
          name: '',
          title: 'Mr',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          passportNumber: '',
          passportExpiry: ''
        })));
      }

      // Initialize infants
      if (infants.length === 0 && infCount > 0) {
        setInfants(Array(infCount).fill(null).map((_, i) => ({ 
          type: 'INF', 
          index: i + 1,
          name: '',
          title: 'Mr',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          passportNumber: '',
          passportExpiry: ''
        })));
      }
    }
  }, [pricerData]);

  const startPayment = async () => {
    // Validate required fields
    if (!formData.phone || !formData.email) {
      alert('Please fill in contact information');
      return;
    }

    // Validate passenger details
    const allPassengers = [...adults, ...children, ...infants];
    const missingPassengers = allPassengers.filter(p => !p.firstName || !p.lastName);
    
    if (missingPassengers.length > 0) {
      alert('Please fill in all passenger names');
      return;
    }

    setLoading(true);

    try {
      // Call bookFlight API to create Razorpay order
      const response = await fetch(`${baseUrl}/api/bookFlight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: pricerData.GrossAmount,
          currency: pricerData.CurrencyCode || 'INR',
          receipt: `flight_${Date.now()}`,
          notes: {
            flightDetails: {
              from: pricerData.From,
              to: pricerData.To,
              date: pricerData.OnwardDate,
              flightNumber: pricerData.Trips?.[0]?.Journey?.[0]?.Segments?.[0]?.Flight?.FlightNo,
              airline: pricerData.Trips?.[0]?.Journey?.[0]?.Segments?.[0]?.Flight?.Airline?.split('|')[0]
            },
            passengers: {
              adults: adults.length,
              children: children.length,
              infants: infants.length
            },
            contact: formData,
            pricerData: pricerData
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      // Initialize Razorpay payment
      const options = {
        key:'rzp_test_9Hi6wVlmuLeJ77', // Replace with your actual key
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'FlytEasy',
        description: `Flight from ${pricerData.From} to ${pricerData.To}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${baseUrl}/api/verifyPayment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              // Payment successful and verified
              console.log('Payment successful and verified:', response);
              alert('Payment successful! Your booking is confirmed.');
              
              // Clear any stored booking data
              localStorage.removeItem('selectedFlight');
              localStorage.removeItem('pricerData');
              localStorage.removeItem('smartPrice');
              
              // Redirect to home page
              navigate('/search');
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed: ' + error.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: `${adults[0]?.firstName || ''} ${adults[0]?.lastName || ''}`.trim(),
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#1e3a8a'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed: ' + error.message);
      setLoading(false);
    }
  };

  if (!pricerData) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          No booking data available. Please go back and try again.
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

  const grossAmount = pricerData.GrossAmount;
  const netAmount = pricerData.NetAmount;
  const adtCount = pricerData.ADT || 0;
  const chdCount = pricerData.CHD || 0;
  const infCount = pricerData.INF || 0;

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <div className="max-w-2xl mx-auto mt-8">
        {/* Contact Information */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-lg">Contact Information</div>
            <button onClick={() => setShowEditContact(true)} className="text-blue-700 hover:underline text-sm flex items-center gap-1">
              Edit
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="material-icons">phone</span> Phone <span className="font-semibold ml-2">{formData.countryCode} {formData.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="material-icons">email</span> Email <span className="ml-2 text-gray-400">{formData.email}</span>
            </div>
          </div>
        </div>

        {/* Traveller Details */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-lg">Traveller Details</div>
            <button className="text-xs bg-yellow-100 text-yellow-800 rounded px-2 py-1">
              {adults.length + children.length + infants.length}/{adtCount + chdCount + infCount} added
            </button>
          </div>

          {/* Adults */}
          {adtCount > 0 && (
            <div className="mb-4">
              <div className="mb-2">Adult <span className="text-xs text-gray-500">[ 12 Yrs+ ]</span></div>
              {adults.map((adult, idx) => (
                <div key={idx} className="mb-2 border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Adult {adult.index}</span>
                    <span className="text-xs text-gray-500">Required</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="border rounded px-2 py-1"
                      value={adult.firstName}
                      onChange={e => {
                        const newAdults = [...adults];
                        newAdults[idx].firstName = e.target.value;
                        setAdults(newAdults);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="border rounded px-2 py-1"
                      value={adult.lastName}
                      onChange={e => {
                        const newAdults = [...adults];
                        newAdults[idx].lastName = e.target.value;
                        setAdults(newAdults);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Children */}
          {chdCount > 0 && (
            <div className="mb-4">
              <div className="mb-2">Child <span className="text-xs text-gray-500">[ 2-11 Yrs ]</span></div>
              {children.map((child, idx) => (
                <div key={idx} className="mb-2 border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Child {child.index}</span>
                    <span className="text-xs text-gray-500">Required</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="border rounded px-2 py-1"
                      value={child.firstName}
                      onChange={e => {
                        const newChildren = [...children];
                        newChildren[idx].firstName = e.target.value;
                        setChildren(newChildren);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="border rounded px-2 py-1"
                      value={child.lastName}
                      onChange={e => {
                        const newChildren = [...children];
                        newChildren[idx].lastName = e.target.value;
                        setChildren(newChildren);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Infants */}
          {infCount > 0 && (
            <div className="mb-4">
              <div className="mb-2">Infant <span className="text-xs text-gray-500">[ 0-1 Yrs ]</span></div>
              {infants.map((infant, idx) => (
                <div key={idx} className="mb-2 border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Infant {infant.index}</span>
                    <span className="text-xs text-gray-500">Required</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="border rounded px-2 py-1"
                      value={infant.firstName}
                      onChange={e => {
                        const newInfants = [...infants];
                        newInfants[idx].firstName = e.target.value;
                        setInfants(newInfants);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="border rounded px-2 py-1"
                      value={infant.lastName}
                      onChange={e => {
                        const newInfants = [...infants];
                        newInfants[idx].lastName = e.target.value;
                        setInfants(newInfants);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Addon Services */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="font-bold mb-4">Addon Services (Optional)</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center border rounded p-4">
              <span className="material-icons text-3xl mb-2">restaurant</span>
              <div className="font-semibold">Meals</div>
              <button className="mt-2 text-blue-700 text-xs underline">ADD</button>
            </div>
            <div className="flex flex-col items-center border rounded p-4">
              <span className="material-icons text-3xl mb-2">luggage</span>
              <div className="font-semibold">Baggage</div>
              <button 
                onClick={() => navigate('/luggage', { state: { pricerData } })} 
                className="mt-2 text-blue-700 text-xs underline"
              >
                ADD
              </button>
            </div>
            <div className="flex flex-col items-center border rounded p-4">
              <span className="material-icons text-3xl mb-2">event_seat</span>
              <div className="font-semibold">Seats</div>
              <button className="mt-2 text-blue-700 text-xs underline">ADD</button>
            </div>
          </div>
        </div>

        {/* Fare Summary */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="font-bold mb-4">Fare Summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Fare ({adtCount} Adult{adtCount > 1 ? 's' : ''})</span>
              <span>₹{pricerData.Trips?.[0]?.Journey?.[0]?.Segments?.[0]?.Fares?.TotalBaseFare?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span>₹{pricerData.Trips?.[0]?.Journey?.[0]?.Segments?.[0]?.Fares?.TotalTax?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Tax</span>
              <span>₹{pricerData.Trips?.[0]?.Journey?.[0]?.Segments?.[0]?.Fares?.TotalServiceTax?.toLocaleString()}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total Amount</span>
              <span>₹{grossAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex items-center justify-between px-8 py-4 z-50">
        <div className="text-lg font-bold">Total Amount<br /><span className="text-2xl text-blue-900">₹ {grossAmount?.toLocaleString()}</span></div>
        <button 
          onClick={startPayment} 
          disabled={loading}
          className={`px-8 py-3 rounded font-bold text-lg transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-900 text-white hover:bg-blue-800'
          }`}
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>

      {/* Edit Contact Modal */}
      {showEditContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Contact Information</h2>
            <select 
              className="border rounded px-3 py-2 w-full mb-3" 
              value={formData.countryCode}
              onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
            >
              <option value="+91">+91 India</option>
              <option value="+971">+971 UAE</option>
              <option value="+966">+966 Saudi Arabia</option>
              <option value="+974">+974 Qatar</option>
              <option value="+1">+1 USA</option>
              <option value="+44">+44 UK</option>
              <option value="+1">+1 Canada</option>
              <option value="+61">+61 Australia</option>
              <option value="+64">+64 New Zealand</option>
            </select>
            <input 
              type="text" 
              placeholder="Phone Number" 
              className="border rounded px-3 py-2 w-full mb-3" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="border rounded px-3 py-2 w-full mb-4" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setShowEditContact(false)} 
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowEditContact(false)} 
                className="flex-1 bg-blue-900 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaxDetails;