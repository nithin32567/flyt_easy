import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function GuestDetailsModal({
  isOpen,
  setIsOpen,
  onApply,
  initial = {},
  roomCount = 1,
  adults = 1,
  children = 0,
  roomData = null // New prop for room-specific data
}) {
  const [guests, setGuests] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      initializeGuests();
      setErrors({});
    }
  }, [isOpen, roomCount, adults, children]);


  const initializeGuests = () => {
    const newGuests = [];
    let guestIndex = 0;

    // Use roomData if available, otherwise fall back to old logic
    if (roomData && roomData.length > 0) {
      // Use room-specific data from HotelRoomsModal
      for (let roomIndex = 0; roomIndex < roomData.length; roomIndex++) {
        const room = roomData[roomIndex];
        const roomGuests = [];
        
        // Add adults to this room
        for (let i = 0; i < room.adults; i++) {
          roomGuests.push({
            guestId: `guest_${guestIndex}`,
            operation: 'I', // New guests should be 'I' (Insert)
            title: 'Mr',
            firstName: '',
            middleName: '',
            lastName: '',
            mobileNo: '',
            paxType: 'A',
            age: '',
            dateOfBirth: '',
            email: '',
            pan: '',
            profileType: 'T',
            employeeId: '',
            corporateCompanyId: '',
            roomIndex,
            guestIndex: guestIndex++
          });
        }

        // Add children to this room
        for (let i = 0; i < room.children; i++) {
          roomGuests.push({
            guestId: `guest_${guestIndex}`,
            operation: 'I', // New guests should be 'I' (Insert)
            title: 'Master',
            firstName: '',
            middleName: '',
            lastName: '',
            mobileNo: '',
            paxType: 'C',
            age: room.childAges[i] || 5, // Use the age from roomData
            dateOfBirth: '',
            email: '',
            pan: '',
            profileType: 'T',
            employeeId: '',
            corporateCompanyId: '',
            roomIndex,
            guestIndex: guestIndex++
          });
        }

        newGuests.push({
          roomId: `room_${roomIndex}`,
          roomIndex,
          guests: roomGuests
        });
      }
    } else {
      // Fallback to old logic
      const adultsPerRoom = Math.ceil(adults / roomCount);
      const childrenPerRoom = Math.ceil(children / roomCount);

      for (let roomIndex = 0; roomIndex < roomCount; roomIndex++) {
        const roomGuests = [];
        
        // Add adults to this room (at least 1 adult per room)
        const adultsInThisRoom = Math.min(adultsPerRoom, adults - (roomIndex * adultsPerRoom));
        for (let i = 0; i < adultsInThisRoom; i++) {
          roomGuests.push({
            guestId: `guest_${guestIndex}`,
            operation: 'I', // New guests should be 'I' (Insert)
            title: 'Mr',
            firstName: '',
            middleName: '',
            lastName: '',
            mobileNo: '',
            paxType: 'A',
            age: '',
            dateOfBirth: '',
            email: '',
            pan: '',
            profileType: 'T',
            employeeId: '',
            corporateCompanyId: '',
            roomIndex,
            guestIndex: guestIndex++
          });
        }

        // Add children to this room (only if there are children and this room has adults)
        if (children > 0 && adultsInThisRoom > 0) {
          const childrenInThisRoom = Math.min(childrenPerRoom, children - (roomIndex * childrenPerRoom));
          for (let i = 0; i < childrenInThisRoom; i++) {
            roomGuests.push({
              guestId: `guest_${guestIndex}`,
              operation: 'I', // New guests should be 'I' (Insert)
              title: 'Master',
              firstName: '',
              middleName: '',
              lastName: '',
              mobileNo: '',
              paxType: 'C',
              age: '',
              dateOfBirth: '',
              email: '',
              pan: '',
              profileType: 'T',
              employeeId: '',
              corporateCompanyId: '',
              roomIndex,
              guestIndex: guestIndex++
            });
          }
        }

        newGuests.push({
          roomId: `room_${roomIndex}`,
          roomIndex,
          guests: roomGuests
        });
      }
    }

    setGuests(newGuests);
  };

  const handleGuestChange = (roomIndex, guestIndex, field, value) => {
    setGuests(prev => prev.map((room, rIndex) => {
      if (rIndex === roomIndex) {
        return {
          ...room,
          guests: room.guests.map((guest, gIndex) => {
            if (gIndex === guestIndex) {
              return { ...guest, [field]: value };
            }
            return guest;
          })
        };
      }
      return room;
    }));

    // Clear error for this field
    const errorKey = `${roomIndex}-${guestIndex}-${field}`;
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[errorKey];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    guests.forEach((room, roomIndex) => {
      room.guests.forEach((guest, guestIndex) => {
        const errorKey = `${roomIndex}-${guestIndex}`;

        // Required field validations
        if (!guest.firstName.trim()) {
          newErrors[`${errorKey}-firstName`] = 'First name is required';
          isValid = false;
        }

        if (!guest.lastName.trim()) {
          newErrors[`${errorKey}-lastName`] = 'Last name is required';
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onApply(guests);
      setIsOpen(false);
    }
  };

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
      <div className="relative bg-white rounded-lg border max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Guest Details</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {guests.map((room, roomIndex) => (
              <div key={roomIndex} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4 text-[#16437c]">
                  Room {roomIndex + 1} - Guest Details
                </h3>
                
                <div className="space-y-4">
                  {room.guests.map((guest, guestIndex) => (
                    <div key={guestIndex} className="border border-gray-100 rounded p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">
                          {guest.paxType === 'A' ? 'Adult' : 'Child'} {guestIndex + 1}
                        </h4>
                        {guest.paxType === 'C' && (
                          <span className="text-sm text-gray-500">Child</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <select
                            value={guest.title}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'title', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            {guest.paxType === 'A' ? (
                              <>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Dr">Dr</option>
                              </>
                            ) : (
                              <>
                                <option value="Master">Master</option>
                                <option value="Miss">Miss</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={guest.firstName}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'firstName', e.target.value)}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`${roomIndex}-${guestIndex}-firstName`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                          />
                          {errors[`${roomIndex}-${guestIndex}-firstName`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`${roomIndex}-${guestIndex}-firstName`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Middle Name
                          </label>
                          <input
                            type="text"
                            value={guest.middleName}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'middleName', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={guest.lastName}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'lastName', e.target.value)}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`${roomIndex}-${guestIndex}-lastName`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                          />
                          {errors[`${roomIndex}-${guestIndex}-lastName`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`${roomIndex}-${guestIndex}-lastName`]}</p>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#f48f22] hover:bg-[#16437c] text-white rounded font-semibold transition-colors"
              >
                Continue to Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

