import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'Space', desc: 'Play / Pause video' },
    { key: 'Ctrl + O', desc: 'Open local video file' },
    { key: 'Ctrl + S', desc: 'Export subtitles (SRT / VTT)' },
    { key: 'Ctrl + H', desc: 'Smart Spellcheck & Find-and-Replace' },
    { key: 'Ctrl + F', desc: 'Focus search subtitles bar' },
    { key: 'Ctrl + /', desc: 'Toggle keyboard shortcuts dialog' },
    { key: 'Left Arrow', desc: 'Skip backward -5 seconds' },
    { key: 'Right Arrow', desc: 'Skip forward +5 seconds' },
    { key: 'Shift + Right', desc: 'Skip forward +10 seconds' },
    { key: 'Ctrl + Z', desc: 'Undo last edit' },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c24] border border-slate-700/80 rounded-xl max-w-md w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-[#242430] border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-cyan-600/30 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <Keyboard className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Windows PC Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-5 space-y-2 text-xs">
          {SHORTCUTS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0">
              <span className="text-slate-300">{item.desc}</span>
              <kbd className="bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[11px] px-2 py-0.5 rounded shadow-inner">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
