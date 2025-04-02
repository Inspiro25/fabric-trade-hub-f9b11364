
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const faqItems = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by going to the Orders section in your account and selecting the order you want to track. From there, you'll be able to see real-time updates on your order's status and location."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in their original condition with tags attached and original packaging. Some items like personal care products and opened software are not eligible for returns."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Express shipping is 1-2 business days. International shipping can take 7-14 business days depending on the destination country."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see the shipping options available during checkout."
    },
    {
      question: "How can I cancel my order?",
      answer: "If your order hasn't been shipped yet, you can cancel it through the Orders section in your account. If it has already been shipped, you'll need to wait until you receive it and then initiate a return."
    }
  ];
  
  return (
    <div className={cn(
      "pb-16 min-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 backdrop-blur-md px-3 py-2 border-b",
        isDarkMode 
          ? "bg-gray-800/80 border-gray-700" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full",
              isDarkMode ? "text-gray-300" : ""
            )} 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : ""
          )}>Help & Support</h1>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className={cn(
        "p-4 border-b",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      )}>
        <div className="relative">
          <Input 
            placeholder="Search for help topics" 
            className={cn(
              "pr-10",
              isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : ""
            )} 
          />
        </div>
      </div>
      
      {/* Help Content */}
      <div className="p-4 space-y-4">
        {/* Contact Methods */}
        <div className="grid grid-cols-3 gap-3">
          <Card className={cn(
            "border",
            isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
          )}>
            <CardContent className="p-3 text-center">
              <div className={cn(
                "mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2",
                isDarkMode ? "bg-blue-900/50" : "bg-blue-50"
              )}>
                <Phone size={18} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
              </div>
              <h3 className={cn(
                "text-xs font-medium",
                isDarkMode ? "text-white" : ""
              )}>Call Us</h3>
              <p className={cn(
                "text-[10px]",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>24/7 Support</p>
            </CardContent>
          </Card>
          
          <Card className={cn(
            "border",
            isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
          )}>
            <CardContent className="p-3 text-center">
              <div className={cn(
                "mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2",
                isDarkMode ? "bg-blue-900/50" : "bg-blue-50"
              )}>
                <Mail size={18} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
              </div>
              <h3 className={cn(
                "text-xs font-medium",
                isDarkMode ? "text-white" : ""
              )}>Email</h3>
              <p className={cn(
                "text-[10px]",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>24h Response</p>
            </CardContent>
          </Card>
          
          <Card className={cn(
            "border",
            isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
          )}>
            <CardContent className="p-3 text-center">
              <div className={cn(
                "mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2",
                isDarkMode ? "bg-blue-900/50" : "bg-blue-50"
              )}>
                <MessageSquare size={18} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
              </div>
              <h3 className={cn(
                "text-xs font-medium",
                isDarkMode ? "text-white" : ""
              )}>Live Chat</h3>
              <p className={cn(
                "text-[10px]",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>Online Support</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Frequently Asked Questions */}
        <Card className={cn(
          "border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
        )}>
          <CardContent className="p-4">
            <h2 className={cn(
              "text-sm font-medium mb-3",
              isDarkMode ? "text-white" : ""
            )}>Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className={isDarkMode ? "border-gray-700" : ""}
                >
                  <AccordionTrigger className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-200 hover:text-white" : ""
                  )}>{item.question}</AccordionTrigger>
                  <AccordionContent className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        {/* Support Request */}
        <Card className={cn(
          "border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
        )}>
          <CardContent className="p-4">
            <h2 className={cn(
              "text-sm font-medium mb-3",
              isDarkMode ? "text-white" : ""
            )}>Still Need Help?</h2>
            <p className={cn(
              "text-xs mb-4",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              If you couldn't find what you were looking for, please submit a support request and we'll get back to you as soon as possible.
            </p>
            <Button className={cn(
              "w-full",
              isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""
            )}>Submit a Request</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
