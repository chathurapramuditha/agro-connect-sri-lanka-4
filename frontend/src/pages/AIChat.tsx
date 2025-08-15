import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, TrendingUp, Calendar, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'warning';
}

const AIChat = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: language === 'si' 
        ? 'ආයුබෝවන්! මම AgroLink AI සහායකයා. ගොවිතැන, බෝග වවාගැනීම, සහ වෙළඳපොළ මිල ගැන ඕනෑම ප්‍රශ්නයක් අහන්න.'
        : language === 'ta'
        ? 'வணக்கம்! நான் AgroLink AI உதவியாளர். விவசாயம், பயிர் வளர்ப்பு மற்றும் சந்தை விலைகள் பற்றி எந்த கேள்வியும் கேளுங்கள்.'
        : 'Hello! I\'m your AgroLink AI assistant. Ask me anything about farming, crop cultivation, and market prices.',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    {
      icon: <TrendingUp className="h-4 w-4" />,
      text: language === 'si' ? 'හෙට වතුර මිල' : language === 'ta' ? 'நாளை காய்கறி விலை' : 'Vegetable prices tomorrow',
      query: 'What will be the vegetable prices tomorrow?'
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      text: language === 'si' ? 'මේ සතියේ වවන්න හොඳම බෝග' : language === 'ta' ? 'இந்த வாரம் விதைக்க சிறந்த பயிர்கள்' : 'Best crops to plant this week',
      query: 'What are the best crops to plant this week?'
    },
    {
      icon: <Cloud className="h-4 w-4" />,
      text: language === 'si' ? 'කාලගුණ අනාවැකිය' : language === 'ta' ? 'வானிலை முன்னறிவிப்பு' : 'Weather forecast',
      query: 'What\'s the weather forecast for farming?'
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      text: language === 'si' ? 'ගොවිතැන් උපදෙස්' : language === 'ta' ? 'விவசாய ஆலோசனை' : 'Farming tips',
      query: 'Give me some farming tips for beginners'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (language === 'si') {
      if (lowerMessage.includes('මිල') || lowerMessage.includes('price')) {
        return 'වර්තමානයේ තක්කාලි කිලෝවට රු. 150-180 අතර වෙළඳපලේ තිබෙනවා. ලබන සතියේ මිල 15%ක් වැඩිවීමට ඉඩ තියෙනවා. AI විශ්ලේෂණයට අනුව, දැන් කොළ අච්චාරු විකුණන්න හොඳ කාලයයි.';
      }
      if (lowerMessage.includes('වවන') || lowerMessage.includes('plant')) {
        return 'මේ කාලගුණයට අනුව තක්කාලි, වම්බටු, සහ බීටුරුට් වවන්න හොඳයි. ඊළඟ සති 2ක් තුළ වැස්ස අඩු වෙන නිසා මේවා වවන්න. පොහොර දාන්න අමතක කරන්න එපා!';
      }
      if (lowerMessage.includes('කාලගුණ') || lowerMessage.includes('weather')) {
        return 'ලබන සතියේ දවල් 2-3ක් වැස්ස ඇති. උදේ කාලයේ ගොවිතැන් කම්මුල් කරන්න හොඳයි. සවස 4න් පසු වැස්ස ඇති නිසා ඒ වෙලාවට ගෙදරට එන්න.';
      }
      return 'ඔබගේ ප්‍රශ්නය ගැන වැඩිහිටියන් ගැන හොඳ විශ්ලේෂණයක් කරන්නම්. AgroLink AI ලෙස මට ගොවිතැන්, බෝග වවාගැනීම, මිල ගණන්, සහ කාලගුණය ගැන උපදෙස් දෙන්න පුළුවන්.';
    }
    
    if (language === 'ta') {
      if (lowerMessage.includes('விலை') || lowerMessage.includes('price')) {
        return 'தற்போது தக்காளி ₹150-180 கிலோவுக்கு சந்தையில் கிடைக்கிறது. அடுத்த வாரம் விலை 15% உயரும் என்று எதிர்பார்க்கப்படுகிறது. AI பகுப்பாய்வின்படி, இப்போது பீன்ஸ் விற்க சிறந்த நேரம்.';
      }
      if (lowerMessage.includes('விதை') || lowerMessage.includes('plant')) {
        return 'இந்த காலநிலைக்கு ஏற்ப தக்காளி, கத்திரிக்காய், பீட்ரூட் விதைக்கலாம். அடுத்த 2 வாரங்களில் மழை குறையும் என்பதால் இவற்றை விதையுங்கள். உரம் போடுவதை மறக்காதீர்கள்!';
      }
      if (lowerMessage.includes('வானிலை') || lowerMessage.includes('weather')) {
        return 'அடுத்த வாரம் 2-3 நாட்கள் மழை பெய்யும். காலை நேரங்களில் விவசாய வேலைகளை செய்யுங்கள். மாலை 4 மணிக்கு பிறகு மழை பெய்ய வாய்ப்புள்ளது.';
      }
      return 'உங்கள் கேள்விக்கு விரிவான பகுப்பாய்வு செய்கிறேன். AgroLink AI ஆக நான் விவசாயம், பயிர் வளர்ப்பு, விலைகள் மற்றும் வானிலை பற்றி ஆலோசனை வழங்க முடியும்.';
    }
    
    // English responses
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'Current market prices: Tomatoes ₹150-180/kg, expected to rise 15% next week. Green beans at optimal selling price. AI analysis suggests good time to sell leafy vegetables.';
    }
    if (lowerMessage.includes('plant') || lowerMessage.includes('crop') || lowerMessage.includes('grow')) {
      return 'Based on current weather patterns, I recommend planting tomatoes, eggplants, and beetroot. Next 2 weeks have optimal conditions. Don\'t forget to apply organic fertilizer!';
    }
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      return 'Weather forecast: Light rain expected 2-3 days next week. Best farming hours: early morning. Avoid field work after 4 PM due to expected rainfall.';
    }
    if (lowerMessage.includes('tip') || lowerMessage.includes('advice')) {
      return 'Here are key farming tips: 1) Test soil pH regularly, 2) Use organic fertilizers, 3) Implement drip irrigation, 4) Monitor pest activity daily, 5) Follow crop rotation principles.';
    }
    
    return 'Thank you for your question! As your AgroLink AI assistant, I can help with farming advice, crop recommendations, market prices, and weather insights. What specific information do you need?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, Math.random() * 2000 + 1000);
  };

  const handleQuickSuggestion = (query: string) => {
    setInputMessage(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AgroLink AI Assistant</h1>
          <p className="text-muted-foreground">
            Get intelligent farming advice, market insights, and crop recommendations
          </p>
        </div>

        {/* Quick Suggestions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Quick suggestions:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start h-auto p-3 text-left"
                onClick={() => handleQuickSuggestion(suggestion.query)}
              >
                <div className="flex items-start gap-2">
                  <div className="text-primary mt-0.5">{suggestion.icon}</div>
                  <span className="text-xs">{suggestion.text}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'ai' && (
                      <Bot className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-5 w-5 text-primary-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder={language === 'si' ? 'ඔබගේ ප්‍රශ්නය ටයිප් කරන්න...' : language === 'ta' ? 'உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்...' : 'Type your question...'}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* AI Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Price Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI-powered market analysis for optimal selling times
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-green-600" />
                Crop Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Personalized planting schedules based on location and climate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                Smart Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Expert farming tips tailored to your specific crops and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChat;