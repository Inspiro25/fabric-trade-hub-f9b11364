
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {Array.isArray(toasts) && toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Convert variant to type to satisfy the Toast component type requirements
        const toastType = variant === "destructive" ? "foreground" : "background";
        
        return (
          <Toast key={id} {...props} type={toastType} className="group shadow-sm border-slate-200">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-sm">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-xs text-muted-foreground">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className="p-4 md:p-6" />
    </ToastProvider>
  );
}
