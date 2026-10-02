import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limits for video/audio data transfers
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Helper to get GoogleGenAI client lazy-initialized
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "SubStudio AI Pro Server" });
});

function safeParseJson<T = any>(raw: string | undefined | null, fallback: T): T {
  if (!raw || typeof raw !== "string") return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    try {
      const cleaned = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      return JSON.parse(cleaned);
    } catch {
      const match = raw.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
      if (match) {
        try {
          return JSON.parse(match[1]);
        } catch {
          return fallback;
        }
      }
      return fallback;
    }
  }
}

// Endpoint: Generate timestamped subtitles from audio/video payload
app.post("/api/generate-subtitles", async (req, res) => {
  try {
    const { audioData, mimeType = "audio/wav", model = "gemini-3.8-flash", language = "auto", enableDiarization = true, customVocabulary = "" } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: "No audio or video data provided." });
    }

    const ai = getGenAIClient();

    // Clean up base64 string if data URL prefix exists
    let cleanBase64 = audioData;
    let actualMimeType = mimeType;
    if (audioData.startsWith("data:")) {
      const matches = audioData.match(/^data:([^;]+);base64,(.*)$/);
      if (matches) {
        actualMimeType = matches[1] || mimeType;
        cleanBase64 = matches[2];
      } else {
        cleanBase64 = audioData.replace(/^data:[^;]+;base64,/, "");
      }
    }
    cleanBase64 = cleanBase64.replace(/\s+/g, "");

    // Validate that the uploaded payload is actually audio or video, not corrupt XML/HTML
    if (
      actualMimeType.includes("xml") ||
      actualMimeType.includes("html") ||
      (!actualMimeType.startsWith("audio/") && !actualMimeType.startsWith("video/"))
    ) {
      return res.status(400).json({
        success: false,
        error: "The provided file is not a valid audio or video recording.",
      });
    }

    const promptText = `You are a professional audio/video transcription and subtitle generation engine.
Target output language requirement: ${language === "auto" ? "Detect language automatically" : language}.
Enable Speaker Diarization: ${enableDiarization ? "Yes (identify Speaker 1, Speaker 2, or character name)" : "No"}.
${customVocabulary ? `Technical/Domain Vocabulary list: ${customVocabulary}` : ""}

CRITICAL ACCURACY REQUIREMENT:
1. Transcribe the spoken audio with exact timestamp accuracy relative to the beginning of the audio track (0 ms).
2. Measure startMs and endMs in precise milliseconds (e.g. 1500 for 00:01.500). Ensure startMs corresponds to the exact time the first word of the phrase is uttered, and endMs corresponds to when the phrase finishes.
3. Keep subtitle blocks short and naturally synchronized with the speaker's cadence (approx. 1.5 to 5 seconds per block, max 50 characters per block).
4. Do NOT hallucinate audio timestamps; sync strictly with the speech audio provided.
5. Provide a short 2-sentence summary of the video content and 3 key highlight bullet points with timestamps.

Return valid JSON adhering strictly to the schema.`;

    const modelName = model === "gemini-3.1-pro-preview" ? "gemini-3.1-pro-preview" : "gemini-3.8-flash";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: actualMimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            languageDetected: {
              type: Type.STRING,
              description: "Detected primary language (e.g., English, Spanish, Japanese)",
            },
            videoSummary: {
              type: Type.STRING,
              description: "A short 2-sentence overview of the video topic",
            },
            keyHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Top key highlights or topic timestamps",
            },
            subtitles: {
              type: Type.ARRAY,
              description: "Array of generated timestamped subtitle segments",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  startMs: { type: Type.NUMBER, description: "Start time in milliseconds" },
                  endMs: { type: Type.NUMBER, description: "End time in milliseconds" },
                  text: { type: Type.STRING, description: "The transcribed subtitle text" },
                  speaker: { type: Type.STRING, description: "Speaker identifier (e.g., Speaker 1)" },
                  confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
                },
                required: ["id", "startMs", "endMs", "text"],
              },
            },
          },
          required: ["subtitles", "languageDetected", "videoSummary", "keyHighlights"],
        },
      },
    });

    const resultText = response.text || "{}";
    const parsedData = safeParseJson(resultText, null);
    if (!parsedData || typeof parsedData !== "object") {
      throw new Error("Unable to parse structured subtitle JSON response from Gemini.");
    }

    // Format IDs, clamp time ranges, and sort chronologically
    if (Array.isArray(parsedData.subtitles)) {
      parsedData.subtitles = parsedData.subtitles.map((sub: any, idx: number) => {
        const start = Math.max(0, Math.round(sub.startMs || 0));
        const end = Math.max(start + 200, Math.round(sub.endMs || start + 2500));
        return {
          id: sub.id || `sub_${idx + 1}`,
          startMs: start,
          endMs: end,
          text: (sub.text || "").trim(),
          speaker: sub.speaker || "Speaker 1",
          confidence: sub.confidence ?? 0.95,
        };
      });
      parsedData.subtitles.sort((a: any, b: any) => a.startMs - b.startMs);
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Error generating subtitles:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate subtitles with AI",
    });
  }
});

