
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronRight } from 'lucide-react';

export interface HomePromoBannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  direction?: 'left' | 'right';
}

export default function HomePromoBanner({
  title,
  description,
  buttonText,
  buttonLink,
  image,
  direction = 'right'
}: HomePromoBannerProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="mt-12">
      <div 
        className={cn(
          "rounded-xl overflow-hidden relative bg-gradient-to-r",
          isDarkMode 
            ? "from-gray-800 to-gray-900 border border-gray-700" 
            : "from-gray-100 to-gray-200 border border-gray-100"
        )}
      >
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 items-center",
          direction === 'left' ? "md:flex-row-reverse" : "md:flex-row"
        )}>
          <div className="p-6 md:p-8 lg:p-10">
            <h3 className={cn(
              "text-xl md:text-2xl font-bold mb-2", 
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              {title}
            </h3>
            <p className={cn(
              "mb-4 text-sm md:text-base",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              {description}
            </p>
            <Link to={buttonLink}>
              <Button variant={isDarkMode ? "outline" : "default"} size="sm">
                {buttonText}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="h-48 md:h-full w-full relative">
            <img 
              src={image} 
              alt={title}
              className="h-full w-full object-cover" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
