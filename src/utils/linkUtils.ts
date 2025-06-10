
export interface LinkPreview {
  type: 'twitter' | 'youtube' | 'link';
  url: string;
  title?: string;
  thumbnail?: string;
  description?: string;
  embedId?: string;
}

export const extractLinks = (text: string): LinkPreview[] => {
  const links: LinkPreview[] = [];
  
  // YouTube URL patterns
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
  
  // Twitter URL patterns
  const twitterRegex = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/g;
  
  let match;
  
  // Extract YouTube links
  while ((match = youtubeRegex.exec(text)) !== null) {
    const videoId = match[1];
    links.push({
      type: 'youtube',
      url: match[0],
      embedId: videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      title: 'YouTube Video'
    });
  }
  
  // Extract Twitter links
  while ((match = twitterRegex.exec(text)) !== null) {
    const tweetId = match[1];
    links.push({
      type: 'twitter',
      url: match[0],
      embedId: tweetId,
      title: 'Twitter Post'
    });
  }
  
  return links;
};

export const renderLinkPreview = (preview: LinkPreview) => {
  switch (preview.type) {
    case 'youtube':
      return {
        component: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${preview.embedId}`,
        thumbnail: preview.thumbnail
      };
    case 'twitter':
      return {
        component: 'twitter',
        embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${preview.embedId}`,
        tweetId: preview.embedId
      };
    default:
      return null;
  }
};

// Demo data for showing UI
export const getDemoNotes = () => [
  {
    id: 'demo-1',
    title: 'React Performance Tips',
    content: 'Here\'s a great video about React optimization: https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['react', 'performance', 'optimization'],
    createdAt: new Date('2024-06-01'),
    isFavorite: false,
    category: 'Technology',
    links: [{
      type: 'youtube' as const,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embedId: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      title: 'YouTube Video'
    }]
  },
  {
    id: 'demo-2',
    title: 'Latest Tech News',
    content: 'Interesting thread about AI developments: https://twitter.com/elonmusk/status/1234567890',
    tags: ['ai', 'technology', 'news'],
    createdAt: new Date('2024-06-02'),
    isFavorite: false,
    category: 'Technology',
    links: [{
      type: 'twitter' as const,
      url: 'https://twitter.com/elonmusk/status/1234567890',
      embedId: '1234567890',
      title: 'Twitter Post'
    }]
  },
  {
    id: 'demo-3',
    title: 'Design Inspiration',
    content: 'Beautiful UI patterns and design principles for modern web applications.',
    tags: ['design', 'ui', 'inspiration'],
    createdAt: new Date('2024-06-03'),
    isFavorite: false,
    category: 'Design'
  }
];
