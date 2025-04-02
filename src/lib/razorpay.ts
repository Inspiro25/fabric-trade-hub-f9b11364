declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key?: string; // Optional since we set it internally
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

// Hardcoded Razorpay test key
const RAZORPAY_KEY = "rzp_test_IjKEAJBp5g3Axr";

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Initialize Razorpay and return response
export const initializeRazorpay = async (options: RazorpayOptions): Promise<RazorpayResponse | null> => {
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    throw new Error("Razorpay SDK failed to load");
  }

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      ...options,
      key: RAZORPAY_KEY,
      handler: (response: RazorpayResponse) => {
        if (options.handler) options.handler(response);
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          console.warn("Payment modal closed by user");
          if (options.modal?.ondismiss) options.modal.ondismiss();
          resolve(null);
        },
      },
    });

    razorpay.open();
  });
};
