import React from 'react';
import type { ReaderSettings, ThemeType, FontType } from '../hooks/useSettings';
import clsx from 'clsx';

interface SettingsBarProps {
  settings: ReaderSettings;
  onUpdate: (updates: Partial<ReaderSettings>) => void;
}

interface ChipProps {
  label: string;
  value: string;
  on?: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, value, on, onClick }) => (
  <div
    className={clsx(
      "flex items-center gap-1 border rounded-[20px] py-1 px-[10px] cursor-pointer text-[11px] font-mono whitespace-nowrap flex-shrink-0 transition-all",
      on
        ? "border-orp text-orp bg-orp-bg"
        : "border-border-color text-text2 bg-bg hover:border-border2 hover:bg-bg3 hover:text-text-color"
    )}
    onClick={onClick}
  >
    <span className="text-[9px] text-text3 uppercase tracking-[0.5px]">{label}&nbsp;</span>
    {value}
  </div>
);

const themes: ThemeType[] = ['dark', 'light', 'sepia'];
const fonts: FontType[] = ['mono', 'sans', 'serif'];
const sizes = [24, 28, 32, 38, 44, 52, 60];

export const SettingsBar: React.FC<SettingsBarProps> = ({ settings, onUpdate }) => {
  const nextTheme = themes[(themes.indexOf(settings.theme) + 1) % themes.length];
  const nextFont = fonts[(fonts.indexOf(settings.fontFamily) + 1) % fonts.length];
  const currentSizeIdx = sizes.indexOf(settings.fontSize ?? 38);
  const nextSize = sizes[(currentSizeIdx + 1) % sizes.length];

  return (
    <div className="flex items-center gap-[6px] py-2 px-[14px] border-t border-border-color bg-bg2 overflow-x-auto flex-shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Chip
        label="pause"
        value={settings.smartPausing ? 'smart' : 'off'}
        on={settings.smartPausing}
        onClick={() => onUpdate({ smartPausing: !settings.smartPausing })}
      />
      <Chip
        label="context"
        value={settings.contextEnabled ? 'strip' : 'off'}
        on={settings.contextEnabled}
        onClick={() => onUpdate({ contextEnabled: !settings.contextEnabled })}
      />
      <Chip
        label="orp"
        value={settings.orpEnabled ? 'highlight' : 'off'}
        on={settings.orpEnabled}
        onClick={() => onUpdate({ orpEnabled: !settings.orpEnabled })}
      />
      <Chip
        label="chunk"
        value={`${settings.chunkSize} word${settings.chunkSize > 1 ? 's' : ''}`}
        onClick={() => onUpdate({ chunkSize: (settings.chunkSize % 3) + 1 })}
      />
      <Chip
        label="theme"
        value={settings.theme}
        onClick={() => onUpdate({ theme: nextTheme })}
      />
      <Chip
        label="font"
        value={nextFont === 'mono' ? settings.fontFamily : nextFont}
        onClick={() => onUpdate({ fontFamily: nextFont })}
      />
      <Chip
        label="size"
        value={`${settings.fontSize ?? 38}px`}
        onClick={() => onUpdate({ fontSize: nextSize })}
      />
      <div className="flex-1" />
    </div>
  );
};


