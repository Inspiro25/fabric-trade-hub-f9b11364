
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onOpenChange,
  onLogin
}) => {
  const { loginWithGoogleProvider } = useAuth();

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to perform this action.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-gray-500">
            Please log in to access additional features like adding to wishlist, saving search history, and getting personalized recommendations.
          </p>
        </div>
        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Not Now
          </Button>
          <Button onClick={handleLogin}>
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
