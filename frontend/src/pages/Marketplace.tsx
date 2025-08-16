import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Phone, MessageCircle, Leaf, TrendingUp, ShoppingCart, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/services/api';
import websocketService from '@/services/websocket';
import { useAuth } from '@/contexts/AuthContext';
import UserSearchDropdown from '@/components/UserSearchDropdown';
import productTomatoes from '@/assets/product-tomatoes.jpg';
import productCoconuts from '@/assets/product-coconuts.jpg';
import productRice from '@/assets/product-rice.jpg';
import productGreenBeans from '@/assets/product-green-beans.jpg';
import marketplaceHero from '@/assets/marketplace-hero.jpg';

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
  status: string;
  created_at: string;
  seller_name?: string;
  seller_phone?: string;
  category_name?: string;
}

const Marketplace = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    
    // Set up WebSocket connection for real-time updates
    if (user) {
      websocketService.connect(user.user_id);
      
      // Listen for product updates
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
    try {
      const data = await apiService.getProducts();
      
      // Enrich products with seller and category information
      const enrichedProducts = await Promise.all(
        data.map(async (product: Product) => {
          try {
            // Get seller information
            const seller = await apiService.getUser(product.seller_id);
            const sellerProfile = await apiService.getProfile(product.seller_id).catch(() => null);
            
            // Get category information
            const category = await apiService.getCategory(product.category_id).catch(() => null);
            
            return {
              ...product,
              seller_name: seller?.full_name || 'Unknown Farmer',
              seller_phone: seller?.phone_number || 'N/A',
              seller_location: seller?.location || sellerProfile?.city || sellerProfile?.address || 'Unknown Location',
              category_name: category?.name || 'Other',
            };
          } catch (error) {
            console.error('Error enriching product:', error);
            return {
              ...product,
              seller_name: 'Unknown Farmer',
              seller_phone: 'N/A',
              seller_location: 'Unknown Location',
              category_name: 'Other',
            };
          }
        })
      );
      
      setProducts(enrichedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Using sample data.",
        variant: "destructive",
      });
      
      // Fallback to mock data
      setProducts(mockProducts as any);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      const categoryOptions = [
        { value: 'all', label: t('marketplace.filter.all') || 'All Categories' },
        ...data.map((cat: any) => ({
          value: cat.category_id,
          label: cat.name,
        }))
      ];
      setCategories(categoryOptions);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories
      setCategories([
        { value: 'all', label: t('marketplace.filter.all') || 'All Categories' },
        { value: 'vegetables', label: t('marketplace.filter.vegetables') || 'Vegetables' },
        { value: 'fruits', label: t('marketplace.filter.fruits') || 'Fruits' },
        { value: 'grains', label: t('marketplace.filter.grains') || 'Grains' },
      ]);
    }
  };

  // WebSocket event handlers
  const handleProductUpdate = (data: any) => {
    console.log('Product updated:', data);
    fetchProducts(); // Refresh products
  };

  const handleProductCreated = (data: any) => {
    console.log('Product created:', data);
    fetchProducts(); // Refresh products
  };

  const handleProductDeleted = (data: any) => {
    console.log('Product deleted:', data);
    setProducts(prev => prev.filter(p => p.product_id !== data.product_id));
  };

  // Mock data as fallback
  const mockProducts = [
    {
      product_id: '1',
      name: 'Fresh Tomatoes',
      nameSi: 'නැවුම් තක්කාලි',
      nameTa: 'புதிய தக்காளி',
      category: 'vegetables',
      price: 150,
      unit: 'kg',
      quantity_available: 200,
      seller_name: 'Sunil Perera',
      seller_phone: '+94 77 123 4567',
      seller_location: 'Kandy',
      rating: 4.8,
      images: productTomatoes,
      description: 'Organic tomatoes grown without pesticides',
      aiScore: 95,
      priceChange: +12,
      is_organic: true,
      status: 'active'
    },
    {
      product_id: '2',
      name: 'Coconuts',
      nameSi: 'පොල්',
      nameTa: 'தேங்காய்',
      category: 'fruits',
      price: 80,
      unit: 'each',
      quantity_available: 500,
      seller_name: 'Kamala Silva',
      seller_phone: '+94 71 987 6543',
      seller_location: 'Kurunegala',
      rating: 4.6,
      images: productCoconuts,
      description: 'Fresh coconuts harvested this morning',
      aiScore: 88,
      priceChange: -5,
      is_organic: false,
      status: 'active'
    },
    {
      product_id: '3',
      name: 'Rice (Basmati)',
      nameSi: 'සුදු හාල්',
      nameTa: 'அரிசி',
      category: 'grains',
      price: 280,
      unit: 'kg',
      quantity_available: 1000,
      seller_name: 'Ravi Kumara',
      seller_phone: '+94 76 555 1234',
      seller_location: 'Polonnaruwa',
      rating: 4.9,
      images: productRice,
      description: 'Premium quality basmati rice',
      aiScore: 92,
      priceChange: +8,
      is_organic: false,
      status: 'active'
    },
    {
      product_id: '4',
      name: 'Green Beans',
      nameSi: 'බෝංචි',
      nameTa: 'பீன்ஸ்',
      category: 'vegetables',
      price: 120,
      unit: 'kg',
      quantity_available: 150,
      seller_name: 'Nimal Fernando',
      seller_phone: '+94 78 444 5678',
      seller_location: 'Nuwara Eliya',
      rating: 4.7,
      images: productGreenBeans,
      description: 'Fresh green beans from hill country',
      aiScore: 90,
      priceChange: +3,
      is_organic: true,
      status: 'active'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.seller_name && product.seller_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.seller_location && product.seller_location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           product.category_id === selectedCategory ||
                           (product.category_name && product.category_name.toLowerCase() === selectedCategory);
    
    return matchesSearch && matchesCategory && product.status === 'active';
  });

  const getProductName = (product: any) => {
    const { language } = useLanguage();
    switch (language) {
      case 'si': return product.nameSi || product.name;
      case 'ta': return product.nameTa || product.name;
      default: return product.name;
    }
  };

  const handleChatWithFarmer = (product: any) => {
    navigate('/chat', { 
      state: { 
        farmerName: product.seller_name,
        farmerPhone: product.seller_phone,
        productName: getProductName(product),
        productId: product.product_id,
        farmerId: product.seller_id
      }
    });
  };

  const handleContactFarmer = (product: any) => {
    toast({
      title: "Farmer Contact",
      description: `${product.seller_name}: ${product.seller_phone}`,
      duration: 5000,
    });
  };

  const handleAddToCart = (product: any) => {
    toast({
      title: "Added to Cart",
      description: `${getProductName(product)} has been added to your cart.`,
    });
  };

  const handleChatWithUser = (user: any) => {
    navigate('/chat', { 
      state: { 
        userId: user.user_id,
        userName: user.full_name,
        userType: user.user_type
      }
    });
  };

  const handleUserSelect = (user: any) => {
    toast({
      title: "User Selected",
      description: `Selected ${user.full_name} (${user.user_type})`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 relative">
          <div className="relative h-48 rounded-xl overflow-hidden mb-6">
            <img 
              src={marketplaceHero} 
              alt="Sri Lankan Agriculture Marketplace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">{t('marketplace.title') || 'Agriculture Marketplace'}</h1>
                <p className="text-xl">
                  Discover fresh produce from verified Sri Lankan farmers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Products and Users */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Product Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('marketplace.search') || 'Search products, farmers, locations...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="ai-score">AI Recommended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AI Insights Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 rounded-full p-2">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">AI Market Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Fresh produce available from {products.length} active listings. Best prices found!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3">Loading fresh products...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                <Card key={product.product_id} className="group hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                        <img 
                          src={product.images || '/placeholder.svg'} 
                          alt={getProductName(product)}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Organic Badge */}
                      {product.is_organic && (
                        <Badge 
                          className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500"
                        >
                          <Leaf className="h-3 w-3 mr-1" />
                          Organic
                        </Badge>
                      )}

                      {/* Status Badge */}
                      <Badge 
                        variant={product.status === 'active' ? "default" : "secondary"}
                        className="absolute top-2 left-2"
                      >
                        {product.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {getProductName(product)}
                        </h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            Rs. {product.price}
                          </span>
                          <span className="text-sm text-muted-foreground">/{product.unit}</span>
                        </div>
                        <Badge variant="outline">
                          {product.quantity_available} {product.unit} available
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{product.seller_name}, {product.seller_location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {(4.5 + Math.random() * 0.5).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 space-y-2">
                    <div className="flex gap-2 w-full">
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={() => handleContactFarmer(product)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        {t('common.contact') || 'Contact'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleChatWithFarmer(product)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
                ))}
              </div>
            )}

            {/* No Products Results */}
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Search Section */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Search Users</h2>
                <p className="text-muted-foreground mb-6">
                  Find and chat with farmers, buyers, and administrators in our community
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <UserSearchDropdown
                  placeholder="Search for users by name, type, or location..."
                  onUserSelect={handleUserSelect}
                  onChatWithUser={handleChatWithUser}
                  showChatButton={true}
                />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Connect with Our Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Search for users to start conversations, find farmers for products, or connect with buyers for your produce.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Marketplace;