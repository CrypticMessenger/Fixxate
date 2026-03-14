import { parseEpub } from './epub';
import { parsePdf } from './pdf';
import type { ParsedBook } from '../types';

export async function parseBook(file: File): Promise<ParsedBook> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'epub' || file.type === 'application/epub+zip') {
    return parseEpub(file);
  } else if (extension === 'pdf' || file.type === 'application/pdf') {
    return parsePdf(file);
  } else {
    throw new Error(`Unsupported file type: ${extension}`);
  }
}

export * from './epub';
export * from './pdf';
