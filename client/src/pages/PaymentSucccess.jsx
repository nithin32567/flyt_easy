import React, { useEffect, useState } from 'react'
import axios from 'axios'

const PaymentSucccess = () => {
    const token = localStorage.getItem("token");
    const transactionID = JSON.parse(localStorage.getItem("TransactionID"));
    const clientID = localStorage.getItem("ClientID");
    const [bookingData, setBookingData] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        passengers: false,
        contact: false
    });

    useEffect(() => {
        fetchExistingItinerary();
    }, []);

    const fetchExistingItinerary = async () => {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flights/get-existing-itenary`, {
            TransactionID: transactionID,
            ClientID: clientID
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(response.data, '================================= response');
        setBookingData(response.data.data);
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

    return (  
        <div className='min-h-screen bg-gray-50'>
            <div className='max-w-4xl mx-auto p-4 md:p-6'>
                <h1 className='text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800'>Review Your Booking</h1>
                
                <div className='space-y-6'>
                    {/* Flight Details */}
                    {bookingData && (
                        <div className='bg-white rounded-lg shadow-md p-4 md:p-6'>
                            <h2 className='text-lg md:text-xl font-semibold mb-4 text-gray-700'>Flight Details</h2>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-gray-500'>From</span>
                                    <span className='text-sm md:text-base font-semibold text-gray-800'>
                                        {bookingData.From} - {bookingData.FromName}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-gray-500'>Travel Date</span>
                                    <span className='text-sm md:text-base font-semibold text-gray-800'>
                                        {bookingData.OnwardDate ? new Date(bookingData.OnwardDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-gray-500'>Fare Type</span>
                                    <span className='text-sm md:text-base font-semibold text-gray-800'>
                                        {bookingData.FareType === 'N' ? 'Normal Fare' : bookingData.FareType}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-gray-500'>Customer Fare</span>
                                    <span className='text-sm md:text-base font-semibold text-gray-800'>
                                        ₹{bookingData.CustomerFare?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-gray-500'>Net Amount</span>
                                    <span className='text-sm md:text-base font-semibold text-gray-800'>
                                        ₹{bookingData.NetAmount?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-gray-500'>Gross Amount</span>
                                    <span className='text-sm md:text-base font-semibold text-gray-800'>
                                        ₹{bookingData.GrossAmount?.toLocaleString() || 'N/A'}
                                    </span>
                                </div>
                                
                                {bookingData.ExchangeRate > 0 && (
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium text-gray-500'>Exchange Rate</span>
                                        <span className='text-sm md:text-base font-semibold text-gray-800'>
                                            {bookingData.ExchangeRate}
                                        </span>
                                    </div>
                                )}
                                
                                {bookingData.GateWayCharge > 0 && (
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium text-gray-500'>Gateway Charge</span>
                                        <span className='text-sm md:text-base font-semibold text-gray-800'>
                                            ₹{bookingData.GateWayCharge?.toLocaleString() || 'N/A'}
                                        </span>
                                    </div>
                                )}
                                
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-gray-500'>Payment Status</span>
                                    <span className='text-sm md:text-base font-semibold text-green-600'>
                                        {bookingData.PGDescription || 'N/A'}
                                    </span>
                                </div>
                                
                                {bookingData.HBReleaseDate && (
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium text-gray-500'>Hold Release Date</span>
                                        <span className='text-sm md:text-base font-semibold text-gray-800'>
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
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium text-gray-500'>Reference Number</span>
                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{bookingData.DRefNo}</span>
                                    </div>
                                )}
                                
                                {bookingData.Invoice && (
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium text-gray-500'>Invoice</span>
                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{bookingData.Invoice}</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Booking Status */}
                            <div className='mt-4 pt-4 border-t border-gray-200'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium text-gray-500'>Booking Status</span>
                                        <span className='text-sm md:text-base font-semibold text-gray-800'>
                                            {bookingData.Hold ? 'On Hold' : 'Confirmed'}
                                        </span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium text-gray-500'>Billing Status</span>
                                        <span className={`text-sm md:text-base font-semibold ${bookingData.PGDescription ? 'text-green-600' : 'text-orange-600'}`}>
                                            {bookingData.PGDescription ? 'Billed' : 'Not Billed'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Booking Information */}
                    <div className='bg-white rounded-lg shadow-md p-4 md:p-6'>
                        <h2 className='text-lg md:text-xl font-semibold mb-4 text-gray-700'>Booking Information</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium text-gray-500'>Transaction ID</span>
                                <span className='text-sm md:text-base font-semibold text-gray-800'>{bookingData?.TransactionID || 'N/A'}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium text-gray-500'>Booking Reference</span>
                                <span className='text-sm md:text-base font-semibold text-gray-800'>{bookingData?.BookingReference || 'N/A'}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium text-gray-500'>Booking Date</span>
                                <span className='text-sm md:text-base font-semibold text-gray-800'>{bookingData?.BookingDate || 'N/A'}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium text-gray-500'>Booking Status</span>
                                <span className='text-sm md:text-base font-semibold text-green-600'>{bookingData?.BookingStatus || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Passenger Details Accordion */}
                    {bookingData?.Pax && bookingData.Pax.length > 0 && (
                        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                            <button 
                                onClick={() => toggleSection('passengers')}
                                className='w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors'
                            >
                                <h2 className='text-lg md:text-xl font-semibold text-gray-700'>
                                    Passenger Details ({bookingData.Pax.length} {bookingData.Pax.length === 1 ? 'Passenger' : 'Passengers'})
                                </h2>
                                <svg 
                                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.passengers ? 'rotate-180' : ''}`}
                                    fill='none' 
                                    stroke='currentColor' 
                                    viewBox='0 0 24 24'
                                >
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                </svg>
                            </button>
                            
                            {expandedSections.passengers && (
                                <div className='px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-200'>
                                    <div className='space-y-4 pt-4'>
                                        {bookingData.Pax.map((passenger, index) => (
                                            <div key={passenger.PaxID || index} className='border border-gray-200 rounded-lg p-3 md:p-4'>
                                                <div className='flex items-center justify-between mb-3'>
                                                    <h3 className='text-base md:text-lg font-semibold text-gray-800'>
                                                        Passenger {index + 1} - {getPassengerType(passenger.PTC)}
                                                    </h3>
                                                    <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium'>
                                                        {passenger.PTC}
                                                    </span>
                                                </div>
                                                
                                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4'>
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Full Name</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>
                                                            {passenger.Title} {passenger.FName} {passenger.LName}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Age</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{passenger.Age} years</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Date of Birth</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>
                                                            {formatDate(passenger.DOB)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Gender</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>
                                                            {passenger.Gender === 'M' ? 'Male' : passenger.Gender === 'F' ? 'Female' : passenger.Gender}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Nationality</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{passenger.Nationality}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Passport Number</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{passenger.PassportNo || 'N/A'}</span>
                                                    </div>
                                                    
                                                    {passenger.PLI && (
                                                        <div className='flex flex-col'>
                                                            <span className='text-xs md:text-sm font-medium text-gray-500'>Place of Issue</span>
                                                            <span className='text-sm md:text-base font-semibold text-gray-800'>{passenger.PLI}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {passenger.DOE && passenger.DOE !== '1/1/0001 12:00:00 AM' && (
                                                        <div className='flex flex-col'>
                                                            <span className='text-xs md:text-sm font-medium text-gray-500'>Passport Expiry</span>
                                                            <span className='text-sm md:text-base font-semibold text-gray-800'>
                                                                {formatDate(passenger.DOE)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    {passenger.VisaType && (
                                                        <div className='flex flex-col'>
                                                            <span className='text-xs md:text-sm font-medium text-gray-500'>Visa Type</span>
                                                            <span className='text-sm md:text-base font-semibold text-gray-800'>{passenger.VisaType}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {passenger.FFNumber && (
                                                        <div className='flex flex-col'>
                                                            <span className='text-xs md:text-sm font-medium text-gray-500'>Frequent Flyer Number</span>
                                                            <span className='text-sm md:text-base font-semibold text-gray-800'>{passenger.FFNumber}</span>
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
                                className='w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors'
                            >
                                <h2 className='text-lg md:text-xl font-semibold text-gray-700'>
                                    Contact Information ({bookingData.ContactInfo.length} {bookingData.ContactInfo.length === 1 ? 'Contact' : 'Contacts'})
                                </h2>
                                <svg 
                                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.contact ? 'rotate-180' : ''}`}
                                    fill='none' 
                                    stroke='currentColor' 
                                    viewBox='0 0 24 24'
                                >
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                </svg>
                            </button>
                            
                            {expandedSections.contact && (
                                <div className='px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-200'>
                                    <div className='space-y-4 pt-4'>
                                        {bookingData.ContactInfo.map((contact, index) => (
                                            <div key={index} className='border border-gray-200 rounded-lg p-3 md:p-4'>
                                                <div className='flex items-center justify-between mb-3'>
                                                    <h3 className='text-base md:text-lg font-semibold text-gray-800'>
                                                        Contact Person {index + 1}
                                                    </h3>
                                                    <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs md:text-sm font-medium'>
                                                        {contact.IsGuest ? 'Guest' : 'Registered User'}
                                                    </span>
                                                </div>
                                                
                                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4'>
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Full Name</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>
                                                            {contact.Title} {contact.FName} {contact.LName}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Email</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.Email}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Mobile Number</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>
                                                            {contact.MobileCountryCode} {contact.Mobile}
                                                        </span>
                                                    </div>
                                                    
                                                    {contact.Phone && (
                                                        <div className='flex flex-col'>
                                                            <span className='text-xs md:text-sm font-medium text-gray-500'>Phone Number</span>
                                                            <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.Phone}</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Address</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.Address}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>City</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.City}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>State</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.State}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>PIN Code</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.PIN}</span>
                                                    </div>
                                                    
                                                    <div className='flex flex-col'>
                                                        <span className='text-xs md:text-sm font-medium text-gray-500'>Country</span>
                                                        <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.CountryCode}</span>
                                                    </div>
                                                    
                                                    {contact.DestMob && (
                                                        <div className='flex flex-col'>
                                                            <span className='text-xs md:text-sm font-medium text-gray-500'>Destination Mobile</span>
                                                            <span className='text-sm md:text-base font-semibold text-gray-800'>
                                                                {contact.DestMobCountryCode} {contact.DestMob}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    {contact.ReturnContactNo && (
                                                        <div className='flex flex-col'>
                                                            <span className='text-xs md:text-sm font-medium text-gray-500'>Return Contact</span>
                                                            <span className='text-sm md:text-base font-semibold text-gray-800'>
                                                                {contact.ReturnMobileCountryCode} {contact.ReturnContactNo}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    {contact.PreferredLanguage && (
                                                        <div className='flex flex-col'>
                                                            <span className='text-xs md:text-sm font-medium text-gray-500'>Preferred Language</span>
                                                            <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.PreferredLanguage}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* GST Information Section */}
                                                {(contact.GSTCompanyName || contact.GSTEmail || contact.GSTMobile || contact.GSTTIN) && (
                                                    <div className='mt-4 pt-4 border-t border-gray-200'>
                                                        <h4 className='text-sm md:text-md font-semibold mb-3 text-gray-700'>GST Information</h4>
                                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4'>
                                                            {contact.GSTCompanyName && (
                                                                <div className='flex flex-col'>
                                                                    <span className='text-xs md:text-sm font-medium text-gray-500'>Company Name</span>
                                                                    <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.GSTCompanyName}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {contact.GSTEmail && (
                                                                <div className='flex flex-col'>
                                                                    <span className='text-xs md:text-sm font-medium text-gray-500'>GST Email</span>
                                                                    <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.GSTEmail}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {contact.GSTMobile && (
                                                                <div className='flex flex-col'>
                                                                    <span className='text-xs md:text-sm font-medium text-gray-500'>GST Mobile</span>
                                                                    <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.GSTMobile}</span>
                                                                </div>
                                                            )}
                                                            
                                                            {contact.GSTTIN && (
                                                                <div className='flex flex-col'>
                                                                    <span className='text-xs md:text-sm font-medium text-gray-500'>GST TIN</span>
                                                                    <span className='text-sm md:text-base font-semibold text-gray-800'>{contact.GSTTIN}</span>
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
        </div>
    )
}

export default PaymentSucccess