
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LinkProps {
  href?: string;
  to?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  [key: string]: any;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, to, className, children, ...props }, ref) => {
    const destination = href || to || '';
    
    if (destination.startsWith('http') || destination.startsWith('mailto:') || destination.startsWith('tel:')) {
      return (
        <a 
          href={destination}
          ref={ref} 
          className={cn(className)}
          {...props}
        >
          {children}
        </a>
      );
    }
    
    return (
      <RouterLink 
        to={destination} 
        ref={ref} 
        className={cn(className)} 
        {...props}
      >
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
