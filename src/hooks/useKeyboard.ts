import { useEffect } from 'react';

interface KeyboardActions {
  onPlayPause: () => void;
  onWpmChange: (delta: number) => void;
  onSeekWord: (delta: number) => void;
  onSeekSentence: (delta: number) => void;
  onCycleTheme?: () => void;
  onExit?: () => void;
}

export function useKeyboard(actions: KeyboardActions, isEnabled: boolean = true) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      let handled = false;

      switch (e.key) {
        case ' ':
          actions.onPlayPause();
          handled = true;
          break;
        case 'ArrowUp':
        case '+':
        case '=':
          actions.onWpmChange(25);
          handled = true;
          break;
        case 'ArrowDown':
        case '-':
        case '_':
          actions.onWpmChange(-25);
          handled = true;
          break;
        case 'ArrowLeft':
          actions.onSeekWord(-10);
          handled = true;
          break;
        case 'ArrowRight':
          actions.onSeekWord(10);
          handled = true;
          break;
        case '[':
          actions.onSeekSentence(-1);
          handled = true;
          break;
        case ']':
          actions.onSeekSentence(1);
          handled = true;
          break;
        case 'Escape':
          if (actions.onExit) {
            actions.onExit();
            handled = true;
          }
          break;
        case 't':
        case 'T':
          if (actions.onCycleTheme) {
            actions.onCycleTheme();
            handled = true;
          }
          break;
      }

      if (handled) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, isEnabled]);
}
