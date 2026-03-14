import { useState } from 'react';
import { Library } from './components/Library';
import { RSVPDisplay } from './components/RSVPDisplay';
import { parseBook } from './lib/parsers';
import type { ParsedBook } from './lib/types';
import { saveBookToDb } from './lib/db';
import { useSettings } from './hooks/useSettings';

export default function App() {
  const [activeBook, setActiveBook] = useState<ParsedBook | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { settings, updateSettings } = useSettings();

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

  if (!activeBook) {
    return <Library onUpload={handleUpload} onResume={setActiveBook} isParsing={isParsing} />;
  }

  return (
    <RSVPDisplay 
      book={activeBook} 
      onExit={() => setActiveBook(null)} 
      settings={settings} 
      onUpdateSettings={updateSettings} 
    />
  );
}
