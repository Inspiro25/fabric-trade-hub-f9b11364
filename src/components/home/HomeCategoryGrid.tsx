
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategoriesWithDetails } from '@/lib/products/categories';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/use-categories';

const HomeCategoryGrid = () => {
  const { categories, loading, error } = useCategories();

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.id}`}
          className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="aspect-square relative mb-2">
            {category.image_url && (
              <img
                src={category.image_url}
                alt={category.name}
                className="object-cover w-full h-full rounded-md"
              />
            )}
          </div>
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default HomeCategoryGrid;
