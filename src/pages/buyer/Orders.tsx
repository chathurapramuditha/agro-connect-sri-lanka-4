import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Phone, MapPin, Clock, CheckCircle, X, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: string;
  delivery_address: string;
  delivery_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
  farmer_profile: {
    full_name: string;
    phone_number: string;
  };
  product: {
    name: string;
    unit: string;
  };
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription for order updates
    const channel = supabase
      .channel('buyer-orders-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('Order updated:', payload);
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
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
        .from('orders')
        .select(`
          *,
          farmer_profile:profiles!orders_farmer_id_fkey(full_name, phone_number),
          product:products!orders_product_id_fkey(name, unit)
        `)
        .eq('buyer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      ));

      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <Package className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <ShoppingCart className="h-4 w-4" />;
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
      <div className="flex items-center gap-4 mb-6">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track your orders and purchases</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start shopping in the marketplace to see your orders here
            </p>
            <Button asChild>
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Order #{order.id.slice(-8)}
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Ordered {new Date(order.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">Rs. {order.total_amount}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.quantity} {order.product.unit} × Rs. {order.unit_price}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Product Details</h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Product:</strong> {order.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Quantity:</strong> {order.quantity} {order.product.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Unit Price:</strong> Rs. {order.unit_price}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Farmer Information</h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Name:</strong> {order.farmer_profile.full_name}
                    </p>
                    {order.farmer_profile.phone_number && (
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {order.farmer_profile.phone_number}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {order.delivery_address}
                    </p>
                  </div>
                </div>
                
                {order.delivery_date && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Requested Delivery Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.delivery_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {order.notes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button
                      variant="destructive"
                      onClick={() => cancelOrder(order.id)}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel Order
                    </Button>
                  )}
                  
                  {order.status === 'delivered' && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Review Feature",
                          description: "Review functionality will be implemented soon",
                        });
                      }}
                    >
                      <Star className="h-4 w-4" />
                      Leave Review
                    </Button>
                  )}
                  
                  {order.farmer_profile.phone_number && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(`tel:${order.farmer_profile.phone_number}`)}
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call Farmer
                    </Button>
                  )}
                  
                  <Button variant="outline" asChild className="flex items-center gap-2">
                    <Link to={`/chat?farmer=${order.farmer_profile.full_name}`}>
                      <MapPin className="h-4 w-4" />
                      Message Farmer
                    </Link>
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

export default Orders;