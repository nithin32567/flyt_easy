import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import axios from "axios";

export default function HotelLocationModal({
  isOpen,
  setIsOpen,
  onLocationSelect,
  searchTerm,
  setSearchTerm,
}) {
  const [autosuggestResults, setAutosuggestResults] = useState([]);
  const [isAutosuggestLoading, setIsAutosuggestLoading] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleAutoSuggest = async () => {
    if (localSearchTerm.length < 2) {
      setAutosuggestResults([]);
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsAutosuggestLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/hotel/autosuggest`, {
          params: { term: localSearchTerm },
        });

        let results = [];
        if (response.data) {
          if (response.data.locations) {
            results = response.data.locations;
          } else if (response.data.data) {
            results = response.data.data;
          } else if (Array.isArray(response.data)) {
            results = response.data;
          } else if (response.data.results) {
            results = response.data.results;
          } else if (response.data.suggestions) {
            results = response.data.suggestions;
          } else if (response.data.items) {
            results = response.data.items;
          }
        }

        setAutosuggestResults(results);
      } catch (error) {
        setAutosuggestResults([]);
      } finally {
        setIsAutosuggestLoading(false);
      }
    }, 300);
  };

  const handleLocationSelect = (location) => {
    onLocationSelect(location);
    setSearchTerm(location.fullName);
    setIsOpen(false);
  };

  const handleTrendingSearch = async (locationName) => {
    setLocalSearchTerm(locationName);
    setIsAutosuggestLoading(true);
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/hotel/autosuggest`, {
        params: { term: locationName },
      });

      let results = [];
      if (response.data) {
        if (response.data.locations) {
          results = response.data.locations;
        } else if (response.data.data) {
          results = response.data.data;
        } else if (Array.isArray(response.data)) {
          results = response.data;
        } else if (response.data.results) {
          results = response.data.results;
        } else if (response.data.suggestions) {
          results = response.data.suggestions;
        } else if (response.data.items) {
          results = response.data.items;
        }
      }

      setAutosuggestResults(results);
    } catch (error) {
      setAutosuggestResults([]);
    } finally {
      setIsAutosuggestLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed hotel_suggesestion_modal inset-0 bg-black/40 flex items-center justify-center  p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg border max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">Select Location</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <input
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f48f22]"
              type="text"
              placeholder="City, Property name or Location"
              value={localSearchTerm}
              onChange={(e) => {
                setLocalSearchTerm(e.target.value);
                if (e.target.value.length >= 2) {
                  handleAutoSuggest();
                } else {
                  setAutosuggestResults([]);
                }
              }}
            />
          
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {isAutosuggestLoading ? (
              <div className="p-4 text-center">
                <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                <span className="text-muted">Searching locations...</span>
              </div>
            ) : autosuggestResults.length > 0 ? (
              <div className="p-2">
                {autosuggestResults.map((location, index) => (
                  <div
                    key={index}
                    className="p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="font-semibold text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-600">{location.fullName}</div>
                    {location.type && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                        {location.type}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : localSearchTerm.length >= 2 ? (
              <div className="p-4 text-center text-gray-500">
                No results found for "{localSearchTerm}"
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Trending Searches:</h5>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleTrendingSearch('Mumbai, India')}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-[#f48f22] hover:text-white rounded-full transition-colors"
                    >
                      Mumbai, India
                    </button>
                    <button 
                      onClick={() => handleTrendingSearch('Chennai, India')}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-[#f48f22] hover:text-white rounded-full transition-colors"
                    >
                      Chennai, India
                    </button>
                    <button 
                      onClick={() => handleTrendingSearch('Cochin, India')}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-[#f48f22] hover:text-white rounded-full transition-colors"
                    >
                      Cochin, India
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
