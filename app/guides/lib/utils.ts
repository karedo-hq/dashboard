import { Guide } from './types';

export function estimateGuideReadingTime(guide: Guide): string {
  const averageWordsPerMinute = 225; // average reading speed
  const wordsPerSecond = averageWordsPerMinute / 60; // convert to words per second

  let totalWords = guide.title.split(' ').length; // count words in the guide title

  guide.steps.forEach((step) => {
    totalWords += step.title.split(' ').length; // count words in step title
    totalWords += step.description.split(' ').length; // count words in step description
    // Note: We're not counting words in video URLs as they're not typically read
  });

  const readingTimeInSeconds = Math.ceil(totalWords / wordsPerSecond);

  if (readingTimeInSeconds < 60) {
    return readingTimeInSeconds === 1 ? '1 second' : `${readingTimeInSeconds} seconds`;
  } else {
    const readingTimeInMinutes = Math.floor(readingTimeInSeconds / 60);
    return readingTimeInMinutes === 1 ? '1 minute' : `${readingTimeInMinutes} minutes`;
  }
}
