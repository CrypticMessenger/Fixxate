import { useState, useEffect, useCallback } from 'react';

export type ThemeType = 'light' | 'dark' | 'sepia';
export type FontType = 'sans' | 'serif' | 'mono';

export interface ReaderSettings {
  wpm: number;
  chunkSize: number;
  smartPausing: boolean;
  orpEnabled: boolean;
  theme: ThemeType;
  fontFamily: FontType;
  fontSize: number;
  contextEnabled: boolean;
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  wpm: 250,
  chunkSize: 1,
  smartPausing: true,
  orpEnabled: true,
  theme: 'light',
  fontFamily: 'sans',
  fontSize: 48,
  contextEnabled: true,
};

const STORAGE_KEY = 'rsvp_reader_settings';

export function useSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const updateSettings = useCallback((updates: Partial<ReaderSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'sepia');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  // Apply font family to root
  useEffect(() => {
    const root = document.documentElement;
    const fontMap: Record<string, string> = {
      sans: 'system-ui, -apple-system, sans-serif',
      serif: 'Georgia, serif',
      mono: "'Courier New', monospace",
    };
    root.style.setProperty('--reader-font', fontMap[settings.fontFamily] || fontMap.sans);
  }, [settings.fontFamily]);

  return { settings, updateSettings };
}
