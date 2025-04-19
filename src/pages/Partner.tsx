import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Store, 
  TrendingUp, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import PartnerRequestDialog from '@/components/management/PartnerRequestDialog';

const Partner = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);

  const benefits = [
    {
      icon: <Store className="w-6 h-6" />,
      title: "Expand Your Reach",
      description: "Access our large customer base and increase your sales potential"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Grow Your Business",
      description: "Join our marketplace and benefit from our marketing efforts"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Built-in security and payment protection for all transactions"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Dedicated Support",
      description: "Get assistance from our partner success team"
    }
  ];

  const requirements = [
    "Valid business registration",
    "Quality product inventory",
    "Professional business profile",
    "Commitment to customer service",
    "Regular stock updates",
    "Competitive pricing"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      business: "Fashion Forward",
      quote: "Partnering with Zalekart has helped us reach new customers and grow our business by 200% in just 6 months."
    },
    {
      name: "Michael Chen",
      business: "Tech Gadgets",
      quote: "The platform's ease of use and dedicated support have made it a pleasure to do business with Zalekart."
    }
  ];

  const faqs = [
    {
      question: "How long does the approval process take?",
      answer: "Typically, we review and respond to partnership applications within 2-3 business days."
    },
    {
      question: "What are the commission rates?",
      answer: "Commission rates vary by category and are competitive with industry standards. Details are provided upon approval."
    },
    {
      question: "Do I need to maintain inventory?",
      answer: "Yes, partners are required to maintain accurate inventory levels and fulfill orders promptly."
    },
    {
      question: "How do I get paid?",
      answer: "Payments are processed securely through our platform and transferred to your registered bank account."
    }
  ];

  const handlePartnerRequest = () => {
    setIsPartnerDialogOpen(true);
  };

  const handlePartnerRequestSuccess = () => {
    setIsPartnerDialogOpen(false);
  };

  return (
    <div className={cn(
      "min-h-screen pb-16 md:pb-0",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Hero Section */}
      <div className={cn(
        "relative overflow-hidden px-4 py-12 md:py-24",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className={cn(
              "text-2xl md:text-4xl font-bold mb-4 leading-tight",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Become a Partner with Zalekart
            </h1>
            <p className={cn(
              "text-base md:text-lg mb-6 md:mb-8 px-4",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Join our marketplace and grow your business with millions of potential customers
            </p>
            <Button 
              onClick={handlePartnerRequest}
              className={cn(
                "text-base md:text-lg px-6 py-5 md:px-8 md:py-6 rounded-full text-white",
                isDarkMode 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className={cn(
          "text-xl md:text-3xl font-bold text-center mb-8 md:mb-12",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Why Partner with Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className={cn(
              "border",
              isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
            )}>
              <CardContent className="p-4 md:p-6">
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-4",
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                )}>
                  {React.cloneElement(benefit.icon, {
                    className: cn(
                      "w-5 h-5 md:w-6 md:h-6",
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    )
                  })}
                </div>
                <h3 className={cn(
                  "text-base md:text-lg font-semibold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {benefit.title}
                </h3>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Requirements Section */}
      <div className={cn(
        "py-12 md:py-16 px-4",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className={cn(
              "text-xl md:text-3xl font-bold text-center mb-8 md:mb-12",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Partnership Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {requirements.map((requirement, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center p-3 md:p-4 rounded-lg",
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  )}
                >
                  <CheckCircle2 className={cn(
                    "h-4 w-4 md:h-5 md:w-5 mr-3 flex-shrink-0",
                    isDarkMode ? "text-green-400" : "text-green-500"
                  )} />
                  <span className={cn(
                    "text-sm md:text-base",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    {requirement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className={cn(
          "text-xl md:text-3xl font-bold text-center mb-8 md:mb-12",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={cn(
              "border",
              isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
            )}>
              <CardContent className="p-4 md:p-6">
                <p className={cn(
                  "text-sm md:text-base mb-4 italic",
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                )}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className={cn(
                    "font-semibold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {testimonial.name}
                  </p>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {testimonial.business}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className={cn(
        "py-12 md:py-16 px-4",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div className="container mx-auto">
          <h2 className={cn(
            "text-xl md:text-3xl font-bold text-center mb-8 md:mb-12",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className={cn(
                "border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
              )}>
                <CardContent className="p-4 md:p-6">
                  <h3 className={cn(
                    "text-base md:text-lg font-semibold mb-2",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {faq.question}
                  </h3>
                  <p className={cn(
                    "text-sm md:text-base",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
        <Button 
          onClick={handlePartnerRequest}
          className={cn(
            "w-full text-base rounded-full text-white",
            isDarkMode 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-blue-600 hover:bg-blue-700"
          )}
        >
          Apply Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Desktop CTA Section */}
      <div className="hidden md:block container mx-auto px-4 py-16">
        <Card className={cn(
          "border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-100"
        )}>
          <CardContent className="p-8 text-center">
            <h2 className={cn(
              "text-2xl md:text-3xl font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Ready to Grow Your Business?
            </h2>
            <p className={cn(
              "text-lg mb-6",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Join our marketplace today and start reaching new customers
            </p>
            <Button 
              onClick={handlePartnerRequest}
              className={cn(
                "text-lg px-8 py-6 rounded-full text-white",
                isDarkMode 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <PartnerRequestDialog 
        open={isPartnerDialogOpen} 
        onOpenChange={setIsPartnerDialogOpen}
        onSuccess={handlePartnerRequestSuccess}
      />
    </div>
  );
};

export default Partner;