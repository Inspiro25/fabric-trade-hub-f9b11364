
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyWishlist: React.FC = () => {
  return (
    <div className="text-center py-10 bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
      <div className="inline-flex justify-center items-center p-3 bg-pink-50 rounded-full mb-4">
        <Heart className="w-8 h-8 text-pink-500" />
      </div>
      <h2 className="text-lg font-semibold mb-2">Your wishlist is empty</h2>
      <p className="text-muted-foreground mb-6 text-sm max-w-xs mx-auto">
        Items you love will appear here. Start exploring and add your favorites.
      </p>
      <Button size="lg" asChild className="bg-kutuku-primary hover:bg-kutuku-secondary rounded-full">
        <Link to="/">Start Shopping</Link>
      </Button>
    </div>
  );
};

export default EmptyWishlist;
