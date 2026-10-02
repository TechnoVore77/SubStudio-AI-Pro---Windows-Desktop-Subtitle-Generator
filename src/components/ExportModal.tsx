import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileCode,
  FileText,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { SubtitleItem, SubtitleFormat } from '../types';
import { exportSubtitles, generateSrt, generateVtt, generateTxt } from '../utils/srtExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtitles: SubtitleItem[];
  videoName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  subtitles,
  videoName,
}) => {
  const [format, setFormat] = useState<SubtitleFormat>('srt');
  const [includeSpeakers, setIncludeSpeakers] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    exportSubtitles(subtitles, format, videoName || 'subtitles', includeSpeakers);
    onClose();
  };

  const handleCopyClipboard = () => {
    let content = '';
    if (format === 'srt') content = generateSrt(subtitles, includeSpeakers);
    else if (format === 'vtt') content = generateVtt(subtitles, includeSpeakers);
    else if (format === 'txt') content = generateTxt(subtitles, true, includeSpeakers);
    else content = JSON.stringify(subtitles, null, 2);

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewContent = subtitles.length === 0
    ? '// No subtitles to preview. Add or generate subtitles first.'
    : format === 'srt'
    ? generateSrt(subtitles.slice(0, 3), includeSpeakers)
    : format === 'vtt'
    ? generateVtt(subtitles.slice(0, 3), includeSpeakers)
    : format === 'txt'
    ? generateTxt(subtitles.slice(0, 3), true, includeSpeakers)
    : JSON.stringify(subtitles.slice(0, 3), null, 2);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c24] border border-slate-700/80 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-[#242430] border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Download className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Export Subtitles & Captions</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Format Radio Selection Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Choose Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('srt')}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  format === 'srt'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-100">.SRT (SubRip)</div>
                  <div className="text-[10px] text-slate-400">Universal video editor standard</div>
                </div>
                {format === 'srt' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                onClick={() => setFormat('vtt')}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  format === 'vtt'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-100">.VTT (WebVTT)</div>
                  <div className="text-[10px] text-slate-400">Web & HTML5 video players</div>
                </div>
                {format === 'vtt' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                onClick={() => setFormat('txt')}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  format === 'txt'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-100">.TXT (Transcript)</div>
                  <div className="text-[10px] text-slate-400">Plain text timestamped document</div>
                </div>
                {format === 'txt' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                onClick={() => setFormat('json')}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  format === 'json'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-100">.JSON (Structured)</div>
                  <div className="text-[10px] text-slate-400">Developer raw timestamp data</div>
                </div>
                {format === 'json' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Include Speakers Toggle */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
            <div>
              <div className="font-semibold text-xs text-slate-200">Include Speaker Diarization Tags</div>
              <div className="text-[10px] text-slate-400">Prepend speaker names like [Speaker 1] into exported subtitles</div>
            </div>
            <input
              type="checkbox"
              checked={includeSpeakers}
              onChange={(e) => setIncludeSpeakers(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Sample Snippet Preview */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">File Snippet Preview:</div>
            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-emerald-300 max-h-28 overflow-y-auto whitespace-pre-wrap">
              {previewContent}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleCopyClipboard}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download .{format.toUpperCase()} File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
