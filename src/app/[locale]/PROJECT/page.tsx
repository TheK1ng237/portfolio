"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Project } from "@/app/type";
import { apiFetch } from "@/lib/api";
import { CyberCarSceneRef, BIOMES, CameraMode } from "@/components/3d/CyberCarScene";

const CyberCarScene = dynamic(
  () => import("@/components/3d/CyberCarScene").then((m) => m.CyberCarScene),
  { ssr: false }
);

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: 'Plateforme Web "Culture Africa"',
    description: 'Site interactif pour explorer et promouvoir la culture africaine à travers des animations et récits visuels.',
    image: "/images/mvp1.png",
    link: "https://cultureafricaine.vercel.app",
    github: "https://github.com/TangB5/mvp",
    tech: ["Next.js 15", "Tailwind CSS", "Framer Motion", "TypeScript", "Three.js"],
    category: "web",
    featured: true,
    isCompleted: true,
    version: "v2.0",
  },
  {
    id: 2,
    title: 'Application "Culture Cameroun"',
    description: 'Application éducative immersive explorant les richesses culturelles et patrimoniales du Cameroun.',
    image: "/images/projet2.png",
    link: "https://cultureafricaine.vercel.app",
    github: "https://github.com/TangB5",
    tech: ["React 19", "Tailwind CSS", "Framer Motion", "Next.js"],
    category: "mobile",
    featured: true,
    isCompleted: true,
    version: "v1.5",
  },
  {
    id: 3,
    title: 'Identité Visuelle "Ngano Fashion"',
    description: 'Direction artistique complète, branding et motifs adinkra pour une marque de mode contemporaine.',
    image: "/projet3.jpg",
    link: "https://github.com/TangB5",
    github: "https://github.com/TangB5",
    tech: ["Figma", "Branding", "UI Design", "Adinkra Motifs"],
    category: "design",
    featured: true,
    isCompleted: true,
    version: "v1.0",
  },
  {
    id: 4,
    title: 'MarketPlace Africaine "AfroShop"',
    description: "Plateforme e-commerce mettant en valeur l'artisanat local avec une architecture full-stack ultra rapide.",
    image: "/projet1.jpg",
    link: "https://github.com/TangB5",
    github: "https://github.com/TangB5",
    tech: ["Next.js", "Tailwind CSS", "Node.js", "E-Commerce"],
    category: "web",
    featured: false,
    isCompleted: true,
    version: "v2.0",
  },
  {
    id: 5,
    title: 'Écosystème "Wouri River Tech"',
    description: 'Dashboard analytique et plateforme WebGL de monitoring de projets technologiques au Cameroun.',
    image: "/images/mvp1.png",
    link: "https://github.com/TangB5",
    github: "https://github.com/TangB5",
    tech: ["WebGL", "Three.js", "Tailwind CSS", "TypeScript"],
    category: "web",
    featured: true,
    isCompleted: true,
    version: "v3.0",
  },
];

type ProjectApiItem = {
  id?: number | string;
  title?: string;
  titleFr?: string;
  titleEn?: string;
  description?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  image?: string;
  link?: string;
  github?: string;
  tech?: string[];
  category?: string;
  featured?: boolean;
  isCompleted?: boolean;
  version?: string;
};

const mapProject = (item: ProjectApiItem): Project => ({
  id: Number(item.id ?? Math.random()),
  title: item.title ?? item.titleFr ?? item.titleEn ?? "Projet",
  description: item.description ?? item.descriptionFr ?? item.descriptionEn ?? "",
  image: item.image ?? "/images/mvp1.png",
  link: item.link ?? "",
  github: item.github ?? "",
  tech: Array.isArray(item.tech) ? item.tech : [],
  category: item.category === "web" || item.category === "mobile" || item.category === "design" ? item.category : "web",
  featured: Boolean(item.featured),
  isCompleted: item.isCompleted ?? true,
  version: item.version ?? "v1.0",
});

