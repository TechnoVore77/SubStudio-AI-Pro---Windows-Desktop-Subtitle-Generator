import React, { useState, useMemo } from 'react';
import {
  SpellCheck,
  Replace,
  Search,
  Sparkles,
  Check,
  CheckCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeftRight,
  X,
  Loader2,
  Tag,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { SubtitleItem } from '../types';
import { formatTimeDisplay } from '../utils/srtExporter';

interface SmartSpellcheckTabProps {
  subtitles: SubtitleItem[];
  onApplyUpdatedSubtitles: (newSubtitles: SubtitleItem[]) => void;
}

interface JargonPreset {
  category: string;
  find: string;
  replace: string;
  label: string;
}

interface AiSuggestion {
  find: string;
  replace: string;
  reason: string;
}

const JARGON_PRESETS: JargonPreset[] = [
  // Tech & Platforms
  { category: 'Tech Brands', find: 'git hub', replace: 'GitHub', label: 'git hub ➔ GitHub' },
  { category: 'Tech Brands', find: 'github', replace: 'GitHub', label: 'github ➔ GitHub' },
  { category: 'Tech Brands', find: 'you tube', replace: 'YouTube', label: 'you tube ➔ YouTube' },
  { category: 'Tech Brands', find: 'open ai', replace: 'OpenAI', label: 'open ai ➔ OpenAI' },
  { category: 'Tech Brands', find: 'gemini ai', replace: 'Gemini', label: 'gemini ai ➔ Gemini' },
  { category: 'Tech Brands', find: 'sub studio', replace: 'SubStudio', label: 'sub studio ➔ SubStudio' },
  { category: 'Tech Brands', find: 'java script', replace: 'JavaScript', label: 'java script ➔ JavaScript' },
  { category: 'Tech Brands', find: 'type script', replace: 'TypeScript', label: 'type script ➔ TypeScript' },
  { category: 'Tech Brands', find: 'docker', replace: 'Docker', label: 'docker ➔ Docker' },
  { category: 'Tech Brands', find: 'kubernetes', replace: 'Kubernetes', label: 'kubernetes ➔ Kubernetes' },

  // Audio Homophones & Technical Acronyms
  { category: 'Acronyms & Homophones', find: 'a pie', replace: 'API', label: 'a pie ➔ API' },
  { category: 'Acronyms & Homophones', find: 'aye', replace: 'AI', label: 'aye ➔ AI' },
  { category: 'Acronyms & Homophones', find: 'sass', replace: 'SaaS', label: 'sass ➔ SaaS' },
  { category: 'Acronyms & Homophones', find: 'wifi', replace: 'Wi-Fi', label: 'wifi ➔ Wi-Fi' },
  { category: 'Acronyms & Homophones', find: 'l l m', replace: 'LLM', label: 'l l m ➔ LLM' },
  { category: 'Acronyms & Homophones', find: 'u i', replace: 'UI', label: 'u i ➔ UI' },
  { category: 'Acronyms & Homophones', find: 'u x', replace: 'UX', label: 'u x ➔ UX' },
  { category: 'Acronyms & Homophones', find: 's r t', replace: 'SRT', label: 's r t ➔ SRT' },
  { category: 'Acronyms & Homophones', find: 'v t t', replace: 'VTT', label: 'v t t ➔ VTT' },

  // Conversational Spoken Slang
  { category: 'Spoken Slang', find: 'gonna', replace: 'going to', label: 'gonna ➔ going to' },
  { category: 'Spoken Slang', find: 'wanna', replace: 'want to', label: 'wanna ➔ want to' },
  { category: 'Spoken Slang', find: 'cuz', replace: 'because', label: 'cuz ➔ because' },
  { category: 'Spoken Slang', find: 'kuz', replace: 'because', label: 'kuz ➔ because' },
  { category: 'Spoken Slang', find: 'ok', replace: 'OK', label: 'ok ➔ OK' },
];

export const SmartSpellcheckTab: React.FC<SmartSpellcheckTabProps> = ({
  subtitles,
  onApplyUpdatedSubtitles,
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(true);
  const [useRegex, setUseRegex] = useState(false);

  // Status & Notification
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // AI Suggestions state
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);

  // Safely compile the regex
  const regex = useMemo(() => {
    if (!findText.trim()) return null;
    try {
      const flags = matchCase ? 'g' : 'gi';
      let pattern = findText;
      if (!useRegex) {
        // Escape regex special chars
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (wholeWord) {
          const startsWithWord = /^\w/.test(findText);
          const endsWithWord = /\w$/.test(findText);
          pattern = `${startsWithWord ? '\\b' : ''}${pattern}${endsWithWord ? '\\b' : ''}`;
        }
      }
      return new RegExp(pattern, flags);
    } catch {
      return null;
    }
  }, [findText, matchCase, wholeWord, useRegex]);

  // Find matching subtitle blocks and occurrences
  const matchingBlocks = useMemo(() => {
    if (!regex) return [];

    return subtitles
      .map((sub, index) => {
        const matches = sub.text.match(regex);
        if (!matches || matches.length === 0) return null;
        return {
          index,
          subtitle: sub,
          occurrenceCount: matches.length,
          previewNewText: sub.text.replace(regex, () => replaceText),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [subtitles, regex, replaceText]);

  const totalOccurrences = useMemo(() => {
    return matchingBlocks.reduce((acc, curr) => acc + curr.occurrenceCount, 0);
  }, [matchingBlocks]);

  // Handle Replace All
  const handleReplaceAll = () => {
    if (!regex || totalOccurrences === 0) return;

    const updatedSubtitles = subtitles.map((sub) => {
      // Re-initialize fresh regex per block to avoid lastIndex issues
      regex.lastIndex = 0;
      return {
        ...sub,
        text: sub.text.replace(regex, () => replaceText),
      };
    });

    onApplyUpdatedSubtitles(updatedSubtitles);
    setSuccessMessage(
      `Successfully replaced ${totalOccurrences} occurrence${
        totalOccurrences > 1 ? 's' : ''
      } across ${matchingBlocks.length} subtitle block${
        matchingBlocks.length > 1 ? 's' : ''
      }!`
    );
  };

  // Handle Replace in a single specific block
  const handleReplaceInBlock = (subId: string) => {
    if (!regex) return;

    const subIndex = subtitles.findIndex(s => s.id === subId);
    const updatedSubtitles = subtitles.map((sub) => {
      if (sub.id !== subId) return sub;
      regex.lastIndex = 0;
      return {
        ...sub,
        text: sub.text.replace(regex, () => replaceText),
      };
    });

    onApplyUpdatedSubtitles(updatedSubtitles);
    setSuccessMessage(`Updated subtitle #${subIndex !== -1 ? subIndex + 1 : 'block'}`);
  };

  // Swap find and replace values
  const handleSwapValues = () => {
    const temp = findText;
    setFindText(replaceText);
    setReplaceText(temp);
  };

  // Apply a preset
  const handleApplyPreset = (preset: JargonPreset) => {
    setFindText(preset.find);
    setReplaceText(preset.replace);
    setWholeWord(true);
    setUseRegex(false);
    setSuccessMessage(null);
  };

  // Scan with Gemini AI
  const handleRunAiScan = async () => {
    setIsAiScanning(true);
    setAiError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'spellcheck_suggestions',
          subtitles,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI spellcheck scan failed');
      }

      if (Array.isArray(data.suggestions)) {
        setAiSuggestions(data.suggestions);
        if (data.suggestions.length === 0) {
          setSuccessMessage('Gemini AI analyzed all subtitles and found no obvious transcription anomalies!');
        }
      }
    } catch (err: any) {
      setAiError(err.message || 'Failed to scan transcription with AI');
    } finally {
      setIsAiScanning(false);
    }
  };

  // Apply a single AI suggestion
  const handleApplyAiSuggestion = (suggestion: AiSuggestion) => {
    const escaped = suggestion.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startsWithWord = /^\w/.test(suggestion.find);
    const endsWithWord = /\w$/.test(suggestion.find);
    const localRegex = new RegExp(`${startsWithWord ? '\\b' : ''}${escaped}${endsWithWord ? '\\b' : ''}`, 'gi');

    let count = 0;
    const updated = subtitles.map((sub) => {
      const matches = sub.text.match(localRegex);
      if (matches) count += matches.length;
      return {
        ...sub,
        text: sub.text.replace(localRegex, () => suggestion.replace),
      };
    });

    if (count > 0) {
      onApplyUpdatedSubtitles(updated);
      setSuccessMessage(`Replaced "${suggestion.find}" with "${suggestion.replace}" in ${count} places.`);
      // Remove this suggestion from list
      setAiSuggestions((prev) => prev.filter((s) => s.find !== suggestion.find));
    } else {
      setSuccessMessage(`"${suggestion.find}" was not found in the current subtitles.`);
    }
  };

  // Batch apply all AI suggestions
  const handleApplyAllAiSuggestions = () => {
    if (aiSuggestions.length === 0) return;

    let updated = [...subtitles];
    let totalFixed = 0;

    for (const sugg of aiSuggestions) {
      const escaped = sugg.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const startsWithWord = /^\w/.test(sugg.find);
      const endsWithWord = /\w$/.test(sugg.find);
      const localRegex = new RegExp(`${startsWithWord ? '\\b' : ''}${escaped}${endsWithWord ? '\\b' : ''}`, 'gi');
      updated = updated.map((sub) => {
        const matches = sub.text.match(localRegex);
        if (matches) totalFixed += matches.length;
        return {
          ...sub,
          text: sub.text.replace(localRegex, () => sugg.replace),
        };
      });
    }

    onApplyUpdatedSubtitles(updated);
    setAiSuggestions([]);
    setSuccessMessage(`Applied all AI suggestions! Fixed ${totalFixed} occurrences across all subtitle blocks.`);
  };

  // Helper to highlight original text
  const renderHighlightedOriginal = (text: string) => {
    if (!regex) return <span>{text}</span>;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    const gRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
    let match: RegExpExecArray | null;
    let k = 0;
    let safetyCounter = 0;

    while ((match = gRegex.exec(text)) !== null && safetyCounter++ < 500) {
      if (match.index > lastIdx) {
        parts.push(text.slice(lastIdx, match.index));
      }
      parts.push(
        <mark
          key={`m-${k++}`}
          className="bg-amber-400/30 text-amber-200 border border-amber-500/50 px-1 py-0.5 rounded font-semibold"
        >
          {match[0]}
        </mark>
      );
      lastIdx = gRegex.lastIndex;
      if (match[0].length === 0) {
        gRegex.lastIndex++;
      }
    }
    if (lastIdx < text.length) {
      parts.push(text.slice(lastIdx));
    }
    return parts.length > 0 ? <>{parts}</> : <span>{text}</span>;
  };

  // Categories list
  const categories = ['All', 'Tech Brands', 'Acronyms & Homophones', 'Spoken Slang'];
  const filteredPresets = selectedCategory === 'All'
    ? JARGON_PRESETS
    : JARGON_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Header Description */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-sm text-slate-100 flex items-center space-x-2">
            <SpellCheck className="w-4 h-4 text-cyan-400" />
            <span>Smart Spellcheck & Terminology Replacement</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Batch find-and-replace speech recognition mishearings, technical jargon, proper names, and domain acronyms across all subtitle blocks.
          </p>
        </div>

        <button
          onClick={handleRunAiScan}
          disabled={isAiScanning || subtitles.length === 0}
          className="shrink-0 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50"
          title="Scan entire transcript with Gemini AI for acoustic errors"
        >
          {isAiScanning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>AI Error Detector</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-lg p-2.5 text-xs text-emerald-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-100 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {aiError && (
        <div className="bg-red-950/50 border border-red-500/50 rounded-lg p-2.5 text-xs text-red-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{aiError}</span>
          </div>
          <button
            onClick={() => setAiError(null)}
            className="text-red-400 hover:text-red-100 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* AI Suggestions Section if available */}
      {aiSuggestions.length > 0 && (
        <div className="bg-[#15151e] border border-purple-500/40 rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-xs text-purple-200">
                Gemini AI Detected {aiSuggestions.length} Transcription Corrections
              </span>
            </div>
            <button
              onClick={handleApplyAllAiSuggestions}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-semibold flex items-center space-x-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Apply All {aiSuggestions.length} Corrections</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {aiSuggestions.map((sugg, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-700/80 rounded-md p-2 flex items-start justify-between text-xs gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1 font-mono text-[11px]">
                    <span className="text-red-300 line-through bg-red-950/60 px-1 py-0.5 rounded">
                      "{sugg.find}"
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="text-emerald-300 font-bold bg-emerald-950/60 px-1 py-0.5 rounded">
                      "{sugg.replace}"
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">{sugg.reason}</div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => {
                      setFindText(sugg.find);
                      setReplaceText(sugg.replace);
                      setWholeWord(true);
                    }}
                    className="px-1.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition-colors"
                    title="Load into Find & Replace"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => handleApplyAiSuggestion(sugg)}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-medium transition-colors"
                    title="Apply this fix immediately"
                  >
                    Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Find & Replace Form */}
      <div className="bg-[#15151e] border border-slate-800 rounded-lg p-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          {/* Find input */}
          <div className="md:col-span-5 relative">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Find in Subtitles
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Word, acronym, or error to find..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-7 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {findText && (
                <button
                  onClick={() => setFindText('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-4">
            <button
              onClick={handleSwapValues}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Swap Find & Replace"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Replace input */}
          <div className="md:col-span-6 relative">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Replace With
            </label>
            <div className="relative">
              <Replace className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Corrected replacement text..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-7 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {replaceText && (
                <button
                  onClick={() => setReplaceText('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Options Row & Replace All Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          {/* Options Toggles */}
          <div className="flex items-center space-x-3 text-xs select-none">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0 w-3.5 h-3.5"
              />
              <span className="font-mono text-[11px]">Match Case (Aa)</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0 w-3.5 h-3.5"
              />
              <span className="font-mono text-[11px]">Whole Word (\b)</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0 w-3.5 h-3.5"
              />
              <span className="font-mono text-[11px]">Regex (.*)</span>
            </label>
          </div>

          {/* Match Counter & Replace All Button */}
          <div className="flex items-center space-x-2">
            {findText.trim() && (
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${
                  totalOccurrences > 0
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {totalOccurrences > 0
                  ? `${totalOccurrences} match${totalOccurrences > 1 ? 'es' : ''} in ${matchingBlocks.length} block${matchingBlocks.length > 1 ? 's' : ''}`
                  : '0 matches'}
              </span>
            )}

            <button
              onClick={handleReplaceAll}
              disabled={!findText.trim() || totalOccurrences === 0}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Replace className="w-3.5 h-3.5" />
              <span>Replace All ({totalOccurrences})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Common Presets & Jargon Quick-Fix Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <span>Common Transcription & Tech Jargon Presets</span>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1 text-[10px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-900/40 rounded-lg border border-slate-800/80">
          {filteredPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700/60 text-[11px] font-mono flex items-center space-x-1.5 transition-colors group"
            >
              <span className="text-slate-400 group-hover:text-cyan-400 font-sans">{preset.find}</span>
              <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
              <span className="text-emerald-400 font-semibold font-sans">{preset.replace}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Match Preview List */}
      {findText.trim() && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Matched Subtitle Blocks ({matchingBlocks.length})</span>
            </div>
            {totalOccurrences > 0 && (
              <span className="text-[11px] text-slate-400">
                Click "Replace" to fix individually, or "Replace All" above
              </span>
            )}
          </div>

          {matchingBlocks.length === 0 ? (
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg text-center text-xs text-slate-500">
              No matching subtitle blocks found for "{findText}". Try disabling "Whole Word" or checking spelling.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {matchingBlocks.map(({ subtitle, previewNewText }) => (
                <div
                  key={subtitle.id}
                  className="bg-[#161620] border border-slate-800 rounded-lg p-2.5 text-xs space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-blue-400 font-bold">#{subtitle.id}</span>
                      <span>
                        [{formatTimeDisplay(subtitle.startMs)} → {formatTimeDisplay(subtitle.endMs)}]
                      </span>
                      {subtitle.speaker && (
                        <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                          {subtitle.speaker}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleReplaceInBlock(subtitle.id)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded text-[10px] font-medium transition-colors border border-slate-700"
                    >
                      Replace in this block
                    </button>
                  </div>

                  {/* Original with highlight */}
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800 font-sans text-slate-200 text-xs leading-relaxed">
                    <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider block mb-0.5">
                      Current:
                    </span>
                    {renderHighlightedOriginal(subtitle.text)}
                  </div>

                  {/* Replaced Preview if replaceText is specified */}
                  {replaceText && (
                    <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80 font-sans text-slate-300 text-xs leading-relaxed">
                      <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-wider block mb-0.5">
                        Preview:
                      </span>
                      <span className="text-emerald-300 font-medium">{previewNewText}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
