import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Search, Phone, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

interface Chat {
  id: string;
  participantName: string;
  participantType: 'farmer' | 'buyer';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
}

const Chat = () => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      participantName: 'John Farmer',
      participantType: 'farmer',
      lastMessage: 'I have fresh tomatoes available',
      timestamp: '2 min ago',
      unreadCount: 2,
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      participantName: 'Sarah Buyer',
      participantType: 'buyer',
      lastMessage: 'When can you deliver the carrots?',
      timestamp: '1 hour ago',
      unreadCount: 0,
      avatar: '/placeholder.svg'
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'John Farmer',
      message: 'Hello! I have fresh organic tomatoes available for sale. Would you be interested?',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: '2',
      senderId: 'current-user',
      senderName: 'You',
      message: 'Yes, I\'m interested. What\'s the price per kg?',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John Farmer',
      message: 'Rs. 120 per kg. They are freshly harvested this morning. I can deliver today if you need.',
      timestamp: '10:35 AM',
      isOwn: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { toast } = useToast();

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update last message in chat list
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat 
        ? { ...chat, lastMessage: newMessage, timestamp: 'now' }
        : chat
    ));

    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    });
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const filteredChats = chats.filter(chat => 
    chat.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Chat with farmers and buyers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 cursor-pointer border-b hover:bg-muted/50 ${
                    selectedChat === chat.id ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.participantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{chat.participantName}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={chat.participantType === 'farmer' ? 'default' : 'secondary'} className="text-xs">
                            {chat.participantType}
                          </Badge>
                          {chat.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2">
          {selectedChatData ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedChatData.avatar} />
                      <AvatarFallback>{selectedChatData.participantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedChatData.participantName}</CardTitle>
                      <CardDescription>
                        {selectedChatData.participantType === 'farmer' ? 'Farmer' : 'Buyer'} • Online
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[70%]">
                        {!message.isOwn && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {message.senderName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`p-3 rounded-lg ${
                            message.isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;