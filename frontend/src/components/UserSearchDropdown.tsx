import React, { useState, useEffect } from 'react';
import { Search, User, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/services/api';

interface UserProfile {
  user_id: string;
  user_type: 'admin' | 'farmer' | 'buyer';
  full_name: string;
  email?: string;
  phone_number?: string;
  location?: string;
  is_active: boolean;
  profile?: {
    avatar_url?: string;
    city?: string;
    state?: string;
    address?: string;
  };
}

interface UserSearchDropdownProps {
  onUserSelect?: (user: UserProfile) => void;
  onChatWithUser?: (user: UserProfile) => void;
  placeholder?: string;
  showChatButton?: boolean;
}

const UserSearchDropdown = ({ 
  onUserSelect, 
  onChatWithUser, 
  placeholder = "Search users...",
  showChatButton = true 
}: UserSearchDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { toast } = useToast();

  // Load all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await apiService.getUsers();
        
        // Enrich users with profile data
        const enrichedUsers = await Promise.all(
          usersData.map(async (user: any) => {
            try {
              const profile = await apiService.getProfile(user.user_id).catch(() => null);
              return {
                ...user,
                profile
              };
            } catch {
              return user;
            }
          })
        );

        setUsers(enrichedUsers as UserProfile[]);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const filtered = users.filter(user =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.profile?.city && user.profile.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.profile?.state && user.profile.state.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredUsers(filtered);
    setShowDropdown(true);
  }, [searchTerm, users]);

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'farmer':
        return 'bg-green-500 hover:bg-green-600';
      case 'buyer':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'Admin';
      case 'farmer':
        return 'Farmer';
      case 'buyer':
        return 'Buyer';
      default:
        return userType;
    }
  };

  const handleUserSelect = (user: UserProfile) => {
    setSearchTerm(user.full_name);
    setShowDropdown(false);
    onUserSelect?.(user);
  };

  const handleChatWithUser = (user: UserProfile, event: React.MouseEvent) => {
    event.stopPropagation();
    onChatWithUser?.(user);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="pl-10"
        />
      </div>

      {showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto bg-background border shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No users found
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map((user) => (
                  <div
                    key={user.user_id}
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profile?.avatar_url} />
                          <AvatarFallback>
                            {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{user.full_name}</p>
                            <Badge 
                              className={`text-white text-xs ${getUserTypeColor(user.user_type)}`}
                            >
                              {getUserTypeLabel(user.user_type)}
                            </Badge>
                          </div>
                          {(user.location || user.profile?.city) && (
                            <p className="text-sm text-muted-foreground truncate">
                              📍 {user.location || user.profile?.city || user.profile?.address}
                            </p>
                          )}
                          {user.phone_number && (
                            <p className="text-sm text-muted-foreground truncate">
                              📞 {user.phone_number}
                            </p>
                          )}
                        </div>
                      </div>
                      {showChatButton && onChatWithUser && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleChatWithUser(user, e)}
                          className="ml-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSearchDropdown;