import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Product } from '@/lib/types/product';
import { toast } from 'sonner';
import { Plus, Edit, Trash, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductEditor from '@/components/admin/ProductEditor';
import { deleteProduct, getShopProducts } from '@/lib/supabase/products';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ProductsManagerProps {
  shopId: string;
}

type EditorMode = 'add' | 'edit' | null;

const ProductsManager: React.FC<ProductsManagerProps> = ({ shopId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editorMode, setEditorMode] = useState<EditorMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    loadProducts();
  }, [shopId]);
  
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const shopProducts = await getShopProducts(shopId);
      setProducts(shopProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredProducts = searchQuery
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setEditorMode('add');
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditorMode('edit');
  };

  const confirmDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      const success = await deleteProduct(productToDelete);
      
      if (success) {
        toast.success('Product deleted successfully');
        // Remove from local state
        setProducts(products.filter(p => p.id !== productToDelete));
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const closeEditor = () => {
    setEditorMode(null);
    setSelectedProduct(null);
  };

  const handleProductSave = (productData: Product) => {
    if (editorMode === 'add') {
      setProducts([...products, productData]);
    } else {
      setProducts(products.map(p => p.id === productData.id ? productData : p));
    }
    
    closeEditor();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-center text-muted-foreground">Loading products...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {editorMode ? (
        <ProductEditor 
          mode={editorMode}
          product={selectedProduct}
          shopId={shopId}
          onSave={handleProductSave}
          onCancel={closeEditor}
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manage Products</CardTitle>
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No products found</p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 mr-3">
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <span className="truncate max-w-[200px]">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.salePrice ? (
                            <span>
                              <span className="line-through text-gray-400 mr-2">${product.price}</span>
                              <span className="text-green-600">${product.salePrice}</span>
                            </span>
                          ) : (
                            <span>${product.price}</span>
                          )}
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500"
                              onClick={() => confirmDeleteProduct(product.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              asChild
                            >
                              <a href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
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
      )}
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your shop.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductsManager;
