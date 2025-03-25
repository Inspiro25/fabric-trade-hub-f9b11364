
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getActiveOffers, Offer } from '@/lib/supabase/offers';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Tag, Clock, Copy, Check, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Offers = () => {
  const [offers, setOffers] = useState<(Offer & { shops: { name: string } | null })[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<(Offer & { shops: { name: string } | null })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const offersData = await getActiveOffers();
        setOffers(offersData);
        setFilteredOffers(offersData);
      } catch (error) {
        console.error('Error fetching offers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load offers. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOffers(offers);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = offers.filter(
        (offer) =>
          offer.title.toLowerCase().includes(term) ||
          offer.description?.toLowerCase().includes(term) ||
          offer.code.toLowerCase().includes(term) ||
          offer.shops?.name.toLowerCase().includes(term)
      );
      setFilteredOffers(filtered);
    }
  }, [searchTerm, offers]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: 'Code Copied',
      description: 'Discount code copied to clipboard',
    });
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const getOfferTypeText = (type: 'percentage' | 'shipping' | 'bogo') => {
    switch (type) {
      case 'percentage':
        return 'Discount';
      case 'shipping':
        return 'Free Shipping';
      case 'bogo':
        return 'Buy One Get One';
      default:
        return 'Special Offer';
    }
  };

  const getExpiryString = (date: string) => {
    const expiryDate = new Date(date);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return 'Expired';
    } else if (diffDays === 1) {
      return 'Expires today';
    } else if (diffDays <= 7) {
      return `Expires in ${diffDays} days`;
    } else {
      return `Expires ${expiryDate.toLocaleDateString()}`;
    }
  };

  return (
    <>
      <Helmet>
        <title>Offers & Discounts</title>
      </Helmet>
      
      <div className={cn(
        "min-h-screen pb-20",
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-orange-50 via-orange-50/80 to-white"
      )}>
        {/* Header section */}
        <div className={cn(
          "border-b",
          isDarkMode 
            ? "bg-gradient-to-r from-gray-800 to-gray-800/50 border-gray-700" 
            : "bg-gradient-to-r from-orange-100 to-orange-100/50"
        )}>
          <div className="container mx-auto px-4 py-6">
            <h1 className={cn(
              "text-2xl font-bold mb-1",
              isDarkMode ? "text-white" : "text-gray-800"
            )}>Special Offers</h1>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>Exclusive discounts and promotions from our partner shops</p>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="container mx-auto px-4 py-4">
          <Card className={cn(
            "border-none shadow-sm",
            isDarkMode && "bg-gray-800"
          )}>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search offers by title, shop or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "pl-9 pr-4 py-2",
                    isDarkMode && "bg-gray-700 border-gray-600 text-gray-200"
                  )}
                />
                {!isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "absolute right-1 top-1/2 transform -translate-y-1/2 h-8",
                      isDarkMode && "border-gray-600 hover:bg-gray-700 text-gray-200"
                    )}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Offers list */}
        <div className="container mx-auto px-4 py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className={cn(
                "animate-spin rounded-full h-12 w-12 border-b-2",
                isDarkMode ? "border-orange-500" : "border-orange-400"
              )}></div>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className={cn(
              "text-center py-16 rounded-lg",
              isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white"
            )}>
              <Tag className={cn(
                "h-12 w-12 mx-auto mb-3",
                isDarkMode ? "text-gray-500" : "text-gray-300"
              )} />
              <h3 className={cn(
                "text-lg font-medium mb-2",
                isDarkMode && "text-gray-200"
              )}>No offers found</h3>
              <p className={cn(
                "max-w-md mx-auto mb-6",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {searchTerm 
                  ? "Try adjusting your search or filter criteria" 
                  : "Check back later for new promotions and discounts"}
              </p>
              {searchTerm && (
                <Button 
                  onClick={() => setSearchTerm('')}
                  className={cn(
                    "rounded-full",
                    isDarkMode ? "bg-orange-600 hover:bg-orange-700" : ""
                  )}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={cn(
                    "overflow-hidden h-full border",
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                      : "hover:border-orange-300"
                  )}>
                    <div className={cn(
                      "h-2",
                      offer.type === 'percentage' 
                        ? "bg-purple-500" 
                        : offer.type === 'shipping' 
                          ? "bg-blue-500" 
                          : "bg-amber-500"
                    )}></div>
                    
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className={cn(
                            "text-xs px-2 py-0.5 rounded-full inline-block mb-2",
                            offer.type === 'percentage'
                              ? isDarkMode 
                                ? "bg-purple-900/60 text-purple-200" 
                                : "bg-purple-100 text-purple-700"
                              : offer.type === 'shipping'
                                ? isDarkMode 
                                  ? "bg-blue-900/60 text-blue-200" 
                                  : "bg-blue-100 text-blue-700"
                                : isDarkMode 
                                  ? "bg-amber-900/60 text-amber-200" 
                                  : "bg-amber-100 text-amber-700"
                          )}>
                            {getOfferTypeText(offer.type)}
                          </div>
                          <h3 className={cn(
                            "text-lg font-semibold mb-1 line-clamp-1",
                            isDarkMode && "text-white"
                          )}>
                            {offer.title}
                          </h3>
                          {offer.shops?.name && (
                            <div className={cn(
                              "text-sm mb-2",
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            )}>
                              {offer.shops.name}
                            </div>
                          )}
                        </div>
                        
                        {offer.discount && (
                          <div className={cn(
                            "text-xl font-bold",
                            isDarkMode ? "text-orange-400" : "text-orange-600"
                          )}>
                            {offer.type === 'percentage' && `${offer.discount}%`}
                          </div>
                        )}
                      </div>
                      
                      <p className={cn(
                        "text-sm my-3 line-clamp-2 min-h-[2.5rem]",
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      )}>
                        {offer.description || `Save with this special ${getOfferTypeText(offer.type).toLowerCase()} offer.`}
                      </p>
                      
                      <Separator className={isDarkMode ? "bg-gray-700" : "bg-gray-200"} />
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className={cn(
                          "flex items-center text-xs",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>
                          <Clock className="h-3 w-3 mr-1" />
                          {getExpiryString(offer.expiry)}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(offer.code)}
                          className={cn(
                            "h-8 text-xs gap-1 transition-all",
                            copiedCode === offer.code
                              ? isDarkMode 
                                ? "text-green-400" 
                                : "text-green-600"
                              : isDarkMode 
                                ? "text-orange-400 hover:text-orange-300" 
                                : "text-orange-600 hover:text-orange-700"
                          )}
                        >
                          {copiedCode === offer.code ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <span className="font-mono tracking-wider font-semibold">{offer.code}</span>
                              <Copy className="h-3 w-3 ml-1" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Offers;
