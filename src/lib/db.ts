import localforage from 'localforage';
import type { ParsedBook } from './types';

localforage.config({
  name: 'RSVPReader',
  storeName: 'books',
  description: 'Stores parsed epubs and pdfs for RSVP reading'
});

export async function saveBookToDb(book: ParsedBook): Promise<void> {
  await localforage.setItem(book.id, book);
}

export async function getBookFromDb(id: string): Promise<ParsedBook | null> {
  return await localforage.getItem(id);
}

export async function getAllBooksFromDb(): Promise<ParsedBook[]> {
  const books: ParsedBook[] = [];
  await localforage.iterate((value: ParsedBook) => {
    books.push(value);
  });
  // Sort by some criteria if we had addedAt timestamp, for now just sort by title
  return books.sort((a, b) => a.title.localeCompare(b.title));
}

export async function deleteBookFromDb(id: string): Promise<void> {
  await localforage.removeItem(id);
}
