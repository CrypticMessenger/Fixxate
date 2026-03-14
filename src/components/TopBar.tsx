import React from 'react';
import { Menu } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface TopBarProps {
  bookTitle: string;
  author?: string;
  chapterTitle?: string;
  pageInfo?: string; // "p. 87 / 188"
  progress: number; // 0 to 1
  percentageText: string; // "38%"
  onSeek: (percentage: number) => void;
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  bookTitle,
  author,
  chapterTitle,
  pageInfo,
  progress,
  percentageText,
  onSeek,
  onMenuClick
}) => {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-border-color bg-white dark:bg-[#222] sepia:bg-[#eaddc5]">
      <div className="flex items-center gap-4 text-sm font-medium">
        <span className="text-text-color font-semibold">
          {bookTitle} {author ? `— ${author}` : ''}
        </span>
        
        {chapterTitle && (
          <div className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 sepia:bg-blue-500/10 sepia:text-blue-800 border border-blue-200 dark:border-blue-800 sepia:border-blue-300">
            {chapterTitle}
          </div>
        )}
        
        {pageInfo && (
          <div className="px-3 py-1.5 rounded-full border border-border-color text-text-muted">
            {pageInfo}
          </div>
        )}
      </div>
      
      <div className="flex items-center flex-1 max-w-2xl px-8">
        <ProgressBar progress={progress} onSeek={onSeek} />
        <span className="text-sm font-mono text-text-muted ml-4 w-10 text-right">
          {percentageText}
        </span>
      </div>
      
      <button 
        onClick={onMenuClick}
        className="p-2 border border-border-color rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <Menu size={18} />
      </button>
    </div>
  );
};
