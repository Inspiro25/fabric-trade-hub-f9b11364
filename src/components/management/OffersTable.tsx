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
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { type Offer } from '@/lib/supabase/offers';

interface OffersTableProps {
  offers: Offer[];
  isLoading: boolean;
  onEdit: (offer: Offer) => void;
  onDelete: (offerId: string) => void;
  isMobile: boolean;
}

export function OffersTable({ offers, isLoading, onEdit, onDelete, isMobile }: OffersTableProps) {
  if (isLoading) {
    return <div className="text-center py-4 text-sm">Loading offers...</div>;
  }

  if (offers.length === 0) {
    return <div className="text-center py-4 text-sm">No offers found.</div>;
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-card rounded-lg border p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-medium text-sm">{offer.title}</h3>
                <p className="text-xs text-muted-foreground">{offer.code}</p>
              </div>
              <Badge variant={offer.is_active ? "default" : "secondary"} className="text-xs">
                {offer.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="text-xs space-y-1">
              <p><span className="font-medium">Type:</span> {offer.type}</p>
              <p><span className="font-medium">Discount:</span> {offer.type === 'percentage' ? `${offer.discount}%` : `₹${offer.discount}`}</p>
              <p><span className="font-medium">Expires:</span> {formatDate(offer.expiry)}</p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(offer)}
                className="flex-1 text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDelete(offer.id)}
                className="flex-1 text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell className="font-medium">{offer.title}</TableCell>
              <TableCell>{offer.code}</TableCell>
              <TableCell className="capitalize">{offer.type}</TableCell>
              <TableCell>
                {offer.type === 'percentage' ? `${offer.discount}%` : `₹${offer.discount}`}
              </TableCell>
              <TableCell>
                <Badge variant={offer.is_active ? "default" : "secondary"}>
                  {offer.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(offer.expiry)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(offer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onDelete(offer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
