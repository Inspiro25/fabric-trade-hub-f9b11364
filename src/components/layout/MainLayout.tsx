
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import MobileNavigation from '../features/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import FlashSaleTimer from '../home/FlashSaleTimer';

const MainLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Show the flash sale timer on specific pages
  const showFlashSaleTimer = [
    '/',
    '/search',
    '/category',
    '/new-arrivals',
    '/trending',
    '/offers',
    '/shop'
  ].some(route => location.pathname.startsWith(route));
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      {showFlashSaleTimer && <FlashSaleTimer />}
      <main className="flex-grow pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default MainLayout;
