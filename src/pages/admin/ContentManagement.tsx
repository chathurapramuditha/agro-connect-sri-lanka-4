import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockBlogPosts = [
  {
    id: '1',
    title: 'Sustainable Farming Practices for Better Yields',
    author: 'John Farmer',
    status: 'pending',
    created_at: '2025-01-10T10:00:00Z',
    excerpt: 'Learn about sustainable farming techniques that can improve your crop yields while protecting the environment.'
  },
  {
    id: '2', 
    title: 'Market Trends for Organic Vegetables',
    author: 'Sarah Green',
    status: 'approved',
    created_at: '2025-01-09T15:30:00Z',
    excerpt: 'An analysis of current market trends and pricing for organic vegetables in Sri Lanka.'
  },
  {
    id: '3',
    title: 'How to Store Fresh Produce for Maximum Shelf Life',
    author: 'Mike Buyer',
    status: 'rejected',
    created_at: '2025-01-08T09:15:00Z',
    excerpt: 'Tips and tricks for storing fresh produce to maintain quality and extend shelf life.'
  }
];

const ContentManagement = () => {
  const [posts, setPosts] = useState(mockBlogPosts);
  const { toast } = useToast();

  const updatePostStatus = (postId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: newStatus } : post
    ));

    toast({
      title: "Status Updated",
      description: `Post ${newStatus} successfully`,
    });
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: "Post Deleted",
      description: "Blog post has been removed",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Moderate blog posts and content</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'rejected'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-6">
              {posts
                .filter(post => tab === 'all' || post.status === tab)
                .map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {getStatusIcon(post.status)}
                            {post.title}
                          </CardTitle>
                          <CardDescription>
                            By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        {post.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => updatePostStatus(post.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => updatePostStatus(post.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        {post.status !== 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updatePostStatus(post.id, 'pending')}
                          >
                            Reset to Pending
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentManagement;