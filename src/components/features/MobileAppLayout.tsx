import React from 'react';
import MobileNavigation from './MobileNavigation';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';

const MobileAppLayout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isDarkMode, sectionBgColor } = useTheme();

  // Check if current route is a management or admin route
  const isManagementRoute = location.pathname.startsWith('/management');
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Don't show mobile navigation on management or admin routes
  const showMobileNavigation = !isManagementRoute && !isAdminRoute;
  
  if (!isMobile) {
    // Return just the children without the mobile layout for desktop
    return <>{children}</>;
  }
  
  return (
    <div className={`flex flex-col min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-b from-blue-50/60 via-white to-white text-gray-900'
    }`}>
      <main className={`flex-1 ${showMobileNavigation ? 'pb-24' : 'pb-6'}`}>
        {children}
      </main>
      
      {showMobileNavigation && <MobileNavigation />}
    </div>
  );
};

export default MobileAppLayout;
