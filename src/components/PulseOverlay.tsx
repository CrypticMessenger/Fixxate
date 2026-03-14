import React, { useState } from 'react';
import { Send, X } from 'lucide-react';


interface PulseOverlayProps {
  prompt: string;
  onConfirm: (response: string) => void;
  onSkip: () => void;
}

export const PulseOverlay: React.FC<PulseOverlayProps> = ({ prompt, onConfirm, onSkip }) => {
  const [response, setResponse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim()) {
      onConfirm(response.trim());
    } else {
      onSkip();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-bg2 border border-border-color rounded-3xl p-8 shadow-2xl shadow-black/10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-orp/10 text-orp rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Comprehension Check</span>
          </div>
          <button 
            onClick={onSkip}
            className="p-2 text-text3 hover:text-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-text mb-8 leading-tight">
          {prompt}
        </h2>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            autoFocus
            className="w-full h-32 bg-bg p-5 rounded-2xl border border-border-color focus:border-orp outline-none text-base resize-none transition-colors"
            placeholder="Type your summary or thoughts here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
              if (e.key === 'Escape') {
                onSkip();
              }
            }}
          />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-text3 font-mono uppercase tracking-wider">
              Press Enter to save • ESC to skip
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-orp text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-orp/20"
            >
              Continue <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
