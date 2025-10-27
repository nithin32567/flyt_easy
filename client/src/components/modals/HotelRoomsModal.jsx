import { useState } from "react";
import { useEffect } from "react";
import { X, AlertTriangle, Plus, Minus, Users } from "lucide-react";

export default function HotelRoomsModal({
  isOpen,
  setIsOpen,
  onApply,
  initial,
}) {
  const [roomData, setRoomData] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      initializeRoomData();
    }
  }, [isOpen, initial]);

  const initializeRoomData = () => {
    const rooms = initial.rooms || 1;
    const adults = initial.adults || 1;
    const children = initial.children || 0;
    const childAges = initial.childAges || [];
    
    const newRoomData = [];
    
    for (let i = 0; i < rooms; i++) {
      const roomAdults = Math.ceil(adults / rooms);
      const roomChildren = Math.ceil(children / rooms);
      const roomChildAges = childAges.slice(i * roomChildren, (i + 1) * roomChildren);
      
      newRoomData.push({
        id: i,
        adults: Math.max(1, roomAdults),
        children: roomChildren,
        childAges: roomChildAges.length > 0 ? roomChildAges : Array(roomChildren).fill(5)
      });
    }
    
    setRoomData(newRoomData);
  };

  // Add new room
  const addRoom = () => {
    if (roomData.length >= 4) return;
    
    const newRoom = {
      id: roomData.length,
      adults: 1, // Mandatory 1 adult
      children: 0,
      childAges: []
    };
    
    setRoomData([...roomData, newRoom]);
  };

  // Remove room
  const removeRoom = (roomId) => {
    if (roomData.length <= 1) return;
    
    setRoomData(roomData.filter(room => room.id !== roomId));
  };

  // Update adults in a room
  const updateRoomAdults = (roomId, newAdults) => {
    const updatedRooms = roomData.map(room => 
      room.id === roomId 
        ? { ...room, adults: Math.max(1, newAdults) } // Minimum 1 adult
        : room
    );
    setRoomData(updatedRooms);
  };

  // Update children in a room
  const updateRoomChildren = (roomId, newChildren) => {
    const updatedRooms = roomData.map(room => {
      if (room.id === roomId) {
        const children = Math.max(0, Math.min(3, newChildren));
        const childAges = children > 0 
          ? Array(children).fill(5) // Default age 5
          : [];
        
        return { ...room, children, childAges };
      }
      return room;
    });
    setRoomData(updatedRooms);
  };

  // Update child age
  const updateChildAge = (roomId, childIndex, age) => {
    const updatedRooms = roomData.map(room => {
      if (room.id === roomId) {
        const newChildAges = [...room.childAges];
        newChildAges[childIndex] = parseInt(age);
        return { ...room, childAges: newChildAges };
      }
      return room;
    });
    setRoomData(updatedRooms);
  };

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  // Validate all room data
  const validateAllRooms = () => {
    return roomData.every(room => 
      room.adults >= 1 && 
      room.childAges.every(age => age >= 1 && age <= 12)
    );
  };

  // Calculate totals and return room-specific data
  const getTotals = () => {
    const totalAdults = roomData.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = roomData.reduce((sum, room) => sum + room.children, 0);
    const allChildAges = roomData.flatMap(room => room.childAges);
    
    const totals = {
      rooms: roomData.length,
      adults: totalAdults,
      children: totalChildren,
      childAges: allChildAges,
      childAgesFormatted: allChildAges.join(','),
      // Return room-specific data for proper payload generation
      roomData: roomData.map(room => ({
        adults: room.adults,
        children: room.children,
        childAges: room.childAges
      }))
    };

    // Store room data with child ages in localStorage for use in booking
    localStorage.setItem('hotelRoomData', JSON.stringify({
      roomData: roomData,
      totals: totals
    }));

    return totals;
  };

  if (!isOpen) return null;
  
  const totals = getTotals();
  
  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg border max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">ROOMS & GUESTS</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl cursor-pointer hover:bg-gray-100 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Room Cards - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {roomData.map((room, index) => (
                <div key={room.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-800 flex items-center">
                      <Users className="w-4 h-4 mr-1 text-[#f48f22]" />
                      Room {index + 1}
                    </h3>
                    {roomData.length > 1 && (
                      <button
                        onClick={() => removeRoom(room.id)}
                        className="text-red-500 hover:bg-red-50 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Adults & Children in one row */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    {/* Adults */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Adults *</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateRoomAdults(room.id, room.adults - 1)}
                            className="rounded-full px-1.5 w-5 h-5 flex items-center justify-center border border-slate-200 hover:bg-gray-50"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{room.adults}</span>
                          <button
                            type="button"
                            onClick={() => updateRoomAdults(room.id, room.adults + 1)}
                            className="rounded-full px-1.5 w-5 h-5 flex items-center justify-center border border-slate-200 hover:bg-gray-50"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Children */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Children</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateRoomChildren(room.id, room.children - 1)}
                            className="rounded-full px-1.5 w-5 h-5 flex items-center justify-center border border-slate-200 hover:bg-gray-50"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{room.children}</span>
                          <button
                            type="button"
                            onClick={() => updateRoomChildren(room.id, room.children + 1)}
                            className="rounded-full px-1.5 w-5 h-5 flex items-center justify-center border border-slate-200 hover:bg-gray-50"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Child Ages - Compact */}
                  {room.children > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-700">Child Ages</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {room.childAges.map((age, childIndex) => (
                          <div key={childIndex} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              Child {childIndex + 1}
                            </span>
                            <select
                              value={age}
                              onChange={(e) => updateChildAge(room.id, childIndex, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#f48f22] w-16"
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(age => (
                                <option key={age} value={age}>{age}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Room Button - Compact */}
            {roomData.length < 4 && (
              <button
                onClick={addRoom}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-600 hover:border-[#f48f22] hover:text-[#f48f22] transition-colors mb-4"
              >
                <div className="flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Room
                </div>
              </button>
            )}

            {/* Summary - Compact */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="text-sm text-blue-800">
                <span className="font-medium">{totals.rooms} Room{totals.rooms > 1 ? 's' : ''}</span> • 
                <span className="font-medium"> {totals.adults} Adult{totals.adults > 1 ? 's' : ''}</span> • 
                <span className="font-medium"> {totals.children} Child{totals.children > 1 ? 'ren' : ''}</span>
              </div>
            </div>

            {/* Warning Message */}
            {showWarning && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  Each room must have at least 1 adult. Please add more adults or reduce the number of rooms.
                </p>
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              className="w-full bg-[#f48f22] hover:bg-[#16437c] text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                if (!validateAllRooms()) {
                  alert('Please ensure all rooms have at least 1 adult and all child ages are between 1-12 years.');
                  return;
                }
                
                onApply(totals);
                setIsOpen(false);
              }}
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
