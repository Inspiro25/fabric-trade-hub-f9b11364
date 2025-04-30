
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ShopForm, { ShopFormValues } from './ShopForm';
import { Shop } from '@/lib/shops/types';
import { toast } from 'sonner';

interface ShopDialogsProps {
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  selectedShop: Shop | null;
  onShopAdded: () => void;
  onShopUpdated: () => void;
}

const ShopDialogs = ({
  addDialogOpen,
  setAddDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  selectedShop,
  onShopAdded,
  onShopUpdated,
}: ShopDialogsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define handlers for adding and editing shops
  const onAddShop = async (data: ShopFormValues) => {
    setIsSubmitting(true);
    try {
      // Implement the actual API call to add a shop
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Shop added successfully');
      setAddDialogOpen(false);
      onShopAdded();
    } catch (error) {
      toast.error('Failed to add shop');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onEditShop = async (data: ShopFormValues) => {
    setIsSubmitting(true);
    try {
      // Implement the actual API call to update a shop
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Shop updated successfully');
      setEditDialogOpen(false);
      onShopUpdated();
    } catch (error) {
      toast.error('Failed to update shop');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Shop</DialogTitle>
          </DialogHeader>
          <ShopForm
            onSubmit={onAddShop}
            submitLabel="Add Shop"
            isSubmitting={isSubmitting}
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
          </DialogHeader>
          {selectedShop && (
            <ShopForm
              defaultValues={{
                name: selectedShop.name,
                description: selectedShop.description || '',
                logo: selectedShop.logo || '',
                coverImage: selectedShop.cover_image || '',
                address: selectedShop.address || '',
                isVerified: selectedShop.is_verified || false,
                shopId: selectedShop.shop_id || '',
                ownerName: selectedShop.owner_name || '',
                ownerEmail: selectedShop.owner_email || '',
                status: (selectedShop.status as any) || 'pending',
                password: selectedShop.password || '',
                phoneNumber: selectedShop.phone_number || '',
              }}
              onSubmit={onEditShop}
              submitLabel="Update Shop"
              isSubmitting={isSubmitting}
            />
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShopDialogs;
