"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import "primeicons/primeicons.css";
import { useTranslations } from "next-intl";

export default function Culture() {
  const culturalPillars = [
    {
      code: "NDOP_GEOMETRY",
      title: "Géométrie Sacrée Ndop",
      origin: "Cameroun (Bamiléké)",
      symbolism: "Cycles cosmiques, royauté et harmonie algorithmique.",
      techIntegration: "Conversion des fractales textiles en fonctions CSS/Canvas récursives.",
      color: "#E9B826",
    },
    {
      code: "ADINKRA_SYMBOLS",
      title: "Symbolique Adinkra",
      origin: "Ghana / Côte d'Ivoire (Ashanti)",
      symbolism: "Proverbes visuels, sagesse ancestrale et résilience.",
      techIntegration: "Design d'icônes vectorielles dynamiques et micro-interactions sémantiques.",
      color: "#E63946",
    },
    {
      code: "TOGHU_CONTRAST",
      title: "Contrastes & Couleurs Toghu",
      origin: "Cameroun (Grassfields)",
      symbolism: "Prestige, fête et énergie chromatique vibrante.",
      techIntegration: "Palettes HSL dynamiques et gradients de lumière à haut contraste.",
      color: "#FFD700",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050508] text-[#F5F5DC] pt-28 pb-24">
      {/* Background Decor */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute top-30 right-10 w-96 h-96 bg-[#E63946]/10 blur-[170px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-24">
        {/* HERO SECTION */}
        <section className="space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xs text-[#E9B826] tracking-[0.4em] uppercase block"
          >
            {"// INOVATION_CULTURELLE_&_ETHNO_DESIGN"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tight uppercase leading-[0.9] text-white"
          >
            HERITAGE <br />
            <span className="text-gold-shimmer font-serif italic">AFRO-FUTURISTE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed border-l-2 border-[#E9B826] pl-6 font-light"
          >
            L’art traditionnel africain n’est pas un vestige du passé : c’est un langage visuel et algorithmique d’une modernité remarquable. Notre mission est d’extraire cette géométrie sacrée pour alimenter le Web de demain.
          </motion.p>
        </section>

        {/* CULTURAL PILLARS MATRIX */}
        <section className="space-y-12 border-t border-white/10 pt-16">
          <div>
            <span className="font-mono text-xs text-gray-400 tracking-[0.3em] uppercase block mb-2">
              {"// PIERS_DE_RECHERCHE"}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              MOTIFS & <span className="text-[#E9B826]">SYMBOLES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {culturalPillars.map((pillar, i) => (
              <motion.div
                key={pillar.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-[#E9B826]/50 transition-all group"
              >
                <div className="space-y-4">
                  <span className="font-mono text-[10px] text-gray-400 tracking-widest block">
                    {pillar.code}
                  </span>
                  <h3 className="text-2xl font-black uppercase text-white group-hover:text-[#E9B826] transition-colors">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-mono text-[#E9B826] bg-[#E9B826]/10 px-3 py-1.5 rounded-md inline-block">
                    Origine: {pillar.origin}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <strong className="text-white">Symbolique:</strong> {pillar.symbolism}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <strong className="text-white">Implémentation Web:</strong> {pillar.techIntegration}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-gray-500 uppercase">ETHNO_SYSTEM_V2</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar.color }} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MANIFESTO CTA */}
        <section className="glass-panel p-12 rounded-2xl border border-[#E9B826]/30 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            VOUS SOUHAITEZ INCLURE UNE <span className="text-[#E9B826]">DIMENTION CULTURELLE</span> À VOTRE PROJET ?
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-gray-300 font-light leading-relaxed">
            Nous concevons des identités visuelles et des interfaces numériques sur mesure qui résonnent avec élégance et authenticité.
          </p>
          <div className="pt-4">
            <Link
              href="/CONTACT"
              className="px-10 py-4 bg-[#E9B826] text-black font-bold text-xs font-mono uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_rgba(233,184,38,0.5)] transition-all inline-block"
            >
              DÉMARRER UN PROJET CULTURIEL
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
