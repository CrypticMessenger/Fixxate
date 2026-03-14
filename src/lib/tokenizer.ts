export function tokenizeText(text: string): string[] {
  // Normalize whitespace (including non-breaking spaces) to regular spaces
  const normalized = text.replace(/[\u00A0\u1680​\u180e\u2000-\u200a\u202f\u205f\u3000]/g, ' ');
  
  // Split on one or more spaces, and filter out empty strings
  const words = normalized.trim().split(/\s+/).filter(word => word.length > 0);
  
  return words;
}

export function isSentenceEnd(word: string): boolean {
  return /[.!?]["']?$/.test(word);
}

export function isClauseEnd(word: string): boolean {
  return /[,;:]["']?$/.test(word);
}

/**
 * Groups words into sentences for the context strip.
 * This is a lightweight grouping based on punctuation.
 */
export function groupIntoSentences(words: string[]): string[][] {
  const sentences: string[][] = [];
  let currentSentence: string[] = [];
  
  for (const word of words) {
    currentSentence.push(word);
    if (isSentenceEnd(word)) {
      sentences.push(currentSentence);
      currentSentence = [];
    }
  }
  
  if (currentSentence.length > 0) {
    sentences.push(currentSentence);
  }
  
  return sentences;
}
