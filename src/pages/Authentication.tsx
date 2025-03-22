
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Heart, ShoppingBag } from "lucide-react";

// Create form schemas
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
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, currentUser } = useAuth();
  
  const from = location.state?.from?.pathname || "/";
  
  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      navigate(from, { replace: true });
    }
    
    // Simulate loading delay for smoother transitions
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentUser, navigate, from]);
  
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
  
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/operation-not-allowed':
        return "This authentication method is not enabled in the Firebase Console. Please contact support.";
      case 'auth/email-already-in-use':
        return "This email is already registered. Please try logging in instead.";
      case 'auth/invalid-email':
        return "The email address is not valid.";
      case 'auth/user-disabled':
        return "This account has been disabled. Please contact support.";
      case 'auth/user-not-found':
        return "No account found with this email. Please sign up first.";
      case 'auth/wrong-password':
        return "Incorrect password. Please try again.";
      case 'auth/too-many-requests':
        return "Too many failed attempts. Please try again later.";
      case 'auth/network-request-failed':
        return "Network error. Please check your connection and try again.";
      default:
        return "Authentication failed. Please try again.";
    }
  };
  
  const onLoginSubmit = async (values: LoginFormValues) => {
    setError("");
    setIsLogging(true);
    
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      const errorCode = error.code || "";
      setError(getErrorMessage(errorCode));
    } finally {
      setIsLogging(false);
    }
  };
  
  const onSignupSubmit = async (values: SignupFormValues) => {
    setError("");
    setIsRegistering(true);
    
    try {
      // The register function expects only email and password
      await register(values.email, values.password);
      
      // After successful registration, update the user profile with the name
      // This would require additional code if you want to store the name
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorCode = error.code || "";
      setError(getErrorMessage(errorCode));
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex-1 flex flex-col">
        {/* Auth Form Section */}
        <div className="w-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 order-1">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-kutuku-primary">Vyoma</h1>
              <p className="text-gray-500 text-sm">Your shopping companion</p>
            </div>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-kutuku-primary hover:bg-kutuku-secondary" 
                      disabled={isLogging}
                    >
                      {isLogging ? "Logging in..." : "Log in"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-kutuku-primary hover:bg-kutuku-secondary" 
                      disabled={isRegistering}
                    >
                      {isRegistering ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Description Section */}
        <div className="w-full bg-kutuku-primary text-white p-6 md:p-10 order-2">
          <div className="max-w-md mx-auto h-full flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Experience Vyoma</h2>
              <p className="text-white/80 mb-6">
                Your one-stop destination for all your shopping needs. Discover products from local shops and businesses.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">Easy Shopping</h3>
                  </div>
                  <p className="text-sm text-white/70">
                    Seamless shopping experience with secure checkout and tracking.
                  </p>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Heart className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">Wishlist</h3>
                  </div>
                  <p className="text-sm text-white/70">
                    Save your favorite items for later and share with friends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
