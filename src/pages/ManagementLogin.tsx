
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
import { Lock, ShieldAlert } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-10 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <ShieldAlert className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-center">Management Portal</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
        <CardFooter className="flex justify-center text-sm text-gray-500">
          Only authorized personnel can access this portal
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManagementLogin;
