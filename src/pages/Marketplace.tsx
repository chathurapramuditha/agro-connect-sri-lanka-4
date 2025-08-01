import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Phone, MessageCircle, Leaf, TrendingUp, ShoppingCart, Plus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import UserSearchDropdown from '@/components/UserSearchDropdown';
import productTomatoes from '@/assets/product-tomatoes.jpg';
import productCoconuts from '@/assets/product-coconuts.jpg';
import productRice from '@/assets/product-rice.jpg';
import productGreenBeans from '@/assets/product-green-beans.jpg';
import marketplaceHero from '@/assets/marketplace-hero.jpg';

const Marketplace = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
    
    // Set up real-time subscription for product updates
    const channel = supabase
      .channel('marketplace-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Product updated in marketplace:', payload);
        fetchProducts(); // Refresh products when any change occurs
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles!products_farmer_id_fkey(full_name, phone_number, location),
          product_categories(name, name_sinhala, name_tamil)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedProducts = data?.map(product => ({
        id: product.id,
        name: product.name,
        nameSi: product.name_sinhala || product.name,
        nameTa: product.name_tamil || product.name,
        category: product.product_categories?.name?.toLowerCase() || 'other',
        price: product.price_per_kg,
        unit: product.unit,
        quantity: `${product.quantity_available} ${product.unit} available`,
        farmer: product.profiles?.full_name || 'Unknown Farmer',
        farmerPhone: product.profiles?.phone_number || 'N/A',
        location: product.location || product.profiles?.location || 'Unknown Location',
        rating: 4.5 + Math.random() * 0.5, // Mock rating for now
        image: product.images?.[0] || '/placeholder.svg',
        description: product.description || 'Fresh produce',
        aiScore: 85 + Math.floor(Math.random() * 15),
        priceChange: Math.floor(Math.random() * 21) - 10,
        productId: product.id,
        farmerId: product.farmer_id,
        isOrganic: product.is_organic
      })) || [];
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data kept as fallback
  const mockProducts = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      nameSi: 'නැවුම් තක්කාලි',
      nameTa: 'புதிய தக்காளி',
      category: 'vegetables',
      price: 150,
      unit: 'kg',
      quantity: '200 kg available',
      farmer: 'Sunil Perera',
      farmerPhone: '+94 77 123 4567',
      location: 'Kandy',
      rating: 4.8,
      image: productTomatoes,
      description: 'Organic tomatoes grown without pesticides',
      aiScore: 95,
      priceChange: +12
    },
    {
      id: 2,
      name: 'Coconuts',
      nameSi: 'පොල්',
      nameTa: 'தேங்காய்',
      category: 'fruits',
      price: 80,
      unit: 'each',
      quantity: '500 pieces available',
      farmer: 'Kamala Silva',
      farmerPhone: '+94 71 987 6543',
      location: 'Kurunegala',
      rating: 4.6,
      image: productCoconuts,
      description: 'Fresh coconuts harvested this morning',
      aiScore: 88,
      priceChange: -5
    },
    {
      id: 3,
      name: 'Rice (Basmati)',
      nameSi: 'සුදු හාල්',
      nameTa: 'அரிசி',
      category: 'grains',
      price: 280,
      unit: 'kg',
      quantity: '1000 kg available',
      farmer: 'Ravi Kumara',
      farmerPhone: '+94 76 555 1234',
      location: 'Polonnaruwa',
      rating: 4.9,
      image: productRice,
      description: 'Premium quality basmati rice',
      aiScore: 92,
      priceChange: +8
    },
    {
      id: 4,
      name: 'Green Beans',
      nameSi: 'බෝංචි',
      nameTa: 'பீன்ஸ்',
      category: 'vegetables',
      price: 120,
      unit: 'kg',
      quantity: '150 kg available',
      farmer: 'Nimal Fernando',
      farmerPhone: '+94 78 444 5678',
      location: 'Nuwara Eliya',
      rating: 4.7,
      image: productGreenBeans,
      description: 'Fresh green beans from hill country',
      aiScore: 90,
      priceChange: +3
    }
  ];

  const categories = [
    { value: 'all', label: t('marketplace.filter.all') },
    { value: 'vegetables', label: t('marketplace.filter.vegetables') },
    { value: 'fruits', label: t('marketplace.filter.fruits') },
    { value: 'grains', label: t('marketplace.filter.grains') },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProductName = (product: any) => {
    const { language } = useLanguage();
    switch (language) {
      case 'si': return product.nameSi;
      case 'ta': return product.nameTa;
      default: return product.name;
    }
  };

  const handleChatWithFarmer = (product: any) => {
    // Navigate to chat page with farmer info
    navigate('/chat', { 
      state: { 
        farmerName: product.farmer,
        farmerPhone: product.farmerPhone,
        productName: getProductName(product),
        productId: product.productId || product.id,
        farmerId: product.farmerId
      }
    });
  };

  const handleContactFarmer = (product: any) => {
    toast({
      title: "Farmer Contact",
      description: `${product.farmer}: ${product.farmerPhone}`,
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
        userId: user.id,
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
                <h1 className="text-4xl font-bold mb-2">{t('marketplace.title')}</h1>
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
                    placeholder={t('marketplace.search')}
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
                      Tomato prices are expected to increase by 15% next week. Green beans are at optimal buying price.
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
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={getProductName(product)}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* AI Score Badge */}
                      <Badge 
                        className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500"
                      >
                        AI {product.aiScore}%
                      </Badge>

                      {/* Price Change Indicator */}
                      <Badge 
                        variant={product.priceChange > 0 ? "destructive" : "secondary"}
                        className="absolute top-2 left-2"
                      >
                        {product.priceChange > 0 ? '+' : ''}{product.priceChange}%
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
                        <Badge variant="outline">{product.quantity}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{product.farmer}, {product.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{product.rating}</span>
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
                        {t('common.contact')}
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
            {filteredProducts.length === 0 && (
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