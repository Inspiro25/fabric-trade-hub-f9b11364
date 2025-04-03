
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface MeeshoPromoCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  color: 'purple' | 'pink';
  direction?: 'left' | 'right';
}

const MeeshoPromoCard: React.FC<MeeshoPromoCardProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
  color = 'purple',
  direction = 'right'
}) => {
  const { isDarkMode } = useTheme();
  
  const colorClasses = {
    purple: {
      light: 'from-purple-50 to-purple-100 border-purple-200',
      dark: 'from-purple-900/40 to-purple-800/40 border-purple-800',
      button: 'bg-purple-600 hover:bg-purple-700 text-white'
    },
    pink: {
      light: 'from-pink-50 to-pink-100 border-pink-200',
      dark: 'from-pink-900/40 to-pink-800/40 border-pink-800',
      button: 'bg-pink-600 hover:bg-pink-700 text-white'
    }
  };
  
  return (
    <div className={cn(
      "rounded-xl overflow-hidden border",
      isDarkMode 
        ? colorClasses[color].dark
        : colorClasses[color].light,
      "bg-gradient-to-br"
    )}>
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4 items-center",
        direction === 'left' ? "md:flex-row-reverse" : "md:flex-row"
      )}>
        <div className="p-6">
          <h3 className={cn(
            "text-xl md:text-2xl font-bold mb-3",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            {title}
          </h3>
          
          <p className={cn(
            "mb-4",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            {description}
          </p>
          
          <Link to={buttonLink}>
            <Button className={colorClasses[color].button}>
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="aspect-[4/3] relative h-full w-full">
          <img 
            src={imageSrc} 
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default MeeshoPromoCard;
