import React, { useState } from 'react';
import { Calendar, User, Tag, Search, TrendingUp, Leaf, Cloud, Brain, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const Blog = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock blog data - in real app, this would come from API
  const blogPosts = [
    {
      id: 1,
      title: 'AI-Powered Crop Recommendations for Sri Lankan Farmers',
      titleSi: 'ශ්‍රී ලංකාවේ ගොවීන් සඳහා AI බලගන්වන බෝග නිර්දේශ',
      titleTa: 'இலங்கை விவசாயிகளுக்கான AI இயங்கும் பயிர் பரிந்துரைகள்',
      excerpt: 'Discover how artificial intelligence is revolutionizing crop selection and farming practices in Sri Lanka.',
      excerptSi: 'කෘත්‍රිම බුද්ධිය ශ්‍රී ලංකාවේ බෝග තෝරාගැනීම සහ ගොවිතැන් ක්‍රම විප්ලවීය කරන ආකාරය සොයා බලන්න.',
      excerptTa: 'இலங்கையில் பயிர் தேர்வு மற்றும் விவசாய நடைமுறைகளில் செயற்கை நுண்ணறிவு எவ்வாறு புரட்சியை ஏற்படுத்துகிறது என்பதைக் கண்டறியுங்கள்.',
      category: 'AI & Technology',
      author: 'Dr. Priya Kumari',
      date: '2024-03-15',
      readTime: 5,
      featured: true,
      tags: ['AI', 'Technology', 'Crops', 'Innovation']
    },
    {
      id: 2,
      title: 'Sustainable Farming Practices for Climate Change',
      titleSi: 'දේශගුණික විපර්යාස සඳහා තිරසාර ගොවිතැන් ක්‍රම',
      titleTa: 'காலநிலை மாற்றத்திற்கான நீடித்த விவசாய நடைமுறைகள்',
      excerpt: 'Learn about eco-friendly farming methods that help combat climate change while maintaining productivity.',
      excerptSi: 'ඵලදායිත්වය පවත්වා ගනිමින් දේශගුණික විපර්යාසයට එරෙහිව සටන් කිරීමට උපකාර වන පරිසර-හිතකාමී ගොවිතැන් ක්‍රම ගැන ඉගෙන ගන්න.',
      excerptTa: 'உற்பத்தித்திறனை பராமரிக்கும் போது காலநிலை மாற்றத்தை எதிர்த்துப் போராட உதவும் சுற்றுச்சூழல் நட்பு விவசாய முறைகளைப் பற்றி அறியுங்கள்.',
      category: 'Sustainability',
      author: 'Ravi Perera',
      date: '2024-03-12',
      readTime: 7,
      featured: false,
      tags: ['Sustainability', 'Climate', 'Environment', 'Organic']
    },
    {
      id: 3,
      title: 'Market Price Analysis: Vegetables in March 2024',
      titleSi: 'වෙළඳපල මිල විශ්ලේෂණය: 2024 මාර්තුවේ එළවළු',
      titleTa: 'சந்தை விலை பகுப்பாய்வு: மார்ச் 2024 காய்கறிகள்',
      excerpt: 'Comprehensive analysis of vegetable prices and market trends for March 2024.',
      excerptSi: '2024 මාර්තු මාසය සඳහා එළවළු මිල සහ වෙළඳපල ප්‍රවණතා පිළිබඳ විස්තීර්ණ විශ්ලේෂණයක්.',
      excerptTa: 'மார்ச் 2024 காய்கறி விலைகள் மற்றும் சந்தை போக்குகளின் விரிவான பகுப்பாய்வு.',
      category: 'Market Analysis',
      author: 'Sanduni Silva',
      date: '2024-03-10',
      readTime: 4,
      featured: false,
      tags: ['Market', 'Prices', 'Analysis', 'Vegetables']
    },
    {
      id: 4,
      title: 'Water Management Techniques for Dry Season',
      titleSi: 'වියළි කාලය සඳහා ජල කළමනාකරණ ක්‍රම',
      titleTa: 'வறண்ட காலத்திற்கான நீர் மேலாண்மை நுட்பங்கள்',
      excerpt: 'Essential water conservation and management strategies for farmers during dry seasons.',
      excerptSi: 'වියළි කාලවලදී ගොවීන් සඳහා අත්‍යවශ්‍ය ජල සංරක්ෂණ සහ කළමනාකරණ උපාය මාර්ග.',
      excerptTa: 'வறண்ட காலங்களில் விவசாயிகளுக்கான அத্യாவश்ய நீர் பாதுகாப்பு மற்றும் மேலாண்மை உத்திகள்.',
      category: 'Water Management',
      author: 'Thilak Fernando',
      date: '2024-03-08',
      readTime: 6,
      featured: false,
      tags: ['Water', 'Conservation', 'Irrigation', 'Techniques']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: <Tag className="h-4 w-4" /> },
    { value: 'AI & Technology', label: 'AI & Technology', icon: <Brain className="h-4 w-4" /> },
    { value: 'Sustainability', label: 'Sustainability', icon: <Leaf className="h-4 w-4" /> },
    { value: 'Market Analysis', label: 'Market Analysis', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'Water Management', label: 'Water Management', icon: <Cloud className="h-4 w-4" /> },
  ];

  const getPostTitle = (post: any) => {
    switch (language) {
      case 'si': return post.titleSi;
      case 'ta': return post.titleTa;
      default: return post.title;
    }
  };

  const getPostExcerpt = (post: any) => {
    switch (language) {
      case 'si': return post.excerptSi;
      case 'ta': return post.excerptTa;
      default: return post.excerpt;
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = getPostTitle(post).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getPostExcerpt(post).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('nav.blog')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest farming tips, market insights, and agricultural innovations
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Card className="overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="mb-4 bg-gradient-to-r from-green-600 to-blue-600">
                      Featured Article
                    </Badge>
                    <h2 className="text-3xl font-bold mb-4 leading-tight">
                      {getPostTitle(featuredPost)}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      {getPostExcerpt(featuredPost)}
                    </p>
                    <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <span>{featuredPost.readTime} min read</span>
                    </div>
                    <Button size="lg" className="gap-2">
                      Read Article
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                      <Brain className="h-16 w-16 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="gap-2"
              >
                {category.icon}
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.filter(post => !post.featured).map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg mb-4 flex items-center justify-center">
                  {post.category === 'AI & Technology' && <Brain className="h-12 w-12 text-blue-600" />}
                  {post.category === 'Sustainability' && <Leaf className="h-12 w-12 text-green-600" />}
                  {post.category === 'Market Analysis' && <TrendingUp className="h-12 w-12 text-purple-600" />}
                  {post.category === 'Water Management' && <Cloud className="h-12 w-12 text-blue-600" />}
                </div>
                <Badge variant="outline" className="w-fit mb-2">
                  {post.category}
                </Badge>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {getPostTitle(post)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-base">
                  {getPostExcerpt(post)}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span>{post.readTime} min read</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button variant="outline" className="w-full gap-2">
                  Read More
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="mb-6 text-green-100">
                Subscribe to our newsletter for the latest farming tips and market insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button variant="secondary" className="bg-white text-green-600 hover:bg-white/90">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;