
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { ShopFormValues } from '@/components/management/ShopForm';

interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  coverImage: string | null;
  address: string;
  isVerified: boolean;
  followersCount: number | null;
  reviewCount: number | null;
  rating: number | null;
  status: 'active' | 'pending' | 'suspended';
  ownerName: string;
  ownerEmail: string;
  phoneNumber: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [shopId, setShopId] = useState('');
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedShopId = localStorage.getItem('adminShopId');
    if (storedShopId) {
      setShopId(storedShopId);
    }
  }, []);

  useEffect(() => {
    if (shopId) {
      localStorage.setItem('adminShopId', shopId);
      fetchShop();
    }
  }, [shopId]);

  const fetchShop = async () => {
    setLoading(true);
    if (!shopId) {
      toast.error('Please enter a Shop ID');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();
      
      if (error) {
        console.error('Error fetching shop data:', error);
        toast.error('Failed to load shop data');
        return;
      }
      
      setShop({
        id: data.id,
        name: data.name,
        description: data.description,
        logo: data.logo,
        coverImage: data.cover_image,
        address: data.address,
        isVerified: data.is_verified,
        followersCount: data.followers_count,
        reviewCount: data.review_count,
        rating: data.rating,
        status: data.status as 'active' | 'pending' | 'suspended',
        ownerName: data.owner_name,
        ownerEmail: data.owner_email,
        phoneNumber: data.phone_number || '',
        createdAt: data.created_at
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchShop:', error);
      toast.error('Failed to load shop data');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShop(prevShop => ({
      ...prevShop,
      [name]: value,
    } as any));
  };

  const handleToggleVerification = () => {
    setShop(prevShop => ({
      ...prevShop,
      isVerified: !prevShop.isVerified,
    } as Shop));
  };

  const handleStatusChange = (status: 'active' | 'pending' | 'suspended') => {
    setShop(prevShop => ({
      ...prevShop,
      status: status,
    } as Shop));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('shops')
        .update({
          name: shop?.name,
          description: shop?.description,
          logo: shop?.logo,
          cover_image: shop?.coverImage,
          address: shop?.address,
          is_verified: shop?.isVerified,
          status: shop?.status,
          owner_name: shop?.ownerName,
          owner_email: shop?.ownerEmail,
          phone_number: shop?.phoneNumber,
        })
        .eq('id', shopId);
      
      if (error) {
        console.error('Error updating shop:', error);
        toast.error('Failed to update shop data');
        setLoading(false);
        return;
      }
      
      toast.success('Shop data updated successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to update shop data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminShopId');
    navigate('/management/login');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      
      <div className="mb-4">
        <Label htmlFor="shopId">Shop ID:</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            id="shopId"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={fetchShop} disabled={loading}>
            {loading ? 'Loading...' : 'Load Shop'}
          </Button>
        </div>
      </div>

      {shop && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name:</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={shop.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description:</Label>
            <Textarea
              id="description"
              name="description"
              value={shop.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="logo">Logo URL:</Label>
            <Input
              type="text"
              id="logo"
              name="logo"
              value={shop.logo || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="coverImage">Cover Image URL:</Label>
            <Input
              type="text"
              id="coverImage"
              name="coverImage"
              value={shop.coverImage || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address:</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={shop.address}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="ownerName">Owner Name:</Label>
            <Input
              type="text"
              id="ownerName"
              name="ownerName"
              value={shop.ownerName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="ownerEmail">Owner Email:</Label>
            <Input
              type="email"
              id="ownerEmail"
              name="ownerEmail"
              value={shop.ownerEmail}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number:</Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={shop.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="isVerified">Is Verified:</Label>
            <Switch
              id="isVerified"
              checked={shop.isVerified}
              onCheckedChange={handleToggleVerification}
            />
          </div>
          
          <div>
            <Label>Status:</Label>
            <Select onValueChange={value => handleStatusChange(value as 'active' | 'pending' | 'suspended')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={shop.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Shop'}
          </Button>
        </form>
      )}

      <div className="mt-8">
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
