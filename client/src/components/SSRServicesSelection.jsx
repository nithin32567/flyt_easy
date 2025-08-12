import React, { useState, useEffect } from 'react';
import { Package, Utensils, UserCheck, Plus, Minus, Check } from 'lucide-react';

const SSRServicesSelection = ({ 
  availableServices = [], 
  selectedServices = [], 
  onServiceSelectionChange,
  travelers = []
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedServicesState, setSelectedServicesState] = useState(selectedServices);

  useEffect(() => {
    setSelectedServicesState(selectedServices);
  }, [selectedServices]);

  const getServiceIcon = (type) => {
    switch (type) {
      case '2': // Baggage
        return <Package className="w-5 h-5 text-blue-600" />;
      case '1': // Meal
        return <Utensils className="w-5 h-5 text-orange-600" />;
      case '8': // Priority Check-in
        return <UserCheck className="w-5 h-5 text-green-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getServiceTypeName = (type) => {
    switch (type) {
      case '2':
        return 'Baggage Services';
      case '1':
        return 'Meal Services';
      case '8':
        return 'Priority Services';
      default:
        return 'Other Services';
    }
  };

  const getServiceTypeColor = (type) => {
    switch (type) {
      case '2':
        return 'border-blue-200 bg-blue-50';
      case '1':
        return 'border-orange-200 bg-orange-50';
      case '8':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const groupServicesByType = (services) => {
    return services.reduce((acc, service) => {
      const type = service.Type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(service);
      return acc;
    }, {});
  };

  const toggleCategory = (type) => {
    setExpandedCategories(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleServiceToggle = (service) => {
    const isSelected = selectedServicesState.some(s => s.ID === service.ID);
    
    let newSelectedServices;
    if (isSelected) {
      // Remove service
      newSelectedServices = selectedServicesState.filter(s => s.ID !== service.ID);
    } else {
      // Add service
      newSelectedServices = [...selectedServicesState, service];
    }
    
    setSelectedServicesState(newSelectedServices);
    onServiceSelectionChange(newSelectedServices);
  };

  const isServiceSelected = (service) => {
    return selectedServicesState.some(s => s.ID === service.ID);
  };

  const calculateTotalAmount = () => {
    return selectedServicesState.reduce((total, service) => total + service.Charge, 0);
  };

  const serviceGroups = groupServicesByType(availableServices);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Select Additional Services
          </h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Selected</div>
            <div className="text-lg font-bold text-green-600">
              ₹{calculateTotalAmount().toLocaleString()}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Choose from the available services below. Selected services will be added to your booking.
        </p>

        {/* Travelers Info */}
        {travelers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="text-sm text-blue-800 font-medium mb-1">
              Booking for {travelers.length} traveler{travelers.length > 1 ? 's' : ''}
            </div>
            <div className="text-xs text-blue-700">
              Services will be applied to all passengers in your booking
            </div>
          </div>
        )}
      </div>

      {/* Service Categories */}
      {Object.entries(serviceGroups).map(([type, services]) => (
        <div key={type} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div 
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${getServiceTypeColor(type)}`}
            onClick={() => toggleCategory(type)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getServiceIcon(type)}
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {getServiceTypeName(type)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {services.length} option{services.length > 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {expandedCategories[type] ? (
                  <Minus className="w-5 h-5 text-gray-500" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          {expandedCategories[type] && (
            <div className="border-t border-gray-200">
              {services.map((service, index) => (
                <div 
                  key={service.ID || index}
                  className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                    isServiceSelected(service) ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleServiceToggle(service)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isServiceSelected(service)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {isServiceSelected(service) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {service.Description}
                          </div>
                          {service.PieceDescription && (
                            <div className="text-sm text-gray-600">
                              {service.PieceDescription}
                            </div>
                          )}
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              Code: {service.Code}
                            </span>
                            {service.VAT > 0 && (
                              <span className="text-xs text-gray-500">
                                VAT: ₹{service.VAT}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        ₹{service.Charge.toLocaleString()}
                      </div>
                      {service.Discount > 0 && (
                        <div className="text-sm text-green-600">
                          Save ₹{service.Discount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* No Services Available */}
      {availableServices.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No Additional Services Available
          </h3>
          <p className="text-gray-600">
            This flight doesn't offer additional services at the moment.
          </p>
        </div>
      )}

      {/* Selected Services Summary */}
      {selectedServicesState.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">
            Selected Services ({selectedServicesState.length})
          </h4>
          <div className="space-y-2">
            {selectedServicesState.map((service, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-green-700">{service.Description}</span>
                <span className="font-medium text-green-800">₹{service.Charge}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-green-200 mt-3 pt-3">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-green-800">Total Additional Cost:</span>
              <span className="text-green-800">₹{calculateTotalAmount().toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SSRServicesSelection; 