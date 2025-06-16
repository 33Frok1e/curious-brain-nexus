import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Plus, Search, Brain, Tag, Calendar, Share2, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import NoteCard from '@/components/NoteCard';
import CreateNoteModal from '@/components/CreateNoteModal';
import ShareModal from '@/components/ShareModal';
import Profile from '@/components/Profile';
import { useToast } from '@/hooks/use-toast';
import { LinkPreview, getDemoNotes } from '@/utils/linkUtils';

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

const NOTES_PER_PAGE = 6;

const Index = () => {
  const [allNotes, setAllNotes] = useState<Note[]>(() => {
    // Initialize with demo notes and generate more for pagination demo
    const demoNotes = getDemoNotes();
    const extraNotes = Array.from({ length: 20 }, (_, i) => ({
      ...demoNotes[i % demoNotes.length],
      id: `generated-${i}`,
      title: `${demoNotes[i % demoNotes.length].title} ${i + 1}`,
      createdAt: new Date(2024, 5, i + 4)
    }));
    return [...demoNotes, ...extraNotes];
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareNoteTitle, setShareNoteTitle] = useState<string>('');
  const [isAllNotesShare, setIsAllNotesShare] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { toast } = useToast();

  const allTags = useMemo(() => {
    const tags = allNotes.flatMap(note => note.tags);
    return Array.from(new Set(tags));
  }, [allNotes]);

  const filteredNotes = useMemo(() => {
    return allNotes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || note.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [allNotes, searchTerm, selectedTag]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE);
  const startIndex = (currentPage - 1) * NOTES_PER_PAGE;
  const endIndex = startIndex + NOTES_PER_PAGE;
  const currentNotes = filteredNotes.slice(startIndex, endIndex);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  const handleCreateNote = (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setAllNotes(prev => [newNote, ...prev]);
    setIsCreateModalOpen(false);
    toast({
      title: "Note created!",
      description: "Your new note has been added to your brain.",
    });
  };

  const handleDeleteNote = (id: string) => {
    setAllNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Note deleted!",
      description: "Your note has been removed from your brain.",
      variant: "destructive"
    });
  };

  const handleShareAllNotes = () => {
    setIsAllNotesShare(true);
    setShareNoteTitle('');
    setIsShareModalOpen(true);
  };

  const handleShareNote = (noteTitle: string) => {
    setIsAllNotesShare(false);
    setShareNoteTitle(noteTitle);
    setIsShareModalOpen(true);
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            <div className="flex items-center gap-2">
              <Button
                onClick={handleShareAllNotes}
                variant="outline"
                className="hidden sm:flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Brain
              </Button>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  onClick={() => setIsProfileOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
                <p className="text-2xl font-bold text-foreground">{allNotes.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Links</p>
                <p className="text-2xl font-bold text-foreground">{allNotes.filter(n => n.links && n.links.length > 0).length}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
                <Share2 className="h-6 w-6 text-white" />
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

        {/* Notes Grid with Pagination */}
        {filteredNotes.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onShare={handleShareNote}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        noteTitle={shareNoteTitle}
        isAllNotes={isAllNotesShare}
      />

      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default Index;
