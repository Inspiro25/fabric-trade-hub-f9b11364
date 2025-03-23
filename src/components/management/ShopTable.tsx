
import React from 'react';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Shop } from '@/lib/shops/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ShopTableProps {
  shops: Shop[];
  isLoading: boolean;
  onEdit: (shop: Shop) => void;
  onDelete: (shopId: string) => void;
  isMobile?: boolean;
}

const ShopTable: React.FC<ShopTableProps> = ({ 
  shops, 
  isLoading, 
  onEdit, 
  onDelete,
  isMobile = false
}) => {
  // Table columns to display - adjust for mobile
  const columns = isMobile 
    ? ['Name', 'Status', 'Actions']
    : ['Name', 'Owner', 'Status', 'Verified', 'Actions'];

  // Generate skeleton rows for loading state
  const skeletonRows = Array.from({ length: 5 }, (_, i) => (
    <TableRow key={`skeleton-${i}`}>
      {columns.map((col, index) => (
        <TableCell key={`skeleton-cell-${index}`}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          skeletonRows
        ) : shops.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">
              No shops found
            </TableCell>
          </TableRow>
        ) : (
          shops.map((shop) => (
            <TableRow key={shop.id}>
              <TableCell className="font-medium">
                {shop.name}
              </TableCell>
              
              {!isMobile && (
                <TableCell>
                  {shop.ownerName || "No owner assigned"}
                </TableCell>
              )}
              
              <TableCell>
                <Badge 
                  variant={
                    shop.status === 'active' 
                      ? 'success' 
                      : shop.status === 'pending' 
                        ? 'warning' 
                        : 'destructive'
                  }
                >
                  {shop.status}
                </Badge>
              </TableCell>
              
              {!isMobile && (
                <TableCell>
                  {shop.isVerified ? 
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Verified
                    </Badge> : 
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Unverified
                    </Badge>
                  }
                </TableCell>
              )}
              
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(shop)}
                    title="Edit shop"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(shop.id)}
                    title="Delete shop"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
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
