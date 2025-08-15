import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Loader } from 'lucide-react';

interface UserProfile {
  id: string;
  user_type: string;
  full_name: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setProfile(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar userType={profile.user_type} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center px-6">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-xl font-semibold">
                Welcome, {profile.full_name}
              </h1>
              <p className="text-sm text-muted-foreground capitalize">
                {profile.user_type} Dashboard
              </p>
            </div>
          </header>
          <main className="flex-1 p-6">
            <div className="max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.user_type === 'admin' && (
                  <>
                    <div 
                      className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate('/admin/users')}
                    >
                      <h3 className="font-semibold mb-2">User Management</h3>
                      <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
                    </div>
                    <div 
                      className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate('/admin/communications')}
                    >
                      <h3 className="font-semibold mb-2">Communications</h3>
                      <p className="text-sm text-muted-foreground">Send emails and SMS to users</p>
                    </div>
                    <div 
                      className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate('/admin/blogs')}
                    >
                      <h3 className="font-semibold mb-2">Content Management</h3>
                      <p className="text-sm text-muted-foreground">Moderate blog posts and content</p>
                    </div>
                  </>
                )}
                {profile.user_type === 'farmer' && (
                  <>
                    <div 
                      className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate('/farmer/products')}
                    >
                      <h3 className="font-semibold mb-2">My Products</h3>
                      <p className="text-sm text-muted-foreground">Manage your farm products</p>
                    </div>
                    <div 
                      className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate('/farmer/orders')}
                    >
                      <h3 className="font-semibold mb-2">Orders</h3>
                      <p className="text-sm text-muted-foreground">View and manage incoming orders</p>
                    </div>
                    <div 
                      className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate('/farmer/blogs')}
                    >
                      <h3 className="font-semibold mb-2">Blog Posts</h3>
                      <p className="text-sm text-muted-foreground">Share farming insights</p>
                    </div>
                  </>
                )}
                {profile.user_type === 'buyer' && (
                  <>
                    <div 
                      className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate('/marketplace')}
                    >
                      <h3 className="font-semibold mb-2">Marketplace</h3>
                      <p className="text-sm text-muted-foreground">Browse and buy fresh produce</p>
                    </div>
                    <div 
                      className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate('/buyer/orders')}
                    >
                      <h3 className="font-semibold mb-2">My Orders</h3>
                      <p className="text-sm text-muted-foreground">Track your purchases</p>
                    </div>
                    <div 
                      className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate('/buyer/blogs')}
                    >
                      <h3 className="font-semibold mb-2">Blog Posts</h3>
                      <p className="text-sm text-muted-foreground">Share your experiences</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;