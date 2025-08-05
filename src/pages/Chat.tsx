import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Search, Phone, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import UserSearchDropdown from '@/components/UserSearchDropdown';

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  isOwn: boolean;
  senderName: string;
}

interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message?: string;
  updated_at: string;
  participantName: string;
  participantType: 'farmer' | 'buyer';
  unreadCount: number;
  avatar?: string;
}

const Chat = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { playNotificationSound } = useNotificationSound();
  
  // Get farmer info from navigation state
  const farmerData = location.state;
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
      } else {
        toast({
          title: "Authentication Required",
          description: "Please log in to access messages",
          variant: "destructive",
        });
      }
      setLoading(false);
    };
    getUser();
  }, []);

  // Load conversations
  useEffect(() => {
    if (!currentUser) return;
    loadConversations();
  }, [currentUser]);

  // Handle farmer data from marketplace
  useEffect(() => {
    if (farmerData && currentUser) {
      const createOrFindConversation = async () => {
        let farmerId = farmerData.farmerId;
        
        // If we have a productId but no farmerId, get it from the product
        if (!farmerId && farmerData.productId) {
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('farmer_id')
            .eq('id', farmerData.productId)
            .single();

          if (productError || !product) {
            console.error('Error finding product:', productError);
            return;
          }
          
          // Get farmer's user_id from profile
          const { data: farmerProfile, error: farmerProfileError } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('id', product.farmer_id)
            .single();

          if (farmerProfileError || !farmerProfile) {
            console.error('Error finding farmer profile:', farmerProfileError);
            return;
          }
          farmerId = farmerProfile.user_id;
        }
        
        // Check if conversation already exists using user_id
        const { data: existingConv, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .or(`and(participant_1_id.eq.${currentUser.id},participant_2_id.eq.${farmerId}),and(participant_1_id.eq.${farmerId},participant_2_id.eq.${currentUser.id})`)
          .single();

        let conversationId;

        if (existingConv) {
          conversationId = existingConv.id;
        } else {
          // Create new conversation using user_id
          const { data: newConv, error: newConvError } = await supabase
            .from('conversations')
            .insert({
              participant_1_id: currentUser.id,
              participant_2_id: farmerId
            })
            .select()
            .single();

          if (newConvError) {
            console.error('Error creating conversation:', newConvError);
            return;
          }
          conversationId = newConv.id;
        }

        // Send initial message using user_id
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            sender_id: currentUser.id,
            receiver_id: farmerId,
            content: `Hi! I'm interested in your ${farmerData.productName}. Can you provide more details?`
          });

        if (messageError) {
          console.error('Error sending message:', messageError);
        }

        // Select the conversation
        setSelectedConversation(conversationId);

        toast({
          title: "Chat Started",
          description: `Started conversation with ${farmerData.farmerName}`,
        });
      };

      createOrFindConversation();
    }
  }, [farmerData, currentUser]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation || !currentUser) return;

    const loadMessages = async () => {
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) return;

      const otherParticipantId = conversation.participant_1_id === currentUser.id ? 
        conversation.participant_2_id : conversation.participant_1_id;

      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherParticipantId}),and(receiver_id.eq.${currentUser.id},sender_id.eq.${otherParticipantId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      const formattedMessages: ChatMessage[] = messages.map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        content: msg.content,
        created_at: msg.created_at,
        is_read: msg.is_read,
        isOwn: msg.sender_id === currentUser.id,
        senderName: msg.sender_id === currentUser.id ? 'You' : conversation.participantName
      }));

      setMessages(formattedMessages);
    };

    loadMessages();
  }, [selectedConversation, currentUser, conversations]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('New message received:', payload.new);
          
          // Play notification sound for incoming messages
          playNotificationSound();
          
          // Show notification
          toast({
            title: "New Message",
            description: "You have received a new message",
            duration: 3000,
          });
          
          // Add the new message to the current conversation if it matches
          if (selectedConversation) {
            const conv = conversations.find(c => c.id === selectedConversation);
            if (conv && (payload.new.sender_id === (conv.participant_1_id === currentUser.id ? conv.participant_2_id : conv.participant_1_id))) {
              setMessages(prev => [...prev, {
                id: payload.new.id,
                sender_id: payload.new.sender_id,
                receiver_id: payload.new.receiver_id,
                content: payload.new.content,
                created_at: payload.new.created_at,
                is_read: payload.new.is_read,
                isOwn: false,
                senderName: conv.participantName
              }]);
            }
          }
          
          // Refresh conversations to update last message and unread count
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, selectedConversation, conversations, playNotificationSound, toast]);

  // Add a function to load conversations that can be called from the useEffect
  const loadConversations = async () => {
    if (!currentUser) return;

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_1_id.eq.${currentUser.id},participant_2_id.eq.${currentUser.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
      return;
    }

    const formattedConversations: Conversation[] = [];
    
    for (const conv of conversations) {
      const isParticipant1 = conv.participant_1_id === currentUser.id;
      const otherParticipantId = isParticipant1 ? conv.participant_2_id : conv.participant_1_id;
      
      // Get other participant's profile using user_id
      const { data: otherProfile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, user_type, avatar_url')
        .eq('user_id', otherParticipantId)
        .single();

      if (profileError || !otherProfile) {
        console.error('Error loading participant profile:', profileError);
        continue;
      }

      formattedConversations.push({
        id: conv.id,
        participant_1_id: conv.participant_1_id,
        participant_2_id: conv.participant_2_id,
        last_message: 'No messages yet',
        updated_at: conv.updated_at,
        participantName: otherProfile.full_name,
        participantType: otherProfile.user_type as 'farmer' | 'buyer',
        unreadCount: 0,
        avatar: otherProfile.avatar_url
      });
    }

    setConversations(formattedConversations);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const receiverId = conversation.participant_1_id === currentUser.id ? 
      conversation.participant_2_id : conversation.participant_1_id;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        receiver_id: receiverId,
        content: newMessage
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return;
    }

    // Add message to local state
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: newMessage,
      created_at: new Date().toISOString(),
      is_read: false,
      isOwn: true,
      senderName: 'You'
    }]);

    setNewMessage('');

    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    });
  };

  const createConversationWithUser = async (user: any) => {
    if (!currentUser) return;

    // Check if conversation already exists using user_id directly
    const { data: existingConv, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant_1_id.eq.${currentUser.id},participant_2_id.eq.${user.user_id}),and(participant_1_id.eq.${user.user_id},participant_2_id.eq.${currentUser.id})`)
      .single();

    let conversationId;

    if (existingConv) {
      conversationId = existingConv.id;
    } else {
      // Create new conversation using user_id directly
      const { data: newConv, error: newConvError } = await supabase
        .from('conversations')
        .insert({
          participant_1_id: currentUser.id,
          participant_2_id: user.user_id
        })
        .select()
        .single();

      if (newConvError) {
        console.error('Error creating conversation:', newConvError);
        toast({
          title: "Error",
          description: "Failed to create conversation",
          variant: "destructive",
        });
        return;
      }
      conversationId = newConv.id;
    }

    // Reload conversations to show the new one
    await loadConversations();
    
    // Select the conversation
    setSelectedConversation(conversationId);

    toast({
      title: "Chat Started",
      description: `Started conversation with ${user.full_name}`,
    });
  };

  const selectedConversationData = conversations.find(conv => conv.id === selectedConversation);
  const filteredConversations = conversations.filter(conv => 
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please log in to access messages</p>
        </div>
      </div>
    );
  }

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
            <UserSearchDropdown
              onUserSelect={(user) => {
                // Create or find conversation with selected user
                setSearchTerm('');
                createConversationWithUser(user);
              }}
              showChatButton={false}
              placeholder="Search users to start a chat..."
            />
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer border-b hover:bg-muted/50 ${
                    selectedConversation === conversation.id ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.participantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.participantName}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={conversation.participantType === 'farmer' ? 'default' : 'secondary'} className="text-xs">
                            {conversation.participantType}
                          </Badge>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.last_message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(conversation.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2">
          {selectedConversationData ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversationData.avatar} />
                      <AvatarFallback>{selectedConversationData.participantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedConversationData.participantName}</CardTitle>
                      <CardDescription>
                        {selectedConversationData.participantType === 'farmer' ? 'Farmer' : 'Buyer'} • Online
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (farmerData && selectedConversation === `farmer-${farmerData.productId}`) {
                          toast({
                            title: "Farmer Contact",
                            description: `${farmerData.farmerName}: ${farmerData.farmerPhone}`,
                            duration: 5000,
                          });
                        } else {
                          toast({
                            title: "Contact",
                            description: "Contact feature available for marketplace connections",
                          });
                        }
                      }}
                    >
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
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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