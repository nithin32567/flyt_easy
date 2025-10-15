import  { useState } from 'react';

interface FilterOption {
  min?: number;
  max?: number;
  label: string;
  count: number;
  value?: string;
  category?: string;
}

interface Filter {
  name: string;
  category: string;
  type: 'text' | 'range' | 'list';
  options: FilterOption[] | null;
}

interface FilterSidebarProps {
  filters: Filter[];
  loading?: boolean;
  onFilterChange?: (filters: Record<string, any>) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  loading = false, 
  onFilterChange 
}) => {
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [searchTexts, setSearchTexts] = useState<Record<string, string>>({});

  const toggleFilter = (filterCategory: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterCategory]: !prev[filterCategory]
    }));
  };

  const handleFilterChange = (filterCategory: string, value: any, filterType: string) => {
    const newFilters = { ...selectedFilters };
    
    if (filterType === 'list') {
      if (!newFilters[filterCategory]) {
        newFilters[filterCategory] = [];
      }
      
      if (newFilters[filterCategory].includes(value)) {
        newFilters[filterCategory] = newFilters[filterCategory].filter((v: any) => v !== value);
      } else {
        newFilters[filterCategory] = [...newFilters[filterCategory], value];
      }
    } else if (filterType === 'range') {
      newFilters[filterCategory] = value;
    } else if (filterType === 'text') {
      newFilters[filterCategory] = value;
    }
    
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleTextSearch = (filterCategory: string, value: string) => {
    setSearchTexts(prev => ({ ...prev, [filterCategory]: value }));
    handleFilterChange(filterCategory, value, 'text');
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchTexts({});
    onFilterChange?.({});
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderFilterOptions = (filter: Filter) => {
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
                  checked={selectedFilters[filter.category] === option}
                  onChange={() => handleFilterChange(filter.category, option, 'range')}
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
                  checked={selectedFilters[filter.category]?.includes(option.value || option.label) || false}
                  onChange={() => handleFilterChange(filter.category, option.value || option.label, 'list')}
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
                value={searchTexts[filter.category] || ''}
                onChange={(e) => handleTextSearch(filter.category, e.target.value)}
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

  if (loading) {
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

  if (!filters || filters.length === 0) {
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

  return (
    <div className="hotel-filters">
      <div className="row">
        <div className="col-12">
          <h4 className="mb-3">
            <i className="fas fa-filter me-2"></i>
            Filter Hotels ({filters.length} filters available)
          </h4>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="accordion" id="filtersAccordion">
            {filters.map((filter, index) => (
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
            <button className="btn btn-outline-secondary" onClick={clearAllFilters}>
              <i className="fas fa-undo me-2"></i>
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;