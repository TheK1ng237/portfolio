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
      <div className="relative z-10 max-w-7xl  w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: HERO TEXT & BADGES */}
        <div className="lg:col-span-7 text-left space-y-8">


          {/* Main Title - Achiko for main headings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-3"
          >
            <span className="block text-xs font-azurio text-[#FFC82C] tracking-[0.45em] uppercase font-bold">
              FULL-STACK DEVELOPER & CREATIVE ENGINEER
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
            className="flex flex-wrap items-center gap-4 pt-2 font-azurio"
          >
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#projets"
                className="group relative inline-flex items-center gap-3 px-7 py-4 bg-[#FFC82C] text-black font-achiko font-bold text-sm tracking-widest uppercase rounded-xl shadow-[0_0_25px_rgba(255,200,44,0.4)] transition-all duration-300"
              >
                <span className="relative z-10">{t("cta_projects")}</span>
                <i className="pi pi-arrow-right relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <a
                href="/cv/CV.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#FF3B56]/15 border border-[#FF3B56]/50 hover:border-[#FF3B56] hover:bg-[#FF3B56] text-white hover:text-white font-achiko font-bold text-sm tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,59,86,0.2)]"
              >
                <i className="pi pi-download text-base" /> TÉLÉCHARGER CV
              </a>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-4 bg-[#121526] border border-white/30 hover:border-[#FFC82C] text-white font-achiko font-bold text-sm tracking-widest uppercase rounded-xl transition-all duration-300 hover:bg-white/10"
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

        {/* RIGHT COLUMN: INTERACTIVE 3D TILT MASCOT CARD WITH PATTERN AURA */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative">
          {/* Secondary Pattern (path2.svg) Rotating Golden Aura */}
        
          
          <img
              src="/images/pixarMe.png"
              alt={t("alt_portrait")}
              className="object-cover w-full h-auto rounded-2xl relative z-2 transition-transform duration-500 group-hover:scale-105"
            />
        </div>
      </div>
    </section>
  );
}