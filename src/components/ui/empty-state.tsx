
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Package, Search, ShoppingBag, AlertCircle, Heart } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'package' | 'search' | 'shopping-bag' | 'alert' | 'heart';
  className?: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState = ({
  title,
  description,
  icon = 'package',
  className,
  actionText,
  actionHref,
}: EmptyStateProps) => {
  const { isDarkMode } = useTheme();
  
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <Search size={48} />;
      case 'shopping-bag':
        return <ShoppingBag size={48} />;
      case 'alert':
        return <AlertCircle size={48} />;
      case 'heart':
        return <Heart size={48} />;
      case 'package':
      default:
        return <Package size={48} />;
    }
  };
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      isDarkMode ? "text-gray-300" : "text-gray-600",
      className
    )}>
      <div className={cn(
        "mb-4 p-4 rounded-full",
        isDarkMode ? "bg-gray-800" : "bg-gray-100"
      )}>
        {getIcon()}
      </div>
      <h3 className={cn(
        "text-xl font-semibold mb-2",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>
        {title}
      </h3>
      {description && (
        <p className="max-w-md mx-auto">
          {description}
        </p>
      )}
      {actionText && actionHref && (
        <a 
          href={actionHref}
          className={cn(
            "mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium",
            isDarkMode 
              ? "bg-orange-600 text-white hover:bg-orange-700" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {actionText}
        </a>
      )}
    </div>
  );
};
