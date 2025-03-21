
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Help = () => {
  const navigate = useNavigate();
  
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
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-3 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-lg font-semibold">Help & Support</h1>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="relative">
          <Input placeholder="Search for help topics" className="pr-10" />
        </div>
      </div>
      
      {/* Help Content */}
      <div className="p-4 space-y-4">
        {/* Contact Methods */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border border-gray-100">
            <CardContent className="p-3 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <Phone size={18} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-medium">Call Us</h3>
              <p className="text-[10px] text-gray-500 mt-1">24/7 Support</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100">
            <CardContent className="p-3 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <Mail size={18} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-medium">Email</h3>
              <p className="text-[10px] text-gray-500 mt-1">24h Response</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100">
            <CardContent className="p-3 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <MessageSquare size={18} className="text-blue-600" />
              </div>
              <h3 className="text-xs font-medium">Live Chat</h3>
              <p className="text-[10px] text-gray-500 mt-1">Online Support</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Frequently Asked Questions */}
        <Card className="border border-gray-100">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-3">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        {/* Support Request */}
        <Card className="border border-gray-100">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-3">Still Need Help?</h2>
            <p className="text-xs text-gray-600 mb-4">
              If you couldn't find what you were looking for, please submit a support request and we'll get back to you as soon as possible.
            </p>
            <Button className="w-full">Submit a Request</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
