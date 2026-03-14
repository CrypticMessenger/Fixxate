import * as pdfjsLib from 'pdfjs-dist';
import type { ParsedBook, ParsedChapter } from '../types';
import { tokenizeText } from '../tokenizer';

// Setup PDF worker using a stable CDN to entirely bypass Vite/esbuild worker bundling issues
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

export async function parsePdf(file: File): Promise<ParsedBook> {
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDocument = await loadingTask.promise;
  
  const numPages = pdfDocument.numPages;
  let title = file.name.replace(/\.pdf$/i, '');
  let author: string | undefined = undefined;

  try {
    const metadata = await pdfDocument.getMetadata();
    title = (metadata.info as any)?.Title || title;
    author = (metadata.info as any)?.Author;
  } catch (err) {
    console.warn('Failed to parse PDF metadata, continuing without it', err);
  }
  
  const chapters: ParsedChapter[] = [];
  let globalWordOffset = 0;
  
  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    
    // Group text items, optionally removing hyphenation at line breaks
    // Basic approach: just join with spaces, maybe check if ends with hyphen
    let pageText = '';
    let lastItemWasHyphen = false;
    
    for (const item of textContent.items) {
      if ('str' in item) {
        let str = item.str;
        if (lastItemWasHyphen && str.length > 0) {
           // Previous line ended with a hyphen, assume the word continues
           // remove leading spaces
           str = str.replace(/^\s+/, '');
        }
        
        lastItemWasHyphen = str.endsWith('-');
        if (lastItemWasHyphen) {
          // Remove the trailing hyphen for the text joining
          str = str.slice(0, -1);
        }
        
        pageText += str + (lastItemWasHyphen ? '' : ' ');
      }
    }
    
    // Further cleanup: headers and footers are tricky without layout analysis
    // We'll leave them in for the MVP and just tokenize the text
    const words = tokenizeText(pageText);
    
    if (words.length > 0) {
      chapters.push({
        id: `page-${i}`,
        title: `Page ${i}`,
        content: '',
        words: words,
        globalWordOffset: globalWordOffset,
      });
      globalWordOffset += words.length;
    }
  }
  
  return {
    id: crypto.randomUUID(), // Could use md5 of file or from metadata
    title,
    author,
    format: 'pdf',
    chapters,
    totalWords: globalWordOffset
  };
}
