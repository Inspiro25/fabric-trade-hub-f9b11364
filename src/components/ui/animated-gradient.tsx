
import * as React from "react"

import { cn } from "@/lib/utils"

interface GradientProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "green" | "red" | "yellow" | "purple" | "orange";
}

const AnimatedGradient = React.forwardRef<HTMLSpanElement, GradientProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const gradientClasses = () => {
      switch (variant) {
        case 'default':
          return {
            soft: { from: 'from-gray-50', via: 'via-gray-100/40', to: 'to-white' },
            strong: { from: 'from-gray-200', via: 'via-gray-300/70', to: 'to-gray-100' },
          };
        case 'primary':
          return {
            soft: { from: 'from-blue-50', via: 'via-blue-100/40', to: 'to-white' },
            strong: { from: 'from-blue-200', via: 'via-blue-300/70', to: 'to-blue-100' },
          };
        case 'secondary':
          return {
            soft: { from: 'from-green-50', via: 'via-green-100/40', to: 'to-white' },
            strong: { from: 'from-green-200', via: 'via-green-300/70', to: 'to-green-100' },
          };
        case 'destructive':
          return {
            soft: { from: 'from-red-50', via: 'via-red-100/40', to: 'to-white' },
            strong: { from: 'from-red-200', via: 'via-red-300/70', to: 'to-red-100' },
          };
        case 'success':
          return {
            soft: { from: 'from-green-50', via: 'via-green-100/40', to: 'to-white' },
            strong: { from: 'from-green-200', via: 'via-green-300/70', to: 'to-green-100' },
          };
        case 'warning':
          return {
            soft: { from: 'from-yellow-50', via: 'via-yellow-100/40', to: 'to-white' },
            strong: { from: 'from-yellow-200', via: 'via-yellow-300/70', to: 'to-yellow-100' },
          };
        case 'info':
          return {
            soft: { from: 'from-blue-50', via: 'via-blue-100/40', to: 'to-white' },
            strong: { from: 'from-blue-200', via: 'via-blue-300/70', to: 'to-blue-100' },
          };
        case 'green':
          return {
            soft: { from: 'from-green-50', via: 'via-green-100/40', to: 'to-white' },
            strong: { from: 'from-green-200', via: 'via-green-300/70', to: 'to-green-100' },
          };
        case 'red':
          return {
            soft: { from: 'from-red-50', via: 'via-red-100/40', to: 'to-white' },
            strong: { from: 'from-red-200', via: 'via-red-300/70', to: 'to-red-100' },
          };
        case 'yellow':
          return {
            soft: { from: 'from-yellow-50', via: 'via-yellow-100/40', to: 'to-white' },
            strong: { from: 'from-yellow-200', via: 'via-yellow-300/70', to: 'to-yellow-100' },
          };
        case 'purple':
          return {
            soft: { from: 'from-purple-50', via: 'via-purple-100/40', to: 'to-white' },
            strong: { from: 'from-purple-200', via: 'via-purple-300/70', to: 'to-purple-100' },
          };
        case 'orange':
          return {
            soft: { from: 'from-orange-50', via: 'via-orange-100/40', to: 'to-white' },
            strong: { from: 'from-orange-200', via: 'via-orange-300/70', to: 'to-orange-100' },
          };
        default:
          return {
            soft: { from: 'from-gray-50', via: 'via-gray-100/40', to: 'to-white' },
            strong: { from: 'from-gray-200', via: 'via-gray-300/70', to: 'to-gray-100' },
          };
      }
    };

    const { soft, strong } = gradientClasses();

    return (
      <span
        ref={ref}
        className={cn(
          "bg-gradient-to-r",
          soft.from,
          soft.via,
          soft.to,
          "animate-gradient",
          className
        )}
        {...props}
      />
    )
  }
)
AnimatedGradient.displayName = "AnimatedGradient"

export { AnimatedGradient }
