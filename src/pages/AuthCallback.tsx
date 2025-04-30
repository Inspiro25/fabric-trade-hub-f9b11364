
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setProcessing(true);
        
        // Process the OAuth callback
        const { data, error: callbackError } = await supabase.auth.getSession();
        
        if (callbackError) {
          console.error('Error handling auth callback:', callbackError);
          setError(callbackError.message);
          return;
        }

        if (data?.session) {
          console.log('Successfully authenticated, redirecting...');
          
          // Get the from path if it exists in the URL
          const params = new URLSearchParams(location.search);
          const from = params.get('from') || '/';
          
          // Small delay to ensure auth state is fully updated
          setTimeout(() => {
            // Redirect to the original page or home
            navigate(from, { replace: true });
          }, 500);
        } else {
          console.error('No session found after authentication');
          setError('Authentication failed. Please try again.');
        }
      } catch (error) {
        console.error('Exception handling auth callback:', error);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  if (error) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col items-center justify-center p-4",
        isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"
      )}>
        <div className={cn(
          "p-8 rounded-lg shadow-md max-w-md w-full text-center",
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"
        )}>
          <div className="flex justify-center mb-4">
            <AlertTriangle className={cn(
              "h-12 w-12",
              isDarkMode ? "text-red-400" : "text-red-500"
            )} />
          </div>
          <h2 className="text-xl font-bold mb-4">Authentication Error</h2>
          <p className="mb-6 text-sm">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => navigate('/auth/login')}
              className={cn(
                "px-4 py-2 rounded text-white",
                isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              Back to Login
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className={cn(
                isDarkMode ? "border-gray-600 text-gray-200" : "border-gray-300"
              )}
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center",
      isDarkMode ? "bg-gray-900" : "bg-blue-50"
    )}>
      <div className="text-center">
        <Loader2 className={cn(
          "animate-spin h-12 w-12 mx-auto",
          isDarkMode ? "text-blue-400" : "text-blue-500"
        )} />
        <p className={cn(
          "mt-4 text-lg font-medium",
          isDarkMode ? "text-gray-200" : "text-gray-700"
        )}>
          Completing authentication...
        </p>
        <p className={cn(
          "mt-2 text-sm",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          You'll be redirected shortly.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
