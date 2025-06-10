
import React from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { LinkPreview, renderLinkPreview } from '@/utils/linkUtils';

interface LinkPreviewProps {
  preview: LinkPreview;
}

const LinkPreviewComponent: React.FC<LinkPreviewProps> = ({ preview }) => {
  const rendered = renderLinkPreview(preview);
  
  if (!rendered) return null;

  if (rendered.component === 'youtube') {
    return (
      <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden bg-white/50">
        <div className="relative aspect-video bg-gray-100">
          <img 
            src={rendered.thumbnail} 
            alt="YouTube thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors cursor-pointer">
              <Play className="h-6 w-6 ml-1" />
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <span className="truncate">{preview.url}</span>
          </div>
        </div>
      </div>
    );
  }

  if (rendered.component === 'twitter') {
    return (
      <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden bg-white/50">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white p-2 rounded-full">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-blue-800">Twitter Post</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4 inline mr-1" />
            <span className="truncate">{preview.url}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LinkPreviewComponent;
