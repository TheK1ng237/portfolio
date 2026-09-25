"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LogoIntro() {
  const [show, setShow] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [particlePositions, setParticlePositions] = useState<{ top: number; left: number }[]>([]);
  const fullText = "KINGTANG";

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check if intro has already played in this session to prevent annoyance
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setShow(false);
      return;
    }

    const positions = Array.from({ length: 30 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setParticlePositions(positions);

    const sequence = [
      () => setAnimationStep(1),
      () => setAnimationStep(2),
      () => setAnimationStep(3),
      () => {
        setAnimationStep(4);
        let i = 0;
        const typeWriter = () => {
          if (i < fullText.length) {
            setDisplayText(fullText.slice(0, i + 1));
            i++;
            timeoutRef.current = setTimeout(typeWriter, 70);
          } else {
            setShowCursor(false);
            timeoutRef.current = setTimeout(() => {
              setAnimationStep(5);
              timeoutRef.current = setTimeout(() => {
                setAnimationStep(6);
                timeoutRef.current = setTimeout(() => {
                  sessionStorage.setItem("hasSeenIntro", "true");
                  setShow(false);
                }, 500);
              }, 400);
            }, 300);
          }
        };
        typeWriter();
      },
    ];

    timeoutRef.current = setTimeout(sequence[0], 150);
    timeoutRef.current = setTimeout(sequence[1], 500);
    timeoutRef.current = setTimeout(sequence[2], 900);
    timeoutRef.current = setTimeout(sequence[3], 1300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setShow(false);
  };

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          onClick={handleSkip}
          className="fixed inset-0 flex flex-col items-center justify-center bg-[#050508] z-[99999] overflow-hidden cursor-pointer select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
        >
          {/* Skip hint */}
          <div className="absolute top-6 right-6 font-mono text-[9px] text-[#E9B826]/60 uppercase tracking-widest border border-[#E9B826]/20 px-3 py-1.5 rounded-full bg-[#0A0A0F]/80">
            [CLIQUEZ_POUR_PASSER]
          </div>

          {/* 3D Grid */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ perspective: "1000px" }}
            initial={{ opacity: 0 }}
            animate={animationStep >= 1 ? { opacity: 1 } : {}}
          >
            <motion.div
              className="absolute inset-0 origin-bottom"
              style={{
                background: `linear-gradient(90deg, rgba(233,184,38,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(233,184,38,0.12) 1px, transparent 1px)`,
                backgroundSize: "70px 70px",
                transform: "rotateX(70deg) translateZ(-400px)",
              }}
              animate={animationStep >= 1 ? { backgroundPositionY: ["0px", "70px"] } : {}}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particlePositions.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: `${pos.top}%`,
                  left: `${pos.left}%`,
                  width: "2px",
                  height: "2px",
                  background: "#E9B826",
                  boxShadow: "0 0 8px #E9B826",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  animationStep >= 1
                    ? {
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0],
                        y: [0, -120],
                      }
                    : {}
                }
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Central Logo Totem */}
          <div className="relative flex items-center justify-center scale-90 md:scale-100 z-10">
            <motion.div
              className="absolute w-72 h-72 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(233, 184, 38, 0.2) 0%, transparent 70%)",
              }}
              animate={
                animationStep >= 2
                  ? { scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }
                  : { opacity: 0 }
              }
              transition={{ duration: 3, repeat: Infinity }}
            />

            <motion.div
              className="relative z-20"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={
                animationStep >= 2
                  ? {
                      scale: 1,
                      opacity: 1,
                      filter: "drop-shadow(0 0 30px rgba(233, 184, 38, 0.6))",
                    }
                  : {}
              }
              transition={{ duration: 0.8, type: "spring" }}
            >
              <Image
                src="/logojaune.png"
                alt="KingTang Totem"
                width={180}
                height={180}
                className="object-contain relative z-10"
                priority
              />
            </motion.div>
          </div>

          {/* Typing Text */}
          <motion.div
            className="mt-16 text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={animationStep >= 4 ? { opacity: 1 } : {}}
          >
            <span className="relative text-3xl md:text-5xl font-black tracking-[0.35em] uppercase text-gold-shimmer font-mono">
              {displayText}
              {showCursor && (
                <motion.span
                  className="ml-2 inline-block h-6 md:h-10 w-1 bg-[#E9B826]"
                  animate={{ opacity: [0, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
              )}
            </span>
          </motion.div>

          <motion.div
            className="absolute bottom-10 font-mono text-[9px] tracking-[0.3em] text-[#E9B826]/70 z-10"
            initial={{ opacity: 0 }}
            animate={animationStep >= 4 ? { opacity: 1 } : {}}
          >
            {">"} SYSTEM_ACCESS: GRANTED // AFRO_FUTURIST_CORE_V2.6
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}