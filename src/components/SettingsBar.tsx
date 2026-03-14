import React from 'react';
import { Check } from 'lucide-react';
import type { ReaderSettings, ThemeType, FontType } from '../hooks/useSettings';
import clsx from 'clsx';

interface SettingsBarProps {
  settings: ReaderSettings;
  onUpdate: (updates: Partial<ReaderSettings>) => void;
}

type DropdownChoice = {
  label: string;
  value: string | number | boolean;
};

interface DropdownProps {
  label: string;
  currentValue: string;
  options: DropdownChoice[];
  onChange: (val: any) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, currentValue, options, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[100px] border border-border-color bg-white dark:bg-[#222] text-sm hover:bg-black/5 transition-colors font-medium text-text-muted hover:text-text-color"
      >
        <span className="uppercase text-[11px] font-bold tracking-wider opacity-60 mr-1">{label}</span>
        {currentValue}
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 min-w-full bg-white dark:bg-[#1a1a1a] border border-border-color rounded-xl shadow-lg shadow-black/5 py-1 z-50 overflow-hidden transform-origin-bottom animate-in fade-in slide-in-from-bottom-2 duration-150">
          {options.map(opt => {
            const isSelected = opt.label === currentValue || opt.value === currentValue;
            return (
              <button
                key={opt.label}
                className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between group"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span className={clsx(isSelected ? 'font-medium text-text-color' : 'text-text-muted group-hover:text-text-color')}>
                  {opt.label}
                </span>
                {isSelected && <Check size={14} className="text-accent-color ml-3" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SettingsBar: React.FC<SettingsBarProps> = ({ settings, onUpdate }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4 border-t border-border-color bg-white/50 backdrop-blur-sm dark:bg-[#222]/50">
      <Dropdown
        label="Chunk"
        currentValue={`${settings.chunkSize} word${settings.chunkSize > 1 ? 's' : ''}`}
        options={[
          { label: '1 word', value: 1 },
          { label: '2 words', value: 2 },
          { label: '3 words', value: 3 },
        ]}
        onChange={val => onUpdate({ chunkSize: val })}
      />
      
      <Dropdown
        label="Pause"
        currentValue={settings.smartPausing ? 'smart' : 'off'}
        options={[
          { label: 'smart', value: true },
          { label: 'off', value: false },
        ]}
        onChange={val => onUpdate({ smartPausing: val })}
      />

      <Dropdown
        label="ORP"
        currentValue={settings.orpEnabled ? 'on' : 'off'}
        options={[
          { label: 'on', value: true },
          { label: 'off', value: false },
        ]}
        onChange={val => onUpdate({ orpEnabled: val })}
      />

      <Dropdown
        label="Theme"
        currentValue={settings.theme}
        options={[
          { label: 'light', value: 'light' },
          { label: 'dark', value: 'dark' },
          { label: 'sepia', value: 'sepia' },
        ]}
        onChange={val => onUpdate({ theme: val as ThemeType })}
      />

      <Dropdown
        label="Font"
        currentValue={settings.fontFamily}
        options={[
          { label: 'sans', value: 'sans' },
          { label: 'serif', value: 'serif' },
          { label: 'mono', value: 'mono' },
        ]}
        onChange={val => onUpdate({ fontFamily: val as FontType })}
      />

      <Dropdown
        label="Context"
        currentValue={settings.contextEnabled ? 'strip' : 'off'}
        options={[
          { label: 'strip', value: true },
          { label: 'off', value: false },
        ]}
        onChange={val => onUpdate({ contextEnabled: val })}
      />
    </div>
  );
};
