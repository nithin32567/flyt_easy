import React, { useState } from "react";
import { 
  Plane, 
  Clock, 
  MapPin, 
  Timer, 
  Luggage, 
  Utensils, 
  Shield, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Leaf,
  Info,
  PlaneTakeoff,
  PlaneLanding
} from "lucide-react";

// Import airline logos
import indigoLogo from '../assets/img/indigo.jpg';
import spicejetLogo from '../assets/img/spicejet.jpg';
import emiratesLogo from '../assets/img/emirates.jpg';
import ethihadLogo from '../assets/img/ethihad.jpg';
import airarabiaLogo from '../assets/img/airarabia.jpg';
import flydubaiLogo from '../assets/img/flydubai.jpg';
import gulfAirLogo from '../assets/img/gulf-air.jpg';
import saudiArabiaLogo from '../assets/img/saudi-arabia-airlines.jpg';
import singaporeAirlinesLogo from '../assets/img/singapore-airlines.jpg';
import thaiLogo from '../assets/img/thai.jpg';
import malaysiaLogo from '../assets/img/malaysia.jpg';
import piaLogo from '../assets/img/pia.jpg';
import iarindiaLogo from '../assets/img/iarindia.jpg';
import Accordion, {
  accordionClasses,
} from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails, {
  accordionDetailsClasses,
} from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

