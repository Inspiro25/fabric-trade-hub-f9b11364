
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image: 'https://placehold.co/400x300',
    link: '/category/electronics'
  },
  {
    id: 2,
    name: 'Fashion',
    image: 'https://placehold.co/400x300',
    link: '/category/fashion'
  },
  {
    id: 3,
    name: 'Home & Kitchen',
    image: 'https://placehold.co/400x300',
    link: '/category/home-kitchen'
  },
  {
    id: 4,
    name: 'Beauty',
    image: 'https://placehold.co/400x300',
    link: '/category/beauty'
  },
];

const FeaturedCategories = () => {
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(category => (
          <Link 
            to={category.link} 
            key={category.id}
            className="relative overflow-hidden rounded-lg group"
          >
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-40 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-4 w-full">
                <h3 className="text-white font-semibold">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;
