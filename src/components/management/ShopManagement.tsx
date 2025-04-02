import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash, Check, X, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTheme } from '@/contexts/ThemeContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Shop, ShopStatus, adaptShopData } from '@/lib/shops/types';

const shopFormSchema = z.object({
  name: z.string().min(2, { message: "Shop name must be at least 2 characters." }).max(50),
  status: z.enum(["active", "pending", "suspended"]).default("pending"),
  address: z.string().optional(),
  password: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  shopId: z.string().optional(),
  coverImage: z.string().optional(),
  ownerName: z.string().optional(),
  ownerEmail: z.string().email({ message: "Please enter a valid email" }).optional(),
  phoneNumber: z.string().optional(),
  isVerified: z.boolean().default(false),
});

type ShopFormValues = z.infer<typeof shopFormSchema>;

const ShopManagement: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingShop, setIsAddingShop] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: "",
      status: "pending",
      address: "",
      description: "",
      logo: "",
      shopId: "",
      coverImage: "",
      ownerName: "",
      ownerEmail: "",
      phoneNumber: "",
      isVerified: false,
    }
  });
  
  useEffect(() => {
    fetchShops();
  }, []);
  
  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const shopsWithDefaultValues = (data || []).map(shop => adaptShopData(shop));
      
      setShops(shopsWithDefaultValues);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredShops = searchQuery 
    ? shops.filter(shop => 
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.owner_email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : shops;
  
  const handleAddShop = async (data: ShopFormValues) => {
    try {
      const shopData = {
        name: data.name,
        status: data.status,
        address: data.address || '',
        description: data.description || '',
        logo: data.logo || '',
        shop_id: data.shopId || '',
        cover_image: data.coverImage || '',
        owner_name: data.ownerName || '',
        owner_email: data.ownerEmail || '',
        phone_number: data.phoneNumber || '',
        is_verified: data.isVerified || false,
        password: data.password || '',
        website: '',
        social_media: { facebook: '', twitter: '', instagram: '', pinterest: '' },
        categories: [],
        tags: [],
        product_count: 0,
        review_count: 0,
        rating: 0,
        followers_count: 0,
        created_at: new Date().toISOString()
      };
      
      const { data: newShop, error } = await supabase
        .from('shops')
        .insert([shopData])
        .select()
        .single();
        
      if (error) throw error;
      
      const adaptedShop = adaptShopData(newShop);
      setShops([adaptedShop, ...shops]);
      setIsAddingShop(false);
      form.reset();
      toast.success('Shop added successfully');
    } catch (error) {
      console.error('Error adding shop:', error);
      toast.error('Failed to add shop');
    }
  };
  
  const handleEditShop = async (data: ShopFormValues) => {
    if (!selectedShop) return;
    
    try {
      const shopData = {
        name: data.name,
        status: data.status,
        address: data.address || '',
        description: data.description || '',
        logo: data.logo || '',
        shop_id: data.shopId || '',
        cover_image: data.coverImage || '',
        owner_name: data.ownerName || '',
        owner_email: data.ownerEmail || '',
        phone_number: data.phoneNumber || '',
        is_verified: data.isVerified,
        password: data.password
      };
      
      const { error } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', selectedShop.id);
        
      if (error) throw error;
      
      setShops(shops.map(shop => 
        shop.id === selectedShop.id 
          ? { ...shop, ...shopData } 
          : shop
      ));
      
      setSelectedShop(null);
      form.reset();
      toast.success('Shop updated successfully');
    } catch (error) {
      console.error('Error updating shop:', error);
      toast.error('Failed to update shop');
    }
  };
  
  const handleDeleteShop = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setShops(shops.filter(shop => shop.id !== id));
      setIsConfirmDeleteOpen(false);
      setShopToDelete(null);
      toast.success('Shop deleted successfully');
    } catch (error) {
      console.error('Error deleting shop:', error);
      toast.error('Failed to delete shop');
    }
  };
  
  const handleShopFormSubmit = (data: ShopFormValues) => {
    if (selectedShop) {
      handleEditShop(data);
    } else {
      handleAddShop(data);
    }
  };
  
  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop);
    form.reset({
      name: shop.name,
      status: shop.status as "active" | "pending" | "suspended",
      address: shop.address || "",
      description: shop.description || "",
      logo: shop.logo || "",
      shopId: shop.shop_id || "",
      coverImage: shop.cover_image || "",
      ownerName: shop.owner_name || "",
      ownerEmail: shop.owner_email || "",
      phoneNumber: shop.phone_number || "",
      isVerified: shop.is_verified || false,
      password: ""
    });
  };
  
  const handleCancelForm = () => {
    setSelectedShop(null);
    setIsAddingShop(false);
    form.reset();
  };
  
  const confirmDelete = (id: string) => {
    setShopToDelete(id);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleShopLogin = (shop: Shop) => {
    sessionStorage.setItem('adminShopId', shop.id);
    navigate('/admin/dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shop Management</h1>
        <Button onClick={() => setIsAddingShop(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Shop
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Shops</CardTitle>
          <CardDescription>Manage all partner shops on the platform</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search shops..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No shops found</p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShops.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {shop.logo ? (
                            <img 
                              src={shop.logo} 
                              alt={shop.name} 
                              className="w-8 h-8 rounded-full object-cover" 
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                {shop.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          {shop.is_verified && (
                            <Check className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{shop.owner_name || "—"}</div>
                          <div className="text-gray-500 text-xs">{shop.owner_email || "—"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs inline-flex items-center",
                          shop.status === "active" ? "bg-green-100 text-green-800" :
                          shop.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {shop.status || "pending"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(shop)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => confirmDelete(shop.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleShopLogin(shop)}
                          >
                            Login
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
      
      <Sheet open={isAddingShop || !!selectedShop} onOpenChange={(open) => {
        if (!open) handleCancelForm();
      }}>
        <SheetContent className={cn(
          "sm:max-w-md",
          isDarkMode ? "dark bg-gray-900 text-white" : ""
        )}>
          <SheetHeader>
            <SheetTitle>
              {selectedShop ? "Edit Shop" : "Add New Shop"}
            </SheetTitle>
            <SheetDescription>
              {selectedShop 
                ? "Update shop details here. Click save when you're done."
                : "Add a new shop to the platform."
              }
            </SheetDescription>
          </SheetHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleShopFormSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
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
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter shop description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Verified Shop</FormLabel>
                      <FormDescription>
                        Mark this shop as a verified partner
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Shop owner's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ownerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="owner@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Shop's physical address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shopId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop ID (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Custom shop identifier" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique identifier for this shop
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{selectedShop ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Shop login password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Used for shop admin login
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={handleCancelForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedShop ? "Update Shop" : "Add Shop"}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shop? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => shopToDelete && handleDeleteShop(shopToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopManagement;
