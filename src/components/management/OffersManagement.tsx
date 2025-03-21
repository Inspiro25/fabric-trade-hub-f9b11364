
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search } from 'lucide-react';
import { Offer, getAllOffers, createOffer, updateOffer, deleteOffer } from '@/lib/supabase/offers';
import OffersTable from './OffersTable';

const OffersManagement: React.FC = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

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
      
      setFilteredOffers(filtered);
    }
  }, [searchQuery, offers]);

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

  const handleAddOffer = () => {
    // Add offer functionality
    toast({
      title: 'Add Offer',
      description: 'This feature is under development'
    });
  };

  const handleEditOffer = (offer: Offer) => {
    // Edit offer functionality
    toast({
      title: 'Edit Offer',
      description: `Editing offer: ${offer.title}`
    });
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[250px]"
          />
        </div>
        <Button onClick={handleAddOffer}>
          <Plus className="h-4 w-4 mr-2" />
          Add Offer
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Offers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Offers</CardTitle>
              <CardDescription>Manage all promotions and special offers</CardDescription>
            </CardHeader>
            <CardContent>
              <OffersTable 
                offers={filteredOffers}
                isLoading={isLoading}
                onEdit={handleEditOffer}
                onDelete={handleDeleteOffer}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Offers</CardTitle>
              <CardDescription>Currently active promotions and special offers</CardDescription>
            </CardHeader>
            <CardContent>
              <OffersTable 
                offers={filteredOffers.filter(offer => offer.is_active && new Date(offer.expiry) > new Date())}
                isLoading={isLoading}
                onEdit={handleEditOffer}
                onDelete={handleDeleteOffer}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>Expired Offers</CardTitle>
              <CardDescription>Past promotions and special offers</CardDescription>
            </CardHeader>
            <CardContent>
              <OffersTable 
                offers={filteredOffers.filter(offer => !offer.is_active || new Date(offer.expiry) <= new Date())}
                isLoading={isLoading}
                onEdit={handleEditOffer}
                onDelete={handleDeleteOffer}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OffersManagement;
