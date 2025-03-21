
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Store, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    } else {
      navigate('/search');
    }
  };

  // Don't render Navbar on mobile since we use bottom navigation instead
  if (isMobile) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-morphism py-3 shadow-subtle' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold transition-transform hover:scale-105">
            VYOMAKART
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="relative flex-grow max-w-xl mx-8">
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search products, brands, categories..."
                className="pr-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full flex items-center justify-center"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {/* Changed from User to Store icon */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/shops">
                <Store className="h-5 w-5" />
                <span className="sr-only">Shops</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
