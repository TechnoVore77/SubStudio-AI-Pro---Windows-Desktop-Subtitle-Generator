import React, { useState, useEffect, useRef } from 'react';
import {
  SubtitleItem
} from '../types';
import { formatTimeDisplay, parseSrtTimeToMs } from '../utils/srtExporter';
import {
  Play,
  Plus,
  Trash2,
  Split,
  Merge,
  Search,
  User,
  Clock,
  Check,
  Sparkles,
  ArrowUpDown,
  FileSpreadsheet,
  SpellCheck
} from 'lucide-react';

interface SubtitleListEditorProps {
  subtitles: SubtitleItem[];
  currentTimeMs: number;
  activeSubtitleId: string | null;
  onSeek: (ms: number) => void;
  onUpdateSubtitle: (id: string, updated: Partial<SubtitleItem>) => void;
  onAddSubtitle: (afterId?: string) => void;
  onDeleteSubtitle: (id: string) => void;
  onSplitSubtitle: (id: string) => void;
  onMergeSubtitle: (id: string) => void;
  onBatchShift: (shiftMs: number) => void;
  isProcessing: boolean;
  onOpenSpellcheck?: () => void;
}

export const SubtitleListEditor: React.FC<SubtitleListEditorProps> = ({
  subtitles,
  currentTimeMs,
  activeSubtitleId,
  onSeek,
  onUpdateSubtitle,
  onAddSubtitle,
  onDeleteSubtitle,
  onSplitSubtitle,
  onMergeSubtitle,
  onBatchShift,
  isProcessing,
  onOpenSpellcheck,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftAmountSec, setShiftAmountSec] = useState(0.5);

  const filteredSubtitles = subtitles.filter(
    s =>
      s.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.speaker && s.speaker.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalWords = subtitles.reduce((acc, sub) => acc + sub.text.trim().split(/\s+/).filter(Boolean).length, 0);

  // Auto-scroll active subtitle item into view
  useEffect(() => {
    if (activeSubtitleId) {
      const el = document.getElementById(`sub-item-${activeSubtitleId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeSubtitleId]);

  return (
    <div className="bg-[#181820] border border-slate-800 rounded-lg flex flex-col h-full overflow-hidden shadow-sm">
      {/* Top Header & Search Control */}
      <div className="bg-[#1e1e28] border-b border-slate-800 p-3 space-y-2 select-none">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Subtitle Tracks</h3>
            <span className="bg-blue-900/40 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full text-[10px] font-semibold">
              {subtitles.length} Blocks ({totalWords} words)
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {onOpenSpellcheck && (
              <button
                onClick={onOpenSpellcheck}
                className="px-2.5 py-1 bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-700/60 rounded text-xs flex items-center space-x-1.5 font-medium transition-colors shadow-sm"
                title="Open Smart Spellcheck & Jargon Replace"
              >
                <SpellCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Smart Spellcheck</span>
              </button>
            )}
            <button
              onClick={() => onAddSubtitle()}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs flex items-center space-x-1 font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subtitle</span>
            </button>
          </div>
        </div>

        {/* Search & Shift Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Search box */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="subtitle-search-input"
              type="text"
              placeholder="Search subtitle text or speaker... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Timestamp Shift Adjuster */}
          <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300">
            <ArrowUpDown className="w-3 h-3 text-amber-400" />
            <span>Shift Time:</span>
            <button
              onClick={() => onBatchShift(-shiftAmountSec * 1000)}
              className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-mono text-[10px]"
              title={`Nudge back by -${shiftAmountSec}s`}
            >
              -{shiftAmountSec}s
            </button>
            <button
              onClick={() => onBatchShift(shiftAmountSec * 1000)}
              className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-mono text-[10px]"
              title={`Nudge forward by +${shiftAmountSec}s`}
            >
              +{shiftAmountSec}s
            </button>
          </div>
        </div>
      </div>

      {/* Subtitle List scrollable container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-800/40">
        {filteredSubtitles.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-600 mb-1" />
            <p className="text-xs font-medium text-slate-400">No subtitles match your current filter.</p>
            <p className="text-[11px] text-slate-500 max-w-xs">
              Import a video file or click "Scan Video with Gemini AI" to auto-generate timestamped captions.
            </p>
          </div>
        ) : (
          filteredSubtitles.map((sub, index) => {
            const isActive = sub.id === activeSubtitleId || (currentTimeMs >= sub.startMs && currentTimeMs <= sub.endMs);
            const originalIndex = subtitles.findIndex(s => s.id === sub.id);
            const displayIndex = originalIndex !== -1 ? originalIndex + 1 : index + 1;

            return (
              <div
                key={sub.id}
                id={`sub-item-${sub.id}`}
                className={`pt-2 transition-all rounded-lg p-2.5 border ${
                  isActive
                    ? 'bg-blue-950/40 border-blue-500/60 ring-1 ring-blue-500/40'
                    : 'bg-[#1e1e26] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header row: Index #, Play button, Time range, Speaker, Actions */}
                <div className="flex items-center justify-between mb-2 text-xs">
                  <div className="flex items-center space-x-2">
                    {/* Seq # badge */}
                    <span className="font-mono text-[11px] text-slate-400 w-6 font-semibold">
                      #{displayIndex}
                    </span>

                    {/* Play segment button */}
                    <button
                      onClick={() => onSeek(sub.startMs)}
                      className="p-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors"
                      title="Play this subtitle segment"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>

                    {/* Start Ms Input */}
                    <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 rounded px-1.5 py-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <input
                        type="number"
                        step={100}
                        value={sub.startMs}
                        onChange={(e) => {
                          const newStart = Math.max(0, parseInt(e.target.value) || 0);
                          const updates: Partial<typeof sub> = { startMs: newStart };
                          if (newStart >= sub.endMs) {
                            updates.endMs = newStart + 1000;
                          }
                          onUpdateSubtitle(sub.id, updates);
                        }}
                        className="w-16 bg-transparent font-mono text-[11px] text-blue-300 text-center focus:outline-none"
                        title="Start time in milliseconds"
                      />
                      <span className="text-[10px] text-slate-500">ms</span>
                    </div>

                    <span className="text-slate-500">→</span>

                    {/* End Ms Input */}
                    <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 rounded px-1.5 py-0.5">
                      <input
                        type="number"
                        step={100}
                        value={sub.endMs}
                        onChange={(e) => {
                          const newEnd = Math.max(sub.startMs + 50, parseInt(e.target.value) || (sub.startMs + 500));
                          onUpdateSubtitle(sub.id, { endMs: newEnd });
                        }}
                        className="w-16 bg-transparent font-mono text-[11px] text-blue-300 text-center focus:outline-none"
                        title="End time in milliseconds"
                      />
                      <span className="text-[10px] text-slate-500">ms</span>
                    </div>

                    {/* Formatted time display */}
                    <span className="text-[10px] font-mono text-slate-400 hidden lg:inline">
                      ({formatTimeDisplay(sub.startMs)} - {formatTimeDisplay(sub.endMs)})
                    </span>
                  </div>

                  {/* Speaker & Action Toolbar */}
                  <div className="flex items-center space-x-2">
                    {/* Speaker input */}
                    <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 rounded px-2 py-0.5">
                      <User className="w-3 h-3 text-purple-400" />
                      <input
                        type="text"
                        value={sub.speaker || ''}
                        placeholder="Speaker"
                        onChange={(e) => onUpdateSubtitle(sub.id, { speaker: e.target.value })}
                        className="w-20 bg-transparent text-[11px] text-purple-200 focus:outline-none"
                      />
                    </div>

                    {/* Split button */}
                    <button
                      onClick={() => onSplitSubtitle(sub.id)}
                      className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                      title="Split subtitle into two at midpoint"
                    >
                      <Split className="w-3.5 h-3.5" />
                    </button>

                    {/* Merge button */}
                    {(() => {
                      const masterIdx = subtitles.findIndex((s) => s.id === sub.id);
                      return masterIdx !== -1 && masterIdx < subtitles.length - 1 ? (
                        <button
                          onClick={() => onMergeSubtitle(sub.id)}
                          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                          title="Merge with next subtitle block"
                        >
                          <Merge className="w-3.5 h-3.5" />
                        </button>
                      ) : null;
                    })()}

                    {/* Delete block */}
                    <button
                      onClick={() => onDeleteSubtitle(sub.id)}
                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                      title="Delete subtitle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle text input area */}
                <textarea
                  rows={2}
                  value={sub.text}
                  onChange={(e) => onUpdateSubtitle(sub.id, { text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-sans resize-y"
                  placeholder="Enter subtitle text..."
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
