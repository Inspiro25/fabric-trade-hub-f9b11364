
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, Tag, Calendar, Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Offer, createOffer, deleteOffer, getShopOffers, updateOffer } from '@/lib/supabase/offers';
import DeleteConfirmationDialog from '../management/DeleteConfirmationDialog';
import FileUpload from '@/components/ui/file-upload';

interface OffersManagerProps {
  shopId: string;
}

const OffersManager: React.FC<OffersManagerProps> = ({ shopId }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Offer, 'id' | 'shop_id' | 'created_at' | 'is_active' | 'start_date'>>({
    title: '',
    description: '',
    code: '',
    discount: 0,
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days from now
    type: 'percentage',
    banner_image: ''
  });

  useEffect(() => {
    fetchOffers();
  }, [shopId]);
  
  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const data = await getShopOffers(shopId);
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as 'percentage' | 'shipping' | 'bogo' }));
  };
  
  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, banner_image: url }));
  };
  
  const handleAddOffer = () => {
    setIsAddingOffer(true);
    setEditingOfferId(null);
    setFormData({
      title: '',
      description: '',
      code: '',
      discount: 0,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'percentage',
      banner_image: ''
    });
  };
  
  const handleEditOffer = (offer: Offer) => {
    setIsAddingOffer(true);
    setEditingOfferId(offer.id);
    
    // Format date to YYYY-MM-DD for input fields
    const expiryDate = new Date(offer.expiry).toISOString().split('T')[0];
    
    setFormData({
      title: offer.title,
      description: offer.description || '',
      code: offer.code,
      discount: offer.discount || 0,
      expiry: expiryDate,
      type: offer.type,
      banner_image: offer.banner_image || ''
    });
  };
  
  const handleConfirmDelete = async () => {
    if (!offerToDelete) return;
    
    try {
      await deleteOffer(offerToDelete);
      setOffers(prev => prev.filter(offer => offer.id !== offerToDelete));
      toast.success('Offer deleted successfully');
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error('Failed to delete offer');
    } finally {
      setDeleteDialogOpen(false);
      setOfferToDelete(null);
    }
  };
  
  const handleDeleteOffer = (id: string) => {
    setOfferToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOfferId) {
        // Update existing offer
        const updatedOffer = await updateOffer(editingOfferId, {
          ...formData,
          is_active: true
        });
        
        setOffers(prev => prev.map(offer => 
          offer.id === editingOfferId ? updatedOffer : offer
        ));
        
        toast.success('Offer updated successfully');
      } else {
        // Add new offer
        const newOffer = await createOffer({
          ...formData,
          shop_id: shopId,
          is_active: true,
          start_date: new Date().toISOString()
        });
        
        setOffers(prev => [...prev, newOffer]);
        toast.success('Offer added successfully');
      }
      
      setIsAddingOffer(false);
      setEditingOfferId(null);
    } catch (error) {
      console.error("Error saving offer:", error);
      toast.error('Failed to save offer');
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Manage Offers</h2>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">Loading offers...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Offers</h2>
        {!isAddingOffer && (
          <Button onClick={handleAddOffer} className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add New Offer
          </Button>
        )}
      </div>
      
      {isAddingOffer ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingOfferId ? 'Edit Offer' : 'Create New Offer'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Offer Title</Label>
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
                  <Label htmlFor="code">Promo Code</Label>
                  <Input 
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., SUMMER50"
                    required
                  />
                </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Offer Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={handleSelectChange}
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
                  <Label htmlFor="discount">Discount ({formData.type === 'percentage' ? '%' : 'Amount'})</Label>
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
                
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="banner_image">Banner Image</Label>
                <FileUpload
                  onUploadComplete={handleImageUpload}
                  initialImage={formData.banner_image || ''}
                  bucketName="offers"
                  folderPath="banners"
                  fileTypes="image/*"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingOffer(false);
                    setEditingOfferId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOfferId ? 'Update Offer' : 'Create Offer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No offers created yet.</p>
                <Button onClick={handleAddOffer} className="mt-4">
                  Create Your First Offer
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {offers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {offer.banner_image && (
                      <div className="md:w-1/4 h-32 md:h-auto overflow-hidden">
                        <img 
                          src={offer.banner_image} 
                          alt={offer.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className={`flex-grow ${offer.banner_image ? 'md:w-3/4' : 'w-full'}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{offer.title}</CardTitle>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleEditOffer(offer)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
                              onClick={() => handleDeleteOffer(offer.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                        
                        <div className="flex flex-wrap gap-3 text-sm">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium mr-1">Code:</span>
                            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                              {offer.code}
                            </code>
                          </div>
                          
                          <div className="flex items-center">
                            {offer.type === "percentage" && offer.discount && (
                              <>
                                <Percent className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="font-medium mr-1">Discount:</span>
                                <span>{offer.discount}%</span>
                              </>
                            )}
                            {offer.type === "shipping" && (
                              <span className="bg-green-100 text-green-600 rounded-full px-2 py-0.5 text-xs font-semibold">
                                Free Shipping
                              </span>
                            )}
                            {offer.type === "bogo" && (
                              <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-xs font-semibold">
                                Buy 1 Get 1
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium mr-1">Expires:</span>
                            <span>{formatDate(offer.expiry)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Offer"
        description="Are you sure you want to delete this offer? This action cannot be undone."
      />
    </div>
  );
};

export default OffersManager;
