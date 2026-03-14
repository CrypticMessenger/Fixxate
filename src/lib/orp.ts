export function getORPIndex(word: string): number {
  // Find the actual letters to avoid counting leading punctuation
  const match = word.match(/[a-zA-Z0-9]/);
  const leadingOffset = match ? match.index || 0 : 0;
  
  const clean = word.replace(/[^a-zA-Z0-9]/g, '');
  const len = clean.length;
  
  let offset = 0;
  if (len <= 1) offset = 0;
  else if (len <= 5) offset = 1;
  else if (len <= 9) offset = 2;
  else offset = Math.floor(len * 0.35);

  return leadingOffset + offset;
}

export interface ORPParts {
  before: string;
  orp: string;
  after: string;
}

export function splitWordByORP(word: string): ORPParts {
  const index = getORPIndex(word);
  return {
    before: word.substring(0, index),
    orp: word.charAt(index),
    after: word.substring(index + 1)
  };
}
