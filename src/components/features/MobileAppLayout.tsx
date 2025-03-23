
import React from 'react';
import AppHeader from './AppHeader';
import MobileNavigation from './MobileNavigation';
import Navbar from '@/components/layout/Navbar';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Check if current route is a management or admin route
  const isManagementRoute = location.pathname.startsWith('/management');
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Don't show mobile navigation on management or admin routes
  const showMobileNavigation = !isManagementRoute && !isAdminRoute;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Show AppHeader for mobile */}
      {isMobile && <AppHeader />}
      
      {/* Show Navbar for desktop */}
      {!isMobile && <Navbar />}
      
      <main className="flex-1 pt-16">
        {children}
      </main>
      
      {showMobileNavigation && isMobile && <MobileNavigation />}
    </div>
  );
};

export default MobileAppLayout;
