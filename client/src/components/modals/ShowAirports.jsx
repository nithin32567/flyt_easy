import React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
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

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
      onClick={handleBackdropClick}
    >
      <div 
        className="relative bg-white rounded-lg border max-w-sm w-full mx-4"
        onClick={handleModalContentClick}
        style={{ zIndex: 999999 }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-base">{label}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <input
            className="w-full border rounded px-3 py-2 mb-3 text-sm"
            placeholder="Enter city or airport"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={handleInputClick}
            onFocus={handleInputClick}
          />
          <div className="text-xs text-green-700 mb-2">Important airports</div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((a) => (
              <div
                key={a.Code}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => handleSelect(a)}
              >
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold w-12 text-center flex-shrink-0">
                  {a.Code}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{a.CityName}</div>
                  <div className="text-xs text-gray-500 truncate">{a.Name}</div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">{a.Country}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return isOpen ? createPortal(modalContent, document.body) : null;
};

export default ShowAirports;
