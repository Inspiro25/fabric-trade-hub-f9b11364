
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise/cents
  currency: string;
  name: string;
  description?: string;
  image?: string;
  orderId?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
    animation?: boolean;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

// Replace this with your actual Razorpay key
const RAZORPAY_KEY = "rzp_test_your_key_here";

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const initializeRazorpay = async (options: RazorpayOptions): Promise<void> => {
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    throw new Error("Razorpay SDK failed to load");
  }

  const razorpay = new window.Razorpay({
    ...options,
    key: RAZORPAY_KEY,
    handler: (response: RazorpayResponse) => {
      if (options.handler) {
        options.handler(response);
      }
    },
    modal: {
      ondismiss: () => {
        if (options.modal?.ondismiss) {
          options.modal.ondismiss();
        }
      },
    },
  });

  razorpay.open();
};
