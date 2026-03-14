import { useState } from 'react';
import { Library } from './components/Library';
import { RSVPDisplay } from './components/RSVPDisplay';
import { parseBook } from './lib/parsers';
import type { ParsedBook, ReadingNote } from './lib/types';
import { saveBookToDb } from './lib/db';
import { useSettings } from './hooks/useSettings';
import { useProgress } from './hooks/useProgress';
import { CurateScreen } from './components/CurateScreen';
import { ReadingSummary } from './components/ReadingSummary';
import type { ExtractedPage, ExtractedParagraph } from './lib/extractor';

export default function App() {
  const [activeBook, setActiveBook] = useState<ParsedBook | null>(null);
  const [curatingPage, setCuratingPage] = useState<ExtractedPage | null>(null);
  const [finishedBook, setFinishedBook] = useState<ParsedBook | null>(null);
  const [sessionNotes, setSessionNotes] = useState<ReadingNote[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const { settings, updateSettings } = useSettings();
  const { clearProgress } = useProgress();

  const handleUpload = async (file: File) => {
    try {
      setIsParsing(true);
      const book = await parseBook(file);
      await saveBookToDb(book);
      setActiveBook(book);
    } catch (e) {
      console.error(e);
      alert('Failed to parse book. Check developer console for details.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleUrlParsed = (page: ExtractedPage) => {
    setCuratingPage(page);
  };

  const handleCurateStart = async (paragraphs: ExtractedParagraph[]) => {
    if (!curatingPage) return;
    
    // Convert extracted content into a ParsedBook format
    const curatedText = paragraphs.map(p => p.text).join('\n\n');
    const allWords: string[] = [];
    const paragraphOffsets: number[] = [];
    
    paragraphs.forEach(p => {
      paragraphOffsets.push(allWords.length);
      const words = p.text.split(/\s+/).filter((w: string) => w.length > 0);
      allWords.push(...words);
    });

    const book: ParsedBook = {
      id: `url-${btoa(curatingPage.url).slice(0, 16)}`,
      title: curatingPage.title,
      format: 'url',
      totalWords: allWords.length,
      chapters: [{
        id: 'main',
        title: 'Main Content',
        content: curatedText,
        words: allWords,
        globalWordOffset: 0,
        paragraphOffsets
      }]
    };

    await saveBookToDb(book);
    setCuratingPage(null);
    setActiveBook(book);
  };

  const handleSaveNotes = async (notes: ReadingNote[]) => {
    if (!activeBook) return;
    const updatedBook = { ...activeBook, notes };
    await saveBookToDb(updatedBook);
    setActiveBook(updatedBook);
  };

  const handleFinishReading = (notes: ReadingNote[]) => {
    setFinishedBook(activeBook);
    setSessionNotes(notes);
    setActiveBook(null);
  };

  const handleRestart = async () => {
    if (!finishedBook) return;
    
    // 1. Clear local storage progress
    clearProgress(finishedBook.id);
    
    // 2. Clear notes for the new session
    const bookWithoutNotes = { ...finishedBook, notes: [] };
    await saveBookToDb(bookWithoutNotes);
    
    // 3. Switch back to reader
    setActiveBook(bookWithoutNotes);
    setFinishedBook(null);
    setSessionNotes([]);
  };

  if (curatingPage) {
    return (
      <CurateScreen 
        page={curatingPage} 
        onBack={() => setCuratingPage(null)} 
        onStart={handleCurateStart}
        wpm={settings.wpm}
      />
    );
  }

  if (activeBook) {
    return (
      <RSVPDisplay 
        book={activeBook} 
        onExit={() => setActiveBook(null)} 
        onFinish={handleFinishReading}
        settings={settings}
        onUpdateSettings={updateSettings}
        onSaveNotes={handleSaveNotes}
      />
    );
  }

  if (finishedBook) {
    return (
      <ReadingSummary 
        book={finishedBook} 
        notes={sessionNotes} 
        onRestart={handleRestart}
        onExit={() => {
          setFinishedBook(null);
          setSessionNotes([]);
        }} 
      />
    );
  }

  return (
    <Library 
      onUpload={handleUpload} 
      onResume={setActiveBook} 
      onUrlParsed={handleUrlParsed}
      isParsing={isParsing} 
    />
  );
}
