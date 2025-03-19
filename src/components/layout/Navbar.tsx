import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
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
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-morphism py-3 shadow-subtle' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold transition-transform hover:scale-105">VYOMA </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            
            
            
            
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              
            </Button>
            
            <Button variant="ghost" size="icon" className="relative" asChild>
              
            </Button>
            
            <Button variant="ghost" size="icon" className="relative" asChild>
              
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && <div className={`
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
            // Navigate programmatically or via Link
          }} asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                New to ClothVibe? <Link to="/auth" className="text-primary underline" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
              </p>
            </div>
          </nav>
        </div>}
    </header>;
};
export default Navbar;