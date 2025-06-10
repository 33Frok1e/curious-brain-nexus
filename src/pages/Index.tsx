
import React, { useState, useMemo } from 'react';
import { Plus, Search, Brain, Tag, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import NoteCard from '@/components/NoteCard';
import CreateNoteModal from '@/components/CreateNoteModal';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  isFavorite: boolean;
  category: string;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Understanding React Hooks',
      content: 'React Hooks allow you to use state and other React features without writing a class component. Key hooks include useState, useEffect, and useContext.',
      tags: ['react', 'javascript', 'programming'],
      createdAt: new Date('2024-06-01'),
      isFavorite: true,
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Daily Reflection',
      content: 'Today I learned about the importance of taking breaks during coding sessions. It helps prevent burnout and improves problem-solving abilities.',
      tags: ['personal', 'productivity', 'wellness'],
      createdAt: new Date('2024-06-02'),
      isFavorite: false,
      category: 'Personal'
    },
    {
      id: '3',
      title: 'Design Principles',
      content: 'Good design is about hierarchy, contrast, balance, and movement. These principles help create visually appealing and functional interfaces.',
      tags: ['design', 'ui', 'principles'],
      createdAt: new Date('2024-06-03'),
      isFavorite: true,
      category: 'Design'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const allTags = useMemo(() => {
    const tags = notes.flatMap(note => note.tags);
    return Array.from(new Set(tags));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || note.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [notes, searchTerm, selectedTag]);

  const handleCreateNote = (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    setIsCreateModalOpen(false);
    toast({
      title: "Note created!",
      description: "Your new note has been added to your brain.",
    });
  };

  const handleToggleFavorite = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
    toast({
      title: "Note updated!",
      description: "Favorite status changed.",
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Note deleted!",
      description: "Your note has been removed from your brain.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Second Brain
                </h1>
                <p className="text-sm text-muted-foreground">Your knowledge companion</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search your thoughts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 backdrop-blur-sm border-white/20 focus:bg-white/90 transition-all duration-200"
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Button
              variant={selectedTag === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag('')}
              className={selectedTag === '' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : ''}
            >
              All
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                className={selectedTag === tag ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : ''}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold text-foreground">{notes.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold text-foreground">{notes.filter(n => n.isFavorite).length}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tags</p>
                <p className="text-2xl font-bold text-foreground">{allTags.length}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
                <Tag className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm || selectedTag ? 'No notes found' : 'Start building your second brain'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedTag 
                ? 'Try adjusting your search or filters'
                : 'Create your first note to begin capturing your thoughts'
              }
            </p>
            {!searchTerm && !selectedTag && (
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateNote}
      />
    </div>
  );
};

export default Index;
