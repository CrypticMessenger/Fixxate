import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TopBar } from './TopBar';
import { WordFrame } from './WordFrame';
import { ContextStrip } from './ContextStrip';
import { Controls } from './Controls';
import { SettingsBar } from './SettingsBar';
import { useRSVPEngine } from '../hooks/useRSVPEngine';
import { useKeyboard } from '../hooks/useKeyboard';
import { useProgress } from '../hooks/useProgress';
import { PulseOverlay } from './PulseOverlay';
import { MarginNoteInput } from './MarginNoteInput';
import type { ParsedBook, ReadingNote } from '../lib/types';
import type { ReaderSettings, ThemeType } from '../hooks/useSettings';

interface RSVPDisplayProps {
  book: ParsedBook;
  onExit: () => void;
  onFinish?: (notes: ReadingNote[]) => void;
  settings: ReaderSettings;
  onUpdateSettings: (updates: Partial<ReaderSettings>) => void;
  onSaveNotes?: (notes: ReadingNote[]) => void;
}

const PULSE_PROMPTS = [
  "What was the main point of the last section?",
  "Did anything surprise you in the text you just read?",
  "How would you summarize that last part in one sentence?",
  "What is one key takeaway from this section?",
  "Does this connect to anything else you already know?",
  "If you had to explain this to a friend, what would you say?",
  "What was the most important word or concept just now?"
];

export const RSVPDisplay: React.FC<RSVPDisplayProps> = ({ 
  book, 
  onExit, 
  onFinish,
  settings, 
  onUpdateSettings,
  onSaveNotes
}) => {
  const { getProgress, saveProgress } = useProgress();
  const [pulseActive, setPulseActive] = useState(false);
  const [noteInputActive, setNoteInputActive] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [notes, setNotes] = useState<ReadingNote[]>(book.notes || []);
  const [lastPulseIndex, setLastPulseIndex] = useState(-1);
  
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
    
    // Check for finished state
    if (engine.wordIndex >= allWords.length - 1 && !engine.isPlaying && engine.wordIndex > 0) {
      saveProgress(book.id, allWords.length);
      if (onFinish) onFinish(notes);
    }
  }, [engine.isPlaying, book.id, engine.wordIndex, saveProgress, allWords.length, onFinish, notes]);

  // Comprehension Pulse Logic: Check for paragraph boundaries
  useEffect(() => {
    if (!engine.isPlaying || pulseActive || noteInputActive) return;

    const chapter = book.chapters[0]; // Currently support single chapter for URLs
    if (!chapter?.paragraphOffsets) return;

    // Pulse frequency: every 5 paragraphs (configurable later)
    const frequency = 5;
    const offsets = chapter.paragraphOffsets;
    
    for (let i = frequency; i < offsets.length; i += frequency) {
      const boundaryIndex = offsets[i];
      // If we just crossed a boundary
      if (engine.wordIndex >= boundaryIndex && lastPulseIndex < boundaryIndex) {
        engine.pause();
        setLastPulseIndex(boundaryIndex);
        const randomPrompt = PULSE_PROMPTS[Math.floor(Math.random() * PULSE_PROMPTS.length)];
        setCurrentPrompt(randomPrompt);
        setPulseActive(true);
        break;
      }
    }
  }, [engine.wordIndex, engine.isPlaying, pulseActive, noteInputActive, book.chapters, lastPulseIndex]);

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
    },
    onAddNote: () => {
      engine.pause();
      setNoteInputActive(true);
    }
  });

  const handlePulseResponse = (response: string) => {
    const newNote: ReadingNote = {
      id: uuidv4(),
      wordIndex: engine.wordIndex,
      text: response,
      timestamp: Date.now(),
      type: 'pulse',
      prompt: currentPrompt
    };
    const updated = [...notes, newNote];
    setNotes(updated);
    if (onSaveNotes) onSaveNotes(updated);
    setPulseActive(false);
    engine.play();
  };

  const handleManualNote = (text: string) => {
    const newNote: ReadingNote = {
      id: uuidv4(),
      wordIndex: engine.wordIndex,
      text: text,
      timestamp: Date.now(),
      type: 'manual'
    };
    const updated = [...notes, newNote];
    setNotes(updated);
    if (onSaveNotes) onSaveNotes(updated);
    setNoteInputActive(false);
    engine.play();
  };


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

      {pulseActive && (
        <PulseOverlay 
          prompt={currentPrompt}
          onConfirm={handlePulseResponse}
          onSkip={() => { setPulseActive(false); engine.play(); }}
        />
      )}

      {noteInputActive && (
        <MarginNoteInput 
          onSave={handleManualNote}
          onCancel={() => { setNoteInputActive(false); engine.play(); }}
        />
      )}
    </div>
  );
};
