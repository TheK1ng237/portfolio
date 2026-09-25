"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export default function Hero() {
  const t = useTranslations("Hero");

  // 3D Card Parallax Tilt Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative min-h-[92vh] w-full flex flex-col justify-center items-center overflow-hidden px-6 pt-24 pb-16">
      {/* 1. AMBIENT BACKGROUND GLOW & GEOMETRIC GRID */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-[#E9B826]/20 via-[#E63946]/10 to-transparent blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#E9B826]/10 blur-[100px] pointer-events-none" />

      {/* 2. HERO CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: HERO TEXT & BADGES */}
        <div className="lg:col-span-7 text-left space-y-8">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#E9B826]/30 bg-[#0A0A0F]/80 backdrop-blur-xl shadow-[0_0_20px_rgba(233,184,38,0.1)]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
            </span>
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-200">
              {t("badge")}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-2"
          >
            <span className="block text-xs font-mono text-[#E9B826] tracking-[0.4em] uppercase">
              CREATIVE DEVELOPER & UX ARCHITECT
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] text-white">
              {t("title_top")}{" "}
              <span className="block text-gold-shimmer font-serif italic mt-1">
                {t("title_highlight")}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle / Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-gray-300 max-w-xl leading-relaxed border-l-2 border-[#E63946] pl-6 font-light"
          >
            {t.rich("description", {
              culture: (chunks) => (
                <span className="text-[#E9B826] font-semibold">{chunks}</span>
              ),
              tech: (chunks) => (
                <span className="text-white font-semibold">{chunks}</span>
              ),
            })}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="#projets"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#E9B826] text-black font-bold text-xs font-mono tracking-widest uppercase rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(233,184,38,0.5)] active:scale-95"
            >
              <span className="relative z-10">{t("cta_projects")}</span>
              <i className="pi pi-arrow-right relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0A0A0F]/70 border border-white/20 hover:border-[#E9B826] text-white font-bold text-xs font-mono tracking-widest uppercase rounded-lg backdrop-blur-md transition-all duration-300 hover:bg-white/5 active:scale-95"
            >
              {t("cta_contact")}
            </Link>
          </motion.div>

          {/* Live Key Performance Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg"
          >
            <div>
              <span className="block text-2xl md:text-3xl font-black text-[#E9B826] font-mono">
                05+
              </span>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                Expérience (Ans)
              </span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-black text-white font-mono">
                25+
              </span>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                Projets Livrés
              </span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-black text-[#E63946] font-mono">
                100%
              </span>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                Satisfaction UX
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE 3D TILT MASCOT CARD */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-80 h-96 md:w-96 md:h-[30rem] glass-card rounded-2xl p-4 cursor-pointer group"
          >
            {/* Holographic Frame Corner Accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#E9B826]" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#E9B826]" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#E63946]" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#E63946]" />

            {/* Inner Image Wrapper */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#0A0A0F] border border-white/10">
              <Image
                src="/mascote.png"
                alt={t("alt_portrait")}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />

              {/* Dynamic HUD Overlay Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-[#050508]/80 backdrop-blur-md border border-[#E9B826]/20 flex justify-between items-center">
                <div>
                  <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest">
                    MASCOT_IDENT
                  </span>
                  <span className="block text-xs font-black text-[#E9B826] tracking-wider">
                    KINGTANG // V2.6
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-[#E9B826]/40 flex items-center justify-center bg-[#E9B826]/10">
                  <i className="pi pi-bolt text-xs text-[#E9B826] animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}