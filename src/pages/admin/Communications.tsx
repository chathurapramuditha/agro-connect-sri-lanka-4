import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageSquare, Send, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Communications = () => {
  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: '',
    message: ''
  });
  
  const [smsData, setSmsData] = useState({
    recipient: '',
    message: ''
  });

  const { toast } = useToast();

  const handleSendEmail = async () => {
    if (!emailData.recipient || !emailData.subject || !emailData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // This would integrate with an email service in a real implementation
    toast({
      title: "Email Sent",
      description: `Email sent to ${emailData.recipient}`,
    });

    setEmailData({ recipient: '', subject: '', message: '' });
  };

  const handleSendSMS = async () => {
    if (!smsData.recipient || !smsData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // This would integrate with an SMS service in a real implementation
    toast({
      title: "SMS Sent",
      description: `SMS sent to ${smsData.recipient}`,
    });

    setSmsData({ recipient: '', message: '' });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Mail className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-muted-foreground">Send emails and SMS to users</p>
        </div>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS
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
                <Label htmlFor="email-recipient">Recipient</Label>
                <Select
                  value={emailData.recipient}
                  onValueChange={(value) => setEmailData({ ...emailData, recipient: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="farmers">All Farmers</SelectItem>
                    <SelectItem value="buyers">All Buyers</SelectItem>
                    <SelectItem value="custom">Custom Email</SelectItem>
                  </SelectContent>
                </Select>
                {emailData.recipient === 'custom' && (
                  <Input
                    placeholder="Enter email address"
                    onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  placeholder="Enter email subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-message">Message</Label>
                <Textarea
                  id="email-message"
                  placeholder="Enter your message"
                  rows={6}
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                />
              </div>

              <Button onClick={handleSendEmail} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Email
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
                <Label htmlFor="sms-recipient">Recipient</Label>
                <Select
                  value={smsData.recipient}
                  onValueChange={(value) => setSmsData({ ...smsData, recipient: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="farmers">All Farmers</SelectItem>
                    <SelectItem value="buyers">All Buyers</SelectItem>
                    <SelectItem value="custom">Custom Phone Number</SelectItem>
                  </SelectContent>
                </Select>
                {smsData.recipient === 'custom' && (
                  <Input
                    placeholder="Enter phone number"
                    onChange={(e) => setSmsData({ ...smsData, recipient: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-message">Message</Label>
                <Textarea
                  id="sms-message"
                  placeholder="Enter your SMS message (max 160 characters)"
                  rows={4}
                  maxLength={160}
                  value={smsData.message}
                  onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  {smsData.message.length}/160 characters
                </p>
              </div>

              <Button onClick={handleSendSMS} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send SMS
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communications;