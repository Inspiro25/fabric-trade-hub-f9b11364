import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { initializeRazorpay, RazorpayResponse } from '@/lib/razorpay';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

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
  buttonText?: string;
}

const PaymentButton = ({
  amount,
  onSuccess,
  onFailure,
  className = '',
  disabled = false,
  customerInfo = {},
  buttonText = "Pay Now"
}: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();
  const { currentUser } = useAuth();

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      await initializeRazorpay({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Vyoma',
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
          toast.success("Payment Successful", {
            description: `Payment ID: ${response.razorpay_payment_id}`
          });
          
          // Add notification for successful payment
          if (currentUser) {
            addNotification({
              title: "Payment Successful",
              message: `Your payment of ₹${(amount).toFixed(2)} was successful. Payment ID: ${response.razorpay_payment_id.slice(0, 8)}...`,
              type: "order",
              link: "/orders"
            });
          }
          
          if (onSuccess) {
            onSuccess(response);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment Cancelled", {
              description: "You cancelled the payment process."
            });
          },
        },
      });
    } catch (error) {
      setLoading(false);
      toast.error("Payment Failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      // Add notification for failed payment
      if (currentUser) {
        addNotification({
          title: "Payment Failed",
          message: error instanceof Error ? error.message : "Your payment could not be processed. Please try again.",
          type: "system",
          link: "/cart"
        });
      }
      
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
        buttonText
      )}
    </Button>
  );
};

export default PaymentButton;
