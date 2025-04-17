import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
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
          
          // Redirect to the original page or home
          navigate(from, { replace: true });
        } else {
          console.error('No session found after authentication');
          setError('Authentication failed. Please try again.');
        }
      } catch (error) {
        console.error('Exception handling auth callback:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-orange-50'}`}>
        <div className={`p-8 rounded-lg shadow-md max-w-md w-full text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">Authentication Error</h2>
          <p className="mb-6 text-sm">{error}</p>
          <button
            onClick={() => navigate('/auth/login')}
            className={`px-4 py-2 rounded text-white ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-orange-50'}`}>
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-orange-500' : 'border-orange-500'}`} />
    </div>
  );
};

export default AuthCallback; 