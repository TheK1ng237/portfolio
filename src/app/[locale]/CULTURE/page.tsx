"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import "primeicons/primeicons.css";

export default function Culture() {
  const culturalPillars = [
    {
      code: "NDOP_GEOMETRY",
      title: "Géométrie Sacrée Ndop",
      origin: "Cameroun (Bamiléké)",
      symbolism: "Cycles cosmiques, royauté et harmonie algorithmique.",
      techIntegration: "Conversion des fractales textiles en fonctions CSS/Canvas récursives.",
      color: "#FFC82C",
    },
    {
      code: "ADINKRA_SYMBOLS",
      title: "Symbolique Adinkra",
      origin: "Ghana / Côte d'Ivoire (Ashanti)",
      symbolism: "Proverbes visuels, sagesse ancestrale et résilience.",
      techIntegration: "Design d'icônes vectorielles dynamiques et micro-interactions sémantiques.",
      color: "#FF3B56",
    },
    {
      code: "TOGHU_CONTRAST",
      title: "Contrastes & Couleurs Toghu",
      origin: "Cameroun (Grassfields)",
      symbolism: "Prestige, fête et énergie chromatique vibrante.",
      techIntegration: "Palettes HSL dynamiques et gradients de lumière à haut contraste.",
      color: "#FFE57F",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] pt-28 pb-24">
      {/* Ambient Luminous Glows (No AI grid patterns) */}
      <div className="absolute top-20 right-10 w-[30rem] h-[30rem] bg-[#FF3B56]/15 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-20 left-10 w-[30rem] h-[30rem] bg-[#FFC82C]/15 blur-[170px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-24">
        {/* HERO SECTION */}
        <section className="space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xs text-[#FFC82C] tracking-[0.4em] uppercase block font-bold"
          >
            {"// INOVATION_CULTURELLE_&_ETHNO_DESIGN"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-black tracking-tight uppercase leading-[0.9] text-white"
          >
            HERITAGE <br />
            <span className="text-gold-shimmer font-serif italic">AFRO-FUTURISTE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-3xl text-lg md:text-xl text-gray-200 leading-relaxed border-l-2 border-[#FFC82C] pl-6 font-light"
          >
            L’art traditionnel africain n’est pas un vestige du passé : c’est un langage visuel et algorithmique d’une modernité remarquable. Notre mission est d’extraire cette géométrie sacrée pour alimenter le Web de demain.
          </motion.p>
        </section>

        {/* CULTURAL PILLARS MATRIX */}
        <section className="space-y-12 border-t border-white/10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs text-gray-300 tracking-[0.3em] uppercase block mb-2 font-bold">
              {"// PIERS_DE_RECHERCHE"}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              MOTIFS & <span className="text-[#FFC82C]">SYMBOLES</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {culturalPillars.map((pillar, i) => (
              <motion.div
                key={pillar.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -7 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-3xl border border-white/15 flex flex-col justify-between hover:border-[#FFC82C] transition-all group shadow-xl"
              >
                <div className="space-y-4">
                  <span className="font-mono text-[10px] text-gray-300 tracking-widest block font-bold">
                    {pillar.code}
                  </span>
                  <h3 className="text-2xl font-black uppercase text-white group-hover:text-[#FFC82C] transition-colors">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-mono text-[#FFC82C] bg-[#FFC82C]/15 px-3 py-1.5 rounded-lg inline-block font-bold">
                    Origine: {pillar.origin}
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed font-light">
                    <strong className="text-white font-bold">Symbolique:</strong> {pillar.symbolism}
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed font-light">
                    <strong className="text-white font-bold">Implémentation Web:</strong> {pillar.techIntegration}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-gray-400 uppercase font-bold">ETHNO_SYSTEM_V2</span>
                  <div className="w-3 h-3 rounded-full shadow-[0_0_10px_#FFC82C]" style={{ backgroundColor: pillar.color }} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MANIFESTO CTA */}
        <motion.section
          whileHover={{ scale: 1.01 }}
          className="glass-panel p-12 rounded-3xl border border-[#FFC82C]/40 text-center space-y-6 shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            VOUS SOUHAITEZ INCLURE UNE <span className="text-[#FFC82C]">DIMENTION CULTURELLE</span> À VOTRE PROJET ?
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-gray-200 font-light leading-relaxed">
            Nous concevons des identités visuelles et des interfaces numériques sur mesure qui résonnent avec élégance et authenticité.
          </p>
          <div className="pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                href="/CONTACT"
                className="px-10 py-4 bg-[#FFC82C] text-black font-bold text-xs font-mono uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(255,200,44,0.5)] transition-all inline-block"
              >
                DÉMARRER UN PROJET CULTURIEL
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
