"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Project } from "@/app/type";

import { useTranslations } from "next-intl";

export default function Projects() {
  const t = useTranslations("ProjectsPage");
  const [filter, setFilter] = useState<string>("all");
  const [selectedModalProject, setSelectedModalProject] = useState<Project | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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
  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ["start start", "end end"],
  });
  const rotationEnd = -((filteredProjects.length - 1) / filteredProjects.length) * 360;
  const carouselRotation = useTransform(scrollYProgress, [0, 1], [0, rotationEnd]);

  return (
    <div className="min-h-screen relative overflow-x-clip bg-[#0B0D18] text-[#F8F9FA] font-azurio pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HERO / HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="font-achiko text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase text-white leading-tight mb-6"
          >
            {t("header.title_main")} <span className="text-[#FFC82C]">{t("header.title_sub")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-azurio text-sm sm:text-base text-gray-300 font-light leading-relaxed mb-8"
          >
            {t("header.description")}
          </motion.p>

          {/* FILTER BUTTONS BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex flex-wrap justify-center gap-2 p-2 rounded-2xl border border-white/20 bg-[#121526]/80 backdrop-blur-xl shadow-2xl font-azurio"
          >
            {[
              { id: "all", label: t("filters.all") },
              { id: "web", label: t("filters.web") },
              { id: "mobile", label: t("filters.mobile") },
              { id: "design", label: t("filters.design") },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-6 py-3 rounded-xl text-xs font-achiko tracking-widest uppercase transition-all font-bold cursor-pointer ${
                  filter === f.id
                    ? "bg-[#FFC82C] text-black shadow-[0_0_25px_rgba(255,200,44,0.5)] scale-105"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 hidden flex-col items-center gap-1.5 text-[#FFC82C] md:flex"
            aria-label="Défiler pour découvrir les projets"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">DÉFILER</span>
            <span className="flex h-8 w-5 items-start justify-center rounded-full border border-[#FFC82C]/60 p-1">
              <motion.span
                animate={{ y: [0, 8, 0], opacity: [1, 0.45, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1 rounded-full bg-[#FFC82C]"
              />
            </span>
          </motion.div>

        {/* SCROLL-DRIVEN ROTATING GALLERY */}
        <div
          ref={carouselRef}
          className="relative mt-8 hidden md:block"
          style={{ height: `${Math.max(filteredProjects.length, 1) * 100}vh` }}
        >
          <div className="sticky top-16 h-[calc(100vh-4rem)] min-h-[620px] flex items-center justify-center">
            <div className="relative h-full w-full overflow-hidden" style={{ perspective: "1400px" }}>
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[15%] aspect-square w-[min(760px,60vw)] rounded-full border-[5px] border-[#FFC82C] shadow-[0_0_32px_rgba(255,200,44,0.8)]"
                style={{ transform: "translate(-50%, -50%) rotateX(74deg)" }}
              />

              <motion.div
                className="absolute inset-0"
                style={{ rotateY: carouselRotation, transformStyle: "preserve-3d" }}
              >
                {filteredProjects.map((projet, index) => {
                  const angle = (index * 360) / filteredProjects.length;

                  return (
                    <div
                      key={projet.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Voir le projet ${projet.title}`}
                      onClick={() => setSelectedModalProject(projet)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedModalProject(projet);
                        }
                      }}
                      className="group absolute left-1/2 top-[56%] w-[min(76vw,380px)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#FFC82C] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B0D18]"
                      style={{
                        transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(min(380px, 30vw))`,
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 z-30 flex h-24 -translate-x-1/2 flex-col items-center">
                        <span className="h-[76px] w-[2px] bg-[#FFC82C] shadow-[0_0_8px_rgba(255,200,44,0.8)]" />
                        <span className="h-4 w-4 rounded-full border-2 border-[#FFC82C] bg-[#0B0D18] shadow-[0_0_12px_rgba(255,200,44,0.8)]" />
                      </div>

                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -rotate-2 rounded-3xl border border-[#FFC82C]/25 bg-[#FFC82C]/10 shadow-lg transition-transform duration-500 group-hover:-rotate-4" />
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rotate-2 rounded-3xl border border-[#FF3B56]/25 bg-[#FF3B56]/10 shadow-md transition-transform duration-500 group-hover:rotate-4" />

                      <motion.div
                        whileHover={{ rotateZ: index % 2 === 0 ? -2 : 2, y: -14, scale: 1.05 }}
                        className="relative flex h-full flex-col justify-between rounded-3xl border border-white/20 bg-[#121526]/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:border-[#FFC82C]"
                      >
                        <div className="pointer-events-none absolute -top-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center transition-transform duration-300 group-hover:scale-110">
                          <span className="h-4 w-4 rounded-full border-2 border-[#FFC82C] bg-[#0B0D18] shadow-[0_0_12px_rgba(255,200,44,0.8)]" />
                          <span className="-mt-1 flex h-7 w-5 items-center justify-center rounded-sm border border-white/40 bg-[#FFC82C] shadow-lg">
                            <span className="h-4 w-1 rounded-full bg-black/40" />
                          </span>
                        </div>

                        <div className="mb-3 flex items-center justify-between pt-2 font-azurio">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-[#FFC82C]">0{projet.id} · {projet.version}</span>
                          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5">
                            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                              {projet.isCompleted ? "READY" : "IN_DEV"}
                            </span>
                          </div>
                        </div>

                        <div className="group/image relative mb-4 h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-black transition-all group-hover:border-white/25">
                          <Image
                            src={projet.image}
                            alt={projet.title}
                            fill
                            sizes="(max-width: 640px) 82vw, 380px"
                            className="object-cover opacity-85 transition-all duration-700 group-hover/image:scale-105 group-hover/image:opacity-100"
                          />
                        </div>

                        <h3 className="mb-2 text-center font-achiko text-xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-[#FFC82C]">
                          {projet.title}
                        </h3>

                        <div className="mb-4 flex min-h-16 flex-grow items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] p-3 text-center">
                          <p className="line-clamp-2 font-azurio text-[11px] uppercase leading-relaxed text-gray-200">
                            &rdquo;{projet.description}&rdquo;
                          </p>
                        </div>

                        <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5">
                          {projet.tech.slice(0, 3).map((tech) => (
                            <span key={tech} className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[9.5px] font-bold text-gray-200">
                              <i className="pi pi-bolt text-[8px] text-[#FFC82C]" /> {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-3 font-azurio">
                          <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FFC82C] transition-all group-hover:gap-2">
                            EXPLORER <i className="pi pi-arrow-right text-[10px]" />
                          </span>
                          {projet.github && <i className="pi pi-github text-xs text-gray-400 transition-colors group-hover:text-white" />}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              <div aria-hidden="true" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
                {filteredProjects.map((projet, index) => (
                  <span key={projet.id} className="h-1.5 w-5 rounded-full bg-white/20" style={{ opacity: index === 0 ? 0.9 : 0.45 }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2 md:hidden">
          {filteredProjects.map((projet) => (
            <div
              key={projet.id}
              role="button"
              tabIndex={0}
              aria-label={`Voir le projet ${projet.title}`}
              onClick={() => setSelectedModalProject(projet)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedModalProject(projet);
                }
              }}
              className="group relative w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#FFC82C] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B0D18]"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -rotate-2 rounded-3xl border border-[#FFC82C]/25 bg-[#FFC82C]/10 shadow-lg transition-transform duration-500 group-hover:-rotate-4" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rotate-2 rounded-3xl border border-[#FF3B56]/25 bg-[#FF3B56]/10 shadow-md transition-transform duration-500 group-hover:rotate-4" />

              <div className="glass-card relative flex h-full flex-col justify-between rounded-3xl border border-white/20 bg-[#121526]/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:border-[#FFC82C]">
                <div className="mb-3 flex items-center justify-between pt-2 font-azurio">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#FFC82C]">0{projet.id} · {projet.version}</span>
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                      {projet.isCompleted ? "READY" : "IN_DEV"}
                    </span>
                  </div>
                </div>

                <div className="group/image relative mb-4 h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-black transition-all group-hover:border-white/25">
                  <Image
                    src={projet.image}
                    alt={projet.title}
                    fill
                    sizes="(max-width: 640px) 90vw, 45vw"
                    className="object-cover opacity-85 transition-all duration-700 group-hover/image:scale-105 group-hover/image:opacity-100"
                  />
                </div>

                <h3 className="mb-2 text-center font-achiko text-xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-[#FFC82C]">
                  {projet.title}
                </h3>

                <div className="mb-4 flex min-h-16 flex-grow items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] p-3 text-center">
                  <p className="line-clamp-2 font-azurio text-[11px] uppercase leading-relaxed text-gray-200">
                    &rdquo;{projet.description}&rdquo;
                  </p>
                </div>

                <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5">
                  {projet.tech.slice(0, 3).map((tech) => (
                    <span key={tech} className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[9.5px] font-bold text-gray-200">
                      <i className="pi pi-bolt text-[8px] text-[#FFC82C]" /> {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3 font-azurio">
                  <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FFC82C] transition-all group-hover:gap-2">
                    EXPLORER <i className="pi pi-arrow-right text-[10px]" />
                  </span>
                  {projet.github && <i className="pi pi-github text-xs text-gray-400 transition-colors group-hover:text-white" />}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FULL-SCREEN IMMERSIVE PROJECT PREVIEW MODAL */}
      <AnimatePresence>
        {selectedModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedModalProject(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-2xl w-full rounded-3xl border border-[#FFC82C]/40 p-6 sm:p-8 bg-[#121526] relative shadow-[0_0_50px_rgba(255,200,44,0.25)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedModalProject(null)}
                aria-label="Fermer l’aperçu du projet"
                className="absolute right-5 top-5 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-[#0B0D18]/90 text-white shadow-lg transition-colors hover:bg-[#FFC82C] hover:text-black"
              >
                <i className="pi pi-times text-base" />
              </button>

              {/* Modal Image Header */}
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-black mb-6 border border-white/15">
                <Image
                  src={selectedModalProject.image}
                  alt={selectedModalProject.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur border border-white/20 text-[#FFC82C] font-mono text-xs font-bold">
                  VERSION {selectedModalProject.version}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-achiko text-3xl font-black uppercase text-white mb-3">
                {selectedModalProject.title}
              </h3>

              <p className="font-azurio text-sm text-gray-300 leading-relaxed font-light mb-6">
                {selectedModalProject.description}
              </p>

              {/* Tech Stack */}
              <div className="mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFC82C] block mb-2">
                  TECHNOLOGIES UTILISÉES :
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedModalProject.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-xl border border-white/20 bg-white/5 text-gray-200 text-xs font-bold font-azurio"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <a
                  href={selectedModalProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#FFC82C] text-black font-achiko font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                >
                  VOIR LE PROJET EN DIRECT <i className="pi pi-external-link" />
                </a>

                {selectedModalProject.github && (
                  <a
                    href={selectedModalProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl border border-white/20 hover:border-white text-white font-azurio font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    GITHUB <i className="pi pi-github" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}