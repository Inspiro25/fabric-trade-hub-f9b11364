
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { LogIn, Mail, ShoppingBag, Heart, Bell, UserCircle, ArrowRight } from 'lucide-react';
import { AnimatedGradient } from '@/components/ui/animated-gradient';

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
  const { isDarkMode, primaryColor } = useTheme();

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
        "sm:max-w-[425px] p-0 overflow-hidden border-0 rounded-xl shadow-xl",
        isDarkMode 
          ? "bg-gray-900/95 text-white border border-gray-800" 
          : "bg-white"
      )}>
        {/* Animated header with gradient */}
        <AnimatedGradient 
          className="py-8 px-6"
          hue="orange"
          intensity={isDarkMode ? "medium" : "soft"}
          speed="medium"
        >
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className={cn(
              "bg-white/20 p-3 rounded-full mb-4 backdrop-blur-sm",
              isDarkMode ? "shadow-[0_0_15px_rgba(255,165,0,0.15)]" : ""
            )}>
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-white text-xl font-bold text-center">{title}</DialogTitle>
            <DialogDescription className="text-white/90 text-center mt-2 max-w-[300px]">
              {message}
            </DialogDescription>
          </div>
        </AnimatedGradient>
        
        {/* Body with feature list */}
        <div className="p-6">
          <div className="space-y-5">
            <p className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-slate-300" : "text-slate-700"
            )}>
              Join for exclusive benefits:
            </p>
            
            <div className="space-y-3">
              <FeatureItem 
                icon={<Heart size={16} />}
                text="Save favorites to your wishlist"
                isDarkMode={isDarkMode}
              />
              <FeatureItem 
                icon={<ShoppingBag size={16} />}
                text="Access your order history anytime"
                isDarkMode={isDarkMode}
              />
              <FeatureItem 
                icon={<Bell size={16} />}
                text="Get personalized recommendations"
                isDarkMode={isDarkMode}
              />
              <FeatureItem 
                icon={<UserCircle size={16} />}
                text="Create your personal profile"
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-6 space-y-3">
            <Button 
              onClick={handleLogin}
              className={cn(
                "w-full relative h-11 rounded-full transition-all duration-300",
                isDarkMode 
                  ? "bg-orange-500/90 hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)]" 
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
                "w-full h-11 font-medium rounded-full transition-all duration-300",
                isDarkMode 
                  ? "border-gray-700 hover:bg-gray-800 text-white" 
                  : "border-gray-200 hover:bg-gray-50 text-gray-800"
              )}
            >
              Sign up with Email
            </Button>
          </div>
        </div>
        
        {/* Footer */}
        <div className={cn(
          "px-6 py-4 text-xs text-center border-t",
          isDarkMode 
            ? "bg-gray-900/80 text-gray-500 border-gray-800" 
            : "bg-gray-50 text-gray-500 border-gray-100"
        )}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for feature items
const FeatureItem = ({ 
  icon, 
  text, 
  isDarkMode 
}: { 
  icon: React.ReactNode; 
  text: string; 
  isDarkMode: boolean 
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isDarkMode 
          ? "bg-orange-500/10 text-orange-400" 
          : "bg-orange-100 text-orange-600"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-sm",
        isDarkMode ? "text-gray-300" : "text-gray-700"
      )}>
        {text}
      </span>
    </div>
  );
};

export default AuthDialog;
