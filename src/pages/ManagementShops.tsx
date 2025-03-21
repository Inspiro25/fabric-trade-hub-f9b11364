
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { createShop, deleteShop, fetchShops, Shop, updateShop } from '@/lib/shops';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash, Store, Check, X } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const shopFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  logo: z.string().url("Must be a valid URL").or(z.string().length(0)).default(''),
  coverImage: z.string().url("Must be a valid URL").or(z.string().length(0)).default(''),
  isVerified: z.boolean().default(false),
});

type ShopFormValues = z.infer<typeof shopFormSchema>;

const ManagementShops = () => {
  const { toast } = useToast();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [shopToEdit, setShopToEdit] = useState<Shop | null>(null);

  // Setup form for adding a new shop
  const addForm = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      logo: '/placeholder.svg',
      coverImage: '/placeholder.svg',
      isVerified: false,
    },
  });

  // Setup form for editing a shop
  const editForm = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      logo: '',
      coverImage: '',
      isVerified: false,
    },
  });

  useEffect(() => {
    loadShops();
  }, []);

  useEffect(() => {
    if (shops.length > 0) {
      if (searchQuery.trim() === '') {
        setFilteredShops(shops);
      } else {
        const filtered = shops.filter(
          shop => shop.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredShops(filtered);
      }
    }
  }, [searchQuery, shops]);

  const loadShops = async () => {
    setIsLoading(true);
    try {
      const fetchedShops = await fetchShops();
      setShops(fetchedShops);
      setFilteredShops(fetchedShops);
    } catch (error) {
      console.error('Error loading shops:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shops',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddShop = async (data: ShopFormValues) => {
    try {
      // Ensure all required properties are included with non-optional values
      const newShopData: Omit<Shop, "id"> = {
        name: data.name,
        description: data.description,
        address: data.address,
        logo: data.logo || '/placeholder.svg',
        coverImage: data.coverImage || '/placeholder.svg',
        isVerified: data.isVerified || false,
        rating: 0,
        reviewCount: 0,
        productIds: [],
        createdAt: new Date().toISOString(),
      };
      
      const shopId = await createShop(newShopData);
      
      if (shopId) {
        toast({
          title: 'Success',
          description: 'Shop has been created successfully',
        });
        loadShops();
        setIsAddDialogOpen(false);
        addForm.reset();
      } else {
        throw new Error('Failed to create shop');
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shop',
        variant: 'destructive',
      });
    }
  };

  const handleEditShop = async (data: ShopFormValues) => {
    if (!shopToEdit) return;
    
    try {
      const success = await updateShop(shopToEdit.id, data);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Shop has been updated successfully',
        });
        loadShops();
        setIsEditDialogOpen(false);
        editForm.reset();
      } else {
        throw new Error('Failed to update shop');
      }
    } catch (error) {
      console.error('Error updating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shop',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteShop = async () => {
    if (!shopToDelete) return;
    
    try {
      const success = await deleteShop(shopToDelete);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Shop has been deleted successfully',
        });
        loadShops();
      } else {
        throw new Error('Failed to delete shop');
      }
    } catch (error) {
      console.error('Error deleting shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete shop',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setShopToDelete(null);
    }
  };

  const confirmDelete = (shopId: string) => {
    setShopToDelete(shopId);
    setShowDeleteDialog(true);
  };

  const handleEdit = (shop: Shop) => {
    setShopToEdit(shop);
    
    // Reset form with shop data
    editForm.reset({
      name: shop.name,
      description: shop.description,
      address: shop.address,
      logo: shop.logo,
      coverImage: shop.coverImage,
      isVerified: shop.isVerified,
    });
    
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shop Management</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Shop
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Shops</TabsTrigger>
          <TabsTrigger value="verified">Verified Shops</TabsTrigger>
          <TabsTrigger value="unverified">Unverified Shops</TabsTrigger>
        </TabsList>
        
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search shops..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1" 
          />
        </div>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Shops</CardTitle>
              <CardDescription>
                Manage all shops registered on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  ) : filteredShops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No shops found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredShops.map((shop) => (
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
                              onClick={() => handleEdit(shop)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => confirmDelete(shop.id)}
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle>Verified Shops</CardTitle>
              <CardDescription>
                Shops that have been verified by administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Reviews</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Loading shops...
                      </TableCell>
                    </TableRow>
                  ) : filteredShops.filter(shop => shop.isVerified).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No verified shops found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredShops
                      .filter(shop => shop.isVerified)
                      .map((shop) => (
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
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEdit(shop)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => confirmDelete(shop.id)}
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unverified">
          <Card>
            <CardHeader>
              <CardTitle>Unverified Shops</CardTitle>
              <CardDescription>
                Shops pending verification by administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Reviews</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Loading shops...
                      </TableCell>
                    </TableRow>
                  ) : filteredShops.filter(shop => !shop.isVerified).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No unverified shops found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredShops
                      .filter(shop => !shop.isVerified)
                      .map((shop) => (
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
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEdit(shop)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => confirmDelete(shop.id)}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Shop Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Shop</DialogTitle>
            <DialogDescription>
              Add a new shop to the platform. Fill out all fields to continue.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddShop)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter shop name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter shop description" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter shop address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter logo URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter cover image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addForm.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Verified Shop</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark as a verified shop on the platform
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Shop</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Shop Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>
              Update shop information. Fill out all fields to continue.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditShop)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter shop name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter shop description" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter shop address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter logo URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter cover image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Verified Shop</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark as a verified shop on the platform
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Shop</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shop? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteShop}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagementShops;
