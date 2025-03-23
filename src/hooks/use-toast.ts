
// Implement Sonner toast with shadcn/ui compatibility layer
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export const toast = {
  // Base toast function
  default: (props: ToastProps) => {
    return sonnerToast(props.title, {
      description: props.description,
      action: props.action,
    });
  },
  
  // Success toast
  success: (title: string, props?: Omit<ToastProps, "title">) => {
    return sonnerToast.success(title, {
      description: props?.description,
      action: props?.action,
    });
  },
  
  // Error toast
  error: (title: string, props?: Omit<ToastProps, "title">) => {
    return sonnerToast.error(title, {
      description: props?.description,
      action: props?.action,
    });
  },
  
  // Info toast
  info: (title: string, props?: Omit<ToastProps, "title">) => {
    return sonnerToast.info(title, {
      description: props?.description,
      action: props?.action,
    });
  },

  // Warning toast
  warning: (title: string, props?: Omit<ToastProps, "title">) => {
    return sonnerToast.warning(title, {
      description: props?.description,
      action: props?.action,
    });
  },
};

// useToast hook for shadcn compatibility
export const useToast = () => {
  return {
    toast: {
      // Methods to match shadcn/ui toast API
      ...toast,
      // For direct calls like toast({ title: "..." })
      (props: ToastProps) {
        if (props.variant === "destructive") {
          return sonnerToast.error(props.title, {
            description: props.description,
            action: props.action,
          });
        }
        return sonnerToast(props.title, {
          description: props.description,
          action: props.action,
        });
      },
    },
    dismiss: (id?: string) => sonnerToast.dismiss(id),
  };
};
