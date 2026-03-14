import React from 'react';
import { 
  Play, Pause, ChevronsLeft, ChevronsRight, 
  ChevronLeft, ChevronRight, Minus, Plus 
} from 'lucide-react';
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
  const btnClass = "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border-color hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors font-medium text-sm";
  const iconBtnClass = "p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors";

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <button 
        className={btnClass}
        onClick={() => onNavigate(-1, 'chapter')}
        title="Previous chapter/page"
      >
        <ChevronsLeft size={18} /> page
      </button>

      <button 
        className={btnClass}
        onClick={() => onNavigate(-1, 'sentence')}
        title="Previous sentence"
      >
        <ChevronLeft size={18} /> sentence
      </button>
      
      <button 
        className={clsx(btnClass, "w-32 active:scale-[0.98] transition-all")}
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <>
            <Pause size={18} className="fill-current" /> pause
          </>
        ) : (
          <>
            <Play size={18} className="fill-current ml-1" /> play
          </>
        )}
      </button>
      
      <button 
        className={btnClass}
        onClick={() => onNavigate(1, 'sentence')}
        title="Next sentence"
      >
        sentence <ChevronRight size={18} />
      </button>

      <button 
        className={btnClass}
        onClick={() => onNavigate(1, 'chapter')}
        title="Next chapter/page"
      >
        page <ChevronsRight size={18} />
      </button>
      
      <div className="flex items-center ml-8 border border-border-color rounded-full bg-white dark:bg-[#222] px-2 py-1 relative">
        <button 
          className={iconBtnClass} 
          onClick={() => onWpmChange(wpm - 25)}
        >
          <Minus size={18} />
        </button>
        <div className="w-16 text-center font-mono font-medium tracking-wide">
          {wpm} <span className="text-[10px] text-text-muted mt-1 uppercase tracking-wider block leading-none">WPM</span>
        </div>
        <button 
          className={iconBtnClass} 
          onClick={() => onWpmChange(wpm + 25)}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};
