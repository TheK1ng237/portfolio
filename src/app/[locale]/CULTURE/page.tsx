"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";

import Plan from "../component/arrierplan";

const colors = {
  gold: "#FFC82C",
  red: "#FF3B56",
  green: "#10B981",
  dark: "#0B0D18",
  light: "#F8F9FA",
};

type SectionTitleProps = {
  title: string;
  subtitle: string;
  color?: string;
};

type Motif = {
  id: number;
  src: string;
  version: string;
  status: "available" | "upcoming" | "revision";
};

export default function Culture() {
  const t = useTranslations("CulturePage");

  const SectionTitle = ({
    title,
    subtitle,
    color = colors.gold,
  }: SectionTitleProps) => (
    <div className="mb-12 font-azurio">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-[2px] w-8" style={{ backgroundColor: color }} />
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#FFC82C] uppercase font-bold">
          {subtitle}
        </span>
      </div>
      <h2 className="font-achiko text-3xl md:text-5xl font-black tracking-tight uppercase text-white">
        {title}
      </h2>
    </div>
  );

  const [activeMotif, setActiveMotif] = useState<Motif | null>(null);
  const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: true, threshold: 0.1 });

  const motifs: Motif[] = [
    { id: 1, src: "/images/image1.png", version: "v2.1", status: "available" },
    { id: 2, src: "/images/image2.png", version: "v1.0", status: "upcoming" },
    { id: 3, src: "/images/image3.png", version: "BETA", status: "revision" },
    { id: 4, src: "/images/projet2.png", version: "v1.4", status: "upcoming" },
  ];

  const specItems = [
    { key: "adinkra", color: colors.gold },
    { key: "ndop", color: colors.red },
    { key: "wax", color: colors.green },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] font-azurio pt-28 pb-24">
      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none z-0">
        <Plan />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-20">
        {/* --- HERO: CULTURAL R&D --- */}
        <section className="relative space-y-6">
          

          <h1 className="font-achiko text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.9] text-white uppercase">
            {t("hero.title_main")} <br />
            <span className="text-[#FFC82C] drop-shadow-[0_0_25px_rgba(255,200,44,0.3)]">
              {t("hero.title_sub")}
            </span>
          </h1>

          <p className="font-azurio max-w-2xl text-base md:text-xl text-gray-200 leading-relaxed border-l-4 border-[#FF3B56] pl-6 font-light">
            {t("hero.description")}
          </p>
        </section>

        {/* --- SECTION 1: PATTERN REPOSITORY --- */}
        <section ref={ref1} className="py-10 border-t border-white/10">
          <SectionTitle title={t("library.title")} subtitle="" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-azurio">
            {motifs.map((motif) => (
              <motion.div
                key={motif.id}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setActiveMotif(motif)}
                className="glass-card group relative p-5 rounded-3xl border border-white/15 bg-[#121526]/90 cursor-pointer shadow-xl overflow-hidden hover:border-[#FFC82C] transition-all"
              >
                {/* Visual Preview */}
                <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-black/60 border border-white/10">
                  <Image
                    src={motif.src}
                    alt={t(`library.motifs.${motif.id}.title`)}
                    fill
                    className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 text-[9px] font-mono font-bold bg-[#0B0D18]/90 text-[#FFC82C] border border-[#FFC82C]/30 rounded-md shadow-md uppercase">
                    {t(`library.status.${motif.status}`)}
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-1.5 font-azurio">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 font-bold">
                    <span>{motif.version}</span>
                    <span className="text-[#10B981]">{t(`library.motifs.${motif.id}.origin`)}</span>
                  </div>
                  <h3 className="font-achiko text-xl font-black uppercase text-white group-hover:text-[#FFC82C] transition-colors">
                    {t(`library.motifs.${motif.id}.title`)}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- SECTION 2: PHILOSOPHY LOGS (Proverbes) --- */}
        <section className="py-16 px-8 glass-card rounded-3xl border border-white/15 bg-[#121526]/80 shadow-2xl font-azurio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-4 font-azurio border-l-2 border-[#FFC82C]/40 pl-6">
                <div className="text-[10.5px] font-mono text-[#FFC82C] font-bold uppercase tracking-widest">
                  {t(`philosophy.logs.${index}.note`)}
                </div>

                <p className="font-azurio text-lg md:text-xl font-medium text-white leading-relaxed italic">
                  &rdquo;{t(`philosophy.logs.${index}.text`)}&rdquo;
                </p>

                <div className="text-xs font-achiko text-gray-400 uppercase font-bold tracking-wider">
                  — {t(`philosophy.logs.${index}.ref`)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: SYSTEM SPECIFICATIONS (Éducation) --- */}
        <section className="py-10 border-t border-white/10 font-azurio">
          <SectionTitle
            title={t("specs.title")}
            subtitle=""
            color={colors.green}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-8">
              <p className="font-azurio text-base md:text-lg text-gray-200 leading-relaxed font-light border-l-3 border-[#10B981] pl-6">
                {t("specs.main_text")}
              </p>

              <div className="grid grid-cols-1 gap-4 font-azurio">
                {specItems.map((item) => (
                  <div
                    key={item.key}
                    className="glass-card p-4 rounded-2xl border border-white/15 flex items-center justify-between hover:border-[#FFC82C] transition-all bg-[#121526]"
                  >
                    <span className="font-achiko text-base font-black text-white uppercase tracking-wider">
                      {t(`specs.items.${item.key}.title`)}
                    </span>

                    <span className="text-[10px] font-mono font-bold text-[#FFC82C] px-3 py-1 rounded-md bg-[#FFC82C]/10 border border-[#FFC82C]/30 uppercase">
                      {t(`specs.items.${item.key}.use`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Framework Visual Box */}
            <div className="lg:col-span-6">
              <div className="glass-panel p-10 rounded-3xl border border-[#10B981]/40 bg-[#121526] text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 mx-auto flex items-center justify-center text-[#10B981]">
                  <i className="pi pi-compass text-3xl" />
                </div>
                <div>
                  <h4 className="font-achiko text-2xl font-black uppercase text-white tracking-wider mb-2">
                    {t("specs.framework.title")}
                  </h4>
                  <p className="font-azurio text-xs text-gray-300 font-light leading-relaxed max-w-md mx-auto">
                    {t("specs.framework.desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- MODAL (VAULT VIEW) --- */}
        <AnimatePresence>
          {activeMotif && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl font-azurio"
              onClick={() => setActiveMotif(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-panel max-w-4xl w-full rounded-3xl border border-[#FFC82C] p-8 sm:p-10 relative shadow-2xl bg-[#121526]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveMotif(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 cursor-pointer"
                >
                  <i className="pi pi-times text-xl" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/20 bg-black">
                    <Image
                      src={activeMotif.src}
                      alt={t(`library.motifs.${activeMotif.id}.title`)}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-6 font-azurio">
                    <div>
                      <span className="text-[10px] font-mono text-[#FFC82C] font-bold px-2.5 py-1 rounded-md bg-[#FFC82C]/10 border border-[#FFC82C]/30 uppercase block w-fit mb-2">
                        VERSION: {activeMotif.version}
                      </span>
                      <h3 className="font-achiko text-3xl font-black uppercase text-white tracking-tight">
                        {t(`library.motifs.${activeMotif.id}.title`)}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-200 leading-relaxed font-light">
                      {t(`library.motifs.${activeMotif.id}.desc`)}
                    </p>

                    <div className="pt-4 space-y-2 border-t border-white/15 text-xs font-azurio">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t("modal.origin")}</span>
                        <span className="font-bold text-[#10B981]">
                          {t(`library.motifs.${activeMotif.id}.origin`)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t("modal.encoding")}</span>
                        <span className="font-bold text-[#FFC82C]">SVG / VECTOR / WEBGL</span>
                      </div>
                    </div>

                    <Link
                      href="/CONTACT"
                      className="w-full py-4 bg-[#FFC82C] hover:bg-[#FFE57F] text-black font-achiko font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(255,200,44,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                      {t("modal.button")} <i className="pi pi-download text-sm" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- CTA MANIFESTO SECTION --- */}
        <motion.section
          whileHover={{ scale: 1.01 }}
          className="glass-panel p-10 sm:p-14 rounded-3xl border border-[#FFC82C] text-center space-y-6 shadow-2xl font-azurio bg-[#121526]"
        >
          <h2 className="font-achiko text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            VOUS SOUHAITEZ INCLURE UNE <span className="text-[#FFC82C]">DIMENSION CULTURELLE</span> À VOTRE PROJET ?
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-gray-200 font-light leading-relaxed">
            Nous concevons des identités visuelles et des interfaces numériques sur mesure qui résonnent avec élégance et authenticité.
          </p>
          <div className="pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                href="/CONTACT"
                className="px-10 py-4 bg-[#FFC82C] text-black font-achiko font-bold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(255,200,44,0.4)] transition-all inline-block"
              >
                {t("cta.button")} <i className="pi pi-send ml-2" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
