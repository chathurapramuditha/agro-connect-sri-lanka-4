import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price_per_kg: number;
  quantity_available: number;
  unit: string;
  is_available: boolean;
  is_organic: boolean;
  location: string;
  harvest_date: string;
  created_at: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    
    // Set up real-time subscription for product updates
    const channel = supabase
      .channel('products-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Product updated:', payload);
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's profile first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, is_available: !currentStatus }
          : product
      ));

      toast({
        title: "Success",
        description: `Product ${!currentStatus ? 'made available' : 'made unavailable'}`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product availability",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(product => product.id !== productId));

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">My Products</h1>
            <p className="text-muted-foreground">Manage your farm products and listings</p>
          </div>
        </div>
        <Button onClick={() => navigate('/farmer/products/add')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding your first product to the marketplace
            </p>
            <Button onClick={() => navigate('/farmer/products/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {product.name}
                      {product.is_organic && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Organic
                        </Badge>
                      )}
                      <Badge variant={product.is_available ? "default" : "destructive"}>
                        {product.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Added {new Date(product.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">Rs. {product.price_per_kg}/{product.unit}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Quantity Available</p>
                    <p className="text-sm text-muted-foreground">
                      {product.quantity_available} {product.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {product.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Harvest Date</p>
                    <p className="text-sm text-muted-foreground">
                      {product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                </div>
                
                {product.description && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/farmer/products/edit/${product.id}`)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  
                  <Button
                    variant={product.is_available ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleAvailability(product.id, product.is_available)}
                    className="flex items-center gap-2"
                  >
                    {product.is_available ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Make Unavailable
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Make Available
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;