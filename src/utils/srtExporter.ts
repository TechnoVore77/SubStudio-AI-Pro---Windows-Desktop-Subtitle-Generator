import { SubtitleItem, SubtitleFormat } from '../types';

/**
 * Format milliseconds into HH:MM:SS,mmm format for SRT
 */
export function formatTimeSrt(ms: number): string {
  const safeMs = Math.max(0, Math.floor(Number.isFinite(ms) ? ms : 0));
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = safeMs % 1000;

  const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}

/**
 * Format milliseconds into HH:MM:SS.mmm format for VTT
 */
export function formatTimeVtt(ms: number): string {
  const safeMs = Math.max(0, Math.floor(Number.isFinite(ms) ? ms : 0));
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = safeMs % 1000;

  const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

/**
 * Format milliseconds into clean MM:SS.ms for UI display
 */
export function formatTimeDisplay(ms: number): string {
  const safeMs = Math.max(0, Math.floor(Number.isFinite(ms) ? ms : 0));
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((safeMs % 1000) / 100);

  const pad = (num: number) => num.toString().padStart(2, '0');
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${tenths}`;
  }
  return `${pad(minutes)}:${pad(seconds)}.${tenths}`;
}

/**
 * Parse SRT / VTT timestamp (e.g. 01:23:45,678 or 00:01:23.456 or 01:23.456 or 00:01:23) into milliseconds
 */
export function parseSrtTimeToMs(timeStr: string): number {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  try {
    const cleaned = timeStr.trim();
    // Match HH:MM:SS,mmm or HH:MM:SS.mmm
    const matchFullWithMs = cleaned.match(/(\d+):(\d+):(\d+)[,\.](\d+)/);
    if (matchFullWithMs) {
      const hours = parseInt(matchFullWithMs[1], 10);
      const minutes = parseInt(matchFullWithMs[2], 10);
      const seconds = parseInt(matchFullWithMs[3], 10);
      const ms = parseInt(matchFullWithMs[4].padEnd(3, '0').slice(0, 3), 10);
      return hours * 3600000 + minutes * 60000 + seconds * 1000 + ms;
    }

    // Match HH:MM:SS (without ms)
    const matchFullNoMs = cleaned.match(/^(\d+):(\d+):(\d+)/);
    if (matchFullNoMs) {
      const hours = parseInt(matchFullNoMs[1], 10);
      const minutes = parseInt(matchFullNoMs[2], 10);
      const seconds = parseInt(matchFullNoMs[3], 10);
      return hours * 3600000 + minutes * 60000 + seconds * 1000;
    }

    // Match MM:SS,mmm or MM:SS.mmm
    const matchShortWithMs = cleaned.match(/(\d+):(\d+)[,\.](\d+)/);
    if (matchShortWithMs) {
      const minutes = parseInt(matchShortWithMs[1], 10);
      const seconds = parseInt(matchShortWithMs[2], 10);
      const ms = parseInt(matchShortWithMs[3].padEnd(3, '0').slice(0, 3), 10);
      return minutes * 60000 + seconds * 1000 + ms;
    }

    // Match MM:SS (without ms)
    const matchShortNoMs = cleaned.match(/^(\d+):(\d+)$/);
    if (matchShortNoMs) {
      const minutes = parseInt(matchShortNoMs[1], 10);
      const seconds = parseInt(matchShortNoMs[2], 10);
      return minutes * 60000 + seconds * 1000;
    }

    // Match pure seconds (e.g. "45.5" or "12s")
    const matchSeconds = cleaned.match(/^(\d+(?:\.\d+)?)s?$/);
    if (matchSeconds) {
      return Math.round(parseFloat(matchSeconds[1]) * 1000);
    }

    return 0;
  } catch {
    return 0;
  }
}

/**
 * Parse imported SRT or WebVTT string into SubtitleItem array
 */
export function parseSrtOrVtt(content: string): SubtitleItem[] {
  if (!content || typeof content !== 'string') return [];
  // Strip BOM and normalize newlines
  const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  const items: SubtitleItem[] = [];

  let currentStart = 0;
  let currentEnd = 0;
  let currentSpeaker = '';
  let currentTextLines: string[] = [];
  let hasActiveCue = false;

  const timeRegex = /(?:(\d+):)?(\d+):(\d+)(?:[,\.](\d+))?\s*-->\s*(?:(\d+):)?(\d+):(\d+)(?:[,\.](\d+))?/;

  const flush = () => {
    if (currentTextLines.length > 0 && hasActiveCue) {
      let fullText = currentTextLines.join(' ').trim();
      let detectedSpeaker = currentSpeaker;

      // Detect [Speaker 1] or <v Speaker 1> in text if not set
      const vttSpeakerMatch = fullText.match(/^<v\s+([^>]+)>(.*)$/i);
      if (vttSpeakerMatch) {
        detectedSpeaker = vttSpeakerMatch[1].trim();
        fullText = vttSpeakerMatch[2].trim();
      } else {
        const bracketSpeakerMatch = fullText.match(/^\[([^\]]+)\]\s*(.*)$/);
        if (bracketSpeakerMatch) {
          detectedSpeaker = bracketSpeakerMatch[1].trim();
          fullText = bracketSpeakerMatch[2].trim();
        }
      }

      // Strip any leftover HTML/VTT tags like <b>, </i>, <c.color>
      fullText = fullText.replace(/<[^>]+>/g, '').trim();

      if (fullText) {
        const safeStart = Math.max(0, currentStart);
        const safeEnd = Math.max(safeStart + 100, currentEnd);
        items.push({
          id: `sub_${items.length + 1}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          startMs: safeStart,
          endMs: safeEnd,
          text: fullText,
          speaker: detectedSpeaker || 'Speaker 1',
          confidence: 1.0,
        });
      }
    }
    currentStart = 0;
    currentEnd = 0;
    currentSpeaker = '';
    currentTextLines = [];
    hasActiveCue = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('WEBVTT') || line.startsWith('NOTE') || line.startsWith('STYLE') || line.startsWith('REGION')) {
      if (!line && currentTextLines.length > 0) {
        flush();
      }
      continue;
    }

    const timeMatch = line.match(timeRegex);
    if (timeMatch) {
      flush();
      const parts = line.split('-->');
      if (parts.length === 2) {
        currentStart = parseSrtTimeToMs(parts[0]);
        // Strip any cue settings like "position:10% align:center" from the end timestamp
        const endPart = parts[1].trim().split(/\s+/)[0];
        currentEnd = parseSrtTimeToMs(endPart);
        hasActiveCue = true;
      }
    } else if (hasActiveCue) {
      // Check if it's an index number line like "1" or "2" before text
      if (/^\d+$/.test(line) && currentTextLines.length === 0) {
        continue;
      }
      currentTextLines.push(line);
    }
  }

  flush();
  return items.sort((a, b) => a.startMs - b.startMs);
}

