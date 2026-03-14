import React from 'react';

interface TopBarProps {
  bookTitle: string;
  progress: number; // 0 to 1
  percentageText: string; // "38%"
  onSeek: (percentage: number) => void;
  onMenuClick: () => void;
  onSettingsClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  bookTitle,
  progress,
  percentageText,
  onSeek,
  onMenuClick,
  onSettingsClick
}) => {
  const tbtnClass = "w-[30px] h-[30px] rounded-[8px] border border-border-color bg-transparent text-text2 cursor-pointer text-base flex items-center justify-center flex-shrink-0 transition-colors hover:bg-bg3";

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct);
  };

  return (
    <div className="flex items-center gap-[10px] py-[9px] px-[14px] border-b border-border-color flex-shrink-0">
      <button className={tbtnClass} onClick={onMenuClick} title="Back to library">
        ←
      </button>
      <div 
        id="topbar-title"
        className="text-[12px] font-medium text-text2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]"
      >
        {bookTitle}
      </div>
      
      {/* Progress track */}
      <div 
        className="flex-1 h-[3px] bg-border-color rounded-[2px] cursor-pointer"
        onClick={handleTrackClick}
      >
        <div 
          className="h-[3px] bg-orp rounded-[2px] w-0 transition-[width_.1s] pointer-events-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="text-[11px] text-text3 font-mono min-w-[28px] text-right flex-shrink-0">
        {percentageText}
      </div>
      
      {onSettingsClick && (
        <button className={tbtnClass} onClick={onSettingsClick} title="Settings">
          ⚙
        </button>
      )}
    </div>
  );
};
