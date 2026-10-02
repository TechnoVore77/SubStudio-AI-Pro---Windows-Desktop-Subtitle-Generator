import React, { useState } from 'react';
import {
  Video,
  FileText,
  Sparkles,
  Download,
  Settings,
  HelpCircle,
  FolderOpen,
  Minus,
  Square,
  X,
  Languages,
  Wand2,
  ListFilter,
  Keyboard,
  CheckCircle2,
  Cpu,
  SpellCheck
} from 'lucide-react';

interface TitleBarProps {
  onOpenVideo: () => void;
  onExport: () => void;
  onOpenAiTools: (tab?: 'spellcheck' | 'translate' | 'polish' | 'censor' | 'social' | 'summary') => void;
  onOpenConfig: () => void;
  onOpenShortcuts: () => void;
  onOpenPublishing?: () => void;
  onImportSubtitle?: (file: File) => void;
  onClearSubtitles?: () => void;
  isProcessing: boolean;
  videoLoaded: boolean;
  subtitleCount: number;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onOpenVideo,
  onExport,
  onOpenAiTools,
  onOpenConfig,
  onOpenShortcuts,
  onOpenPublishing,
  onImportSubtitle,
  onClearSubtitles,
  isProcessing,
  videoLoaded,
  subtitleCount,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportSubtitle) {
      onImportSubtitle(file);
    }
    if (e.target) e.target.value = '';
  };

  return (
    <>
      {activeMenu && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setActiveMenu(null)}
        />
      )}
      <div 
        className="bg-[#1e1e24] text-slate-200 border-b border-slate-800/80 flex items-center justify-between px-3 py-1.5 select-none text-xs font-sans shadow-sm relative z-50"
        id="windows-title-bar"
      >
      {/* Left: App Logo & Menus */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 pr-2 border-r border-slate-700/60">
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-sm font-bold text-[10px]">
            <Video className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-slate-100 tracking-wide text-xs">
            SubStudio <span className="text-blue-400 font-bold">AI Pro</span>
          </span>
          <span className="text-[10px] bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
            Win 11 x64
          </span>
        </div>

        {/* Windows App Top Menu Bar */}
        <div className="flex items-center space-x-1 relative">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('file')}
              className={`px-2.5 py-1 rounded hover:bg-slate-700/60 transition-colors ${
                activeMenu === 'file' ? 'bg-slate-700/80 text-white font-medium' : 'text-slate-300'
              }`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#25252e] border border-slate-700/80 rounded-md shadow-2xl py-1 z-50 text-slate-200">
                <button
                  onClick={() => { onOpenVideo(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600/30 hover:text-white flex items-center justify-between group"
                >
                  <span className="flex items-center space-x-2">
                    <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>Open Video File...</span>
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200">Ctrl+O</span>
                </button>

                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600/30 hover:text-white flex items-center justify-between group"
                >
                  <span className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Import Subtitles (.srt, .vtt)</span>
                  </span>
                </button>

                <button
                  disabled={!subtitleCount}
                  onClick={() => { onExport(); setActiveMenu(null); }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                    subtitleCount ? 'hover:bg-blue-600/30 hover:text-white' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export Subtitles (SRT/VTT)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Ctrl+S</span>
                </button>

                {onClearSubtitles && (
                  <button
                    disabled={!subtitleCount}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all subtitle blocks?')) {
                        onClearSubtitles();
                      }
                      setActiveMenu(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                      subtitleCount ? 'hover:bg-red-600/30 hover:text-red-200 text-slate-300' : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <X className="w-3.5 h-3.5 text-red-400" />
                      <span>Clear All Subtitles</span>
                    </span>
                  </button>
                )}

                <div className="my-1 border-t border-slate-700/60" />
                <button
                  onClick={() => { onOpenConfig(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600/30 hover:text-white flex items-center space-x-2"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Scan Settings</span>
                </button>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".srt,.vtt,text/plain"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* AI Tools Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('ai')}
              className={`px-2.5 py-1 rounded hover:bg-slate-700/60 transition-colors flex items-center space-x-1 ${
                activeMenu === 'ai' ? 'bg-slate-700/80 text-white font-medium' : 'text-slate-300'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>AI Tools</span>
            </button>
            {activeMenu === 'ai' && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-[#25252e] border border-slate-700/80 rounded-md shadow-2xl py-1 z-50 text-slate-200">
                <button
                  disabled={!subtitleCount}
                  onClick={() => { onOpenAiTools('spellcheck'); setActiveMenu(null); }}
                  className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 ${
                    subtitleCount ? 'hover:bg-cyan-600/30 hover:text-white' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <SpellCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <div className="flex-1">
                    <div className="font-medium">Smart Spellcheck & Replace</div>
                    <div className="text-[10px] text-slate-400">Fix acoustic typos & tech jargon</div>
                  </div>
                </button>
                <div className="my-1 border-t border-slate-700/60" />
                <button
                  disabled={!subtitleCount}
                  onClick={() => { onOpenAiTools('translate'); setActiveMenu(null); }}
                  className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 ${
                    subtitleCount ? 'hover:bg-purple-600/30 hover:text-white' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Translate Subtitles</span>
                </button>
                <button
                  disabled={!subtitleCount}
                  onClick={() => { onOpenAiTools('polish'); setActiveMenu(null); }}
                  className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 ${
                    subtitleCount ? 'hover:bg-purple-600/30 hover:text-white' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Polish Grammar & Punctuation</span>
                </button>
                <button
                  disabled={!subtitleCount}
                  onClick={() => { onOpenAiTools('social'); setActiveMenu(null); }}
                  className={`w-full text-left px-3 py-1.5 flex items-center space-x-2 ${
                    subtitleCount ? 'hover:bg-purple-600/30 hover:text-white' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reformat for TikTok / Reels</span>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('help')}
              className={`px-2.5 py-1 rounded hover:bg-slate-700/60 transition-colors ${
                activeMenu === 'help' ? 'bg-slate-700/80 text-white font-medium' : 'text-slate-300'
              }`}
            >
              Help
            </button>
            {activeMenu === 'help' && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-[#25252e] border border-slate-700/80 rounded-md shadow-2xl py-1 z-50 text-slate-200">
                <button
                  onClick={() => { onOpenShortcuts(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600/30 hover:text-white flex items-center space-x-2"
                >
                  <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Keyboard Shortcuts</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: AI Engine Status indicator */}
      <div className="flex items-center space-x-2">
        <div className="hidden lg:flex items-center space-x-2 px-3 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[11px]">
          <Cpu className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-slate-300">Gemini 3.8 Flash AI Core:</span>
          {isProcessing ? (
            <span className="text-amber-300 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Scanning Audio & Timestamps...</span>
            </span>
          ) : videoLoaded ? (
            <span className="text-emerald-400 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Ready ({subtitleCount} Subtitles)</span>
            </span>
          ) : (
            <span className="text-slate-400">Idle • Import Video to Start</span>
          )}
        </div>
      </div>

      {/* Right: Windows Controls (Minimize, Maximize, Close simulation) */}
      <div className="flex items-center space-x-1">
        <button
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-slate-700/70 text-slate-400 hover:text-white transition-colors"
          title="Minimize"
        >
          <Minus className="w-3 h-3" />
        </button>
        <button
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-slate-700/70 text-slate-400 hover:text-white transition-colors"
          title="Maximize"
        >
          <Square className="w-2.5 h-2.5" />
        </button>
        <button
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
    </>
  );
};
