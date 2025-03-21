
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Product } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductEditor from '@/components/admin/ProductEditor';

interface ProductsManagerProps {
  shopId: string;
  products: Product[];
}

type EditorMode = 'add' | 'edit' | null;

const ProductsManager: React.FC<ProductsManagerProps> = ({ shopId, products }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [editorMode, setEditorMode] = useState<EditorMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const filteredProducts = searchQuery
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDeleteProduct = (productId: string) => {
    // In a real app, this would delete from a database
    console.log("Deleting product:", productId);
    
    toast({
      title: "Product deleted",
      description: "The product has been removed from your inventory",
      duration: 3000,
    });
  };

  const closeEditor = () => {
    setEditorMode(null);
    setSelectedProduct(null);
  };

  const handleProductSave = (productData: any) => {
    // In a real app, this would save to a database
    console.log("Saving product:", productData);
    
    toast({
      title: editorMode === 'add' ? "Product added" : "Product updated",
      description: editorMode === 'add' 
        ? "New product has been added to your inventory" 
        : "Product has been updated successfully",
      duration: 3000,
    });
    
    closeEditor();
  };

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
                              onClick={() => handleDeleteProduct(product.id)}
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
    </>
  );
};

export default ProductsManager;
