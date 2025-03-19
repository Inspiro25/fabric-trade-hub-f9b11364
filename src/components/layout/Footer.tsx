import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const Footer = () => {
  return <footer className="bg-secondary/50 pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-4">
            <Link to="/" className="text-2xl font-bold block mb-4">VYOMA CLOTHING</Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Discover the latest fashion trends with our curated collection of premium clothing. 
              For both customers and resellers, we make fashion accessible.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/#new-arrivals" className="text-muted-foreground hover:text-foreground transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/#trending" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/#categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-muted-foreground hover:text-foreground transition-colors">
                  Brands
                </Link>
              </li>
              <li>
                <Link to="/sale" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/auth?register=true" className="text-muted-foreground hover:text-foreground transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/account/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/account/settings" className="text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-muted-foreground hover:text-foreground transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/sizing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">123 Fashion St, City</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">support@clothvibe.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-sm text-muted-foreground order-2 md:order-1 text-center md:text-left">© 2025 Vyoma Enterprises. All rights reserved.</div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 order-1 md:order-2 mb-4 md:mb-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;