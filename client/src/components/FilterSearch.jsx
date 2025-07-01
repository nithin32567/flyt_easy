import React, { useState, useEffect } from 'react';

const priceRanges = [
  { label: '₹5000 - 10000', min: 5000, max: 10000 },
  { label: '₹10000 - 20000', min: 10000, max: 20000 },
  { label: '₹20000 - 30000', min: 20000, max: 30000 },
  { label: 'Above ₹30000', min: 30000, max: Infinity },
];
const timeRanges = [
  { label: 'Early Morning (12 am - 05 am)', start: 0, end: 5 },
  { label: 'Morning (05 am - 12 pm)', start: 5, end: 12 },
  { label: 'Afternoon (12 pm - 06 pm)', start: 12, end: 18 },
  { label: 'Evening (06 pm - 12 am)', start: 18, end: 24 },
];
const stopOptions = [
  { label: 'Non Stop', value: 0 },
  { label: '1 Stop', value: 1 },
  { label: '2 Stops', value: 2 },
];

const FilterSearch = ({ airlines, onFilterChange }) => {
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  useEffect(() => {
    onFilterChange({
      price: selectedPrice,
      times: selectedTimes,
      stops: selectedStops,
      airlines: selectedAirlines,
    });
  }, [selectedPrice, selectedTimes, selectedStops, selectedAirlines, onFilterChange]);

  return (
    <aside className="w-72 bg-white shadow-lg p-6 h-full fixed right-0 top-0 z-40 overflow-y-auto">
      <h2 className="font-bold text-lg mb-4">Filter Your Search</h2>
      <div className="mb-6">
        <div className="font-semibold mb-2">PRICE</div>
        {priceRanges.map((range, idx) => (
          <label key={idx} className="block mb-1">
            <input
              type="radio"
              name="price"
              checked={selectedPrice === idx}
              onChange={() => setSelectedPrice(idx)}
              className="mr-2"
            />
            {range.label}
          </label>
        ))}
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">TIME</div>
        {timeRanges.map((range, idx) => (
          <label key={idx} className="block mb-1">
            <input
              type="checkbox"
              checked={selectedTimes.includes(idx)}
              onChange={() => setSelectedTimes(selectedTimes.includes(idx) ? selectedTimes.filter(i => i !== idx) : [...selectedTimes, idx])}
              className="mr-2"
            />
            {range.label}
          </label>
        ))}
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">STOP</div>
        {stopOptions.map((stop, idx) => (
          <label key={idx} className="block mb-1">
            <input
              type="checkbox"
              checked={selectedStops.includes(stop.value)}
              onChange={() => setSelectedStops(selectedStops.includes(stop.value) ? selectedStops.filter(i => i !== stop.value) : [...selectedStops, stop.value])}
              className="mr-2"
            />
            {stop.label}
          </label>
        ))}
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">AIRLINES</div>
        {airlines.map((air, idx) => (
          <label key={idx} className="flex items-center mb-1 gap-2">
            <input
              type="checkbox"
              checked={selectedAirlines.includes(air)}
              onChange={() => setSelectedAirlines(selectedAirlines.includes(air) ? selectedAirlines.filter(a => a !== air) : [...selectedAirlines, air])}
              className="mr-2"
            />
            <span>{air}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-2 mt-6">
        <button className="flex-1 border rounded py-2" onClick={() => {
          setSelectedPrice(null);
          setSelectedTimes([]);
          setSelectedStops([]);
          setSelectedAirlines([]);
        }}>Reset All</button>
        <button className="flex-1 bg-blue-800 text-white rounded py-2" onClick={() => onFilterChange({
          price: selectedPrice,
          times: selectedTimes,
          stops: selectedStops,
          airlines: selectedAirlines,
        })}>Apply</button>
      </div>
    </aside>
  );
};

export default FilterSearch;