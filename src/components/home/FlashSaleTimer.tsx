
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export interface FlashSaleTimerProps {
  endTime: Date;
}

export default function FlashSaleTimer({ endTime }: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-2">
        <TimerBox value={pad(timeLeft.days)} label="DAYS" isDarkMode={isDarkMode} />
        <TimerSeparator isDarkMode={isDarkMode} />
        <TimerBox value={pad(timeLeft.hours)} label="HRS" isDarkMode={isDarkMode} />
        <TimerSeparator isDarkMode={isDarkMode} />
        <TimerBox value={pad(timeLeft.minutes)} label="MIN" isDarkMode={isDarkMode} />
        <TimerSeparator isDarkMode={isDarkMode} />
        <TimerBox value={pad(timeLeft.seconds)} label="SEC" isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

function TimerBox({
  value,
  label,
  isDarkMode
}: {
  value: string;
  label: string;
  isDarkMode: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "min-w-[42px] text-center px-2 py-1 rounded font-mono font-bold",
        isDarkMode 
          ? "bg-gray-700 text-white" 
          : "bg-gray-100 text-gray-800"
      )}>
        {value}
      </div>
      <div className={cn(
        "text-xs mt-1 font-semibold",
        isDarkMode ? "text-gray-400" : "text-gray-500"
      )}>
        {label}
      </div>
    </div>
  );
}

function TimerSeparator({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className={cn(
      "text-lg font-bold",
      isDarkMode ? "text-gray-400" : "text-gray-400"
    )}>:</div>
  );
}
