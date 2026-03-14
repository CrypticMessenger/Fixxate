import { useState, useRef, useCallback, useEffect } from 'react';

export interface RSVPEngine {
  currentWord: string;
  wordIndex: number;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  seek: (index: number) => void;
  seekChapter: (chapters: { globalWordOffset: number }[], direction: 1 | -1) => void;
  setWPM: (wpm: number) => void;
  wpm: number;
}

export interface RSVPOptions {
  words: string[];
  initialWPM?: number;
  initialIndex?: number;
  smartPausing?: boolean;
  chunkSize?: number;
}

function getWordDelay(word: string, baseWPM: number, smartPausing: boolean): number {
  const baseMs = 60_000 / baseWPM;
  if (!smartPausing) return baseMs;

  let multiplier = 1;

  // Reduce speed on long words
  if (word.length > 12) multiplier *= 1.4;

  // Sentence ends
  if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
    multiplier *= 2.2;
  }
  // Clauses
  else if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) {
    multiplier *= 1.5;
  }

  return baseMs * multiplier;
}

export function useRSVPEngine({ 
  words, 
  initialWPM = 250, 
  initialIndex = 0,
  smartPausing = true,
  chunkSize = 1
}: RSVPOptions): RSVPEngine {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordIndex, setWordIndex] = useState(Math.max(0, Math.min(initialIndex, words.length - 1)));
  const [wpm, setWpm] = useState(initialWPM);

  const timeoutRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const wordIndexRef = useRef(wordIndex);
  const wpmRef = useRef(wpm);
  const wordsRef = useRef(words);
  const smartPausingRef = useRef(smartPausing);
  const chunkSizeRef = useRef(chunkSize);

  // Keep refs in sync for the recursive timeout loop
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { wordIndexRef.current = wordIndex; }, [wordIndex]);
  useEffect(() => { wpmRef.current = wpm; }, [wpm]);
  useEffect(() => { wordsRef.current = words; }, [words]);
  useEffect(() => { smartPausingRef.current = smartPausing; }, [smartPausing]);
  useEffect(() => { chunkSizeRef.current = chunkSize; }, [chunkSize]);

  const loop = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    if (wordIndexRef.current >= wordsRef.current.length) {
      setIsPlaying(false);
      return;
    }

    // Step forward by chunkSize
    setWordIndex(prev => {
      const next = prev + chunkSizeRef.current;
      wordIndexRef.current = next;
      return next;
    });

    if (wordIndexRef.current >= wordsRef.current.length) {
      setIsPlaying(false);
      return;
    }

    // Current words chunk
    const chunkWords = wordsRef.current.slice(
      wordIndexRef.current, 
      wordIndexRef.current + chunkSizeRef.current
    );
    // Combine to get total delay logic
    const currentWord = chunkWords.join(' ');
    // Adjust delay slightly for chunks (e.g. 2 words = 2x base delay approx, though WPM accounts for this)
    // Wait, 250 WPM = 250 words per minute. If we show 2 words, we should display them for 2x the time,
    // so the per-word rate stays 250 WPM.
    const baseDelay = getWordDelay(currentWord, wpmRef.current, smartPausingRef.current);
    const delay = baseDelay * chunkSizeRef.current;

    timeoutRef.current = window.setTimeout(loop, delay);
  }, []);

  const play = useCallback(() => {
    if (wordsRef.current.length === 0 || wordIndexRef.current >= wordsRef.current.length - 1) return;
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const seek = useCallback((index: number) => {
    const validIndex = Math.max(0, Math.min(index, wordsRef.current.length - 1));
    setWordIndex(validIndex);
    wordIndexRef.current = validIndex;
  }, []);

  const seekChapter = useCallback((chapters: { globalWordOffset: number }[], direction: 1 | -1) => {
    // Current chapter is the one where offset <= current word
    let currentIndex = 0;
    for (let i = 0; i < chapters.length; i++) {
        if (wordIndexRef.current >= chapters[i].globalWordOffset) {
            currentIndex = i;
        } else {
            break;
        }
    }

    let targetIndex = currentIndex + direction;
    
    // Boundary checks
    if (targetIndex < 0) targetIndex = 0;
    if (targetIndex >= chapters.length) targetIndex = chapters.length - 1;

    // Special case: If we are going backward (-1) but we are deeply into the current chapter,
    // we should just jump to the *start* of the current chapter instead of skipping it entirely.
    if (direction === -1 && wordIndexRef.current > chapters[currentIndex].globalWordOffset + 15) {
        targetIndex = currentIndex;
    }

    seek(chapters[targetIndex].globalWordOffset);
  }, [seek]);

  const setWPM = useCallback((newWpm: number) => {
    const validWpm = Math.max(10, Math.min(newWpm, 2000));
    setWpm(validWpm);
    wpmRef.current = validWpm;
  }, []);

  // Trigger loop or clear when play state changes
  useEffect(() => {
    if (isPlaying) {
      loop();
    } else {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isPlaying, loop]);

  const currentWord = words.slice(wordIndex, wordIndex + chunkSize).join(' ') || '';

  return {
    currentWord,
    wordIndex,
    isPlaying,
    play,
    pause,
    seek,
    seekChapter,
    setWPM,
    wpm
  };
}
