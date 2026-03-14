import React from 'react';
import { Play, Pause } from 'lucide-react';
import clsx from 'clsx';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNavigate: (amount: number, unit: 'word' | 'sentence' | 'chapter') => void;
  wpm: number;
  onWpmChange: (wpm: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNavigate,
  wpm,
  onWpmChange
}) => {
  const btnClass = "flex items-center justify-center gap-1.5 border border-border-color rounded-[10px] bg-bg2 text-text2 cursor-pointer text-xs font-mono px-3 py-2 transition-all hover:border-border2 hover:bg-bg3 hover:text-text active:scale-[0.97] whitespace-nowrap";
  const iconBtnClass = "bg-transparent border-none text-text2 cursor-pointer text-lg leading-none px-1 transition-colors hover:text-orp";

  return (
    <div className="flex items-center justify-center gap-2 py-3 border-t border-border-color flex-shrink-0 flex-wrap">
      <button 
        className={btnClass}
        onClick={() => onNavigate(-1, 'chapter')}
        title="Previous chapter/page"
      >
        &laquo;
      </button>

      <button 
        className={btnClass}
        onClick={() => onNavigate(-1, 'sentence')}
        title="Previous sentence"
      >
        &minus;10
      </button>
      
      <button 
        className={clsx(
          "flex items-center justify-center gap-1.5 border rounded-[10px] cursor-pointer text-xs font-mono transition-all active:scale-[0.97] whitespace-nowrap",
          "bg-orp border-orp text-white px-5 font-bold min-w-[100px] hover:brightness-[0.88] hover:bg-orp hover:border-orp hover:text-white"
        )}
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <>
            <Pause size={14} className="fill-current" /> pause
          </>
        ) : (
          <>
            <Play size={14} className="fill-current" /> play
          </>
        )}
      </button>
      
      <button 
        className={btnClass}
        onClick={() => onNavigate(1, 'sentence')}
        title="Next sentence"
      >
        +10
      </button>

      <button 
        className={btnClass}
        onClick={() => onNavigate(1, 'chapter')}
        title="Next chapter/page"
      >
        &raquo;
      </button>
      
      <div className="w-[1px] h-6 bg-border-color flex-shrink-0 mx-1 block"></div>
      
      <div className="flex items-center gap-1.5 border border-border-color rounded-[10px] bg-bg2 px-3 py-1.5">
        <button 
          className={iconBtnClass} 
          onClick={() => onWpmChange(wpm - 25)}
        >
          &minus;
        </button>
        <div className="font-mono text-[13px] font-bold min-w-[26px] text-center text-text-color flex items-baseline gap-1">
          {wpm} <span className="font-mono text-[10px] text-text3 font-normal">wpm</span>
        </div>
        <button 
          className={iconBtnClass} 
          onClick={() => onWpmChange(wpm + 25)}
        >
          +
        </button>
      </div>
    </div>
  );
};
