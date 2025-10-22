import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ContactInfoModal from '../../components/modals/ContactInfoModal';
import GuestDetailsModal from '../../components/modals/GuestDetailsModal';
import { User, Users, CreditCard, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { storeHotelItineraryResponse, isHotelItineraryValid } from '../../utils/bookingUtils';

const HotelBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get hotel data from location state or localStorage
  const [hotelData, setHotelData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchData, setSearchData] = useState(null);
  
  // Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  
  // Form data
  const [contactInfo, setContactInfo] = useState(null);
  const [guestDetails, setGuestDetails] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get data from localStorage or location state
  useEffect(() => {
    const hotelSearchData = JSON.parse(localStorage.getItem('hotelSearchData') || '{}');
    const hotelDetailsData = JSON.parse(localStorage.getItem('hotelDetailsData') || '{}');
    const selectedRoomData = JSON.parse(localStorage.getItem('selectedRoomData') || '{}');
    
    console.log('=== LOCALSTORAGE DATA DEBUG ===');
    console.log('hotelSearchData:', hotelSearchData);
    console.log('hotelDetailsData:', hotelDetailsData);
    console.log('selectedRoomData:', selectedRoomData);
    console.log('=== END LOCALSTORAGE DEBUG ===');
    
    setSearchData(hotelSearchData);
    setHotelData(hotelDetailsData);
    setSelectedRoom(selectedRoomData);
    
    // If no data, redirect back to search
    if (!hotelSearchData.searchId || (!selectedRoomData.id && !selectedRoomData.roomId)) {
      navigate('/hotel-search');
    }
  }, [navigate]);
  
  const handleContactInfoSubmit = (data) => {
    setContactInfo(data);
    setCurrentStep(2);
  };
  
  const handleGuestDetailsSubmit = (data) => {
    setGuestDetails(data);
    setCurrentStep(3);
  };
  
  const handleBookingSubmit = async () => {
    if (!contactInfo || !guestDetails.length || !selectedRoom) {
      alert('Please complete all required information');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const searchTracingKey = localStorage.getItem('searchTracingKey');
      
      // Prepare hotel itinerary payload according to Postman collection
      const hotelItineraryPayload = {
        TUI: searchTracingKey,
        ServiceEnquiry: "",
        ContactInfo: {
          Title: contactInfo.title,
          FName: contactInfo.firstName,
          LName: contactInfo.lastName,
          Mobile: contactInfo.mobile,
          Email: contactInfo.email,
          Address: contactInfo.address,
          State: contactInfo.state,
          City: contactInfo.city,
          PIN: contactInfo.pin,
          GSTCompanyName: contactInfo.gstCompanyName || "",
          GSTTIN: contactInfo.gstTin || "",
          GSTMobile: contactInfo.gstMobile || "",
          GSTEmail: contactInfo.gstEmail || "",
          UpdateProfile: false,
          IsGuest: contactInfo.isGuest || false,
          CountryCode: contactInfo.countryCode || "IN",
          MobileCountryCode: contactInfo.mobileCountryCode || "+91",
          NetAmount: selectedRoom.totalRate?.toString() || "0",
          DestMobCountryCode: "",
          DestMob: ""
        },
        Auxiliaries: [
          {
            Code: "PROMO",
            Parameters: [
              { Type: "Code", Value: "" },
              { Type: "ID", Value: "" },
              { Type: "Amount", Value: "" }
            ]
          },
          {
            Code: "CUSTOMER DETAILS",
            parameters: [
              { Type: "Nationality", Value: "IN" },
              { Type: "Country of Residence", Value: "IN" }
            ]
          }
        ],

        Rooms: guestDetails.map((room, index) => {
          // Get occupancy ID from selectedRoom data
          const occupancyId = selectedRoom.occupancies?.[0]?.occupancyId || 1;
          
          // Group guests by type (Adults vs Children)
          const adults = room.guests.filter(g => g.paxType === 'A');
          const children = room.guests.filter(g => g.paxType === 'C');
          
          // Build guest code according to specification
          // Format: |<OccupancyID>|<NumberOfPax><A or C>:<Age1>:<Age2>:<Age3>|
          let guestCode = `|${occupancyId}|`;
          
          // Add adults: NumberOfAdults:A:Age1:Age2:Age3
          if (adults.length > 0) {
            const adultAges = adults.map(g => g.age || 25);
            guestCode += `${adults.length}:A:${adultAges.join(':')}`;
            // Add pipe separator if children exist
            if (children.length > 0) {
              guestCode += '|';
            }
          }
          
          // Add children: NumberOfChildren:C:Age1:Age2:Age3
          if (children.length > 0) {
            const childAges = children.map(g => g.age || 25);
            guestCode += `${children.length}:C:${childAges.join(':')}`;
          }
          
          // Add final pipe to complete the format
          guestCode += '|';
          
          console.log('=== GUEST CODE GENERATION DEBUG ===');
          console.log('occupancyId:', occupancyId);
          console.log('adults:', adults);
          console.log('children:', children);
          console.log('Generated guestCode:', guestCode);
          console.log('=== END GUEST CODE GENERATION DEBUG ===');
          
          return {
            RoomId: selectedRoom.room?.id || selectedRoom.id || selectedRoom.roomId,
            GuestCode: guestCode,
            SupplierName: selectedRoom.providerName,
            RoomGroupId: selectedRoom.id,
            Guests: room.guests.map(guest => ({
            GuestID: "0",
            Operation: guest.operation || "",
            Title: guest.title,
            FirstName: guest.firstName,
            MiddleName: guest.middleName || "",
            LastName: guest.lastName,
            MobileNo: "",
            PaxType: guest.paxType,
            Age: guest.age || "",
            Email: "",
            Pan: guest.pan || "",
            ProfileType: guest.profileType || "T",
            EmployeeId: guest.employeeId || "",
            corporateCompanyID: guest.corporateCompanyId || ""
          }))
          };
        }),
        NetAmount: selectedRoom.totalRate?.toString() || "0",
        ClientID: localStorage.getItem("ClientID") || "FVI6V120g22Ei5ztGK0FIQ==",
        DeviceID: "",
        AppVersion: "",
        SearchId: searchData?.searchId || "",
        RecommendationId: selectedRoom.recommendationId || selectedRoom.roomId,
        LocationName: searchData?.location || null,
        HotelCode: selectedRoom?.hotelCode || hotelData?.content?.hotel?.id || hotelData?.id || "",
        CheckInDate: searchData?.checkIn ? (() => {
          // Convert MM/DD/YYYY to YYYY-MM-DD
          const [month, day, year] = searchData.checkIn.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        })() : "",
        CheckOutDate: searchData?.checkOut ? (() => {
          // Convert MM/DD/YYYY to YYYY-MM-DD
          const [month, day, year] = searchData.checkOut.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        })() : "",
        TravelingFor: "NTF"
      };
      
      console.log('=== HOTEL BOOKING PAYLOAD ===');
      console.log('Available Data:');
      console.log('hotelData:', hotelData);
      console.log('selectedRoom:', selectedRoom);
      console.log('searchData:', searchData);
      console.log('=== ROOM ID DEBUG ===');
      console.log('selectedRoom.room?.id:', selectedRoom.room?.id);
      console.log('selectedRoom.id:', selectedRoom.id);
      console.log('selectedRoom.roomId:', selectedRoom.roomId);
      console.log('Final RoomId being sent:', selectedRoom.room?.id || selectedRoom.id || selectedRoom.roomId);
      console.log('=== END ROOM ID DEBUG ===');
      console.log('=== GUEST CODE DEBUG ===');
      console.log('selectedRoom.occupancies:', selectedRoom.occupancies);
      console.log('guestDetails:', guestDetails);
      console.log('=== END GUEST CODE DEBUG ===');
      console.log('=== SUPPLIER & ROOM GROUP DEBUG ===');
      console.log('selectedRoom.providerName:', selectedRoom.providerName);
      console.log('selectedRoom.id (RoomGroupId):', selectedRoom.id);
      console.log('selectedRoom.room?.id (RoomId):', selectedRoom.room?.id);
      console.log('=== END SUPPLIER & ROOM GROUP DEBUG ===');
      console.log('=== PAYLOAD STRUCTURE DEBUG ===');
      console.log('Final RoomId being sent:', selectedRoom.room?.id || selectedRoom.id || selectedRoom.roomId);
      console.log('Final RoomGroupId being sent:', selectedRoom.id);
      console.log('Final SupplierName being sent:', selectedRoom.providerName);
      console.log('=== END PAYLOAD STRUCTURE DEBUG ===');
      console.log('=== PRICING DATA DEBUG ===');
      console.log('selectedRoom from localStorage:', selectedRoom);
      console.log('selectedRoom.providerName:', selectedRoom.providerName);
      console.log('selectedRoom.room?.id:', selectedRoom.room?.id);
      console.log('selectedRoom.id:', selectedRoom.id);
      console.log('=== END PRICING DATA DEBUG ===');
      console.log('=== FINAL PAYLOAD VERIFICATION ===');
      console.log('GuestID being sent:', "0");
      console.log('MobileNo being sent:', "");
      console.log('Email being sent:', "");
      console.log('Auxiliaries structure:', hotelItineraryPayload.Auxiliaries);
      console.log('=== NET AMOUNT DEBUG ===');
      console.log('selectedRoom.totalRate:', selectedRoom.totalRate);
      console.log('selectedRoom.baseRate:', selectedRoom.baseRate);
      console.log('NetAmount being sent:', hotelItineraryPayload.NetAmount);
      console.log('=== END NET AMOUNT DEBUG ===');
      console.log('=== END FINAL PAYLOAD VERIFICATION ===');
      console.log('Payload:', JSON.stringify(hotelItineraryPayload, null, 2));
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/create-itinerary`,
        hotelItineraryPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'search-tracing-key': searchTracingKey || ''
          }
        }
      );
      
      console.log('=== HOTEL BOOKING RESPONSE ===');
      console.log(response.data);
      
      if (response.data.status === 'success') {
        // Check if we have TransactionID and Code 200 in the itinerary response
        const itineraryData = response.data.itinerary;
        
        console.log('=== ITINERARY RESPONSE VALIDATION ===');
        console.log('TransactionID:', itineraryData?.TransactionID);
        console.log('Code:', itineraryData?.Code);
        console.log('Success:', isHotelItineraryValid(itineraryData));
        console.log('=== END ITINERARY RESPONSE VALIDATION ===');
        
        if (isHotelItineraryValid(itineraryData)) {
          console.log('✅ Itinerary created successfully with TransactionID:', itineraryData.TransactionID);
          
          // Store the complete itinerary response using utility function
          const stored = storeHotelItineraryResponse(itineraryData);
          if (stored) {
            console.log('✅ Itinerary response stored in localStorage');
          } else {
            console.warn('⚠️ Failed to store itinerary response');
          }
        }
        
        setCurrentStep(4);
        // Store booking data for payment
        localStorage.setItem('hotelBookingData', JSON.stringify({
          itinerary: response.data.itinerary,
          contactInfo,
          guestDetails,
          selectedRoom,
          searchData
        }));
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
      
    } catch (error) {
      console.error('Hotel booking error:', error);
      alert(`Booking failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!hotelData || !selectedRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Hotel Booking</h1>
          <p className="text-gray-600">
            {hotelData.hotel?.name} • {searchData?.checkIn} to {searchData?.checkOut}
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                <User className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Contact Info</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                <Users className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Guest Details</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${currentStep >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <p className="text-gray-600 mb-6">
                  Please provide your contact details for the booking.
                </p>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Contact Information
                </button>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Guest Details</h2>
                <p className="text-gray-600 mb-6">
                  Please provide details for all guests staying in the room.
                </p>
                <button
                  onClick={() => setIsGuestModalOpen(true)}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Guest Details
                </button>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Review & Book</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-medium">Contact Information</h3>
                    <p className="text-gray-600">
                      {contactInfo?.title} {contactInfo?.firstName} {contactInfo?.lastName}
                    </p>
                    <p className="text-gray-600">{contactInfo?.email}</p>
                    <p className="text-gray-600">{contactInfo?.mobile}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Guest Details</h3>
                    {guestDetails.map((room, roomIndex) => (
                      <div key={roomIndex} className="mt-2">
                        <p className="font-medium">Room {roomIndex + 1}</p>
                        {room.guests.map((guest, guestIndex) => (
                          <p key={guestIndex} className="text-gray-600 ml-4">
                            {guest.title} {guest.firstName} {guest.lastName}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleBookingSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Booking'}
                </button>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-green-600 mb-2">Booking Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Your hotel booking has been confirmed. You will receive a confirmation email shortly.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
          
          {/* Sidebar - Room Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{hotelData?.content?.hotel?.name || hotelData?.hotel?.name}</h4>
                  <p className="text-sm text-gray-600">{hotelData?.content?.hotel?.contact?.address?.[0]?.city || hotelData?.hotel?.contact?.address?.[0]?.city}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-medium">{searchData?.checkIn}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-medium">{searchData?.checkOut}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Room</p>
                  <p className="font-medium">{selectedRoom?.room?.name || selectedRoom?.roomName || 'Selected Room'}</p>
                  {selectedRoom?.room?.description && (
                    <p className="text-xs text-gray-500 mt-1">{selectedRoom.room.description}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Provider</p>
                  <p className="font-medium">{selectedRoom?.providerName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Room Features</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRoom?.refundable && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Refundable</span>
                    )}
                    {selectedRoom?.onlineCancellable && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Online Cancellable</span>
                    )}
                    {selectedRoom?.specialRequestSupported && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Special Requests</span>
                    )}
                    {selectedRoom?.room?.smokingAllowed === false && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Non-Smoking</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Occupancy</p>
                  <p className="font-medium">
                    {selectedRoom?.occupancies?.[0]?.numOfAdults || 0} Adults, {selectedRoom?.occupancies?.[0]?.numOfChildren || 0} Children
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Board Basis</p>
                  <p className="font-medium">{selectedRoom?.boardBasis?.description || 'Not specified'}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Rate:</span>
                      <span>₹{selectedRoom?.baseRate?.toLocaleString() || '0'}</span>
                    </div>
                    {selectedRoom?.taxes && selectedRoom.taxes.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Taxes:</span>
                        <span>₹{selectedRoom.taxes.reduce((sum, tax) => sum + tax.amount, 0).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedRoom?.commission && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Commission:</span>
                        <span>₹{selectedRoom.commission.amount?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">₹{selectedRoom?.totalRate?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <ContactInfoModal
        isOpen={isContactModalOpen}
        setIsOpen={setIsContactModalOpen}
        onApply={handleContactInfoSubmit}
        initial={contactInfo}
      />
      
      <GuestDetailsModal
        isOpen={isGuestModalOpen}
        setIsOpen={setIsGuestModalOpen}
        onApply={handleGuestDetailsSubmit}
        roomCount={1}
        adults={searchData?.adults || 1}
        children={searchData?.children || 0}
      />
    </div>
  );
};

export default HotelBooking;
