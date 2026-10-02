import React from 'react';
import { X, Cpu, Sliders, Languages, UserCheck, BookOpen, Sparkles } from 'lucide-react';
import { AiScanConfig } from '../types';

interface ScanConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AiScanConfig;
  onUpdateConfig: (config: Partial<AiScanConfig>) => void;
  onRunScan: () => void;
}

export const ScanConfigModal: React.FC<ScanConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onRunScan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c24] border border-slate-700/80 rounded-xl max-w-md w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-[#242430] border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Gemini AI Subtitle Scan Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* AI Model selection */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 font-semibold text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Speech Model Engine</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateConfig({ model: 'gemini-3.8-flash' })}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  config.model === 'gemini-3.8-flash'
                    ? 'bg-blue-950/50 border-blue-500 text-blue-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-[11px] text-slate-100">Gemini 3.8 Flash</div>
                <div className="text-[10px] text-slate-400">Fast & precise timestamp scanning</div>
              </button>

              <button
                onClick={() => onUpdateConfig({ model: 'gemini-3.1-pro-preview' })}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  config.model === 'gemini-3.1-pro-preview'
                    ? 'bg-purple-950/50 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-[11px] text-slate-100">Gemini 3.1 Pro</div>
                <div className="text-[10px] text-slate-400">Deep reasoning & noisy audio logic</div>
              </button>
            </div>
          </div>

          {/* Primary Language */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 font-semibold text-slate-200">
              <Languages className="w-3.5 h-3.5 text-purple-400" />
              <span>Primary Audio Language</span>
            </label>
            <select
              value={config.language}
              onChange={(e) => onUpdateConfig({ language: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="auto">Auto-Detect Speech Language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
              <option value="Chinese">Chinese (Mandarin)</option>
              <option value="Italian">Italian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Korean">Korean</option>
              <option value="Russian">Russian</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          {/* Speaker Diarization */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-lg">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1 font-semibold text-slate-200">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Speaker Diarization</span>
              </div>
              <div className="text-[10px] text-slate-400">Identify different speakers (Speaker 1, Speaker 2)</div>
            </div>
            <input
              type="checkbox"
              checked={config.enableDiarization}
              onChange={(e) => onUpdateConfig({ enableDiarization: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
          </div>

          {/* Custom Vocabulary */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 font-semibold text-slate-200">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Custom Vocabulary / Acronyms (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Kubernetes, PyTorch, SubStudio, Dr. Smith"
              value={config.customVocabulary}
              onChange={(e) => onUpdateConfig({ customVocabulary: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onRunScan();
                onClose();
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Video Scan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
