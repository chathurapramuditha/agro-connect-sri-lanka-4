import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Calendar, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  views?: number;
}

export default function BuyerBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Mock data for now - replace with actual Supabase query when blog table is created
      const mockBlogs: BlogPost[] = [
        {
          id: '1',
          title: 'My Experience with Local Organic Produce',
          content: 'Sharing my journey of buying fresh organic vegetables...',
          status: 'published',
          created_at: '2024-01-20',
          updated_at: '2024-01-20',
          views: 89
        },
        {
          id: '2',
          title: 'Tips for Selecting Quality Fruits',
          content: 'What to look for when buying fruits directly from farmers...',
          status: 'draft',
          created_at: '2024-01-18',
          updated_at: '2024-01-19',
          views: 0
        }
      ];

      setBlogs(mockBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        // Add actual delete logic here
        setBlogs(blogs.filter(blog => blog.id !== id));
        toast.success('Blog post deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/buyer/blogs/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Share your experiences with fresh produce</p>
        </div>
        <Button onClick={() => navigate('/buyer/blogs/create')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Blog Post
        </Button>
      </div>

      <div className="grid gap-6">
        {blogs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start sharing your experiences with fresh produce
                </p>
                <Button onClick={() => navigate('/buyer/blogs/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first blog post
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{blog.title}</CardTitle>
                      <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                        {blog.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {blog.content}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(blog.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                    {blog.status === 'published' && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {blog.views || 0} views
                      </div>
                    )}
                  </div>
                  <div className="text-xs">
                    Last updated: {new Date(blog.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}