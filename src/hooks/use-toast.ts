// Implement Sonner toast with shadcn/ui compatibility layer
import { toast as sonnerToast, ToastT } from "sonner";
import { useState, useEffect } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

// Create a toast type that matches both our needs and shadcn's expectations
export type Toast = ToastT & {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Maintain a list of active toasts for Shadcn compatibility
let toastList: Toast[] = [];

// Track toast IDs
let uniqueToastId = 0;

// Function to add a toast to our list
const addToast = (toast: Omit<Toast, "id">): string => {
  const id = String(uniqueToastId++);
  const newToast = { ...toast, id };
  toastList = [...toastList, newToast];
  return id;
};

// Function to dismiss a toast
const dismissToast = (id?: string) => {
  if (id) {
    toastList = toastList.filter(toast => toast.id !== id);
    sonnerToast.dismiss(id);
  } else {
    toastList = [];
    sonnerToast.dismiss();
  }
};

export const toast = {
  // Base toast function
  default: (props: ToastProps) => {
    const id = addToast({ ...props, variant: "default" });
    return sonnerToast(props.title, {
      id,
      description: props.description,
      action: props.action,
    });
  },
  
  // Success toast
  success: (title: string, props?: Omit<ToastProps, "title">) => {
    const id = addToast({ title, ...props, variant: "default" });
    return sonnerToast.success(title, {
      id,
      description: props?.description,
      action: props?.action,
    });
  },
  
  // Error toast
  error: (title: string, props?: Omit<ToastProps, "title">) => {
    const id = addToast({ title, ...props, variant: "destructive" });
    return sonnerToast.error(title, {
      id,
      description: props?.description,
      action: props?.action,
    });
  },
  
  // Info toast
  info: (title: string, props?: Omit<ToastProps, "title">) => {
    const id = addToast({ title, ...props, variant: "default" });
    return sonnerToast.info(title, {
      id,
      description: props?.description,
      action: props?.action,
    });
  },

  // Warning toast
  warning: (title: string, props?: Omit<ToastProps, "title">) => {
    const id = addToast({ title, ...props, variant: "default" });
    return sonnerToast.warning(title, {
      id,
      description: props?.description,
      action: props?.action,
    });
  },
};

// useToast hook for shadcn compatibility
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toastList);
  
  // Keep the local state in sync with the global toastList
  useEffect(() => {
    // Update local state when the component mounts
    setToasts([...toastList]);
    
    // Set up an interval to check for changes to toastList
    const intervalId = setInterval(() => {
      if (JSON.stringify(toasts) !== JSON.stringify(toastList)) {
        setToasts([...toastList]);
      }
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [toasts]);

  return {
    toast: {
      // Methods to match shadcn/ui toast API
      ...toast,
      // For direct calls like toast({ title: "..." })
      callToast: (props: ToastProps) => {
        if (props.variant === "destructive") {
          return toast.error(props.title || "", {
            description: props.description,
            action: props.action,
          });
        }
        return toast.default(props);
      },
    },
    dismiss: dismissToast,
    toasts, // Expose the toasts array for Shadcn compatibility
  };
};
