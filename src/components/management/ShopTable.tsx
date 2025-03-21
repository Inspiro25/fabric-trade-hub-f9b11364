
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Shop } from '@/lib/shops';
import { Check, Edit, Trash, X } from 'lucide-react';

interface ShopTableProps {
  shops: Shop[];
  isLoading: boolean;
  onEdit: (shop: Shop) => void;
  onDelete: (shopId: string) => void;
}

const ShopTable: React.FC<ShopTableProps> = ({
  shops,
  isLoading,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shop Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Reviews</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              Loading shops...
            </TableCell>
          </TableRow>
        ) : shops.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No shops found
            </TableCell>
          </TableRow>
        ) : (
          shops.map((shop) => (
            <TableRow key={shop.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden">
                    <img 
                      src={shop.logo}
                      alt={shop.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <span>{shop.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {shop.address}
              </TableCell>
              <TableCell>{shop.rating.toFixed(1)}</TableCell>
              <TableCell>{shop.reviewCount}</TableCell>
              <TableCell>
                {shop.isVerified ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(shop)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDelete(shop.id)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ShopTable;
