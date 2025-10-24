import { useState } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function HotelPriceModal({
  isOpen,
  setIsOpen,
  onApply,
  initial,
}) {
  const [minPrice, setMinPrice] = useState(initial.min || 0);
  const [maxPrice, setMaxPrice] = useState(initial.max || 1500);

  useEffect(() => {
    setMinPrice(initial.min || 0);
    setMaxPrice(initial.max || 1500);
  }, [isOpen, initial]);

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg border max-w-sm w-full mx-4">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-base">PRICE RANGE</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm">Min Price (₹)</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                className="border border-gray-300 rounded px-2 py-1 w-20 text-center"
                min="0"
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Max Price (₹)</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value) || 1500)}
                className="border border-gray-300 rounded px-2 py-1 w-20 text-center"
                min="0"
              />
            </div>
            <div className="text-xs text-gray-500 mb-4">
              Price range: ₹{minPrice} - ₹{maxPrice}
            </div>
          </div>
          <button
            className="w-full bg-[#f48f22] hover:bg-[#16437c] text-white py-2 rounded font-semibold transition-colors cursor-pointer"
            onClick={() => {
              onApply({ priceRange: { min: minPrice, max: maxPrice } });
              setIsOpen(false);
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
