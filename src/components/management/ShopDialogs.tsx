
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shop } from '@/types/shop';
import { ShopForm, ShopFormValues } from './ShopForm';

interface ShopDialogsProps {
  open: {
    edit: boolean;
    create: boolean;
    delete: boolean;
  };
  setOpen: (open: { edit: boolean; create: boolean; delete: boolean }) => void;
  onSubmit: (data: ShopFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
  selectedShop: Shop | null;
  isSubmitting: boolean;
}

export function ShopDialogs({
  open,
  setOpen,
  onSubmit,
  onDelete,
  selectedShop,
  isSubmitting,
}: ShopDialogsProps) {
  

  return (
    <>
      {/* Edit Shop Dialog */}
      <Dialog
        open={open.edit}
        onOpenChange={(isOpen) =>
          setOpen({ ...open, edit: isOpen })
        }
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>
              Update the shop details below.
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <ShopForm
              initialValues={{
                name: selectedShop.name,
                description: selectedShop.description,
                status: selectedShop.status as 'active' | 'pending' | 'suspended',
                address: selectedShop.address,
                logo: selectedShop.logo,
                coverImage: selectedShop.coverImage || selectedShop.cover_image,
                isVerified: selectedShop.isVerified,
                shopId: selectedShop.id,
                ownerName: selectedShop.ownerName,
                ownerEmail: selectedShop.ownerEmail,
                phoneNumber: selectedShop.phoneNumber,
              }}
              onSubmit={onSubmit}
              isLoading={isSubmitting}
              submitLabel="Update Shop"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Shop Dialog */}
      <Dialog
        open={open.create}
        onOpenChange={(isOpen) =>
          setOpen({ ...open, create: isOpen })
        }
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Shop</DialogTitle>
            <DialogDescription>
              Fill in the shop details below.
            </DialogDescription>
          </DialogHeader>
          <ShopForm
            onSubmit={onSubmit}
            isLoading={isSubmitting}
            submitLabel="Create Shop"
            initialValues={{
              status: 'pending',
              isVerified: false,
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Shop Dialog */}
      <Dialog
        open={open.delete}
        onOpenChange={(isOpen) =>
          setOpen({ ...open, delete: isOpen })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shop? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen({ ...open, delete: false })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
