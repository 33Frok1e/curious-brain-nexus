
import React from 'react';
import { Trash2, Calendar, Tag, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LinkPreview } from '@/utils/linkUtils';
import LinkPreviewComponent from '@/components/LinkPreview';

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

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onShare?: (noteTitle: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onShare }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
    <Card className="group bg-white/70 backdrop-blur-sm border-white/20 hover:bg-white/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-purple-600 transition-colors">
              {note.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`text-xs ${getCategoryColor(note.category)}`}>
                {note.category}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(note.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(note.title)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-500"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {note.content}
        </p>
        
        {/* Display embedded links */}
        {note.links && note.links.length > 0 && (
          <div className="mb-4">
            {note.links.slice(0, 2).map((link, index) => (
              <LinkPreviewComponent key={index} preview={link} />
            ))}
            {note.links.length > 2 && (
              <div className="mt-2 text-xs text-muted-foreground">
                +{note.links.length - 2} more links
              </div>
            )}
          </div>
        )}
        
        {note.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {note.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteCard;
