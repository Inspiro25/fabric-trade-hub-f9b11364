
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CircleCheck, CircleX } from 'lucide-react';
import { Offer } from '@/lib/supabase/offers';
import { Card, CardContent } from '@/components/ui/card';

interface OffersTableProps {
  offers: Offer[];
  isLoading: boolean;
  onEdit: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
  isMobile?: boolean;
}

const OffersTable: React.FC<OffersTableProps> = ({
  offers,
  isLoading,
  onEdit,
  onDelete,
  isMobile = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) <= new Date();
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="text-center py-4">No offers found.</div>
        ) : (
          offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{offer.title}</div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(offer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(offer.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-medium">Code:</div>
                  <div>
                    <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                      {offer.code}
                    </code>
                  </div>
                  
                  <div className="font-medium">Type:</div>
                  <div className="capitalize">{offer.type}</div>
                  
                  <div className="font-medium">Discount:</div>
                  <div>
                    {offer.type === 'percentage' && offer.discount ? 
                      `${offer.discount}%` : 
                      offer.type === 'shipping' ? 
                      'Free Shipping' : 
                      'BOGO'}
                  </div>
                  
                  <div className="font-medium">Expiry:</div>
                  <div>{formatDate(offer.expiry)}</div>
                  
                  <div className="font-medium">Status:</div>
                  <div>
                    {!offer.is_active ? (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Inactive
                      </Badge>
                    ) : isExpired(offer.expiry) ? (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        Expired
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Loading offers...
              </TableCell>
            </TableRow>
          ) : offers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No offers found.
              </TableCell>
            </TableRow>
          ) : (
            offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-medium">{offer.title}</TableCell>
                <TableCell>
                  <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                    {offer.code}
                  </code>
                </TableCell>
                <TableCell className="capitalize">{offer.type}</TableCell>
                <TableCell>
                  {offer.type === 'percentage' && offer.discount ? 
                    `${offer.discount}%` : 
                    offer.type === 'shipping' ? 
                    'Free Shipping' : 
                    'BOGO'}
                </TableCell>
                <TableCell>{formatDate(offer.expiry)}</TableCell>
                <TableCell>
                  {!offer.is_active ? (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 flex items-center gap-1">
                      <CircleX className="h-3 w-3" /> Inactive
                    </Badge>
                  ) : isExpired(offer.expiry) ? (
                    <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
                      <CircleX className="h-3 w-3" /> Expired
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
                      <CircleCheck className="h-3 w-3" /> Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(offer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(offer.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OffersTable;
