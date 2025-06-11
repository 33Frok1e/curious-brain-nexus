
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Share2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import LinkPreviewComponent from '@/components/LinkPreview';
import ShareModal from '@/components/ShareModal';
import { LinkPreview, getDemoNotes, extractLinks } from '@/utils/linkUtils';
import { useState } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  isFavorite: boolean;
  category: string;
  links?: LinkPreview[];
}

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Get demo notes for now - in a real app this would come from state management or API
  const demoNotes = getDemoNotes();
  const extraNotes = Array.from({ length: 20 }, (_, i) => ({
    ...demoNotes[i % demoNotes.length],
    id: `generated-${i}`,
    title: `${demoNotes[i % demoNotes.length].title} ${i + 1}`,
    createdAt: new Date(2024, 5, i + 4)
  }));
  const allNotes = [...demoNotes, ...extraNotes];
  
  const note = allNotes.find(n => n.id === id);

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Note not found</h2>
          <p className="text-muted-foreground mb-4">The note you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brain
          </Button>
        </div>
      </div>
    );
  }

  // Extract links dynamically from content
  const extractedLinks = extractLinks(note.content);
  const allLinks = [...(note.links || []), ...extractedLinks];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Personal': 'bg-green-100 text-green-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Business': 'bg-orange-100 text-orange-800',
      'Science': 'bg-teal-100 text-teal-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Brain
            </Button>
            <Button
              onClick={() => setIsShareModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Note
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl">
          {/* Note Header */}
          <div className="p-8 border-b border-white/20">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground leading-tight flex-1 mr-4">
                {note.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <Badge className={`${getCategoryColor(note.category)}`}>
                {note.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(note.createdAt)}
              </div>
            </div>

            {note.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-4">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {note.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Note Content */}
          <div className="p-8">
            <ScrollArea className="max-h-[60vh]">
              <div className="prose prose-gray max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
                  {note.content}
                </p>
              </div>

              {/* Embedded Links - Now Dynamic */}
              {allLinks.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Embedded Content</h3>
                  {allLinks.map((link, index) => (
                    <LinkPreviewComponent key={`${link.url}-${index}`} preview={link} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        noteTitle={note.title}
        isAllNotes={false}
      />
    </div>
  );
};

export default NoteDetails;
