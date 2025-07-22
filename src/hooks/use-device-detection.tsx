import { useState, useEffect } from "react";

export function useDeviceConfig() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const device = {
    isMobile,
    isTablet: false,
    isDesktop: !isMobile,
    type: isMobile ? 'mobile' : 'desktop'
  };

  const layout = {
    maxWidth: isMobile ? 'max-w-sm' : 'max-w-6xl',
    padding: isMobile ? 'px-4' : 'px-8',
    cardSize: isMobile ? 'p-4' : 'p-6',
    showSidebar: !isMobile
  };

  return { device, layout };
}