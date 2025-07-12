import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, TrendingUp, Brain, Smartphone, Globe, MessageSquare, BarChart3, Calendar, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-agriculture.jpg';

const Home = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sample blog posts for slideshow
  const blogPosts = [
    {
      id: 1,
      title: "AI Crop Recommendations Transform Sri Lankan Agriculture",
      excerpt: "Revolutionary AI technology helps farmers increase yields by 30% through smart crop selection and timing.",
      category: "Technology",
      author: "Dr. Priya Kumari",
      date: "2024-03-15",
      image: "🌱"
    },
    {
      id: 2,
      title: "Sustainable Farming Practices Combat Climate Change",
      excerpt: "Eco-friendly methods that boost productivity while protecting the environment for future generations.",
      category: "Sustainability", 
      author: "Ravi Perera",
      date: "2024-03-12",
      image: "🌿"
    },
    {
      id: 3,
      title: "Market Analysis: Record Vegetable Prices in March 2024",
      excerpt: "Comprehensive analysis reveals 25% price increase for key vegetables due to weather conditions.",
      category: "Market Analysis",
      author: "Sanduni Silva", 
      date: "2024-03-10",
      image: "📈"
    },
    {
      id: 4,
      title: "Water Conservation Techniques Save Farms During Drought",
      excerpt: "Innovative irrigation methods help farmers maintain crops despite challenging dry season conditions.",
      category: "Water Management",
      author: "Thilak Fernando",
      date: "2024-03-08", 
      image: "💧"
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    if (user) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % blogPosts.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [user, blogPosts.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % blogPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + blogPosts.length) % blogPosts.length);
  };

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI-Powered Insights',
      description: 'Get intelligent crop recommendations, price predictions, and farming advice',
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Direct Connection',
      description: 'Connect farmers and buyers without middlemen for fair pricing',
      color: 'bg-green-500/10 text-green-600'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Market Intelligence',
      description: 'Real-time market prices and demand forecasting',
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Multilingual Support',
      description: 'Available in English, Sinhala, and Tamil languages',
      color: 'bg-orange-500/10 text-orange-600'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Farmers' },
    { number: '500+', label: 'Verified Buyers' },
    { number: '50+', label: 'Crop Varieties' },
    { number: '24/7', label: 'AI Support' }
  ];

  return (
    <div className="min-h-screen">
      {/* Conditional Hero/Blog Section */}
      {!user ? (
        // Original Hero Section for non-authenticated users
        <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4">
                  🚀 AI-Powered Agriculture Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                  {t('home.title')}
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  {t('home.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="gap-2">
                  <Link to="/register?type=farmer">
                    <Leaf className="h-5 w-5" />
                    {t('home.cta.farmer')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" asChild className="gap-2">
                  <Link to="/register?type=buyer">
                    <Users className="h-5 w-5" />
                    {t('home.cta.buyer')}
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Sri Lankan Agriculture"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="relative p-8">
                  <div className="absolute -top-4 -right-4">
                    <div className="bg-yellow-400 rounded-full p-3 shadow-lg">
                      <Brain className="h-6 w-6 text-yellow-800" />
                    </div>
                  </div>
                
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">AI Assistant</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Based on weather patterns, plant tomatoes next week for optimal yield."
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Price Prediction</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Carrot prices expected to rise 15% next month"
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Crop Calendar</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Perfect time for planting seasonal vegetables"
                    </p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : (
        // Blog Slideshow Section for authenticated users
        <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20">
          <div className="container mx-auto px-4 py-20">
            <div className="mb-8 text-center">
              <Badge variant="secondary" className="mb-4">
                🌾 Latest Agricultural Insights
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Stay Updated with Farming News
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover the latest trends, tips, and insights from the agricultural world
              </p>
            </div>

            <div className="relative">
              <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <Badge variant="outline" className="w-fit mb-4">
                        {blogPosts[currentSlide].category}
                      </Badge>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                        {blogPosts[currentSlide].title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        {blogPosts[currentSlide].excerpt}
                      </p>
                      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                        <span>{blogPosts[currentSlide].author}</span>
                        <span>•</span>
                        <span>{new Date(blogPosts[currentSlide].date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-4">
                        <Button asChild className="gap-2">
                          <Link to={`/blog/article/${blogPosts[currentSlide].id}`}>
                            Read Full Article
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/blog">
                            View All Articles
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
                      <div className="text-8xl animate-pulse">
                        {blogPosts[currentSlide].image}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 w-full px-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {blogPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-primary scale-110' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline">Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              {t('home.ai.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.ai.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="space-y-4">
                  <div className={`w-16 h-16 rounded-lg ${feature.color} flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Transform Sri Lankan Agriculture?
            </h2>
            <p className="text-xl text-green-100">
              Join thousands of farmers and buyers already using our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/marketplace">
                  Explore Marketplace
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600" asChild>
                <Link to="/ai-chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Try AI Assistant
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;