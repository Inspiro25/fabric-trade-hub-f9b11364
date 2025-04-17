import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Lock, ShieldAlert } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Validation schema
const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const ManagementLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Inside the component where toast is called with duration
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Check credentials against static admin accounts
      if (values.username === 'admin' && values.password === 'admin123') {
        sessionStorage.setItem('adminUsername', values.username);
        sessionStorage.setItem('adminRole', 'main');
        
        // Use a timeout to prevent any potential state update issues
        setTimeout(() => {
          toast({
            title: "Login successful",
            description: "Welcome to the management portal"
          });
          navigate('/management/dashboard');
        }, 100);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Use a timeout to prevent any potential state update issues
      setTimeout(() => {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  // Letter animation for VYOMA
  const letterVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { scale: 1.2, y: -3, transition: { duration: 0.2 } }
  };

  return (
    <div className={cn(
      "h-screen flex items-center justify-center p-4 overflow-hidden",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 to-gray-800" 
        : "bg-gradient-to-br from-vyoma-light to-orange-50"
    )}>
      <div className={`w-full ${isMobile ? 'max-w-[95%]' : 'max-w-md'}`}>
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={cn(
            "text-3xl font-bold flex items-center justify-center gap-1",
            isDarkMode ? "text-orange-400" : "text-vyoma-primary"
          )}>
            <motion.div 
              className="flex"
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              {Array.from("VYOMA").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  custom={index}
                  transition={{ 
                    delay: 0.3 + index * 0.1,
                    duration: 0.4
                  }}
                  className="relative"
                  whileHover={{
                    color: isDarkMode ? "#ff9d6c" : "#FF8A3D",
                    scale: 1.2,
                    transition: { duration: 0.2 }
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </h1>
          <motion.p 
            className={cn(
              "mt-1",
              isDarkMode ? "text-gray-300" : "text-vyoma-secondary"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Management Portal
          </motion.p>
        </motion.div>
        
        <Card className={cn(
          "border-none shadow-lg",
          isDarkMode 
            ? "bg-gray-800/90 backdrop-blur-sm" 
            : "bg-white/90 backdrop-blur-sm"
        )}>
          <CardHeader className={`space-y-1 ${isMobile ? 'pb-4' : 'pb-6'}`}>
            <motion.div 
              className={cn(
                "mx-auto mb-3 p-3 rounded-full",
                isDarkMode 
                  ? "bg-gradient-to-br from-gray-700 to-gray-600" 
                  : "bg-gradient-to-br from-vyoma-light to-orange-100"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <ShieldAlert className={cn(
                "h-6 w-6",
                isDarkMode ? "text-orange-400" : "text-vyoma-primary"
              )} />
            </motion.div>
            <CardTitle className={cn(
              `${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-center`,
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              Admin Login
            </CardTitle>
            <CardDescription className={cn(
              "text-center text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Enter your credentials to access the management portal
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
                      <FormLabel className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          className={cn(
                            isDarkMode 
                              ? "bg-gray-700/50 border-gray-600 focus:border-orange-500 text-white" 
                              : "bg-white/50 border-gray-200 focus:border-vyoma-primary"
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
                              : "bg-white/50 border-gray-200 focus:border-vyoma-primary"
                          )} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    type="submit" 
                    className={cn(
                      "w-full mt-4 text-white font-medium",
                      isDarkMode 
                        ? "bg-orange-500 hover:bg-orange-600" 
                        : "bg-vyoma-primary hover:bg-vyoma-secondary"
                    )} 
                    disabled={isLoading}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center pt-0">
            <p className={cn(
              "text-xs mb-2",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              Default credentials: admin / admin123
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ManagementLogin;
