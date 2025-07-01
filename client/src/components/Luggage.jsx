import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const luggageOptions = [
  { weight: 5, price: 5500, icon: 'luggage' },
  { weight: 10, price: 11000, icon: 'luggage' },
  { weight: 15, price: 16500, icon: 'backpack' },
  { weight: 20, price: 22000, icon: 'work' },
  { weight: 30, price: 33000, icon: 'luggage' },
];

const Luggage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState(null);

  // Example: get segment info from location.state if needed
  // const { segment, pax } = location.state || {};

  const total = selected !== null ? luggageOptions[selected].price : 0;

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center gap-4 mb-4">
          <button className="bg-blue-800 text-white px-4 py-1 rounded-full font-semibold">BOM - AUH</button>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Adult 1</span>
        </div>
        <div className="bg-white rounded shadow p-4">
          {luggageOptions.map((opt, idx) => (
            <div key={idx} className={`flex items-center justify-between border rounded mb-3 p-4 ${selected === idx ? 'border-blue-800 bg-blue-50' : ''}`}>
              <div className="flex items-center gap-4">
                <span className="material-icons text-3xl text-yellow-600">{opt.icon}</span>
                <div>
                  <div className="font-semibold text-lg">{opt.weight} kgs</div>
                  <div className="text-gray-500">₹ {opt.price.toLocaleString()}</div>
                </div>
              </div>
              <button
                className={`border px-4 py-1 rounded ${selected === idx ? 'bg-blue-800 text-white border-blue-800' : 'text-blue-800 border-blue-800'}`}
                onClick={() => setSelected(idx)}
              >
                {selected === idx ? 'Selected' : 'ADD'}
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex items-center justify-between px-8 py-4 z-50">
        <div>
          <div className="text-xs text-gray-500 mb-1">{selected === null ? 'Not Selected' : 'Added to fare'}</div>
          <div className="text-lg font-bold">Total Amount<br /><span className="text-2xl text-blue-900">₹ {total.toLocaleString()}</span></div>
        </div>
        <div className="flex gap-4">
          <button
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded font-bold text-lg hover:bg-gray-300"
            onClick={() => navigate(-1)}
          >Skip</button>
          <button
            className="bg-blue-900 text-white px-8 py-3 rounded font-bold text-lg hover:bg-blue-800"
            onClick={() => navigate(-1)}
          >Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Luggage;