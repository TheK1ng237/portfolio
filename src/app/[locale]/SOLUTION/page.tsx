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
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] pt-28 pb-24">
      {/* Radiant Glows */}
      <div className="absolute top-20 right-10 w-[30rem] h-[30rem] bg-[#FFC82C]/15 blur-[170px] pointer-events-none rounded-full" />
      <div className="absolute bottom-20 left-10 w-[30rem] h-[30rem] bg-[#FF3B56]/12 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-20">
        {/* HEADER */}
        <section className="space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xs text-[#FFC82C] tracking-[0.4em] uppercase block font-bold"
          >
            {"// ARCHITECTURES_&_SERVICES"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl font-black tracking-tight uppercase text-white"
          >
            SOLUTIONS <span className="text-gold-shimmer">SUR MESURE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-base text-gray-200 font-light leading-relaxed"
          >
            De la création d’interfaces web complexes aux audits ergonomiques et au design culturel Afro-Futuriste.
          </motion.p>
        </section>

        {/* SOLUTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -7 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 border border-white/15 flex flex-col justify-between hover:border-[#FFC82C] transition-all duration-500 group shadow-xl"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#FFC82C] font-bold">
                    MODULE // {solution.id}
                  </span>
                  <span className="text-[9.5px] font-mono border border-white/20 px-3 py-1 rounded-md bg-white/5 uppercase text-gray-200 font-bold">
                    {solution.category}
                  </span>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#FFC82C]/15 border border-[#FFC82C]/30 flex items-center justify-center group-hover:bg-[#FFC82C] group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,200,44,0.2)]">
                  <i className={`${solution.icon} text-2xl text-[#FFC82C] group-hover:text-black`} />
                </div>

                <h3 className="text-2xl font-black uppercase text-white group-hover:text-[#FFC82C] transition-colors">
                  {solution.title}
                </h3>

                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {solution.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  {solution.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-gray-300 font-bold">
                      <i className="pi pi-check text-[10px] text-[#FFC82C]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/15 mt-8 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] font-mono text-gray-300 uppercase font-bold">TARIFICATION</span>
                  <span className="text-lg font-black font-mono text-[#FFC82C]">{solution.price}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSolution(solution)}
                  className="w-full py-3.5 bg-white/10 border border-white/20 hover:border-[#FFC82C] text-xs font-mono font-bold text-white hover:text-[#FFC82C] uppercase rounded-xl transition-all"
                >
                  SPÉCIFICATIONS DÉTAILLÉES
                </motion.button>
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
                className="glass-panel max-w-2xl w-full rounded-3xl border border-[#FFC82C]/50 p-8 space-y-6 shadow-2xl"
              >
                <div className="flex justify-between items-center border-b border-white/15 pb-4">
                  <span className="font-mono text-xs text-[#FFC82C] font-bold">
                    MODULE_SPEC // {selectedSolution.id}
                  </span>
                  <button onClick={() => setSelectedSolution(null)} className="text-gray-300 hover:text-white">
                    <i className="pi pi-times text-xl" />
                  </button>
                </div>

                <h3 className="text-3xl font-black uppercase text-white">{selectedSolution.title}</h3>
                <p className="text-sm text-gray-200 font-light leading-relaxed">{selectedSolution.fullDescription}</p>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-[#FFC82C] uppercase font-bold">BÉNÉFICES CLÉS :</h4>
                  <ul className="space-y-1 text-xs text-gray-300 font-mono">
                    {selectedSolution.benefits.map((b, idx) => (
                      <li key={idx}>⚡ {b}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/15">
                  <span className="text-lg font-black font-mono text-[#FFC82C]">{selectedSolution.price}</span>
                  <Link
                    href="/CONTACT"
                    className="px-6 py-3 bg-[#FFC82C] text-black text-xs font-bold font-mono uppercase tracking-wider rounded-xl hover:shadow-[0_0_25px_rgba(255,200,44,0.5)]"
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