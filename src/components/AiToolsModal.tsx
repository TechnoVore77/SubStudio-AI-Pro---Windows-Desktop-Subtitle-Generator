import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Languages,
  Wand2,
  ShieldAlert,
  ListFilter,
  FileText,
  Check,
  Loader2,
  Cpu,
  SpellCheck
} from 'lucide-react';
import { SubtitleItem } from '../types';
import { SmartSpellcheckTab } from './SmartSpellcheckTab';

interface AiToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtitles: SubtitleItem[];
  onApplyUpdatedSubtitles: (newSubtitles: SubtitleItem[]) => void;
  onApplySummaryText: (summaryText: string) => void;
  initialTab?: 'spellcheck' | 'translate' | 'polish' | 'censor' | 'social' | 'summary';
}

export const AiToolsModal: React.FC<AiToolsModalProps> = ({
  isOpen,
  onClose,
  subtitles,
  onApplyUpdatedSubtitles,
  onApplySummaryText,
  initialTab = 'spellcheck',
}) => {
  const [activeTab, setActiveTab] = useState<'spellcheck' | 'translate' | 'polish' | 'censor' | 'social' | 'summary'>(initialTab);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const LANGUAGES = [
    'Spanish', 'French', 'German', 'Japanese', 'Chinese (Mandarin)',
    'Italian', 'Portuguese', 'Korean', 'Russian', 'Arabic', 'Hindi',
    'Dutch', 'Swedish', 'Polish', 'Turkish', 'Vietnamese', 'Thai', 'Indonesian'
  ];

  const handleRunAiAction = async (action: string) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setSummaryResult(null);

    try {
      const res = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          subtitles,
          targetLanguage: action === 'translate' ? targetLanguage : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI processing failed.');
      }

      if (action === 'summarize_text') {
        setSummaryResult(data.text);
        onApplySummaryText(data.text);
      } else if (Array.isArray(data.subtitles)) {
        onApplyUpdatedSubtitles(data.subtitles);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing AI tool');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c24] border border-slate-700/80 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#242430] border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-purple-600/30 text-purple-400 border border-purple-500/40 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Gemini AI Subtitle Power Suite</h3>
            <span className="text-[10px] bg-purple-900/60 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
              Gemini 3.8 Flash
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-800 bg-[#16161e] px-2 pt-2 space-x-1 overflow-x-auto text-xs select-none">
          <button
            onClick={() => setActiveTab('spellcheck')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'spellcheck'
                ? 'bg-[#1c1c24] text-cyan-300 border-cyan-500/50 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <SpellCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Smart Spellcheck</span>
          </button>

          <button
            onClick={() => setActiveTab('translate')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'translate'
                ? 'bg-[#1c1c24] text-purple-300 border-purple-500/50 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Translation</span>
          </button>

          <button
            onClick={() => setActiveTab('polish')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'polish'
                ? 'bg-[#1c1c24] text-blue-300 border-blue-500/50 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Polish & Grammar</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'social'
                ? 'bg-[#1c1c24] text-emerald-300 border-emerald-500/50 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Short Social Captions</span>
          </button>

          <button
            onClick={() => setActiveTab('censor')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'censor'
                ? 'bg-[#1c1c24] text-red-300 border-red-500/50 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Profanity Censor</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'summary'
                ? 'bg-[#1c1c24] text-amber-300 border-amber-500/50 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Video Summary</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          {errorMsg && (
            <div className="bg-red-950/60 border border-red-700/60 rounded-lg p-3 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          {subtitles.length === 0 && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-lg p-3 text-xs text-amber-200 flex items-center justify-between">
              <span>No subtitle blocks are currently loaded. Run "Scan Video with Gemini AI" or import an SRT/VTT file first.</span>
            </div>
          )}

          {activeTab === 'spellcheck' && (
            <SmartSpellcheckTab
              subtitles={subtitles}
              onApplyUpdatedSubtitles={onApplyUpdatedSubtitles}
            />
          )}

          {activeTab === 'translate' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">AI Subtitle Translation</h4>
                <p className="text-xs text-slate-400">
                  Translate all subtitle blocks into a target language with natural phrasing and timing alignment.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">Select Target Language</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <button
                disabled={isProcessing || subtitles.length === 0}
                onClick={() => handleRunAiAction('translate')}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                <span>Translate All {subtitles.length} Subtitles to {targetLanguage}</span>
              </button>
            </div>
          )}

          {activeTab === 'polish' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Punctuation & Grammar Polisher</h4>
                <p className="text-xs text-slate-400">
                  Automatically clean up spoken filler words ("um", "uh", "like"), capitalize proper nouns, fix typos, and add correct sentence punctuation.
                </p>
              </div>

              <button
                disabled={isProcessing || subtitles.length === 0}
                onClick={() => handleRunAiAction('polish')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>Polish Grammar & Punctuation</span>
              </button>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">TikTok / Reels Short Captions Converter</h4>
                <p className="text-xs text-slate-400">
                  Convert longer subtitle sentences into fast-paced 1-3 word blocks tailored for viral short videos, automatically recalculating micro-timestamps!
                </p>
              </div>

              <button
                disabled={isProcessing || subtitles.length === 0}
                onClick={() => handleRunAiAction('reformat_social')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ListFilter className="w-4 h-4" />}
                <span>Reformat to Short Social Captions</span>
              </button>
            </div>
          )}

          {activeTab === 'censor' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">AI Profanity Filter</h4>
                <p className="text-xs text-slate-400">
                  Scan and mask explicit/profane words in subtitle text with asterisks (e.g. "****") for family-safe publishing.
                </p>
              </div>

              <button
                disabled={isProcessing || subtitles.length === 0}
                onClick={() => handleRunAiAction('censor')}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                <span>Apply Profanity Filter</span>
              </button>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-100">Generate Executive Video Summary & Chapters</h4>
                <p className="text-xs text-slate-400">
                  AI reads through all transcript subtitles and generates an overall video summary, chapter breakdown, and key takeaways.
                </p>
              </div>

              <button
                disabled={isProcessing || subtitles.length === 0}
                onClick={() => handleRunAiAction('summarize_text')}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>Generate Video Executive Summary</span>
              </button>

              {summaryResult && (
                <div className="mt-4 bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs space-y-2 max-h-48 overflow-y-auto">
                  <h5 className="font-bold text-amber-300">Generated Summary & Topic Breakdown:</h5>
                  <p className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed">{summaryResult}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
