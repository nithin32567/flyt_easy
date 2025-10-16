import { useState, useEffect } from 'react';

const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(194);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const headerWrapper = document.querySelector('.header-wrapper-div');
      if (headerWrapper) {
        const height = headerWrapper.offsetHeight;
        setHeaderHeight(height);
      }
    };

    // Calculate initial height
    calculateHeaderHeight();

    // Recalculate on scroll (when header becomes fixed)
    const handleScroll = () => {
      calculateHeaderHeight();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateHeaderHeight);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateHeaderHeight);
    };
  }, []);

  return headerHeight;
};

export default useHeaderHeight;
