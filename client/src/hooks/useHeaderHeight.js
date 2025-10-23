import { useState, useEffect } from 'react';

const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(194);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      // First try to get from CSS custom property
      const cssHeight = getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height');
      
      if (cssHeight && cssHeight !== '0px') {
        setHeaderHeight(parseInt(cssHeight));
        return;
      }

      // Fallback to DOM measurement
      const headerWrapper = document.querySelector('.header-wrapper-div');
      if (headerWrapper) {
        const height = headerWrapper.offsetHeight;
        setHeaderHeight(height);
      }
    };

    const handleHeaderHeightChange = (event) => {
      console.log('=== HEADER HEIGHT HOOK UPDATE ===');
      console.log('New height from event:', event.detail.height);
      setHeaderHeight(event.detail.height);
    };

    // Calculate initial height
    calculateHeaderHeight();

    // Listen for custom header height change events
    window.addEventListener('headerHeightChanged', handleHeaderHeightChange);
    
    // Recalculate on scroll (when header becomes fixed)
    const handleScroll = () => {
      calculateHeaderHeight();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateHeaderHeight);

    return () => {
      window.removeEventListener('headerHeightChanged', handleHeaderHeightChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateHeaderHeight);
    };
  }, []);

  return headerHeight;
};

export default useHeaderHeight;
