
import React, { useState } from 'react';
import { Share2, Copy, Users, Globe, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteTitle?: string;
  isAllNotes?: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, noteTitle, isAllNotes = false }) => {
  const [shareType, setShareType] = useState<'public' | 'private'>('private');
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [shareLink, setShareLink] = useState('');
  const { toast } = useToast();

  const generateShareLink = () => {
    const randomId = Math.random().toString(36).substring(7);
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/shared/${randomId}`;
    setShareLink(link);
    return link;
  };

  const handleShare = () => {
    const link = generateShareLink();
    const emailList = emails.split(',').map(email => email.trim()).filter(Boolean);
    
    console.log('Sharing:', {
      type: shareType,
      emails: emailList,
      message,
      link,
      content: isAllNotes ? 'All notes' : noteTitle
    });

    toast({
      title: "Share link created!",
      description: `${isAllNotes ? 'Your brain' : 'Note'} has been shared successfully.`,
    });
    
    onClose();
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard.",
      });
    } else {
      const link = generateShareLink();
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share {isAllNotes ? 'Your Brain' : 'Note'}
          </DialogTitle>
          <DialogDescription>
            {isAllNotes 
              ? 'Share your entire collection of notes with others'
              : `Share "${noteTitle}" with others`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Share Type Selection */}
          <div className="space-y-3">
            <Label>Privacy Settings</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={shareType === 'private' ? 'default' : 'outline'}
                onClick={() => setShareType('private')}
                className="h-auto p-3 flex flex-col items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                <span className="text-xs">Private</span>
              </Button>
              <Button
                variant={shareType === 'public' ? 'default' : 'outline'}
                onClick={() => setShareType('public')}
                className="h-auto p-3 flex flex-col items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs">Public</span>
              </Button>
            </div>
          </div>

          {/* Email Sharing */}
          {shareType === 'private' && (
            <div className="space-y-2">
              <Label htmlFor="emails" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Invite People
              </Label>
              <Input
                id="emails"
                placeholder="Enter email addresses (separated by commas)"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Share Link */}
          {shareLink && (
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button onClick={copyToClipboard} size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Permissions Info */}
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Permissions</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">View Only</Badge>
                <span>Recipients can view {isAllNotes ? 'your notes' : 'the note'}</span>
              </div>
              {shareType === 'private' && (
                <p>Only people you invite can access this content</p>
              )}
              {shareType === 'public' && (
                <p>Anyone with the link can view this content</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleShare} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
