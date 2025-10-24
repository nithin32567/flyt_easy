import React, { useState } from "react";
import ShowAirports from "./modals/ShowAirports";
import { CalanderModal } from "./modals/CalanderModal";
import "./MultiCitySearch.css";

const MultiCitySearch = ({ 
  airports, 
  onSearch, 
  isSearching, 
  adults, 
  children, 
  infants, 
  travelClass,
  onTravellerClick 
}) => {
  const [segments, setSegments] = useState([
    {
      id: 1,
      from: { Code: "BOM", Name: "Mumbai" },
      to: { Code: "DEL", Name: "New Delhi" },
      date: new Date()
    }
  ]);
  const [isAirportModalOpen, setIsAirportModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [currentField, setCurrentField] = useState("from");

  const addSegment = () => {
    const newSegment = {
      id: segments.length + 1,
      from: { Code: "", Name: "" },
      to: { Code: "", Name: "" },
      date: new Date()
    };
    setSegments([...segments, newSegment]);
  };

  const removeSegment = (id) => {
    if (segments.length > 1) {
      setSegments(segments.filter(segment => segment.id !== id));
    }
  };

  const updateSegment = (id, field, value) => {
    setSegments(segments.map(segment => 
      segment.id === id ? { ...segment, [field]: value } : segment
    ));
  };

  const handleAirportSelect = (airport) => {
    if (currentSegment && currentField) {
      updateSegment(currentSegment, currentField, airport);
    }
    setIsAirportModalOpen(false);
  };

  const openAirportModal = (segmentId, field) => {
    setCurrentSegment(segmentId);
    setCurrentField(field);
    setIsAirportModalOpen(true);
  };

  const openCalendarModal = (segmentId) => {
    setCurrentSegment(segmentId);
    setIsCalendarModalOpen(true);
  };

  const handleDateSelect = (date) => {
    if (currentSegment) {
      updateSegment(currentSegment, "date", date);
    }
    setIsCalendarModalOpen(false);
  };

  const handleSearch = () => {
    // Validate all segments have required fields
    const isValid = segments.every(segment => 
      segment.from.Code && segment.to.Code && segment.date
    );
    
    if (!isValid) {
      alert("Please fill all required fields for each segment");
      return;
    }

    // Validate that segments don't have same from and to
    const hasInvalidSegment = segments.some(segment => 
      segment.from.Code === segment.to.Code
    );
    
    if (hasInvalidSegment) {
      alert("From and To cities cannot be the same in any segment");
      return;
    }

    // Convert segments to the format expected by the API
    const trips = segments.map(segment => ({
      From: segment.from.Code,
      To: segment.to.Code,
      OnwardDate: segment.date.toISOString().split("T")[0],
      ReturnDate: "",
      TUI: ""
    }));

    // console.log("Multi-city trips:", trips);
    onSearch(trips);
  };

  return (
    <div className="multi-city-search">
      <div className="segments-container">
        {segments.map((segment, index) => (
          <div key={segment.id} className="segment-row">
            <div className="segment-header">
              <h6>Segment {index + 1}</h6>
              {segments.length > 1 && (
                <button 
                  className="remove-segment-btn"
                  onClick={() => removeSegment(segment.id)}
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="segment-content">
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <button
                    className="select-items"
                    onClick={() => openAirportModal(segment.id, "from")}
                  >
                    <h6>FROM</h6>
                    <h2>
                      {segment.from?.Name || "Select City"} {segment.from?.Code || ""}
                    </h2>
                    <p>
                      [{segment.from?.Code || "Select"}] {segment.from?.Name || "City"}
                    </p>
                  </button>
                </div>
                
                <div className="col-lg-4 col-md-6">
                  <button
                    className="select-items"
                    onClick={() => openAirportModal(segment.id, "to")}
                  >
                    <h6>TO</h6>
                    <h2>
                      {segment.to?.Name || "Select City"} {segment.to?.Code || ""}
                    </h2>
                    <p>
                      [{segment.to?.Code || "Select"}] {segment.to?.Name || "City"}
                    </p>
                  </button>
                </div>
                
                <div className="col-lg-4 col-md-6">
                  <button
                    className="select-items"
                    onClick={() => openCalendarModal(segment.id)}
                  >
                    <h6>DEPART</h6>
                    <h2>
                      {segment.date.getDate()}{" "}
                      <span>
                        {segment.date.toLocaleString("default", {
                          month: "short",
                        })}
                      </span>
                    </h2>
                    <p>
                      {segment.date.toLocaleString("default", {
                        weekday: "long",
                      })}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-segment-section">
        <button 
          className="add-segment-btn"
          onClick={addSegment}
        >
          + Add Another City
        </button>
      </div>

      <div className="search-section">
        <div className="row">
          <div className="col-lg-3 col-md-4">
            <button
              className="select-items"
              onClick={onTravellerClick}
            >
              <h6>Travellers</h6>
              <h2>
                {adults + children + infants}{" "}
                <span>Travellers</span>
              </h2>
              <p>{travelClass}</p>
            </button>
          </div>
          <div className="col-lg-3">
            <button
              className="search-btn"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Airport Selection Modal */}
      <ShowAirports
        isOpen={isAirportModalOpen}
        setIsOpen={setIsAirportModalOpen}
        airports={airports}
        onSelect={handleAirportSelect}
        label={currentField === "from" ? "From" : "To"}
      />

      {/* Calendar Modal */}
      {isCalendarModalOpen && (
        <CalanderModal
          isOpen={isCalendarModalOpen}
          setIsOpen={setIsCalendarModalOpen}
          setDate={handleDateSelect}
        />
      )}
    </div>
  );
};

export default MultiCitySearch; 