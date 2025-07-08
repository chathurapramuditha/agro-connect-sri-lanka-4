import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Phone, MessageCircle, Leaf, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const Marketplace = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - in real app, this would come from API
  const products = [
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
      location: 'Kandy',
      rating: 4.8,
      image: '/placeholder.svg',
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
      location: 'Kurunegala',
      rating: 4.6,
      image: '/placeholder.svg',
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
      location: 'Polonnaruwa',
      rating: 4.9,
      image: '/placeholder.svg',
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
      location: 'Nuwara Eliya',
      rating: 4.7,
      image: '/placeholder.svg',
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('marketplace.title')}</h1>
          <p className="text-muted-foreground">
            Discover fresh produce from verified Sri Lankan farmers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                    <Leaf className="h-12 w-12 text-muted-foreground" />
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
                  <Button className="flex-1" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    {t('common.contact')}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
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
      </div>
    </div>
  );
};

export default Marketplace;