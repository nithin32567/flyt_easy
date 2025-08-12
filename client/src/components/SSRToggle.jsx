import React from 'react';
import { ToggleLeft, ToggleRight, Package, Utensils, UserCheck } from 'lucide-react';

const SSRToggle = ({ isEnabled, onToggle, availableServices = [] }) => {
  const getServiceIcon = (type) => {
    switch (type) {
      case '2': // Baggage
        return <Package className="w-4 h-4" />;
      case '1': // Meal
        return <Utensils className="w-4 h-4" />;
      case '8': // Priority Check-in
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getServiceTypeName = (type) => {
    switch (type) {
      case '2':
        return 'Baggage';
      case '1':
        return 'Meals';
      case '8':
        return 'Priority Services';
      default:
        return 'Other Services';
    }
  };

  const serviceTypes = availableServices.reduce((acc, service) => {
    const type = service.Type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(service);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isEnabled ? (
              <ToggleRight className="w-6 h-6 text-green-600" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-400" />
            )}
            <span className="text-lg font-semibold text-gray-800">
              Special Service Requests (SSR)
            </span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isEnabled ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          {isEnabled 
            ? "Enable additional services like meals, extra baggage, and priority check-in for your flight."
            : "Add extra services to enhance your travel experience. You can enable this option to see available services."
          }
        </p>
      </div>

      {isEnabled && availableServices.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 mb-3">Available Services:</h4>
          {Object.entries(serviceTypes).map(([type, services]) => (
            <div key={type} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                {getServiceIcon(type)}
                <span className="font-medium text-gray-700">
                  {getServiceTypeName(type)}
                </span>
                <span className="text-sm text-gray-500">
                  ({services.length} option{services.length > 1 ? 's' : ''})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {services.slice(0, 4).map((service, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {service.Description} - ₹{service.Charge}
                  </div>
                ))}
                {services.length > 4 && (
                  <div className="text-sm text-blue-600">
                    +{services.length - 4} more options
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEnabled && availableServices.length === 0 && (
        <div className="text-center py-4">
          <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">
            No additional services available for this flight.
          </p>
        </div>
      )}
    </div>
  );
};

export default SSRToggle; 