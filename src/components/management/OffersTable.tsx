
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
import { Edit, Trash2 } from 'lucide-react';
import { Offer } from '@/lib/supabase/offers';

interface OffersTableProps {
  offers: Offer[];
  isLoading: boolean;
  onEdit: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
}

const OffersTable: React.FC<OffersTableProps> = ({
  offers,
  isLoading,
  onEdit,
  onDelete
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

  return (
    <div className="rounded-md border">
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
