import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  FileText, 
  Users, 
  Mail, 
  Settings,
  Tractor,
  Store,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  userType: string;
}

const adminItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'User Management', url: '/admin/users', icon: Users },
  { title: 'Communications', url: '/admin/communications', icon: Mail },
  { title: 'Blog Management', url: '/admin/blogs', icon: FileText },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const farmerItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'My Products', url: '/farmer/products', icon: Package },
  { title: 'Add Product', url: '/farmer/products/add', icon: Tractor },
  { title: 'Orders', url: '/farmer/orders', icon: ShoppingCart },
  { title: 'My Blogs', url: '/farmer/blogs', icon: FileText },
  { title: 'Write Blog', url: '/farmer/blogs/create', icon: MessageSquare },
];

const buyerItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Marketplace', url: '/marketplace', icon: Store },
  { title: 'My Orders', url: '/buyer/orders', icon: ShoppingCart },
  { title: 'My Blogs', url: '/buyer/blogs', icon: FileText },
  { title: 'Write Blog', url: '/buyer/blogs/create', icon: MessageSquare },
];

export function AppSidebar({ userType }: AppSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const getItems = () => {
    switch (userType) {
      case 'admin':
        return adminItems;
      case 'farmer':
        return farmerItems;
      case 'buyer':
        return buyerItems;
      default:
        return [];
    }
  };

  const items = getItems();
  const isActive = (path: string) => currentPath === path;
  const isExpanded = items.some((i) => isActive(i.url));

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive 
                          ? 'bg-primary text-primary-foreground font-medium' 
                          : 'hover:bg-muted/50'
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}