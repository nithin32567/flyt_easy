import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, Alert } from '@mui/material';
import { Bug, Filter, Search, RefreshCw } from 'lucide-react';

interface FilterDebuggerProps {
  searchId?: string;
  totalHotels?: number;
  filteredHotels?: number;
  filters?: any[];
  onTestFilter?: (filters: any) => void;
}

const FilterDebugger: React.FC<FilterDebuggerProps> = ({
  searchId,
  totalHotels = 0,
  filteredHotels = 0,
  filters = [],
  onTestFilter
}) => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Auto-show debugger in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  const runDiagnostics = () => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      searchId: searchId || 'Not available',
      totalHotels,
      filteredHotels,
      filtersCount: filters.length,
      hasSearchId: !!searchId,
      hasFilters: filters.length > 0,
      filterTypes: filters.map(f => f.type || 'unknown'),
      apiEndpoints: {
        filter: `/api/hotel/filter/${searchId}`,
        filterData: `/api/hotel/filterdata/${searchId}`,
        workflow: `/api/hotel/workflow/${searchId}`
      }
    };

    setDebugInfo(diagnostics);
    console.log('=== FILTER DEBUGGER DIAGNOSTICS ===', diagnostics);
  };

  const testPriceFilter = () => {
    const priceFilter = {
      PriceGroup: {
        min: 1000,
        max: 5000,
        label: '₹1000 - ₹5000'
      }
    };
    onTestFilter?.(priceFilter);
  };

  const testStarRatingFilter = () => {
    const starFilter = {
      StarRating: ['3', '4', '5']
    };
    onTestFilter?.(starFilter);
  };

  const testFacilitiesFilter = () => {
    const facilitiesFilter = {
      Facilities: ['1', '5', '14'] // WiFi, Breakfast, Restaurant
    };
    onTestFilter?.(facilitiesFilter);
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        startIcon={<Bug size={16} />}
        size="small"
        variant="outlined"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        Debug Filters
      </Button>
    );
  }

  return (
    <Card sx={{ 
      position: 'fixed', 
      bottom: 16, 
      right: 16, 
      width: 400, 
      maxHeight: '80vh', 
      overflow: 'auto',
      zIndex: 1000,
      boxShadow: 3
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <Bug size={20} />
            Filter Debugger
          </Typography>
          <Button size="small" onClick={() => setIsVisible(false)}>×</Button>
        </Box>

        <Box mb={2}>
          <Button
            onClick={runDiagnostics}
            startIcon={<RefreshCw size={16} />}
            variant="contained"
            size="small"
            fullWidth
          >
            Run Diagnostics
          </Button>
        </Box>

        {debugInfo.timestamp && (
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>System Status</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip 
                label={`Search ID: ${debugInfo.hasSearchId ? '✓' : '✗'}`}
                color={debugInfo.hasSearchId ? 'success' : 'error'}
                size="small"
              />
              <Chip 
                label={`Filters: ${debugInfo.filtersCount}`}
                color={debugInfo.filtersCount > 0 ? 'success' : 'warning'}
                size="small"
              />
              <Chip 
                label={`Hotels: ${filteredHotels}/${totalHotels}`}
                color="info"
                size="small"
              />
            </Box>
          </Box>
        )}

        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>Test Filters</Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Button
              onClick={testPriceFilter}
              startIcon={<Filter size={16} />}
              variant="outlined"
              size="small"
            >
              Test Price Filter
            </Button>
            <Button
              onClick={testStarRatingFilter}
              startIcon={<Filter size={16} />}
              variant="outlined"
              size="small"
            >
              Test Star Rating
            </Button>
            <Button
              onClick={testFacilitiesFilter}
              startIcon={<Filter size={16} />}
              variant="outlined"
              size="small"
            >
              Test Facilities
            </Button>
          </Box>
        </Box>

        {debugInfo.apiEndpoints && (
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>API Endpoints</Typography>
            <Box display="flex" flexDirection="column" gap={0.5}>
              {Object.entries(debugInfo.apiEndpoints).map(([key, value]) => (
                <Typography key={key} variant="caption" display="block">
                  {key}: {value}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {!searchId && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            No Search ID available. Please initiate a hotel search first.
          </Alert>
        )}

        {filters.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No filter data available. Check if the filter API is working.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterDebugger;
