// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const hotelLocation=JSON.parse(localStorage.getItem('oneWayReviewData'));

// const mockHotels = [
//   {
//     id: '1',
//     name: 'Grand Palace Hotel',
//     location: hotelLocation?.ToName || 'Mumbai',
//     shortDescription: 'Luxury hotel with pool, spa, and city views.',
//     image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     id: '2',
//     name: 'Seaside Resort',
//     location: hotelLocation?.ToName || 'Mumbai',
//     shortDescription: 'Beachfront resort with private beach and water sports.',
//     image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     id: '3',
//     name: 'Mountain Retreat',
//     location: hotelLocation?.ToName || 'Mumbai',
//     shortDescription: 'Cozy retreat in the mountains with scenic views.',
//     image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     id: '4',
//     name: 'Mountain Retreat',
//     location: hotelLocation?.ToName || 'Mumbai',
//     shortDescription: 'Cozy retreat in the mountains with scenic views.',
//     image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     id: '5',
//     name: 'Mountain Retreat',
//     location: hotelLocation?.ToName || 'Mumbai',
//     shortDescription: 'Cozy retreat in the mountains with scenic views.',
//     image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     id: '6',
//     name: 'Mountain Retreat',
//     location: hotelLocation?.ToName || 'Mumbai',
//     shortDescription: 'Cozy retreat in the mountains with scenic views.',
//     image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
//   },
// ];

// const HotelBooking = () => {
//   const [hotels, setHotels] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setHotels(mockHotels);
//   }, []);

//   const handleBookHotel = (hotel) => {
//     localStorage.setItem("hotel", JSON.stringify(hotel));
//     navigate(`/hotel-details/${hotel.id}`);
//   }

//   return (
//     <div className="max-w-3xl mx-auto py-8">
//       <h1 className="text-2xl font-bold mb-6">Available Hotels</h1>
//       <div className="grid gap-6">
//         {hotels.map(hotel => (
//           <div key={hotel?.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
//             <div className="flex items-center gap-4">
//               <img src={hotel?.image} alt={hotel?.name} className="w-24 h-24 object-cover rounded" />
//               <div>
//                 <h2 className="text-lg font-semibold">{hotel?.name}</h2>
//                 <p className="text-gray-600">{hotel?.location}</p>
//                 <p className="text-sm text-gray-500">{hotel?.shortDescription}</p>
//               </div>
//             </div>
//             <button
//               className="mt-4 md:mt-0 bg-blue-900 text-white px-6 py-2 rounded font-bold hover:bg-blue-800"
//               onClick={() => handleBookHotel(hotel)}
//             >
//               Book
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HotelBooking;