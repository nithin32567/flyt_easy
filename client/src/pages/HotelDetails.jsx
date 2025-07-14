import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const hotelLocation=JSON.parse(localStorage.getItem('oneWayReviewData'));
const oneWayReviewData=JSON.parse(localStorage.getItem('oneWayReviewData'));
console.log(oneWayReviewData);

const mockHotelDetails = {
  '1': {
    id: '1',
    name: 'Grand Palace Hotel',
    location: hotelLocation?.ToName,
    description: 'A luxury hotel in the heart of Mumbai with world-class amenities.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    facilities: ['Pool', 'Spa', 'Free WiFi', 'Gym', 'Restaurant', 'Bar'],
    rooms: [
      { type: 'Deluxe Room', price: 6000, features: ['King Bed', 'City View', 'Breakfast Included'] },
      { type: 'Suite', price: 12000, features: ['2 King Beds', 'Living Area', 'Sea View', 'Breakfast Included'] },
    ],
  },
  '2': {
    id: '2',
    name: 'Seaside Resort',
    location: hotelLocation?.ToName,
    description: 'Beachfront resort with private beach, water sports, and more.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    facilities: ['Private Beach', 'Water Sports', 'Free Breakfast', 'Pool', 'Bar'],
    rooms: [
      { type: 'Standard Room', price: 4000, features: ['Queen Bed', 'Garden View', 'Breakfast Included'] },
      { type: 'Beach Villa', price: 9000, features: ['King Bed', 'Beachfront', 'Private Pool', 'Breakfast Included'] },
    ],
  },
  '3': {
    id: '3',
    name: 'Mountain Retreat',
    location: hotelLocation?.ToName,
    description: 'Cozy retreat in the mountains with breathtaking views.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    facilities: ['Mountain View', 'Bonfire', 'Free WiFi', 'Restaurant'],
    rooms: [
      { type: 'Cottage', price: 5000, features: ['Fireplace', 'Mountain View', 'Breakfast Included'] },
      { type: 'Family Suite', price: 8000, features: ['2 Bedrooms', 'Living Area', 'Mountain View', 'Breakfast Included'] },
    ],
  },
  '4': {
    id: '4',
    name: 'Mountain Retreat',
    location: hotelLocation?.FromName,
    description: 'Cozy retreat in the mountains with breathtaking views.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    facilities: ['Mountain View', 'Bonfire', 'Free WiFi', 'Restaurant'],
    rooms: [
      { type: 'Cottage', price: 5000, features: ['Fireplace', 'Mountain View', 'Breakfast Included'] },
      { type: 'Family Suite', price: 8000, features: ['2 Bedrooms', 'Living Area', 'Mountain View', 'Breakfast Included'] },
    ],
  },
};

const HotelDetails = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

  localStorage.setItem("selectedRoom", JSON.stringify(selectedRoom));

  const initiateRazorpayPayment = async (
    amount,
    currency,
    receipt,
    notes,
  ) => {
    console.log(amount, currency, receipt, notes);
    try {
      const response = await fetch(`${baseUrl}/api/razorpay/hotelBooking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt,
          notes,
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
    console.log(order);
    const options = {
      key: "rzp_test_9Hi6wVlmuLeJ77",
      amount: order.amount,
      currency: order.currency,
      name: "Flyteasy Booking",
      description: "Hotel Payment",
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
          navigate("/hotel-payment-success", {
            state: { paymentData: verifyData }
          });
        } else {
          navigate("/hotel-payment-failed");
        }
      },
      prefill: {
        name: `${oneWayReviewData?.ContactInfo?.FName} ${oneWayReviewData?.ContactInfo?.LName || 'John Doe'}`,
        email: oneWayReviewData?.ContactInfo?.Email || 'john.doe@example.com',
        contact: oneWayReviewData?.ContactInfo?.Mobile || '1234567890',
      },
      theme: { color: "#4B9CD3" },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();487
  };


  useEffect(() => {
    setHotel(mockHotelDetails[hotelId] || null);
  }, [hotelId]);

  const handleBookAndPay = () => {
    if (!selectedRoom) {
      alert('Please select a room type.');
      return;
    }
    setIsPaying(true);
    initiateRazorpayPayment(selectedRoom.price, "INR", `hotel_${Date.now()}`, {
      customerName: `${oneWayReviewData?.ContactInfo?.FName} ${oneWayReviewData?.ContactInfo?.LName || 'John Doe'}`,
    });  
    // Simulate Razorpay payment
    // setTimeout(() => {
    //   setIsPaying(false);
    //   navigate('/hotel-payment-success');
    // }, 1500);
  
  };

  if (!hotel) {
    return <div className="text-center py-16 text-gray-500">Hotel not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <img src={hotel.image} alt={hotel.name} className="w-full h-56 object-cover rounded mb-6" />
      <h1 className="text-2xl font-bold mb-2">{hotel.name}</h1>
      <p className="text-gray-600 mb-2">{hotel.location}</p>
      <p className="mb-4">{hotel.description}</p>
      <div className="mb-4">
        <h2 className="font-semibold mb-1">Facilities:</h2>
        <ul className="flex flex-wrap gap-2">
          {hotel.facilities.map(fac => (
            <li key={fac} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">{fac}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Rooms:</h2>
        <div className="grid gap-4">
          {hotel.rooms.map(room => (
            <div key={room.type} className={`border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between ${selectedRoom?.type === room.type ? 'border-blue-700' : 'border-gray-200'}`}>
              <div>
                <div className="font-medium">{room.type}</div>
                <div className="text-gray-500 text-sm mb-1">{room.features.join(', ')}</div>
                <div className="text-blue-900 font-bold text-lg">₹{room.price.toLocaleString()}</div>
              </div>
              <button
                className={`mt-2 md:mt-0 px-6 py-2 rounded font-bold ${selectedRoom?.type === room.type ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                onClick={() => setSelectedRoom(room)}
              >
                {selectedRoom?.type === room.type ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        className="w-full bg-blue-900 text-white py-3 rounded font-bold text-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleBookAndPay}
        disabled={isPaying}
      >
        {isPaying ? 'Processing Payment...' : 'Book & Pay'}
      </button>
    </div>
  );
};

export default HotelDetails; 