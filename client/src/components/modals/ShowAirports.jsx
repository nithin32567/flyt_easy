import React from "react";
import { useState } from "react";
import { X } from "lucide-react";

const ShowAirports = ({ isOpen, setIsOpen, airports, label, onSelect }) => {
  const [search, setSearch] = useState("");
  const filtered = airports.filter(
    (a) =>
      a.CityName.toLowerCase().includes(search.toLowerCase()) ||
      a.Name.toLowerCase().includes(search.toLowerCase()) ||
      a.Code.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(a) {
    onSelect(a);
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed airport-modal inset-0 h-[400px]  w-[400px] rounded-2xl top-0 left-0 bg-black/50  flex items-center justify-center  mx-auto">
      <div className="bg-white h-full p-4 shadow-lg w-full rounded-2xl max-w-full  relative">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">{label}</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Enter city or airport"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="text-xs text-green-700 mb-2">Important airports</div>
        <div className="max-h-60 overflow-y-auto">
          {filtered.map((a) => (
            <div
              key={a.Code}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => handleSelect(a)}
            >
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold w-12 text-center">
                {a.Code}
              </span>
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

export default ShowAirports;
