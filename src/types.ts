export interface SubtitleItem {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  speaker?: string;
  confidence?: number;
}

export interface VideoMetadata {
  name: string;
  size?: string;
  duration: number; // in seconds
  src: string;
  type: string;
  dimensions?: { width: number; height: number };
}

export type SubtitleFormat = 'srt' | 'vtt' | 'txt' | 'json';

export interface SubtitleStyle {
  fontSize: number; // in px
  color: string; // text hex or rgba
  backgroundColor: string; // box background
  backgroundOpacity: number; // 0 to 1
  position: 'bottom' | 'top' | 'center';
  fontWeight: 'normal' | 'bold' | '900';
  textShadow: boolean;
  strokeColor: string;
  fontFamily: string;
}

export interface AiScanConfig {
  model: 'gemini-3.8-flash' | 'gemini-3.1-pro-preview';
  language: string;
  enableDiarization: boolean;
  customVocabulary: string;
}

export interface VideoAnalysis {
  languageDetected?: string;
  videoSummary?: string;
  keyHighlights?: string[];
}
