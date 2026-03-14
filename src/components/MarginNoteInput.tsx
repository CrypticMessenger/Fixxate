import React, { useState } from 'react';
import { StickyNote, X } from 'lucide-react';

interface MarginNoteInputProps {
  onSave: (text: string) => void;
  onCancel: () => void;
}

export const MarginNoteInput: React.FC<MarginNoteInputProps> = ({ onSave, onCancel }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (text.trim()) {
      onSave(text.trim());
    } else {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-bg2 border border-border-color rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-orp">
          <StickyNote size={18} />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">Add Margin Note</span>
          <div className="flex-1" />
          <button onClick={onCancel} className="text-text3 hover:text-text"><X size={18} /></button>
        </div>

        <input
          autoFocus
          type="text"
          className="w-full bg-bg px-4 py-3 rounded-xl border border-border-color focus:border-orp outline-none text-base transition-colors"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') onCancel();
          }}
        />

        <div className="mt-4 flex justify-between items-center text-[10px] text-text3 font-mono uppercase tracking-wider">
          <span>Enter to save • ESC to cancel</span>
          <button 
            onClick={() => handleSubmit()}
            className="text-orp font-bold hover:underline"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};
