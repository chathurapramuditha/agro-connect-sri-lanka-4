import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Sprout, Droplets, Sun, Cloud, Thermometer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CropActivity {
  id: string;
  crop: string;
  activity: string;
  month: number;
  day: number;
  description: string;
  type: 'planting' | 'watering' | 'fertilizing' | 'harvesting' | 'maintenance';
  priority: 'low' | 'medium' | 'high';
}

interface CropInfo {
  name: string;
  plantingMonths: number[];
  harvestMonths: number[];
  wateringFrequency: string;
  soilType: string;
  temperature: string;
  description: string;
}

const CropCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRegion, setSelectedRegion] = useState<string>('western');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const { language } = useLanguage();

  const regions = [
    { value: 'western', label: 'Western Province' },
    { value: 'central', label: 'Central Province' },
    { value: 'southern', label: 'Southern Province' },
    { value: 'northern', label: 'Northern Province' },
    { value: 'eastern', label: 'Eastern Province' },
    { value: 'northwestern', label: 'Northwestern Province' },
    { value: 'northcentral', label: 'North Central Province' },
    { value: 'uva', label: 'Uva Province' },
    { value: 'sabaragamuwa', label: 'Sabaragamuwa Province' }
  ];

  const crops = [
    { value: 'all', label: 'All Crops' },
    { value: 'rice', label: 'Rice' },
    { value: 'tomato', label: 'Tomato' },
    { value: 'carrot', label: 'Carrot' },
    { value: 'cabbage', label: 'Cabbage' },
    { value: 'beans', label: 'Beans' },
    { value: 'corn', label: 'Corn' },
    { value: 'potato', label: 'Potato' },
    { value: 'onion', label: 'Onion' }
  ];

  const cropInfo: Record<string, CropInfo> = {
    rice: {
      name: 'Rice',
      plantingMonths: [4, 5, 10, 11],
      harvestMonths: [8, 9, 2, 3],
      wateringFrequency: 'Keep flooded',
      soilType: 'Clay loam',
      temperature: '20-35°C',
      description: 'Main staple crop, two seasons per year'
    },
    tomato: {
      name: 'Tomato',
      plantingMonths: [3, 4, 9, 10],
      harvestMonths: [6, 7, 12, 1],
      wateringFrequency: 'Daily',
      soilType: 'Well-drained loam',
      temperature: '18-27°C',
      description: 'High demand vegetable, good market value'
    },
    carrot: {
      name: 'Carrot',
      plantingMonths: [5, 6, 11, 12],
      harvestMonths: [8, 9, 2, 3],
      wateringFrequency: 'Every 2-3 days',
      soilType: 'Sandy loam',
      temperature: '15-25°C',
      description: 'Cool season crop, grows well in higher altitudes'
    },
    cabbage: {
      name: 'Cabbage',
      plantingMonths: [4, 5, 10, 11],
      harvestMonths: [7, 8, 1, 2],
      wateringFrequency: 'Daily',
      soilType: 'Rich loam',
      temperature: '15-25°C',
      description: 'Cool season vegetable, good storage life'
    },
    beans: {
      name: 'Beans',
      plantingMonths: [3, 4, 9, 10],
      harvestMonths: [6, 7, 12, 1],
      wateringFrequency: 'Every 2 days',
      soilType: 'Well-drained',
      temperature: '18-30°C',
      description: 'Fast growing, good protein source'
    },
    corn: {
      name: 'Corn',
      plantingMonths: [4, 5, 10, 11],
      harvestMonths: [8, 9, 2, 3],
      wateringFrequency: 'Every 3 days',
      soilType: 'Fertile loam',
      temperature: '20-30°C',
      description: 'Warm season crop, good for animal feed'
    },
    potato: {
      name: 'Potato',
      plantingMonths: [5, 6, 11, 12],
      harvestMonths: [8, 9, 2, 3],
      wateringFrequency: 'Every 2-3 days',
      soilType: 'Well-drained loam',
      temperature: '15-25°C',
      description: 'Cool season crop, high altitudes preferred'
    },
    onion: {
      name: 'Onion',
      plantingMonths: [4, 5, 10, 11],
      harvestMonths: [8, 9, 2, 3],
      wateringFrequency: 'Every 2 days',
      soilType: 'Well-drained sandy loam',
      temperature: '15-25°C',
      description: 'Long storage life, good market demand'
    }
  };

  const activities: CropActivity[] = [
    {
      id: '1',
      crop: 'rice',
      activity: 'Land Preparation',
      month: 4,
      day: 1,
      description: 'Prepare paddy fields for Yala season',
      type: 'planting',
      priority: 'high'
    },
    {
      id: '2',
      crop: 'tomato',
      activity: 'Seedling Transplant',
      month: 4,
      day: 15,
      description: 'Transplant tomato seedlings',
      type: 'planting',
      priority: 'high'
    },
    {
      id: '3',
      crop: 'carrot',
      activity: 'Direct Seeding',
      month: 5,
      day: 1,
      description: 'Direct sow carrot seeds',
      type: 'planting',
      priority: 'medium'
    },
    {
      id: '4',
      crop: 'rice',
      activity: 'Fertilizer Application',
      month: 5,
      day: 15,
      description: 'Apply first fertilizer dose',
      type: 'fertilizing',
      priority: 'high'
    },
    {
      id: '5',
      crop: 'cabbage',
      activity: 'Pest Control',
      month: 6,
      day: 1,
      description: 'Monitor and control cabbage pests',
      type: 'maintenance',
      priority: 'medium'
    },
    {
      id: '6',
      crop: 'tomato',
      activity: 'Harvest',
      month: 7,
      day: 1,
      description: 'Begin tomato harvest',
      type: 'harvesting',
      priority: 'high'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'planting':
        return <Sprout className="h-4 w-4 text-green-600" />;
      case 'watering':
        return <Droplets className="h-4 w-4 text-blue-600" />;
      case 'fertilizing':
        return <Sun className="h-4 w-4 text-yellow-600" />;
      case 'harvesting':
        return <CalendarDays className="h-4 w-4 text-orange-600" />;
      case 'maintenance':
        return <Cloud className="h-4 w-4 text-purple-600" />;
      default:
        return <Sprout className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivitiesForDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return activities.filter(activity => {
      const matchesDate = activity.month === month && Math.abs(activity.day - day) <= 3;
      const matchesCrop = selectedCrop === 'all' || activity.crop === selectedCrop;
      return matchesDate && matchesCrop;
    });
  };

  const getCurrentSeasonActivities = () => {
    const currentMonth = new Date().getMonth() + 1;
    return activities.filter(activity => {
      const matchesMonth = Math.abs(activity.month - currentMonth) <= 1;
      const matchesCrop = selectedCrop === 'all' || activity.crop === selectedCrop;
      return matchesMonth && matchesCrop;
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crop Calendar</h1>
        <p className="text-muted-foreground">
          Plan your farming activities with our comprehensive crop calendar
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Region</label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Crop</label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger>
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop.value} value={crop.value}>
                  {crop.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="crops">Crop Information</TabsTrigger>
          <TabsTrigger value="activities">Current Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Activities for {selectedDate?.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDate && getActivitiesForDate(selectedDate).length > 0 ? (
                    getActivitiesForDate(selectedDate).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{activity.activity}</h4>
                            <Badge className={getPriorityColor(activity.priority)}>
                              {activity.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Crop: {cropInfo[activity.crop]?.name || activity.crop}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No activities scheduled for this date
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crops" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(cropInfo).map(([key, crop]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                    {crop.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {crop.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        Plant: {crop.plantingMonths.map(m => 
                          new Date(0, m - 1).toLocaleDateString('en', { month: 'short' })
                        ).join(', ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">
                        Harvest: {crop.harvestMonths.map(m => 
                          new Date(0, m - 1).toLocaleDateString('en', { month: 'short' })
                        ).join(', ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Water: {crop.wateringFrequency}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Temp: {crop.temperature}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Month Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCurrentSeasonActivities().map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-4 rounded-lg border">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{activity.activity}</h4>
                        <Badge className={getPriorityColor(activity.priority)}>
                          {activity.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Crop: {cropInfo[activity.crop]?.name || activity.crop}</span>
                        <span>Date: {new Date(0, activity.month - 1, activity.day).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {getCurrentSeasonActivities().length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No activities scheduled for this period
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CropCalendar;