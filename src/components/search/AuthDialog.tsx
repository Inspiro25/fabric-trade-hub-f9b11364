
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

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

  const handleLogin = async () => {
    try {
      await loginWithGoogleProvider();
      onLogin();
      onOpenChange(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRedirectToAuth = () => {
    window.location.href = '/auth';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[425px] p-0 overflow-hidden border-0",
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      )}>
        {/* Header with gradient background */}
        <div className={cn(
          "bg-gradient-to-r from-orange-500 to-orange-600 p-6",
          isDarkMode ? "from-orange-600 to-orange-700" : ""
        )}>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <LogIn className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-white text-xl font-bold text-center">{title}</DialogTitle>
          <DialogDescription className="text-white/80 text-center mt-2">
            {message}
          </DialogDescription>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <div className="space-y-4">
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Sign in to unlock additional features:
            </p>
            
            <ul className={cn(
              "text-sm list-disc pl-5 space-y-1",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              <li>Save products to your wishlist</li>
              <li>Track your order history</li>
              <li>Get personalized recommendations</li>
              <li>Save your payment methods</li>
            </ul>
          </div>
          
          {/* Action buttons */}
          <div className="mt-6 space-y-3">
            <Button 
              onClick={handleLogin}
              className={cn(
                "w-full relative h-11",
                isDarkMode 
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              )}
            >
              Continue with Google
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              onClick={handleRedirectToAuth}
              variant="outline"
              className={cn(
                "w-full h-11 font-medium",
                isDarkMode 
                  ? "border-gray-600 hover:bg-gray-700 text-white" 
                  : "border-gray-200 hover:bg-gray-50 text-gray-800"
              )}
            >
              Sign up with Email
            </Button>
          </div>
        </div>
        
        {/* Footer */}
        <div className={cn(
          "px-6 py-4 bg-gray-50 text-xs text-center",
          isDarkMode ? "bg-gray-900 text-gray-400" : "text-gray-500"
        )}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
