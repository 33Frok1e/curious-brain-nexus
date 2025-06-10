
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
