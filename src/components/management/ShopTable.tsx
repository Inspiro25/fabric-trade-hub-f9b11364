
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Shop } from '@/lib/shops';
import { Check, Edit, Trash, X, Star, MapPin, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  // Mobile view using cards
  if (isMobile) {
    return (
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading shops...</span>
          </div>
        ) : shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-8 text-muted-foreground">
            <ShoppingBag className="h-10 w-10 opacity-40" />
            <span>No shops found</span>
          </div>
        ) : (
          shops.map((shop) => (
            <Card key={shop.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden shadow-sm flex-shrink-0">
                    <img 
                      src={shop.logo}
                      alt={shop.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{shop.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {shop.description ? shop.description.substring(0, 40) + (shop.description.length > 40 ? '...' : '') : ''}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-y-2 text-sm">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                    <span className="truncate" title={shop.address}>
                      {shop.address}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                    <span>{shop.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-xs ml-1">({shop.reviewCount})</span>
                  </div>
                  
                  <div>
                    {shop.isVerified ? (
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-600 flex items-center gap-1 font-normal">
                        <Check className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-600 flex items-center gap-1 font-normal">
                        <X className="h-3 w-3" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(shop)}
                      className="flex-1 h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(shop.id)}
                      className="flex-1 h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  // Desktop view with table
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Shop Name</TableHead>
            <TableHead className="font-semibold">Address</TableHead>
            <TableHead className="font-semibold">Reviews</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span>Loading shops...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : shops.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-40" />
                  <span>No shops found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            shops.map((shop) => (
              <TableRow key={shop.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden shadow-sm">
                      <img 
                        src={shop.logo}
                        alt={shop.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{shop.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {shop.description ? shop.description.substring(0, 50) + (shop.description.length > 50 ? '...' : '') : ''}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                    <span className="max-w-[180px] truncate" title={shop.address}>
                      {shop.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                    <span>{shop.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-xs ml-1">({shop.reviewCount})</span>
                  </div>
                </TableCell>
                <TableCell>
                  {shop.isVerified ? (
                    <Badge variant="outline" className="bg-green-50 border-green-200 text-green-600 flex items-center gap-1 font-normal">
                      <Check className="h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-600 flex items-center gap-1 font-normal">
                      <X className="h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(shop)}
                      className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(shop.id)}
                      className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash className="h-3.5 w-3.5 mr-1" />
                      Delete
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

export default ShopTable;
