import { useState, useCallback } from 'react';
import type { BookPosition } from '../lib/types';

const PROGRESS_KEY = 'rsvp_progress';

export function useProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, BookPosition>>(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const saveProgress = useCallback((bookId: string, wordIndex: number) => {
    setProgressMap(prev => {
      const next = {
        ...prev,
        [bookId]: {
          bookId,
          wordIndex,
          timestamp: Date.now()
        }
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearProgress = useCallback((bookId: string) => {
    setProgressMap(prev => {
      const next = { ...prev };
      delete next[bookId];
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getProgress = useCallback((bookId: string) => {
    return progressMap[bookId] || null;
  }, [progressMap]);

  return { progressMap, saveProgress, getProgress, clearProgress };
}
