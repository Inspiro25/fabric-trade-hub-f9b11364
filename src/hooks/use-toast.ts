// Implement Sonner toast with shadcn/ui compatibility layer
import { toast as sonnerToast, type ToastT } from "sonner";
import { useState, useEffect } from "react";
import React from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
  duration?: number; // Add duration property
};

// Create a toast type that matches both our needs and shadcn's expectations
export type Toast = ToastT & {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number; // Add duration property
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

// Direct toast function that can be called directly
export function toast(props: ToastProps) {
  const id = addToast({ ...props, variant: props.variant || "default" });
  return sonnerToast(props.title, {
    id,
    description: props.description,
    action: props.action,
    duration: props.duration,
  });
}

// Add specialized methods to toast function
toast.success = (title: string, props?: Omit<ToastProps, "title">) => {
  const id = addToast({ title, ...props, variant: "default" });
  return sonnerToast.success(title, {
    id,
    description: props?.description,
    action: props?.action,
    duration: props?.duration,
  });
};

toast.error = (title: string, props?: Omit<ToastProps, "title">) => {
  const id = addToast({ title, ...props, variant: "destructive" });
  return sonnerToast.error(title, {
    id,
    description: props?.description,
    action: props?.action,
    duration: props?.duration,
  });
};

toast.info = (title: string, props?: Omit<ToastProps, "title">) => {
  const id = addToast({ title, ...props, variant: "default" });
  return sonnerToast.info(title, {
    id,
    description: props?.description,
    action: props?.action,
    duration: props?.duration,
  });
};

toast.warning = (title: string, props?: Omit<ToastProps, "title">) => {
  const id = addToast({ title, ...props, variant: "default" });
  return sonnerToast.warning(title, {
    id,
    description: props?.description,
    action: props?.action,
    duration: props?.duration,
  });
};

// useToast hook for shadcn compatibility
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toastList);
  const prevToastsRef = React.useRef<Toast[]>(toastList);
  
  // Keep the local state in sync with the global toastList
  useEffect(() => {
    // Update local state when the component mounts
    setToasts([...toastList]);
    
    // Set up an interval to check for changes to toastList
    const intervalId = setInterval(() => {
      if (JSON.stringify(prevToastsRef.current) !== JSON.stringify(toastList)) {
        prevToastsRef.current = [...toastList];
        setToasts([...toastList]);
      }
    }, 100);
    
    return () => clearInterval(intervalId);
  }, []); // Remove toasts from dependency array

  return {
    toast,
    dismiss: dismissToast,
    toasts // Expose the toasts array for Shadcn compatibility
  };
};
