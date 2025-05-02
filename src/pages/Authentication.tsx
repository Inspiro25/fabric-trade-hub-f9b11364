import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from '@/contexts/ThemeContext';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Theme } from '@/types/auth';

interface SignupFormValues {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
}

interface LoginFormValues {
  email?: string;
  password?: string;
}

const AuthenticationPage = () => {
  const { login, signUp, currentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Instead of using user_metadata directly, check for the property first
      const displayName = currentUser.displayName || 
        (currentUser.user_metadata && currentUser.user_metadata.full_name) || '';
      navigate('/');
    }
  }, [currentUser, navigate]);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleSignup = async (data: SignupFormValues) => {
    try {
      setIsSubmitting(true);

      // Define user metadata with optional phone and address
      const metadata: Record<string, string> = {
        full_name: data.name || ''
      };

      // Only add these if they exist in the form data
      if ('phone' in data && data.phone) {
        metadata.phone = data.phone;
      }

      if ('address' in data && data.address) {
        metadata.address = data.address;
      }

      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      // Call the signup function with the metadata
      await signUp(data.email || '', data.password || '', metadata);
      toast.success('Signup successful! Please check your email to verify.');
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await login(data.email || '', data.password || '');
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      // Check if email_confirmed_at property exists before using it
      const isEmailConfirmed = currentUser.email_confirmed_at !== undefined;
      // Redirect only if email is confirmed
      if (isEmailConfirmed) {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isSignup ? 'Create an account' : 'Sign in to your account'}
            </h2>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">{isSignup ? 'Sign Up' : 'Login'}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {isSignup ? (
              <SignupForm onSubmit={handleSignup} isSubmitting={isSubmitting} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} />
            ) : (
              <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} showPassword={showPassword} setShowPassword={setShowPassword} />
            )}
            <div className="text-sm text-gray-600 text-center">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <Link to="/auth/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <Link to="/auth/signup" className="text-blue-600 hover:underline">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface SignupFormProps {
  onSubmit: (data: SignupFormValues) => Promise<void>;
  isSubmitting: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isSubmitting, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, email, password, confirmPassword, phone, address });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>
      <Button disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
};

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isSubmitting: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isSubmitting, showPassword, setShowPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>
      <Button disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default AuthenticationPage;
