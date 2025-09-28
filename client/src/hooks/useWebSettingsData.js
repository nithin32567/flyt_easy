import { useWebSettings } from '../contexts/WebSettingsContext';

/**
 * Custom hook for accessing WebSettings data with common utility functions
 */
export const useWebSettingsData = () => {
  const webSettingsContext = useWebSettings();

  /**
   * Check if an airline supports a specific feature
   * @param {string} airlineCode - The airline code (e.g., '6E', 'SG')
   * @param {string} feature - The feature to check ('SSR', 'Baggage', 'Meals', 'SeatLayout', 'GST', 'CompulsoryBaggage', 'AutoCancel', 'AutoRefund')
   * @param {boolean} isDomestic - Whether it's a domestic flight (default: true)
   * @returns {boolean} - Whether the airline supports the feature
   */
  const isAirlineSupported = (airlineCode, feature, isDomestic = true) => {
    return webSettingsContext.isAirlineSupported(airlineCode, feature, isDomestic);
  };

  /**
   * Get all airlines that support a specific feature
   * @param {string} feature - The feature to check
   * @param {boolean} isDomestic - Whether it's domestic flights (default: true)
   * @returns {Array<string>} - Array of airline codes
   */
  const getAirlinesForFeature = (feature, isDomestic = true) => {
    switch (feature) {
      case 'SSR':
        return isDomestic 
          ? webSettingsContext.getSSRDomesticAirlines()
          : webSettingsContext.getSSRInternationalAirlines();
      case 'Baggage':
        return isDomestic 
          ? webSettingsContext.getBaggageDomesticAirlines()
          : webSettingsContext.getBaggageInternationalAirlines();
      case 'Meals':
        return isDomestic 
          ? webSettingsContext.getMealDomesticAirlines()
          : webSettingsContext.getMealInternationalAirlines();
      case 'SeatLayout':
        return isDomestic 
          ? webSettingsContext.getSeatLayoutDomesticAirlines()
          : webSettingsContext.getSeatLayoutInternationalAirlines();
      case 'GST':
        return webSettingsContext.getGSTEnabledAirlines();
      case 'CompulsoryBaggage':
        return webSettingsContext.getCompulsoryBaggageAirlines();
      case 'AutoCancel':
        return webSettingsContext.getAutoCancelEnabledAirlines();
      case 'AutoRefund':
        return webSettingsContext.getAutoRefundEnabledAirlines();
      case 'LCC':
        return isDomestic 
          ? webSettingsContext.getDomesticLCCAirlines()
          : webSettingsContext.getInternationalLCCAirlines();
      default:
        return [];
    }
  };

  /**
   * Check if baggage is compulsory for an airline or airport
   * @param {string} airlineCode - The airline code
   * @param {string} airportCode - The airport code (optional)
   * @returns {boolean} - Whether baggage is compulsory
   */
  const isBaggageCompulsory = (airlineCode, airportCode = null) => {
    const compulsoryAirlines = webSettingsContext.getCompulsoryBaggageAirlines();
    const compulsoryAirports = webSettingsContext.getCompulsoryBaggageAirports();
    
    const isAirlineCompulsory = compulsoryAirlines.includes(airlineCode);
    const isAirportCompulsory = airportCode && compulsoryAirports.includes(airportCode);
    
    return isAirlineCompulsory || isAirportCompulsory;
  };

  /**
   * Get payment gateway sort order
   * @returns {Array<string>} - Array of payment gateway codes in order
   */
  const getPaymentGateways = () => {
    return webSettingsContext.getPaymentGatewaySortOrder();
  };

  /**
   * Check if an airline is a Low Cost Carrier (LCC)
   * @param {string} airlineCode - The airline code
   * @param {boolean} isDomestic - Whether it's domestic (default: true)
   * @returns {boolean} - Whether the airline is an LCC
   */
  const isLCC = (airlineCode, isDomestic = true) => {
    const lccAirlines = isDomestic 
      ? webSettingsContext.getDomesticLCCAirlines()
      : webSettingsContext.getInternationalLCCAirlines();
    return lccAirlines.includes(airlineCode);
  };

  /**
   * Get NDC (New Distribution Capability) providers
   * @returns {Array<string>} - Array of NDC provider codes
   */
  const getNDCProviders = () => {
    return webSettingsContext.getNDCProviders();
  };

  /**
   * Get GDS (Global Distribution System) providers
   * @returns {Array<string>} - Array of GDS provider codes
   */
  const getGDSProviders = () => {
    return webSettingsContext.getGDSProviders();
  };

  /**
   * Check if an airline is an NDC provider
   * @param {string} airlineCode - The airline code
   * @returns {boolean} - Whether the airline is an NDC provider
   */
  const isNDCProvider = (airlineCode) => {
    return webSettingsContext.getNDCProviders().includes(airlineCode);
  };

  /**
   * Check if an airline is a GDS provider
   * @param {string} airlineCode - The airline code
   * @returns {boolean} - Whether the airline is a GDS provider
   */
  const isGDSProvider = (airlineCode) => {
    return webSettingsContext.getGDSProviders().includes(airlineCode);
  };

  /**
   * Get a specific setting value by key
   * @param {string} key - The setting key
   * @returns {string|null} - The setting value or null if not found
   */
  const getSetting = (key) => {
    return webSettingsContext.getSetting(key);
  };

  /**
   * Get all available features for an airline
   * @param {string} airlineCode - The airline code
   * @param {boolean} isDomestic - Whether it's domestic (default: true)
   * @returns {Object} - Object with boolean values for each feature
   */
  const getAirlineFeatures = (airlineCode, isDomestic = true) => {
    return {
      SSR: isAirlineSupported(airlineCode, 'SSR', isDomestic),
      Baggage: isAirlineSupported(airlineCode, 'Baggage', isDomestic),
      Meals: isAirlineSupported(airlineCode, 'Meals', isDomestic),
      SeatLayout: isAirlineSupported(airlineCode, 'SeatLayout', isDomestic),
      GST: isAirlineSupported(airlineCode, 'GST', isDomestic),
      CompulsoryBaggage: isAirlineSupported(airlineCode, 'CompulsoryBaggage', isDomestic),
      AutoCancel: isAirlineSupported(airlineCode, 'AutoCancel', isDomestic),
      AutoRefund: isAirlineSupported(airlineCode, 'AutoRefund', isDomestic),
      LCC: isLCC(airlineCode, isDomestic),
      NDC: isNDCProvider(airlineCode),
      GDS: isGDSProvider(airlineCode)
    };
  };

  return {
    ...webSettingsContext,
    isAirlineSupported,
    getAirlinesForFeature,
    isBaggageCompulsory,
    getPaymentGateways,
    isLCC,
    getNDCProviders,
    getGDSProviders,
    isNDCProvider,
    isGDSProvider,
    getSetting,
    getAirlineFeatures
  };
};
