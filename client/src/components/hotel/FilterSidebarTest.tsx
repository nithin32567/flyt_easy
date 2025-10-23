import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import FilterSidebar from './FilterSidebar';

// Mock data based on your API response
const mockFilterData = {
  "JSON": {
    "filters": [
      {
        "name": "Hotel Name",
        "category": "HotelName",
        "type": "text",
        "options": null
      },
      {
        "name": "Price Group",
        "category": "PriceGroup",
        "type": "range",
        "options": [
          {
            "min": 0,
            "max": 7000,
            "label": "Upto ₹7000",
            "count": 58
          },
          {
            "min": 7000,
            "max": 12000,
            "label": "₹7000 to ₹12000",
            "count": 5
          },
          {
            "min": 12000,
            "max": 28000,
            "label": "₹12000 to ₹28000",
            "count": 2
          },
          {
            "min": 28000,
            "max": -1,
            "label": "₹28000 & More",
            "count": 1
          }
        ]
      },
      {
        "name": "Locations",
        "category": "Locations",
        "type": "list",
        "options": [
          {
            "category": null,
            "value": "1000982903,1001027212,15402977,1000971858,16551193,15403210,17202690,15402703,15402924,15773110,15610776,16273038,15586282,16454855,16448917,15775369,16352945,15730776,16179257,16184510,16095678,15271802,16222262,16358369,1001126283,15197738,15541578,17514660,15403229,17210035,15777505,16274562,16073390,16298223,1001192571,16796461,16131420,17371280,16291017,17237844,1001031206,1000819533,17350830,1001180647,16459424,29129562,1000793292,16432867",
            "label": "Kandal",
            "count": 48
          }
        ]
      },
      {
        "name": "Attraction",
        "category": "Attraction",
        "type": "list",
        "options": [
          {
            "value": "11.404128,76.70798",
            "label": "Muniswarar Temple",
            "count": 0
          },
          {
            "value": "11.418877,76.71145",
            "label": "Government Botanical Gardens",
            "count": 0
          },
          {
            "value": "11.412778,76.69174",
            "label": "Government Museum",
            "count": 0
          },
          {
            "value": "11.412968,76.69929",
            "label": "Upper Bhavani Lake",
            "count": 0
          },
          {
            "value": "11.4,76.7",
            "label": "Second World War Memorial Pillar",
            "count": 0
          },
          {
            "value": "11.408446,76.70756",
            "label": "Diyanamyam Mutt",
            "count": 0
          },
          {
            "value": "11.421812,76.710686",
            "label": "Raj Bhavan",
            "count": 0
          },
          {
            "value": "11.4,76.7",
            "label": "Lady Canning's Seat",
            "count": 0
          },
          {
            "value": "11.403322,76.67638",
            "label": "Arranmore Palace",
            "count": 0
          },
          {
            "value": "11.406774,76.68799",
            "label": "Thread Garden",
            "count": 0
          },
          {
            "value": "11.40597,76.69987",
            "label": "Mudumalai National Park",
            "count": 0
          },
          {
            "value": "11.396089,76.68945",
            "label": "Cairn Hill",
            "count": 0
          },
          {
            "value": "11.421812,76.710686",
            "label": "Raj Bhawan",
            "count": 0
          },
          {
            "value": "11.394449,76.70555",
            "label": "Sri Mariamman Temple",
            "count": 0
          },
          {
            "value": "11.40106,76.73578",
            "label": "Doddabetta Peak",
            "count": 0
          },
          {
            "value": "11.414729,76.70205",
            "label": "St. Stephen's Church",
            "count": 0
          },
          {
            "value": "11.404617,76.70873",
            "label": "Ooty Rose Garden",
            "count": 0
          },
          {
            "value": "11.40432,76.68764",
            "label": "Ooty Lake",
            "count": 0
          }
        ]
      }
    ],
    "status": "success"
  }
};

const FilterSidebarTest: React.FC = () => {
  const [filters, setFilters] = useState(mockFilterData.JSON.filters);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    console.log('=== FILTER TEST: FILTERS CHANGED ===');
    console.log('New filters:', JSON.stringify(newFilters, null, 2));
    setAppliedFilters(newFilters);
  };

  const clearFilters = () => {
    setAppliedFilters({});
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        loading={false}
        onFilterChange={handleFilterChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, ml: sidebarOpen ? '360px' : 0, transition: 'margin-left 0.3s' }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Filter Sidebar Test
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            This component demonstrates how the FilterSidebar works with the new API data structure.
          </Typography>
          
          <Button 
            variant="outlined" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ mb: 2 }}
          >
            {sidebarOpen ? 'Hide' : 'Show'} Filters
          </Button>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Applied Filters
          </Typography>
          {Object.keys(appliedFilters).length === 0 ? (
            <Typography color="text.secondary">
              No filters applied
            </Typography>
          ) : (
            <Box>
              {Object.entries(appliedFilters).map(([category, value]) => (
                <Box key={category} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {category}:
                  </Typography>
                  <Typography variant="body2">
                    {Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}
                  </Typography>
                </Box>
              ))}
              <Button 
                variant="outlined" 
                color="error" 
                onClick={clearFilters}
                size="small"
              >
                Clear All Filters
              </Button>
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Data Structure
          </Typography>
          <Typography variant="body2" component="pre" sx={{ 
            bgcolor: 'grey.50', 
            p: 2, 
            borderRadius: 1, 
            overflow: 'auto',
            fontSize: '0.8rem'
          }}>
            {JSON.stringify(mockFilterData, null, 2)}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default FilterSidebarTest;