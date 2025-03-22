
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
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Validation schema
const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

// Main admin credentials
const MAIN_ADMIN_CREDENTIALS = {
  username: 'amalchd',
  password: 'vyomadev'
};

const ManagementLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    
    // Check if credentials match main admin
    if (data.username === MAIN_ADMIN_CREDENTIALS.username && 
        data.password === MAIN_ADMIN_CREDENTIALS.password) {
      // Store the admin role in session storage
      sessionStorage.setItem('adminRole', 'main');
      sessionStorage.setItem('adminUsername', data.username);
      
      toast({
        title: "Login successful",
        description: "Welcome to the management portal",
        duration: 3000,
      });
      
      navigate('/management/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-kutuku-light to-orange-50 p-4 overflow-hidden">
      <div className={`w-full ${isMobile ? 'max-w-[95%]' : 'max-w-md'}`}>
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-kutuku-primary">Kutuku</h1>
          <p className="text-kutuku-secondary mt-1">Management Portal</p>
        </div>
        
        <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className={`space-y-1 ${isMobile ? 'pb-4' : 'pb-6'}`}>
            <div className="mx-auto mb-4 bg-gradient-to-br from-kutuku-light to-orange-100 p-3 rounded-full">
              <ShieldAlert className="h-6 w-6 text-kutuku-primary" />
            </div>
            <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-center text-gray-800`}>
              Management Access
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-sm">
              Secure portal for management team
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          className="bg-white/50 border-gray-200 focus:border-kutuku-primary" 
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
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          className="bg-white/50 border-gray-200 focus:border-kutuku-primary" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full mt-4 bg-kutuku-primary hover:bg-kutuku-secondary text-white font-medium" 
                  disabled={isLoading}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center pt-0">
            <p className="text-xs text-gray-500 mb-2">
              Authorized personnel only
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            className="text-xs flex items-center text-gray-500 hover:text-kutuku-primary" 
            onClick={() => navigate('/admin/login')}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Shop Admin Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManagementLogin;
