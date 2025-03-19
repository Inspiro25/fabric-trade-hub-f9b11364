
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { initializeRazorpay, RazorpayResponse } from '@/lib/razorpay';

interface PaymentButtonProps {
  amount: number;
  onSuccess?: (response: RazorpayResponse) => void;
  onFailure?: (error: Error) => void;
  className?: string;
  disabled?: boolean;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

const PaymentButton = ({
  amount,
  onSuccess,
  onFailure,
  className = '',
  disabled = false,
  customerInfo = {}
}: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      await initializeRazorpay({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Fashion Store',
        description: 'Payment for your order',
        image: '/logo.png',
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: (response) => {
          setLoading(false);
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          
          if (onSuccess) {
            onSuccess(response);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              variant: "destructive",
            });
          },
        },
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      
      if (onFailure && error instanceof Error) {
        onFailure(error);
      }
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={disabled || loading}
      className={className}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Pay Now"
      )}
    </Button>
  );
};

export default PaymentButton;
