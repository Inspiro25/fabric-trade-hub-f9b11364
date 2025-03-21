
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, Tag, Calendar, Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

// Mock offer type
interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: number;
  expiry: string;
  type: 'percentage' | 'shipping' | 'bogo';
  shopId: string;
  shopName: string;
  bannerImage: string;
}

// Mock initial offers
const initialOffers: Offer[] = [
  {
    id: "offer1",
    title: "Summer Sale",
    description: "Get up to 50% off on summer collection",
    code: "SUMMER50",
    discount: 50,
    expiry: "2023-09-30",
    type: "percentage",
    shopId: "shop1",
    shopName: "Fashion Store",
    bannerImage: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VtbWVyJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "offer2",
    title: "Weekend Special",
    description: "25% off on all accessories every weekend",
    code: "WEEKEND25",
    discount: 25,
    expiry: "2023-11-30",
    type: "percentage",
    shopId: "shop1",
    shopName: "Fashion Store",
    bannerImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D"
  }
];

interface OffersManagerProps {
  shopId: string;
}

const OffersManager: React.FC<OffersManagerProps> = ({ shopId }) => {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Offer, 'id' | 'shopId' | 'shopName'>>({
    title: '',
    description: '',
    code: '',
    discount: 0,
    expiry: new Date().toISOString().split('T')[0],
    type: 'percentage',
    bannerImage: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as 'percentage' | 'shipping' | 'bogo' }));
  };
  
  const handleAddOffer = () => {
    setIsAddingOffer(true);
    setEditingOfferId(null);
    setFormData({
      title: '',
      description: '',
      code: '',
      discount: 0,
      expiry: new Date().toISOString().split('T')[0],
      type: 'percentage',
      bannerImage: ''
    });
  };
  
  const handleEditOffer = (offer: Offer) => {
    setIsAddingOffer(true);
    setEditingOfferId(offer.id);
    setFormData({
      title: offer.title,
      description: offer.description,
      code: offer.code,
      discount: offer.discount,
      expiry: offer.expiry,
      type: offer.type,
      bannerImage: offer.bannerImage
    });
  };
  
  const handleDeleteOffer = (id: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== id));
    toast.success('Offer deleted successfully');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOfferId) {
      // Update existing offer
      setOffers(prev => prev.map(offer => 
        offer.id === editingOfferId 
          ? { 
              ...offer, 
              ...formData 
            } 
          : offer
      ));
      toast.success('Offer updated successfully');
    } else {
      // Add new offer
      const newOffer: Offer = {
        id: `offer${Date.now()}`,
        shopId,
        shopName: 'Your Shop',
        ...formData
      };
      setOffers(prev => [...prev, newOffer]);
      toast.success('Offer added successfully');
    }
    
    setIsAddingOffer(false);
    setEditingOfferId(null);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
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
                  required
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
                <Label htmlFor="bannerImage">Banner Image URL</Label>
                <Input
                  id="bannerImage"
                  name="bannerImage"
                  value={formData.bannerImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
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
                    {offer.bannerImage && (
                      <div className="md:w-1/4 h-32 md:h-auto overflow-hidden">
                        <img 
                          src={offer.bannerImage} 
                          alt={offer.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className={`flex-grow ${offer.bannerImage ? 'md:w-3/4' : 'w-full'}`}>
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
                            {offer.type === "percentage" && (
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
    </div>
  );
};

export default OffersManager;