/**
 * Convert SubtitleItem array to SRT string content
 */
export function generateSrt(subtitles: SubtitleItem[], includeSpeakers: boolean = true): string {
  return subtitles
    .slice()
    .sort((a, b) => a.startMs - b.startMs)
    .map((sub, index) => {
      const speakerPrefix = includeSpeakers && sub.speaker ? `[${sub.speaker}] ` : '';
      return `${index + 1}\n${formatTimeSrt(sub.startMs)} --> ${formatTimeSrt(sub.endMs)}\n${speakerPrefix}${sub.text}\n`;
    })
    .join('\n');
}

/**
 * Convert SubtitleItem array to VTT string content
 */
export function generateVtt(subtitles: SubtitleItem[], includeSpeakers: boolean = true): string {
  const header = 'WEBVTT - Generated by SubStudio AI Pro\n\n';
  const body = subtitles
    .slice()
    .sort((a, b) => a.startMs - b.startMs)
    .map((sub, index) => {
      const speakerTag = includeSpeakers && sub.speaker ? `<v ${sub.speaker}>` : '';
      return `${index + 1}\n${formatTimeVtt(sub.startMs)} --> ${formatTimeVtt(sub.endMs)}\n${speakerTag}${sub.text}\n`;
    })
    .join('\n');
  return header + body;
}

/**
 * Convert SubtitleItem array to Plain Text Transcript
 */
export function generateTxt(subtitles: SubtitleItem[], includeTimestamps: boolean = true, includeSpeakers: boolean = true): string {
  return subtitles
    .slice()
    .sort((a, b) => a.startMs - b.startMs)
    .map((sub) => {
      const timeTag = includeTimestamps ? `[${formatTimeDisplay(sub.startMs)}] ` : '';
      const speakerTag = includeSpeakers && sub.speaker ? `${sub.speaker}: ` : '';
      return `${timeTag}${speakerTag}${sub.text}`;
    })
    .join('\n');
}

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export subtitles in chosen format
 */
export function exportSubtitles(subtitles: SubtitleItem[], format: SubtitleFormat, baseFileName: string = 'subtitles', includeSpeakers: boolean = true) {
  const cleanName = baseFileName.replace(/\.[^/.]+$/, '');
  
  if (format === 'srt') {
    const srtText = generateSrt(subtitles, includeSpeakers);
    downloadFile(srtText, `${cleanName}.srt`, 'text/plain;charset=utf-8');
  } else if (format === 'vtt') {
    const vttText = generateVtt(subtitles, includeSpeakers);
    downloadFile(vttText, `${cleanName}.vtt`, 'text/vtt;charset=utf-8');
  } else if (format === 'txt') {
    const txtText = generateTxt(subtitles, true, includeSpeakers);
    downloadFile(txtText, `${cleanName}.txt`, 'text/plain;charset=utf-8');
  } else if (format === 'json') {
    const jsonText = JSON.stringify(subtitles, null, 2);
    downloadFile(jsonText, `${cleanName}.json`, 'application/json;charset=utf-8');
  }
}

