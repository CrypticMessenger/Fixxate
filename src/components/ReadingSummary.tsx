import React from 'react';
import { CheckCircle2, Clock, StickyNote, ArrowLeft, Download, Share2, RotateCcw } from 'lucide-react';
import type { ParsedBook, ReadingNote } from '../lib/types';

interface ReadingSummaryProps {
  book: ParsedBook;
  notes: ReadingNote[];
  onExit: () => void;
  onRestart: () => void;
}

export const ReadingSummary: React.FC<ReadingSummaryProps> = ({ book, notes, onExit, onRestart }) => {
  return (
    <div className="min-h-screen bg-bg text-text p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
      <div className="max-w-3xl mx-auto pb-20">
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={onExit}
            className="p-3 hover:bg-bg2 rounded-2xl transition-all text-text-muted"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="h-1 flex-1 bg-border-color rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-full" />
          </div>
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 size={24} />
            <span className="font-bold text-sm uppercase tracking-widest">Finished</span>
          </div>
        </div>

        <header className="mb-16">
          <h1 className="text-4xl font-bold mb-4 leading-tight">{book.title}</h1>
          <div className="flex flex-wrap gap-6 text-sm text-text3 font-mono">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Session Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <StickyNote size={16} />
              <span>{notes.length} Insight{notes.length !== 1 ? 's' : ''} captured</span>
            </div>
          </div>
        </header>

        {notes.length > 0 ? (
          <div className="space-y-12">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[4px] text-text3 mb-8 flex items-center gap-4">
                Structured Insights
                <div className="h-px flex-1 bg-border-color" />
              </h2>
              <div className="space-y-6">
                {notes.map((note) => (
                  <div 
                    key={note.id} 
                    className="p-6 bg-bg2 border border-border-color rounded-3xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    {note.type === 'pulse' && note.prompt && (
                      <div className="text-[11px] font-bold text-orp uppercase tracking-widest mb-3 opacity-80">
                        {note.prompt}
                      </div>
                    )}
                    {note.type === 'manual' && (
                      <div className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-3 opacity-80">
                        Margin Note
                      </div>
                    )}
                    <p className="text-lg leading-relaxed text-text">
                      {note.text}
                    </p>
                    <div className="mt-4 text-[10px] font-mono text-text3">
                      at word {note.wordIndex} • {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border-color rounded-3xl">
            <p className="text-text-muted mb-2">No notes were captured during this session.</p>
            <p className="text-xs text-text3">Try pressing 'N' or enabling pulses next time.</p>
          </div>
        )}

        <footer className="mt-20 flex flex-wrap gap-4 items-center justify-center pt-8 border-t border-border-color">
          <button 
            onClick={onRestart}
            className="flex items-center gap-2 px-8 py-3 bg-orp text-white rounded-xl font-bold text-sm shadow-xl shadow-orp/20 hover:brightness-110 transition-all"
          >
            <RotateCcw size={18} /> Read Again
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-border-color">
            <Download size={18} /> Export Notes (TXT)
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-border-color">
            <Share2 size={18} /> Copy to Clipboard
          </button>
          <button 
            onClick={onExit}
            className="px-8 py-3 bg-white/10 text-text rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
          >
            Back to Library
          </button>
        </footer>
      </div>
    </div>
  );
};
