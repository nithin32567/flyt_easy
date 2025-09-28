import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const WebSettingsContext = createContext();

export const useWebSettings = () => {
  const context = useContext(WebSettingsContext);
  if (!context) {
    throw new Error('useWebSettings must be used within a WebSettingsProvider');
  }
  return context;
};

export const WebSettingsProvider = ({ children }) => {
  const [webSettings, setWebSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetchWebSettings = useCallback(async (tui = null) => {
    // Prevent multiple calls
    if (hasFetched.current) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      hasFetched.current = true;
      
      const token = localStorage.getItem('token');
      const ClientID = localStorage.getItem('ClientID');
      // Use provided TUI or fallback to localStorage TUI
      const TUI = tui || localStorage.getItem('TUI');
      
      if (!ClientID || !TUI) {
        throw new Error('ClientID or TUI not found');
      }

      // Prepare the payload
      const payload = {
        ClientID,
        TUI: TUI // Use the provided TUI or localStorage TUI
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/flights/web-settings`,
        payload,
        { headers }
      );

      if (response.data.success) {
        setWebSettings(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch web settings');
      }
    } catch (err) {
      setError(err.message);
      hasFetched.current = false; // Reset flag on error to allow retry
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we only use localStorage and environment variables

  // Helper functions to get specific settings
  const getSetting = (key) => {
    if (!webSettings?.Settings) return null;
    const setting = webSettings.Settings.find(s => s.Key === key);
    return setting ? setting.Value : null;
  };

  const getDomesticLCCAirlines = () => {
    const value = getSetting('DomLCCchannelcode');
    return value ? value.split(',') : [];
  };

  const getInternationalLCCAirlines = () => {
    const value = getSetting('IntLCCchannelcode');
    return value ? value.split(',') : [];
  };

  const getGSTEnabledAirlines = () => {
    const value = getSetting('GSTEnabledAirlines');
    return value ? value.split(',') : [];
  };

  const getSSRDomesticAirlines = () => {
    const value = getSetting('ShowSSRDom');
    return value ? value.split(',') : [];
  };

  const getSSRInternationalAirlines = () => {
    const value = getSetting('ShowSSRInt');
    return value ? value.split(',') : [];
  };

  const getBaggageDomesticAirlines = () => {
    const value = getSetting('ShowBaggageDom');
    return value ? value.split(',') : [];
  };

  const getBaggageInternationalAirlines = () => {
    const value = getSetting('ShowBaggageInt');
    return value ? value.split(',') : [];
  };

  const getMealDomesticAirlines = () => {
    const value = getSetting('ShowMealsDom');
    return value ? value.split(',') : [];
  };

  const getMealInternationalAirlines = () => {
    const value = getSetting('ShowMealsInt');
    return value ? value.split(',') : [];
  };

  const getSeatLayoutDomesticAirlines = () => {
    const value = getSetting('ShowSeatLayoutDom');
    return value ? value.split(',').filter(code => code.trim()) : [];
  };

  const getSeatLayoutInternationalAirlines = () => {
    const value = getSetting('ShowSeatLayoutInt');
    return value ? value.split(',').filter(code => code.trim()) : [];
  };

  const getCompulsoryBaggageAirlines = () => {
    const value = getSetting('CompulsoryBaggageAirline');
    return value ? value.split(',') : [];
  };

  const getCompulsoryBaggageAirports = () => {
    const value = getSetting('CompulsoryBaggageAirports');
    return value ? value.split('|').filter(airport => airport.trim()) : [];
  };

  const getPaymentGatewaySortOrder = () => {
    const value = getSetting('PaymentGatewaySortOrder');
    return value ? value.split(',') : [];
  };

  const getAutoCancelEnabledAirlines = () => {
    const value = getSetting('AutoCancelEnabled');
    return value ? value.split(',') : [];
  };

  const getAutoRefundEnabledAirlines = () => {
    const value = getSetting('AutoRefundEnabled');
    return value ? value.split(',') : [];
  };

  const getNDCProviders = () => {
    const value = getSetting('NDCProviders');
    return value ? value.split(',') : [];
  };

  const getGDSProviders = () => {
    const value = getSetting('GDSProviders');
    return value ? value.split(',') : [];
  };

  // Check if airline supports specific features
  const isAirlineSupported = (airlineCode, feature, isDomestic = true) => {
    if (!airlineCode) return false;
    
    let supportedAirlines = [];
    switch (feature) {
      case 'SSR':
        supportedAirlines = isDomestic ? getSSRDomesticAirlines() : getSSRInternationalAirlines();
        break;
      case 'Baggage':
        supportedAirlines = isDomestic ? getBaggageDomesticAirlines() : getBaggageInternationalAirlines();
        break;
      case 'Meals':
        supportedAirlines = isDomestic ? getMealDomesticAirlines() : getMealInternationalAirlines();
        break;
      case 'SeatLayout':
        supportedAirlines = isDomestic ? getSeatLayoutDomesticAirlines() : getSeatLayoutInternationalAirlines();
        break;
      case 'GST':
        supportedAirlines = getGSTEnabledAirlines();
        break;
      case 'CompulsoryBaggage':
        supportedAirlines = getCompulsoryBaggageAirlines();
        break;
      case 'AutoCancel':
        supportedAirlines = getAutoCancelEnabledAirlines();
        break;
      case 'AutoRefund':
        supportedAirlines = getAutoRefundEnabledAirlines();
        break;
      default:
        return false;
    }
    
    return supportedAirlines.includes(airlineCode);
  };

  const value = {
    webSettings,
    loading,
    error,
    fetchWebSettings,
    getSetting,
    getDomesticLCCAirlines,
    getInternationalLCCAirlines,
    getGSTEnabledAirlines,
    getSSRDomesticAirlines,
    getSSRInternationalAirlines,
    getBaggageDomesticAirlines,
    getBaggageInternationalAirlines,
    getMealDomesticAirlines,
    getMealInternationalAirlines,
    getSeatLayoutDomesticAirlines,
    getSeatLayoutInternationalAirlines,
    getCompulsoryBaggageAirlines,
    getCompulsoryBaggageAirports,
    getPaymentGatewaySortOrder,
    getAutoCancelEnabledAirlines,
    getAutoRefundEnabledAirlines,
    getNDCProviders,
    getGDSProviders,
    isAirlineSupported
  };

  return (
    <WebSettingsContext.Provider value={value}>
      {children}
    </WebSettingsContext.Provider>
  );
};
