import React, { useRef } from 'react';
import { SubtitleItem } from '../types';
import { formatTimeDisplay } from '../utils/srtExporter';
import { Clock, MessageSquare } from 'lucide-react';

interface TimelineWaveformProps {
  durationMs: number;
  currentTimeMs: number;
  subtitles: SubtitleItem[];
  onSeek: (ms: number) => void;
  activeSubtitleId: string | null;
  onSelectSubtitle: (id: string) => void;
}

export const TimelineWaveform: React.FC<TimelineWaveformProps> = ({
  durationMs,
  currentTimeMs,
  subtitles,
  onSeek,
  activeSubtitleId,
  onSelectSubtitle,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  const seekFromClientX = (clientX: number) => {
    if (!trackRef.current || durationMs <= 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetMs = Math.round(ratio * durationMs);
    onSeek(targetMs);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    seekFromClientX(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isDraggingRef.current) {
        seekFromClientX(moveEvent.clientX);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      isDraggingRef.current = true;
      seekFromClientX(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0 && isDraggingRef.current) {
      seekFromClientX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const playheadPct = durationMs > 0 ? Math.max(0, Math.min(100, (currentTimeMs / durationMs) * 100)) : 0;

  return (
    <div className="bg-[#1a1a22] border border-slate-800 rounded-lg p-3 select-none shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-semibold text-slate-200">Interactive Subtitle Timeline</span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {subtitles.length} Blocks
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Playhead: <span className="text-blue-300 font-bold">{formatTimeDisplay(currentTimeMs)}</span> / {formatTimeDisplay(durationMs)}
        </div>
      </div>

      {/* Main Track Area */}
      <div 
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-14 bg-slate-950 rounded border border-slate-800 cursor-pointer overflow-hidden group"
      >
        {/* Synthetic Waveform Lines for aesthetic desktop DAW feel */}
        <div className="absolute inset-0 opacity-15 flex items-center justify-around pointer-events-none">
          {Array.from({ length: 120 }).map((_, i) => {
            const height = Math.sin(i * 0.4) * 20 + 25;
            return (
              <div
                key={i}
                className="w-0.5 bg-blue-400 rounded-full"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        {/* Subtitle Blocks */}
        {durationMs > 0 && subtitles.map((sub) => {
          const rawStart = (sub.startMs / durationMs) * 100;
          const startPct = Math.max(0, Math.min(99.5, rawStart));
          const rawWidth = ((sub.endMs - sub.startMs) / durationMs) * 100;
          const widthPct = Math.max(0.6, Math.min(100 - startPct, rawWidth));
          const isActive = sub.id === activeSubtitleId;

          return (
            <div
              key={sub.id}
              onMouseDown={(e) => {
                e.stopPropagation();
                onSeek(sub.startMs);
                onSelectSubtitle(sub.id);
              }}
              className={`absolute top-2 bottom-2 rounded px-1.5 flex items-center overflow-hidden transition-all text-[10px] border shadow-sm ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-300 ring-2 ring-blue-400/50 z-20 font-medium'
                  : 'bg-indigo-900/60 hover:bg-indigo-800 text-indigo-100 border-indigo-500/40 z-10'
              }`}
              style={{
                left: `${startPct}%`,
                width: `${widthPct}%`,
              }}
              title={`[${formatTimeDisplay(sub.startMs)} - ${formatTimeDisplay(sub.endMs)}] ${sub.speaker ? sub.speaker + ': ' : ''}${sub.text}`}
            >
              <span className="truncate whitespace-nowrap font-mono">
                {sub.text}
              </span>
            </div>
          );
        })}

        {/* Playhead Vertical Red/Blue Needle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none transition-transform duration-75"
          style={{ left: `${playheadPct}%` }}
        >
          <div className="w-2.5 h-2.5 bg-red-500 transform -translate-x-[4px] rotate-45 rounded-xs" />
        </div>
      </div>
    </div>
  );
};
