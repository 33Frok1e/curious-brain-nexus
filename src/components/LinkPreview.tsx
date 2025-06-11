
import React from 'react';
import { ExternalLink, Play, Heart, MessageCircle, Repeat2, Eye } from 'lucide-react';
import { LinkPreview, renderLinkPreview } from '@/utils/linkUtils';

interface LinkPreviewProps {
  preview: LinkPreview;
}

const LinkPreviewComponent: React.FC<LinkPreviewProps> = ({ preview }) => {
  const rendered = renderLinkPreview(preview);
  
  if (!rendered) return null;

  if (rendered.component === 'youtube') {
    return (
      <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden bg-white/50 hover:bg-white/70 transition-all">
        <div className="relative aspect-video bg-gray-100 group cursor-pointer">
          <img 
            src={rendered.thumbnail} 
            alt="YouTube thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors group-hover:scale-110">
              <Play className="h-6 w-6 ml-1" />
            </div>
          </div>
          {/* YouTube overlay info */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>1.2M views</span>
          </div>
        </div>
        <div className="p-3 bg-white/70">
          <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
            {preview.title || 'YouTube Video'}
          </h4>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3 w-3" />
              <span className="truncate max-w-[200px]">YouTube</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>45K</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>2.1K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (rendered.component === 'twitter') {
    return (
      <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden bg-white/50 hover:bg-white/70 transition-all">
        <div className="p-4">
          {/* Twitter header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">John Doe</span>
                <span className="text-blue-500">✓</span>
                <span className="text-gray-500 text-sm">@johndoe</span>
              </div>
              <span className="text-gray-500 text-xs">2h ago</span>
            </div>
          </div>

          {/* Tweet content */}
          <div className="mb-3">
            <p className="text-gray-900 text-sm leading-relaxed">
              This is an amazing breakthrough in AI technology! The future is here and it's exciting to see what's possible. 
              <span className="text-blue-500"> #AI #Technology #Innovation</span>
            </p>
          </div>

          {/* Tweet engagement */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">47</span>
              </div>
              <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition-colors">
                <Repeat2 className="h-4 w-4" />
                <span className="text-xs">128</span>
              </div>
              <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors">
                <Heart className="h-4 w-4" />
                <span className="text-xs">1.2K</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
                <ExternalLink className="h-4 w-4" />
                <span className="text-xs">45</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              <Eye className="h-3 w-3 inline mr-1" />
              15.4K views
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LinkPreviewComponent;
