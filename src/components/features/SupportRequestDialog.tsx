import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { createSupportRequest } from '@/lib/supabase/chat';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface SupportRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportRequestDialog: React.FC<SupportRequestDialogProps> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug logging
    console.log('Form values:', {
      subject: subject.trim(),
      message: message.trim(),
      category: category.trim(),
      priority,
      currentUser: !!currentUser
    });

    // Check if any required field is empty or only contains whitespace
    const hasEmptyField = !subject.trim() || !message.trim() || !category.trim();
    
    if (!currentUser) {
      setError('Please log in to submit a support request');
      return;
    }

    if (hasEmptyField) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const request = await createSupportRequest({
        user_id: currentUser.id,
        subject: subject.trim(),
        message: message.trim(),
        category: category.trim(),
        priority
      });

      if (request) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setSubject('');
          setMessage('');
          setCategory('');
          setPriority('medium');
          setIsSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting support request:', error);
      setError('Failed to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add validation feedback to form fields
  const getFieldError = (value: string) => {
    return !value.trim() ? 'This field is required' : '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[500px]",
        isDarkMode ? "bg-gray-800" : "bg-white",
        isMobile && "h-[100vh] max-h-[100vh] rounded-none"
      )}>
        <DialogHeader className={cn(
          "flex flex-col items-center justify-center p-6 border-b",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}>
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
            isDarkMode ? "bg-blue-900/50" : "bg-blue-50"
          )}>
            <HelpCircle size={24} className="text-blue-500" />
          </div>
          <DialogTitle className={cn(
            "text-xl font-semibold text-center",
            isDarkMode ? "text-white" : ""
          )}>
            Submit Support Request
          </DialogTitle>
          <p className={cn(
            "text-sm text-center mt-2",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            We'll get back to you as soon as possible
          </p>
        </DialogHeader>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4",
              isDarkMode ? "bg-green-900/50" : "bg-green-50"
            )}>
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h3 className={cn(
              "text-xl font-semibold mb-2",
              isDarkMode ? "text-white" : ""
            )}>
              Request Submitted
            </h3>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Your support request has been submitted successfully. We'll get back to you as soon as possible.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg",
                  isDarkMode ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-600"
                )}
              >
                <AlertCircle size={16} />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Category
                </label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                  required
                >
                  <SelectTrigger className={cn(
                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                  )}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="orders">Orders & Shipping</SelectItem>
                    <SelectItem value="payments">Payments & Refunds</SelectItem>
                    <SelectItem value="technical">Technical Issues</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {!category.trim() && (
                  <p className="text-sm text-red-500">Please select a category</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Priority
                </label>
                <Select 
                  value={priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}
                >
                  <SelectTrigger className={cn(
                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                  )}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Subject
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className={cn(
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                )}
                required
              />
              {!subject.trim() && (
                <p className="text-sm text-red-500">Please enter a subject</p>
              )}
            </div>

            <div className="space-y-2">
              <label className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Message
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail..."
                className={cn(
                  "min-h-[150px]",
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                )}
                required
              />
              {!message.trim() && (
                <p className="text-sm text-red-500">Please enter a message</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-6 text-base",
                isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""
              )}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SupportRequestDialog; 