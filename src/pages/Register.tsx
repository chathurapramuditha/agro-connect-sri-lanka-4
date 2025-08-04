import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const Register = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get('type') || 'farmer';
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    district: '',
    description: '',
    farmSize: '',
    businessType: '',
    agreeTerms: false,
  });

  const sriLankanDistricts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const { data, error } = await supabase.rpc('admin_exists');
        if (error) throw error;
        setAdminExists(data);
      } catch (error) {
        console.error('Error checking admin existence:', error);
        setAdminExists(true); // Default to blocking admin registration on error
      }
    };
    
    checkAdminExists();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, userType: 'farmer' | 'buyer' | 'admin') => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            user_type: userType,
            phone_number: formData.phone,
            location: `${formData.location}${formData.district ? ', ' + formData.district : ''}`,
            bio: formData.description,
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // If signup successful, immediately sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        toast.error('Registration successful but login failed: ' + signInError.message);
        navigate('/login');
        return;
      }

      if (signInData.user) {
        toast.success(`Welcome to AgroLink! Registration successful as ${userType}.`);
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <span className="text-2xl font-bold text-primary-foreground">A</span>
          </div>
          <h1 className="text-2xl font-bold">Join AgroLink Sri Lanka</h1>
          <p className="text-muted-foreground">Create your account and start connecting</p>
        </div>

        <Tabs defaultValue={adminExists ? 'farmer' : defaultTab} className="w-full">
          <TabsList className={`grid w-full ${adminExists ? 'grid-cols-2' : 'grid-cols-3'}`}>
            <TabsTrigger value="farmer" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('auth.farmer')}
            </TabsTrigger>
            <TabsTrigger value="buyer" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              {t('auth.buyer')}
            </TabsTrigger>
            {!adminExists && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="farmer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Register as Farmer
                </CardTitle>
                <CardDescription>
                  Join our platform to sell your produce directly to buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'farmer')} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="farmer-name">{t('auth.name')} *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="farmer-name"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="farmer-phone">{t('auth.phone')} *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="farmer-phone"
                          name="phone"
                          type="tel"
                          placeholder="+94 XX XXX XXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmer-email">{t('auth.email')} *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="farmer-email"
                        name="email"
                        type="email"
                        placeholder="farmer@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="farmer-district">District *</Label>
                      <Select onValueChange={(value) => handleSelectChange('district', value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your district" />
                        </SelectTrigger>
                        <SelectContent>
                          {sriLankanDistricts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="farmer-location">Village/Town *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="farmer-location"
                          name="location"
                          placeholder="Your village or town"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmer-size">Farm Size (acres)</Label>
                    <Input
                      id="farmer-size"
                      name="farmSize"
                      type="number"
                      placeholder="e.g., 2.5"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmer-description">Tell us about your farm</Label>
                    <Textarea
                      id="farmer-description"
                      name="description"
                      placeholder="What crops do you grow? What makes your farm special?"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="farmer-password">{t('auth.password')} *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="farmer-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="farmer-confirm-password">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="farmer-confirm-password"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="farmer-terms" 
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleSelectChange('agreeTerms', checked.toString())}
                      required 
                    />
                    <Label htmlFor="farmer-terms" className="text-sm">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                    {loading ? 'Creating Account...' : 'Create Farmer Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buyer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Register as Buyer
                </CardTitle>
                <CardDescription>
                  Join to buy fresh produce directly from farmers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'buyer')} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-name">{t('auth.name')} *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="buyer-name"
                          name="name"
                          placeholder="Your full name or business name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buyer-phone">{t('auth.phone')} *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="buyer-phone"
                          name="phone"
                          type="tel"
                          placeholder="+94 XX XXX XXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyer-email">{t('auth.email')} *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="buyer-email"
                        name="email"
                        type="email"
                        placeholder="buyer@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-district">District *</Label>
                      <Select onValueChange={(value) => handleSelectChange('district', value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your district" />
                        </SelectTrigger>
                        <SelectContent>
                          {sriLankanDistricts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buyer-business">Business Type</Label>
                      <Select onValueChange={(value) => handleSelectChange('businessType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual Consumer</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="retailer">Retailer</SelectItem>
                          <SelectItem value="wholesaler">Wholesaler</SelectItem>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyer-description">About your business (optional)</Label>
                    <Textarea
                      id="buyer-description"
                      name="description"
                      placeholder="Tell us about your business and what types of produce you're looking for"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-password">{t('auth.password')} *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="buyer-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buyer-confirm-password">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="buyer-confirm-password"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="buyer-terms" 
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleSelectChange('agreeTerms', checked.toString())}
                      required 
                    />
                    <Label htmlFor="buyer-terms" className="text-sm">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                    {loading ? 'Creating Account...' : 'Create Buyer Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-600" />
                  Register as Admin
                </CardTitle>
                <CardDescription>
                  Create the system administrator account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'admin')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="admin-name"
                        name="name"
                        placeholder="System Administrator"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="admin-email"
                        name="email"
                        type="email"
                        placeholder="admin@agrolink.lk"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="admin-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="admin123"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-confirm-password">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="admin-confirm-password"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin-terms" 
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleSelectChange('agreeTerms', checked.toString())}
                      required 
                    />
                    <Label htmlFor="admin-terms" className="text-sm">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Create Admin Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              {t('nav.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;