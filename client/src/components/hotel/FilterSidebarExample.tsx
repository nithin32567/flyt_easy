import React, { useState } from 'react';
import FilterSidebar from './FilterSidebar';

const FilterSidebarExample: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

  const sampleFilters = [
    {
      name: 'Price Range',
      category: 'price',
      type: 'range' as const,
      options: [
        { label: 'Under ₹5,000', min: 0, max: 5000, count: 15 },
        { label: '₹5,000 - ₹10,000', min: 5000, max: 10000, count: 25 },
        { label: '₹10,000 - ₹20,000', min: 10000, max: 20000, count: 18 },
        { label: 'Above ₹20,000', min: 20000, max: 999999, count: 8 }
      ]
    },
    {
      name: 'Hotel Rating',
      category: 'rating',
      type: 'list' as const,
      options: [
        { label: '5 Star', value: '5', count: 12 },
        { label: '4 Star', value: '4', count: 28 },
        { label: '3 Star', value: '3', count: 35 },
        { label: '2 Star', value: '2', count: 15 }
      ]
    },
    {
      name: 'Amenities',
      category: 'amenities',
      type: 'list' as const,
      options: [
        { label: 'Free WiFi', value: 'wifi', count: 45 },
        { label: 'Swimming Pool', value: 'pool', count: 22 },
        { label: 'Gym', value: 'gym', count: 18 },
        { label: 'Spa', value: 'spa', count: 12 },
        { label: 'Restaurant', value: 'restaurant', count: 38 }
      ]
    },
    {
      name: 'Location',
      category: 'location',
      type: 'text' as const,
      options: null
    }
  ];

  const handleFilterChange = (filters: Record<string, any>) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <FilterSidebar
        filters={sampleFilters}
        loading={false}
        onFilterChange={handleFilterChange}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <div style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '320px' : '60px',
        transition: 'margin-left 0.3s ease',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2>Hotel Search Results</h2>
          <p>This is the main content area that adjusts based on sidebar state.</p>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Applied Filters:</h4>
            <pre style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {JSON.stringify(appliedFilters, null, 2)}
            </pre>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={toggleSidebar}
              style={{
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {isSidebarOpen ? 'Hide' : 'Show'} Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebarExample;
