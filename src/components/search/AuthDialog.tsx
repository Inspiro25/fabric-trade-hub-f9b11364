
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
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        toast.success("Login successful!");
        onLogin();
        onOpenChange(false);
      } else {
        navigate('/login', { replace: true });
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please try again.");
      navigate('/login', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToAuth = () => {
    navigate('/login', { replace: true });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[360px] w-[95%] p-0 overflow-hidden rounded-xl border shadow-xl",
        isDarkMode 
          ? "bg-gray-900 text-white border-gray-800" 
          : "bg-white border-gray-100"
      )}>
        <div className="p-5 sm:p-6">
          <DialogHeader className="gap-3">
            <div className="flex justify-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isDarkMode 
                  ? "bg-orange-500/20 text-orange-400" 
                  : "bg-orange-100 text-orange-600"
              )}>
                <LogIn className="h-5 w-5" />
              </div>
            </div>
            <DialogTitle className={cn(
              "text-center text-lg font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {title}
            </DialogTitle>
            <DialogDescription className={cn(
              "text-center text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {message}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-3">
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className={cn(
                "w-full relative h-11 rounded-lg text-sm font-medium transition-colors",
                isDarkMode 
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Continue with Google</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>

            <Button
              onClick={handleRedirectToAuth}
              variant="outline"
              className={cn(
                "w-full h-11 rounded-lg text-sm font-medium transition-colors",
                isDarkMode 
                  ? "border-gray-700 hover:bg-gray-800" 
                  : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center justify-center">
                <Mail className="h-4 w-4" />
                <span className="ml-2">Continue with Email</span>
              </div>
            </Button>
          </div>
        </div>
        
        <div className={cn(
          "px-5 py-3 text-xs text-center border-t",
          isDarkMode 
            ? "bg-gray-950/50 text-gray-500 border-gray-800" 
            : "bg-gray-50 text-gray-500 border-gray-100"
        )}>
          By continuing, you agree to our Terms and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
