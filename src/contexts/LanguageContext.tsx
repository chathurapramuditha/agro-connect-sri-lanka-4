import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'si' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.marketplace': 'Marketplace',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    
    // Homepage
    'home.title': 'Connect Directly with Sri Lankan Farmers',
    'home.subtitle': 'Fresh produce, fair prices, AI-powered insights',
    'home.cta.farmer': 'I am a Farmer',
    'home.cta.buyer': 'I am a Buyer',
    'home.ai.title': 'AI-Powered Agriculture',
    'home.ai.description': 'Get smart recommendations for crops, prices, and farming techniques',
    
    // Marketplace
    'marketplace.title': 'Fresh Produce Marketplace',
    'marketplace.search': 'Search products...',
    'marketplace.filter.all': 'All Categories',
    'marketplace.filter.vegetables': 'Vegetables',
    'marketplace.filter.fruits': 'Fruits',
    'marketplace.filter.grains': 'Grains',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.price': 'Price',
    'common.quantity': 'Quantity',
    'common.contact': 'Contact',
    
    // Authentication
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.farmer': 'Farmer',
    'auth.buyer': 'Buyer',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.location': 'Location',
  },
  si: {
    // Navigation
    'nav.home': 'මුල් පිටුව',
    'nav.marketplace': 'වෙළඳපල',
    'nav.blog': 'බ්ලොග්',
    'nav.about': 'අපි ගැන',
    'nav.login': 'ප්‍රවේශය',
    'nav.register': 'ලියාපදිංචිය',
    'nav.dashboard': 'උපකරණ පුවරුව',
    'nav.admin': 'පරිපාලක',
    
    // Homepage
    'home.title': 'ශ්‍රී ලංකාවේ ගොවීන් සමඟ සෘජුවම සම්බන්ධ වන්න',
    'home.subtitle': 'නැවුම් නිෂ්පාදන, සාධාරණ මිල, AI බුද්ධිමත් අවබෝධය',
    'home.cta.farmer': 'මම ගොවියෙක්',
    'home.cta.buyer': 'මම ගැනුම්කරුවෙක්',
    'home.ai.title': 'AI බලගන්වන කෘෂිකර්මාන්තය',
    'home.ai.description': 'බෝග, මිල සහ ගොවිතාන් ක්‍රම සඳහා බුද්ධිමත් නිර්දේශ ලබා ගන්න',
    
    // Marketplace
    'marketplace.title': 'නැවුම් නිෂ්පාදන වෙළඳපල',
    'marketplace.search': 'නිෂ්පාදන සොයන්න...',
    'marketplace.filter.all': 'සියලු කාණ්ඩ',
    'marketplace.filter.vegetables': 'එළවළු',
    'marketplace.filter.fruits': 'පලතුරු',
    'marketplace.filter.grains': 'ධාන්‍ය',
    
    // Common
    'common.loading': 'පූරණය වෙමින්...',
    'common.error': 'යමක් වැරදුණි',
    'common.save': 'සුරකින්න',
    'common.cancel': 'අවලංගු කරන්න',
    'common.submit': 'ඉදිරිපත් කරන්න',
    'common.price': 'මිල',
    'common.quantity': 'ප්‍රමාණය',
    'common.contact': 'සම්බන්ධතාවය',
    
    // Authentication
    'auth.email': 'විද්‍යුත් තැපෑල',
    'auth.password': 'මුරපදය',
    'auth.login': 'ප්‍රවේශය',
    'auth.register': 'ලියාපදිංචිය',
    'auth.farmer': 'ගොවියා',
    'auth.buyer': 'ගැනුම්කරු',
    'auth.name': 'සම්පූර්ණ නම',
    'auth.phone': 'දුරකථන අංකය',
    'auth.location': 'ස්ථානය',
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.marketplace': 'சந்தை',
    'nav.blog': 'வலைப்பதிவு',
    'nav.about': 'எங்களைப் பற்றி',
    'nav.login': 'உள்நுழைய',
    'nav.register': 'பதிவு',
    'nav.dashboard': 'கட்டுப்பாட்டு பலகை',
    'nav.admin': 'நிர்வாகி',
    
    // Homepage
    'home.title': 'இலங்கை விவசாயிகளுடன் நேரடியாக இணைக்கவும்',
    'home.subtitle': 'புதிய விளைபொருட்கள், நியாயமான விலைகள், AI இயங்கும் நுண்ணறிவு',
    'home.cta.farmer': 'நான் ஒரு விவசாயி',
    'home.cta.buyer': 'நான் ஒரு வாங்குபவர்',
    'home.ai.title': 'AI சக்தி வாய்ந்த விவசாயம்',
    'home.ai.description': 'பயிர்கள், விலைகள் மற்றும் விவசாய நுட்பங்களுக்கான புத்திசாலித்தனமான பரிந்துரைகளைப் பெறுங்கள்',
    
    // Marketplace
    'marketplace.title': 'புதிய விளைபொருட்கள் சந்தை',
    'marketplace.search': 'தயாரிப்புகளைத் தேடு...',
    'marketplace.filter.all': 'அனைத்து வகைகள்',
    'marketplace.filter.vegetables': 'காய்கறிகள்',
    'marketplace.filter.fruits': 'பழங்கள்',
    'marketplace.filter.grains': 'தானியங்கள்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'ஏதோ தவறு நடந்தது',
    'common.save': 'சேமி',
    'common.cancel': 'ரத்து செய்',
    'common.submit': 'சமர்ப்பி',
    'common.price': 'விலை',
    'common.quantity': 'அளவு',
    'common.contact': 'தொடர்பு',
    
    // Authentication
    'auth.email': 'மின்னஞ்சல்',
    'auth.password': 'கடவுச்சொல்',
    'auth.login': 'உள்நுழைய',
    'auth.register': 'பதிவு செய்ய',
    'auth.farmer': 'விவசாயி',
    'auth.buyer': 'வாங்குபவர்',
    'auth.name': 'முழு பெயர்',
    'auth.phone': 'தொலைபேசி எண்',
    'auth.location': 'இடம்',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};