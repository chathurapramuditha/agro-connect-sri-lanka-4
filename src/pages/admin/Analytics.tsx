import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Package, ShoppingCart, TrendingUp, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentUsers: number;
  recentOrders: number;
  userGrowth: number;
  orderGrowth: number;
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time subscription for analytics updates
    const channel = supabase
      .channel('analytics-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchAnalytics();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchAnalytics();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Get user statistics
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('user_type, created_at');

      if (usersError) throw usersError;

      // Get products count
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, created_at');

      if (productsError) throw productsError;

      // Get orders statistics
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, created_at');

      if (ordersError) throw ordersError;

      // Calculate analytics
      const totalUsers = users?.length || 0;
      const totalFarmers = users?.filter(u => u.user_type === 'farmer').length || 0;
      const totalBuyers = users?.filter(u => u.user_type === 'buyer').length || 0;
      const totalProducts = products?.length || 0;
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // Calculate recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = users?.filter(u => new Date(u.created_at) > thirtyDaysAgo).length || 0;
      const recentOrders = orders?.filter(o => new Date(o.created_at) > thirtyDaysAgo).length || 0;

      // Calculate growth rates (simplified)
      const userGrowth = totalUsers > 0 ? (recentUsers / totalUsers) * 100 : 0;
      const orderGrowth = totalOrders > 0 ? (recentOrders / totalOrders) * 100 : 0;

      setAnalytics({
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentUsers,
        recentOrders,
        userGrowth,
        orderGrowth
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Analytics</h1>
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time platform analytics and insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>+{analytics.recentUsers} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>+{analytics.recentOrders} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of user types on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Farmers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{analytics.totalFarmers}</span>
                  <Badge variant="secondary">
                    {analytics.totalUsers > 0 ? Math.round((analytics.totalFarmers / analytics.totalUsers) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Buyers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{analytics.totalBuyers}</span>
                  <Badge variant="secondary">
                    {analytics.totalUsers > 0 ? Math.round((analytics.totalBuyers / analytics.totalUsers) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
            <CardDescription>Monthly growth rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Growth</span>
                <Badge variant={analytics.userGrowth > 0 ? "default" : "secondary"}>
                  {analytics.userGrowth > 0 ? '+' : ''}{analytics.userGrowth.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Order Growth</span>
                <Badge variant={analytics.orderGrowth > 0 ? "default" : "secondary"}>
                  {analytics.orderGrowth > 0 ? '+' : ''}{analytics.orderGrowth.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Last 30 Days)</CardTitle>
          <CardDescription>Platform activity summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">New Users</span>
                <span className="text-sm font-bold">{analytics.recentUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Orders</span>
                <span className="text-sm font-bold">{analytics.recentOrders}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Order Value</span>
                <span className="text-sm font-bold">
                  Rs. {analytics.totalOrders > 0 ? Math.round(analytics.totalRevenue / analytics.totalOrders) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Products per Farmer</span>
                <span className="text-sm font-bold">
                  {analytics.totalFarmers > 0 ? Math.round(analytics.totalProducts / analytics.totalFarmers) : 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;