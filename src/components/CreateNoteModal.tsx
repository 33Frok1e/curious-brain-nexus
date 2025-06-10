
import React, { useState, useEffect } from 'react';
import { X, Plus, Tag, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { extractLinks, LinkPreview } from '@/utils/linkUtils';
import LinkPreviewComponent from '@/components/LinkPreview';

interface Note {
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  category: string;
  links?: LinkPreview[];
}

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (note: Note) => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('');
  const [detectedLinks, setDetectedLinks] = useState<LinkPreview[]>([]);

  const categories = ['Technology', 'Personal', 'Design', 'Business', 'Science', 'Other'];

  useEffect(() => {
    const allText = `${content} ${linkInput}`;
    const links = extractLinks(allText);
    setDetectedLinks(links);
  }, [content, linkInput]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim() && category) {
      onCreate({
        title: title.trim(),
        content: content.trim(),
        tags,
        isFavorite: false,
        category,
        links: detectedLinks
      });
      // Reset form
      setTitle('');
      setContent('');
      setLinkInput('');
      setTags([]);
      setTagInput('');
      setCategory('');
      setDetectedLinks([]);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form on close
    setTitle('');
    setContent('');
    setLinkInput('');
    setTags([]);
    setTagInput('');
    setCategory('');
    setDetectedLinks([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create New Note
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="bg-white/70 border-white/20 focus:bg-white/90"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              Category *
            </label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-white/70 border-white/20 focus:bg-white/90">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              Content *
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Capture your thoughts, ideas, learnings..."
              rows={6}
              className="bg-white/70 border-white/20 focus:bg-white/90 resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="links" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Link className="h-4 w-4" />
              Add Links (YouTube, Twitter)
            </label>
            <Input
              id="links"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="Paste YouTube or Twitter links here..."
              className="bg-white/70 border-white/20 focus:bg-white/90"
            />
            
            {detectedLinks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Link className="h-4 w-4" />
                  <span>Detected Links ({detectedLinks.length})</span>
                </div>
                {detectedLinks.map((link, index) => (
                  <LinkPreviewComponent key={index} preview={link} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Tags</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tags..."
                  className="pl-10 bg-white/70 border-white/20 focus:bg-white/90"
                />
              </div>
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                size="icon"
                className="bg-white/70 border-white/20 hover:bg-white/90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-white/70 border-white/20 hover:bg-white/90"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !content.trim() || !category}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Create Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
