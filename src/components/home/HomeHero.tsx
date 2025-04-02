
import React from 'react';
import { Link } from 'react-router-dom';

const HomeHero = () => {
  return (
    <div className="relative bg-background">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Discover Your Style
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Explore our curated collection of premium clothing and accessories.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/products"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              Shop Now
            </Link>
            <Link
              to="/categories"
              className="text-sm font-semibold leading-6 text-muted-foreground hover:text-primary"
            >
              Browse Categories <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
