
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Mail, Lock, User, Eye, EyeOff, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Authentication = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('register') ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, register: registerUser, loginWithGoogleProvider, loginWithFacebookProvider } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser(email, password);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogleProvider();
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithFacebookProvider();
      navigate('/');
    } catch (error) {
      console.error('Facebook login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-page-transition min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-16 pb-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className={`max-w-md mx-auto transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">VyomaKart</h1>
              <p className="text-gray-600 mt-2">Your One-Stop Shopping Destination</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-2 h-14 rounded-none border-b">
                  <TabsTrigger value="login" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 rounded-none">Sign In</TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 rounded-none">Create Account</TabsTrigger>
                </TabsList>
                
                {/* Login Form */}
                <TabsContent value="login" className="px-6 py-8">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Mail className="h-5 w-5" />
                        </div>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-10 py-5 h-11 border-gray-200 bg-gray-50/50 focus:bg-white" 
                          value={loginEmail} 
                          onChange={e => setLoginEmail(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-gray-700">Password</Label>
                        <Button variant="link" className="p-0 h-auto text-xs text-blue-600" asChild>
                          <a href="/forgot-password">Forgot password?</a>
                        </Button>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Lock className="h-5 w-5" />
                        </div>
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-10 py-5 h-11 border-gray-200 bg-gray-50/50 focus:bg-white" 
                          value={loginPassword} 
                          onChange={e => setLoginPassword(e.target.value)} 
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500" 
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing In...' : 'Sign In'}
                      {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                    </Button>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full border-gray-200 hover:bg-gray-50 text-gray-700" 
                        onClick={handleGoogleLogin} 
                        disabled={isSubmitting}
                      >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                      </Button>
                      <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full border-gray-200 hover:bg-gray-50 text-gray-700" 
                        onClick={handleFacebookLogin} 
                        disabled={isSubmitting}
                      >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill="#1877F2" />
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                {/* Register Form */}
                <TabsContent value="register" className="px-6 py-8">
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <User className="h-5 w-5" />
                        </div>
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="John Doe" 
                          className="pl-10 py-5 h-11 border-gray-200 bg-gray-50/50 focus:bg-white" 
                          value={name} 
                          onChange={e => setName(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-gray-700">Email Address</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Mail className="h-5 w-5" />
                        </div>
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-10 py-5 h-11 border-gray-200 bg-gray-50/50 focus:bg-white" 
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Phone className="h-5 w-5" />
                        </div>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+1 (123) 456-7890" 
                          className="pl-10 py-5 h-11 border-gray-200 bg-gray-50/50 focus:bg-white" 
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-gray-700">Password</Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Lock className="h-5 w-5" />
                          </div>
                          <Input 
                            id="register-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10 py-5 h-11 border-gray-200 bg-gray-50/50 focus:bg-white" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-gray-700">Confirm Password</Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Lock className="h-5 w-5" />
                          </div>
                          <Input 
                            id="confirm-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10 py-5 h-11 border-gray-200 bg-gray-50/50 focus:bg-white" 
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)} 
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500" 
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        required 
                      />
                      <Label htmlFor="terms" className="text-sm leading-none text-gray-700">
                        I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                      {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                    </Button>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">
                          Or sign up with
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full border-gray-200 hover:bg-gray-50 text-gray-700" 
                        onClick={handleGoogleLogin} 
                        disabled={isSubmitting}
                      >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                      </Button>
                      <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full border-gray-200 hover:bg-gray-50 text-gray-700" 
                        onClick={handleFacebookLogin} 
                        disabled={isSubmitting}
                      >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill="#1877F2" />
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Authentication;
