"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import "primeicons/primeicons.css";
import { Project } from "@/app/type";
import { useTranslations } from "next-intl";

export default function Projects() {
  const [filter, setFilter] = useState<string>("all");

  const projects: Project[] = [
    {
      id: 1,
      title: 'Plateforme Web "Culture Africa"',
      description: 'Site interactif pour explorer et promouvoir la culture africaine à travers des animations et récits visuels.',
      image: "/images/mvp1.png",
      link: "https://cultureafricaine.vercel.app",
      github: "https://github.com/TangB5/mvp",
      tech: ["Next.js 15", "Tailwind CSS", "Framer Motion", "TypeScript"],
      category: "web" as const,
      featured: true,
      isCompleted: true,
      version: "v2.0",
    },
    {
      id: 2,
      title: 'Application "Culture Cameroun"',
      description: 'Application éducative immersive explorant les richesses culturelles du Cameroun.',
      image: "/images/projet2.png",
      link: "https://cultureafricaine.vercel.app",
      github: "https://github.com/TangB5",
      tech: ["React 19", "Tailwind CSS", "Framer Motion", "Next.js"],
      category: "mobile" as const,
      featured: true,
      isCompleted: true,
      version: "v1.5",
    },
    {
      id: 3,
      title: 'Identité Visuelle "Ngano Fashion"',
      description: 'Direction artistique complète pour une marque de mode africaine contemporaine.',
      image: "/projet3.jpg",
      link: "https://github.com/TangB5",
      github: "https://github.com/TangB5",
      tech: ["Figma", "Branding", "UI Design", "Adinkra Motifs"],
      category: "design" as const,
      featured: true,
      isCompleted: true,
      version: "v1.0",
    },
    {
      id: 4,
      title: 'MarketPlace Africaine "AfroShop"',
      description: "Plateforme e-commerce mettant en avant l'artisanat local avec une interface moderne.",
      image: "/projet1.jpg",
      link: "https://github.com/TangB5",
      github: "https://github.com/TangB5",
      tech: ["Next.js", "Tailwind CSS", "Node.js", "E-Commerce"],
      category: "web" as const,
      featured: false,
      isCompleted: false,
      version: "v2.0",
    },
  ];

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050508] text-[#F5F5DC] pt-28 pb-24">
      {/* Background Decor */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#E9B826]/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="font-mono text-xs text-[#E9B826] tracking-[0.4em] uppercase block mb-3">
              {"// REPERTOIRE_DE_PROJETS"}
            </span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight uppercase text-white">
              MODULES <span className="text-gold-shimmer">DÉPLOYÉS</span>
            </h1>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl border border-white/15 bg-[#0A0A0F]/80 backdrop-blur-md">
            {[
              { id: "all", label: "TOUS" },
              { id: "web", label: "WEB" },
              { id: "mobile", label: "MOBILE" },
              { id: "design", label: "DESIGN" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-5 py-2.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all ${
                  filter === f.id
                    ? "bg-[#E9B826] text-black font-bold shadow-[0_0_15px_rgba(233,184,38,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECTS GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((projet) => (
              <motion.div
                key={projet.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-[#E9B826]/60 transition-all duration-500 group"
              >
                {/* Header */}
                <div className="p-5 flex justify-between items-center border-b border-white/5 bg-[#0A0A0F]/50">
                  <span className="font-mono text-xs text-[#E9B826] font-bold">
                    ID // 0{projet.id}
                  </span>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                      {projet.isCompleted ? "READY" : "IN_DEV"}
                    </span>
                  </div>
                </div>

                {/* Preview Image */}
                <div className="relative h-60 w-full overflow-hidden bg-black">
                  <Image
                    src={projet.image}
                    alt={projet.title}
                    fill
                    className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-80" />
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-black uppercase text-white group-hover:text-[#E9B826] transition-colors">
                    {projet.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono leading-relaxed uppercase">
                    &rdquo;{projet.description}&rdquo;
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {projet.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-mono border border-white/10 px-2 py-1 rounded bg-white/5 text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 border-t border-white/10 flex justify-between items-center bg-[#0A0A0F]/30">
                  <a
                    href={projet.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#E9B826] hover:gap-3 transition-all"
                  >
                    EXÉCUTER_ACCÈS <i className="pi pi-arrow-right text-xs" />
                  </a>

                  {projet.github && (
                    <a
                      href={projet.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Code Source GitHub"
                    >
                      <i className="pi pi-github text-lg" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}