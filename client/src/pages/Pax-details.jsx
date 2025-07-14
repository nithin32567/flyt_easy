import React, { useState } from 'react';
import PassengerAddModal from '../components/PassengerAddModal';
import { useNavigate } from 'react-router-dom';

const PaxDetails = () => {
  // --- State Definitions (do not remove) ---
  const oneWayReviewData = JSON.parse(localStorage.getItem('oneWayReviewData'));
  console.log(oneWayReviewData, '================================= oneWayReviewData');

  const navigate = useNavigate();
  const [ContactInfo, setContactInfo] = useState({
    Title: '',
    FName: '',
    LName: '',
    Mobile: '',
    Phone: '',
    Email: '',
    Address: '',
    State: '',
    City: '',
    PIN: '',
    GSTCompanyName: '',
    GSTTIN: '',
    GSTMobile: '',
    GSTEmail: '',
    UpdatedProfile: false,
    IsGuest: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [Travellers, setTravellers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
  // --- End State Definitions ---

  const initiateRazorpayPayment = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/razorpay/bookFlight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: oneWayReviewData.NetAmount,
          currency: "INR",
          receipt: `flight_${Date.now()}`,
          notes: {
            customerName: `${ContactInfo.FName} ${ContactInfo.LName}`,
          },
        }),
      });
  
      const data = await response.json();
      if (!data.success) throw new Error("Failed to initiate payment");
  
      launchRazorpay(data.order);
    } catch (err) {
      console.error("Error initiating Razorpay:", err);
      alert("Payment initiation failed.");
    }
  };
  
  const launchRazorpay = (order) => {
    const options = {
      key: "rzp_test_9Hi6wVlmuLeJ77",
      amount: order.amount,
      currency: order.currency,
      name: "Flyteasy Booking",
      description: "Flight Payment",
      image: "/your_logo.png",
      order_id: order.id,
      handler: async function (response) {
          const verifyResponse = await fetch(`${baseUrl}/api/razorpay/verifyPayment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
  
        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          navigate("/payment-success", {
            state: { paymentData: verifyData }
          });
        } else {
          navigate("/payment-failed");
        }
      },
      prefill: {
        name: `${ContactInfo.FName} ${ContactInfo.LName}`,
        email: ContactInfo.Email,
        contact: ContactInfo.Mobile,
      },
      theme: { color: "#4B9CD3" },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  const createItineraryAndPayment = async (e) => {
    e.preventDefault();
  
    // // Basic field validation
    // if (!ContactInfo.FName || !ContactInfo.LName || !ContactInfo.Mobile || !ContactInfo.Email) {
    //   alert('Please fill in all required fields (First Name, Last Name, Mobile, Email)');
    //   return;
    // }
  
    // if (Travellers.length === 0) {
    //   alert('Please add at least one traveller');
    //   return;
    // }
  
    // setIsProcessing(true);
  
    try {
      // Trigger Razorpay immediately
      initiateRazorpayPayment();
  
      // // Fire itinerary creation in the background (non-blocking)
      // const itineraryData = {
      //   TUI: oneWayReviewData.TUI,
      //   ContactInfo,
      //   Travellers,
      //   NetAmount: oneWayReviewData.NetAmount || 0,
      //   SSRAmount: 0,
      //   CrossSellAmount: 0,
      //   CrossSell: [],
      //   PLP: [],
      //   SSR: [],
      //   ClientID: localStorage.getItem('clientId') || '',
      //   DeviceID: '',
      //   AppVersion: '',
      // };
  
      // fetch(`http://localhost:3000/api/create-itinerary`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `${localStorage.getItem('token')}`,
      //   },
      //   body: JSON.stringify(itineraryData),
      // })
      //   .then(res => res.json())
      //   .then(data => {
      //     console.log("Itinerary background created:", data);
      //     // Optionally store or notify here
      //   })
      //   .catch(err => {
      //     console.error("Itinerary background creation failed:", err);
      //     // Optional: Retry logic or queueing
      //   });
  

    } catch (error) {
      console.error('Payment flow error:', error);
      navigate('/payment-error', {
        state: {
          errorData: {
            message: error.message || 'Unexpected payment flow error.',
            type: 'payment_flow_error'
          }
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };
  


  // --- Form Handler ---
  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(ContactInfo, '================================= contactData');
    console.log(Travellers, '================================= travellerData');
    localStorage.setItem('contactInfo', JSON.stringify(ContactInfo));
    localStorage.setItem('travellers', JSON.stringify(Travellers));
  };


  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow p-8 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Contact Information</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Title</label>
            <select
              name="Title"
              value={ContactInfo.Title}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Mrs">Mrs</option>
              <option value="Dr">Dr</option>
            </select>
          </div>
          {/* First Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="FName"
              value={ContactInfo.FName}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="First Name"
            />
          </div>
          {/* Last Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="LName"
              value={ContactInfo.LName}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Last Name"
            />
          </div>
          {/* Mobile */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Mobile</label>
            <input
              type="tel"
              name="Mobile"
              value={ContactInfo.Mobile}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Mobile Number"
            />
          </div>
          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="Phone"
              value={ContactInfo.Phone}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Phone Number"
            />
          </div>
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="Email"
              value={ContactInfo.Email}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email Address"
            />
          </div>
          {/* Address */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="Address"
              value={ContactInfo.Address}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Address"
            />
          </div>
          {/* State */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">State</label>
            <input
              type="text"
              name="State"
              value={ContactInfo.State}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="State"
            />
          </div>
          {/* City */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">City</label>
            <input
              type="text"
              name="City"
              value={ContactInfo.City}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="City"
            />
          </div>
          {/* PIN */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">PIN</label>
            <input
              type="text"
              name="PIN"
              value={ContactInfo.PIN}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="PIN Code"
            />
          </div>
          {/* GST Company Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">GST Company Name</label>
            <input
              type="text"
              name="GSTCompanyName"
              value={ContactInfo.GSTCompanyName}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="GST Company Name"
            />
          </div>
          {/* GST TIN */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">GST TIN</label>
            <input
              type="text"
              name="GSTTIN"
              value={ContactInfo.GSTTIN}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="GST TIN"
            />
          </div>
          {/* GST Mobile */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">GST Mobile</label>
            <input
              type="tel"
              name="GSTMobile"
              value={ContactInfo.GSTMobile}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="GST Mobile"
            />
          </div>
          {/* GST Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">GST Email</label>
            <input
              type="email"
              name="GSTEmail"
              value={ContactInfo.GSTEmail}
              onChange={handleContactChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="GST Email"
            />
          </div>
          {/* Updated Profile */}

        </form>
        <input onClick={handleSubmit} className='bg-black text-white px-4 py-2 rounded-md mt-4 w-full' type="submit" value="Submit" />

        <div className='flex flex-col gap-4 mt-8 justify-center items-center w-full mx-auto'>
          <h1 className='text-2xl font-bold'>Traveller Data</h1>
          <div className='flex flex-col gap-4 border border-gray-300 rounded-md p-4 w-full'>
            {Travellers.map((traveller) => (
              <ol key={traveller.ID}>
                <li>
                  <h1>{traveller.Title} {traveller.FName} {traveller.LName}</h1>
                  <p>{traveller.Age}</p>
                  <p>{traveller.DOB}</p>
                  <p>{traveller.Gender}</p>
                  <p>{traveller.PTC}</p>
                  <p>{traveller.Nationality}</p>
                  <p>{traveller.PassportNo}</p>
                  <p>{traveller.PLI}</p>
                  <p>{traveller.PDOE}</p>
                </li>
              </ol>
            ))}
            <button onClick={() => setShowModal(true)} className='bg-black text-white px-4 py-2 rounded-md mt-4 w-full'>Add Traveller</button>

          </div>
        </div>
      </div>
      {/* add passenger details */}
      {/* traveller data */}


      {showModal && <PassengerAddModal setShowModal={setShowModal} travellerData={Travellers} setTravellerData={setTravellers} setTravellers={setTravellers} />}

      <footer className='fixed bottom-0 left-0 right-0 bg-white p-4'>
        <div className='flex justify-between items-center'>
          <h1 className='bg-[#d0d0d0] p-4 rounded-md w-[300px] text-center'>Total Amount: {oneWayReviewData.NetAmount}</h1>
          <button
            onClick={createItineraryAndPayment}
            disabled={isProcessing}
            className={`px-4 py-4 rounded-md mt-4 w-[300px] p-4 ${isProcessing
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            {isProcessing ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </footer >

    </div >
  );
};

export default PaxDetails;