import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Sliders,
  Type,
  Eye,
  EyeOff,
  Sparkles,
  Layers
} from 'lucide-react';
import { SubtitleItem, SubtitleStyle } from '../types';
import { formatTimeDisplay } from '../utils/srtExporter';

interface VideoPlayerProps {
  videoSrc: string;
  subtitles: SubtitleItem[];
  currentTimeMs: number;
  onTimeUpdate: (ms: number) => void;
  onDurationChange: (durationSec: number) => void;
  subtitleStyle: SubtitleStyle;
  onUpdateStyle: (style: Partial<SubtitleStyle>) => void;
  isProcessing: boolean;
  activeSubtitleId: string | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  subtitles,
  currentTimeMs,
  onTimeUpdate,
  onDurationChange,
  subtitleStyle,
  onUpdateStyle,
  isProcessing,
  activeSubtitleId,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // in seconds
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showStylePanel, setShowStylePanel] = useState(false);

  // Sync video time when external timeline seek occurs
  useEffect(() => {
    if (videoRef.current) {
      const videoCurrentMs = Math.round(videoRef.current.currentTime * 1000);
      if (Math.abs(videoCurrentMs - currentTimeMs) > 250) {
        videoRef.current.currentTime = currentTimeMs / 1000;
      }
    }
  }, [currentTimeMs]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(err => console.warn("Playback prevented:", err));
    } else {
      videoRef.current.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeSec = Math.max(0, Math.min(duration, parseFloat(e.target.value) || 0));
    if (videoRef.current) {
      videoRef.current.currentTime = timeSec;
      onTimeUpdate(Math.round(timeSec * 1000));
    }
  };

  const skipTime = (deltaSeconds: number) => {
    if (!videoRef.current) return;
    const current = Number.isFinite(videoRef.current.currentTime) ? videoRef.current.currentTime : 0;
    const newTime = Math.max(0, Math.min(duration, current + deltaSeconds));
    videoRef.current.currentTime = newTime;
    onTimeUpdate(Math.round(newTime * 1000));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  // Find active subtitle for burned-in preview display
  const currentSubtitle = subtitles.find(
    s => currentTimeMs >= s.startMs && currentTimeMs <= s.endMs
  );

  // Determine alignment position classes
  const getPositionClasses = () => {
    switch (subtitleStyle.position) {
      case 'top':
        return 'top-6 items-start';
      case 'center':
        return 'top-1/2 -translate-y-1/2 items-center';
      case 'bottom':
      default:
        return 'bottom-12 items-end';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="bg-black rounded-lg overflow-hidden flex flex-col relative group border border-slate-800 shadow-xl"
    >
      {/* Video Screen View */}
      <div className="relative w-full aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={() => {
            if (videoRef.current) {
              onTimeUpdate(Math.round(videoRef.current.currentTime * 1000));
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              const dur = videoRef.current.duration || 0;
              setDuration(dur);
              onDurationChange(dur);
            }
          }}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
        />

        {/* AI Scanning Overlay Banner */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30 p-6 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin flex items-center justify-center" />
              <Sparkles className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-100">Scanning Video with Gemini AI...</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Extracting audio speech, generating high-accuracy timestamps, and detecting speaker turns.
              </p>
            </div>
          </div>
        )}

        {/* Subtitle Burned-In Overlay */}
        {showSubtitles && currentSubtitle && (
          <div className={`absolute left-0 right-0 px-8 flex justify-center pointer-events-none z-20 ${getPositionClasses()}`}>
            <div
              className="transition-all duration-150 text-center max-w-3xl px-4 py-2 rounded"
              style={{
                fontSize: `${subtitleStyle.fontSize}px`,
                color: subtitleStyle.color,
                backgroundColor: `rgba(0,0,0, ${subtitleStyle.backgroundOpacity})`,
                fontFamily: subtitleStyle.fontFamily || 'sans-serif',
                fontWeight: subtitleStyle.fontWeight,
                textShadow: subtitleStyle.textShadow ? '0 2px 4px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)' : 'none',
                WebkitTextStroke: subtitleStyle.strokeColor !== 'none' ? `1px ${subtitleStyle.strokeColor}` : 'none',
              }}
            >
              {currentSubtitle.speaker && (
                <span className="text-blue-400 font-semibold mr-2 opacity-90 text-[0.85em]">
                  [{currentSubtitle.speaker}]
                </span>
              )}
              <span>{currentSubtitle.text}</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-[#18181f] border-t border-slate-800 p-3 space-y-2 select-none">
        {/* Scrubber timeline track */}
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-mono text-slate-400 min-w-[55px]">
            {formatTimeDisplay(currentTimeMs)}
          </span>

          <div className="relative flex-1 flex items-center">
            {/* Visual Subtitle Markers onto timeline */}
            <div className="absolute inset-x-0 h-1 bg-slate-800 rounded pointer-events-none">
              {duration > 0 && subtitles.map(sub => {
                const startPct = (sub.startMs / 1000 / duration) * 100;
                const endPct = (sub.endMs / 1000 / duration) * 100;
                const widthPct = Math.max(0.4, endPct - startPct);
                const isActive = sub.id === activeSubtitleId;
                return (
                  <div
                    key={sub.id}
                    className={`absolute top-0 bottom-0 rounded-sm transition-colors ${
                      isActive ? 'bg-amber-400 z-10' : 'bg-blue-500/60'
                    }`}
                    style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                  />
                );
              })}
            </div>

            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.01}
              value={currentTimeMs / 1000}
              onChange={handleSeek}
              className="w-full h-2 bg-transparent appearance-none cursor-pointer accent-blue-500 relative z-20 focus:outline-none"
            />
          </div>

          <span className="text-[11px] font-mono text-slate-400 min-w-[55px] text-right">
            {formatTimeDisplay(duration * 1000)}
          </span>
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center justify-between pt-1">
          {/* Left: Playback controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => skipTime(-5)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Skip -5s (Left Arrow)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => skipTime(5)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Skip +5s (Right Arrow)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume control */}
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-slate-300" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 bg-slate-800 appearance-none rounded cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Right: Subtitle overlay style & view toggles */}
          <div className="flex items-center space-x-2">
            {/* Speed selector */}
            <select
              value={playbackRate}
              onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
              className="bg-slate-800 text-slate-200 border border-slate-700/80 rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2.0x</option>
            </select>

            {/* Toggle Subtitles display */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-1.5 rounded flex items-center space-x-1 text-xs border transition-colors ${
                showSubtitles
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Subtitle Preview"
            >
              {showSubtitles ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Subtitles</span>
            </button>

            {/* Customize Style Drawer button */}
            <button
              onClick={() => setShowStylePanel(!showStylePanel)}
              className={`p-1.5 rounded flex items-center space-x-1 text-xs border transition-colors ${
                showStylePanel
                  ? 'bg-purple-600/30 border-purple-500/50 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Customize Subtitle Appearance"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Style</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Style Customization Popover Panel */}
        {showStylePanel && (
          <div className="bg-[#21212a] border border-slate-700/80 rounded-lg p-3 mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-200 shadow-xl">
            <div>
              <label className="block text-slate-400 mb-1">Font Size</label>
              <input
                type="range"
                min={14}
                max={36}
                value={subtitleStyle.fontSize}
                onChange={(e) => onUpdateStyle({ fontSize: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 appearance-none rounded accent-purple-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">{subtitleStyle.fontSize}px</span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Position</label>
              <select
                value={subtitleStyle.position}
                onChange={(e) => onUpdateStyle({ position: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
              >
                <option value="bottom">Bottom</option>
                <option value="top">Top</option>
                <option value="center">Center</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Text Color</label>
              <input
                type="color"
                value={subtitleStyle.color}
                onChange={(e) => onUpdateStyle({ color: e.target.value })}
                className="w-full h-7 bg-transparent cursor-pointer rounded border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Box Opacity</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={subtitleStyle.backgroundOpacity}
                onChange={(e) => onUpdateStyle({ backgroundOpacity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 appearance-none rounded accent-purple-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">{Math.round(subtitleStyle.backgroundOpacity * 100)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
