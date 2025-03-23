import React from 'react';
import AppHeader from './AppHeader';
import MobileNavigation from './MobileNavigation';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
const MobileAppLayout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Check if current route is a management or admin route
  const isManagementRoute = location.pathname.startsWith('/management');
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Don't show mobile navigation on management or admin routes
  const showMobileNavigation = !isManagementRoute && !isAdminRoute;
  if (!isMobile) {
    // Return just the children without the mobile layout for desktop
    return <>{children}</>;
  }
  return <div className="flex flex-col min-h-screen">
      {/* Show AppHeader for mobile */}
      <AppHeader />
      
      <main className="flex-1 pt-16 pb-16 py-[10px]">
        {children}
      </main>
      
      {showMobileNavigation && <MobileNavigation />}
    </div>;
};
export default MobileAppLayout;