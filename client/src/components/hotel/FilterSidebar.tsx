import { useState, useEffect } from 'react';
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
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  loading = false, 
  onFilterChange,
  isOpen = true,
  onToggle
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const applyFilters = () => {
    onFilterChange?.(selectedFilters);
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
    if (!filter.options || filter.options.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="body2">No options available</Typography>
        </Alert>
      );
    }

    switch (filter.type) {
      case 'range':
        return (
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={selectedFilters[filter.category]?.value || ''}
              onChange={(e) => handleFilterChange(filter.category, filter.options?.find(opt => opt.value === e.target.value), 'range')}
            >
              {filter.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.value || option.label}
                  control={<Radio size="small" />}
                  label={
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <Typography variant="body2">{option.label}</Typography>
                      <Chip 
                        label={option.count} 
                        size="small" 
                        variant="outlined"
                        sx={{ ml: 1, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  sx={{ mb: 0.5 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'list':
        return (
          <Box>
            {filter.options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedFilters[filter.category]?.includes(option.value || option.label) || false}
                    onChange={() => handleFilterChange(filter.category, option.value || option.label, 'list')}
                  />
                }
                label={
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="body2">{option.label}</Typography>
                    <Chip 
                      label={option.count} 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                sx={{ mb: 0.5, width: '100%' }}
              />
            ))}
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
              Filter Results
            </Typography>
            <Chip 
              label={filters?.length || 0} 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: '0.75rem'
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
            {filters.map((filter, index) => (
              <Accordion 
                key={filter.category || index}
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
                        label={filter.options?.length || 0} 
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
            ))}
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
              sx={{ 
                flex: 1,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: 2
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Apply
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