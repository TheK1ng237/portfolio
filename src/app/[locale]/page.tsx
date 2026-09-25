"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import "primeicons/primeicons.css";
import Hero from "./component/HERO";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProjectModal, setSelectedProjectModal] = useState<typeof projects[0] | null>(null);

  const projects = [
    {
      id: "01",
      titleKey: "01",
      category: "web",
      tags: ["Next.js 15", "TypeScript", "Tailwind CSS", "E-Commerce"],
      image: "/projet1.jpg",
      isCompleted: true,
      projectLink: "https://cultureafricaine.vercel.app/",
      demoUrl: "https://cultureafricaine.vercel.app/",
      metrics: "99/100 Lighthouse Performance"
    },
    {
      id: "02",
      titleKey: "02",
      category: "culture",
      tags: ["React 19", "Framer Motion", "Culture", "UI/UX Architecture"],
      image: "/images/projet2.png",
      isCompleted: true,
      projectLink: "https://cultureafricaine.vercel.app/",
      demoUrl: "https://cultureafricaine.vercel.app/",
      metrics: "Interactive Cultural Knowledge Engine"
    },
    {
      id: "03",
      titleKey: "03",
      category: "design",
      tags: ["Branding", "Ndop Geometry", "Design System", "Art Direction"],
      image: "/projet3.jpg",
      isCompleted: true,
      projectLink: "https://github.com/TangB5",
      demoUrl: "https://github.com/TangB5",
      metrics: "Complete Afro-Futuristic Visual Identity"
    }
  ];

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const skillMatrix = [
    {
      icon: "desktop",
      title: "Frontend Architecture",
      desc: "Architectures Web hautement réactives avec Next.js 15, React 19, TypeScript et Tailwind CSS v4.",
      techs: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "REST/GraphQL"]
    },
    {
      icon: "palette",
      title: "UI/UX & Design Systems",
      desc: "Conception d'interfaces centrées utilisateur, prototypes haute-fidélité et systèmes de design scalables.",
      techs: ["Figma", "Design Systems", "Prototypage", "Ergonomie UX", "Accessibilité"]
    },
    {
      icon: "sparkles",
      title: "Creative Coding & Motion",
      desc: "Micro-interactions fluides, animations 3D/Canvas et interfaces cybernétiques immersives.",
      techs: ["Framer Motion", "HTML5 Canvas", "WebGL", "Web Audio API", "Shaders"]
    },
    {
      icon: "globe",
      title: "Afro-Futurism & Culture Tech",
      desc: "Fusion algorithmique de la géométrie sacrée africaine (Ndop, Adinkra) avec le Web Moderne.",
      techs: ["Ndop Math Geometry", "Adinkra Symbology", "Ethno-Design", "Digital Preservation"]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] font-azurio">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. CREATIVE TECH & COMPETENCE MATRIX */}
      <section className="py-28 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <span className="font-azurio text-xs text-[#FFC82C] tracking-[0.4em] uppercase block font-bold">
            {"// CAPABILITÉS_SYSTEME"}
          </span>
          <h2 className="font-achiko text-4xl md:text-6xl font-black tracking-tight uppercase">
            ARCHITECTURE & <span className="text-[#FFC82C]">COMPÉTENCES</span>
          </h2>
          <p className="font-azurio text-gray-300 text-sm md:text-base font-light leading-relaxed">
            Combinaison de rigueur technique logicielle et d&apos;exploration créative pour concevoir des expériences numériques d&apos;exception.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillMatrix.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 flex flex-col justify-between group hover:border-[#FFC82C] shadow-lg"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-[#FFC82C]/15 border border-[#FFC82C]/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#FFC82C] group-hover:text-black transition-all shadow-[0_0_20px_rgba(255,200,44,0.2)]">
                  <i className={`pi pi-${skill.icon} text-2xl text-[#FFC82C] group-hover:text-black`} />
                </div>
                <h3 className="font-achiko text-xl font-bold uppercase tracking-tight text-white mb-3 group-hover:text-[#FFC82C] transition-colors">
                  {skill.title}
                </h3>
                <p className="font-azurio text-xs text-gray-300 font-light leading-relaxed mb-6">
                  {skill.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10 font-azurio">
                {skill.techs.map((tech) => (
                  <span key={tech} className="text-[9.5px] border border-white/15 px-2.5 py-1 rounded-md bg-white/5 text-gray-200 font-bold">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. PROJECTS SHOWCASE SECTION */}
      <section id="projets" className="py-28 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-azurio text-xs tracking-[0.4em] text-[#FFC82C] uppercase block mb-3 font-bold">
              {t("projects.label")}
            </span>
            <h2 className="font-achiko text-4xl md:text-7xl font-black tracking-tight uppercase">
              {t("projects.title_part1")} <span className="text-[#FFC82C]">{t("projects.title_part2")}</span>
            </h2>
          </motion.div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 border border-white/20 p-1.5 rounded-xl bg-[#121526] shadow-md font-azurio">
            {[
              { id: "all", label: "TOUS" },
              { id: "web", label: "WEB_SYSTEMS" },
              { id: "culture", label: "CULTURE_ENGINE" },
              { id: "design", label: "DESIGN_UI" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4.5 py-2.5 rounded-lg text-[10.5px] tracking-widest transition-all font-bold ${
                  activeCategory === tab.id
                    ? "bg-[#FFC82C] text-black shadow-[0_0_20px_rgba(255,200,44,0.4)]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((projet, index) => (
            <motion.div
              key={projet.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full border border-white/15 hover:border-[#FFC82C] transition-all duration-500 shadow-xl"
            >
              {/* Card Header Status */}
              <div className="p-6 flex justify-between items-center z-10 border-b border-white/10 bg-[#121526]">
                <span className="font-azurio text-xs text-[#FFC82C] font-bold">PROJET // {projet.id}</span>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 font-azurio">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[9.5px] uppercase tracking-widest text-emerald-400 font-bold">
                    {projet.isCompleted ? t("projects.status_ready") : t("projects.status_progress")}
                  </span>
                </div>
              </div>

              {/* Image Preview Container */}
              <div className="relative h-64 w-full overflow-hidden bg-black group-hover:scale-105 transition-transform duration-700">
                <Image
                  src={projet.image}
                  alt={t(`projects.items.${projet.titleKey}.title`)}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
              </div>

              {/* Card Content Body */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                <div>
                  <h3 className="font-achiko text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#FFC82C] transition-colors mb-2">
                    {t(`projects.items.${projet.titleKey}.title`)}
                  </h3>
                  <p className="font-azurio text-xs text-gray-300 leading-relaxed uppercase">
                    &rdquo;{t(`projects.items.${projet.titleKey}.description`)}&rdquo;
                  </p>
                </div>

                <div className="space-y-4 font-azurio">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {projet.tags.map((tag) => (
                      <span key={tag} className="text-[9.5px] border border-white/15 px-2.5 py-1 rounded-md bg-white/5 text-gray-200 font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={projet.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-azurio font-bold tracking-widest uppercase text-[#FFC82C] hover:gap-3 transition-all"
                    >
                      {t("projects.access_grant")}
                      <i className="pi pi-arrow-right text-xs" />
                    </a>

                    <button
                      onClick={() => setSelectedProjectModal(projet)}
                      className="p-2.5 rounded-lg border border-white/15 hover:border-[#FFC82C] text-gray-300 hover:text-white transition-all bg-white/5"
                      title="Aperçu Rapide"
                    >
                      <i className="pi pi-eye text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Archive Link */}
        <div className="mt-16 text-center font-azurio">
          <Link
            href="/PROJECT"
            className="inline-flex items-center gap-4 text-xs tracking-[0.3em] uppercase text-white hover:text-[#FFC82C] group transition-all font-bold"
          >
            <span className="h-[1.5px] w-12 bg-gray-500 group-hover:w-20 group-hover:bg-[#FFC82C] transition-all" />
            {t("projects.view_archive")}
          </Link>
        </div>
      </section>

      {/* 4. CULTURAL FUSION & AFRO-FUTURISTIC CORE */}
      <section className="relative py-32 overflow-hidden border-y border-white/10 bg-[#121526]">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <span className="font-azurio text-xs text-[#FF3B56] tracking-[0.4em] uppercase block mb-4 font-bold">
            {"// PHILOSOPHIE_ET_HERITAGE"}
          </span>
          <h2 className="font-achiko text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 leading-tight">
            {t("fusion.title")}
          </h2>

          <p className="font-azurio text-base md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-16 font-light">
            {t("fusion.description")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 font-azurio">
            {[
              { label: "ORIGINE", val: t("fusion.stats.origin"), icon: "flag" },
              { label: "MÉDIUM", val: t("fusion.stats.medium"), icon: "palette" },
              { label: "HÉRITAGE", val: t("fusion.stats.legacy"), icon: "history" },
              { label: "VISION", val: t("fusion.stats.vision"), icon: "bolt" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 rounded-2xl flex flex-col items-center group shadow-md"
              >
                <i className={`pi pi-${item.icon} text-2xl text-[#FFC82C] mb-3 group-hover:scale-125 transition-transform`} />
                <span className="text-[9.5px] text-gray-300 uppercase tracking-widest mb-1 font-bold">{item.label}</span>
                <span className="text-sm font-achiko font-bold uppercase text-white tracking-wider">{item.val}</span>
              </motion.div>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block font-achiko">
            <Link
              href="/CULTURE"
              className="px-10 py-4 bg-[#FFC82C] text-black font-bold text-sm tracking-[0.2em] rounded-xl shadow-[0_0_25px_rgba(255,200,44,0.4)] transition-all inline-block"
            >
              {t("fusion.cta")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* QUICK PREVIEW MODAL */}
      <AnimatePresence>
        {selectedProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProjectModal(null)}
            className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 font-azurio"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-2xl w-full rounded-3xl overflow-hidden border border-[#FFC82C] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/15 pb-4">
                <span className="font-azurio text-xs text-[#FFC82C] font-bold">DÉTAILS_PROJET // {selectedProjectModal.id}</span>
                <button
                  onClick={() => setSelectedProjectModal(null)}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <i className="pi pi-times text-xl" />
                </button>
              </div>

              <div className="relative h-60 rounded-2xl overflow-hidden border border-white/15">
                <Image
                  src={selectedProjectModal.image}
                  alt={selectedProjectModal.id}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-achiko text-2xl font-black uppercase text-white">
                  {t(`projects.items.${selectedProjectModal.titleKey}.title`)}
                </h3>
                <p className="font-azurio text-xs text-gray-200 leading-relaxed">
                  {t(`projects.items.${selectedProjectModal.titleKey}.description`)}
                </p>

                <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs font-azurio text-[#FFC82C] font-bold">
                  ⚡ Metrics: {selectedProjectModal.metrics}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-white/15">
                <button
                  onClick={() => setSelectedProjectModal(null)}
                  className="px-6 py-3 rounded-xl border border-white/25 text-xs font-azurio uppercase hover:bg-white/10 text-white font-bold"
                >
                  Fermer
                </button>
                <a
                  href={selectedProjectModal.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#FFC82C] text-black text-xs font-bold font-achiko uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,200,44,0.4)]"
                >
                  Accéder au Projet Live
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}