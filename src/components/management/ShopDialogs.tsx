
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShopForm, { ShopFormValues } from './ShopForm';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { Shop } from '@/lib/shops/types';

interface ShopDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  shopToEdit: Shop | null;
  handleAddShop: (data: ShopFormValues) => Promise<void>;
  handleEditShop: (data: ShopFormValues) => Promise<void>;
  handleDeleteShop: () => Promise<void>;
}

const ShopDialogs: React.FC<ShopDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  showDeleteDialog,
  setShowDeleteDialog,
  shopToEdit,
  handleAddShop,
  handleEditShop,
  handleDeleteShop,
}) => {
  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Shop</DialogTitle>
            <DialogDescription>
              Add a new shop to the platform. Fill out all fields to continue.
            </DialogDescription>
          </DialogHeader>
          
          <ShopForm 
            onSubmit={handleAddShop}
            onCancel={() => setIsAddDialogOpen(false)}
            formTitle="Add New Shop"
            submitLabel="Create Shop"
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>
              Update shop information. Fill out all fields to continue.
            </DialogDescription>
          </DialogHeader>
          
          <ShopForm 
            initialData={shopToEdit}
            onSubmit={handleEditShop}
            onCancel={() => setIsEditDialogOpen(false)}
            formTitle="Edit Shop"
            submitLabel="Update Shop"
          />
        </DialogContent>
      </Dialog>
      
      <DeleteConfirmationDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteShop}
        title="Confirm Deletion"
        description="Are you sure you want to delete this shop? This action cannot be undone."
      />
    </>
  );
};

export default ShopDialogs;
