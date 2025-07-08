import React from 'react';
import { Users, Target, Heart, Award, Globe, Smartphone, Brain, TrendingUp, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Direct Connection',
      titleSi: 'සෘජු සම්බන්ධතාවය',
      titleTa: 'நேரடி இணைப்பு',
      description: 'Connect farmers directly with buyers, eliminating middlemen for fair pricing.',
      descriptionSi: 'සාධාරණ මිල ගනන් සඳහා මධ්‍යස්ථ දුරුකරමින් ගොවීන් ගැනුම්කරුවන් සමඟ සෘජුවම සම්බන්ධ කරන්න.',
      descriptionTa: 'நியాயமான விலை நிர்ணயத்திற்காக இடைத்தரகர்களை நீக்கி விவசாயிகளை வாங்குபவர்களுடன் நேரடியாக இணைக்கவும்.'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI-Powered Insights',
      titleSi: 'AI බලගන්වන අවබෝධය',
      titleTa: 'AI சார்ந்த நுண்ணறிவு',
      description: 'Smart recommendations for crops, prices, and farming techniques using artificial intelligence.',
      descriptionSi: 'කෘත්‍රිම බුද්ධිය භාවිතා කරමින් බෝග, මිල සහ ගොවිතැන් ක්‍රම සඳහා බුද්ධිමත් නිර්දේශ.',
      descriptionTa: 'செயற்கை நுண்ணறிவைப் பயன்படுத்தி பயிர்கள், விலைகள் மற்றும் விவசாய நுட்பங்களுக்கான புத்திசாலித்தனமான பரிந்துரைகள்.'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Multilingual Support',
      titleSi: 'බහුභාෂික සහාය',
      titleTa: 'பன்மொழி ஆதரவு',
      description: 'Available in Sinhala, Tamil, and English to serve all Sri Lankan communities.',
      descriptionSi: 'සියලුම ශ්‍රී ලංකිකයන්ට සේවය කිරීම සඳහා සිංහල, දෙමළ සහ ඉංග්‍රීසි භාෂාවලින් ලබා ගත හැකිය.',
      descriptionTa: 'அனைத்து இலங்கை சமூகங்களுக்கும் சேவை செய்ய சிங்கள, தமிழ் மற்றும் ஆங்கிலத்தில் கிடைக்கிறது.'
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Mobile-First Design',
      titleSi: 'ජංගම-මුලික සැලසුම',
      titleTa: 'மொபைல்-முதல் வடிவமைப்பு',
      description: 'Optimized for mobile devices to reach farmers in remote areas.',
      descriptionSi: 'දුරදිග ප්‍රදේශවල ගොවීන් වෙත ළඟා වීම සඳහා ජංගම උපකරණ සඳහා ප්‍රශස්ත කර ඇත.',
      descriptionTa: 'தொலைதூரப் பகுதிகளில் உள்ள விவசாயிகளை அணுக மொபைல் சாधனங்களுக்கு உகந்ததாக உள்ளது.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Farmers', labelSi: 'සක්‍රිය ගොවීන්', labelTa: 'செயலில் உள்ள விவசாயிகள்' },
    { number: '500+', label: 'Verified Buyers', labelSi: 'සත්‍යාපිත ගැනුම්කරුවන්', labelTa: 'சரிபார்க்கப்பட்ட வாங்குபவர்கள்' },
    { number: '25', label: 'Districts Covered', labelSi: 'ආවරණය වන දිස්ත්‍රික්ක', labelTa: 'மாவட்டங்கள் உள்ளடக்கப்பட்டவை' },
    { number: '50+', label: 'Crop Varieties', labelSi: 'බෝග ප්‍රභේද', labelTa: 'பயிர் வகைகள்' }
  ];

  const team = [
    {
      name: 'Dr. Anura Perera',
      role: 'Founder & CEO',
      bio: 'Agricultural expert with 15+ years of experience in sustainable farming practices.',
      bioSi: 'තිරසාර ගොවිතැන් ක්‍රමවලින් වසර 15කට වැඩි අත්දැකීම් ඇති කෘෂිකර්ම විශේෂඥයෙක්.',
      bioTa: 'நீடித்த விவசாய நடைமுறைகளில் 15+ ஆண்டுகள் அனுபவம் கொண்ட விவசாய நிபுணர்.'
    },
    {
      name: 'Kavitha Rajapakse',
      role: 'Head of Technology',
      bio: 'Software architect specializing in AI and machine learning for agriculture.',
      bioSi: 'කෘෂිකර්මාන්තය සඳහා AI සහ යන්ත්‍ර ඉගෙනීම පිළිබඳ විශේෂඥ මෘදුකාංග ගෘහ නිර්මාණ ශිල්පියෙක්.',
      bioTa: 'விவசாயத்திற்கான AI மற்றும் இயந்திர கற்றலில் நிபுணத்துவம் பெற்ற மென்பொருள் கட்டிடக் கலைஞர்.'
    },
    {
      name: 'Thilan Fernando',
      role: 'Market Analyst',
      bio: 'Economics graduate focused on agricultural market trends and price analysis.',
      bioSi: 'කෘෂිකාර්මික වෙළඳපල ප්‍රවණතා සහ මිල විශ්ලේෂණය කෙරෙහි අවධානය යොමු කරන ආර්ථික විද්‍යා උපාධිධාරී.',
      bioTa: 'விவசாய சந்தை போக்குகள் மற்றும் விலை பகுப்பாய்வில் கவனம் செலுத்தும் பொருளாதார பட்டதாரி.'
    }
  ];

  const getStatLabel = (stat: any) => {
    switch (language) {
      case 'si': return stat.labelSi;
      case 'ta': return stat.labelTa;
      default: return stat.label;
    }
  };

  const getFeatureTitle = (feature: any) => {
    switch (language) {
      case 'si': return feature.titleSi;
      case 'ta': return feature.titleTa;
      default: return feature.title;
    }
  };

  const getFeatureDescription = (feature: any) => {
    switch (language) {
      case 'si': return feature.descriptionSi;
      case 'ta': return feature.descriptionTa;
      default: return feature.description;
    }
  };

  const getTeamBio = (member: any) => {
    switch (language) {
      case 'si': return member.bioSi;
      case 'ta': return member.bioTa;
      default: return member.bio;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-green-600 to-blue-600">
              About AgroLink Sri Lanka
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Transforming Sri Lankan Agriculture
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're building a direct connection between farmers and buyers, powered by AI and designed for the Sri Lankan agricultural community.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getStatLabel(stat)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Empowering Sri Lankan Farmers Through Technology
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                AgroLink Sri Lanka was born from a simple observation: too many hardworking farmers struggle to get fair prices for their produce due to complex supply chains and lack of direct market access.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform eliminates middlemen, provides AI-powered farming insights, and creates a transparent marketplace where farmers can thrive and buyers can access fresh, quality produce directly from the source.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-2">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-medium">Fair pricing for farmers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2">
                    <Heart className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium">Fresh produce for consumers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-2">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-medium">Sustainable agriculture practices</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">Price Growth</div>
                    <div className="text-2xl font-bold text-green-600">+25%</div>
                    <div className="text-xs text-muted-foreground">farmer income</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">Community</div>
                    <div className="text-2xl font-bold text-blue-600">1500+</div>
                    <div className="text-xs text-muted-foreground">members</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">AI Accuracy</div>
                    <div className="text-2xl font-bold text-purple-600">95%</div>
                    <div className="text-xs text-muted-foreground">predictions</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">Coverage</div>
                    <div className="text-2xl font-bold text-orange-600">25</div>
                    <div className="text-xs text-muted-foreground">districts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Platform Features
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Why Choose AgroLink?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines traditional farming wisdom with modern technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardHeader>
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{getFeatureTitle(feature)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {getFeatureDescription(feature)}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Meet the People Behind AgroLink
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A passionate team dedicated to transforming Sri Lankan agriculture
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {getTeamBio(member)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Join the Agricultural Revolution?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Whether you're a farmer looking to sell directly or a buyer seeking fresh produce, AgroLink connects you with the Sri Lankan agricultural community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="secondary" className="text-lg px-6 py-2">
                🌱 Join 1000+ Farmers
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                🛒 500+ Active Buyers
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                🤖 AI-Powered Platform
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;