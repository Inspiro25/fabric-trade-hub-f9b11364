import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import MobileNavigation from '../features/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import CategorySlider from '../home/CategorySlider';

const MainLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      {isHomePage && <CategorySlider />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default MainLayout;
