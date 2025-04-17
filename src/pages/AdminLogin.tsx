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
import { Lock, Store, ArrowLeft } from 'lucide-react';
import { fetchShops, getShopById } from '@/lib/supabase/shops';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

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
  const [isLoading, setIsLoading] = useState(false);
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
        // Create a Supabase session for the admin
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: `${data.shopId}@admin.vyoma.com`,
          password: data.password
        });

        if (authError) {
          // If the user doesn't exist, sign them up first
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: `${data.shopId}@admin.vyoma.com`,
            password: data.password
          });

          if (signUpError) {
            throw new Error('Failed to authenticate');
          }
        }

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
        // Verify the password
        if (shop.password === data.password) {
          // Create a Supabase session for the shop admin
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: shop.ownerEmail || `${shop.shopId}@admin.vyoma.com`,
            password: data.password
          });

          if (authError) {
            // If the user doesn't exist, sign them up first
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: shop.ownerEmail || `${shop.shopId}@admin.vyoma.com`,
              password: data.password
            });

            if (signUpError) {
              throw new Error('Failed to authenticate');
            }
          }

          // Store the UUID id in session storage
          sessionStorage.setItem('adminShopId', shop.id);
          toast({
            title: "Login successful",
            description: "Welcome to your admin panel"
          });
          navigate('/admin/dashboard');
        } else {
          throw new Error('Invalid credentials');
        }
      } else {
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
    // Use a timeout to prevent any potential state update issues
    setTimeout(() => {
      navigate('/management/login');
    }, 100);
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className={cn(
              "flex items-center gap-2",
              isDarkMode 
                ? "text-gray-300 hover:text-white border-gray-700 hover:border-gray-600" 
                : "text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <Card className={cn(
          "border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
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
            <CardTitle className={cn(
              `${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-center`,
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              Shop Admin Login
            </CardTitle>
            <CardDescription className={cn(
              "text-center text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Access your shop dashboard to manage products and orders
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          </CardContent>
          
          <CardFooter className="flex flex-col items-center pt-0">
            <div className="mt-4 pt-4 w-full border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="link" 
                className={cn(
                  "text-xs w-full",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}
                onClick={handleManagementAccess}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Admin/Management access
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
