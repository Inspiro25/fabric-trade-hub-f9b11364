
// Add Swiper components for mobile usage
import React from 'react';

// Placeholder until Swiper package is installed
export const Swiper = ({ children, ...props }: any) => {
  return <div className="swiper-container" {...props}>{children}</div>;
};

export const SwiperSlide = ({ children, ...props }: any) => {
  return <div className="swiper-slide" {...props}>{children}</div>;
};

export const Navigation = () => null;
export const Pagination = () => null;
export const Scrollbar = () => null;
export const Autoplay = () => null;
