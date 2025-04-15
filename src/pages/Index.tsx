import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Tag, 
  TrendingUp, 
  Package, 
  Sparkles, 
  Star,
  Clock,
  Percent 
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Components
import ProductGrid from '@/components/features/ProductGrid';

const Home = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('trending');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={cn(
        "relative py-20 px-4",
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-orange-900/20 to-gray-900"
          : "bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50"
      )}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className={cn(
              "text-4xl md:text-6xl font-bold tracking-tight",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Discover Amazing Products
            </h1>
            <p className={cn(
              "text-lg md:text-xl max-w-2xl mx-auto",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Shop the latest trends with unbeatable prices and exclusive deals
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button 
                size="lg"
                className={cn(
                  "rounded-full",
                  isDarkMode 
                    ? "bg-orange-500 hover:bg-orange-600" 
                    : "bg-orange-600 hover:bg-orange-700"
                )}
                asChild
              >
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full"
                asChild
              >
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold mb-8 text-center",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <ShoppingBag className="h-6 w-6" />, name: "Fashion" },
              { icon: <Package className="h-6 w-6" />, name: "Electronics" },
              { icon: <Star className="h-6 w-6" />, name: "Home & Living" },
              { icon: <Sparkles className="h-6 w-6" />, name: "Beauty" },
            ].map((category) => (
              <Link 
                key={category.name}
                to={`/categories/${category.name.toLowerCase()}`}
                className={cn(
                  "p-6 rounded-xl text-center transition-all duration-300 hover:scale-105",
                  isDarkMode 
                    ? "bg-gray-800 hover:bg-gray-700 border border-gray-700" 
                    : "bg-white hover:bg-orange-50 shadow-lg hover:shadow-xl"
                )}
              >
                <div className={cn(
                  "mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3",
                  isDarkMode 
                    ? "bg-orange-500/20 text-orange-400" 
                    : "bg-orange-100 text-orange-600"
                )}>
                  {category.icon}
                </div>
                <h3 className={cn(
                  "font-medium",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Tabs Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-orange-50/20">
        <div className="container mx-auto max-w-6xl">
          <Tabs 
            defaultValue="trending" 
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">New Arrivals</span>
              </TabsTrigger>
              <TabsTrigger value="deals" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Best Deals</span>
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Featured</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending">
              <ProductGrid query={{ type: 'trending', limit: 8 }} />
            </TabsContent>
            <TabsContent value="new">
              <ProductGrid query={{ type: 'new', limit: 8 }} />
            </TabsContent>
            <TabsContent value="deals">
              <ProductGrid query={{ type: 'deals', limit: 8 }} />
            </TabsContent>
            <TabsContent value="featured">
              <ProductGrid query={{ type: 'featured', limit: 8 }} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold mb-12 text-center",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Why Choose Us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Latest Trends",
                description: "Stay ahead with the newest styles"
              },
              {
                icon: <Tag className="h-6 w-6" />,
                title: "Best Prices",
                description: "Unbeatable deals & discounts"
              },
              {
                icon: <Package className="h-6 w-6" />,
                title: "Fast Delivery",
                description: "Quick & reliable shipping"
              },
              {
                icon: <Star className="h-6 w-6" />,
                title: "Top Quality",
                description: "Premium products guaranteed"
              }
            ].map((feature) => (
              <div 
                key={feature.title} 
                className={cn(
                  "text-center p-6 rounded-xl",
                  isDarkMode 
                    ? "bg-gray-800/50" 
                    : "bg-white shadow-lg"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4",
                  isDarkMode 
                    ? "bg-orange-500/20 text-orange-400" 
                    : "bg-orange-100 text-orange-600"
                )}>
                  {feature.icon}
                </div>
                <h3 className={cn(
                  "font-semibold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {feature.title}
                </h3>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
