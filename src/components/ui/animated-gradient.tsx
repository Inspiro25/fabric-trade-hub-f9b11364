
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnimatedGradientProps {
  className?: string;
  children: React.ReactNode;
  hue?: 'blue' | 'blue' | 'green' | 'purple';
  intensity?: 'soft' | 'medium' | 'strong';
  speed?: 'slow' | 'medium' | 'fast';
}

export function AnimatedGradient({
  className,
  children,
  hue = 'blue',
  intensity = 'medium',
  speed = 'medium',
}: AnimatedGradientProps) {
  // Calculate colors based on hue
  const getGradientColors = () => {
    switch (hue) {
      case 'blue':
        return {
          soft: { from: 'from-blue-50', via: 'via-blue-100/40', to: 'to-white' },
          medium: { from: 'from-blue-100', via: 'via-blue-200/60', to: 'to-blue-50' },
          strong: { from: 'from-blue-200', via: 'via-blue-300/70', to: 'to-blue-100' },
        };
      case 'blue':
        return {
          soft: { from: 'from-blue-50', via: 'via-blue-100/40', to: 'to-white' },
          medium: { from: 'from-blue-100', via: 'via-blue-200/60', to: 'to-blue-50' },
          strong: { from: 'from-blue-200', via: 'via-blue-300/70', to: 'to-blue-100' },
        };
      case 'green':
        return {
          soft: { from: 'from-green-50', via: 'via-green-100/40', to: 'to-white' },
          medium: { from: 'from-green-100', via: 'via-green-200/60', to: 'to-green-50' },
          strong: { from: 'from-green-200', via: 'via-green-300/70', to: 'to-green-100' },
        };
      case 'purple':
        return {
          soft: { from: 'from-purple-50', via: 'via-purple-100/40', to: 'to-white' },
          medium: { from: 'from-purple-100', via: 'via-purple-200/60', to: 'to-purple-50' },
          strong: { from: 'from-purple-200', via: 'via-purple-300/70', to: 'to-purple-100' },
        };
      default:
        return {
          soft: { from: 'from-blue-50', via: 'via-blue-100/40', to: 'to-white' },
          medium: { from: 'from-blue-100', via: 'via-blue-200/60', to: 'to-blue-50' },
          strong: { from: 'from-blue-200', via: 'via-blue-300/70', to: 'to-blue-100' },
        };
    }
  };

  // Calculate animation duration based on speed
  const getDuration = () => {
    switch (speed) {
      case 'slow': return 8;
      case 'medium': return 5;
      case 'fast': return 3;
      default: return 5;
    }
  };

  const colors = getGradientColors()[intensity];
  const duration = getDuration();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-r",
          colors.from,
          colors.via,
          colors.to
        )}
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
        }}
        transition={{
          duration: duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
