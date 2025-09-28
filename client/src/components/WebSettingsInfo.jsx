import React from 'react';
import { useWebSettingsData } from '../hooks/useWebSettingsData';

/**
 * Component to display WebSettings information for debugging/development
 */
const WebSettingsInfo = () => {
  const { 
    webSettings, 
    loading, 
    error, 
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
    getPaymentGateways,
    getAutoCancelEnabledAirlines,
    getAutoRefundEnabledAirlines,
    getNDCProviders,
    getGDSProviders
  } = useWebSettingsData();

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800">WebSettings</h3>
        <p className="text-blue-600">Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800">WebSettings Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!webSettings) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800">WebSettings</h3>
        <p className="text-yellow-600">No settings available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">WebSettings Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Domestic LCC Airlines</h4>
          <p className="text-sm text-gray-600">{getDomesticLCCAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">International LCC Airlines</h4>
          <p className="text-sm text-gray-600">{getInternationalLCCAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">GST Enabled Airlines</h4>
          <p className="text-sm text-gray-600">{getGSTEnabledAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">SSR Domestic Airlines</h4>
          <p className="text-sm text-gray-600">{getSSRDomesticAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">SSR International Airlines</h4>
          <p className="text-sm text-gray-600">{getSSRInternationalAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Baggage Domestic Airlines</h4>
          <p className="text-sm text-gray-600">{getBaggageDomesticAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Baggage International Airlines</h4>
          <p className="text-sm text-gray-600">{getBaggageInternationalAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Meal Domestic Airlines</h4>
          <p className="text-sm text-gray-600">{getMealDomesticAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Meal International Airlines</h4>
          <p className="text-sm text-gray-600">{getMealInternationalAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Seat Layout Domestic Airlines</h4>
          <p className="text-sm text-gray-600">{getSeatLayoutDomesticAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Seat Layout International Airlines</h4>
          <p className="text-sm text-gray-600">{getSeatLayoutInternationalAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Compulsory Baggage Airlines</h4>
          <p className="text-sm text-gray-600">{getCompulsoryBaggageAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Compulsory Baggage Airports</h4>
          <p className="text-sm text-gray-600">{getCompulsoryBaggageAirports().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Payment Gateway Order</h4>
          <p className="text-sm text-gray-600">{getPaymentGateways().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Auto Cancel Enabled Airlines</h4>
          <p className="text-sm text-gray-600">{getAutoCancelEnabledAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">Auto Refund Enabled Airlines</h4>
          <p className="text-sm text-gray-600">{getAutoRefundEnabledAirlines().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">NDC Providers</h4>
          <p className="text-sm text-gray-600">{getNDCProviders().join(', ')}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-700">GDS Providers</h4>
          <p className="text-sm text-gray-600">{getGDSProviders().join(', ')}</p>
        </div>
      </div>
      
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium text-gray-700">Raw WebSettings Data</h4>
        <pre className="text-xs text-gray-600 overflow-auto max-h-40">
          {JSON.stringify(webSettings, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WebSettingsInfo;
