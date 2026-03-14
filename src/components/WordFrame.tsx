import React from 'react';
import clsx from 'clsx';
import { splitWordByORP } from '../lib/orp';

interface WordFrameProps {
  word: string;
  wpm: number;
  wordIndex: number;
  totalWords: number;
  orpEnabled?: boolean;
}

export const WordFrame: React.FC<WordFrameProps> = ({ 
  word, 
  wpm, 
  wordIndex, 
  totalWords, 
  orpEnabled = true 
}) => {
  const { before, orp, after } = splitWordByORP(word || ' ');

  return (
    <div className="flex flex-col items-center justify-center my-8 select-none">
      <div 
        className={clsx(
          "w-full max-w-2xl border border-border-color rounded-2xl bg-white shadow-sm dark:bg-[#222]",
          "h-48 sm:h-64 flex items-center justify-center relative tabular-nums-mono overflow-hidden"
        )}
      >
        <div className="flex items-center text-5xl sm:text-6xl font-mono tracking-wide text-text-color">
          {/* We use a fixed width in 'em' units so that regardless of font size, 
              the before and after blocks are symmetrically balanced, forcing the ORP to center. */}
          <span className="w-[5em] text-right inline-block whitespace-pre">{before}</span>
          <span className={clsx("inline-block text-center whitespace-pre", orpEnabled && "text-accent-color font-semibold")}>
            {orp}
          </span>
          <span className="w-[5em] text-left inline-block whitespace-pre">{after}</span>
        </div>
        
        {/* Alignment Guide (Not in mockup but requested "thin progress bar and chapter/page context live quietly in periphery") */}
        {orpEnabled && (
          <div className="absolute top-[20%] bottom-[20%] left-[calc(50%+0.1em)] w-[2px] bg-accent-color/10 -translate-x-1/2 rounded-full" />
        )}
        
        {/* Subtle crosshairs or tick marks can go here if needed */}
        {orpEnabled && (
          <div className="absolute top-4 left-[calc(50%+0.1em)] w-[2px] h-3 bg-accent-color/20 -translate-x-1/2 rounded-full" />
        )}
        {orpEnabled && (
          <div className="absolute bottom-4 left-[calc(50%+0.1em)] w-[2px] h-3 bg-accent-color/20 -translate-x-1/2 rounded-full" />
        )}
      </div>
      
      <div className="mt-4 text-sm text-text-muted font-mono flex gap-3 opacity-70">
        <span>{wpm} WPM</span>
        <span>&middot;</span>
        <span>word {wordIndex + 1} of {totalWords}</span>
      </div>
    </div>
  );
};
