
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import MobileNavigation from '../features/MobileNavigation';
import { useMediaQuery } from '@/hooks/use-mobile';

const MainLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
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
