// Convert ContactInfoForm data to address format
export const convertContactInfoToAddress = (contactData) => {
  return {
    title: contactData.Title,
    firstName: contactData.FName,
    lastName: contactData.LName,
    mobile: contactData.Mobile,
    phone: contactData.Phone || '',
    email: contactData.Email,
    address: contactData.Address,
    countryCode: contactData.CountryCode,
    state: contactData.State,
    city: contactData.City,
    pin: contactData.PIN,
    gstCompanyName: contactData.GSTCompanyName || '',
    gstTin: contactData.GSTTIN || '',
    gstMobile: contactData.GSTMobile || '',
    gstEmail: contactData.GSTEmail || '',
    isDefault: true // New addresses are typically set as default
  };
};

// Convert address data back to ContactInfoForm format
export const convertAddressToContactInfo = (addressData) => {
  return {
    Title: addressData.title,
    FName: addressData.firstName,
    LName: addressData.lastName,
    Mobile: addressData.mobile,
    Phone: addressData.phone || '',
    Email: addressData.email,
    Address: addressData.address,
    CountryCode: addressData.countryCode,
    State: addressData.state,
    City: addressData.city,
    PIN: addressData.pin,
    GSTCompanyName: addressData.gstCompanyName || '',
    GSTTIN: addressData.gstTin || '',
    GSTMobile: addressData.gstMobile || '',
    GSTEmail: addressData.gstEmail || '',
    UpdateProfile: false,
    IsGuest: false
  };
};

// Save address to backend
export const saveAddress = async (addressData, token) => {
  try {
    const response = await fetch('/api/user/addresses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addressData)
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result.address };
    } else {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to save address' };
    }
  } catch (error) {
    console.error('Error saving address:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update existing address
export const updateAddress = async (addressId, addressData, token) => {
  try {
    const response = await fetch(`/api/user/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addressData)
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result.address };
    } else {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to update address' };
    }
  } catch (error) {
    console.error('Error updating address:', error);
    return { success: false, error: 'Network error' };
  }
};
