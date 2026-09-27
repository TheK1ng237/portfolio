"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

export default function AudioController() {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudioCtx = () => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playHoverTone = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore audio glitches
    }
  }, [isMuted]);

  const toggleAudio = () => {
    initAudioCtx();
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("a, button, [role='button'], .glass-card")) {
        playHoverTone();
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, [playHoverTone]);

  return (
    <button
      onClick={toggleAudio}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFC82C]/30 bg-[#121526]/80 backdrop-blur-md hover:border-[#FFC82C] transition-all text-[9px] font-mono tracking-widest text-[#FFC82C] uppercase group shadow-[0_0_15px_rgba(255,200,44,0.15)]"
      title={isMuted ? "Activer l'ambiance sonore" : "Désactiver l'ambiance sonore"}
    >
      <div className="relative flex items-center justify-center w-3 h-3">
        {isMuted ? (
          <i className="pi pi-volume-off text-[10px] text-gray-400 group-hover:text-[#FFC82C]" />
        ) : (
          <div className="flex items-end gap-[2px] h-3">
            <motion.span
              animate={{ height: ["20%", "100%", "40%"] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="w-[2px] bg-[#FFC82C] rounded-full"
            />
            <motion.span
              animate={{ height: ["60%", "30%", "90%"] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-[2px] bg-[#FFD700] rounded-full"
            />
            <motion.span
              animate={{ height: ["40%", "80%", "20%"] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="w-[2px] bg-[#FFC82C] rounded-full"
            />
          </div>
        )}
      </div>
      <span className="hidden sm:inline font-bold opacity-90 group-hover:opacity-100">
        {isMuted ? "AUDIO_OFF" : "AUDIO_ON"}
      </span>
    </button>
  );
}
