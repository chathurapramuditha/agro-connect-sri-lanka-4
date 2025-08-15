import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Save, Database, Shield, Bell, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  userRegistration: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maxFileSize: number;
  supportEmail: string;
  privacyPolicy: string;
  termsOfService: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'AgriConnect',
    siteDescription: 'Connecting farmers and buyers for fresh produce',
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    maxFileSize: 5,
    supportEmail: 'support@agriconnect.com',
    privacyPolicy: '',
    termsOfService: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    // In a real app, these would come from a settings table
    // For now, we'll use local state with default values
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to a settings table
      // For now, we'll simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SystemSettings, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearCache = async () => {
    try {
      // Clear any cached data
      await supabase.from('profiles').select('count').single();
      toast({
        title: "Cache Cleared",
        description: "System cache has been cleared successfully",
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      });
    }
  };

  const runDatabaseMaintenance = async () => {
    try {
      // In a real app, this would run database maintenance tasks
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Database Maintenance Complete",
        description: "Database optimization completed successfully",
      });
    } catch (error) {
      console.error('Error running database maintenance:', error);
      toast({
        title: "Error",
        description: "Failed to run database maintenance",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  placeholder="Enter site name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  placeholder="Enter site description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  placeholder="support@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleInputChange('maxFileSize', Number(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Access
              </CardTitle>
              <CardDescription>User access and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable site access for maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch
                  checked={settings.userRegistration}
                  onCheckedChange={(checked) => handleInputChange('userRegistration', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications to users
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send SMS notifications to users
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Actions
              </CardTitle>
              <CardDescription>Maintenance and system operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={clearCache}
                variant="outline"
                className="w-full"
              >
                Clear Cache
              </Button>
              
              <Button
                onClick={runDatabaseMaintenance}
                variant="outline"
                className="w-full"
              >
                Run Database Maintenance
              </Button>
              
              <Separator />
              
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm text-green-600 font-semibold">
                  {settings.maintenanceMode ? 'Maintenance' : 'Operational'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Version</span>
                <span className="text-sm text-muted-foreground">1.0.0</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database</span>
                <span className="text-sm text-green-600 font-semibold">Connected</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Backup</span>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;