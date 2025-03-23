
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { LogIn, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
  message?: string;
  title?: string;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onOpenChange,
  onLogin,
  message = "You need to be logged in to perform this action.",
  title = "Login Required"
}) => {
  const { loginWithGoogleProvider } = useAuth();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogleProvider();
      
      toast.success("Login successful!");
      onLogin();
      onOpenChange(false);
      // Navigate to home page after successful login
      navigate('/');
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToAuth = () => {
    navigate('/auth');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[360px] p-0 overflow-hidden rounded-lg",
        isDarkMode 
          ? "bg-gray-800 text-white border border-gray-700" 
          : "bg-white border border-gray-100"
      )}>
        <div className={cn(
          "py-5 px-5",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <DialogHeader className="space-y-3">
            <div className="flex justify-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isDarkMode ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600"
              )}>
                <LogIn className="h-5 w-5" />
              </div>
            </div>
            <DialogTitle className={cn(
              "text-center text-lg",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {title}
            </DialogTitle>
            <DialogDescription className={cn(
              "text-center text-sm",
              isDarkMode ? "text-gray-300" : "text-gray-500"
            )}>
              {message}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-5 space-y-3">
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className={cn(
                "w-full relative h-10 rounded-md transition-all duration-300",
                isDarkMode 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Continue with Google
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleRedirectToAuth}
              disabled={isLoading}
              variant="outline"
              className={cn(
                "w-full h-10 font-medium rounded-md transition-all duration-300",
                isDarkMode 
                  ? "border-gray-700 hover:bg-gray-700 text-white" 
                  : "border-gray-200 hover:bg-gray-50 text-gray-800"
              )}
            >
              <Mail className="mr-2 h-4 w-4" />
              Sign up with Email
            </Button>
          </div>
        </div>
        
        <div className={cn(
          "px-5 py-3 text-xs text-center border-t",
          isDarkMode 
            ? "bg-gray-900/60 text-gray-400 border-gray-700" 
            : "bg-gray-50 text-gray-500 border-gray-100"
        )}>
          By continuing, you agree to our Terms and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
