
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""
      )}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? "text-white" : ""}>{title}</DialogTitle>
          <DialogDescription className={isDarkMode ? "text-gray-400" : ""}>
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-300" : "text-gray-500"
          )}>
            Please log in to access additional features like adding to wishlist, saving search history, and getting personalized recommendations.
          </p>
        </div>
        <DialogFooter className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-200" : ""}
          >
            Not Now
          </Button>
          <Button 
            onClick={handleLogin}
            className={cn(
              isDarkMode 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "bg-kutuku-primary hover:bg-kutuku-secondary text-white"
            )}
          >
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
