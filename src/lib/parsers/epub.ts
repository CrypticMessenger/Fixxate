import ePub from 'epubjs';
import type { ParsedBook, ParsedChapter } from '../types';
import { tokenizeText } from '../tokenizer';

export async function parseEpub(file: File): Promise<ParsedBook> {
  const book = ePub(await file.arrayBuffer());
  
  await book.ready;
  
  const metadata = await book.loaded.metadata;
  const navigation = await book.loaded.navigation;
  const spine = await book.loaded.spine;
  
  const title = metadata.title || file.name.replace(/\.epub$/i, '');
  const author = metadata.creator;
  
  const chapters: ParsedChapter[] = [];
  let globalWordOffset = 0;
  
  // Create a mapping of href to title from the navigation TOC
  const hrefToTitle = new Map<string, string>();
  const collectTitles = (navItems: any[]) => {
    for (const item of navItems) {
      if (item.href) {
        // ePub.js sometimes includes hash fragments in hrefs, strip them for matching Spine items
        const cleanHref = item.href.split('#')[0];
        if (!hrefToTitle.has(cleanHref)) {
          hrefToTitle.set(cleanHref, item.label.trim());
        }
      }
      if (item.subitems && item.subitems.length > 0) {
        collectTitles(item.subitems);
      }
    }
  };
  collectTitles(navigation.toc);
  
  // Iterate through all spine items
  const spineItems = (spine as any).items || [];
  for (let i = 0; i < spineItems.length; i++) {
    const item = spineItems[i];
    try {
      // Load the document for this spine item
      const doc = await book.load(item.url) as Document;
      
      // Extract text, stripping HTML
      // Basic approach: get textContext of the body
      const body = doc.querySelector('body');
      if (!body) continue;
      
      // We want to preserve paragraph breaks somewhat, maybe spacing out text?
      // textContent removes tags but jams text together if there are no spaces
      // Replace block elements with newlines first?
      const blockElements = body.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, blockquote');
      Array.from(blockElements).forEach(el => {
        el.appendChild(doc.createTextNode(' '));
      });
      
      const text = body.textContent || '';
      const words = tokenizeText(text);
      
      if (words.length === 0) continue;
      
      let chapTitle = hrefToTitle.get(item.href) || `Chapter ${chapters.length + 1}`;
      
      chapters.push({
        id: item.idref,
        title: chapTitle,
        content: '', // Omit to save memory
        words: words,
        globalWordOffset: globalWordOffset
      });
      
      globalWordOffset += words.length;
    } catch (err) {
      console.error(`Failed to load spine item ${item.url}`, err);
    }
  }
  
  // Book cleanup
  book.destroy();
  
  return {
    id: crypto.randomUUID(), // Or generate a hash from the file
    title,
    author,
    format: 'epub',
    chapters,
    totalWords: globalWordOffset
  };
}
