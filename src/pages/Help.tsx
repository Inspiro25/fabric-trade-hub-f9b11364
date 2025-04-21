import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MessageSquare, HelpCircle, ChevronRight, FileText, Truck, CreditCard, Shield, Package, Settings } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatDialog from '@/components/features/ChatDialog';
import SupportRequestDialog from '@/components/features/SupportRequestDialog';
import { useAuth } from '@/contexts/AuthContext';

const Help = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState('general');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSupportRequestOpen, setIsSupportRequestOpen] = useState(false);
  
  const supportTopics = [
    {
      id: 'general',
      title: 'General Help',
      icon: <HelpCircle size={20} />,
      faqs: [
        {
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Sign Up' button in the top right corner. You can sign up using your email address or through social media accounts like Google or Facebook."
        },
        {
          question: "How do I reset my password?",
          answer: "Click on 'Forgot Password' on the login page. Enter your email address and follow the instructions sent to your email to reset your password."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to your account settings by clicking on your profile picture. From there, you can update your personal information, address, and preferences."
        }
      ]
    },
    {
      id: 'orders',
      title: 'Orders & Shipping',
      icon: <Truck size={20} />,
      faqs: [
        {
          question: "How do I track my order?",
          answer: "You can track your order by going to the Orders section in your account and selecting the order you want to track. From there, you'll be able to see real-time updates on your order's status and location."
        },
        {
          question: "What is your shipping policy?",
          answer: "We offer various shipping options including standard (3-5 business days), express (1-2 business days), and international shipping (7-14 business days). Shipping costs vary based on the option selected and your location."
        },
        {
          question: "Can I change my shipping address after placing an order?",
          answer: "If your order hasn't been shipped yet, you can contact our customer support to update your shipping address. Once the order is shipped, we cannot change the delivery address."
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Refunds',
      icon: <CreditCard size={20} />,
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, PayPal, and various digital payment methods. We also offer cash on delivery for select locations."
        },
        {
          question: "How do I get a refund?",
          answer: "To request a refund, go to your order history, select the order, and click on 'Request Refund'. Our team will review your request and process it within 3-5 business days."
        },
        {
          question: "How long does it take to receive a refund?",
          answer: "Refunds typically take 5-7 business days to reflect in your account, depending on your payment method and bank processing times."
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Exchanges',
      icon: <Package size={20} />,
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Products must be in their original condition with tags attached and original packaging. Some items like personal care products and opened software are not eligible for returns."
        },
        {
          question: "How do I initiate a return?",
          answer: "Go to your order history, select the item you want to return, and click on 'Return Item'. Follow the instructions to generate a return label and ship the item back to us."
        },
        {
          question: "Can I exchange an item?",
          answer: "Yes, you can exchange items within 30 days of delivery. Select the 'Exchange' option when initiating a return and specify the new item you'd like to receive."
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <Shield size={20} />,
      faqs: [
        {
          question: "How do you protect my personal information?",
          answer: "We use industry-standard encryption and security measures to protect your personal information. We never share your data with third parties without your consent."
        },
        {
          question: "How can I update my privacy settings?",
          answer: "You can manage your privacy settings in your account preferences. From there, you can control what information is shared and how it's used."
        },
        {
          question: "What should I do if I notice suspicious activity?",
          answer: "If you notice any suspicious activity on your account, immediately change your password and contact our security team. We'll help you secure your account and investigate the issue."
        }
      ]
    }
  ];
  
  return (
    <div className={cn(
      "min-h-screen pb-20",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Support Topics & Contact Methods */}
          <div className={cn(
            "md:w-1/3 space-y-6",
            isMobile && "order-2"
          )}>
            {/* Support Topics */}
            <Card className={cn(
              "border",
              isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
            )}>
              <CardContent className="p-4">
                <h2 className={cn(
                  "text-lg font-medium mb-4",
                  isDarkMode ? "text-white" : ""
                )}>Support Topics</h2>
                <div className="space-y-2">
                  {supportTopics.map((topic) => (
                    <motion.div
                      key={topic.id}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={activeCategory === topic.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-2",
                          activeCategory === topic.id 
                            ? (isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "")
                            : (isDarkMode ? "text-gray-300 hover:bg-gray-700" : "")
                        )}
                        onClick={() => setActiveCategory(topic.id)}
                      >
                        {topic.icon}
                        {topic.title}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                  )}>support@zalekart.com</p>
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
                  <Button 
                    className={cn(
                      "w-full mt-3",
                      isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""
                    )}
                    onClick={() => setIsChatOpen(true)}
                  >
                    Start Chat
                  </Button>
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
                <Button 
                  className={cn(
                    "w-full",
                    isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""
                  )}
                  onClick={() => setIsSupportRequestOpen(true)}
                >
                  Submit a Request
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - FAQ */}
          <div className={cn(
            "md:w-2/3",
            isMobile && "order-1"
          )}>
            <Card className={cn(
              "border",
              isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
            )}>
              <CardContent className="p-4">
                <h2 className={cn(
                  "text-lg font-medium mb-4",
                  isDarkMode ? "text-white" : ""
                )}>
                  {supportTopics.find(topic => topic.id === activeCategory)?.title}
                </h2>
                
                <Accordion type="single" collapsible className="w-full">
                  {supportTopics
                    .find(topic => topic.id === activeCategory)
                    ?.faqs.map((item, index) => (
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

      {/* Chat Dialog */}
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        adminId="admin-user-id" // Replace with actual admin user ID
      />

      {/* Support Request Dialog */}
      <SupportRequestDialog
        isOpen={isSupportRequestOpen}
        onClose={() => setIsSupportRequestOpen(false)}
      />
    </div>
  );
};

export default Help;
