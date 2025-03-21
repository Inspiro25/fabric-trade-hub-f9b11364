
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createShop, deleteShop, fetchShops, Shop, updateShop } from '@/lib/shops';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search } from 'lucide-react';
import ShopTable from './ShopTable';
import ShopForm, { ShopFormValues } from './ShopForm';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useNotifications } from '@/contexts/NotificationContext';

const ShopManagement: React.FC = () => {
  const { toast } = useToast();
  const { broadcastNotification } = useNotifications();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [shopToEdit, setShopToEdit] = useState<Shop | null>(null);

  useEffect(() => {
    loadShops();
  }, []);

  useEffect(() => {
    if (shops.length > 0) {
      if (searchQuery.trim() === '') {
        setFilteredShops(shops);
      } else {
        const filtered = shops.filter(
          shop => shop.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredShops(filtered);
      }
    }
  }, [searchQuery, shops]);

  const loadShops = async () => {
    setIsLoading(true);
    try {
      const fetchedShops = await fetchShops();
      setShops(fetchedShops);
      setFilteredShops(fetchedShops);
    } catch (error) {
      console.error('Error loading shops:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shops',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddShop = async (data: ShopFormValues) => {
    try {
      const newShopData: Omit<Shop, "id"> = {
        name: data.name,
        description: data.description,
        address: data.address,
        logo: data.logo || '/placeholder.svg',
        coverImage: data.coverImage || '/placeholder.svg',
        isVerified: data.isVerified || false,
        rating: 0,
        reviewCount: 0,
        productIds: [],
        createdAt: new Date().toISOString(),
      };
      
      const shopId = await createShop(newShopData);
      
      if (shopId) {
        toast({
          title: 'Success',
          description: 'Shop has been created successfully',
        });
        
        // Send notification to all users
        broadcastNotification({
          title: 'New Shop Added',
          message: `${data.name} has joined our marketplace. Check it out!`,
          type: 'system',
          link: `/shops/${shopId}`
        });
        
        loadShops();
        setIsAddDialogOpen(false);
      } else {
        throw new Error('Failed to create shop');
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shop',
        variant: 'destructive',
      });
    }
  };

  const handleEditShop = async (data: ShopFormValues) => {
    if (!shopToEdit) return;
    
    try {
      const success = await updateShop(shopToEdit.id, data);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Shop has been updated successfully',
        });
        loadShops();
        setIsEditDialogOpen(false);
      } else {
        throw new Error('Failed to update shop');
      }
    } catch (error) {
      console.error('Error updating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shop',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteShop = async () => {
    if (!shopToDelete) return;
    
    try {
      const success = await deleteShop(shopToDelete);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Shop has been deleted successfully',
        });
        loadShops();
      } else {
        throw new Error('Failed to delete shop');
      }
    } catch (error) {
      console.error('Error deleting shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete shop',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setShopToDelete(null);
    }
  };

  const confirmDelete = (shopId: string) => {
    setShopToDelete(shopId);
    setShowDeleteDialog(true);
  };

  const handleEdit = (shop: Shop) => {
    setShopToEdit(shop);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shop Management</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Shop
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Shops</TabsTrigger>
          <TabsTrigger value="verified">Verified Shops</TabsTrigger>
          <TabsTrigger value="unverified">Unverified Shops</TabsTrigger>
        </TabsList>
        
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search shops..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1" 
          />
        </div>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Shops</CardTitle>
              <CardDescription>
                Manage all shops registered on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShopTable 
                shops={filteredShops}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={confirmDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle>Verified Shops</CardTitle>
              <CardDescription>
                Shops that have been verified by administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShopTable 
                shops={filteredShops.filter(shop => shop.isVerified)}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={confirmDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unverified">
          <Card>
            <CardHeader>
              <CardTitle>Unverified Shops</CardTitle>
              <CardDescription>
                Shops pending verification by administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShopTable 
                shops={filteredShops.filter(shop => !shop.isVerified)}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={confirmDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
        <DialogContent className="sm:max-w-[500px]">
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
    </div>
  );
};

export default ShopManagement;
