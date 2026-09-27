"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LogoIntro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Auto dismiss after 2.4 seconds on every page refresh
    const timer = setTimeout(() => {
      setShow(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    setShow(false);
  };

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          onClick={handleSkip}
          className="fixed inset-0 z-[99999] bg-[#05060C] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none font-azurio"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.06,
            filter: "blur(16px)",
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* SKIP HINT BADGE */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute top-6 right-6 font-mono text-[9px] text-[#FFC82C]/70 uppercase tracking-[0.25em] border border-[#FFC82C]/30 px-3.5 py-1.5 rounded-full bg-[#0B0D18]/80 backdrop-blur-md"
          >
            [CLIQUEZ_POUR_PASSER]
          </motion.div>

          {/* BACKGROUND ENERGY RADIAL AURA & CYBER RING */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Ambient Radial Golden Glow */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [0.5, 1.25, 1], opacity: [0, 0.4, 0.2] }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="w-[500px] h-[500px] rounded-full bg-[#FFC82C]/20 blur-[130px]"
            />

            {/* Rotating Cyber Pattern Ring */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 0.3, rotate: 90 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-dashed border-[#FFC82C]/40 absolute"
            />
          </div>

          {/* MAIN TOTEM & KINETIC REVEAL */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Shutter Energy Laser Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: 0.6,
                times: [0, 0.5, 1],
                ease: "easeInOut",
              }}
              className="h-[2px] w-64 bg-[#FFC82C] shadow-[0_0_20px_#FFC82C] absolute"
            />

            {/* LOGO SEAL WITH SPRING POP */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{
                delay: 0.3,
                duration: 0.7,
                type: "spring",
                stiffness: 180,
                damping: 20,
              }}
              className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-[#FFC82C]/20 blur-xl"
              />
              <Image
                src="/logojaune.png"
                alt="KingTang Totem Seal"
                width={160}
                height={160}
                className="object-contain relative z-10 drop-shadow-[0_0_25px_rgba(255,200,44,0.5)]"
                priority
              />
            </motion.div>

            {/* KINETIC TYPOGRAPHY REVEAL */}
            <div className="mt-8 overflow-hidden text-center">
              <motion.h1
                initial={{ y: 30, opacity: 0, letterSpacing: "0.2em" }}
                animate={{ y: 0, opacity: 1, letterSpacing: "0.45em" }}
                transition={{
                  delay: 0.7,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-achiko text-3xl sm:text-5xl font-black uppercase text-white tracking-[0.45em] drop-shadow-[0_0_20px_rgba(255,200,44,0.4)]"
              >
                TheK1ng<span className="text-[#FFC82C]">237</span>
              </motion.h1>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
