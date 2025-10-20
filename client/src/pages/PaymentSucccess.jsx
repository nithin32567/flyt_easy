import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { clearBookingData } from '../utils/clearBookingData';
import { useAuth } from '../contexts/AuthContext';

const PaymentSucccess = () => {
    const token = localStorage.getItem("token");
    const transactionID = JSON.parse(localStorage.getItem("TransactionID"));
    const clientID = localStorage.getItem("ClientID");
    const TUI = localStorage.getItem("TUI");
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bookingData, setBookingData] = useState(null);
    const [savedBookingId, setSavedBookingId] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        passengers: false,
        contact: false
    });


    useEffect(() => {
        // First try to get booking data from localStorage (from payment process)
        const storedBookingData = localStorage.getItem("bookingDetails");
        if (storedBookingData) {
            const parsedData = JSON.parse(storedBookingData);
            setBookingData(parsedData);
            // Save booking details to database
            saveBookingDetails(parsedData);
        } else {
            // If not in localStorage, fetch from API
            fetchBookingDetails();
        }
    }, []);

    const saveBookingDetails = async (bookingData) => {
        if (!user || !bookingData) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/bookings/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({
                    bookingData: bookingData,
                    transactionId: bookingData.TransactionID,
                    tui: bookingData.TUI,
                    totalAmount: bookingData.NetAmount || bookingData.GrossAmount || 0
                })
            });

            if (response.ok) {
                const result = await response.json();
                setSavedBookingId(result.data._id);
                console.log('Booking details saved successfully');
            } else {
                const errorData = await response.json();
                console.error('Failed to save booking details:', errorData);
            }
        } catch (error) {
            console.error('Error saving booking details:', error);
        }
    };

    const fetchBookingDetails = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/retrieve-booking`, {
                ReferenceType: 'T',
                TUI: TUI,
                ReferenceNumber: transactionID,
                ClientID: clientID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                const bookingData = response.data.data;
                setBookingData(bookingData);
                localStorage.setItem("bookingDetails", JSON.stringify(bookingData));
                // Save booking details to database
                saveBookingDetails(bookingData);
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    }

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString || dateString === '1/1/0001 12:00:00 AM') return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to get passenger type
    const getPassengerType = (ptc) => {
        const types = {
            'ADT': 'Adult',
            'CHD': 'Child',
            'INF': 'Infant'
        };
        return types[ptc] || ptc;
    };

    // Toggle accordion sections
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Handle retrieve booking
    const handleRetrieveBooking = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/retrieve-booking`, {
                ReferenceType: 'T',
                TUI: TUI,
                ReferenceNumber: transactionID,
                ClientID: clientID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // Store the retrieved booking data
                setBookingData(response.data.data);
                localStorage.setItem('bookingDetails', JSON.stringify(response.data.data));
                alert('Booking retrieved successfully! Check your booking details above.');
            } else {
                alert('Failed to retrieve booking: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error retrieving booking:', error);
            alert('Error retrieving booking. Please try again.');
        }
    };

    // Helper function to check if web check-in is available
    const isWebCheckInAvailable = (flightDate) => {
        const now = new Date();
        const flight = new Date(flightDate);
        const hoursUntilFlight = (flight - now) / (1000 * 60 * 60);
        
        // Web check-in available 24-48 hours before flight
        return hoursUntilFlight <= 48 && hoursUntilFlight >= 0;
    };

    // Helper function to get web check-in status message
    const getWebCheckInStatus = (bookingData) => {
        if (!bookingData?.OnwardDate) return "Flight date not available";
        
        const flightDate = bookingData.OnwardDate;
        const isAvailable = isWebCheckInAvailable(flightDate);
        
        if (isAvailable) {
            const isCompleted = bookingData.WebCheckInInfo?.[0]?.IsWebCheckInCompleted;
            return isCompleted ? "Web Check-in Completed" : "Web Check-in Available";
        } else {
            const now = new Date();
            const flight = new Date(flightDate);
            const daysUntilFlight = Math.ceil((flight - now) / (1000 * 60 * 60 * 24));
            return `Web Check-in opens in ${daysUntilFlight} days`;
        }
    };

    // Helper function to get web check-in status color
    const getWebCheckInStatusColor = (bookingData) => {
        if (!bookingData?.OnwardDate) return "text-gray-500";
        
        const flightDate = bookingData.OnwardDate;
        const isAvailable = isWebCheckInAvailable(flightDate);
        
        if (isAvailable) {
            const isCompleted = bookingData.WebCheckInInfo?.[0]?.IsWebCheckInCompleted;
            return isCompleted ? "text-green-600" : "text-blue-600";
        } else {
            return "text-orange-600";
        }
    };

    return (  
        <div className='min-h-screen bg-gray-50'>
            <div className='max-w-6xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8'>
                <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800 px-2'>Review Your Booking</h1>
                
                <div className='space-y-4 sm:space-y-6'>
                    {/* Flight Details */}
                    {bookingData && (
                        <div className='bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 lg:p-8'>
                            <h2 className='text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-gray-700'>Flight Details</h2>
                            <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
                                <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>From</span>
                                    <span className='text-sm sm:text-base font-semibold text-gray-800 leading-tight'>
                                        {bookingData.From} - {bookingData.FromName}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Travel Date</span>
                                    <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                        {bookingData.OnwardDate ? new Date(bookingData.OnwardDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Fare Type</span>
                                    <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                        {bookingData.FareType === 'N' ? 'Normal Fare' : bookingData.FareType}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Customer Fare</span>
                                    <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                        ₹{bookingData.CustomerFare?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Net Amount</span>
                                    <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                        ₹{bookingData.NetAmount?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Gross Amount</span>
                                    <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                        ₹{bookingData.GrossAmount?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                
                                {bookingData.ExchangeRate > 0 && (
                                    <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Exchange Rate</span>
                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                            {bookingData.ExchangeRate}
                                        </span>
                                    </div>
                                )}
                                
                                {bookingData.GateWayCharge > 0 && (
                                    <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Gateway Charge</span>
                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                            ₹{bookingData.GateWayCharge?.toLocaleString() || 'N/A'}
                                        </span>
                                    </div>
                                )}
                                
                                <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Payment Status</span>
                                    <span className='text-sm sm:text-base font-semibold text-green-600'>
                                        {bookingData.PGDescription || 'N/A'}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Web Check-in Status</span>
                                    <span className={`text-sm sm:text-base font-semibold ${getWebCheckInStatusColor(bookingData)}`}>
                                        {getWebCheckInStatus(bookingData)}
                                    </span>
                                </div>
                                
                                {bookingData.HBReleaseDate && (
                                    <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Hold Release Date</span>
                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                            {new Date(bookingData.HBReleaseDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                )}
                                
                                {bookingData.DRefNo && (
                                    <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Reference Number</span>
                                        <span className='text-sm sm:text-base font-semibold text-gray-800 break-all'>{bookingData.DRefNo}</span>
                                    </div>
                                )}
                                
                                {bookingData.Invoice && (
                                    <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Invoice</span>
                                        <span className='text-sm sm:text-base font-semibold text-gray-800 break-all'>{bookingData.Invoice}</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Booking Status */}
                            <div className='mt-4 sm:mt-6 pt-4 border-t border-gray-200'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                                    <div className='flex flex-col p-2 sm:p-3 bg-blue-50 rounded-lg'>
                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Booking Status</span>
                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                            {bookingData.Hold ? 'On Hold' : 'Confirmed'}
                                        </span>
                                    </div>
                                    <div className='flex flex-col p-2 sm:p-3 bg-green-50 rounded-lg'>
                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Billing Status</span>
                                        <span className={`text-sm sm:text-base font-semibold ${bookingData.PGDescription ? 'text-green-600' : 'text-orange-600'}`}>
                                            {bookingData.PGDescription ? 'Billed' : 'Not Billed'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Booking Information */}
                    <div className='bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 lg:p-8'>
                        <h2 className='text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-gray-700'>Booking Information</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                            <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Transaction ID</span>
                                <span className='text-sm sm:text-base font-semibold text-gray-800 break-all'>{bookingData?.TransactionID || 'N/A'}</span>
                            </div>
                            <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Booking Reference</span>
                                <span className='text-sm sm:text-base font-semibold text-gray-800 break-all'>{bookingData?.BookingReference || 'N/A'}</span>
                            </div>
                            <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Booking Date</span>
                                <span className='text-sm sm:text-base font-semibold text-gray-800'>{bookingData?.BookingDate || 'N/A'}</span>
                            </div>
                            <div className='flex flex-col p-2 sm:p-3 bg-gray-50 rounded-lg'>
                                <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Booking Status</span>
                                <span className='text-sm sm:text-base font-semibold text-green-600'>{bookingData?.BookingStatus || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Passenger Details Accordion */}
                    {bookingData?.Pax && bookingData.Pax.length > 0 && (
                        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                            <button 
                                onClick={() => toggleSection('passengers')}
                                className='w-full p-3 sm:p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors'
                            >
                                <h2 className='text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-700 pr-2'>
                                    Passenger Details ({bookingData.Pax.length} {bookingData.Pax.length === 1 ? 'Passenger' : 'Passengers'})
                                </h2>
                                <svg 
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform flex-shrink-0 ${expandedSections.passengers ? 'rotate-180' : ''}`}
                                    fill='none' 
                                    stroke='currentColor' 
                                    viewBox='0 0 24 24'
                                >
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                </svg>
                            </button>
                            
                            {expandedSections.passengers && (
                                <div className='px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 border-t border-gray-200'>
                                    <div className='space-y-3 sm:space-y-4 pt-3 sm:pt-4'>
                                        {bookingData.Pax.map((passenger, index) => (
                                            <div key={passenger.PaxID || index} className='border border-gray-200 rounded-lg p-3 sm:p-4'>
                                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2'>
                                                    <h3 className='text-sm sm:text-base md:text-lg font-semibold text-gray-800'>
                                                        Passenger {index + 1} - {getPassengerType(passenger.PTC)}
                                                    </h3>
                                                    <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto'>
                                                        {passenger.PTC}
                                                    </span>
                                                </div>
                                                
                                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Full Name</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800 leading-tight'>
                                                            {passenger.Title} {passenger.FName} {passenger.LName}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Age</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>{passenger.Age} years</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Date of Birth</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                                            {formatDate(passenger.DOB)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Gender</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                                            {passenger.Gender === 'M' ? 'Male' : passenger.Gender === 'F' ? 'Female' : passenger.Gender}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Nationality</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>{passenger.Nationality}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Passport Number</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800 break-all'>{passenger.PassportNo || 'N/A'}</span>
                                                    </div>
                                                    
                                                    {passenger.PLI && (
                                                        <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                            <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Place of Issue</span>
                                                            <span className='text-sm sm:text-base font-semibold text-gray-800'>{passenger.PLI}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {passenger.DOE && passenger.DOE !== '1/1/0001 12:00:00 AM' && (
                                                        <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                            <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Passport Expiry</span>
                                                            <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                                                {formatDate(passenger.DOE)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    {passenger.VisaType && (
                                                        <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                            <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Visa Type</span>
                                                            <span className='text-sm sm:text-base font-semibold text-gray-800'>{passenger.VisaType}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {passenger.FFNumber && (
                                                        <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                            <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Frequent Flyer Number</span>
                                                            <span className='text-sm sm:text-base font-semibold text-gray-800 break-all'>{passenger.FFNumber}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Contact Details Accordion */}
                    {bookingData?.ContactInfo && bookingData.ContactInfo.length > 0 && (
                        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                            <button 
                                onClick={() => toggleSection('contact')}
                                className='w-full p-3 sm:p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors'
                            >
                                <h2 className='text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-700 pr-2'>
                                    Contact Information ({bookingData.ContactInfo.length} {bookingData.ContactInfo.length === 1 ? 'Contact' : 'Contacts'})
                                </h2>
                                <svg 
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform flex-shrink-0 ${expandedSections.contact ? 'rotate-180' : ''}`}
                                    fill='none' 
                                    stroke='currentColor' 
                                    viewBox='0 0 24 24'
                                >
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                </svg>
                            </button>
                            
                            {expandedSections.contact && (
                                <div className='px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 border-t border-gray-200'>
                                    <div className='space-y-3 sm:space-y-4 pt-3 sm:pt-4'>
                                        {bookingData.ContactInfo.map((contact, index) => (
                                            <div key={index} className='border border-gray-200 rounded-lg p-3 sm:p-4'>
                                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2'>
                                                    <h3 className='text-sm sm:text-base md:text-lg font-semibold text-gray-800'>
                                                        Contact Person {index + 1}
                                                    </h3>
                                                    <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto'>
                                                        {contact.IsGuest ? 'Guest' : 'Registered User'}
                                                    </span>
                                                </div>
                                                
                                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Full Name</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800 leading-tight'>
                                                            {contact.Title} {contact.FName} {contact.LName}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Email</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800 break-all'>{contact.Email}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Mobile Number</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                                            {contact.MobileCountryCode} {contact.Mobile}
                                                        </span>
                                                    </div>
                                                    
                                                    {contact.Phone && (
                                                        <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                            <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Phone Number</span>
                                                            <span className='text-sm sm:text-base font-semibold text-gray-800'>{contact.Phone}</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Address</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800 leading-tight'>{contact.Address}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>City</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>{contact.City}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>State</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>{contact.State}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>PIN Code</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>{contact.PIN}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                        <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Country</span>
                                                        <span className='text-sm sm:text-base font-semibold text-gray-800'>{contact.CountryCode}</span>
                                                    </div>
                                                    
                                                    {contact.DestMob && (
                                                        <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                            <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Destination Mobile</span>
                                                            <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                                                {contact.DestMobCountryCode} {contact.DestMob}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    {contact.ReturnContactNo && (
                                                        <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                            <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Return Contact</span>
                                                            <span className='text-sm sm:text-base font-semibold text-gray-800'>
                                                                {contact.ReturnMobileCountryCode} {contact.ReturnContactNo}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    {contact.PreferredLanguage && (
                                                        <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                            <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Preferred Language</span>
                                                            <span className='text-sm sm:text-base font-semibold text-gray-800'>{contact.PreferredLanguage}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* GST Information Section */}
                                                {(contact.GSTCompanyName || contact.GSTEmail || contact.GSTMobile || contact.GSTTIN) && (
                                                    <div className='mt-4 pt-4 border-t border-gray-200'>
                                                        <h4 className='text-sm sm:text-base md:text-lg font-semibold mb-3 text-gray-700'>GST Information</h4>
                                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                                                            {contact.GSTCompanyName && (
                                                                <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>Company Name</span>
                                                                    <span className='text-sm sm:text-base font-semibold text-gray-800 leading-tight'>{contact.GSTCompanyName}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {contact.GSTEmail && (
                                                                <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>GST Email</span>
                                                                    <span className='text-sm sm:text-base font-semibold text-gray-800 break-all'>{contact.GSTEmail}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {contact.GSTMobile && (
                                                                <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>GST Mobile</span>
                                                                    <span className='text-sm sm:text-base font-semibold text-gray-800'>{contact.GSTMobile}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {contact.GSTTIN && (
                                                                <div className='flex flex-col p-2 bg-gray-50 rounded-lg'>
                                                                    <span className='text-xs sm:text-sm font-medium text-gray-500 mb-1'>GST TIN</span>
                                                                    <span className='text-sm sm:text-base font-semibold text-gray-800 break-all'>{contact.GSTTIN}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
              
            </div>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
                {savedBookingId && (
                    <button 
                        onClick={() => navigate(`/booking-details/${savedBookingId}`)}
                        className='text-center flex justify-center items-center bg-green-600 text-white p-2 rounded-xl px-8 py-2 hover:bg-green-700 transition-colors'
                    >
                        View Booking Details
                    </button>
                )}
                <button 
                    onClick={() => navigate('/bookings-accordion')}
                    className='text-center flex justify-center items-center bg-blue-600 text-white p-2 rounded-xl px-8 py-2 hover:bg-blue-700 transition-colors'
                >
                    View All Bookings
                </button>
                <Link to="/">
                    <button 
                    onClick={() => {
                        // Clear all booking-related localStorage items to prevent conflicts
                        clearBookingData();
                        // Navigate to home
                        window.location.href = '/';
                    }}
                    className='text-center flex justify-center items-center bg-gray-600 text-white p-2 rounded-xl px-8 py-2 hover:bg-gray-700 transition-colors'>
                Go To Home
                </button>
                </Link>
            </div>
        </div>

    )
}

export default PaymentSucccess