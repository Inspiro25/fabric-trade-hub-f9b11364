
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
import { motion } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <motion.h1 
        className="text-2xl font-semibold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        VYOMA Admin Dashboard
      </motion.h1>
      
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
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
      </motion.div>

      {shop && (
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Label htmlFor="name">Name:</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={shop.name}
              onChange={(e) => setShop({...shop, name: e.target.value})}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Label htmlFor="description">Description:</Label>
            <Textarea
              id="description"
              name="description"
              value={shop.description}
              onChange={(e) => setShop({...shop, description: e.target.value})}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Label htmlFor="logo">Logo URL:</Label>
            <Input
              type="text"
              id="logo"
              name="logo"
              value={shop.logo || ''}
              onChange={(e) => setShop({...shop, logo: e.target.value})}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Label htmlFor="coverImage">Cover Image URL:</Label>
            <Input
              type="text"
              id="coverImage"
              name="coverImage"
              value={shop.coverImage || ''}
              onChange={(e) => setShop({...shop, coverImage: e.target.value})}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Label htmlFor="address">Address:</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={shop.address}
              onChange={(e) => setShop({...shop, address: e.target.value})}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label htmlFor="ownerName">Owner Name:</Label>
            <Input
              type="text"
              id="ownerName"
              name="ownerName"
              value={shop.ownerName}
              onChange={(e) => setShop({...shop, ownerName: e.target.value})}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label htmlFor="ownerEmail">Owner Email:</Label>
            <Input
              type="email"
              id="ownerEmail"
              name="ownerEmail"
              value={shop.ownerEmail}
              onChange={(e) => setShop({...shop, ownerEmail: e.target.value})}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label htmlFor="phoneNumber">Phone Number:</Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={shop.phoneNumber}
              onChange={(e) => setShop({...shop, phoneNumber: e.target.value})}
            />
          </motion.div>
          
          <motion.div className="flex items-center space-x-2" variants={itemVariants}>
            <Label htmlFor="isVerified">Is Verified:</Label>
            <Switch
              id="isVerified"
              checked={shop.isVerified}
              onCheckedChange={(checked) => setShop({...shop, isVerified: checked})}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Label>Status:</Label>
            <Select 
              value={shop.status} 
              onValueChange={(value) => setShop({...shop, status: value as 'active' | 'pending' | 'suspended'})}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={shop.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Shop'}
            </Button>
          </motion.div>
        </motion.form>
      )}

      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
