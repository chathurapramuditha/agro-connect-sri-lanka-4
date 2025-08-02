import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus, Trash2, MapPin, Calendar, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  farmer: string;
  location: string;
  image: string;
  maxQuantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Organic Tomatoes',
      price: 120,
      quantity: 2,
      unit: 'kg',
      farmer: 'John Farmer',
      location: 'Kandy',
      image: '/placeholder.svg',
      maxQuantity: 10
    },
    {
      id: '2',
      name: 'Fresh Carrots',
      price: 80,
      quantity: 1,
      unit: 'kg',
      farmer: 'Mary Farm',
      location: 'Colombo',
      image: '/placeholder.svg',
      maxQuantity: 5
    }
  ]);

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const { toast } = useToast();

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const quantity = Math.min(newQuantity, item.maxQuantity);
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!deliveryAddress || !deliveryDate) {
      toast({
        title: "Missing information",
        description: "Please provide delivery address and date.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order placed successfully!",
      description: "Your order has been confirmed and will be processed.",
    });

    // Clear cart after successful order
    setCartItems([]);
    setDeliveryAddress('');
    setDeliveryDate('');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">Start shopping to add items to your cart</p>
            <Button asChild>
              <Link to="/marketplace">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>By {item.farmer}</span>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {item.location}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        Rs. {item.price} per {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity} {item.unit}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs. {item.price * item.quantity}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Address</label>
                  <Input
                    placeholder="Enter your delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Delivery Date</label>
                  <Input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-green-600">Free delivery on orders over Rs. 500</p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">Rs. {total}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Place Order
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    By placing an order, you agree to our terms and conditions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;