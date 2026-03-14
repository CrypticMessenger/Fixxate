import { tokenizeText } from '../tokenizer';
import type { ParsedBook, ParsedChapter } from '../types';

export async function parseMarkdown(file: File): Promise<ParsedBook> {
  const text = await file.text();
  const id = `${file.name}-${file.size}-${file.lastModified}`;
  
  // Basic chapter splitting by # Headings
  const sections = text.split(/\n(?=# )/);
  
  const chapters: ParsedChapter[] = [];
  let globalWordOffset = 0;
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split('\n');
    let title = lines[0].startsWith('# ') ? lines[0].substring(2) : `Section ${i + 1}`;
    
    // Clean up title (remove trailing # or extra spaces)
    title = title.trim();
    
    const content = section;
    const words = tokenizeText(content);
    
    chapters.push({
      id: `chapter-${i + 1}`,
      title,
      content,
      words,
      globalWordOffset,
    });
    
    globalWordOffset += words.length;
  }
  
  return {
    id,
    title: file.name.replace(/\.[^/.]+$/, ""), // Filename without extension
    format: 'md',
    chapters,
    totalWords: globalWordOffset,
  };
}
