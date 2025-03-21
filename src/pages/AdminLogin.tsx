
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
import { Lock, Store } from 'lucide-react';
import { fetchShops, getShopById } from '@/lib/supabase/shops';
import PartnerRequestDialog from '@/components/management/PartnerRequestDialog';

// Validation schema
const formSchema = z.object({
  shopId: z.string().min(1, "Shop ID is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

// Mock admin credentials (in a real app, this would be validated against a database)
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
          description: "Welcome to your admin panel",
          duration: 3000,
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
            description: "Welcome to your admin panel",
            duration: 3000,
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
        variant: "destructive",
        duration: 3000,
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
      description: "Thank you for your interest. Our team will contact you soon.",
      duration: 5000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Store className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-center">Shop Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your shop ID and password to access your admin panel
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
                    <FormLabel>Shop ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your shop ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                <Lock className="mr-2 h-4 w-4" />
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
            onClick={handlePartnerRequest}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <path d="M16.5 6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path>
              <rect width="6" height="6" x="15" y="3" rx="2"></rect>
              <path d="M10 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0v0"></path>
              <path d="M10 14a4 4 0 0 0-4 4"></path>
              <path d="M16 14a4 4 0 0 0-4 4"></path>
              <path d="M15 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0v0"></path>
            </svg>
            Partner with Us
          </Button>
          <p className="text-sm text-gray-500 text-center w-full mt-2">
            Contact support if you've lost your credentials
          </p>
          <Button 
            variant="ghost" 
            className="text-xs text-muted-foreground opacity-70 hover:opacity-100" 
            onClick={handleManagementAccess}
          >
            Management Access
          </Button>
        </CardFooter>
      </Card>
      
      <PartnerRequestDialog 
        open={isPartnerDialogOpen} 
        onOpenChange={setIsPartnerDialogOpen}
        onSuccess={handlePartnerRequestSuccess} 
      />
    </div>
  );
};

export default AdminLogin;
