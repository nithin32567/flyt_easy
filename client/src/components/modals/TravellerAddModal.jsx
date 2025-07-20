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

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 ">
      <div className="bg-white rounded shadow-lg w-96 max-w-full p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">TRAVELLERS & CLASS</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span>Adults</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="rounded-full px-2 w-6 h-6 flex items-center justify-center shadow-md border-slate-200"
              >
                -
              </button>
              <span>{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(adults + 1)}
                className="rounded-full px-2 w-6 h-6 flex items-center justify-center shadow-md border-slate-200"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Children</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="rounded-full px-2 w-6 h-6 flex items-center justify-center shadow-md border-slate-200"
              >
                -
              </button>
              <span>{children}</span>
              <button
                type="button"
                onClick={() => setChildren(children + 1)}
                className="rounded-full px-2 w-6 h-6 flex items-center justify-center shadow-md border-slate-200"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Infants</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInfants(Math.max(0, infants - 1))}
                className="rounded-full px-2 w-6 h-6 flex items-center justify-center shadow-md border-slate-200"
              >
                -
              </button>
              <span>{infants}</span>
              <button
                type="button"
                onClick={() => setInfants(infants + 1)}
                className="rounded-full px-2 w-6 h-6 flex items-center justify-center shadow-md border-slate-200"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            {["Economy", "Premium Economy", "Business"].map((cls) => (
              <button
                key={cls}
                type="button"
                className={`px-3 py-1 rounded ${
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
          className="w-full bg-[#f48f22] hover:bg-[#16437c] text-white py-2 rounded font-semibold h transition-colors cursor-pointer"
          onClick={() => {
            onApply({ adults, children, infants, travelClass });
            setIsOpen(false);
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
