"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import "primeicons/primeicons.css";

interface Solution {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  features: string[];
  fullDescription: string;
  benefits: string[];
  targetAudience: string;
  category: "ENGINE" | "PROTOCOL" | "LAB";
}

export default function Solutions() {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const t = useTranslations("SolutionPage");

  const solutions: Solution[] = [
    {
      id: t("solutions.0.id"),
      category: t("solutions.0.category") as "ENGINE" | "PROTOCOL" | "LAB",
      title: t("solutions.0.title"),
      description: t("solutions.0.description"),
      price: t("solutions.0.price"),
      icon: "pi pi-box",
      features: [
        t("solutions.0.features.0"),
        t("solutions.0.features.1"),
        t("solutions.0.features.2"),
      ],
      fullDescription: t("solutions.0.full_description"),
      benefits: [
        t("solutions.0.benefits.0"),
        t("solutions.0.benefits.1"),
        t("solutions.0.benefits.2"),
      ],
      targetAudience: t("solutions.0.target_audience"),
    },
    {
      id: t("solutions.1.id"),
      category: t("solutions.1.category") as "ENGINE" | "PROTOCOL" | "LAB",
      title: t("solutions.1.title"),
      description: t("solutions.1.description"),
      price: t("solutions.1.price"),
      icon: "pi pi-shield",
      features: [
        t("solutions.1.features.0"),
        t("solutions.1.features.1"),
        t("solutions.1.features.2"),
      ],
      fullDescription: t("solutions.1.full_description"),
      benefits: [
        t("solutions.1.benefits.0"),
        t("solutions.1.benefits.1"),
        t("solutions.1.benefits.2"),
      ],
      targetAudience: t("solutions.1.target_audience"),
    },
    {
      id: t("solutions.2.id"),
      category: t("solutions.2.category") as "ENGINE" | "PROTOCOL" | "LAB",
      title: t("solutions.2.title"),
      description: t("solutions.2.description"),
      price: t("solutions.2.price"),
      icon: "pi pi-microchip",
      features: [
        t("solutions.2.features.0"),
        t("solutions.2.features.1"),
        t("solutions.2.features.2"),
      ],
      fullDescription: t("solutions.2.full_description"),
      benefits: [
        t("solutions.2.benefits.0"),
        t("solutions.2.benefits.1"),
        t("solutions.2.benefits.2"),
      ],
      targetAudience: t("solutions.2.target_audience"),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050508] text-[#F5F5DC] pt-28 pb-24">
      {/* Background Decor */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#E9B826]/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-20">
        {/* HEADER */}
        <section className="space-y-4">
          <span className="font-mono text-xs text-[#E9B826] tracking-[0.4em] uppercase block">
            {"// ARCHITECTURES_&_SERVICES"}
          </span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight uppercase text-white">
            SOLUTIONS <span className="text-gold-shimmer">SUR MESURE</span>
          </h1>
          <p className="max-w-2xl text-base text-gray-300 font-light leading-relaxed">
            De la création d’interfaces web complexes aux audits ergonomiques et au design culturel Afro-Futuriste.
          </p>
        </section>

        {/* SOLUTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 border border-white/10 flex flex-col justify-between hover:border-[#E9B826]/60 transition-all duration-500 group"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#E9B826] font-bold">
                    MODULE // {solution.id}
                  </span>
                  <span className="text-[9px] font-mono border border-white/15 px-2.5 py-1 rounded bg-white/5 uppercase text-gray-300">
                    {solution.category}
                  </span>
                </div>

                <div className="w-14 h-14 rounded-xl bg-[#E9B826]/10 border border-[#E9B826]/30 flex items-center justify-center group-hover:bg-[#E9B826] group-hover:scale-110 transition-all">
                  <i className={`${solution.icon} text-2xl text-[#E9B826] group-hover:text-black`} />
                </div>

                <h3 className="text-2xl font-black uppercase text-white group-hover:text-[#E9B826] transition-colors">
                  {solution.title}
                </h3>

                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {solution.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  {solution.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-gray-400">
                      <i className="pi pi-check text-[10px] text-[#E9B826]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mt-8 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] font-mono text-gray-500 uppercase">TARIFICATION</span>
                  <span className="text-lg font-black font-mono text-[#E9B826]">{solution.price}</span>
                </div>

                <button
                  onClick={() => setSelectedSolution(solution)}
                  className="w-full py-3.5 bg-white/5 border border-white/15 hover:border-[#E9B826] text-xs font-mono font-bold text-white hover:text-[#E9B826] uppercase rounded-lg transition-all"
                >
                  SPÉCIFICATIONS DÉTAILLÉES
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DETAILS MODAL */}
        <AnimatePresence>
          {selectedSolution && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSolution(null)}
              className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel max-w-2xl w-full rounded-2xl border border-[#E9B826]/40 p-8 space-y-6"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="font-mono text-xs text-[#E9B826]">
                    MODULE_SPEC // {selectedSolution.id}
                  </span>
                  <button onClick={() => setSelectedSolution(null)} className="text-gray-400 hover:text-white">
                    <i className="pi pi-times text-xl" />
                  </button>
                </div>

                <h3 className="text-3xl font-black uppercase text-white">{selectedSolution.title}</h3>
                <p className="text-sm text-gray-300 font-light leading-relaxed">{selectedSolution.fullDescription}</p>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-[#E9B826] uppercase">BÉNÉFICES CLÉS :</h4>
                  <ul className="space-y-1 text-xs text-gray-400 font-mono">
                    {selectedSolution.benefits.map((b, idx) => (
                      <li key={idx}>⚡ {b}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-lg font-black font-mono text-[#E9B826]">{selectedSolution.price}</span>
                  <Link
                    href="/CONTACT"
                    className="px-6 py-3 bg-[#E9B826] text-black text-xs font-bold font-mono uppercase tracking-wider rounded-lg hover:shadow-[0_0_20px_rgba(233,184,38,0.4)]"
                  >
                    COMMANDER CE MODULE
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}