
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import FlashSaleTimer from '@/components/home/FlashSaleTimer';
import { useLocation } from 'react-router-dom';

const AppHeader: React.FC = () => {
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
    <>
      <Navigation />
      {showFlashSaleTimer && <FlashSaleTimer />}
    </>
  );
};

export default React.memo(AppHeader);
