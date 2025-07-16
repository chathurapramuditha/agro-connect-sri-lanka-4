import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, Shield, Trash2, UserMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  user_type: string;
  is_verified: boolean;
  location: string;
  phone_number: string;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_verified: !currentStatus }
          : user
      ));

      toast({
        title: "Success",
        description: `User ${!currentStatus ? 'verified' : 'unverified'} successfully`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user verification",
        variant: "destructive",
      });
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      // In a real app, you might want to add a deactivated flag instead of deleting
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: false })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_verified: false }
          : user
      ));

      toast({
        title: "Success",
        description: "User account deactivated successfully",
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate user account",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string, userAuthId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // First delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Note: In a real app, you might need to use the Auth Admin API to delete the auth user
      // For now, we'll just remove from the profiles table
      
      setUsers(users.filter(user => user.id !== userId));

      toast({
        title: "Success",
        description: "User account deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user account",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'buyer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
      </div>

      <div className="grid gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {user.full_name}
                      {user.is_verified && (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      Member since {new Date(user.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(user.user_type)}>
                    {user.user_type}
                  </Badge>
                  {user.user_type === 'admin' && (
                    <Shield className="h-4 w-4 text-purple-600" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {user.location || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {user.phone_number || 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={user.is_verified ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleVerification(user.id, user.is_verified)}
                  className="flex items-center gap-2"
                >
                  {user.is_verified ? (
                    <>
                      <UserX className="h-4 w-4" />
                      Unverify
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Verify
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deactivateUser(user.id)}
                  className="flex items-center gap-2"
                >
                  <UserMinus className="h-4 w-4" />
                  Deactivate
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteUser(user.id, user.user_id)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;