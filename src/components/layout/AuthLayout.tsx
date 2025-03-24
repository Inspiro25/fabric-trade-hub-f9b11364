
import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const AuthLayout: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className={cn(
        "w-full max-w-md p-8 rounded-lg shadow-lg",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
