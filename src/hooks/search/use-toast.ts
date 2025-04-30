
import { toast as sonnerToast } from 'sonner';

type ToastVariant = 'default' | 'destructive' | 'success' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const toast = ({
  title,
  description,
  variant = 'default',
  duration = 5000,
  action
}: ToastOptions) => {
  // Map our variants to sonner variants
  let mappedVariant: 'success' | 'error' | 'warning' | 'info' | undefined;
  
  switch (variant) {
    case 'destructive':
      mappedVariant = 'error';
      break;
    case 'success':
      mappedVariant = 'success';
      break;
    case 'info':
      mappedVariant = 'info';
      break;
    case 'warning':
      mappedVariant = 'warning';
      break;
    default:
      mappedVariant = undefined;
  }
  
  const options: any = {
    duration,
  };
  
  if (action) {
    options.action = {
      label: action.label,
      onClick: action.onClick,
    };
  }
  
  if (mappedVariant) {
    sonnerToast[mappedVariant](title, {
      description,
      ...options
    });
  } else {
    sonnerToast(title, {
      description,
      ...options
    });
  }
};

export default { toast };