// Endpoint: AI Tools (Translate, Polish Grammar/Punctuation, Censor, Social Short Format, Video Insights, Spellcheck)
app.post("/api/ai-tool", async (req, res) => {
  try {
    const { action, subtitles, targetLanguage } = req.body;

    if (!Array.isArray(subtitles)) {
      return res.status(400).json({ error: "Valid subtitles array is required." });
    }

    if (subtitles.length === 0) {
      if (action === "spellcheck_suggestions") {
        return res.json({ success: true, suggestions: [] });
      }
      if (action === "summarize_text") {
        return res.json({ success: true, text: "No subtitles available to summarize." });
      }
      return res.json({ success: true, subtitles: [] });
    }

    if (!["translate", "polish", "censor", "reformat_social", "summarize_text", "spellcheck_suggestions"].includes(action)) {
      return res.status(400).json({ success: false, error: `Unsupported AI action: ${action}` });
    }

    const ai = getGenAIClient();

    let promptText = "";
    const modelName = "gemini-3.8-flash";

    if (action === "translate") {
      promptText = `Translate the text field of each subtitle segment into target language: "${targetLanguage || "Spanish"}". Preserve the original id, startMs, endMs, and speaker fields exactly. Do not alter timestamps. Return JSON array of updated subtitle objects.`;
    } else if (action === "polish") {
      promptText = `Polish the subtitle text: fix capitalization, correct punctuation, eliminate spoken stutter/fillers ("um", "uh", "like", "you know"), format numbers cleanly. Keep original id, startMs, endMs, speaker. Return JSON array of updated subtitle objects.`;
    } else if (action === "censor") {
      promptText = `Filter profanity and offensive language in subtitle texts by replacing swear words with asterisks (e.g. "****"). Keep original id, startMs, endMs, speaker. Return JSON array of updated subtitle objects.`;
    } else if (action === "reformat_social") {
      promptText = `Reformat the subtitles into short, viral social media style captions (1 to 4 words per block for TikTok/Reels/Shorts). Interpolate startMs and endMs proportionally for each short segment so text syncs with speech. Return JSON array of updated subtitle objects.`;
    } else if (action === "summarize_text") {
      promptText = `Based on the following transcript subtitles:
${JSON.stringify(subtitles.map(s => `[${s.speaker || 'Speaker'}] ${s.text}`))}

Provide:
1. Executive Summary (3 bullet points)
2. 5 Topic Chapters with timestamps
3. Sentiment & Tone analysis`;
    }

    if (action === "spellcheck_suggestions") {
      const spellcheckPrompt = `You are an expert audio transcription proofreader and technical jargon specialist.
Review the following subtitle transcript lines and identify common automatic speech recognition errors, phonetic mishearings, domain jargon mistakes, and proper noun or brand name casing issues (such as "git hub" instead of "GitHub", "a pie" instead of "API", "aye" instead of "AI", "docker" instead of "Docker", "open ai" instead of "OpenAI", homophones like "there/their", or spoken transcription artifacts).

Subtitles:
${JSON.stringify(subtitles.map((s: any) => ({ id: s.id, text: s.text })))}

Find words or short phrases that are actually present in the provided subtitle texts and suggest their corrected replacement.
Return a JSON array of suggestions with:
- "find": exact word or phrase as it appears in the text
- "replace": the corrected replacement word or phrase
- "reason": brief explanation why this correction is recommended (e.g. "Industry standard capitalization" or "Phonetic audio misrecognition")

Only output genuine errors or misspellings present in the text. If no clear errors are found, return an empty array [].`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: spellcheckPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                find: { type: Type.STRING },
                replace: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ["find", "replace", "reason"],
            },
          },
        },
      });

      const parsedSuggestions = safeParseJson(response.text, []);
      return res.json({ success: true, suggestions: parsedSuggestions });
    }

    if (action === "summarize_text") {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptText,
      });
      return res.json({ success: true, text: response.text });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { text: promptText },
        { text: `Subtitles JSON Input: ${JSON.stringify(subtitles)}` },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              startMs: { type: Type.NUMBER },
              endMs: { type: Type.NUMBER },
              text: { type: Type.STRING },
              speaker: { type: Type.STRING },
            },
            required: ["id", "startMs", "endMs", "text"],
          },
        },
      },
    });

    const parsed = safeParseJson(response.text, []);
    const sanitized = Array.isArray(parsed)
      ? parsed.map((sub: any, idx: number) => {
          const original = subtitles[idx];
          const start = Math.max(0, Math.round(sub.startMs ?? original?.startMs ?? idx * 2000));
          const end = Math.max(start + 100, Math.round(sub.endMs ?? original?.endMs ?? (start + 2000)));
          return {
            id: sub.id || original?.id || `sub_${idx + 1}`,
            startMs: start,
            endMs: end,
            text: (sub.text || "").trim(),
            speaker: sub.speaker || original?.speaker || "Speaker 1",
            confidence: sub.confidence ?? original?.confidence ?? 0.95,
          };
        }).sort((a: any, b: any) => a.startMs - b.startMs)
      : [];
    return res.json({ success: true, subtitles: sanitized });
  } catch (error: any) {
    console.error("AI Tool Error:", error);
    return res.status(500).json({ success: false, error: error.message || "AI Tool processing failed" });
  }
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SubStudio AI Pro Server listening on http://localhost:${PORT}`);
  });
}

startServer();
