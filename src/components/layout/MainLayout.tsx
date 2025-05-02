
import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import MobileNavigation from '../features/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import CategorySlider from '../home/CategorySlider';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      {isHomePage && <CategorySlider />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      {isMobile && <MobileNavigation />}
    </div>
  );
};

export default MainLayout;
