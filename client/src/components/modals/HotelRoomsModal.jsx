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
  const [childAges, setChildAges] = useState(initial.childAges || []);

  useEffect(() => {
    setRooms(initial.rooms || 1);
    setAdults(initial.adults || 1);
    setChildren(initial.children || 0);
    setChildAges(initial.childAges || []);
  }, [isOpen, initial]);

  // Update childAges when children count changes
  useEffect(() => {
    if (children === 0) {
      setChildAges([]);
    } else if (children > childAges.length) {
      // Add new child ages (default to 5 years old)
      const newAges = [...childAges];
      for (let i = childAges.length; i < children; i++) {
        newAges.push(5);
      }
      setChildAges(newAges);
    } else if (children < childAges.length) {
      // Remove excess child ages
      setChildAges(childAges.slice(0, children));
    }
  }, [children, childAges.length]);

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  // Validate child ages
  const validateChildAges = () => {
    return childAges.every(age => age >= 0 && age <= 17);
  };

  // Format childAges as comma-separated string for API
  const formatChildAges = () => {
    return childAges.join(',');
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
            
            {/* Child Ages Section */}
            {children > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Child Ages
                </div>
                <div className="space-y-2">
                  {childAges.map((age, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Child {index + 1} Age
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newAges = [...childAges];
                            newAges[index] = Math.max(0, age - 1);
                            setChildAges(newAges);
                          }}
                          className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{age}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newAges = [...childAges];
                            newAges[index] = Math.min(17, age + 1);
                            setChildAges(newAges);
                          }}
                          className="rounded-full px-2 w-6 h-6 flex items-center justify-center border border-slate-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Ages 0-17 years
                </div>
              </div>
            )}
          </div>
          <button
            className="w-full bg-[#f48f22] hover:bg-[#16437c] text-white py-2 rounded font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (children > 0 && !validateChildAges()) {
                alert('Please ensure all child ages are between 0-17 years');
                return;
              }
              
              onApply({ 
                rooms, 
                adults, 
                children, 
                childAges: children > 0 ? childAges : [],
                childAgesFormatted: children > 0 ? formatChildAges() : ''
              });
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
