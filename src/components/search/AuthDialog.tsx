
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { LogIn, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
      const result = await loginWithGoogleProvider();
      
      // Add delay to ensure auth state is updated
      setTimeout(() => {
        const { data: { session } } = supabase.auth.getSession();
        if (session) {
          toast.success("Login successful!");
          onLogin();
        } else {
          // If we still don't have a session, redirect to auth page
          navigate('/auth');
        }
        onOpenChange(false);
      }, 1000);
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please try again.");
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
        "sm:max-w-[320px] p-0 overflow-hidden rounded-lg border-0 shadow-lg",
        isDarkMode ? "bg-gray-900 text-white" : "bg-white"
      )}>
        <div className="py-4 px-4">
          <DialogHeader className="gap-2">
            <div className="flex justify-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                isDarkMode ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"
              )}>
                <LogIn className="h-4 w-4" />
              </div>
            </div>
            <DialogTitle className={cn(
              "text-center text-base font-medium",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {title}
            </DialogTitle>
            <DialogDescription className={cn(
              "text-center text-xs",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {message}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-2">
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className={cn(
                "w-full relative h-9 rounded-md text-sm",
                isDarkMode 
                  ? "bg-orange-600 hover:bg-orange-700 text-white" 
                  : "bg-orange-600 hover:bg-orange-700 text-white"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Continue with Google
                  <ArrowRight className="ml-2 h-3 w-3" />
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleRedirectToAuth}
              disabled={isLoading}
              variant="outline"
              className={cn(
                "w-full h-9 text-sm rounded-md",
                isDarkMode 
                  ? "border-gray-800 hover:bg-gray-800 text-gray-200" 
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              )}
            >
              <Mail className="mr-2 h-3 w-3" />
              Sign up with Email
            </Button>
          </div>
        </div>
        
        <div className={cn(
          "px-4 py-2 text-[10px] text-center border-t",
          isDarkMode 
            ? "bg-gray-950 text-gray-500 border-gray-800" 
            : "bg-gray-50 text-gray-500 border-gray-100"
        )}>
          By continuing, you agree to our Terms and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
