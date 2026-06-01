"use client";

import { useTextToSpeech } from "@/shared/hooks/use-text-to-speech";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function SpeakerToggle() {
  const t = useTranslations("common");
  const {
    isVoiceEnabled,
    isSpeaking,
    isLoading,
    autoplayBlocked,
    toggleVoice,
  } = useTextToSpeech();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 opacity-50" />
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleVoice}
        className={`relative flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 active:scale-95 ${
          autoplayBlocked
            ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)] animate-pulse"
            : !isVoiceEnabled
            ? "border-white/10 bg-white/5 text-white/30 hover:text-white/50"
            : "border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.15)]"
        }`}
        title={isVoiceEnabled ? "Mute Voice Guide" : "Unmute Voice Guide"}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : !isVoiceEnabled ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>

      {/* Autoplay Blocked Pulsating Tooltip */}
      {autoplayBlocked && (
        <div className="absolute right-0 top-11 z-50 w-48 pointer-events-none">
          <div className="relative bg-amber-500 text-black text-[11px] font-bold py-1.5 px-2.5 rounded-md shadow-lg border border-amber-600 animate-bounce">
            <div className="absolute right-3.5 -top-1 w-2 h-2 bg-amber-500 rotate-45 border-t border-l border-amber-600" />
            <p className="text-center leading-tight">
              {t("enableAudioTooltip")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
