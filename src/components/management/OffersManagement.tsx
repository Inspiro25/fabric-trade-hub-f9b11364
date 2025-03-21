
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search } from 'lucide-react';
import { Offer, getAllOffers, createOffer, updateOffer, deleteOffer } from '@/lib/supabase/offers';
import OffersTable from './OffersTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

const OffersManagement: React.FC = () => {
  const { toast } = useToast();
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
      toast({
        title: 'Error',
        description: 'Failed to load offers',
        variant: 'destructive',
      });
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
      toast({
        title: 'Success',
        description: 'Offer has been deleted successfully',
      });
      loadOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete offer',
        variant: 'destructive',
      });
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
        
        toast({
          title: 'Success',
          description: 'Offer updated successfully',
        });
      } else {
        // Add new offer
        const newOffer = await createOffer({
          ...formData,
          start_date: new Date().toISOString()
        } as Offer);
        
        setOffers(prev => [...prev, newOffer]);
        toast({
          title: 'Success',
          description: 'Offer added successfully',
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving offer:", error);
      toast({
        title: 'Error',
        description: 'Failed to save offer',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full sm:w-[250px]"
          />
        </div>
        <Button onClick={handleAddOffer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Offer
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Offers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Offers</CardTitle>
              <CardDescription>Manage all promotions and special offers</CardDescription>
            </CardHeader>
            <CardContent>
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
              <CardTitle>Active Offers</CardTitle>
              <CardDescription>Currently active promotions and special offers</CardDescription>
            </CardHeader>
            <CardContent>
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
              <CardTitle>Expired Offers</CardTitle>
              <CardDescription>Past promotions and special offers</CardDescription>
            </CardHeader>
            <CardContent>
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
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
            <DialogDescription>
              {editingOffer 
                ? 'Update the offer details below.' 
                : 'Fill in the details to create a new offer.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Offer Title *</Label>
              <Input 
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Sale"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">Promo Code *</Label>
              <Input 
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., SUMMER50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the offer details..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Offer Type *</Label>
                <Select 
                  value={formData.type as string} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
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
                <Label htmlFor="discount">Discount {formData.type === 'percentage' ? '%' : 'Amount'}</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min={0}
                  max={formData.type === 'percentage' ? 100 : undefined}
                  disabled={formData.type === 'shipping' || formData.type === 'bogo'}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date *</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  type="date"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="is_active">Status</Label>
                <Select 
                  value={formData.is_active ? 'active' : 'inactive'} 
                  onValueChange={(value) => handleSelectChange('is_active', value === 'active' ? 'true' : 'false')}
                >
                  <SelectTrigger>
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
              <Label htmlFor="banner_image">Banner Image URL</Label>
              <Input
                id="banner_image"
                name="banner_image"
                value={formData.banner_image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
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
