import { useState } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function HotelRoomsModal({
  isOpen,
  setIsOpen,
  onApply,
  initial,
}) {
  const [rooms, setRooms] = useState(initial.rooms || 1);
  const [adults, setAdults] = useState(initial.adults || 1);
  const [children, setChildren] = useState(initial.children || 0);

  useEffect(() => {
    setRooms(initial.rooms || 1);
    setAdults(initial.adults || 1);
    setChildren(initial.children || 0);
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
            <span className="font-semibold text-base">ROOMS & GUESTS</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm">Rooms</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                  className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                >
                  -
                </button>
                <span className="w-4 text-center">{rooms}</span>
                <button
                  type="button"
                  onClick={() => setRooms(Math.min(4, rooms + 1))}
                  className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                >
                  +
                </button>
              </div>
            </div>
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
            <div className="flex justify-between items-center mb-4">
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
          </div>
          <button
            className="w-full bg-[#f48f22] hover:bg-[#16437c] text-white py-2 rounded font-semibold transition-colors cursor-pointer"
            onClick={() => {
              onApply({ rooms, adults, children });
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