const FlightCard = ({ flight, setSelectedFlight, isSelected = false, tripType = "onward" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to get airline logo based on airline name
  const getAirlineLogo = (airlineName) => {
    if (!airlineName) return null;
    
    const name = airlineName.toLowerCase();
    
    if (name.includes('indigo')) return indigoLogo;
    if (name.includes('spicejet')) return spicejetLogo;
    if (name.includes('emirates')) return emiratesLogo;
    if (name.includes('etihad')) return ethihadLogo;
    if (name.includes('air arabia') || name.includes('airarabia')) return airarabiaLogo;
    if (name.includes('flydubai')) return flydubaiLogo;
    if (name.includes('gulf air')) return gulfAirLogo;
    if (name.includes('saudi arabia')) return saudiArabiaLogo;
    if (name.includes('singapore')) return singaporeAirlinesLogo;
    if (name.includes('thai')) return thaiLogo;
    if (name.includes('malaysia')) return malaysiaLogo;
    if (name.includes('pia')) return piaLogo;
    if (name.includes('air india') || name.includes('airindia')) return iarindiaLogo;
    
    return null;
  };
  
  const {
    AirlineName,
    From,
    FromName,
    To,
    ToName,
    DepartureTime,
    ArrivalTime,
    Duration,
    GrossFare,
    FlightNo,
    Refundable,
    Stops,
    Segments,
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
        <div key={index} className="text-xs text-gray-500 mt-1 flex items-center gap-1">
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

  const getStopsColor = () => {
    const stops = String(Stops || 0);
    if (stops === '0') return 'text-yellow-700 bg-yellow-100';
    if (stops === '1') return 'text-yellow-600 bg-yellow-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const handleSelectFlight = async () => {
    setIsLoading(true);
    try {
      await setSelectedFlight(flight);
    } finally {
      setIsLoading(false);
    }
  };

  const cabinClass = getCabinClass();
  const inclusionsIcons = getInclusionsIcons();
  const stopsColor = getStopsColor();

  return (
    <div 
      className={`relative bg-white backdrop-blur-sm rounded-3xl py-2 px-4 flex flex-col gap- sm:gap-4 hover:-translate-y-1 transition-all duration-300 border-l ${
        isSelected 
          ? ' bg-yellow-50/80'  
          : 'border-l-gradient-to-b from-yellow-500 to-amber-500'
      }`}
      role="article"
      aria-label={`Flight from ${From} to ${To} by ${AirlineName?.split("|")[0] || 'Unknown Airline'}`}
    >
      {/* Trip Type Badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        {tripType === "return" && (
          <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 sm:px-3 rounded-full flex items-center gap-1">
            <Plane className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Return Flight</span>
            <span className="sm:hidden">Return</span>
          </div>
        )}
      </div>
      
      {/* Airline Info */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-100 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gray-200">
            {getAirlineLogo(AirlineName) ? (
              <img  width={100} height={100}
                src={getAirlineLogo(AirlineName)} 
                alt={`${AirlineName?.split("|")[0] || 'Airline'} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
        
            <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${cabinClass.color}`}>
                {cabinClass.text}
              </span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                #{FlightNo?.trim() || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Route & Timing */}
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col sm:flex-1">
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{From || 'N/A'}</p>
            <p className="text-xs text-gray-500">{FromName}</p>
            <div className="flex items-center gap-1 mt-1">
             
              <p className="text-sm font-bold text-gray-600 flex items-center gap-1">
              <span> <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" /></span>  {DepartureTime ? formatTime(DepartureTime) : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-1 mx-2 sm:mx-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">{Duration?.trim() || 'N/A'}</span>
            </div>
            
            {/* Animated Flight Path */}
            <div className="relative w-full">
              <div className="flex items-center justify-between">
                <PlaneTakeoff className="w-4 h-4 text-yellow-500" />
                <div className="flex-1 mx-2">
                  <div className="h-0.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 animate-pulse"></div>
                    {/* Connection points */}
                    {Connections && Connections.length > 0 && Connections.map((_, index) => (
                      <div key={index} className="absolute w-2 h-2 bg-yellow-500 rounded-full -top-1" 
                           style={{ left: `${(index + 1) * (100 / (Connections.length + 1))}%` }}></div>
                    ))}
                  </div>
                </div>
                <PlaneLanding className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            
            <div className={`text-xs font-medium px-2 py-1 rounded-full mt-2 ${stopsColor}`}>
              {getStopsText()}
            </div>
            {getConnectionInfo()}
          </div>
          
          <div className="flex flex-col text-right sm:flex-1">
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{To || 'N/A'}</p>
            <p className="text-xs text-gray-500">{ToName}</p>
            <div className="flex items-center gap-1 mt-1 justify-end">
              <p className="text-sm font-bold text-gray-600 flex items-center gap-1 "> 
              <span> <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" /></span>  {ArrivalTime ? formatTime(ArrivalTime) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col">
          <div className="bg-gradient-to-r from-[var(--PrimaryColor)] font-bold to-[var(--LightBg)] text-white flex justify-center items-center rounded-xl p-2">
            <p className="font-extrabold text-white">₹ {GrossFare || 'N/A'}</p>
            <div className="flex items-center gap-1 justify-center ">
              <Plane className="w-3 h-3 text-[var(--whitecolor)] " />
              <span className="text-xs text-[var(--PrimaryColor)]">Best Price</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end sm:justify-start">
          {/* <button 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Save flight to favorites"
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button> */}
          <button
            onClick={handleSelectFlight}
            disabled={isLoading}
            style={{borderRadius: '10px'}}
            className={`px-4 sm:px-2 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
              isSelected 
                ? 'border-2 bg-[var(--PrimaryColor)] text-white rounded-md ' 
                : 'bg-gradient-to-r from-[var(--YellowColor)] to-[var(--YellowColor)] text-white hover:shadow-sm'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isSelected ? "Flight selected" : "Select this flight"}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" aria-hidden="true"></div>
                <span className="hidden sm:inline">Loading...</span>
                <span className="sm:hidden">...</span>
              </div>
            ) : isSelected ? (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Selected</span>
                <span className="sm:hidden">✓</span>
              </div>
            ) : (
              <>
                <span className="hidden sm:inline">Select Flight</span>
                <span className="sm:hidden">Select</span>
              </>
            )}
          </button>
        </div>
      </div>
      </div>

      {/* Inclusions */}
      {inclusionsIcons.length > 0 && (
        <div className="bg-gray-50/80 rounded-xl p-3">
          <div className="flex flex-wrap gap-2">
            {inclusionsIcons.map((inclusion, index) => (
              <div key={index} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${inclusion.color}`}>
                <inclusion.icon className="w-3 h-3 flex-shrink-0" />
                <span>{inclusion.text}</span>
              </div>
            ))}
            {Refundable && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                Refundable === "Y" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {Refundable === "Y" ? <ShieldCheck className="w-3 h-3 flex-shrink-0" /> : <X className="w-3 h-3 flex-shrink-0" />}
                <span>{Refundable === "Y" ? "Refundable" : "Non-refundable"}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing & Booking */}
    

      {/* Expandable Details Accordion */}
      <Accordion
        expanded={isExpanded}
        onChange={() => setIsExpanded(!isExpanded)}
        slots={{ transition: Fade }}
        slotProps={{ transition: { timeout: 400 } }}
        sx={[
          {
            boxShadow: 'none',
            '&:before': {
              display: 'none',
            },
            '&.Mui-expanded': {
              margin: 0,
            },
          },
          isExpanded
            ? {
                [`& .${accordionClasses.region}`]: {
                  height: 'auto',
                },
                [`& .${accordionDetailsClasses.root}`]: {
                  display: 'block',
                },
              }
            : {
                [`& .${accordionClasses.region}`]: {
                  height: 0,
                },
                [`& .${accordionDetailsClasses.root}`]: {
                  display: 'none',
                },
              },
        ]}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="flight-details-content"
          id="flight-details-header"
          sx={{
            backgroundColor: 'transparent',
            padding: 0,
            minHeight: 'auto',
            '&.Mui-expanded': {
              minHeight: 'auto',
            },
            '& .MuiAccordionSummary-content': {
              margin: 0,
              '&.Mui-expanded': {
                margin: 0,
              },
            },
          }}
        >
          <Typography component="span" sx={{ display: 'none' }}>
            Flight Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0, boxShadow: 'none' }}>
          <div className="mt-4 p-4 bg-gray-50/80 rounded-xl border-t border-gray-200" role="region" aria-label="Flight details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Flight Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Flight Number:</span> {FlightNo?.trim() || 'N/A'}</p>
                  <p><span className="font-medium">Fare Class:</span> {FareClass || 'N/A'}</p>
                  <p><span className="font-medium">Duration:</span> {Duration?.trim() || 'N/A'}</p>
                  <p><span className="font-medium">Stops:</span> {getStopsText()}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Additional Info</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span>Carbon Neutral Flight</span>
                  </div>
                  <p>Seat Selection Available</p>
                  <p>Priority Boarding</p>
                </div>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      
    </div>
  );
};

export default FlightCard;
