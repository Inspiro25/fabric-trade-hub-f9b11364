import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Lock, Store, Users, Building2, ArrowLeft } from 'lucide-react';
import { fetchShops, getShopById } from '@/lib/supabase/shops';
import PartnerRequestDialog from '@/components/management/PartnerRequestDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  shopId: z.string().min(1, "Shop ID is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const ADMIN_CREDENTIALS = [
  { shopId: 'shop-1', password: 'electronics123' },
  { shopId: 'shop-2', password: 'fashion123' },
  { shopId: 'shop-3', password: 'home123' },
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'partner'>('login');
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopId: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // First check against hard-coded credentials
      const validCredentials = ADMIN_CREDENTIALS.find(
        cred => cred.shopId === data.shopId && cred.password === data.password
      );

      if (validCredentials) {
        // Store the shop ID in session storage for admin session
        sessionStorage.setItem('adminShopId', data.shopId);
        toast({
          title: "Login successful",
          description: "Welcome to your admin panel"
        });
        navigate('/admin/dashboard');
        return;
      }

      // If not found in hard-coded credentials, check against shops from the database
      const shops = await fetchShops();
      const shop = shops.find(s => s.shopId === data.shopId);
      
      if (shop) {
        console.log("Found shop:", shop);
        // Verify the password - note we're now directly checking the password field
        if (shop.password === data.password) {
          // Store the UUID id in session storage, not the shopId
          sessionStorage.setItem('adminShopId', shop.id);
          toast({
            title: "Login successful",
            description: "Welcome to your admin panel"
          });
          navigate('/admin/dashboard');
        } else {
          // Password doesn't match
          throw new Error('Invalid credentials');
        }
      } else {
        // Shop not found
        throw new Error('Shop not found');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Invalid shop ID or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManagementAccess = () => {
    navigate('/management/login');
  };

  const handlePartnerRequest = () => {
    setIsPartnerDialogOpen(true);
  };

  const handlePartnerRequestSuccess = () => {
    setIsPartnerDialogOpen(false);
    toast({
      title: "Request submitted",
      description: "Thank you for your interest. Our team will contact you soon."
    });
  };

  return (
    <div className={cn(
      "h-screen flex items-center justify-center p-4 overflow-hidden",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 to-gray-800" 
        : "bg-gradient-to-br from-kutuku-light to-orange-50"
    )}>
      <div className={`w-full ${isMobile ? 'max-w-[95%]' : 'max-w-md'}`}>
        <div className="text-center mb-4">
          <h1 className={cn(
            "text-3xl font-bold",
            isDarkMode ? "text-orange-400" : "text-kutuku-primary"
          )}>Kutuku</h1>
          <p className={cn(
            "mt-1",
            isDarkMode ? "text-gray-300" : "text-kutuku-secondary"
          )}>Shop Admin Portal</p>
        </div>
        
        <Card className={cn(
          "border-none shadow-lg",
          isDarkMode 
            ? "bg-gray-800/90 backdrop-blur-sm" 
            : "bg-white/90 backdrop-blur-sm"
        )}>
          <CardHeader className={`space-y-1 ${isMobile ? 'pb-4' : 'pb-6'}`}>
            <div className={cn(
              "mx-auto mb-3 p-3 rounded-full",
              isDarkMode 
                ? "bg-gradient-to-br from-gray-700 to-gray-600" 
                : "bg-gradient-to-br from-kutuku-light to-orange-100"
            )}>
              <Store className={cn(
                "h-6 w-6",
                isDarkMode ? "text-orange-400" : "text-kutuku-primary"
              )} />
            </div>
            <div className="flex justify-center space-x-2 mb-2">
              <button
                onClick={() => setActiveTab('login')}
                className={cn(
                  "px-3 py-1.5 font-medium text-sm rounded-md transition-colors",
                  activeTab === 'login'
                    ? isDarkMode 
                      ? "bg-gray-700 text-orange-400" 
                      : "bg-kutuku-light text-kutuku-primary"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700" 
                      : "text-gray-600 hover:bg-gray-100"
                )}
              >
                Shop Login
              </button>
              <button
                onClick={() => setActiveTab('partner')}
                className={cn(
                  "px-3 py-1.5 font-medium text-sm rounded-md transition-colors",
                  activeTab === 'partner'
                    ? isDarkMode 
                      ? "bg-gray-700 text-orange-400" 
                      : "bg-kutuku-light text-kutuku-primary"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700" 
                      : "text-gray-600 hover:bg-gray-100"
                )}
              >
                Partner With Us
              </button>
            </div>
            <CardTitle className={cn(
              `${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-center`,
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              {activeTab === 'login' ? 'Shop Admin Login' : 'Become Our Partner'}
            </CardTitle>
            <CardDescription className={cn(
              "text-center text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              {activeTab === 'login' 
                ? 'Access your shop dashboard to manage products and orders' 
                : 'Join our marketplace and start selling your products'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {activeTab === 'login' ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="shopId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Shop ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your shop ID" 
                            className={cn(
                              isDarkMode 
                                ? "bg-gray-700/50 border-gray-600 focus:border-orange-500 text-white" 
                                : "bg-white/50 border-gray-200 focus:border-kutuku-primary"
                            )} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            className={cn(
                              isDarkMode 
                                ? "bg-gray-700/50 border-gray-600 focus:border-orange-500 text-white" 
                                : "bg-white/50 border-gray-200 focus:border-kutuku-primary"
                            )} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className={cn(
                      "w-full mt-4 text-white font-medium",
                      isDarkMode 
                        ? "bg-orange-500 hover:bg-orange-600" 
                        : "bg-kutuku-primary hover:bg-kutuku-secondary"
                    )} 
                    disabled={isLoading}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-3">
                <p className={cn(
                  "text-xs mb-3",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  Join our growing community of sellers and expand your business reach. Click below to submit your partnership request.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div className={cn(
                    "flex items-center p-3 rounded-lg",
                    isDarkMode ? "bg-gray-700" : "bg-kutuku-light"
                  )}>
                    <Users className={cn(
                      "h-4 w-4 mr-3",
                      isDarkMode ? "text-orange-400" : "text-kutuku-primary"
                    )} />
                    <div>
                      <h3 className={cn(
                        "font-medium text-sm",
                        isDarkMode ? "text-white" : "text-gray-800"
                      )}>10,000+ Customers</h3>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>Access our large customer base</p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center p-3 rounded-lg",
                    isDarkMode ? "bg-gray-700/70" : "bg-orange-50"
                  )}>
                    <Building2 className={cn(
                      "h-4 w-4 mr-3",
                      isDarkMode ? "text-orange-400" : "text-kutuku-primary"
                    )} />
                    <div>
                      <h3 className={cn(
                        "font-medium text-sm",
                        isDarkMode ? "text-white" : "text-gray-800"
                      )}>Easy Integration</h3>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>Simple tools to manage your store</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handlePartnerRequest} 
                  className={cn(
                    "w-full mt-3 text-white font-medium",
                    isDarkMode 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "bg-kutuku-primary hover:bg-kutuku-secondary"
                  )}
                >
                  Apply for Partnership
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col items-center pt-0">
            <p className={cn(
              "text-xs mb-2",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {activeTab === 'login' 
                ? 'Contact support if you\'ve lost your credentials' 
                : 'We\'ll review your application within 48 hours'}
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            className={cn(
              "text-xs flex items-center",
              isDarkMode 
                ? "text-gray-400 hover:text-orange-400" 
                : "text-gray-500 hover:text-kutuku-primary"
            )} 
            onClick={handleManagementAccess}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Management Access
          </Button>
        </div>
      </div>
      
      <PartnerRequestDialog 
        open={isPartnerDialogOpen} 
        onOpenChange={setIsPartnerDialogOpen}
        onSuccess={handlePartnerRequestSuccess} 
      />
    </div>
  );
};

export default AdminLogin;
