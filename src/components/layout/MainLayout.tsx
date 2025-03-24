
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import MobileNavigation from '../features/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default MainLayout;
