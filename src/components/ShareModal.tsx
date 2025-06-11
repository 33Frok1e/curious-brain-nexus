
import React, { useState, useEffect } from 'react';
import { Share2, Copy, Users, Globe, Lock, Mail, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  const [isLinkEnabled, setIsLinkEnabled] = useState(true);
  const { toast } = useToast();

  const generateShareLink = () => {
    const randomId = Math.random().toString(36).substring(7);
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/shared/${randomId}`;
    setShareLink(link);
    return link;
  };

  // Generate link when modal opens
  useEffect(() => {
    if (isOpen && !shareLink) {
      generateShareLink();
    }
  }, [isOpen, shareLink]);

  const handleShare = () => {
    if (!isLinkEnabled) {
      toast({
        title: "Share link disabled",
        description: "Please enable the share link before sharing.",
        variant: "destructive"
      });
      return;
    }

    const link = shareLink || generateShareLink();
    const emailList = emails.split(',').map(email => email.trim()).filter(Boolean);
    
    console.log('Sharing:', {
      type: shareType,
      emails: emailList,
      message,
      link,
      content: isAllNotes ? 'All notes' : noteTitle,
      enabled: isLinkEnabled
    });

    toast({
      title: "Share link created!",
      description: `${isAllNotes ? 'Your brain' : 'Note'} has been shared successfully.`,
    });
    
    onClose();
  };

  const copyToClipboard = () => {
    if (!isLinkEnabled) {
      toast({
        title: "Share link disabled",
        description: "Enable the share link first to copy it.",
        variant: "destructive"
      });
      return;
    }

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

  const handleToggleLink = (enabled: boolean) => {
    setIsLinkEnabled(enabled);
    if (enabled) {
      if (!shareLink) {
        generateShareLink();
      }
      toast({
        title: "Share link enabled",
        description: "Your share link is now active.",
      });
    } else {
      toast({
        title: "Share link disabled",
        description: "Your share link has been deactivated and expired.",
        variant: "destructive"
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
          {/* Share Link Input with Copy */}
          <div className="space-y-2">
            <Label>Shareable Link</Label>
            <div className="flex gap-2">
              <Input 
                value={isLinkEnabled ? shareLink : 'Link expired - Enable to generate new link'} 
                readOnly 
                className={`flex-1 ${!isLinkEnabled ? 'text-red-500 bg-red-50' : ''}`}
              />
              <Button 
                onClick={copyToClipboard} 
                size="sm"
                disabled={!isLinkEnabled}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Share Link Enable/Disable Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Share Link Status</Label>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isLinkEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {isLinkEnabled ? 'Active' : 'Expired'}
                </span>
                <Switch
                  checked={isLinkEnabled}
                  onCheckedChange={handleToggleLink}
                />
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${isLinkEnabled ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                {isLinkEnabled ? (
                  <ToggleRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-xs font-medium ${isLinkEnabled ? 'text-green-700' : 'text-red-700'}`}>
                  {isLinkEnabled ? 'Link is active and accessible' : 'Link is disabled and expired'}
                </span>
              </div>
            </div>
          </div>

          {/* Share Type Selection */}
          <div className="space-y-3">
            <Label>Privacy Settings</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={shareType === 'private' ? 'default' : 'outline'}
                onClick={() => setShareType('private')}
                className="h-auto p-3 flex flex-col items-center gap-2"
                disabled={!isLinkEnabled}
              >
                <Lock className="h-4 w-4" />
                <span className="text-xs">Private</span>
              </Button>
              <Button
                variant={shareType === 'public' ? 'default' : 'outline'}
                onClick={() => setShareType('public')}
                className="h-auto p-3 flex flex-col items-center gap-2"
                disabled={!isLinkEnabled}
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
                disabled={!isLinkEnabled}
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
              disabled={!isLinkEnabled}
            />
          </div>

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
              {!isLinkEnabled && (
                <p className="text-red-600 font-medium">⚠️ Share link is currently disabled and expired</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            disabled={!isLinkEnabled}
          >
            {isLinkEnabled ? 'Share' : 'Enable Link First'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
