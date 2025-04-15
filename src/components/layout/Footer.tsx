
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  
  // Don't render footer on mobile
  if (isMobile) return null;
  
  return (
    <footer className={cn(
      "py-12 border-t",
      isDarkMode 
        ? "bg-gray-900 border-gray-800 text-gray-300" 
        : "bg-orange-50 border-orange-100 text-gray-700"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className={cn(
              "text-lg font-semibold mb-4",
              isDarkMode ? "text-white" : "text-orange-800"
            )}>
              Vyoma
            </h3>
            <p className="text-sm mb-4">
              Premium clothing and accessories for the modern fashion enthusiast.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className={cn("h-4 w-4 mr-2", isDarkMode ? "text-orange-400" : "text-orange-600")} />
                <span>123 Fashion Street, Mumbai, India</span>
              </div>
              <div className="flex items-center">
                <Phone className={cn("h-4 w-4 mr-2", isDarkMode ? "text-orange-400" : "text-orange-600")} />
                <span>+91 123 456 7890</span>
              </div>
              <div className="flex items-center">
                <Mail className={cn("h-4 w-4 mr-2", isDarkMode ? "text-orange-400" : "text-orange-600")} />
                <span>contact@vyoma.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={cn(
              "text-lg font-semibold mb-4",
              isDarkMode ? "text-white" : "text-orange-800"
            )}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className={cn(
                  "text-sm hover:text-orange-500 transition-colors",
                  isDarkMode ? "hover:text-orange-400" : "hover:text-orange-600"
                )}>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className={cn(
                  "text-sm hover:text-orange-500 transition-colors",
                  isDarkMode ? "hover:text-orange-400" : "hover:text-orange-600"
                )}>
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/shops" className={cn(
                  "text-sm hover:text-orange-500 transition-colors",
                  isDarkMode ? "hover:text-orange-400" : "hover:text-orange-600"
                )}>
                  Shops
                </Link>
              </li>
              <li>
                <Link to="/offers" className={cn(
                  "text-sm hover:text-orange-500 transition-colors",
                  isDarkMode ? "hover:text-orange-400" : "hover:text-orange-600"
                )}>
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className={cn(
              "text-lg font-semibold mb-4",
              isDarkMode ? "text-white" : "text-orange-800"
            )}>
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className={cn(
                  "text-sm hover:text-orange-500 transition-colors",
                  isDarkMode ? "hover:text-orange-400" : "hover:text-orange-600"
                )}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className={cn(
                  "text-sm hover:text-orange-500 transition-colors",
                  isDarkMode ? "hover:text-orange-400" : "hover:text-orange-600"
                )}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className={cn(
                  "text-sm hover:text-orange-500 transition-colors",
                  isDarkMode ? "hover:text-orange-400" : "hover:text-orange-600"
                )}>
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className={cn(
                  "text-sm hover:text-orange-500 transition-colors",
                  isDarkMode ? "hover:text-orange-400" : "hover:text-orange-600"
                )}>
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={cn(
              "text-lg font-semibold mb-4",
              isDarkMode ? "text-white" : "text-orange-800"
            )}>
              Newsletter
            </h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className={cn(
                  "w-full px-3 py-2 border rounded-md",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white" 
                    : "bg-white border-orange-200"
                )}
              />
              <button
                type="submit"
                className={cn(
                  "w-full px-3 py-2 text-white rounded-md transition-colors",
                  isDarkMode 
                    ? "bg-orange-600 hover:bg-orange-700" 
                    : "bg-orange-600 hover:bg-orange-700"
                )}
              >
                Subscribe
              </button>
            </form>
            
            <div className="flex items-center space-x-3 mt-4">
              <a href="#" className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isDarkMode 
                  ? "bg-gray-800 hover:bg-orange-600 text-gray-400 hover:text-white" 
                  : "bg-orange-100 hover:bg-orange-600 text-orange-600 hover:text-white"
              )}>
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isDarkMode 
                  ? "bg-gray-800 hover:bg-orange-600 text-gray-400 hover:text-white" 
                  : "bg-orange-100 hover:bg-orange-600 text-orange-600 hover:text-white"
              )}>
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isDarkMode 
                  ? "bg-gray-800 hover:bg-orange-600 text-gray-400 hover:text-white" 
                  : "bg-orange-100 hover:bg-orange-600 text-orange-600 hover:text-white"
              )}>
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isDarkMode 
                  ? "bg-gray-800 hover:bg-orange-600 text-gray-400 hover:text-white" 
                  : "bg-orange-100 hover:bg-orange-600 text-orange-600 hover:text-white"
              )}>
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={cn(
          "border-t pt-8 text-center", 
          isDarkMode ? "border-gray-800" : "border-orange-200"
        )}>
          <p className="text-sm">
            © {new Date().getFullYear()} Vyoma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
