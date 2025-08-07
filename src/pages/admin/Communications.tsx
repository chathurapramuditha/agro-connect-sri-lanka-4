import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, MessageSquare, Send, Users, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const Communications = () => {
  const { t } = useLanguage();
  const [emailData, setEmailData] = useState({
    recipientType: '',
    customEmail: '',
    subject: '',
    message: ''
  });
  
  const [smsData, setSmsData] = useState({
    recipientType: '',
    customPhone: '',
    message: '',
    countryCode: '+94'
  });

  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  const fetchUserProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserProfiles(data || []);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      toast({
        title: t('common.error'),
        description: "Failed to fetch user phone numbers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    const recipient = emailData.recipientType === 'custom' ? emailData.customEmail : emailData.recipientType;
    
    if (!recipient || !emailData.subject || !emailData.message) {
      toast({
        title: t('common.error'),
        description: t('admin.fillfields'),
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          recipientType: emailData.recipientType,
          customEmail: emailData.customEmail,
          subject: emailData.subject,
          message: emailData.message
        }
      });

      if (error) throw error;

      toast({
        title: t('admin.emailsent'),
        description: `Email sent to ${recipient}`,
      });

      setEmailData({ recipientType: '', customEmail: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: t('common.error'),
        description: t('admin.emailfailed'),
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendSMS = async () => {
    const recipient = smsData.recipientType === 'custom' ? 
      `${smsData.countryCode}${smsData.customPhone}` : smsData.recipientType;
    
    if (!smsData.recipientType || !smsData.message) {
      toast({
        title: t('common.error'),
        description: t('admin.fillfields'),
        variant: "destructive",
      });
      return;
    }

    if (smsData.recipientType === 'custom' && !smsData.customPhone) {
      toast({
        title: t('common.error'),
        description: t('admin.enterphone'),
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          recipientType: smsData.recipientType,
          customPhone: smsData.recipientType === 'custom' ? 
            `${smsData.countryCode}${smsData.customPhone}` : null,
          message: smsData.message
        }
      });

      if (error) throw error;

      toast({
        title: t('admin.smssent'),
        description: `SMS sent to ${recipient}`,
      });

      setSmsData({ recipientType: '', customPhone: '', message: '', countryCode: '+94' });
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: t('common.error'),
        description: t('admin.smsfailed'),
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Mail className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t('admin.communications')}</h1>
          <p className="text-muted-foreground">Send emails and SMS to users</p>
        </div>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t('admin.sendemail')}
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('admin.sendsms')}
          </TabsTrigger>
          <TabsTrigger value="phonebook" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('admin.phonenumbers')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Send Email</CardTitle>
              <CardDescription>
                Send emails to individual users or groups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-recipient">{t('admin.recipient')}</Label>
                <Select
                  value={emailData.recipientType}
                  onValueChange={(value) => setEmailData({ ...emailData, recipientType: value, customEmail: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectrecipient')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.allusers')}</SelectItem>
                    <SelectItem value="farmers">{t('admin.allfarmers')}</SelectItem>
                    <SelectItem value="buyers">{t('admin.allbuyers')}</SelectItem>
                    <SelectItem value="custom">{t('admin.customEmail')}</SelectItem>
                  </SelectContent>
                </Select>
                {emailData.recipientType === 'custom' && (
                  <Input
                    placeholder={t('admin.enteremail')}
                    type="email"
                    value={emailData.customEmail}
                    onChange={(e) => setEmailData({ ...emailData, customEmail: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-subject">{t('admin.subject')}</Label>
                <Input
                  id="email-subject"
                  placeholder={t('admin.entersubject')}
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-message">{t('admin.message')}</Label>
                <Textarea
                  id="email-message"
                  placeholder={t('admin.entermessage')}
                  rows={6}
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                />
              </div>

              <Button onClick={handleSendEmail} className="w-full" disabled={sending}>
                <Send className="h-4 w-4 mr-2" />
                {sending ? t('admin.sendingemail') : t('admin.sendemail')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>Send SMS</CardTitle>
              <CardDescription>
                Send SMS messages to individual users or groups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sms-recipient">{t('admin.recipient')}</Label>
                <Select
                  value={smsData.recipientType}
                  onValueChange={(value) => setSmsData({ ...smsData, recipientType: value, customPhone: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectrecipient')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.allusers')}</SelectItem>
                    <SelectItem value="farmers">{t('admin.allfarmers')}</SelectItem>
                    <SelectItem value="buyers">{t('admin.allbuyers')}</SelectItem>
                    <SelectItem value="custom">{t('admin.customPhone')}</SelectItem>
                  </SelectContent>
                </Select>
                {smsData.recipientType === 'custom' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select value={smsData.countryCode} onValueChange={(value) => setSmsData({ ...smsData, countryCode: value })}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+94">🇱🇰 +94</SelectItem>
                          <SelectItem value="+1">🇺🇸 +1</SelectItem>
                          <SelectItem value="+44">🇬🇧 +44</SelectItem>
                          <SelectItem value="+91">🇮🇳 +91</SelectItem>
                          <SelectItem value="+86">🇨🇳 +86</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="tel"
                        placeholder={t('admin.enterphonenumber')}
                        className="flex-1"
                        value={smsData.customPhone}
                        onChange={(e) => setSmsData({ ...smsData, customPhone: e.target.value.replace(/[^0-9]/g, '') })}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-message">{t('admin.message')}</Label>
                <Textarea
                  id="sms-message"
                  placeholder={t('admin.entermessage')}
                  rows={4}
                  maxLength={160}
                  value={smsData.message}
                  onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  {smsData.message.length}/160 {t('admin.maxchars')}
                </p>
              </div>

              <Button onClick={handleSendSMS} className="w-full" disabled={sending}>
                <Send className="h-4 w-4 mr-2" />
                {sending ? t('admin.sendingsms') : t('admin.sendsms')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phonebook">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                User Phone Numbers
              </CardTitle>
              <CardDescription>
                View and manage user phone numbers for SMS communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading phone numbers...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Verified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userProfiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No phone numbers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      userProfiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.full_name}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted capitalize">
                              {profile.user_type}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono">{profile.phone_number || 'Not specified'}</TableCell>
                          <TableCell>{profile.location || 'Not specified'}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              profile.is_verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {profile.is_verified ? 'Verified' : 'Unverified'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
              <div className="mt-4">
                <Button onClick={fetchUserProfiles} variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Refresh Phone Numbers
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communications;