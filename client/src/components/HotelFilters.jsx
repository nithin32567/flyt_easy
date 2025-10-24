import React, { useState } from 'react';

const HotelFilters = ({ hotelFilters, hotelFiltersLoading }) => {
  const [expandedFilters, setExpandedFilters] = useState({});

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (hotelFiltersLoading) {
    return (
      <div className="hotel-filters-loading">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading filters...</p>
        </div>
      </div>
    );
  }

  if (!hotelFilters || hotelFilters.length === 0) {
    return (
      <div className="hotel-filters-empty">
        <div className="text-center p-4">
          <i className="fas fa-filter fa-3x text-muted mb-3"></i>
          <h5>No filters available</h5>
          <p className="text-muted">Try searching for hotels first</p>
        </div>
      </div>
    );
  }

  const renderFilterOptions = (filter) => {
    if (!filter.options || filter.options.length === 0) {
      return (
        <div className="text-muted">
          <small>No options available</small>
        </div>
      );
    }

    switch (filter.type) {
      case 'range':
        return (
          <div className="filter-options">
            {filter.options.map((option, index) => (
              <div key={index} className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name={`filter-${filter.category}`}
                  id={`${filter.category}-${index}`}
                />
                <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`${filter.category}-${index}`}>
                  <span>{option.label}</span>
                  <span className="badge bg-secondary">{option.count}</span>
                </label>
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="filter-options">
            {filter.options.map((option, index) => (
              <div key={index} className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id={`${filter.category}-${index}`}
                />
                <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`${filter.category}-${index}`}>
                  <span>{option.label}</span>
                  <span className="badge bg-secondary">{option.count}</span>
                </label>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="filter-options">
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder={`Search ${filter.name.toLowerCase()}...`}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-muted">
            <small>Filter type not supported</small>
          </div>
        );
    }
  };

  return (
    <div className="hotel-filters">
      <div className="row">
        <div className="col-12">
          <h4 className="mb-3">
            <i className="fas fa-filter me-2"></i>
            Filter Hotels ({hotelFilters.length} filters available)
          </h4>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="accordion" id="filtersAccordion">
            {hotelFilters.map((filter, index) => (
              <div key={filter.category || index} className="accordion-item">
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button 
                    className={`accordion-button ${expandedFilters[filter.category] ? '' : 'collapsed'}`}
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#collapse${index}`}
                    aria-expanded={expandedFilters[filter.category] ? 'true' : 'false'}
                    aria-controls={`collapse${index}`}
                    onClick={() => toggleFilter(filter.category)}
                  >
                    <div className="d-flex justify-content-between align-items-center w-100 me-3">
                      <span>
                        <i className={`fas fa-${filter.type === 'range' ? 'sliders-h' : filter.type === 'list' ? 'list' : 'search'} me-2`}></i>
                        {filter.name}
                      </span>
                      <span className="badge bg-primary">
                        {filter.options ? filter.options.length : 0} options
                      </span>
                    </div>
                  </button>
                </h2>
                <div 
                  id={`collapse${index}`} 
                  className={`accordion-collapse collapse ${expandedFilters[filter.category] ? 'show' : ''}`}
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#filtersAccordion"
                >
                  <div className="accordion-body">
                    {renderFilterOptions(filter)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-12">
          <div className="d-flex gap-2">
            <button className="btn btn-primary">
              <i className="fas fa-search me-2"></i>
              Apply Filters
            </button>
            <button className="btn btn-outline-secondary">
              <i className="fas fa-undo me-2"></i>
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelFilters;
