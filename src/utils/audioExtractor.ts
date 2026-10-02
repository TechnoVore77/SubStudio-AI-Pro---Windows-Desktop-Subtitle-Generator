/**
 * Extract audio from a File object (video/audio) or URL into base64 format suitable for AI API
 */
export async function extractAudioBase64FromFile(file: File, maxDurationMs: number = 300000): Promise<{ base64: string; mimeType: string }> {
  let audioContext: AudioContext | null = null;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) {
      throw new Error("Web Audio API is not supported in this browser environment.");
    }
    audioContext = new AudioCtxClass();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    if (!audioBuffer || audioBuffer.numberOfChannels === 0 || audioBuffer.length === 0) {
      throw new Error("The audio/video file does not contain a valid decodable audio track.");
    }

    // Resample to 16kHz mono audio buffer using Web Audio API OfflineAudioContext
    const wavBase64 = await audioBufferToWavBase64(audioBuffer, maxDurationMs);
    return { base64: wavBase64, mimeType: 'audio/wav' };
  } catch (err) {
    console.warn("AudioContext extraction failed or no audio track, falling back to FileReader:", err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const mimeType = file.type || 'video/mp4';
        resolve({ base64: result, mimeType });
      };
      reader.onerror = (readErr) => reject(readErr);
      reader.readAsDataURL(file);
    });
  } finally {
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close().catch(() => {});
    }
  }
}

/**
 * Encodes an AudioBuffer into a WAV base64 string using OfflineAudioContext for exact 16kHz resample
 */
async function audioBufferToWavBase64(buffer: AudioBuffer, maxDurationMs: number): Promise<string> {
  const targetSampleRate = 16000; // 16kHz for Gemini AI speech recognition optimization
  const validDuration = Number.isFinite(buffer.duration) && buffer.duration > 0 ? buffer.duration : 1;
  const durationSec = Math.min(validDuration, maxDurationMs / 1000);
  const targetLength = Math.max(160, Math.floor(durationSec * targetSampleRate));

  // Use OfflineAudioContext for high-precision resampling without speed drift or pitch distortion
  const offlineCtx = new OfflineAudioContext(1, targetLength, targetSampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();
  const pcmData = renderedBuffer.getChannelData(0);

  // Create WAV header & PCM 16-bit payload
  const wavLength = 44 + pcmData.length * 2;
  const wavBuffer = new ArrayBuffer(wavLength);
  const view = new DataView(wavBuffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + pcmData.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw PCM) */
  view.setUint16(20, 1, true);
  /* channel count (Mono = 1) */
  view.setUint16(22, 1, true);
  /* sample rate */
  view.setUint32(24, targetSampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, targetSampleRate * 2, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, pcmData.length * 2, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < pcmData.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  // Convert ArrayBuffer to Base64 in safe chunks
  const bytes = new Uint8Array(wavBuffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
