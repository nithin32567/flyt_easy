import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import AddressForm from './AddressForm';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: 'Indian',
    passportNumber: '',
    passportExpiry: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [hotelBookingsLoading, setHotelBookingsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Debug: Log profile state changes
  useEffect(() => {
    console.log("Profile state updated:", profile);
    console.log("Date of Birth value:", profile.dateOfBirth);
    console.log("Passport Expiry value:", profile.passportExpiry);
  }, [profile]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/user/profile`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data, "user data");

      if (response.ok) {
        console.log("Full API response:", data);
        console.log("Profile data from API:", data.user?.profile);

        // Ensure we have the correct structure for profile data
        const apiProfile = data.user.profile || {};

        // Helper function to format date for HTML date input
        const formatDateForInput = (dateString) => {
          if (!dateString) return '';
          try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
          } catch (error) {
            console.error('Error formatting date:', error);
            return '';
          }
        };

        const formattedProfile = {
          // Personal Information
          title: data.user.title || 'Mr',
          
          // Profile Information
          dateOfBirth: formatDateForInput(apiProfile.dateOfBirth),
          gender: apiProfile.gender || '',
          nationality: apiProfile.nationality || 'Indian',
          passportNumber: apiProfile.passportNumber || '',
          passportExpiry: formatDateForInput(apiProfile.passportExpiry)
        };

        console.log("Formatted profile for state:", formattedProfile);
        setProfile(formattedProfile);
        setAddresses(data.addresses || []);
      } else {
        setMessage('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Error loading profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelBookings = async () => {
    try {
      setHotelBookingsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/hotel/bookings`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHotelBookings(data.data || []);
      } else {
        setMessage('Failed to load hotel bookings');
      }
    } catch (error) {
      console.error('Error fetching hotel bookings:', error);
      setMessage('Error loading hotel bookings');
    } finally {
      setHotelBookingsLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/user/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile })
      });

      if (response.ok) {
        setMessage('Profile updated successfully');
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/user/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAddresses(prev => prev.filter(addr => addr._id !== addressId));
        setMessage('Address deleted successfully');
      } else {
        setMessage('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setMessage('Error deleting address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/user/addresses/${addressId}/default`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr._id === addressId
        })));
        setMessage('Default address updated');
      } else {
        setMessage('Failed to update default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      setMessage('Error updating default address');
    }
  };

  const handleAddressSave = async (addressData) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      const url = editingAddress 
        ? `${baseUrl}/api/user/addresses/${editingAddress._id}`
        : `${baseUrl}/api/user/addresses`;
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });

      if (response.ok) {
        const data = await response.json();
        if (editingAddress) {
          setAddresses(prev => prev.map(addr => 
            addr._id === editingAddress._id ? data.address : addr
          ));
          setMessage('Address updated successfully');
        } else {
          setAddresses(prev => [data.address, ...prev]);
          setMessage('Address created successfully');
        }
        setShowAddressForm(false);
        setEditingAddress(null);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      setMessage('Error saving address');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '200px' }} className="max-w-4xl mx-auto ">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and addresses</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'addresses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Addresses ({addresses.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('hotelBookings');
                if (hotelBookings.length === 0) {
                  fetchHotelBookings();
                }
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'hotelBookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Hotel Bookings ({hotelBookings.length})
            </button>
            <Link style={{ color: "gray" }}
              to="/bookings-accordion"
              className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              My Bookings
            </Link>
          </nav>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
            {message}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6">
            {/* Check if profile is empty */}
            {!profile.phone && !profile.dateOfBirth && !profile.gender && !profile.nationality && !profile.passportNumber && !profile.passportExpiry ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Profile Information Added</h3>
                <p className="text-gray-600 mb-6">You haven't added your profile information yet. Please fill out the form below to create your profile.</p>
              </div>
            ) : null}

            <form onSubmit={handleProfileSave} className="space-y-6">
              {/* Google User Data - Read Only */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Google Account Information</h3>
                <div className="flex items-center mb-4">
                  {user?.picture && (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300"
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">{user?.name || 'User'}</h4>
                    <p className="text-sm text-gray-600">{user?.email || ''}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={user?.email || ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={user?.name || ''}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={profile.title || 'Mr'}
                      onChange={(e) => handleProfileChange('title', e.target.value)}
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={user?.name || ''}
                      readOnly
                      placeholder="Your full name from Google account"
                    />
                    <p className="text-xs text-gray-500 mt-1">This is your name from your Google account</p>
                  </div>
                </div>
                
                {/* <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Mobile and phone numbers are managed at the address level. 
                    You can set different contact numbers for each address when adding or editing addresses.
                  </p>
                </div> */}
              </div>

              {/* Additional Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.dateOfBirth || ''}
                    onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                  />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.gender || ''}
                    onChange={(e) => handleProfileChange('gender', e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.nationality || ''}
                    onChange={(e) => handleProfileChange('nationality', e.target.value)}
                    placeholder="Enter your nationality"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.passportNumber || ''}
                    onChange={(e) => handleProfileChange('passportNumber', e.target.value)}
                    placeholder="Enter your passport number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.passportExpiry || ''}
                    onChange={(e) => handleProfileChange('passportExpiry', e.target.value)}
                  />
                  {/* Debug info */}

                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="p-6">
            {showAddressForm ? (
              <AddressForm
                onSave={handleAddressSave}
                onCancel={handleCancelAddressForm}
                initialData={editingAddress}
                userData={user}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Your Addresses</h3>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-semibold transition-colors"
                  >
                    Add New Address
                  </button>
                </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No addresses found. Add your first address to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border rounded-lg p-4 ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {address.isDefault && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                            Default Address
                          </span>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {address.title} {user?.name || 'User'}
                            </h4>
                            <p className="text-gray-600">{address.contactEmail || 'No contact email'}</p>
                            <p className="text-gray-600">{address.contactMobile || 'No contact mobile'}</p>
                          </div>
                          <div>
                            <p className="text-gray-700">{address.housename}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.state} - {address.pin}
                            </p>
                            <p className="text-gray-600">{address.countryCode}</p>
                          </div>
                        </div>
                        {address.gstCompanyName && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p><strong>GST:</strong> {address.gstCompanyName} ({address.gstTin})</p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address._id)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleAddressDelete(address._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </>
            )}
          </div>
        )}

        {/* Hotel Bookings Tab */}
        {activeTab === 'hotelBookings' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Your Hotel Bookings</h3>
              <button
                onClick={fetchHotelBookings}
                disabled={hotelBookingsLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition-colors disabled:opacity-50"
              >
                {hotelBookingsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {hotelBookingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : hotelBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Hotel Bookings Found</h3>
                <p className="text-gray-600 mb-6">You haven't made any hotel bookings yet. Start exploring and book your next stay!</p>
                <Link
                  to="/hotel-search"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold transition-colors"
                >
                  Search Hotels
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {hotelBookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {booking.hotelName}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'current'
                                ? 'bg-blue-100 text-blue-800'
                                : booking.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                              <p className="text-sm text-gray-500">Check-in</p>
                              <p className="font-medium text-gray-900">
                                {new Date(booking.checkInDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                              <p className="text-sm text-gray-500">Check-out</p>
                              <p className="font-medium text-gray-900">
                                {new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                            <div>
                              <p className="text-sm text-gray-500">Total Amount</p>
                              <p className="font-medium text-gray-900">₹{booking.totalAmount?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Booking ID: {booking.bookingConfirmationId}</span>
                          <span>Transaction ID: {booking.transactionId}</span>
                          <span>Booked on: {new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/hotel-booking-confirmation?bookingId=${booking._id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => window.print()}
                          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                        >
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;