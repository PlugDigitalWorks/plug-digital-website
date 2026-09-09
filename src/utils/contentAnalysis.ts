export const calculateStats = (content: string) => {
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const words = cleanContent.trim().split(/\s+/).length;
  const characters = cleanContent.length;
  const sentences = cleanContent.split(/[.!?]+/).length;
  const readingTime = Math.ceil(words / 200); // Ortalama okuma hızı: 200 kelime/dakika

  return {
    wordCount: words,
    characterCount: characters,
    sentenceCount: sentences,
    readingTime,
  };
};

export const analyzeReadability = (content: string) => {
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const sentences = cleanContent.split(/[.!?]+/).length;
  const words = cleanContent.trim().split(/\s+/).length;
  const characters = cleanContent.length;

  const avgWordsPerSentence = words / sentences;
  const avgCharactersPerWord = characters / words;

  return [
    {
      score: Math.min(100, Math.max(0, 100 - (avgWordsPerSentence - 15) * 5)),
      status:
        avgWordsPerSentence <= 20
          ? 'good'
          : avgWordsPerSentence <= 25
            ? 'warning'
            : 'bad',
      message: 'Cümle uzunluğu',
    },
    {
      score: Math.min(100, Math.max(0, 100 - (avgCharactersPerWord - 5) * 10)),
      status:
        avgCharactersPerWord <= 6
          ? 'good'
          : avgCharactersPerWord <= 7
            ? 'warning'
            : 'bad',
      message: 'Kelime uzunluğu',
    },
  ];
};
