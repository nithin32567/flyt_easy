import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ContactInfoModal from '../../components/modals/ContactInfoModal';
import GuestDetailsModal from '../../components/modals/GuestDetailsModal';
import { User, Users, CreditCard, CheckCircle } from 'lucide-react';
import axios from 'axios';

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
    if (!hotelSearchData.searchId || !selectedRoomData.roomId) {
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
          NetAmount: selectedRoom.totalRate || 0,
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
        Rooms: guestDetails.map((room, index) => ({
          RoomId: selectedRoom.roomId,
          GuestCode: `|${room.guests.length}|${room.guests.map((g, index) => `${index + 1}:${g.paxType}:${g.age || 25}`).join(',')}|`,
          SupplierName: selectedRoom.providerName,
          RoomGroupId: selectedRoom.roomGroupId || `roomgroup_${index}`,
          Guests: room.guests.map(guest => ({
            GuestID: guest.guestId || "0",
            Operation: guest.operation || "",
            Title: guest.title,
            FirstName: guest.firstName,
            MiddleName: guest.middleName || "",
            LastName: guest.lastName,
            MobileNo: guest.mobileNo || contactInfo.mobile,
            PaxType: guest.paxType,
            Age: guest.age || "",
            Email: guest.email || contactInfo.email,
            Pan: guest.pan || "",
            ProfileType: guest.profileType || "T",
            EmployeeId: guest.employeeId || "",
            corporateCompanyID: guest.corporateCompanyId || ""
          }))
        })),
        NetAmount: selectedRoom.totalRate?.toString() || "0",
        ClientID: localStorage.getItem("ClientID") || "FVI6V120g22Ei5ztGK0FIQ==",
        DeviceID: "",
        AppVersion: "",
        SearchId: searchData?.searchId || "",
        RecommendationId: selectedRoom.recommendationId || selectedRoom.roomId,
        LocationName: searchData?.location || null,
        HotelCode: selectedRoom?.hotelCode || hotelData?.content?.hotel?.id || hotelData?.id || "",
        CheckInDate: searchData?.checkIn ? new Date(searchData.checkIn).toISOString().split('T')[0] : "",
        CheckOutDate: searchData?.checkOut ? new Date(searchData.checkOut).toISOString().split('T')[0] : "",
        TravelingFor: "NTF"
      };
      
      console.log('=== HOTEL BOOKING PAYLOAD ===');
      console.log('Available Data:');
      console.log('hotelData:', hotelData);
      console.log('selectedRoom:', selectedRoom);
      console.log('searchData:', searchData);
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
                  <h4 className="font-medium">{hotelData.hotel?.name}</h4>
                  <p className="text-sm text-gray-600">{hotelData.hotel?.contact?.address?.[0]?.city}</p>
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
                  <p className="font-medium">{selectedRoom?.roomName || 'Selected Room'}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">₹{selectedRoom?.totalRate?.toLocaleString() || '0'}</span>
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
