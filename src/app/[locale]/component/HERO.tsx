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

  const mouseXSpring = useSpring(x, { damping: 25, stiffness: 200 });
  const mouseYSpring = useSpring(y, { damping: 25, stiffness: 200 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

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
    <section className="relative min-h-[92vh] w-full flex flex-col justify-center items-center overflow-hidden px-6 pt-24 pb-16 bg-[#0B0D18]">
      {/* HERO CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: HERO TEXT & BADGES */}
        <div className="lg:col-span-7 text-left space-y-8">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-4.5 py-2 rounded-full border border-[#FFC82C] bg-[#121526] font-azurio shadow-[0_0_20px_rgba(255,200,44,0.2)]"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-85" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]" />
            </span>
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-white font-bold">
              {t("badge")}
            </span>
          </motion.div>

          {/* Main Title - Achiko for main headings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-3"
          >
            <span className="block text-xs font-azurio text-[#FFC82C] tracking-[0.45em] uppercase font-bold">
              CREATIVE DEVELOPER & UX ARCHITECT
            </span>
            <h1 className="font-achiko text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] text-white">
              {t("title_top")}{" "}
              <span className="block text-[#FFC82C] mt-1 drop-shadow-[0_0_25px_rgba(255,200,44,0.3)]">
                {t("title_highlight")}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle / Description - Azurio for body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-azurio text-base md:text-xl text-gray-200 max-w-xl leading-relaxed border-l-3 border-[#FF3B56] pl-6 font-light"
          >
            {t.rich("description", {
              culture: (chunks) => (
                <span className="text-[#FFC82C] font-bold">{chunks}</span>
              ),
              tech: (chunks) => (
                <span className="text-white font-bold">{chunks}</span>
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
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#projets"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#FFC82C] text-black font-achiko font-bold text-sm tracking-widest uppercase rounded-xl shadow-[0_0_25px_rgba(255,200,44,0.4)] transition-all duration-300"
              >
                <span className="relative z-10">{t("cta_projects")}</span>
                <i className="pi pi-arrow-right relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#121526] border border-white/30 hover:border-[#FFC82C] text-white font-achiko font-bold text-sm tracking-widest uppercase rounded-xl transition-all duration-300 hover:bg-white/10"
              >
                {t("cta_contact")}
              </Link>
            </motion.div>
          </motion.div>

          {/* Live Key Performance Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="pt-6 grid grid-cols-3 gap-4 border-t border-white/20 max-w-lg font-azurio"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="space-y-0.5">
              <span className="block text-2xl md:text-3xl font-achiko font-black text-[#FFC82C]">
                05+
              </span>
              <span className="text-[10px] font-azurio text-gray-300 uppercase tracking-widest font-bold">
                Expérience (Ans)
              </span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="space-y-0.5">
              <span className="block text-2xl md:text-3xl font-achiko font-black text-white">
                25+
              </span>
              <span className="text-[10px] font-azurio text-gray-300 uppercase tracking-widest font-bold">
                Projets Livrés
              </span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="space-y-0.5">
              <span className="block text-2xl md:text-3xl font-achiko font-black text-[#FF3B56]">
                100%
              </span>
              <span className="text-[10px] font-azurio text-gray-300 uppercase tracking-widest font-bold">
                Satisfaction UX
              </span>
            </motion.div>
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
            className="relative w-80 h-96 md:w-96 md:h-[30rem] glass-card rounded-3xl p-4 cursor-pointer group shadow-[0_20px_50px_rgba(255,200,44,0.2)]"
          >
            {/* Luminous Frame Accents */}
            <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-[#FFC82C]" />
            <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-[#FFC82C]" />
            <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-[#FF3B56]" />
            <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-[#FF3B56]" />

            {/* Inner Image Wrapper */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0B0D18] border border-white/20">
              <Image
                src="/mascote.png"
                alt={t("alt_portrait")}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />

              {/* Dynamic Overlay Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0B0D18] border border-[#FFC82C]/50 flex justify-between items-center shadow-lg font-azurio">
                <div>
                  <span className="block text-[9px] font-mono text-gray-300 uppercase tracking-widest font-bold">
                    MASCOT_IDENT
                  </span>
                  <span className="block text-xs font-achiko font-black text-[#FFC82C] tracking-wider">
                    KINGTANG // V2.6
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full border border-[#FFC82C] flex items-center justify-center bg-[#FFC82C]/20 shadow-[0_0_15px_#FFC82C]">
                  <i className="pi pi-bolt text-sm text-[#FFC82C]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}