import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Search, TrendingUp, Leaf, Cloud, Brain, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { cleanMarkdown } from '@/lib/markdown';
import aiFarmingImage from '@/assets/ai-farming.jpg';
import saltResistantImage from '@/assets/salt-resistant-farming.jpg';
import farmingHealthImage from '@/assets/farming-health.jpg';
import waterManagementImage from '@/assets/water-management.jpg';
import heroAgricultureImage from '@/assets/hero-agriculture.jpg';

const Blog = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Real blog data based on current agricultural news
  const blogPosts = [
    {
      id: 1,
      title: 'AI-Powered Crop Recommendations for Sri Lankan Farmers',
      titleSi: 'ශ්‍රී ලංකාවේ ගොවීන් සඳහා AI බලගන්වන බෝග නිර්දේශ',
      titleTa: 'இலங்கை விவசாயிகளுக்கான AI இயங்கும் பயிர் பரிந்துரைகள்',
      excerpt: 'Revolutionary AI technology helps farmers increase yields by 30% through smart crop selection and timing recommendations.',
      excerptSi: 'කෘත්‍රිම බුද්ධිය ශ්‍රී ලංකාවේ බෝග තෝරාගැනීම සහ ගොවිතැන් ක්‍රම විප්ලවීය කරන ආකාරය සොයා බලන්න.',
      excerptTa: 'இலங்கையில் பயிர் தேர்வு மற்றும் விவசாய நடைமுறைகளில் செயற்கை நுண்ணறிவு எவ்வாறு புரட்சியை ஏற்படுத்துகிறது என்பதைக் கண்டறியுங்கள்.',
      category: 'AI & Technology',
      author: 'Dr. Priya Kumari',
      date: '2024-03-15',
      readTime: 5,
      featured: true,
      tags: ['AI', 'Technology', 'Crops', 'Innovation'],
      image: aiFarmingImage,
      content: `Artificial Intelligence is transforming agriculture in Sri Lanka, offering farmers unprecedented insights into crop management and yield optimization. Recent studies show that AI-powered recommendations can increase crop yields by up to 30% while reducing resource consumption.

The technology analyzes weather patterns, soil conditions, and historical data to provide precise planting schedules and crop selection advice. Farmers using these systems report significant improvements in both productivity and profitability.

Key benefits include:
- Optimized planting times based on weather predictions
- Improved pest and disease management
- Efficient resource allocation
- Enhanced market timing for better prices

The government has initiated several pilot programs to make this technology accessible to small-scale farmers across the island.`
    },
    {
      id: 2,
      title: 'Salt-Resistant Farming: Reclaiming Sri Lankan Coastal Agriculture',
      titleSi: 'ලුණු ප්‍රතිරෝධී ගොවිතැන්: ශ්‍රී ලංකාවේ වෙරළබඩ කෘෂිකර්මාන්තය නැවත ලබා ගැනීම',
      titleTa: 'உப்பு எதிர்ப்பு விவசாயம்: இலங்கையின் கடலோர விவசாயத்தை மீட்டெடுத்தல்',
      excerpt: 'Special Task Force develops innovative methods to restore salt-poisoned farmlands along Sri Lankan coastline.',
      excerptSi: 'ශ්‍රී ලංකාවේ වෙරළ තීරයේ ලුණු විසින් විනාශ වූ ගොවිබිම් නැවත ප්‍රතිසාධනය කිරීම සඳහා විශේෂ කාර්ය සාධක බලකාය නව්‍ය ක්‍රම සකස් කරයි.',
      excerptTa: 'இலங்கையின் கடலோரப் பகுதிகளில் உப்பினால் சேதமடைந்த விவசாய நிலங்களை மீட்டெடுக்க சிறப்புப் பணிக்குழு புதுமையான முறைகளை உருவாக்குகிறது.',
      category: 'Climate Adaptation',
      author: 'Sameera Dilshan',
      date: '2024-05-20',
      readTime: 8,
      featured: false,
      tags: ['Climate Change', 'Salinity', 'Coastal Agriculture', 'Innovation'],
      image: saltResistantImage,
      content: `Increasing salinity is slowly swallowing traditional rice paddies along Sri Lanka's coastline, taking away the livelihood of generations of farmers. A Special Task Force has launched an innovative pilot project at Katukurunda to combat this growing threat.

The project focuses on:
- Salt-tolerant crop varieties
- Improved drainage systems
- Soil rehabilitation techniques
- Alternative farming methods

Commando Sameera Dilshan leads the initiative, showing how pumpkins and other vegetables can thrive in previously unusable saline soil. This breakthrough offers hope for thousands of coastal farmers facing similar challenges.

Early results show promising crop yields in areas previously considered barren, demonstrating the potential for widespread implementation across affected regions.`
    },
    {
      id: 3,
      title: 'Kidney Disease Crisis in Sri Lankan Farming Communities',
      titleSi: 'ශ්‍රී ලංකාවේ ගොවි ප්‍රජාවන්හි වකුගඩු රෝග අර්බුදය',
      titleTa: 'இலங்கை விவசாய சமூகங்களில் சிறுநீரக நோய் நெருக்கடி',
      excerpt: 'Investigating the mysterious rise of chronic kidney disease among farmers in North Central Province.',
      excerptSi: 'උත්තර මැද පළාතේ ගොවීන් අතර නිදන්ගත වකුගඩු රෝගයේ අද්භූත වැඩිවීම විමර්ශනය කිරීම.',
      excerptTa: 'வட மத்திய மாகாணத்தில் விவசாயிகளிடையே நாள்பட்ட சிறுநீரக நோயின் மர்மமான அதிகரிப்பை ஆராய்தல்.',
      category: 'Health & Safety',
      author: 'Dr. Kang-Chun Cheng',
      date: '2024-04-28',
      readTime: 12,
      featured: false,
      tags: ['Health', 'CKD', 'Farming', 'Public Health'],
      image: farmingHealthImage,
      content: `In the verdant village of Ambagaswewa, Polonnaruwa district, a health crisis is unfolding. Chronic kidney disease of unknown etiology (CKDu) affects thousands of farmers across Sri Lanka's North Central Province.

The disease primarily impacts agricultural workers, with symptoms including:
- Chronic fatigue and weakness
- Progressive kidney function decline
- No clear connection to diabetes or hypertension

Research suggests multiple factors may contribute:
- Pesticide exposure
- Heavy metals in water sources
- Heat stress during fieldwork
- Genetic predisposition

Community health programs now focus on:
- Early detection screening
- Safe water provision
- Protective equipment training
- Alternative farming practices

This ongoing crisis highlights the urgent need for comprehensive health support systems in rural farming communities.`
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
      tags: ['Water', 'Conservation', 'Irrigation', 'Techniques'],
      image: waterManagementImage
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
    let excerpt;
    switch (language) {
      case 'si': excerpt = post.excerptSi || post.excerpt; break;
      case 'ta': excerpt = post.excerptTa || post.excerpt; break;
      default: excerpt = post.excerpt; break;
    }
    return cleanMarkdown(excerpt);
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
            {t('blog.subtitle')}
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
                      {t('blog.featured')}
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
                    <Button size="lg" className="gap-2" asChild>
                      <Link to={`/blog/article/${featuredPost.id}`}>
                        {t('cta.readarticle')}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={featuredPost.image} 
                      alt={getPostTitle(featuredPost)}
                      className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
                placeholder={t('blog.search')}
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
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={getPostTitle(post)}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Badge variant="outline" className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm">
                    {post.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="group-hover:text-primary transition-colors mb-3">
                  {getPostTitle(post)}
                </CardTitle>
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

                    <Button variant="outline" className="w-full gap-2" asChild>
                      <Link to={`/blog/article/${post.id}`}>
                        {t('blog.readmore')}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
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
            <h3 className="text-lg font-medium mb-2">{t('blog.noresults')}</h3>
            <p className="text-muted-foreground">
              {t('blog.noresults.description')}
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">{t('blog.stayupdated')}</h3>
              <p className="mb-6 text-green-100">
                {t('blog.newsletter')}
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