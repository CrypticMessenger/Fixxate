import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';

interface ProgressBarProps {
  progress: number; // 0 to 1
  onSeek?: (percentage: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  onSeek 
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !onSeek) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    onSeek(percentage);
  }, [onSeek]);

  return (
    <div 
      className="flex-1 max-w-xl mx-4 relative h-6 flex items-center cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
      ref={trackRef}
    >
      {/* Background track */}
      <div className="absolute inset-x-0 h-1.5 bg-border-color rounded-full overflow-hidden">
        {/* Fill track */}
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out rtl:origin-right"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      
      {/* Scrubber handle (visible on hover) */}
      <div 
        className={clsx(
          "absolute w-3 h-3 bg-white border-2 border-blue-600 rounded-full top-1/2 -translate-y-1/2 -ml-1.5 shadow-sm transition-opacity",
          isHovering ? "opacity-100" : "opacity-0"
        )}
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
};
