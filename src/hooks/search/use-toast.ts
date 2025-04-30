
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

export const useToast = () => {
  return useShadcnToast();
};

export const toast = {
  success: (message: string) => {
    const { toast } = useShadcnToast();
    toast({
      title: "Success",
      description: message,
    });
  },
  error: (message: string) => {
    const { toast } = useShadcnToast();
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  },
  warning: (message: string) => {
    const { toast } = useShadcnToast();
    toast({
      title: "Warning",
      description: message,
      variant: "warning",
    });
  },
  info: (message: string) => {
    const { toast } = useShadcnToast();
    toast({
      title: "Info",
      description: message,
    });
  },
};

export default toast;
