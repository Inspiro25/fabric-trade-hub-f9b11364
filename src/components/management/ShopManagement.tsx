import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shop } from '@/lib/shops/types';
import { useNotifications } from '@/contexts/NotificationContext';
import ShopManagementHeader from './ShopManagementHeader';
import ShopFilters from './ShopFilters';
import ShopTabContent from './ShopTabContent';
import ShopDialogs from './ShopDialogs';
import { ShopFormValues } from './ShopForm';
import { fetchShops, createShop, updateShop, deleteShop } from '@/lib/supabase/shops';
import { useIsMobile } from '@/hooks/use-mobile';

const ShopManagement: React.FC = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [shopToEdit, setShopToEdit] = useState<Shop | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const isMobile = useIsMobile();

  useEffect(() => {
    loadShops();
    
    const shouldOpenAddDialog = sessionStorage.getItem('openAddShopDialog');
    if (shouldOpenAddDialog === 'true') {
      setIsAddDialogOpen(true);
      sessionStorage.removeItem('openAddShopDialog');
    }
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
        shopId: data.shopId || `shop-${Math.floor(Math.random() * 10000)}`,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        status: data.status,
        password: data.password,
      };
      
      const shopId = await createShop(newShopData);
      
      if (shopId) {
        toast({
          title: 'Success',
          description: 'Shop has been created successfully',
        });
        
        addNotification({
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
      const updateData: Partial<Shop> = {
        ...data,
        rating: shopToEdit.rating,
        reviewCount: shopToEdit.reviewCount,
        productIds: shopToEdit.productIds,
        createdAt: shopToEdit.createdAt,
      };
      
      if (!data.password) {
        delete updateData.password;
      }
      
      const success = await updateShop(shopToEdit.id, updateData);
      
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
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-6 max-w-full overflow-hidden">
      <ShopManagementHeader onAddShop={() => setIsAddDialogOpen(true)} isMobile={isMobile} />
      
      <ShopFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full overflow-hidden">
        <TabsContent value="all" className="w-full overflow-hidden">
          <ShopTabContent
            title="All Shops"
            description="Manage all shops registered on the platform"
            shops={filteredShops}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            tabValue="all"
            isMobile={isMobile}
          />
        </TabsContent>
        
        <TabsContent value="verified" className="w-full overflow-hidden">
          <ShopTabContent
            title="Verified Shops"
            description="Shops that have been verified by administrators"
            shops={filteredShops}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            tabValue="verified"
            filterCondition={(shop) => shop.isVerified}
            isMobile={isMobile}
          />
        </TabsContent>
        
        <TabsContent value="unverified" className="w-full overflow-hidden">
          <ShopTabContent
            title="Unverified Shops"
            description="Shops pending verification by administrators"
            shops={filteredShops}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            tabValue="unverified"
            filterCondition={(shop) => !shop.isVerified}
            isMobile={isMobile}
          />
        </TabsContent>
      </Tabs>
      
      <ShopDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        shopToEdit={shopToEdit}
        handleAddShop={handleAddShop}
        handleEditShop={handleEditShop}
        handleDeleteShop={handleDeleteShop}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ShopManagement;
