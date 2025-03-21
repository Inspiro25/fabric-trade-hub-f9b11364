
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Calendar, Edit, ExternalLink, PenSquare, Search, Tag, Trash } from 'lucide-react';
import { Offer, getAllOffers, deleteOffer } from '@/lib/supabase/offers';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { toast } from 'sonner';

const OffersManagement = () => {
  const [offers, setOffers] = useState<(Offer & { shops: { name: string } | null })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOffers();
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setOfferToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!offerToDelete) return;
    
    try {
      await deleteOffer(offerToDelete);
      setOffers(offers.filter(offer => offer.id !== offerToDelete));
      toast.success("Offer deleted successfully");
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    } finally {
      setDeleteDialogOpen(false);
      setOfferToDelete(null);
    }
  };

  const filteredOffers = offers.filter(offer => 
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (offer.shops?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (offer: Offer) => {
    const now = new Date();
    const expiryDate = new Date(offer.expiry);
    
    if (!offer.is_active) {
      return <Badge variant="outline" className="bg-gray-100">Inactive</Badge>;
    } else if (expiryDate < now) {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Expired</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Special Offers Management</CardTitle>
          <CardDescription>
            View and manage offers across all shops on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search offers..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-muted-foreground">Loading offers...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              {searchTerm ? (
                <>
                  <p className="mb-2 text-muted-foreground">No offers match your search</p>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>Clear search</Button>
                </>
              ) : (
                <p className="text-muted-foreground">No offers available</p>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.title}</TableCell>
                      <TableCell>
                        <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                          {offer.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        {offer.type === 'percentage' ? (
                          <Badge variant="outline" className="bg-blue-50">
                            {offer.discount}% Off
                          </Badge>
                        ) : offer.type === 'shipping' ? (
                          <Badge variant="outline" className="bg-green-50">
                            Free Shipping
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-purple-50">
                            Buy 1 Get 1
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {offer.shops?.name || "Platform-wide"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          {formatDate(offer.expiry)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(offer)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {offer.shop_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-8 w-8 p-0"
                            >
                              <Link to={`/shop/${offer.shop_id}`}>
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">View Shop</span>
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(offer.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Offer"
        description="Are you sure you want to delete this offer? This action cannot be undone and will remove it from all shop pages."
      />
    </div>
  );
};

export default OffersManagement;
