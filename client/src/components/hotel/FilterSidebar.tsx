import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Button,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Stack,
  Badge,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  RotateCcw,
  SlidersHorizontal,
  List as ListIcon,
  X,
  Settings,
  Star,
  MapPin,
  DollarSign,
  Clock,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Mountain,
  Plane,
  Hotel,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react';

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
  isOpen?: boolean;
  onToggle?: () => void;
  totalHotels?: number;
  filteredHotels?: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  loading = false, 
  onFilterChange,
  isOpen = true,
  onToggle,
  totalHotels = 0,
  filteredHotels = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [searchTexts, setSearchTexts] = useState<Record<string, string>>({});

  // Debug logging (moved to useEffect to avoid rendering during render)
  useEffect(() => {
    console.log('=== FILTERSIDEBAR: PROPS ===');
    console.log('Filters:', filters);
    console.log('Total hotels:', totalHotels);
    console.log('Filtered hotels:', filteredHotels);
    console.log('Loading:', loading);
  }, [filters, totalHotels, filteredHotels, loading]);
  
  const toggleFilter = (filterCategory: string) => {
    if (!filterCategory) return;
    setExpandedFilters(prev => ({
      ...prev,
      [filterCategory]: !prev[filterCategory]
    }));
  };

  const handleFilterChange = (filterCategory: string, value: any, filterType: string) => {
    try {
      if (!filterCategory || !filterType) return;
      console.log('=== FILTERSIDEBAR: HANDLE FILTER CHANGE ===');
      console.log('Category:', filterCategory);
      console.log('Value:', value);
      console.log('Type:', filterType);
      console.log('Current selectedFilters:', selectedFilters);
      
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
        console.log('=== FILTERSIDEBAR: RANGE FILTER UPDATE ===');
        console.log('Setting range filter for category:', filterCategory);
        console.log('Range value:', value);
        newFilters[filterCategory] = value;
      } else if (filterType === 'text') {
        newFilters[filterCategory] = value;
      }
      
      console.log('=== FILTERSIDEBAR: NEW FILTERS ===');
      console.log('Updated filters:', newFilters);
      setSelectedFilters(newFilters);
      // Auto-apply filters immediately
      onFilterChange?.(newFilters);
    } catch (error) {
      console.error('Error in handleFilterChange:', error);
    }
  };

  const applyFilters = () => {
    onFilterChange?.(selectedFilters);
  };

  const handleTextSearch = (filterCategory: string, value: string) => {
    setSearchTexts(prev => ({ ...prev, [filterCategory]: value }));
    handleFilterChange(filterCategory, value, 'text');
  };

  const clearAllFilters = () => {
    console.log('=== FRONTEND: CLEARING ALL FILTERS ===');
    console.log('Selected filters before clear:', selectedFilters);
    setSelectedFilters({});
    setSearchTexts({});
    setExpandedFilters({});
    onFilterChange?.({});
    console.log('=== FRONTEND: FILTERS CLEARED ===');
  };

  // Count applied filters
  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    Object.values(selectedFilters).forEach(value => {
      if (Array.isArray(value) && value.length > 0) {
        count++;
      } else if (value && typeof value === 'object' && (value.min !== undefined || value.max !== undefined)) {
        count++;
      } else if (value && typeof value === 'string' && value.trim() !== '') {
        count++;
      }
    });
    return Number(count) || 0;
  }, [selectedFilters]);

  // Debug: Log selected filters to identify the issue (moved to useEffect to avoid rendering issues)
  useEffect(() => {
    console.log('=== FILTERSIDEBAR: SELECTED FILTERS DEBUG ===');
    console.log('Selected filters:', selectedFilters);
    console.log('Applied filters count:', appliedFiltersCount);
  }, [selectedFilters, appliedFiltersCount]);
  
  // Check for objects being rendered (moved to useEffect to avoid rendering issues)
  useEffect(() => {
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        console.log(`Filter ${key} is object:`, value);
        if (value.min !== undefined && value.max !== undefined) {
          console.log(`Price filter detected: ${key}`, value);
          console.log(`Label: ${value.label}`);
        }
      }
    });
  }, [selectedFilters]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to safely render values in JSX
  const safeRenderValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) return value.length.toString();
    if (typeof value === 'object') {
      if (value.min !== undefined && value.max !== undefined) {
        return value.label || `${value.min} - ${value.max}`;
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  const getFilterIcon = (filterType: string, filterName: string) => {
    const name = filterName.toLowerCase();
    
    if (name.includes('price') || name.includes('cost')) return <DollarSign size={20} />;
    if (name.includes('rating') || name.includes('star')) return <Star size={20} />;
    if (name.includes('location') || name.includes('area')) return <MapPin size={20} />;
    if (name.includes('amenities') || name.includes('facilities')) return <Wifi size={20} />;
    if (name.includes('room') || name.includes('bed')) return <Hotel size={20} />;
    if (name.includes('guest') || name.includes('people')) return <Users size={20} />;
    if (name.includes('time') || name.includes('duration')) return <Clock size={20} />;
    if (name.includes('date') || name.includes('check')) return <Calendar size={20} />;
    
    switch (filterType) {
      case 'range': return <SlidersHorizontal size={20} />;
      case 'list': return <ListIcon size={20} />;
      case 'text': return <Search size={20} />;
      default: return <Filter size={20} />;
    }
  };

  const renderFilterOptions = (filter: Filter) => {
    if (!filter || !filter.options || filter.options.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="body2">No options available</Typography>
        </Alert>
      );
    }
    console.log('=== FILTERSIDEBAR: RENDERING FILTER ===');
    console.log('Filter:', filter);
    console.log('Filter options:', filter.options);

    switch (filter.type) {
      case 'range':
        console.log('=== FILTERSIDEBAR: RENDERING RANGE FILTER (CHECKBOX VERSION) ===');
        console.log('Filter category:', filter.category);
        console.log('Filter options:', filter.options);
        return (
          <Box>
            {filter.options.map((option, index) => {
              if (!option) return null;
              console.log('=== FILTERSIDEBAR: RENDERING RANGE OPTION (CHECKBOX) ===');
              console.log('Selected option:', option);
              console.log('Min:', option.min, 'Max:', option.max);
              
              // Check if this option is selected
              const selectedFilter = selectedFilters[filter.category];
              const isSelected = selectedFilter && typeof selectedFilter === 'object' && selectedFilter.label === option.label;
              
              return (
                <FormControlLabel
                  key={`${filter.category}-range-${option.label || index}`}
                  control={
                    <Checkbox
                      size="small"
                      checked={isSelected}
                      onChange={() => {
                        console.log('=== FRONTEND: RANGE FILTER SELECTED (CHECKBOX) ===');
                        console.log('Selected option:', option);
                        console.log('Min:', option.min, 'Max:', option.max);
                        
                        if (isSelected) {
                          handleFilterChange(filter.category, null, 'range');
                        } else {
                          const rangeValue = {
                            min: option.min,
                            max: option.max,
                            label: option.label
                          };
                          handleFilterChange(filter.category, rangeValue, 'range');
                        }
                      }}
                    />
                  }
                  label={
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <Typography variant="body2">
                        {option && option.label ? safeRenderValue(option.label) : 'Unknown'}
                      </Typography>
                      <Chip 
                        label={option && typeof option.count === 'number' ? option.count : 0} 
                        size="small" 
                        variant="outlined"
                        sx={{ ml: 1, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  sx={{ mb: 0.5 }}
                />
              );
            })}
          </Box>
        );

      case 'list':
        return (
          <Box>
            {filter.options.map((option, index) => {
              if (!option) return null;
              console.log('=== FILTERSIDEBAR: RENDERING LIST OPTION ===');
              console.log('Option:', option);
              console.log('Option count type:', typeof option.count);
              console.log('Option count value:', option.count);
              return (
                <FormControlLabel
                  key={`${filter.category}-list-${option.value || option.label || index}`}
                  control={
                    <Checkbox
                      size="small"
                      checked={Array.isArray(selectedFilters[filter.category]) ? selectedFilters[filter.category]?.includes(String(option.value || option.label)) || false : false}
                      onChange={() => {
                        const value = String(option.value || option.label);
                        if (value && value !== 'undefined' && value !== 'null') {
                          handleFilterChange(filter.category, value, 'list');
                        }
                      }}
                    />
                  }
                  label={
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <Typography variant="body2">
                        {option && option.label ? safeRenderValue(option.label) : 'Unknown'}
                      </Typography>
                      <Chip 
                        label={option && typeof option.count === 'number' ? option.count : 0} 
                        size="small" 
                        variant="outlined"
                        sx={{ ml: 1, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  sx={{ mb: 0.5, width: '100%' }}
                />
              );
            })}
          </Box>
        );

      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            placeholder={`Search ${filter.name.toLowerCase()}...`}
            value={searchTexts[filter.category] || ''}
            onChange={(e) => handleTextSearch(filter.category, e.target.value)}
            InputProps={{
              startAdornment: <Search size={16} style={{ marginRight: 8, opacity: 0.6 }} />
            }}
            sx={{ mt: 1 }}
          />
        );

      default:
        return (
          <Alert severity="warning" sx={{ mt: 1 }}>
            <Typography variant="body2">Filter type not supported</Typography>
          </Alert>
        );
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        background: "orange",
        color: 'white'
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Filter color='#fff' size={24} />
            <Typography color='#fff' variant="h6" fontWeight="600">
              Available Hotels ({filteredHotels} / {totalHotels})
            </Typography>
            <Chip 
              label={`${Number(appliedFiltersCount) || 0} applied`} 
              size="small" 
              sx={{ 
                backgroundColor: (Number(appliedFiltersCount) || 0) > 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', 
                color: (Number(appliedFiltersCount) || 0) > 0 ? '#1976d2' : 'white',
                fontSize: '0.75rem',
                fontWeight: (Number(appliedFiltersCount) || 0) > 0 ? 'bold' : 'normal'
              }} 
            />
          </Box>
          {isMobile && (
            <IconButton onClick={onToggle} sx={{ color: 'white' }}>
              <X size={20} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="200px">
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Loading filters...
            </Typography>
          </Box>
        ) : !filters || filters.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="200px">
            <Filter size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
            <Typography variant="h6" gutterBottom>
              No filters available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try searching for hotels first
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {filters.map((filter, index) => {
              if (!filter) return null;
              return (
                <Accordion 
                  key={`filter-${filter.category || filter.name || index}`}
                  expanded={expandedFilters[filter.category]}
                  onChange={() => toggleFilter(filter.category)}
                  sx={{ 
                    boxShadow: 1,
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': { margin: 0 }
                  }}
                >
                <AccordionSummary
                  expandIcon={<ChevronDown size={20} />}
                  sx={{ 
                    minHeight: 48,
                    '&.Mui-expanded': { minHeight: 48 },
                    '& .MuiAccordionSummary-content': { 
                      margin: '8px 0',
                      '&.Mui-expanded': { margin: '8px 0' }
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5} width="100%">
                    {getFilterIcon(filter.type, filter.name)}
                    <Typography variant="subtitle2" fontWeight="500">
                      {filter.name}
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={Array.isArray(filter.options) ? filter.options.length : 0} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Fade in={expandedFilters[filter.category]} timeout={300}>
                    <Box>
                      {renderFilterOptions(filter)}
                    </Box>
                  </Fade>
                </AccordionDetails>
              </Accordion>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Action Buttons */}
      {!loading && filters && filters.length > 0 && (
        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
        }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<CheckCircle size={16} />}
              onClick={applyFilters}
              disabled={(Number(appliedFiltersCount) || 0) === 0}
              sx={{ 
                flex: 1,
                background: (Number(appliedFiltersCount) || 0) > 0 
                  ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                  : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                color: (Number(appliedFiltersCount) || 0) > 0 ? 'white' : '#666',
                '&:hover': {
                  background: (Number(appliedFiltersCount) || 0) > 0 
                    ? 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                    : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                  transform: (Number(appliedFiltersCount) || 0) > 0 ? 'translateY(-1px)' : 'none',
                  boxShadow: (Number(appliedFiltersCount) || 0) > 0 ? 2 : 0
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Apply {(Number(appliedFiltersCount) || 0) > 0 && `(${Number(appliedFiltersCount) || 0})`}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RotateCcw size={16} />}
              onClick={clearAllFilters}
              sx={{ 
                flex: 1,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 1
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Clear
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer 
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={isOpen}
      onClose={onToggle}
      sx={{
        zIndex: 1200,
        '& .MuiDrawer-paper': {
          width: isMobile ? 320 : 360,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: 'none',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          zIndex: 1200,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0,0,0,0.5)',
          },
        },
      }}
      ModalProps={{
        keepMounted: true,
        style: { zIndex: 1200 },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default FilterSidebar;