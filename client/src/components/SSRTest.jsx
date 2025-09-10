import React, { useState } from 'react';
import SSRToggle from './SSRToggle';
import SSRServicesSelection from './SSRServicesSelection';

const SSRTest = () => {
  const [ssrEnabled, setSsrEnabled] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  // Mock SSR services data for testing
  const mockSSRServices = [
    {
      ID: 1,
      Code: "FFWD",
      Description: "Priority Check-In",
      Charge: 450.0,
      Type: "8",
      VAT: 0.0,
      Discount: 0.0
    },
    {
      ID: 2,
      Code: "CPML",
      Description: "Meal Code",
      Charge: 650.0,
      Type: "1",
      VAT: 0.0,
      Discount: 0.0
    },
    {
      ID: 3,
      Code: "XBPE",
      Description: "Prepaid Excess Baggage – 3 Kg",
      Charge: 1650.0,
      Type: "2",
      VAT: 0.0,
      Discount: 0.0
    },
    {
      ID: 4,
      Code: "XBPA",
      Description: "Prepaid Excess Baggage – 5 Kg",
      Charge: 2750.0,
      Type: "2",
      VAT: 0.0,
      Discount: 0.0
    }
  ];

  const handleSSRToggle = (enabled) => {
    setSsrEnabled(enabled);
    if (!enabled) {
      setSelectedServices([]);
    }
  };

  const handleServiceSelection = (services) => {
    setSelectedServices(services);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">SSR Feature Test</h1>
        
        <div className="space-y-8">
          <SSRToggle
            isEnabled={ssrEnabled}
            onToggle={handleSSRToggle}
            availableServices={ssrEnabled ? mockSSRServices : []}
          />
          
          {ssrEnabled && (
            <SSRServicesSelection
              availableServices={mockSSRServices}
              selectedServices={selectedServices}
              onServiceSelectionChange={handleServiceSelection}
              travelers={[
                { ID: 1, FName: "John", LName: "Doe", PTC: "ADT" },
                { ID: 2, FName: "Jane", LName: "Doe", PTC: "ADT" }
              ]}
            />
          )}
          
          {/* Debug Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Debug Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">SSR Enabled:</span> {ssrEnabled ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">Selected Services:</span> {selectedServices.length}
              </div>
              <div>
                <span className="font-medium">Total Amount:</span> ₹{selectedServices.reduce((total, service) => total + (service.SSRNetAmount || service.Charge), 0).toLocaleString()}
              </div>
              {selectedServices.length > 0 && (
                <div>
                  <span className="font-medium">Selected Services:</span>
                  <ul className="ml-4 mt-1">
                    {selectedServices.map((service, index) => (
                      <li key={index}>
                        {service.Description} - ₹{service.SSRNetAmount || service.Charge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSRTest; 