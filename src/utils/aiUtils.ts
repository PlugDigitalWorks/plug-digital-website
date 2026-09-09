export const generateTitleSuggestions = async (
  content: string,
): Promise<string[]> => {
  // Simulated AI response - in real implementation, this would call an AI service
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Extract keywords from content
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const keywords = cleanContent
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 5);

  // Generate title patterns
  const patterns = [
    `${keywords[0]} Hizmeti: Profesyonel Çözümler`,
    `${keywords[0]} ve ${keywords[1]} Hizmetleri`,
    `Uzman ${keywords[0]} Danışmanlığı`,
    `${keywords[0]}: Kapsamlı Hizmet Çözümleri`,
    `${keywords[0]} Konusunda Uzman Destek`,
  ];

  return patterns.map(
    (pattern) => pattern.charAt(0).toUpperCase() + pattern.slice(1),
  );
};

export const generateCategoryDescription = async (
  categoryName: string,
): Promise<string> => {
  // Simüle edilmiş AI yanıtı
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return `${categoryName}, müşterilerimize sunduğumuz kapsamlı ve profesyonel hizmet çözümlerini içerir. Uzman ekibimiz ve yenilikçi yaklaşımımızla, işletmenizin ihtiyaçlarına özel çözümler üretiyoruz. Kalite standartlarımız ve müşteri memnuniyeti odaklı hizmet anlayışımızla sektörde öncü konumdayız.`;
};
