import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "react-router-dom";
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
  const [authError, setAuthError] = useState<{message: string; isFirebaseConfig?: boolean} | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogleProvider, loginWithFacebookProvider } = useAuth();
  const { isDarkMode } = useTheme();
  
  const from = location.state?.from?.pathname || "/";
  
  useEffect(() => {
    if (location.state?.tab === "signup") {
      setActiveTab("signup");
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.state?.tab]);
  
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
  
  const getErrorMessage = (errorCode: string): {message: string; isFirebaseConfig?: boolean} => {
    switch (errorCode) {
      case 'auth/unauthorized-domain':
        return {
          message: "This domain is not authorized for Firebase authentication. Please add it to your Firebase console under Authentication > Settings > Authorized domains.",
          isFirebaseConfig: true
        };
      case 'auth/operation-not-allowed':
        return {
          message: "This authentication method is not enabled in the Firebase Console. Please contact support.",
          isFirebaseConfig: true
        };
      case 'auth/email-already-in-use':
        return {message: "This email is already registered. Please try logging in instead."};
      case 'auth/invalid-email':
        return {message: "The email address is not valid."};
      case 'auth/user-disabled':
        return {message: "This account has been disabled. Please contact support."};
      case 'auth/user-not-found':
        return {message: "No account found with this email. Please sign up first."};
      case 'auth/wrong-password':
        return {message: "Incorrect password. Please try again."};
      case 'auth/invalid-credential':
        return {message: "Invalid email or password. Please check your credentials and try again."};
      case 'auth/too-many-requests':
        return {message: "Too many failed attempts. Please try again later."};
      case 'auth/network-request-failed':
        return {message: "Network error. Please check your connection and try again."};
      default:
        return {message: "Authentication failed. Please try again."};
    }
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
      const errorCode = error.code || "";
      const errorInfo = getErrorMessage(errorCode);
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
      await register(values.email, values.password);
      toast.success("Registration successful", {
        description: "Your account has been created successfully!"
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorCode = error.code || "";
      const errorInfo = getErrorMessage(errorCode);
      setAuthError(errorInfo);
      setError(errorInfo.message);
      toast.error("Registration failed", {
        description: errorInfo.message
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setError("");
    try {
      await loginWithGoogleProvider();
      toast.success("Login successful", {
        description: "Welcome back!"
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorCode = error.code || "";
      const errorInfo = getErrorMessage(errorCode);
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
      await loginWithFacebookProvider();
      toast.success("Login successful", {
        description: "Welcome back!"
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Facebook login error:", error);
      const errorCode = error.code || "";
      const errorInfo = getErrorMessage(errorCode);
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
        : "bg-gradient-to-br from-orange-50 to-white"
    )}>
      <div className={cn(
        "w-full max-w-7xl flex flex-col md:flex-row md:shadow-xl md:rounded-xl overflow-hidden",
        isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white"
      )}>
        <div className="w-full md:w-5/12 p-8 text-white hidden md:flex flex-col justify-between bg-gradient-to-tr from-orange-600 to-orange-400">
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
              isDarkMode ? "text-orange-400" : "text-orange-600"
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
                    ? "data-[state=active]:bg-orange-500 data-[state=active]:text-white" 
                    : "data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                )}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className={cn(
                  "rounded-full",
                  isDarkMode 
                    ? "data-[state=active]:bg-orange-500 data-[state=active]:text-white" 
                    : "data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                )}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <div className="flex flex-col space-y-4 mb-4">
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-12",
                    isDarkMode 
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200" 
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  )}
                  onClick={handleGoogleLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="mr-2" viewBox="0 0 186.69 190.5">
                    <g transform="translate(1184.583 765.171)">
                      <path fill="#4285f4" d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"/>
                      <path fill="#34a853" d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"/>
                      <path fill="#fbbc05" d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"/>
                      <path fill="#ea4335" d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"/>
                    </g>
                  </svg>
                  Continue with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-12",
                    isDarkMode 
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200" 
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  )}
                  onClick={handleFacebookLogin}
                >
                  <Facebook className="w-5 h-5 mr-2 text-[#1877F2]" />
                  Continue with Facebook
                </Button>
                
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-12",
                    isDarkMode 
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200" 
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  )}
                  onClick={handlePhoneLogin}
                >
                  <Phone className="w-5 h-5 mr-2 text-orange-500" />
                  Continue with Phone
                </Button>
              </div>
              
              <div className="relative my-6">
                <Separator className={cn(
                  "absolute inset-0 flex items-center",
                  isDarkMode ? "bg-gray-700" : ""
                )} />
                <span className={cn(
                  "relative z-10 px-4 text-sm mx-auto",
                  isDarkMode ? "bg-gray-900 text-gray-400" : "bg-white text-gray-500"
                )}>or login with email</span>
              </div>
              
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
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-orange-500" 
                                  : "border-gray-200 focus:border-orange-500"
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
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-orange-500" 
                                  : "border-gray-200 focus:border-orange-500"
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
                          "h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-0",
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
                    <Link to="/auth/forgot-password" className="text-sm text-orange-500 hover:underline">
                      Forgot password?
                    </Link>
                    
                    <Link to="/help/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
                    <Link to="/help/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={cn(
                      "w-full h-12 text-white font-medium",
                      isDarkMode
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-orange-500 hover:bg-orange-600"
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
              <div className="flex flex-col space-y-4 mb-4">
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-12",
                    isDarkMode 
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200" 
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  )}
                  onClick={handleGoogleLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="mr-2" viewBox="0 0 186.69 190.5">
                    <g transform="translate(1184.583 765.171)">
                      <path fill="#4285f4" d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"/>
                      <path fill="#34a853" d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"/>
                      <path fill="#fbbc05" d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"/>
                      <path fill="#ea4335" d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"/>
                    </g>
                  </svg>
                  Sign up with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-12",
                    isDarkMode 
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200" 
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  )}
                  onClick={handleFacebookLogin}
                >
                  <Facebook className="w-5 h-5 mr-2 text-[#1877F2]" />
                  Sign up with Facebook
                </Button>
                
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-12",
                    isDarkMode 
                      ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200" 
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  )}
                  onClick={handlePhoneLogin}
                >
                  <Phone className="w-5 h-5 mr-2 text-orange-500" />
                  Sign up with Phone
                </Button>
              </div>
              
              <div className="relative my-6">
                <Separator className={cn(
                  "absolute inset-0 flex items-center",
                  isDarkMode ? "bg-gray-700" : ""
                )} />
                <span className={cn(
                  "relative z-10 px-4 text-sm mx-auto",
                  isDarkMode ? "bg-gray-900 text-gray-400" : "bg-white text-gray-500"
                )}>or sign up with email</span>
              </div>
              
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
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-orange-500" 
                                  : "border-gray-200 focus:border-orange-500"
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
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-orange-500" 
                                  : "border-gray-200 focus:border-orange-500"
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
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-orange-500" 
                                  : "border-gray-200 focus:border-orange-500"
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
                                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-orange-500" 
                                  : "border-gray-200 focus:border-orange-500"
                              )} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  {authError?.isFirebaseConfig && (
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
                      <a href="#" className="text-orange-500 hover:underline"> Terms of Service</a> and 
                      <a href="#" className="text-orange-500 hover:underline"> Privacy Policy</a>
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={cn(
                      "w-full h-12 text-white font-medium mt-2",
                      isDarkMode
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-orange-500 hover:bg-orange-600"
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
