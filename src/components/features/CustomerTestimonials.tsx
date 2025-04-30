
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Regular Customer',
    comment: 'I absolutely love shopping here! The products are high quality and the customer service is exceptional.',
    avatar: '/lovable-uploads/5eed8a9b-3a94-4525-a3c6-5030ad09eb22.png',
  },
  {
    id: 2,
    name: 'Mark Wilson',
    role: 'Verified Buyer',
    comment: 'Fast shipping and great selection. Will definitely be coming back for more purchases!',
    avatar: '/lovable-uploads/5eed8a9b-3a94-4525-a3c6-5030ad09eb22.png',
  },
  {
    id: 3,
    name: 'Lisa Thompson',
    role: 'Loyal Customer',
    comment: 'The app is so easy to use and I always find exactly what I\'m looking for. Highly recommended!',
    avatar: '/lovable-uploads/5eed8a9b-3a94-4525-a3c6-5030ad09eb22.png',
  }
];

const CustomerTestimonials: React.FC = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Don't just take our word for it — see what customers love about shopping with us
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <Avatar className="h-12 w-12 border-2 border-blue-500">
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-600">{testimonial.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
