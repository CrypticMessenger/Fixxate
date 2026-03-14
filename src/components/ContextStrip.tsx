import React, { useMemo } from 'react';
import clsx from 'clsx';
import { isSentenceEnd } from '../lib/tokenizer';

interface ContextStripProps {
  words: string[];
  currentIndex: number;
  position: 'before' | 'after';
  visible?: boolean;
}

export const ContextStrip: React.FC<ContextStripProps> = ({ 
  words, 
  currentIndex, 
  position,
  visible = true 
}) => {
  const sentence = useMemo(() => {
    if (!words || words.length === 0) return '';
    
    let result = '';
    
    if (position === 'before') {
      // Find the start of the current sentence or previous sentence
      let startIdx = currentIndex - 1;
      let endIdx = currentIndex - 1;
      
      // Look back for end of previous sentence
      while (startIdx >= 0 && !isSentenceEnd(words[startIdx])) {
        startIdx--;
      }
      
      // If we are at the beginning of a sentence, find the actual previous sentence
      if (startIdx >= 0 && startIdx === currentIndex - 1) {
        endIdx = startIdx;
        startIdx--;
        while (startIdx >= 0 && !isSentenceEnd(words[startIdx])) {
          startIdx--;
        }
      }
      
      startIdx = Math.max(0, startIdx + (isSentenceEnd(words[startIdx]) && startIdx !== endIdx ? 1 : 0));
      endIdx = Math.max(0, endIdx);
      
      if (endIdx >= startIdx && startIdx < currentIndex) {
        result = words.slice(startIdx, endIdx + 1).join(' ');
      }
      
    } else {
      // position === 'after'
      let startIdx = currentIndex + 1;
      let endIdx = startIdx;
      
      while (endIdx < words.length && !isSentenceEnd(words[endIdx])) {
        endIdx++;
      }
      
      // If the current word *is* the sentence end, find the start of the next sentence
      if (isSentenceEnd(words[currentIndex])) {
        startIdx = currentIndex + 1;
        endIdx = startIdx;
        while (endIdx < words.length && !isSentenceEnd(words[endIdx])) {
          endIdx++;
        }
      }
      
      if (startIdx < words.length) {
        result = words.slice(startIdx, Math.min(words.length, endIdx + 1)).join(' ');
      }
    }
    
    return result;
  }, [words, currentIndex, position]);

  if (!visible || !sentence) {
    return <div className="h-8 my-4" />; // Placeholder to prevent layout shift
  }

  return (
    <div 
      className={clsx(
        "min-h-12 flex items-center justify-center my-4 px-4 sm:px-8",
        "text-text-muted opacity-60 text-[15px] sm:text-base text-center transition-opacity duration-300",
        "break-words max-w-4xl"
      )}
    >
      {sentence}
    </div>
  );
};
