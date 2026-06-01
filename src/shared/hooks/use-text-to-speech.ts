"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";

interface SpeakOptions {
  source?: string;
}

// Global Cache for FPT TTS Audio URLs
const fptAudioCache = new Map<string, string>();

// Global State
let isVoiceEnabled = true;
let isSpeaking = false;
let isLoading = false;
let globalError: string | null = null;
let autoplayBlocked = false;
let lastAttemptedText: { text: string; locale: string } | null = null;

// Audio references
let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let activePollingCancel: (() => void) | null = null;

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("vietfood_tts_enabled");
  isVoiceEnabled = saved !== "false";
}

// Pub/sub listeners for global state
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function updateState(updates: {
  isVoiceEnabled?: boolean;
  isSpeaking?: boolean;
  isLoading?: boolean;
  error?: string | null;
  autoplayBlocked?: boolean;
}) {
  if (updates.isVoiceEnabled !== undefined) isVoiceEnabled = updates.isVoiceEnabled;
  if (updates.isSpeaking !== undefined) isSpeaking = updates.isSpeaking;
  if (updates.isLoading !== undefined) isLoading = updates.isLoading;
  if (updates.error !== undefined) globalError = updates.error;
  if (updates.autoplayBlocked !== undefined) {
    autoplayBlocked = updates.autoplayBlocked;
    if (updates.autoplayBlocked) {
      setupInteractionListener();
    } else {
      cleanupInteractionListener();
    }
  }

  listeners.forEach((l) => l());
}

function handleUserInteraction() {
  if (autoplayBlocked && lastAttemptedText) {
    const { text, locale } = lastAttemptedText;
    updateState({ autoplayBlocked: false });
    speak(text, locale);
  }
}

function setupInteractionListener() {
  if (typeof window !== "undefined") {
    // Use capture and once to handle first interaction
    window.addEventListener("click", handleUserInteraction, { once: true, capture: true });
    window.addEventListener("touchstart", handleUserInteraction, { once: true, capture: true });
  }
}

function cleanupInteractionListener() {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", handleUserInteraction, { capture: true });
    window.removeEventListener("touchstart", handleUserInteraction, { capture: true });
  }
}

function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();

  // Prefer Microsoft Zira
  const zira = voices.find(
    (v) => v.lang.startsWith("en") && v.name.includes("Zira")
  );
  if (zira) return zira;

  // Fallback to any en voice
  const enVoice = voices.find((v) => v.lang.startsWith("en"));
  if (enVoice) return enVoice;

  return null;
}

