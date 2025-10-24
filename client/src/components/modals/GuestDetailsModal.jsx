import { useState, useEffect } from 'react';
import { X, Plus, Minus, Calendar } from 'lucide-react';

export default function GuestDetailsModal({
  isOpen,
  setIsOpen,
  onApply,
  initial = {},
  roomCount = 1,
  adults = 1,
  children = 0
}) {
  const [guests, setGuests] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      initializeGuests();
      setErrors({});
    }
  }, [isOpen, roomCount, adults, children]);

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateAge = (age, paxType, dob) => {
    if (paxType === 'A') {
      return age >= 18;
    } else if (paxType === 'C') {
      return age <= 12;
    }
    return true;
  };

  const validateAgeWithDOB = (age, dob, paxType) => {
    if (!dob) return true;
    const calculatedAge = calculateAge(dob);
    if (calculatedAge === null) return true;
    
    if (paxType === 'A') {
      return calculatedAge >= 18;
    } else if (paxType === 'C') {
      return calculatedAge <= 12;
    }
    return true;
  };

  const initializeGuests = () => {
    const newGuests = [];
    let guestIndex = 0;

    for (let roomIndex = 0; roomIndex < roomCount; roomIndex++) {
      const roomGuests = [];
      
      for (let i = 0; i < adults; i++) {
        roomGuests.push({
          guestId: `guest_${guestIndex}`,
          operation: 'U',
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

      for (let i = 0; i < children; i++) {
        roomGuests.push({
          guestId: `guest_${guestIndex}`,
          operation: 'U',
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

      newGuests.push({
        roomId: `room_${roomIndex}`,
        roomIndex,
        guests: roomGuests
      });
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
              const updatedGuest = { ...guest, [field]: value };
              
              // Auto-calculate age from date of birth
              if (field === 'dateOfBirth' && value) {
                const calculatedAge = calculateAge(value);
                if (calculatedAge !== null) {
                  updatedGuest.age = calculatedAge.toString();
                }
              }
              
              return updatedGuest;
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

        // Mobile number validation
        if (guest.mobileNo && !validateMobile(guest.mobileNo)) {
          newErrors[`${errorKey}-mobileNo`] = 'Mobile number must be exactly 10 digits';
          isValid = false;
        }

        // Email validation
        if (guest.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
          newErrors[`${errorKey}-email`] = 'Please enter a valid email address';
          isValid = false;
        }

        // Age validation for children
        if (guest.paxType === 'C') {
          if (!guest.age || isNaN(guest.age) || parseInt(guest.age) < 0 || parseInt(guest.age) > 12) {
            newErrors[`${errorKey}-age`] = 'Child age must be between 0 and 12 years';
            isValid = false;
          }
        }

        // Age validation for adults
        if (guest.paxType === 'A') {
          if (guest.age && (isNaN(guest.age) || parseInt(guest.age) < 18)) {
            newErrors[`${errorKey}-age`] = 'Adult age must be 18 or above';
            isValid = false;
          }
        }

        // Date of birth validation
        if (guest.dateOfBirth) {
          const calculatedAge = calculateAge(guest.dateOfBirth);
          if (calculatedAge !== null) {
            if (guest.paxType === 'A' && calculatedAge < 18) {
              newErrors[`${errorKey}-dateOfBirth`] = 'Adult must be 18 years or older';
              isValid = false;
            } else if (guest.paxType === 'C' && calculatedAge > 12) {
              newErrors[`${errorKey}-dateOfBirth`] = 'Child must be 12 years or younger';
              isValid = false;
            }
          }
        }

        // PAN validation
        if (guest.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(guest.pan)) {
          newErrors[`${errorKey}-pan`] = 'Please enter a valid PAN number';
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            value={guest.mobileNo}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'mobileNo', e.target.value)}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`${roomIndex}-${guestIndex}-mobileNo`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            maxLength="10"
                            placeholder="10 digit mobile number"
                          />
                          {errors[`${roomIndex}-${guestIndex}-mobileNo`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`${roomIndex}-${guestIndex}-mobileNo`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={guest.email}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'email', e.target.value)}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`${roomIndex}-${guestIndex}-email`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`${roomIndex}-${guestIndex}-email`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`${roomIndex}-${guestIndex}-email`]}</p>
                          )}
                        </div>

                        {guest.paxType === 'C' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Age *
                            </label>
                            <input
                              type="number"
                              value={guest.age}
                              onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'age', e.target.value)}
                              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors[`${roomIndex}-${guestIndex}-age`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              min="0"
                              max="12"
                              required
                            />
                            {errors[`${roomIndex}-${guestIndex}-age`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`${roomIndex}-${guestIndex}-age`]}</p>
                            )}
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={guest.dateOfBirth}
                              onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'dateOfBirth', e.target.value)}
                              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors[`${roomIndex}-${guestIndex}-dateOfBirth`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              max={new Date().toISOString().split('T')[0]}
                            />
                            <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {errors[`${roomIndex}-${guestIndex}-dateOfBirth`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`${roomIndex}-${guestIndex}-dateOfBirth`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            PAN Number
                          </label>
                          <input
                            type="text"
                            value={guest.pan}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'pan', e.target.value.toUpperCase())}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`${roomIndex}-${guestIndex}-pan`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            maxLength="10"
                            placeholder="ABCDE1234F"
                          />
                          {errors[`${roomIndex}-${guestIndex}-pan`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`${roomIndex}-${guestIndex}-pan`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Type
                          </label>
                          <select
                            value={guest.profileType}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'profileType', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="T">Tourist</option>
                            <option value="B">Business</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employee ID
                          </label>
                          <input
                            type="text"
                            value={guest.employeeId}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'employeeId', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Corporate Company ID
                          </label>
                          <input
                            type="text"
                            value={guest.corporateCompanyId}
                            onChange={(e) => handleGuestChange(roomIndex, guestIndex, 'corporateCompanyId', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
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