export default function ProjectsPage() {
  const t = useTranslations("ProjectsPage");
  const locale = useLocale();

  const sceneRef = useRef<CyberCarSceneRef>(null);

  const [filter, setFilter] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModalProject, setSelectedModalProject] = useState<Project | null>(null);

  // 3D Scene Interactive HUD States
  const [activeBiomeIndex, setActiveBiomeIndex] = useState<number>(0);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [nearProject, setNearProject] = useState<Project | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>("chase");
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const data = await apiFetch<{ items: ProjectApiItem[] }>("/public/projects", { locale, method: "GET" });
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setProjects(data.items.map(mapProject));
        }
      } catch {
        if (!cancelled) setProjects(fallbackProjects);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadProjects();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const filteredProjects = useMemo(
    () => filter === "all" ? projects : projects.filter((project) => project.category === filter),
    [filter, projects],
  );

  const handleSelectProject = useCallback((project: Project) => setSelectedModalProject(project), []);
  const handleBiomeChange = useCallback((index: number) => setActiveBiomeIndex(index), []);
  const handleSpeedChange = useCallback((speed: number) => setCurrentSpeed(speed), []);
  const handleNearProject = useCallback((project: Project | null) => setNearProject(project), []);

  // Safe helper for translation strings
  const getTrans = (key: string, fallback: string) => {
    try {
      return t(key);
    } catch {
      return fallback;
    }
  };

  return (
    <div className="min-h-screen relative bg-[#050714] text-[#F8F9FA] font-azurio overflow-hidden selection:bg-[#FFC82C] selection:text-black">
      {/* 3D WEBGL MOTION CONTAINER */}
      {viewMode === "3d" ? (
        <div className="fixed inset-0 z-0">
          <CyberCarScene
            ref={sceneRef}
            projects={filteredProjects}
            onSelectProject={handleSelectProject}
            onBiomeChange={handleBiomeChange}
            onSpeedChange={handleSpeedChange}
            onNearProject={handleNearProject}
          />

          {/* MOTION DESIGNER HUD OVERLAY LAYER */}
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-6 select-none">
            {/* HUD HEADER & NAVIGATION BAR */}
            <div className="flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
            
              <div className="flex items-center gap-2.5">
                

                <button
                  onClick={() => setViewMode("grid")}
                  className="px-3.5 py-2 rounded-xl bg-[#0c0f24]/80 border border-white/20 text-gray-300 hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
                  title="Basculer en vue grille standard"
                >
                  <i className="pi pi-th-large" />
                  <span className="hidden sm:inline">MODE GRILLE</span>
                </button>

                <button
                  onClick={() => setShowHelpModal(true)}
                  className="w-9 h-9 rounded-xl bg-[#0c0f24]/80 border border-white/20 text-[#FFC82C] hover:bg-white/10 flex items-center justify-center text-sm font-bold cursor-pointer"
                  title="Commandes et Aides"
                >
                  ?
                </button>
              </div>
            </div>

            {/* PROXIMITY WAYPOINT DETECTED ALERT BANNER */}
            <AnimatePresence>
              {nearProject && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className="pointer-events-auto self-center max-w-xl w-full bg-[#121526]/95 border-2 border-[#FFC82C] p-4 sm:p-5 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_rgba(255,200,44,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shrink-0 bg-black">
                      <Image src={nearProject.image} alt={nearProject.title} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-[9.5px] font-mono font-bold tracking-widest text-[#FFC82C] uppercase flex items-center gap-1.5">
                        <i className="pi pi-compass animate-spin text-[10px]" /> WAYPOINT HOLOGRAPHIQUE
                      </span>
                      <h3 className="font-achiko text-base sm:text-lg font-black uppercase text-white line-clamp-1">
                        {nearProject.title}
                      </h3>
                      <p className="text-[11px] text-gray-300 line-clamp-1">{nearProject.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedModalProject(nearProject)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFC82C] text-black font-achiko text-xs font-black uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,200,44,0.8)] shrink-0 cursor-pointer"
                  >
                    EXPLORER PROJET
                  </button>
                </motion.div>
              )}
            </AnimatePresence>


            text

            {/* HUD BOTTOM DASHBOARD, SPEEDOMETER & TOUCH CONTROLS */}
            <div className="flex flex-wrap items-end justify-between gap-4 pointer-events-auto">
              {/* SPEEDOMETER & DRIVE BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 bg-[#0c0f24]/90 backdrop-blur-xl border border-white/15 p-3 rounded-3xl shadow-2xl">
                <div className="text-center border-r border-white/15 pr-3 pl-1">
                  <span className="text-[8.5px] font-mono text-gray-400 block tracking-widest uppercase">VITESSE</span>
                  <span className="font-achiko text-2xl sm:text-3xl font-black text-[#FFC82C] leading-none">
                    {currentSpeed}
                  </span>
                  <span className="text-[8.5px] font-mono text-gray-400 block uppercase">KM/H</span>
                </div>

                {/* ON-SCREEN VIRTUAL STEERING & THROTTLE CONTROLS */}
                <div className="flex items-center gap-1.5">
                  <button
                    onMouseDown={() => sceneRef.current?.setSteerLeft(true)}
                    onMouseUp={() => sceneRef.current?.setSteerLeft(false)}
                    onTouchStart={() => sceneRef.current?.setSteerLeft(true)}
                    onTouchEnd={() => sceneRef.current?.setSteerLeft(false)}
                    className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 active:bg-[#FFC82C] active:text-black text-white font-bold flex items-center justify-center text-sm cursor-pointer select-none"
                    title="Virer à gauche (Flèche Gauche / A)"
                  >
                    ◄
                  </button>

                  <div className="flex flex-col gap-1">
                    <button
                      onMouseDown={() => sceneRef.current?.setThrottle(true)}
                      onMouseUp={() => sceneRef.current?.setThrottle(false)}
                      onTouchStart={() => sceneRef.current?.setThrottle(true)}
                      onTouchEnd={() => sceneRef.current?.setThrottle(false)}
                      className="px-4 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] active:scale-95 text-black font-achiko font-black text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-pointer select-none flex items-center gap-1"
                    >
                      ▲ AVANCER
                    </button>
                    <button
                      onMouseDown={() => sceneRef.current?.setBrake(true)}
                      onMouseUp={() => sceneRef.current?.setBrake(false)}
                      onTouchStart={() => sceneRef.current?.setBrake(true)}
                      onTouchEnd={() => sceneRef.current?.setBrake(false)}
                      className="px-4 py-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-gray-200 font-mono text-[9.5px] uppercase tracking-wider border border-white/15 cursor-pointer select-none"
                    >
                      ▼ RECULER
                    </button>
                  </div>

                  <button
                    onMouseDown={() => sceneRef.current?.setSteerRight(true)}
                    onMouseUp={() => sceneRef.current?.setSteerRight(false)}
                    onTouchStart={() => sceneRef.current?.setSteerRight(true)}
                    onTouchEnd={() => sceneRef.current?.setSteerRight(false)}
                    className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 active:bg-[#FFC82C] active:text-black text-white font-bold flex items-center justify-center text-sm cursor-pointer select-none"
                    title="Virer à droite (Flèche Droite / D)"
                  >
                    ►
                  </button>
                </div>

                <button
                  onClick={() => sceneRef.current?.triggerBoost()}
                  className="px-3.5 py-3 rounded-2xl bg-gradient-to-r from-[#FF3B56] to-[#FFC82C] text-black font-achiko font-black text-[10px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,59,86,0.6)] cursor-pointer flex items-center gap-1 select-none"
                >
                  <i className="pi pi-bolt text-xs" /> TURBO
                </button>
              </div>

              {/* CAMERA MODE SWITCHER */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-white/15 bg-[#0c0f24]/80 backdrop-blur-xl">
                {(["chase", "cockpit", "orbit", "map"] as CameraMode[]).map((mode) => {
                  const isActive = cameraMode === mode;
                  const labels = {
                    chase: "CHASE 3D",
                    cockpit: "COCKPIT",
                    orbit: "ORBIT 360",
                    map: "SATELLITE",
                  };
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        sceneRef.current?.setCameraMode(mode);
                        setCameraMode(mode);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#00F3FF] text-black shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                          : "text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {labels[mode]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD CLASSIC GRID VIEW MODE FALLBACK */
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 relative z-10">
          <div className="flex justify-between items-center mb-10 border-b border-white/15 pb-6">
            <div>
              <h1 className="font-achiko text-3xl sm:text-5xl font-black uppercase text-white">
                PORTFOLIO <span className="text-[#FFC82C]">MODULES</span>
              </h1>
              <p className="text-sm text-gray-300 font-azurio">Galerie classique des projets récents</p>
            </div>

            <button
              onClick={() => setViewMode("3d")}
              className="px-5 py-3 rounded-2xl bg-[#FFC82C] text-black font-achiko text-xs font-black uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,200,44,0.5)] flex items-center gap-2 cursor-pointer"
            >
              <i className="pi pi-compass text-sm" /> RETOURNER EN CONDUITE 3D
            </button>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2 mb-10">
            {[
              { id: "all", label: getTrans("filters.all", "Tous") },
              { id: "web", label: getTrans("filters.web", "Web") },
              { id: "mobile", label: getTrans("filters.mobile", "Mobile") },
              { id: "design", label: getTrans("filters.design", "Design") },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-achiko uppercase tracking-widest font-bold transition-all cursor-pointer ${
                  filter === f.id
                    ? "bg-[#FFC82C] text-black shadow-[0_0_20px_rgba(255,200,44,0.5)]"
                    : "bg-[#121526] text-gray-300 border border-white/10 hover:border-white/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* GRID OF CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedModalProject(project)}
                className="glass-card group rounded-3xl p-5 border border-white/15 cursor-pointer hover:border-[#FFC82C] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-black">
                    <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#FFC82C] block mb-1">PROJET 0{project.id} · {project.version}</span>
                  <h3 className="font-achiko text-xl font-black text-white mb-2 uppercase group-hover:text-[#FFC82C] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-3 mb-4 leading-relaxed">{project.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md border border-white/15 bg-white/5 text-[9px] font-mono text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-[#FFC82C] font-bold">
                    <span>EXPLORER LE PROJET</span>
                    <i className="pi pi-arrow-right" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HELP / CONTROLS MODAL */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelpModal(false)}
            className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 font-azurio"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-lg w-full rounded-3xl border border-[#FFC82C] p-6 space-y-6 shadow-2xl"
            >
              

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <span className="font-bold text-gray-300">AVANCER / RECULER</span>
                  <span className="font-mono text-[#FFC82C] font-bold">W / S  ou  FLÈCHES HAUT/BAS</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <span className="font-bold text-gray-300">VIRER À GAUCHE / DROITE</span>
                  <span className="font-mono text-[#FFC82C] font-bold">A / D  ou  FLÈCHES GAUCHE/DROITE</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-[#FF3B56]/10 border-[#FF3B56]/30">
                  <span className="font-bold text-[#FF3B56]">TURBO NITRO BOOST</span>
                  <span className="font-mono text-[#FFC82C] font-bold">BARRE D&apos;ESPACE</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <span className="font-bold text-gray-300">CHANGER LA VUE CAMÉRA</span>
                  <span className="font-mono text-[#FFC82C] font-bold">TOUCHE &apos;C&apos;</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <span className="font-bold text-gray-300">NAVIGATION CONTINUED</span>
                  <span className="font-mono text-[#FFC82C] font-bold">MOLETTE DE LA SOURIS</span>
                </div>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-3 rounded-xl bg-[#FFC82C] text-black font-achiko text-xs font-black uppercase tracking-wider"
              >
                COMPRIS, EN ROUTE !
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROJECT DETAIL MODAL */}
      <AnimatePresence>
        {selectedModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedModalProject(null)}
            className="fixed inset-0 z-[99999] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/85 p-3 font-azurio backdrop-blur-2xl sm:items-center sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl border border-[#FFC82C] p-4 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:space-y-6 sm:rounded-3xl sm:p-8"
            >
              <div className="sticky -mx-4 -mt-4 top-0 z-20 flex items-center justify-between gap-3 border-b border-white/15 bg-[#121526]/95 px-4 pb-3 pt-4 backdrop-blur-xl sm:-mx-8 sm:-mt-8 sm:px-8 sm:pb-4 sm:pt-8">
                <span className="font-mono text-xs text-[#FFC82C] font-bold tracking-widest uppercase">
                  WAYPOINT PROJET // 0{selectedModalProject.id} · {selectedModalProject.version}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedModalProject(null)}
                  aria-label="Fermer le détail du projet"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-gray-300 transition hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C]"
                >
                  <i className="pi pi-times text-sm" />
                </button>
              </div>

              <div className="grid gap-5 pt-4 sm:gap-6 sm:pt-0 md:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div className="relative h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-black sm:h-72 sm:rounded-2xl">
                    <Image src={selectedModalProject.image} alt={selectedModalProject.title} fill className="object-cover" />
                  </div>
                  <h3 className="font-achiko text-2xl sm:text-3xl font-black uppercase text-white">
                    {selectedModalProject.title}
                  </h3>
                  <p className="text-sm text-gray-200 font-light leading-relaxed">
                    {selectedModalProject.description}
                  </p>
                </div>

                <div className="space-y-5 rounded-2xl border border-white/10 bg-[#121526]/90 p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFC82C] font-bold">STATUT</span>
                      <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {selectedModalProject.isCompleted ? getTrans("status.live", "En Ligne") : getTrans("status.dev", "En Développement")}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFC82C] font-bold block mb-2">
                        {getTrans("status.tech_used", "TECHNOLOGIES EMPLOYÉES")}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedModalProject.tech.map((tech) => (
                          <span key={tech} className="rounded-xl border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase text-gray-200 font-bold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-4">
                    {selectedModalProject.link && (
                      <a
                        href={selectedModalProject.link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full rounded-xl bg-[#FFC82C] px-4 py-3 text-center text-xs font-achiko font-black uppercase text-black hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,200,44,0.5)] flex items-center justify-center gap-2"
                      >
                        <i className="pi pi-external-link text-xs" /> {getTrans("status.view_live", "VOIR LE SITE DÉPLOYÉ")}
                      </a>
                    )}
                    {selectedModalProject.github && (
                      <a
                        href={selectedModalProject.github}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-xs font-achiko font-black uppercase text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="pi pi-github text-xs" /> {getTrans("status.github", "CODE SOURCE GITHUB")}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
