export const generateMetaTitle = (title: string, category?: string): string => {
  // Simulated AI response
  const siteName = 'Çilek Havuz';
  const categoryText = category ? ` - ${category}` : '';
  return `${title}${categoryText} | ${siteName}`;
};

export const generateMetaDescription = (
  title: string,
  content: string,
): string => {
  // Simulated AI response - extract first 160 characters from content
  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
  return cleanContent.length > 160
    ? `${cleanContent.slice(0, 157)}...`
    : cleanContent;
};

export const generateTags = (
  title: string,
  content: string,
  category?: string,
): string[] => {
  // Simulated AI response
  const baseTags = ['hizmet', 'çilek havuz'];

  // Extract keywords from title
  const titleWords = title
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length > 3)
    .slice(0, 3);

  // Category specific tags
  const categoryTags = {
    web: ['web', 'tasarım', 'yazılım'],
    mobile: ['mobil', 'uygulama', 'android', 'ios'],
    design: ['tasarım', 'grafik', 'logo'],
    consulting: ['danışmanlık', 'strateji', 'analiz'],
  };

  const categorySpecificTags = category
    ? categoryTags[category as keyof typeof categoryTags] || []
    : [];

  // Extract keywords from content
  const contentWords = content
    .replace(/<[^>]*>/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 5);

  // Combine all tags and remove duplicates
  return [
    ...new Set([
      ...baseTags,
      ...titleWords,
      ...categorySpecificTags,
      ...contentWords,
    ]),
  ].slice(0, 8);
};
