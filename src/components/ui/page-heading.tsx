
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const PageHeading = ({ title, subtitle, className }: PageHeadingProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn("mb-8", className)}>
      <h1 className={cn(
        "text-2xl md:text-3xl font-bold",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        {title}
      </h1>
      {subtitle && (
        <p className={cn(
          "mt-2 text-sm md:text-base",
          isDarkMode ? "text-gray-300" : "text-gray-600"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
