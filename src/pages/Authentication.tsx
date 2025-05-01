import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Heart, 
  ShoppingBag, 
  Facebook, 
  Phone, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  Smartphone,
  AlertTriangle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Authentication = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [authError, setAuthError] = useState<{message: string; isConfigError?: boolean} | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle, loginWithFacebook } = useAuth();
  const { isDarkMode } = useTheme();
  
  const from = location.state?.from?.pathname || "/";
  const redirectUrl = location.state?.redirectUrl || "/";
  
  const currentUser = useAuth().user;
  
  useEffect(() => {
    // Check if user is already authenticated
    if (currentUser?.id) {
      const hasConfirmedEmail = currentUser.user_metadata?.email_confirmed_at;
      
      if (hasConfirmedEmail) {
        setLoginStep("COMPLETE");
        navigate(redirectUrl || "/", { replace: true });
      }
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentUser, navigate, redirectUrl]);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const getErrorMessage = (error: any): {message: string; isConfigError?: boolean} => {
    // Handle Supabase error objects
    if (error.message) {
      switch (error.message) {
        case 'Email not confirmed':
          return {message: "Please confirm your email address."};
        case 'Invalid login credentials':
          return {message: "Invalid email or password. Please check your credentials and try again."};
        case 'Email already in use':
          return {message: "This email is already registered. Please try logging in instead."};
        case 'Password should be at least 6 characters':
          return {message: "Password must be at least 6 characters."};
        default:
          return {message: error.message};
      }
    }
    
    // Handle status code errors
    if (error.status) {
      switch (error.status) {
        case 400:
          return {message: "Invalid request. Please check your information and try again."};
        case 401:
          return {message: "Authentication failed. Please check your credentials."};
        case 403:
          return {message: "You don't have permission to perform this action."};
        case 404:
          return {message: "Account not found. Please sign up first."};
        case 422:
          return {message: "Validation failed. Please check your information."};
        case 429:
          return {message: "Too many requests. Please try again later."};
        case 500:
          return {message: "Server error. Please try again later."};
        default:
          return {message: "Authentication failed. Please try again."};
      }
    }
    
    // Generic fallback
    return {message: "Authentication failed. Please try again."};
  };
  
  const onLoginSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    setError("");
    setIsLogging(true);
    
    try {
      console.log("Attempting login with:", values.email);
      await login(values.email, values.password);
      toast.success("Login successful", {
        description: "Welcome back!"
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      const errorInfo = getErrorMessage(error);
      setAuthError(errorInfo);
      setError(errorInfo.message);
      toast.error("Login failed", {
        description: errorInfo.message
      });
    } finally {
      setIsLogging(false);
    }
  };
  
  const onSignupSubmit = async (values: SignupFormValues) => {
    setAuthError(null);
    setError("");
    setIsRegistering(true);
    
    try {
      console.log("Attempting registration with:", values.email);
      
      // Create the user with email/password
      const user = await register(values.email, values.password);
      
      // If we have a user object, update their metadata (like name)
      if (user) {
        console.log("User created successfully, id:", user.id);
        
        try {
          // Try to update the user profile with the name from the form
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ display_name: values.name })
            .eq('id', user.id);
            
          if (updateError) {
            console.error("Error updating profile with name:", updateError);
            // Don't fail registration just because we couldn't update the name
          }
        } catch (profileError) {
          console.error("Exception updating profile with name:", profileError);
          // Don't fail registration for profile updates
        }
        
        // Show success message
        toast.success("Registration successful", {
          description: "Your account has been created!"
        });
        
        // If email confirmation is required, show a special message
        if (!user.email_confirmed_at) {
          toast.info("Please check your email", {
            description: "A confirmation link has been sent to your email address"
          });
        }
        
        // Navigate to the target page
        navigate(from, { replace: true });
      } else {
        // This is weird but let's handle it gracefully
        console.warn("Registration completed but no user object returned");
        toast.success("Registration successful", {
          description: "Please check your email to verify your account"
        });
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific Supabase error messages
      if (error.message && error.message.includes("already registered")) {
        setError("This email is already registered. Please try logging in instead.");
        toast.error("Registration failed", {
          description: "This email is already registered. Please try logging in instead."
        });
      } else {
        // Use the generic error handler for other errors
        const errorInfo = getErrorMessage(error);
        setAuthError(errorInfo);
        setError(errorInfo.message);
        toast.error("Registration failed", {
          description: errorInfo.message
        });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setError("");
    try {
      await loginWithGoogle();
      toast.success("Login successful", {
        description: "Welcome back!"
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorInfo = getErrorMessage(error);
      setAuthError(errorInfo);
      setError(errorInfo.message);
      toast.error("Login failed", {
        description: errorInfo.message
      });
    }
  };

  const handleFacebookLogin = async () => {
    setAuthError(null);
    setError("");
    try {
      await loginWithFacebook();
      toast.success("Login successful", {
        description: "Welcome back!"
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Facebook login error:", error);
      const errorInfo = getErrorMessage(error);
      setAuthError(errorInfo);
      setError(errorInfo.message);
      toast.error("Login failed", {
        description: errorInfo.message
      });
    }
  };

  const handlePhoneLogin = () => {
    toast.info("Coming soon", {
      description: "Phone authentication will be implemented soon."
    });
  };
  
  return (
    <div className={cn(
      "min-h-screen flex md:items-center md:justify-center p-4",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950" 
        : "bg-gradient-to-br from-blue-50 to-white"
    )}>
      <div className={cn(
        "w-full max-w-7xl flex flex-col md:flex-row md:shadow-xl md:rounded-xl overflow-hidden",
        isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white"
      )}>
        <div className="w-full md:w-5/12 p-8 text-white hidden md:flex flex-col justify-between bg-gradient-to-tr from-blue-600 to-blue-400">
          <div>
            <h1 className="text-4xl font-bold mb-4">Vyoma</h1>
            <p className="text-xl mb-6">Your shopping companion for local discoveries</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <ShoppingBag className="w-5 h-5 mr-2" />
                <h3 className="font-medium">Easy Shopping</h3>
              </div>
              <p className="text-sm text-white/90">
                Discover and buy from local shops with secure checkout
              </p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <Heart className="w-5 h-5 mr-2" />
                <h3 className="font-medium">Save Favorites</h3>
              </div>
              <p className="text-sm text-white/90">
                Create wishlists and save items for later
              </p>
            </div>
          </div>
          
          <p className="text-sm text-white/70 mt-8">
            By continuing, you agree to Vyoma's Terms of Use and Privacy Policy
          </p>
        </div>
        
        <div className={cn(
          "w-full md:w-7/12 p-6 md:p-10",
          isDarkMode ? "text-gray-100" : ""
        )}>
          <div className="text-center mb-6 md:mb-8">
            <h1 className={cn(
              "text-2xl md:text-3xl font-bold md:hidden",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>Vyoma</h1>
            <h2 className={cn(
              "text-xl md:text-2xl font-medium",
              isDarkMode ? "text-gray-100" : "text-gray-800"
            )}>Welcome Back</h2>
            <p className={cn(
              "text-sm mt-1",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>Login or create an account to continue</p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className={cn(
              "grid grid-cols-2 mb-8 p-1 rounded-full w-full max-w-xs mx-auto",
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            )}>
              <TabsTrigger 
                value="login" 
                className={cn(
                  "rounded-full",
                  isDarkMode 
                    ? "data-[state=active]:bg-blue-500 data-[state=active]:text-white" 
                    : "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                )}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className={cn(
                  "rounded-full",
                  isDarkMode 
                    ? "data-[state=active]:bg-blue-500 data-[state=active]:text-white" 
                    : "data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                )}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className={cn(
                              "absolute left-3 top-3 h-5 w-5",
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            )} />
                            <Input 
                              placeholder="your.email@example.com" 
                              {...field} 
                              type="email" 
                              className={cn(
                                "pl-10 h-12",
                                isDarkMode 
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500" 
                                  : "border-gray-200 focus:border-blue-500"
                              )} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className={cn(
                              "absolute left-3 top-3 h-5 w-5",
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            )} />
                            <Input 
                              placeholder="••••••••" 
                              {...field} 
                              type="password" 
                              className={cn(
                                "pl-10 h-12",
                                isDarkMode 
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500" 
                                  : "border-gray-200 focus:border-blue-500"
                              )} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        className={cn(
                          "h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-0",
                          isDarkMode ? "border-gray-600 bg-gray-700" : ""
                        )}
                      />
                      <label htmlFor="remember" className={cn(
                        "ml-2 block text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        Remember me
                      </label>
                    </div>
                    <Link to="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={cn(
                      "w-full h-12 text-white font-medium",
                      isDarkMode
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    )}
                    disabled={isLogging}
                  >
                    {isLogging ? "Logging in..." : "Login"} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className={cn(
                              "absolute left-3 top-3 h-5 w-5",
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            )} />
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              className={cn(
                                "pl-10 h-12",
                                isDarkMode 
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500" 
                                  : "border-gray-200 focus:border-blue-500"
                              )} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className={cn(
                              "absolute left-3 top-3 h-5 w-5",
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            )} />
                            <Input 
                              placeholder="your.email@example.com" 
                              {...field} 
                              type="email" 
                              className={cn(
                                "pl-10 h-12",
                                isDarkMode 
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500" 
                                  : "border-gray-200 focus:border-blue-500"
                              )} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className={cn(
                              "absolute left-3 top-3 h-5 w-5",
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            )} />
                            <Input 
                              placeholder="••••••••" 
                              {...field} 
                              type="password" 
                              className={cn(
                                "pl-10 h-12",
                                isDarkMode 
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500" 
                                  : "border-gray-200 focus:border-blue-500"
                              )} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className={cn(
                              "absolute left-3 top-3 h-5 w-5",
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            )} />
                            <Input 
                              placeholder="••••••••" 
                              {...field} 
                              type="password" 
                              className={cn(
                                "pl-10 h-12",
                                isDarkMode 
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500" 
                                  : "border-gray-200 focus:border-blue-500"
                              )} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  {authError?.isConfigError && (
                    <Alert className={cn(
                      "bg-amber-50 border-amber-200 text-amber-800",
                      isDarkMode && "bg-amber-900/20 border-amber-700/50 text-amber-200"
                    )}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <AlertDescription className="text-xs">
                        {authError.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="text-xs mt-4">
                    <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                      By signing up, you agree to our 
                      <Link to="/help/terms" className="text-blue-500 hover:underline"> Terms of Service</Link> and 
                      <Link to="/help/privacy" className="text-blue-500 hover:underline"> Privacy Policy</Link>
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={cn(
                      "w-full h-12 text-white font-medium mt-2",
                      isDarkMode
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    )}
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Creating Account..." : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
