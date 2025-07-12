import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import AIChat from "./pages/AIChat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import Communications from "./pages/admin/Communications";
import ContentManagement from "./pages/admin/ContentManagement";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
                <Route path="/notifications" element={<Notifications />} />
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
  </QueryClientProvider>
);

export default App;
