import React from 'react';
import { X, Plane, Clock, MapPin, Timer, Leaf, Shield, ShieldCheck, Luggage, Utensils, Info } from 'lucide-react';

const FlightDetailsPopup = ({ 
  isVisible, 
  flight, 
  onClose 
}) => {
  if (!isVisible || !flight) return null;

  const {
    AirlineName,
    From,
    FromName,
    To,
    ToName,
    DepartureTime,
    ArrivalTime,
    Duration,
    FlightNo,
    Refundable,
    Stops,
    Connections,
    Inclusions,
    FareClass,
    Cabin
  } = flight;

  const formatTime = (timeStr) => new Date(timeStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const getStopsText = () => {
    const stops = String(Stops || 0);
    if (stops === '0') return 'Non-stop';
    if (stops === '1') return '1 Stop';
    return `${stops} Stops`;
  };

  const getConnectionInfo = () => {
    const stops = String(Stops || 0);
    if (stops === '0' || !Connections || Connections.length === 0) return null;
    
    return Connections.map((connection, index) => {
      if (!connection || Object.keys(connection).length === 0) return null;
      return (
        <div key={index} className="text-sm text-gray-600 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>Via {connection.airport || 'Connection'}</span>
        </div>
      );
    }).filter(Boolean);
  };

  const getInclusionsIcons = () => {
    if (!Inclusions) return [];
    
    const inclusions = [];
    if (Inclusions.Baggage) inclusions.push({ icon: Luggage, text: 'Baggage', color: 'bg-blue-100 text-blue-700' });
    if (Inclusions.Meals) inclusions.push({ icon: Utensils, text: 'Meals', color: 'bg-green-100 text-green-700' });
    if (Inclusions.PieceDescription) inclusions.push({ icon: Info, text: Inclusions.PieceDescription, color: 'bg-purple-100 text-purple-700' });
    
    return inclusions;
  };

  const getCabinClass = () => {
    switch (Cabin) {
      case 'E': return { text: 'Economy', color: 'bg-blue-100 text-blue-800' };
      case 'PE': return { text: 'Premium Economy', color: 'bg-purple-100 text-purple-800' };
      case 'B': return { text: 'Business', color: 'bg-yellow-100 text-yellow-800' };
      case 'F': return { text: 'First', color: 'bg-gray-100 text-gray-800' };
      default: return { text: 'Economy', color: 'bg-blue-100 text-blue-800' };
    }
  };

  const cabinClass = getCabinClass();
  const inclusionsIcons = getInclusionsIcons();

  return (
    <div className="flight-details-overlay">
      <div className="flight-details-container">
        <div className="flight-details-header">
          <h3 className="flight-details-title">Flight Details</h3>
          <button 
            onClick={onClose}
            className="flight-details-close"
            aria-label="Close flight details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flight-details-content">
          {/* Flight Route */}
          <div className="flight-route-section">
            <div className="flight-route-header">
              <div className="flight-route-airports">
                <div className="flight-route-from">
                  <h4 className="flight-route-code">{From || 'N/A'}</h4>
                  <p className="flight-route-name">{FromName}</p>
                  <div className="flight-route-time">
                    <Clock className="w-4 h-4" />
                    <span>{DepartureTime ? formatTime(DepartureTime) : 'N/A'}</span>
                  </div>
                </div>
                
                <div className="flight-route-middle">
                  <div className="flight-route-duration">
                    <Timer className="w-4 h-4" />
                    <span>{Duration?.trim() || 'N/A'}</span>
                  </div>
                  <div className="flight-route-line">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div className="flight-route-stops">
                    {getStopsText()}
                  </div>
                </div>
                
                <div className="flight-route-to">
                  <h4 className="flight-route-code">{To || 'N/A'}</h4>
                  <p className="flight-route-name">{ToName}</p>
                  <div className="flight-route-time">
                    <Clock className="w-4 h-4" />
                    <span>{ArrivalTime ? formatTime(ArrivalTime) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {getConnectionInfo()}
          </div>

          {/* Flight Information */}
          <div className="flight-info-grid">
            <div className="flight-info-section">
              <h4 className="flight-info-title">Flight Information</h4>
              <div className="flight-info-list">
                <div className="flight-info-item">
                  <span className="flight-info-label">Flight Number:</span>
                  <span className="flight-info-value">{FlightNo?.trim() || 'N/A'}</span>
                </div>
                <div className="flight-info-item">
                  <span className="flight-info-label">Airline:</span>
                  <span className="flight-info-value">{AirlineName?.split("|")[0] || 'N/A'}</span>
                </div>
                <div className="flight-info-item">
                  <span className="flight-info-label">Fare Class:</span>
                  <span className="flight-info-value">{FareClass || 'N/A'}</span>
                </div>
                <div className="flight-info-item">
                  <span className="flight-info-label">Cabin Class:</span>
                  <span className={`flight-info-badge ${cabinClass.color}`}>
                    {cabinClass.text}
                  </span>
                </div>
                <div className="flight-info-item">
                  <span className="flight-info-label">Duration:</span>
                  <span className="flight-info-value">{Duration?.trim() || 'N/A'}</span>
                </div>
                <div className="flight-info-item">
                  <span className="flight-info-label">Stops:</span>
                  <span className="flight-info-value">{getStopsText()}</span>
                </div>
              </div>
            </div>

            <div className="flight-info-section">
              <h4 className="flight-info-title">Additional Services</h4>
              <div className="flight-services-list">
                <div className="flight-service-item">
                  <Leaf className="w-4 h-4 text-green-500" />
                  <span>Carbon Neutral Flight</span>
                </div>
                <div className="flight-service-item">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>Seat Selection Available</span>
                </div>
                <div className="flight-service-item">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Priority Boarding</span>
                </div>
                {Refundable && (
                  <div className="flight-service-item">
                    {Refundable === "Y" ? (
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span>{Refundable === "Y" ? "Refundable" : "Non-refundable"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inclusions */}
          {inclusionsIcons.length > 0 && (
            <div className="flight-inclusions-section">
              <h4 className="flight-info-title">Included Services</h4>
              <div className="flight-inclusions-list">
                {inclusionsIcons.map((inclusion, index) => (
                  <div key={index} className={`flight-inclusion-item ${inclusion.color}`}>
                    <inclusion.icon className="w-4 h-4" />
                    <span>{inclusion.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsPopup;
