
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const NotFound = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
    )}>
      <div className={cn(
        "text-center p-8 rounded-lg shadow-lg max-w-md",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className={cn(
          "text-xl mb-6",
          isDarkMode ? "text-gray-300" : "text-gray-600"
        )}>
          Oops! Page not found
        </p>
        <p className={cn(
          "mb-6",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/" className="flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
