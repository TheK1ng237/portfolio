"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LOGO_PATHS, LOGO_VIEWBOX } from "./logo-paths";

const WORD = "THEK1NG237";
const GOLD = "#D5AF36"; // or exact du logo
const BG = "#050508";
const EASE = [0.76, 0, 0.24, 1] as const;
const EXIT_AT = 5200; // ms : début de la sortie
const EXIT_DURATION = 1300; // ms : rideau + marge

type Phase = "play" | "exit" | "done";

/* Délais du tracé : cadres d'abord (du plus grand au plus petit), puis monogramme, puis détails */
const TIMING = [
  (i: number) => ({ delay: 0.3 + i * 0.2, duration: 1.5 }),
  (i: number) => ({ delay: 1.3 + i * 0.04, duration: 1.0 }),
  (i: number) => ({ delay: 2.0 + (i % 20) * 0.03, duration: 0.5 }),
] as const;

function LogoMark() {
  const counters = [0, 0, 0];
  return (
    <div className="relative" style={{ height: "min(46vh, 420px)", aspectRatio: "1659 / 1896" }}>
      {/* Contours qui se dessinent, puis s'effacent derrière le logo plein */}
      <motion.svg
        aria-hidden="true"
        viewBox={LOGO_VIEWBOX}
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke={GOLD}
        strokeLinejoin="round"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 3.3 }}
      >
        {LOGO_PATHS.map((p, k) => {
          const { delay, duration } = TIMING[p.tier](counters[p.tier]++);
          return (
            <motion.path
              key={k}
              d={p.d}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration, delay, ease: "easeInOut" }}
            />
          );
        })}
      </motion.svg>

      {/* Logo plein, fidèle au PNG, qui prend le relais une fois le tracé terminé */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 3.0 }}
      >
        <Image src="/logojaune.png" alt="Logo Thek1ng237" fill sizes="(max-width: 640px) 60vw, 360px" priority className="object-contain" />
      </motion.div>
    </div>
  );
}

export default function LogoIntro() {
  const [phase, setPhase] = useState<Phase>("play");
  const [reduce, setReduce] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const exiting = useRef(false);

  const startExit = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    setPhase("exit");
    timers.current.push(setTimeout(() => setPhase("done"), EXIT_DURATION));
  }, []);

  // L'intro se joue à chaque chargement de la page
  useEffect(() => {
    exiting.current = false;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(prefersReduced);
    timers.current.push(setTimeout(startExit, prefersReduced ? 1200 : EXIT_AT));
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

  // Mouvement réduit : logo fixe, simple fondu de sortie
  if (reduce) {
    return (
      <div
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-500"
        style={{ backgroundColor: BG, opacity: leaving ? 0 : 1 }}
        aria-live="polite"
      >
        <span className="sr-only">Thek1ng237 — chargement du portfolio</span>
        <div className="relative" style={{ height: "min(46vh, 420px)", aspectRatio: "1659 / 1896" }}>
          <Image src="/logojaune.png" alt="Logo Thek1ng237" fill sizes="(max-width: 640px) 60vw, 360px" priority className="object-contain" />
        </div>
        <p className="mt-8 font-achiko text-2xl font-black sm:text-4xl" style={{ color: GOLD }}>
          {WORD}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] select-none" aria-live="polite">
      <span className="sr-only">Thek1ng237 — chargement du portfolio</span>

      {/* Rideau en deux pans : il s'écarte sur la couture centrale */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ backgroundColor: BG }}
        animate={{ y: leaving ? "-101%" : 0 }}
        transition={{ duration: 0.9, delay: leaving ? 0.25 : 0, ease: EASE }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ backgroundColor: BG }}
        animate={{ y: leaving ? "101%" : 0 }}
        transition={{ duration: 0.9, delay: leaving ? 0.25 : 0, ease: EASE }}
      />

      {/* Filet d'horizon : apparait apres le dessin du logo */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 right-0 top-1/2 h-px origin-center"
        style={{ backgroundColor: GOLD }}
        initial={{ scaleX: 0, opacity: 0.9 }}
        animate={{ scaleX: 1, opacity: leaving ? 0 : 0.25 }}
        transition={{
          scaleX: { duration: 0.9, delay: leaving ? 0 : 3.1, ease: EASE },
          opacity: { duration: leaving ? 0.3 : 1.2, delay: leaving ? 0 : 3.1 },
        }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        animate={leaving ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Lueur fixe derrière le logo, une fois dessiné */}
        <motion.div
          aria-hidden="true"
          className="absolute h-[70vmin] w-[70vmin] rounded-full"
          style={{ background: `radial-gradient(circle, ${GOLD}26 0%, transparent 65%)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.9 }}
        />

        <LogoMark />

        {/* Signature */}
        <div className="mt-8 flex gap-[0.18em] font-achiko text-2xl font-black sm:text-4xl" style={{ color: GOLD }} role="img" aria-label="Thek1ng237">
          {WORD.split("").map((ch, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 3.3 + i * 0.05, ease: EASE }}
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
          transition={{ duration: 0.8, delay: 4.0 }}
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
    </div>
  );
}