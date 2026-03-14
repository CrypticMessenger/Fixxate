import React, { useEffect, useMemo, useState } from 'react';
import { TopBar } from './TopBar';
import { WordFrame } from './WordFrame';
import { ContextStrip } from './ContextStrip';
import { Controls } from './Controls';
import { SettingsBar } from './SettingsBar';
import { useRSVPEngine } from '../hooks/useRSVPEngine';
import { useKeyboard } from '../hooks/useKeyboard';
import { useProgress } from '../hooks/useProgress';
import type { ParsedBook } from '../lib/types';
import type { ReaderSettings, ThemeType } from '../hooks/useSettings';

interface RSVPDisplayProps {
  book: ParsedBook;
  onExit: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (updates: Partial<ReaderSettings>) => void;
}

export const RSVPDisplay: React.FC<RSVPDisplayProps> = ({ 
  book, 
  onExit, 
  settings, 
  onUpdateSettings 
}) => {
  const { getProgress, saveProgress } = useProgress();
  
  // Load initial position
  const [initialIndex] = useState(() => {
    const saved = getProgress(book.id);
    return saved ? saved.wordIndex : 0;
  });

  // Flat array of all words across chapters for the engine
  const allWords = useMemo(() => {
    return book.chapters.flatMap(c => c.words);
  }, [book]);

  const engine = useRSVPEngine({
    words: allWords,
    initialWPM: settings.wpm,
    initialIndex,
    smartPausing: settings.smartPausing,
    chunkSize: settings.chunkSize
  });

  // Automatically save progress every 5 seconds or when paused
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress(book.id, engine.wordIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [book.id, engine.wordIndex, saveProgress]);

  useEffect(() => {
    if (!engine.isPlaying) {
      saveProgress(book.id, engine.wordIndex);
    }
  }, [engine.isPlaying, book.id, engine.wordIndex, saveProgress]);

  // Keep WPM in sync with settings
  useEffect(() => {
    if (settings.wpm !== engine.wpm) {
      engine.setWPM(settings.wpm);
    }
  }, [settings.wpm, engine]);

  const handleWpmChange = (newWpm: number) => {
    engine.setWPM(newWpm);
    onUpdateSettings({ wpm: newWpm });
  };

  useKeyboard({
    onPlayPause: () => {
      if (engine.isPlaying) engine.pause();
      else engine.play();
    },
    onSeekWord: (delta) => engine.seek(engine.wordIndex + delta),
    onSeekSentence: (delta) => {
      // Basic sentence jump logic: jump arbitrary words for now or use sentence boundaries
      engine.seek(engine.wordIndex + (delta > 0 ? 15 : -15));
    },
    onWpmChange: (delta) => handleWpmChange(engine.wpm + delta),
    onExit: () => {
      engine.pause();
      saveProgress(book.id, engine.wordIndex);
      onExit();
    },
    onCycleTheme: () => {
      const themes: ThemeType[] = ['light', 'dark', 'sepia'];
      const nextIdx = (themes.indexOf(settings.theme) + 1) % themes.length;
      onUpdateSettings({ theme: themes[nextIdx] });
    }
  });


  const progressPct = allWords.length > 0 ? engine.wordIndex / allWords.length : 0;

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <TopBar 
        bookTitle={book.title}
        progress={progressPct}
        percentageText={`${Math.round(progressPct * 100)}%`}
        onSeek={(pct) => engine.seek(Math.floor(pct * allWords.length))}
        onMenuClick={onExit}
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <ContextStrip 
          words={allWords} 
          currentIndex={engine.wordIndex} 
          position="before" 
          visible={settings.contextEnabled}
        />
        
        <WordFrame 
          word={engine.currentWord}
          wpm={engine.wpm}
          wordIndex={engine.wordIndex}
          totalWords={allWords.length}
          orpEnabled={settings.orpEnabled}
          isPlaying={engine.isPlaying}
          fontSize={settings.fontSize}
          fontFamily={
            settings.fontFamily === 'sans' ? 'system-ui, -apple-system, sans-serif' :
            settings.fontFamily === 'serif' ? 'Georgia, serif' :
            "'Courier New', monospace"
          }
        />
        
        <ContextStrip 
          words={allWords} 
          currentIndex={engine.wordIndex} 
          position="after" 
          visible={settings.contextEnabled}
        />
      </main>

      <Controls 
        isPlaying={engine.isPlaying}
        onPlayPause={() => engine.isPlaying ? engine.pause() : engine.play()}
        onNavigate={(amount, unit) => {
          if (unit === 'word') engine.seek(engine.wordIndex + amount);
          else if (unit === 'chapter') engine.seekChapter(book.chapters, amount > 0 ? 1 : -1);
          else engine.seek(engine.wordIndex + (amount > 0 ? 15 : -15));
        }}
        wpm={engine.wpm}
        onWpmChange={handleWpmChange}
      />

      <SettingsBar 
        settings={settings}
        onUpdate={onUpdateSettings}
      />
    </div>
  );
};
