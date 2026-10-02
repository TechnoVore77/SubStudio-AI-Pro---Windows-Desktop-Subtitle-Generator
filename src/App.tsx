import React, { useState, useEffect, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { VideoPlayer } from './components/VideoPlayer';
import { TimelineWaveform } from './components/TimelineWaveform';
import { SubtitleListEditor } from './components/SubtitleListEditor';
import { AiToolsModal } from './components/AiToolsModal';
import { ExportModal } from './components/ExportModal';
import { ScanConfigModal } from './components/ScanConfigModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { SamplePickerModal } from './components/SamplePickerModal';
import { PublishingModal } from './components/PublishingModal';
import { PricingModal } from './components/PricingModal';
import { SAMPLE_VIDEOS, SampleVideo } from './data/sampleVideos';

import {
  SubtitleItem,
  SubtitleStyle,
  AiScanConfig,
  VideoAnalysis
} from './types';
import { extractAudioBase64FromFile } from './utils/audioExtractor';
import { parseSrtOrVtt } from './utils/srtExporter';
import {
  Sparkles,
  Upload,
  Download,
  Sliders,
  Play,
  Languages,
  Wand2,
  Cpu,
  CheckCircle2,
  Film,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  X
} from 'lucide-react';

export default function App() {
  // Video & Subtitle state
  const [videoSrc, setVideoSrc] = useState<string>(SAMPLE_VIDEOS[0].src);
  const [videoName, setVideoName] = useState<string>(SAMPLE_VIDEOS[0].title);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [durationSec, setDurationSec] = useState<number>(SAMPLE_VIDEOS[0].duration);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [scanError, setScanError] = useState<string | null>(null);

  // Subtitle blocks state
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>(
    SAMPLE_VIDEOS[0].defaultSubtitles.map((item, idx) => ({
      id: `sub_${idx + 1}`,
      startMs: item.startMs,
      endMs: item.endMs,
      text: item.text,
      speaker: item.speaker,
      confidence: 0.98,
    }))
  );

  const [activeSubtitleId, setActiveSubtitleId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Video Analysis insights
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>({
    languageDetected: 'English',
    videoSummary: SAMPLE_VIDEOS[0].description,
    keyHighlights: ['00:00 - Introduction', '00:04 - AI Subtitle Scanning', '00:08 - Real-time Timestamps'],
  });

  // AI Configuration & Styling
  const [scanConfig, setScanConfig] = useState<AiScanConfig>({
    model: 'gemini-3.8-flash',
    language: 'auto',
    enableDiarization: true,
    customVocabulary: '',
  });

  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>({
    fontSize: 22,
    color: '#FFFFFF',
    backgroundColor: '#000000',
    backgroundOpacity: 0.75,
    position: 'bottom',
    fontWeight: 'bold',
    textShadow: true,
    strokeColor: '#000000',
    fontFamily: 'sans-serif',
  });

  // Modals state
  const [showSamplePicker, setShowSamplePicker] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showAiToolsModal, setShowAiToolsModal] = useState<boolean>(false);
  const [aiToolsInitialTab, setAiToolsInitialTab] = useState<'spellcheck' | 'translate' | 'polish' | 'censor' | 'social' | 'summary'>('spellcheck');
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [showPublishingModal, setShowPublishingModal] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);

  // Pro & scan quota state
  const [isProUser, setIsProUser] = useState<boolean>(() => {
    return localStorage.getItem('substudio_pro') === 'true';
  });
  const [scansRemaining, setScansRemaining] = useState<number>(() => {
    const stored = localStorage.getItem('substudio_scans_left');
    return stored !== null ? parseInt(stored, 10) : 3;
  });

  const handleActivateProKey = (key: string): boolean => {
    const cleaned = key.trim().toUpperCase();
    if (cleaned.startsWith('PRO-') || cleaned.startsWith('ULTRA-') || cleaned.length >= 6) {
      setIsProUser(true);
      localStorage.setItem('substudio_pro', 'true');
      return true;
    }
    return false;
  };

  const handleOpenAiTools = (tab: 'spellcheck' | 'translate' | 'polish' | 'censor' | 'social' | 'summary' = 'spellcheck') => {
    setAiToolsInitialTab(tab);
    setShowAiToolsModal(true);
  };

  // Synchronize active subtitle matching current time
  useEffect(() => {
    const active = subtitles.find(
      s => currentTimeMs >= s.startMs && currentTimeMs <= s.endMs
    );
    if (active) {
      setActiveSubtitleId(active.id);
    } else {
      setActiveSubtitleId(null);
    }
  }, [currentTimeMs, subtitles]);

  const objectUrlRef = React.useRef<string | null>(null);

  // Keyboard shortcut handler for Windows Desktop feel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        const video = document.querySelector('video') as HTMLVideoElement | null;
        if (video) {
          if (video.paused) video.play().catch(() => {});
          else video.pause();
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const video = document.querySelector('video') as HTMLVideoElement | null;
        if (video) {
          const delta = e.shiftKey ? 10 : 3;
          video.currentTime = Math.max(0, video.currentTime - delta);
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const video = document.querySelector('video') as HTMLVideoElement | null;
        if (video) {
          const delta = e.shiftKey ? 10 : 3;
          video.currentTime = Math.min(video.duration || 9999, video.currentTime + delta);
        }
      } else if (e.code === 'Home') {
        e.preventDefault();
        const video = document.querySelector('video') as HTMLVideoElement | null;
        if (video) video.currentTime = 0;
      } else if (e.code === 'KeyO' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowSamplePicker(true);
      } else if (e.code === 'KeyS' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowExportModal(true);
      } else if (e.code === 'KeyH' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleOpenAiTools('spellcheck');
      } else if (e.code === 'KeyF' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const searchInput = document.getElementById('subtitle-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      } else if (e.code === 'Slash' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle local video file upload
  const handleFileUpload = (file: File) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setVideoSrc(objectUrl);
    setVideoName(file.name);
    setVideoFile(file);
    setCurrentTimeMs(0);
    setSubtitles([]);
    setVideoAnalysis(null);
  };

  // Handle subtitle file (.srt / .vtt) import
  const handleImportSubtitle = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseSrtOrVtt(text);
      if (parsed.length === 0) {
        setScanError('No valid SRT or WebVTT timestamped subtitles found in file.');
        return;
      }
      setSubtitles(parsed);
      setScanError(null);
    } catch (err: any) {
      setScanError('Failed to read subtitle file: ' + (err.message || 'Unknown error'));
    }
  };

  const handleClearSubtitles = () => {
    setSubtitles([]);
  };

  // Handle selecting demo sample video
  const handleSelectSample = (sample: SampleVideo) => {
    setVideoSrc(sample.src);
    setVideoName(sample.title);
    setVideoFile(null);
    setCurrentTimeMs(0);
    setDurationSec(sample.duration);
    setSubtitles(
      sample.defaultSubtitles.map((item, idx) => ({
        id: `sub_${idx + 1}`,
        startMs: item.startMs,
        endMs: item.endMs,
        text: item.text,
        speaker: item.speaker,
        confidence: 0.98,
      }))
    );
    setVideoAnalysis({
      languageDetected: 'English',
      videoSummary: sample.description,
      keyHighlights: ['00:00 Key highlight 1', '00:05 Key highlight 2'],
    });
  };

  // Run Gemini AI Video Scanning & Timestamp Subtitle Generation
  const handleRunAiScan = async () => {
    setScanError(null);

    if (!isProUser && scansRemaining <= 0) {
      setShowPricingModal(true);
      setScanError("You have used all 3 free starter scans! Upgrade to Pro for unlimited AI video scanning.");
      return;
    }

    setIsProcessing(true);

    try {
      let audioBase64 = '';
      let mimeType = 'audio/wav';

      if (videoFile) {
        // Extract audio from uploaded video file
        const extracted = await extractAudioBase64FromFile(videoFile);
        audioBase64 = extracted.base64;
        mimeType = extracted.mimeType;
      } else {
        // Fetch sample video buffer if no raw local file available
        try {
          const fetchRes = await fetch(videoSrc);
          if (!fetchRes.ok) {
            throw new Error(`Failed to load video stream (${fetchRes.status})`);
          }
          const blob = await fetchRes.blob();
          if (blob.type.includes('xml') || blob.type.includes('html')) {
            throw new Error('Video source returned an invalid document response.');
          }
          const dummyFile = new File([blob], 'sample.mp4', { type: blob.type || 'video/mp4' });
          const extracted = await extractAudioBase64FromFile(dummyFile);
          audioBase64 = extracted.base64;
          mimeType = extracted.mimeType;
        } catch (fetchErr: any) {
          throw new Error(`Could not load video audio: ${fetchErr.message || 'Network error'}. Please upload a local video file.`);
        }
      }

      const response = await fetch('/api/generate-subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: audioBase64,
          mimeType,
          model: scanConfig.model,
          language: scanConfig.language,
          enableDiarization: scanConfig.enableDiarization,
          customVocabulary: scanConfig.customVocabulary,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate subtitles with AI.');
      }

      if (json.data) {
        setSubtitles(json.data.subtitles || []);
        setVideoAnalysis({
          languageDetected: json.data.languageDetected || 'Auto',
          videoSummary: json.data.videoSummary || '',
          keyHighlights: json.data.keyHighlights || [],
        });

        // Decrement free quota if not a pro user
        if (!isProUser) {
          setScansRemaining(prev => {
            const next = Math.max(0, prev - 1);
            localStorage.setItem('substudio_scans_left', next.toString());
            return next;
          });
        }
      }
    } catch (err: any) {
      console.error('AI Scan Error:', err);
      setScanError(err.message || 'AI scanning failed. Please verify your GEMINI_API_KEY.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Subtitle CRUD handlers
  const handleUpdateSubtitle = (id: string, updated: Partial<SubtitleItem>) => {
    setSubtitles(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const handleAddSubtitle = (afterId?: string) => {
    const newId = `sub_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    if (!afterId || subtitles.length === 0) {
      const startMs = currentTimeMs;
      const endMs = startMs + 3000;
      setSubtitles(prev => [...prev, { id: newId, startMs, endMs, text: 'New Subtitle Block', speaker: 'Speaker 1', confidence: 1.0 }].sort((a, b) => a.startMs - b.startMs));
    } else {
      const index = subtitles.findIndex(s => s.id === afterId);
      if (index !== -1) {
        const target = subtitles[index];
        const nextTarget = subtitles[index + 1];
        const startMs = target.endMs + 50;
        const endMs = nextTarget && nextTarget.startMs > startMs + 500 ? Math.min(startMs + 3000, nextTarget.startMs - 50) : startMs + 3000;
        const newSubs = [...subtitles];
        newSubs.splice(index + 1, 0, { id: newId, startMs, endMs, text: 'New Subtitle Block', speaker: target.speaker, confidence: 1.0 });
        setSubtitles(newSubs.sort((a, b) => a.startMs - b.startMs));
      }
    }
  };

  const handleDeleteSubtitle = (id: string) => {
    setSubtitles(prev => prev.filter(s => s.id !== id));
  };

  const handleSplitSubtitle = (id: string) => {
    const target = subtitles.find(s => s.id === id);
    if (!target) return;
    const duration = target.endMs - target.startMs;
    if (duration < 250) return;
    const midMs = Math.round(target.startMs + duration / 2);
    const words = target.text.trim().split(/\s+/);
    const firstHalf = words.slice(0, Math.ceil(words.length / 2)).join(' ');
    const secondHalf = words.slice(Math.ceil(words.length / 2)).join(' ');

    const sub1: SubtitleItem = { ...target, endMs: midMs, text: firstHalf || target.text };
    const sub2: SubtitleItem = {
      id: `sub_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      startMs: midMs,
      endMs: target.endMs,
      text: secondHalf || '...',
      speaker: target.speaker,
      confidence: target.confidence,
    };

    setSubtitles(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1, sub1, sub2);
      return copy;
    });
  };

  const handleMergeSubtitle = (id: string) => {
    const idx = subtitles.findIndex(s => s.id === id);
    if (idx === -1 || idx >= subtitles.length - 1) return;
    const current = subtitles[idx];
    const next = subtitles[idx + 1];

    const merged: SubtitleItem = {
      ...current,
      endMs: Math.max(current.endMs, next.endMs),
      text: `${current.text.trim()} ${next.text.trim()}`.trim(),
    };

    setSubtitles(prev => {
      const copy = [...prev];
      copy.splice(idx, 2, merged);
      return copy;
    });
  };

  const handleBatchShift = (shiftMs: number) => {
    setSubtitles(prev =>
      prev.map(s => {
        const newStart = Math.max(0, s.startMs + shiftMs);
        const newEnd = Math.max(newStart + 100, s.endMs + shiftMs);
        return {
          ...s,
          startMs: newStart,
          endMs: newEnd,
        };
      })
    );
  };

  return (
    <div className="w-screen h-screen bg-[#141419] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Title Bar */}
      <TitleBar
        onOpenVideo={() => setShowSamplePicker(true)}
        onExport={() => setShowExportModal(true)}
        onOpenAiTools={handleOpenAiTools}
        onOpenConfig={() => setShowConfigModal(true)}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        onOpenPricing={() => setShowPricingModal(true)}
        onImportSubtitle={handleImportSubtitle}
        onClearSubtitles={handleClearSubtitles}
        isProcessing={isProcessing}
        videoLoaded={!!videoSrc}
        subtitleCount={subtitles.length}
        isProUser={isProUser}
        scansRemaining={scansRemaining}
      />

      {/* Main Desktop Workstation Canvas Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden bg-[#121217]">
        {/* Left Column (Video Player + Timeline Waveform) - 7 cols */}
        <div className="lg:col-span-7 flex flex-col space-y-3 overflow-y-auto">
          {/* Main Video Box */}
          <VideoPlayer
            videoSrc={videoSrc}
            subtitles={subtitles}
            currentTimeMs={currentTimeMs}
            onTimeUpdate={setCurrentTimeMs}
            onDurationChange={setDurationSec}
            subtitleStyle={subtitleStyle}
            onUpdateStyle={(newStyle) => setSubtitleStyle(prev => ({ ...prev, ...newStyle }))}
            isProcessing={isProcessing}
            activeSubtitleId={activeSubtitleId}
          />

          {/* Interactive Waveform Track Bar */}
          <TimelineWaveform
            durationMs={durationSec * 1000}
            currentTimeMs={currentTimeMs}
            subtitles={subtitles}
            onSeek={setCurrentTimeMs}
            activeSubtitleId={activeSubtitleId}
            onSelectSubtitle={setActiveSubtitleId}
          />

          {/* AI Scan Toolbar Banner */}
          <div className="bg-[#1c1c24] border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-100 flex items-center space-x-1">
                  <span>Gemini AI Subtitle Scanner</span>
                  <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/30">
                    {scanConfig.model}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Scans video audio for spoken dialogue & outputs accurate SRT timestamps automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowConfigModal(true)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Configure AI Model & Speaker Settings"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <button
                disabled={isProcessing}
                onClick={handleRunAiScan}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>{isProcessing ? 'Scanning Audio...' : 'Scan Video with Gemini AI'}</span>
              </button>
            </div>
          </div>

          {/* AI Scan Error Warning Banner */}
          {scanError && (
            <div className="bg-red-950/40 border border-red-500/40 rounded-lg p-3 text-xs flex items-start justify-between gap-2 text-red-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-300">Scan Error</div>
                  <div className="text-[11px] text-red-300/80 leading-relaxed">{scanError}</div>
                </div>
              </div>
              <button
                onClick={() => setScanError(null)}
                className="p-1 rounded text-red-400 hover:text-red-200 hover:bg-red-900/40 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Video Summary Insights Card if available */}
          {videoAnalysis && (
            <div className="bg-[#181820] border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center space-x-2 text-blue-400 font-bold">
                <FileText className="w-4 h-4" />
                <span>AI Video Content Insights ({videoAnalysis.languageDetected})</span>
              </div>
              {videoAnalysis.videoSummary && (
                <p className="text-slate-300 text-[11px] leading-relaxed">{videoAnalysis.videoSummary}</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column (Subtitle Tracks Editor) - 5 cols */}
        <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
          <SubtitleListEditor
            subtitles={subtitles}
            currentTimeMs={currentTimeMs}
            activeSubtitleId={activeSubtitleId}
            onSeek={setCurrentTimeMs}
            onUpdateSubtitle={handleUpdateSubtitle}
            onAddSubtitle={handleAddSubtitle}
            onDeleteSubtitle={handleDeleteSubtitle}
            onSplitSubtitle={handleSplitSubtitle}
            onMergeSubtitle={handleMergeSubtitle}
            onBatchShift={handleBatchShift}
            isProcessing={isProcessing}
            onOpenSpellcheck={() => handleOpenAiTools('spellcheck')}
          />
        </div>
      </div>

      {/* Footer Desktop Status Bar */}
      <div className="bg-[#191920] border-t border-slate-800/80 px-3 py-1 text-[11px] text-slate-400 flex items-center justify-between font-mono select-none">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-slate-300">
            <Film className="w-3 h-3 text-blue-400" />
            <span className="truncate max-w-[200px]">{videoName}</span>
          </span>
          <span>Duration: {(durationSec).toFixed(1)}s</span>
          <span>Subtitles: {subtitles.length} blocks</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-emerald-400">SRT / VTT / TXT Export Ready</span>
          <button
            onClick={() => setShowExportModal(true)}
            className="text-blue-400 hover:underline flex items-center space-x-1"
          >
            <Download className="w-3 h-3" />
            <span>Export (Ctrl+S)</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <SamplePickerModal
        isOpen={showSamplePicker}
        onClose={() => setShowSamplePicker(false)}
        onSelectSample={handleSelectSample}
        onFileUpload={handleFileUpload}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        subtitles={subtitles}
        videoName={videoName}
      />

      <ScanConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        config={scanConfig}
        onUpdateConfig={(cfg) => setScanConfig(prev => ({ ...prev, ...cfg }))}
        onRunScan={handleRunAiScan}
      />

      <AiToolsModal
        isOpen={showAiToolsModal}
        onClose={() => setShowAiToolsModal(false)}
        subtitles={subtitles}
        onApplyUpdatedSubtitles={setSubtitles}
        initialTab={aiToolsInitialTab}
        onApplySummaryText={(text) =>
          setVideoAnalysis(prev => ({ ...prev, videoSummary: text }))
        }
      />

      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {showPublishingModal && (
        <PublishingModal
          onClose={() => setShowPublishingModal(false)}
        />
      )}

      {showPricingModal && (
        <PricingModal
          onClose={() => setShowPricingModal(false)}
          scansRemaining={scansRemaining}
          isProUser={isProUser}
          onActivateProKey={handleActivateProKey}
        />
      )}
    </div>
  );
}
