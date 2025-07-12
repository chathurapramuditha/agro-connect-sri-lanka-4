import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2, MessageSquare, ShoppingCart, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'message' | 'order' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  urgent: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New Message from John Farmer',
      description: 'Hello, I have fresh tomatoes available for sale. Would you be interested?',
      timestamp: '2 minutes ago',
      read: false,
      urgent: false
    },
    {
      id: '2',
      type: 'order',
      title: 'Order Confirmed',
      description: 'Your order for 5kg carrots has been confirmed and will be delivered tomorrow.',
      timestamp: '1 hour ago',
      read: false,
      urgent: true
    },
    {
      id: '3',
      type: 'system',
      title: 'System Maintenance',
      description: 'The platform will undergo maintenance on Sunday from 2 AM to 4 AM.',
      timestamp: '3 hours ago',
      read: true,
      urgent: false
    }
  ]);

  const { toast } = useToast();

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read.",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted",
      description: "Notification has been removed.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageSquare;
      case 'order':
        return ShoppingCart;
      case 'system':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Bell className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <Card 
                key={notification.id} 
                className={`${!notification.read ? 'border-primary bg-primary/5' : ''} ${notification.urgent ? 'border-orange-500' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-full ${notification.urgent ? 'bg-orange-100 text-orange-600' : 'bg-primary/10 text-primary'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {!notification.read && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                          {notification.urgent && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">{notification.description}</p>
                        <p className="text-sm text-muted-foreground">{notification.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;