import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import AIChat from "./pages/AIChat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import Communications from "./pages/admin/Communications";
import ContentManagement from "./pages/admin/ContentManagement";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import FarmerProducts from "./pages/farmer/Products";
import FarmerOrders from "./pages/farmer/Orders";
import FarmerBlogs from "./pages/farmer/Blogs";
import FarmerBlogCreate from "./pages/farmer/BlogCreate";
import FarmerProductAdd from "./pages/farmer/ProductAdd";
import BuyerOrders from "./pages/buyer/Orders";
import BuyerBlogs from "./pages/buyer/Blogs";
import BuyerBlogCreate from "./pages/buyer/BlogCreate";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import Cart from "./pages/Cart";
import Weather from "./pages/Weather";
import CropCalendar from "./pages/CropCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/article/:id" element={<BlogArticle />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/communications" element={<Communications />} />
                <Route path="/admin/blogs" element={<ContentManagement />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/farmer/products" element={<FarmerProducts />} />
                <Route path="/farmer/products/add" element={<FarmerProductAdd />} />
                <Route path="/farmer/orders" element={<FarmerOrders />} />
                <Route path="/farmer/blogs" element={<FarmerBlogs />} />
                <Route path="/farmer/blogs/create" element={<FarmerBlogCreate />} />
                <Route path="/buyer/orders" element={<BuyerOrders />} />
                <Route path="/buyer/blogs" element={<BuyerBlogs />} />
                <Route path="/buyer/blogs/create" element={<BuyerBlogCreate />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/crop-calendar" element={<CropCalendar />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin/*" element={<Dashboard />} />
                <Route path="/farmer/*" element={<Dashboard />} />
                <Route path="/buyer/*" element={<Dashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
