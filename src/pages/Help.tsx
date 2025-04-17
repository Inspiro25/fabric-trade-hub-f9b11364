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
      "min-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Desktop Header */}
      <div className={cn(
        "hidden md:block sticky top-0 z-10 backdrop-blur-md border-b",
        isDarkMode 
          ? "bg-gray-800/80 border-gray-700" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="container mx-auto px-6 py-4">
          <h1 className={cn(
            "text-2xl font-semibold",
            isDarkMode ? "text-white" : ""
          )}>Help & Support</h1>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={cn(
        "md:hidden sticky top-0 z-10 backdrop-blur-md px-3 py-2 border-b",
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
        "border-b",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      )}>
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Input 
              placeholder="Search for help topics" 
              className={cn(
                "pr-10",
                isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : ""
              )} 
            />
            <HelpCircle className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )} />
          </div>
        </div>
      </div>
      
      {/* Help Content */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Contact Methods & Support Request */}
          <div className="md:w-1/3 space-y-6">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 gap-4">
              <Card className={cn(
                "border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
              )}>
                <CardContent className="p-4">
                  <div className={cn(
                    "mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3",
                    isDarkMode ? "bg-blue-900/50" : "bg-blue-50"
                  )}>
                    <Phone size={24} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
                  </div>
                  <h3 className={cn(
                    "text-sm font-medium text-center mb-1",
                    isDarkMode ? "text-white" : ""
                  )}>Call Us</h3>
                  <p className={cn(
                    "text-xs text-center",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>24/7 Support</p>
                  <p className={cn(
                    "text-sm text-center mt-2 font-medium",
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  )}>+1 (555) 123-4567</p>
                </CardContent>
              </Card>
              
              <Card className={cn(
                "border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
              )}>
                <CardContent className="p-4">
                  <div className={cn(
                    "mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3",
                    isDarkMode ? "bg-blue-900/50" : "bg-blue-50"
                  )}>
                    <Mail size={24} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
                  </div>
                  <h3 className={cn(
                    "text-sm font-medium text-center mb-1",
                    isDarkMode ? "text-white" : ""
                  )}>Email</h3>
                  <p className={cn(
                    "text-xs text-center",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>24h Response</p>
                  <p className={cn(
                    "text-sm text-center mt-2 font-medium",
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  )}>support@vyoma.com</p>
                </CardContent>
              </Card>
              
              <Card className={cn(
                "border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
              )}>
                <CardContent className="p-4">
                  <div className={cn(
                    "mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3",
                    isDarkMode ? "bg-blue-900/50" : "bg-blue-50"
                  )}>
                    <MessageSquare size={24} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
                  </div>
                  <h3 className={cn(
                    "text-sm font-medium text-center mb-1",
                    isDarkMode ? "text-white" : ""
                  )}>Live Chat</h3>
                  <p className={cn(
                    "text-xs text-center",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>Online Support</p>
                  <Button className={cn(
                    "w-full mt-3",
                    isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""
                  )}>Start Chat</Button>
                </CardContent>
              </Card>
            </div>
            
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
          
          {/* Right Column - FAQ */}
          <div className="md:w-2/3">
            <Card className={cn(
              "border",
              isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
            )}>
              <CardContent className="p-4">
                <h2 className={cn(
                  "text-lg font-medium mb-4",
                  isDarkMode ? "text-white" : ""
                )}>Frequently Asked Questions</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className={cn(
                        "border-b",
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      )}
                    >
                      <AccordionTrigger className={cn(
                        "text-sm py-4",
                        isDarkMode ? "text-gray-200 hover:text-white" : ""
                      )}>{item.question}</AccordionTrigger>
                      <AccordionContent className={cn(
                        "text-sm pb-4",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
