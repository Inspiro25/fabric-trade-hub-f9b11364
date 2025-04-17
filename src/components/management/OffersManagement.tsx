import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Offer, getAllOffers, createOffer, updateOffer, deleteOffer } from '@/lib/supabase/offers';
import { OffersTable } from './OffersTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import FileUpload from '@/components/ui/file-upload';

const OffersManagement: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<Partial<Offer>>({
    title: '',
    description: '',
    code: '',
    discount: 0,
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'percentage',
    is_active: true,
    banner_image: ''
  });

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    if (offers.length > 0) {
      let filtered = [...offers];
      
      // Apply search filter
      if (searchQuery.trim() !== '') {
        filtered = filtered.filter(
          offer => 
            offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (offer.description && offer.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Apply tab filter
      if (activeTab === 'active') {
        filtered = filtered.filter(offer => offer.is_active && new Date(offer.expiry) > new Date());
      } else if (activeTab === 'expired') {
        filtered = filtered.filter(offer => !offer.is_active || new Date(offer.expiry) <= new Date());
      }
      
      setFilteredOffers(filtered);
    }
  }, [searchQuery, offers, activeTab]);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const fetchedOffers = await getAllOffers();
      setOffers(fetchedOffers);
      setFilteredOffers(fetchedOffers);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, banner_image: url }));
  };

  const handleAddOffer = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      code: '',
      discount: 0,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'percentage',
      is_active: true,
      banner_image: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    
    // Format date to YYYY-MM-DD for input fields
    const expiryDate = new Date(offer.expiry).toISOString().split('T')[0];
    
    setFormData({
      title: offer.title,
      description: offer.description || '',
      code: offer.code,
      discount: offer.discount || 0,
      expiry: expiryDate,
      type: offer.type,
      banner_image: offer.banner_image || '',
      is_active: offer.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await deleteOffer(offerId);
      toast.success('Offer has been deleted successfully');
      loadOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error('Failed to delete offer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOffer) {
        // Update existing offer
        const updatedOffer = await updateOffer(editingOffer.id, formData);
        
        setOffers(prev => prev.map(offer => 
          offer.id === editingOffer.id ? updatedOffer : offer
        ));
        
        toast.success('Offer updated successfully');
      } else {
        // Add new offer
        const newOffer = await createOffer({
          ...formData,
          start_date: new Date().toISOString()
        } as Offer);
        
        setOffers(prev => [...prev, newOffer]);
        toast.success('Offer added successfully');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving offer:", error);
      toast.error('Failed to save offer');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full sm:w-[250px]"
          />
        </div>
        <Button onClick={handleAddOffer} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Offer
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All Offers</TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm">Active</TabsTrigger>
          <TabsTrigger value="expired" className="text-xs sm:text-sm">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">All Offers</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage all promotions and special offers</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <OffersTable 
                offers={filteredOffers}
                isLoading={isLoading}
                onEdit={handleEditOffer}
                onDelete={handleDeleteOffer}
                isMobile={isMobile}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Active Offers</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Currently active promotions and special offers</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <OffersTable 
                offers={filteredOffers}
                isLoading={isLoading}
                onEdit={handleEditOffer}
                onDelete={handleDeleteOffer}
                isMobile={isMobile}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Expired Offers</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Past promotions and special offers</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <OffersTable 
                offers={filteredOffers}
                isLoading={isLoading}
                onEdit={handleEditOffer}
                onDelete={handleDeleteOffer}
                isMobile={isMobile}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Offer Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {editingOffer 
                ? 'Update the offer details below.' 
                : 'Fill in the details to create a new offer.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm">Offer Title *</Label>
              <Input 
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Sale"
                required
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm">Promo Code *</Label>
              <Input 
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., SUMMER50"
                required
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the offer details..."
                rows={3}
                className="text-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm">Offer Type *</Label>
                <Select 
                  value={formData.type as string} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Discount</SelectItem>
                    <SelectItem value="shipping">Free Shipping</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-sm">Discount {formData.type === 'percentage' ? '%' : 'Amount'}</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min={0}
                  max={formData.type === 'percentage' ? 100 : undefined}
                  disabled={formData.type === 'shipping' || formData.type === 'bogo'}
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-sm">Expiry Date *</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  type="date"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="is_active" className="text-sm">Status</Label>
                <Select 
                  value={formData.is_active ? 'active' : 'inactive'} 
                  onValueChange={(value) => handleSelectChange('is_active', value === 'active' ? 'true' : 'false')}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banner_image" className="text-sm">Banner Image</Label>
              <FileUpload
                onUploadComplete={handleImageUpload}
                initialImage={formData.banner_image || ''}
                bucketName="offers"
                folderPath="banners"
                fileTypes="image/*"
              />
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {editingOffer ? 'Update Offer' : 'Create Offer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OffersManagement;
