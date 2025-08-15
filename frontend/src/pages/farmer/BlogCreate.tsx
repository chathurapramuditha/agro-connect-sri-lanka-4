import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function FarmerBlogCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Mock save for now - replace with actual Supabase query when blog table is created
      const blogData = {
        title: title.trim(),
        content: content.trim(),
        status,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        author_id: user.id
      };

      console.log('Blog data to save:', blogData);
      
      toast.success(`Blog post ${status === 'published' ? 'published' : 'saved as draft'} successfully`);
      navigate('/farmer/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    setStatus('draft');
    handleSubmit(new Event('submit') as any);
  };

  const handlePublish = () => {
    setStatus('published');
    handleSubmit(new Event('submit') as any);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/farmer/blogs')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground mt-1">Share your farming expertise</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
            <CardDescription>
              Fill in the details for your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farming-tips">Farming Tips</SelectItem>
                    <SelectItem value="crop-management">Crop Management</SelectItem>
                    <SelectItem value="organic-farming">Organic Farming</SelectItem>
                    <SelectItem value="pest-control">Pest Control</SelectItem>
                    <SelectItem value="soil-health">Soil Health</SelectItem>
                    <SelectItem value="irrigation">Irrigation</SelectItem>
                    <SelectItem value="harvesting">Harvesting</SelectItem>
                    <SelectItem value="market-trends">Market Trends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas (e.g., organic, pest control, irrigation)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Add relevant tags to help others find your blog post
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Preview how your blog post will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/5">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{title || 'Blog Title'}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    {category && <Badge variant="secondary">{category}</Badge>}
                    <Badge variant={status === 'published' ? 'default' : 'secondary'}>
                      {status}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-foreground">
                    {content || 'Your blog content will appear here...'}
                  </p>
                </div>
                {tags && (
                  <div className="flex flex-wrap gap-1 pt-4 border-t">
                    {tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={loading}
          >
            <Eye className="h-4 w-4 mr-2" />
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </form>
    </div>
  );
}