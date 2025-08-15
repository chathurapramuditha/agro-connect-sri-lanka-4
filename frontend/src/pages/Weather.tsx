import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CloudRain, 
  Sun, 
  Cloud, 
  CloudSnow, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  MapPin,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  rainfall: number;
  forecast: Array<{
    day: string;
    temperature: { min: number; max: number };
    condition: string;
    rainfall: number;
  }>;
  farmingAdvice: string[];
  alerts: string[];
}

const mockWeatherData: WeatherData = {
  location: "Colombo, Sri Lanka",
  temperature: 28,
  condition: "Partly Cloudy",
  humidity: 78,
  windSpeed: 12,
  pressure: 1013,
  uvIndex: 7,
  visibility: 10,
  rainfall: 0,
  forecast: [
    { day: "Today", temperature: { min: 24, max: 30 }, condition: "Partly Cloudy", rainfall: 0 },
    { day: "Tomorrow", temperature: { min: 23, max: 29 }, condition: "Light Rain", rainfall: 2.5 },
    { day: "Day 3", temperature: { min: 22, max: 28 }, condition: "Rainy", rainfall: 8.2 },
    { day: "Day 4", temperature: { min: 24, max: 31 }, condition: "Sunny", rainfall: 0 },
    { day: "Day 5", temperature: { min: 25, max: 32 }, condition: "Partly Cloudy", rainfall: 1.1 },
  ],
  farmingAdvice: [
    "Ideal conditions for tomato and eggplant planting",
    "Morning hours (6-10 AM) best for field work",
    "Prepare drainage channels before expected rainfall",
    "Apply organic fertilizer during cooler hours"
  ],
  alerts: [
    "Light rain expected in 2 days - plan irrigation accordingly",
    "High UV index - protect crops during midday hours"
  ]
};

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun className="h-8 w-8 text-yellow-500" />;
    case 'rainy':
    case 'light rain':
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    case 'cloudy':
    case 'partly cloudy':
      return <Cloud className="h-8 w-8 text-gray-500" />;
    case 'snow':
      return <CloudSnow className="h-8 w-8 text-blue-300" />;
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />;
  }
};

export default function Weather() {
  const { language } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData);
  const [location, setLocation] = useState('Colombo');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time updates every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updateWeatherData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const updateWeatherData = async () => {
    setLoading(true);
    
    // Simulate API call with slight variations
    setTimeout(() => {
      const updatedData = {
        ...mockWeatherData,
        temperature: mockWeatherData.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(40, Math.min(90, mockWeatherData.humidity + (Math.random() - 0.5) * 10)),
        windSpeed: Math.max(0, mockWeatherData.windSpeed + (Math.random() - 0.5) * 4),
        pressure: mockWeatherData.pressure + (Math.random() - 0.5) * 20,
      };
      
      setWeatherData(updatedData);
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const handleLocationChange = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeatherData();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-blue-950/20 dark:via-green-950/20 dark:to-yellow-950/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {language === 'si' ? 'කාලගුණ තත්ත්වය' : language === 'ta' ? 'வானிலை நிலவரம்' : 'Weather Updates'}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {language === 'si' ? 'ගොවිතැන් සඳහා නිරවද්‍ය කාලගුණ තොරතුරු' : 
             language === 'ta' ? 'விவசாயத்திற்கான துல்லியமான வானிலை தகவல்' : 
             'Accurate weather information for farming'}
          </p>
          
          {/* Location Search */}
          <form onSubmit={handleLocationChange} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder={language === 'si' ? 'ස්ථානය' : language === 'ta' ? 'இடம்' : 'Location'}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            </Button>
          </form>
        </div>

        {/* Current Weather */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-xl">{weatherData.location}</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Last updated: {formatTime(lastUpdated)}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={updateWeatherData}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Temperature */}
              <div className="text-center space-y-2">
                {getWeatherIcon(weatherData.condition)}
                <div className="text-3xl font-bold">{Math.round(weatherData.temperature)}°C</div>
                <div className="text-sm text-muted-foreground">{weatherData.condition}</div>
              </div>

              {/* Weather Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <span className="font-semibold">{weatherData.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Wind Speed</span>
                  </div>
                  <span className="font-semibold">{weatherData.windSpeed} km/h</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Pressure</span>
                  </div>
                  <span className="font-semibold">{weatherData.pressure} hPa</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <span className="font-semibold">{weatherData.visibility} km</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">UV Index</span>
                  </div>
                  <Badge variant={weatherData.uvIndex > 6 ? "destructive" : "secondary"}>
                    {weatherData.uvIndex}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Rainfall</span>
                  </div>
                  <span className="font-semibold">{weatherData.rainfall} mm</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>5-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="font-semibold mb-2">{day.day}</div>
                  <div className="mb-2">{getWeatherIcon(day.condition)}</div>
                  <div className="text-sm text-muted-foreground mb-1">{day.condition}</div>
                  <div className="font-semibold">
                    {day.temperature.max}° / {day.temperature.min}°
                  </div>
                  {day.rainfall > 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      Rain: {day.rainfall}mm
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {weatherData.alerts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <AlertTriangle className="h-5 w-5" />
                Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weatherData.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">{alert}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Farming Advice */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'si' ? 'ගොවිතැන් උපදෙස්' : 
               language === 'ta' ? 'விவசாய ஆலோசனை' : 
               'Farming Advice'}
            </CardTitle>
            <CardDescription>
              {language === 'si' ? 'වර්තමාන කාලගුණ තත්ත්වය අනුව' : 
               language === 'ta' ? 'தற்போதைய வானிலை நிலவரத்தின் அடிப்படையில்' : 
               'Based on current weather conditions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weatherData.farmingAdvice.map((advice, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800 dark:text-green-200">{advice}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}