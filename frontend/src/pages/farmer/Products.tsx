import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import websocketService from '@/services/websocket';

interface Product {
  product_id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  quantity_available: number;
  unit: string;
  images?: string;
  location: string;
  harvest_date?: string;
  expiry_date?: string;
  is_organic: boolean;
  status: 'active' | 'inactive' | 'sold_out';
  created_at: string;
  updated_at: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProducts();
      
      // Set up WebSocket connection for real-time updates
      websocketService.connect(user.user_id);
      websocketService.on('product_updated', handleProductUpdate);
      websocketService.on('product_created', handleProductCreated);
      websocketService.on('product_deleted', handleProductDeleted);
    }

    return () => {
      websocketService.off('product_updated', handleProductUpdate);
      websocketService.off('product_created', handleProductCreated);
      websocketService.off('product_deleted', handleProductDeleted);
    };
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    
    try {
      const data = await apiService.getProductsBySeller(user.user_id);
      setProducts(data);
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

  // WebSocket event handlers
  const handleProductUpdate = (data: any) => {
    if (data.seller_id === user?.user_id) {
      setProducts(prev => prev.map(product => 
        product.product_id === data.product_id ? { ...product, ...data } : product
      ));
    }
  };

  const handleProductCreated = (data: any) => {
    if (data.seller_id === user?.user_id) {
      setProducts(prev => [data, ...prev]);
    }
  };

  const handleProductDeleted = (data: any) => {
    if (data.seller_id === user?.user_id) {
      setProducts(prev => prev.filter(product => product.product_id !== data.product_id));
    }
  };

  const toggleAvailability = async (productId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      await apiService.updateProduct(productId, { status: newStatus });

      setProducts(products.map(product => 
        product.product_id === productId 
          ? { ...product, status: newStatus }
          : product
      ));

      toast({
        title: "Success",
        description: `Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
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
      await apiService.deleteProduct(productId);

      setProducts(products.filter(product => product.product_id !== productId));

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
            <Card key={product.product_id}>
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
                      <Badge 
                        variant={product.status === 'active' ? "default" : 
                                product.status === 'inactive' ? "secondary" : "destructive"}
                      >
                        {product.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Added {new Date(product.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">Rs. {product.price}/{product.unit}</span>
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
                    onClick={() => navigate(`/farmer/products/edit/${product.product_id}`)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  
                  <Button
                    variant={product.status === 'active' ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleAvailability(product.product_id, product.status)}
                    className="flex items-center gap-2"
                  >
                    {product.status === 'active' ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Activate
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(product.product_id)}
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