export function stopSpeech() {
  if (activePollingCancel) {
    activePollingCancel();
    activePollingCancel = null;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  currentUtterance = null;
  updateState({ isSpeaking: false, isLoading: false });
}

export function sanitizeText(text: string): string {
  if (!text) return "";

  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove markdown images
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Remove markdown links, keep label
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    // Remove formatting characters (*, _, `, ~, #)
    .replace(/[*_`~#]/g, "")
    // Remove bullet list markers at the start of lines
    .replace(/^\s*[-+*]\s+/gm, "")
    // Remove ordered list markers at start of lines (e.g. "1. ")
    .replace(/^\s*\d+\.\s+/gm, "")
    // Remove citation brackets (e.g., [1], [citation:1])
    .replace(/\[\d+\]/g, "")
    .replace(/\[citation:[^\]]*\]/g, "")
    // Remove dish tags (e.g., [dish:123])
    .replace(/\[dish:[^\]]*\]/g, "")
    // Normalize spaces/newlines
    .replace(/\s+/g, " ")
    .trim();
}

export async function speak(text: string, locale: string) {
  stopSpeech();

  if (!isVoiceEnabled) {
    lastAttemptedText = { text, locale };
    return;
  }

  const cleanText = sanitizeText(text);
  if (!cleanText) return;

  // Limit characters to avoid wasting quota
  const maxChars = parseInt(process.env.NEXT_PUBLIC_TTS_MAX_CHARS || "1000", 10);
  let truncatedText = cleanText.slice(0, maxChars);

  // FPT AI requires at least 3 characters
  if (locale === "vi" && truncatedText.length < 3) {
    truncatedText = truncatedText.padEnd(3, ".");
  }

  lastAttemptedText = { text: truncatedText, locale };

  updateState({ isLoading: true, error: null });

  if (locale === "vi") {
    let isCancelled = false;
    activePollingCancel = () => {
      isCancelled = true;
    };

    try {
      let audioUrl = fptAudioCache.get(truncatedText) || "";

      if (!audioUrl) {
        const res = await fetch("/api/tts/fpt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: truncatedText }),
        });

        if (!res.ok) {
          const errorJson = await res.json().catch(() => ({}));
          throw new Error(errorJson.error || `HTTP error ${res.status}`);
        }

        const data = await res.json();
        audioUrl = data.audioUrl;
        if (audioUrl) {
          fptAudioCache.set(truncatedText, audioUrl);
        }
      }

      if (isCancelled) return;

      // Play with retry loop for async URL generation
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 15;
        const pollInterval = 800;
        let timeoutId: any;

        const attemptPlay = () => {
          if (isCancelled) return;
          attempts++;

          const audio = new Audio(audioUrl);
          currentAudio = audio;

          const cleanup = () => {
            audio.removeEventListener("canplaythrough", onCanPlay);
            audio.removeEventListener("error", onError);
            audio.removeEventListener("ended", onEnded);
          };

          const onCanPlay = () => {
            if (isCancelled) {
              cleanup();
              return;
            }
            updateState({ isLoading: false, isSpeaking: true });
            audio.play()
              .then(() => {
                resolve();
              })
              .catch((err) => {
                cleanup();
                if (err.name === "NotAllowedError") {
                  reject(err);
                } else {
                  retryOrReject();
                }
              });
          };

          const onError = () => {
            cleanup();
            retryOrReject();
          };

          const onEnded = () => {
            cleanup();
            updateState({ isSpeaking: false });
            resolve();
          };

          audio.addEventListener("canplaythrough", onCanPlay);
          audio.addEventListener("error", onError);
          audio.addEventListener("ended", onEnded);
          audio.load();
        };

        const retryOrReject = () => {
          if (isCancelled) return;
          if (attempts >= maxAttempts) {
            reject(new Error("Failed to load audio from FPT AI TTS (timeout)"));
          } else {
            timeoutId = setTimeout(attemptPlay, pollInterval);
          }
        };

        activePollingCancel = () => {
          isCancelled = true;
          clearTimeout(timeoutId);
          if (currentAudio) {
            currentAudio.pause();
            currentAudio.src = "";
            currentAudio = null;
          }
        };

        attemptPlay();
      });

    } catch (err: any) {
      if (isCancelled) return;
      if (err.name === "NotAllowedError") {
        updateState({ autoplayBlocked: true, isSpeaking: false, isLoading: false });
      } else {
        updateState({
          error: err.message || "Failed to generate speech",
          isSpeaking: false,
          isLoading: false,
        });
      }
    }
  } else {
    // English TTS via Web Speech API
    if (typeof window === "undefined" || !window.speechSynthesis) {
      updateState({
        error: "Speech synthesis not supported in this browser",
        isLoading: false,
      });
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(truncatedText);
      currentUtterance = utterance;

      const voice = getEnglishVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        updateState({ isLoading: false, isSpeaking: true });
      };

      utterance.onend = () => {
        updateState({ isSpeaking: false });
      };

      utterance.onerror = (event) => {
        if (event.error === "not-allowed") {
          updateState({ autoplayBlocked: true, isSpeaking: false, isLoading: false });
        } else {
          updateState({
            error: event.error || "Speech synthesis error",
            isSpeaking: false,
            isLoading: false,
          });
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      updateState({
        error: err.message || "Speech synthesis failed",
        isLoading: false,
      });
    }
  }
}

export function toggleVoice() {
  const nextVal = !isVoiceEnabled;
  if (typeof window !== "undefined") {
    localStorage.setItem("vietfood_tts_enabled", String(nextVal));
  }
  updateState({ isVoiceEnabled: nextVal, autoplayBlocked: false });
  if (!nextVal) {
    stopSpeech();
  } else if (lastAttemptedText) {
    // Replay last sentence if enabled
    speak(lastAttemptedText.text, lastAttemptedText.locale);
  }
}

export function enableVoice() {
  if (typeof window !== "undefined") {
    localStorage.setItem("vietfood_tts_enabled", "true");
  }
  updateState({ isVoiceEnabled: true, autoplayBlocked: false });
  if (lastAttemptedText) {
    speak(lastAttemptedText.text, lastAttemptedText.locale);
  }
}

export function disableVoice() {
  if (typeof window !== "undefined") {
    localStorage.setItem("vietfood_tts_enabled", "false");
  }
  updateState({ isVoiceEnabled: false });
  stopSpeech();
}

export function useTextToSpeech() {
  const locale = useLocale();
  const [, setTick] = useState(0);

  // Force re-render when global state updates
  useEffect(() => {
    return subscribe(() => setTick((t) => t + 1));
  }, []);

  // Listen to speechSynthesis voices changed event
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const handleVoicesChanged = () => {
      // Force update
      setTick((t) => t + 1);
    };

    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []);

  const handleSpeak = useCallback((text: string, options?: SpeakOptions) => {
    speak(text, locale);
  }, [locale]);

  return {
    speak: handleSpeak,
    stop: stopSpeech,
    enableVoice,
    disableVoice,
    toggleVoice,
    isVoiceEnabled,
    isSpeaking,
    isLoading,
    error: globalError,
    autoplayBlocked,
  };
}
