
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shop } from '@/lib/shops/types';
import { ShopForm, ShopFormValues } from './ShopForm';

interface ShopDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteDialog: boolean;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  shopToEdit: Shop | null;
  handleAddShop: (data: ShopFormValues) => Promise<void>;
  handleEditShop: (data: ShopFormValues) => Promise<void>;
  handleDeleteShop: () => Promise<void>;
  isMobile?: boolean;
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
  isMobile = false
}) => {
  return (
    <>
      {/* Add Shop Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className={isMobile ? "w-[95vw] max-w-md p-4 max-h-[85vh] overflow-y-auto" : ""}>
          <DialogHeader>
            <DialogTitle>Add New Shop</DialogTitle>
          </DialogHeader>
          <ShopForm
            onSubmit={handleAddShop}
            onCancel={() => setIsAddDialogOpen(false)}
            isMobile={isMobile}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Shop Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={isMobile ? "w-[95vw] max-w-md p-4 max-h-[85vh] overflow-y-auto" : ""}>
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
          </DialogHeader>
          {shopToEdit && (
            <ShopForm
              shop={shopToEdit}
              onSubmit={handleEditShop}
              onCancel={() => setIsEditDialogOpen(false)}
              isMobile={isMobile}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className={isMobile ? "w-[95vw] max-w-md p-4" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this shop? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteShop}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ShopDialogs;
