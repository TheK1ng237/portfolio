"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const WORD = "THEK1NG237";
const GOLD = "#D5AF36"; // or exact du logo
const BG = "#050508";
const EASE = [0.76, 0, 0.24, 1] as const;
const EXIT_AT = 3300; // ms : début de la sortie
const EXIT_DURATION = 1300; // ms : rideau + marge

type Phase = "check" | "play" | "exit" | "done";

export default function LogoIntro() {
  const [phase, setPhase] = useState<Phase>("check");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const exiting = useRef(false);

  const startExit = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    sessionStorage.setItem("hasSeenIntro", "true");
    setPhase("exit");
    timers.current.push(setTimeout(() => setPhase("done"), EXIT_DURATION));
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem("hasSeenIntro");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      sessionStorage.setItem("hasSeenIntro", "true");
      setPhase("done");
      return;
    }
    exiting.current = false;
    setPhase("play");
    timers.current.push(setTimeout(startExit, EXIT_AT));
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [startExit]);

  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "unset" : "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [phase]);

  if (phase === "done") return null;

  const leaving = phase === "exit";
  const playing = phase !== "check";

  return (
    <div className="fixed inset-0 z-[99999] select-none" aria-live="polite">
      <span className="sr-only">Thek1ng237 — chargement du portfolio</span>

      {/* Rideau en deux pans : il s'écarte sur la couture centrale */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 border-b"
        style={{ backgroundColor: BG, borderColor: `${GOLD}55` }}
        animate={{ y: leaving ? "-101%" : 0 }}
        transition={{ duration: 0.9, delay: leaving ? 0.25 : 0, ease: EASE }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 border-t"
        style={{ backgroundColor: BG, borderColor: `${GOLD}55` }}
        animate={{ y: leaving ? "101%" : 0 }}
        transition={{ duration: 0.9, delay: leaving ? 0.25 : 0, ease: EASE }}
      />

      {playing && (
        <>
          {/* Filet d'horizon : trace la couture avant l'apparition du logo */}
          <motion.div
            aria-hidden="true"
            className="absolute left-0 right-0 top-1/2 h-px origin-center"
            style={{ backgroundColor: GOLD }}
            initial={{ scaleX: 0, opacity: 0.9 }}
            animate={{ scaleX: 1, opacity: leaving ? 0 : 0.25 }}
            transition={{ scaleX: { duration: 0.9, ease: EASE }, opacity: { duration: leaving ? 0.3 : 1.2, delay: leaving ? 0 : 0.5 } }}
          />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            animate={leaving ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Lueur fixe derrière le logo */}
            <motion.div
              aria-hidden="true"
              className="absolute h-[70vmin] w-[70vmin] rounded-full"
              style={{ background: `radial-gradient(circle, ${GOLD}26 0%, transparent 65%)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.5 }}
            />

            {/* Logo : s'ouvre en losange depuis le centre, comme ses propres cadres */}
            <motion.div
              className="relative"
              style={{ height: "min(46vh, 420px)", aspectRatio: "1659 / 1896" }}
              initial={{ clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" }}
              animate={{ clipPath: "polygon(50% -25%, 125% 50%, 50% 125%, -25% 50%)" }}
              transition={{ duration: 1.3, delay: 0.35, ease: EASE }}
            >
              <Image
                src="/logojaune.png"
                alt="Logo Thek1ng237"
                fill
                sizes="(max-width: 640px) 60vw, 360px"
                priority
                className="object-contain"
              />
              {/* Reflet : un seul passage, visible uniquement sur les traits dorés (masque = logo) */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: "url(/logojaune.png)",
                  maskImage: "url(/logojaune.png)",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  backgroundImage: "linear-gradient(115deg, transparent 42%, rgba(255,248,220,0.95) 50%, transparent 58%)",
                  backgroundSize: "300% 100%",
                  backgroundRepeat: "no-repeat",
                }}
                initial={{ backgroundPositionX: "85%" }}
                animate={{ backgroundPositionX: "15%" }}
                transition={{ duration: 1.1, delay: 1.5, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Signature */}
            <div className="mt-8 flex gap-[0.18em] font-achiko text-2xl font-black sm:text-4xl" style={{ color: GOLD }} role="img" aria-label="Thek1ng237">
              {WORD.split("").map((ch, i) => (
                <span key={i} aria-hidden="true" className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, delay: 1.7 + i * 0.05, ease: EASE }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </div>
            <motion.p
              className="mt-3 text-center font-azurio text-[11px] uppercase tracking-[0.3em] text-gray-300 sm:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.4 }}
            >
              Ingénierie logicielle &amp; vision créative
            </motion.p>
          </motion.div>

          <button
            type="button"
            onClick={startExit}
            className="absolute right-5 top-5 rounded-full border px-4 py-2 font-azurio text-xs uppercase tracking-widest text-gray-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ borderColor: `${GOLD}66` }}
          >
            Passer
          </button>
        </>
      )}
    </div>
  );
}