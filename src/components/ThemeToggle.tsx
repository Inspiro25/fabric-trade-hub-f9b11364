
import React from 'react';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode, setTheme, currentTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative rounded-full w-9 h-9 p-0",
            isDarkMode ? "text-gray-200" : "text-amber-600"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDarkMode ? (
              <motion.div
                key="moon-icon"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="sun-icon"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn(
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      )}>
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            currentTheme === "light" && "font-medium",
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          )}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {currentTheme === "light" && (
            <span className={cn(
              "ml-auto h-2 w-2 rounded-full",
              isDarkMode ? "bg-orange-400" : "bg-orange-500"
            )}></span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            currentTheme === "dark" && "font-medium",
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          )}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {currentTheme === "dark" && (
            <span className={cn(
              "ml-auto h-2 w-2 rounded-full",
              isDarkMode ? "bg-orange-400" : "bg-orange-500"
            )}></span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            currentTheme === "system" && "font-medium",
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          )}
        >
          <SunMoon className="h-4 w-4" />
          <span>System</span>
          {currentTheme === "system" && (
            <span className={cn(
              "ml-auto h-2 w-2 rounded-full",
              isDarkMode ? "bg-orange-400" : "bg-orange-500"
            )}></span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
