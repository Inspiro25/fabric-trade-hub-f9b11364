
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Store, User, ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

// Validation schemas
const userLoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const userSignupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const adminLoginSchema = z.object({
  shopId: z.string().min(1, "Shop ID is required"),
  password: z.string().min(1, "Password is required"),
});

type UserLoginValues = z.infer<typeof userLoginSchema>;
type UserSignupValues = z.infer<typeof userSignupSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
type AdminLoginValues = z.infer<typeof adminLoginSchema>;

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isDarkMode } = useTheme();
  const { login, register: registerUser, currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('user');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Check if user is already logged in
  useEffect(() => {
    if (currentUser) {
      const { from } = location.state || { from: '/' };
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  // Forms
  const userLoginForm = useForm<UserLoginValues>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const userSignupForm = useForm<UserSignupValues>({
    resolver: zodResolver(userSignupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const forgotPasswordForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const adminForm = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { shopId: '', password: '' },
  });

  // Handle user login
  const onUserLoginSubmit = async (values: UserLoginValues) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
        variant: "default"
      });
      
      // Redirect to the page they tried to access or home
      const { from } = location.state || { from: '/' };
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user signup
  const onUserSignupSubmit = async (values: UserSignupValues) => {
    setIsLoading(true);
    try {
      await registerUser(values.email, values.password);
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
        variant: "default"
      });
      
      setAuthMode('login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const onForgotPasswordSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Reset link sent",
        description: "Please check your email for password reset instructions",
        variant: "default"
      });
      setAuthMode('login');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast({
        title: "Failed to send reset link",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle admin/management login
  const onAdminSubmit = async (values: AdminLoginValues) => {
    setIsLoading(true);
    try {
      // First try Supabase login
      const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
        email: `${values.shopId}@admin.platform.com`, // This is a specific format for shop admin emails
        password: values.password,
      });

      // If login succeeds and we have user data with the correct role
      if (!loginError && userData?.user) {
        // Fetch user profile to check role
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('preferences')
          .eq('id', userData.user.id)
          .single();
          
        if (profileData?.preferences?.role === 'shop_admin' || profileData?.preferences?.role === 'admin') {
          // Set local storage values for admin UI
          if (profileData?.preferences?.role === 'shop_admin') {
            sessionStorage.setItem('adminShopId', values.shopId);
            sessionStorage.setItem('adminRole', 'shop');
            navigate('/admin/dashboard');
          } else {
            sessionStorage.setItem('adminRole', 'main');
            navigate('/management/dashboard');
          }
          
          toast({
            title: "Login successful",
            description: "Welcome to the admin panel",
            variant: "default"
          });
          return;
        } else {
          // If user exists but doesn't have admin role, log them out
          await logout();
        }
      }

      // Fallback to checking hardcoded/development credentials
      if (values.shopId === 'admin' && values.password === 'admin123') {
        sessionStorage.setItem('adminUsername', values.shopId);
        sessionStorage.setItem('adminRole', 'main');
        
        toast({
          title: "Login successful",
          description: "Welcome to the management portal",
          variant: "default"
        });
        
        navigate('/management/dashboard');
        return;
      }

      // Check for shop admin credentials
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('shop_id', values.shopId)
        .single();

      if (shopError) {
        console.error('Shop query error:', shopError);
        throw new Error('Invalid shop ID or shop not found');
      }

      if (!shopData) {
        throw new Error('Shop not found');
      }

      // For development/testing, use a default password
      // In production, this should be replaced with proper authentication
      if (values.password === 'shop123' || values.password === shopData.password) {
        // Store shop information in session
        sessionStorage.setItem('adminShopId', values.shopId);
        sessionStorage.setItem('adminShopName', shopData.name || 'Shop');
        sessionStorage.setItem('adminRole', 'shop');

        toast({
          title: "Login successful",
          description: `Welcome to ${shopData.name || 'your shop'}'s admin panel`,
          variant: "default"
        });
        
        navigate('/admin/dashboard');
        return;
      }

      throw new Error('Invalid password');
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid shop ID or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Retrieve "from" path from location state if it exists
  const from = location.state?.from || '/';

  const renderUserAuthContent = () => {
    switch (authMode) {
      case 'login':
        return (
          <Form {...userLoginForm}>
            <form onSubmit={userLoginForm.handleSubmit(onUserLoginSubmit)} className="space-y-4">
              <FormField
                control={userLoginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isDarkMode ? "text-gray-200" : ""}>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="Enter your email" 
                          {...field}
                          className={cn(
                            "pl-9 bg-transparent",
                            isDarkMode 
                              ? "border-gray-700 text-white" 
                              : "border-gray-200"
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userLoginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isDarkMode ? "text-gray-200" : ""}>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password" 
                          {...field}
                          className={cn(
                            "pl-9 pr-9 bg-transparent",
                            isDarkMode 
                              ? "border-gray-700 text-white" 
                              : "border-gray-200"
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => setAuthMode('forgot')}
                >
                  Forgot password?
                </Button>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                  onClick={() => setAuthMode('signup')}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </Form>
        );
      case 'signup':
        return (
          <Form {...userSignupForm}>
            <form onSubmit={userSignupForm.handleSubmit(onUserSignupSubmit)} className="space-y-4">
              <FormField
                control={userSignupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isDarkMode ? "text-gray-200" : ""}>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="Enter your email" 
                          {...field}
                          className={cn(
                            "pl-9 bg-transparent",
                            isDarkMode 
                              ? "border-gray-700 text-white" 
                              : "border-gray-200"
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userSignupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isDarkMode ? "text-gray-200" : ""}>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password" 
                          {...field}
                          className={cn(
                            "pl-9 pr-9 bg-transparent",
                            isDarkMode 
                              ? "border-gray-700 text-white" 
                              : "border-gray-200"
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userSignupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isDarkMode ? "text-gray-200" : ""}>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password" 
                          {...field}
                          className={cn(
                            "pl-9 pr-9 bg-transparent",
                            isDarkMode 
                              ? "border-gray-700 text-white" 
                              : "border-gray-200"
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                  onClick={() => setAuthMode('login')}
                >
                  Login
                </Button>
              </div>
            </form>
          </Form>
        );
      case 'forgot':
        return (
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isDarkMode ? "text-gray-200" : ""}>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="Enter your email" 
                          {...field}
                          className={cn(
                            "pl-9 bg-transparent",
                            isDarkMode 
                              ? "border-gray-700 text-white" 
                              : "border-gray-200"
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
              <div className="text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                  onClick={() => setAuthMode('login')}
                >
                  Login
                </Button>
              </div>
            </form>
          </Form>
        );
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4",
      isDarkMode 
        ? "bg-gradient-to-br from-blue-950 via-gray-900 to-blue-900" 
        : "bg-gradient-to-br from-blue-50 via-white to-blue-100"
    )}>
      <div className="w-full max-w-md">
        <Card className={cn(
          "border shadow-lg overflow-hidden",
          isDarkMode 
            ? "bg-gray-800/90 border-gray-700 backdrop-blur-sm" 
            : "bg-white/90 border-gray-100 backdrop-blur-sm"
        )}>
          <CardHeader className="space-y-1 text-center relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className={cn(
                "absolute left-0 top-0 flex items-center gap-2",
                isDarkMode 
                  ? "text-gray-300 hover:text-white" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
            <motion.div 
              className={cn(
                "mx-auto mb-3 p-3 rounded-full",
                isDarkMode 
                  ? "bg-blue-900/50" 
                  : "bg-blue-100"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {activeTab === 'user' && <User className="h-6 w-6 text-blue-500" />}
              {activeTab === 'admin' && <Store className="h-6 w-6 text-blue-500" />}
            </motion.div>
            <CardTitle className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {activeTab === 'user' ? (
                authMode === 'login' ? 'Welcome Back' :
                authMode === 'signup' ? 'Create Account' :
                'Reset Password'
              ) : 'Admin Login'}
            </CardTitle>
            <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
              {activeTab === 'user' ? (
                authMode === 'login' ? 'Sign in to your account' :
                authMode === 'signup' ? 'Create a new account' :
                'Enter your email to reset your password'
              ) : 'Access the admin portal'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={cn(
                "grid w-full grid-cols-2 mb-4",
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              )}>
                <TabsTrigger 
                  value="user"
                  className={cn(
                    "text-sm",
                    isDarkMode && "data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100"
                  )}
                >
                  User
                </TabsTrigger>
                <TabsTrigger 
                  value="admin"
                  className={cn(
                    "text-sm",
                    isDarkMode && "data-[state=active]:bg-blue-900 data-[state=active]:text-blue-100"
                  )}
                >
                  Shop Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="mt-0">
                {renderUserAuthContent()}
              </TabsContent>

              <TabsContent value="admin" className="mt-0">
                <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
                    <FormField
                      control={adminForm.control}
                      name="shopId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDarkMode ? "text-gray-200" : ""}>Shop ID</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Store className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input 
                                placeholder="Enter your shop ID" 
                                {...field}
                                className={cn(
                                  "pl-9 bg-transparent",
                                  isDarkMode 
                                    ? "border-gray-700 text-white" 
                                    : "border-gray-200"
                                )}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDarkMode ? "text-gray-200" : ""}>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password" 
                                {...field}
                                className={cn(
                                  "pl-9 pr-9 bg-transparent",
                                  isDarkMode 
                                    ? "border-gray-700 text-white" 
                                    : "border-gray-200"
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login to Admin"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="px-6 py-4 border-t flex flex-col space-y-2">
            <div className="text-center text-sm text-gray-500">
              {from !== '/' && (
                <p>You need to login to access the requested page.</p>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedLogin;
