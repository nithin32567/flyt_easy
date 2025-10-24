import { useState } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function TravellerAddModal({
  isOpen,
  setIsOpen,
  onApply,
  initial,
}) {
  const [adults, setAdults] = useState(initial.adults || 1);
  const [children, setChildren] = useState(initial.children || 0);
  const [infants, setInfants] = useState(initial.infants || 0);
  const [travelClass, setTravelClass] = useState(
    initial.travelClass || "Economy"
  );

  useEffect(() => {
    setAdults(initial.adults || 1);
    setChildren(initial.children || 0);
    setInfants(initial.infants || 0);
    setTravelClass(initial.travelClass || "Economy");
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
            <span className="font-semibold text-base">TRAVELLERS & CLASS</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm">Adults</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                >
                  -
                </button>
                <span className="w-4 text-center">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm">Children</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                >
                  -
                </button>
                <span className="w-4 text-center">{children}</span>
                <button
                  type="button"
                  onClick={() => setChildren(children + 1)}
                  className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Infants</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInfants(Math.max(0, infants - 1))}
                  className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                >
                  -
                </button>
                <span className="w-4 text-center">{infants}</span>
                <button
                  type="button"
                  onClick={() => setInfants(infants + 1)}
                  className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  className={`px-2 py-1 rounded text-xs ${
                    travelClass === cls
                      ? "bg-[#f48f22] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-[#f48f22] hover:text-white"
                  }`}
                  onClick={() => setTravelClass(cls)}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
          <button
            className="w-full bg-[#f48f22] hover:bg-[#16437c] text-white py-2 rounded font-semibold transition-colors cursor-pointer"
            onClick={() => {
              onApply({ adults, children, infants, travelClass });
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
