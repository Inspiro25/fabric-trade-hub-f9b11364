
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return null;
  }
  
  return <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">VYOMA</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Premium clothing for modern lifestyles. Quality, style, and sustainability in every piece.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#new-arrivals" className="text-muted-foreground hover:text-foreground transition-colors">New Arrivals</Link></li>
              <li><Link to="/#trending" className="text-muted-foreground hover:text-foreground transition-colors">Trending</Link></li>
              <li><Link to="/#categories" className="text-muted-foreground hover:text-foreground transition-colors">Categories</Link></li>
              <li><Link to="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">Wishlist</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-muted-foreground hover:text-foreground transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="text-sm" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap justify-between py-6 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center mb-4 md:mb-0">
            <Mail className="h-4 w-4 mr-2" />
            <span>support@vyoma.com</span>
          </div>
          <div className="flex items-center mb-4 md:mb-0">
            <Phone className="h-4 w-4 mr-2" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>123 Fashion Street, Mumbai, India</span>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-6 border-t border-border text-sm text-center text-muted-foreground">
          <p>© 2024 Vyoma. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/shipping" className="hover:underline">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>;
};

export default Footer;
