
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart } from 'lucide-react';
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-morphism py-3 shadow-subtle' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold transition-transform hover:scale-105">
            VYOMA
          </Link>

          {/* Desktop Search */}
          {!isMobile && (
            <form onSubmit={handleSearch} className="relative flex-grow max-w-xl mx-8">
              <Input
                type="text"
                placeholder="Search products..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Desktop Actions */}
          {!isMobile && (
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
              
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/auth">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Link>
              </Button>
            </div>
          )}
          
          {/* Mobile Search Icon */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div className={`
          fixed inset-0 top-[60px] z-40 bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-apple
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <nav className="container mx-auto px-4 py-8 flex flex-col space-y-6 text-center">
            <Link to="/" className="text-lg font-medium py-3 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/#categories" className="text-lg font-medium py-3 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Categories
            </Link>
            <Link to="/#new-arrivals" className="text-lg font-medium py-3 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
              New Arrivals
            </Link>
            <Link to="/#trending" className="text-lg font-medium py-3 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Trending
            </Link>
            <div className="pt-6 border-t border-border">
              <Button className="w-full mb-4" onClick={() => {
                setMobileMenuOpen(false);
                navigate('/auth');
              }}>
                Sign In
              </Button>
              <p className="text-sm text-muted-foreground">
                New to Vyoma? <Link to="/auth" className="text-primary underline" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
