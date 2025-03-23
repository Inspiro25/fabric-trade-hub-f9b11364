
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createNotification } from '@/services/notificationService';
import { createPartnerRequest } from '@/lib/supabase/partnerRequests';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  contactName: z.string().min(2, { message: "Contact name must be at least 2 characters" }),
  mobileNumber: z.string().min(10, { message: "Please enter a valid mobile number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

interface PartnerRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PartnerRequestDialog: React.FC<PartnerRequestDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      contactName: '',
      mobileNumber: '',
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submitting partner request:", data);
      
      // Store in database
      const requestId = await createPartnerRequest({
        businessName: data.businessName,
        contactName: data.contactName,
        mobileNumber: data.mobileNumber,
        email: data.email,
      });
      
      console.log("Request ID from createPartnerRequest:", requestId);
      
      if (!requestId) {
        toast.error("Failed to submit partner request", {
          description: "Please try again."
        });
        return;
      }
      
      // Create a notification for admin users
      const notificationSent = await createNotification(
        "admin",
        "New Partner Request",
        `${data.businessName} (${data.contactName}) wants to partner with us. Mobile: ${data.mobileNumber}, Email: ${data.email}`,
        "partner-request"
      );
      
      console.log("Notification sent:", notificationSent);
      
      toast.success("Request Submitted", {
        description: "Your partner request has been successfully submitted. Our team will contact you soon."
      });
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error sending partner request:", error);
      toast.error("Failed to submit partner request", {
        description: "Please try again."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Partner with Us</DialogTitle>
          <DialogDescription>
            Fill out this form to express your interest in becoming a partner. Our team will contact you shortly.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full">Submit Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerRequestDialog;
