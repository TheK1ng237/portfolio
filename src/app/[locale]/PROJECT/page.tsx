"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Project } from "@/app/type";
import { apiFetch } from "@/lib/api";

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "",
    description: "",
    image: "/projet/culture-africaine.png",
    link: "https://culture-africaine.vercel.app",
    github: "https://github.com/TangB5/mvp",
    tech: ["Next.js 15", "Tailwind CSS", "Framer Motion", "TypeScript", "Three.js"],
    category: "web",
    featured: true,
    isCompleted: true,
    version: "v2.0",
  },
  {
    id: 2,
    title: "",
    description: "",
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
    title: "",
    description: "",
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
    title: "",
    description: "",
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
    title: "",
    description: "",
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

const mapProject = (item: ProjectApiItem, locale: string): Project => ({
  id: Number(item.id ?? Math.random()),
  title: (locale === "en" ? item.titleEn ?? item.titleFr : item.titleFr ?? item.titleEn) ?? item.title ?? "",
  description: (locale === "en" ? item.descriptionEn ?? item.descriptionFr : item.descriptionFr ?? item.descriptionEn) ?? item.description ?? "",
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

  const localizedFallbackProjects = useMemo(
    () => fallbackProjects.map((project) => ({
      ...project,
      title: t(`items.${project.id}.title`),
      description: t(`items.${project.id}.description`),
    })),
    [t],
  );

  const [filter, setFilter] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>(localizedFallbackProjects);
  const [selectedModalProject, setSelectedModalProject] = useState<Project | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const data = await apiFetch<{ items: ProjectApiItem[] }>("/public/projects", { locale, method: "GET" });
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setProjects(data.items.map((item) => mapProject(item, locale)));
        }
      } catch {
        if (!cancelled) setProjects(localizedFallbackProjects);
      }
    };

    void loadProjects();
    return () => {
      cancelled = true;
    };
  }, [locale, localizedFallbackProjects]);

  const filteredProjects = useMemo(
    () => filter === "all" ? projects : projects.filter((project) => project.category === filter),
    [filter, projects],
  );

  return (
    <div className="min-h-screen relative bg-[#050714] text-[#F8F9FA] font-azurio overflow-hidden selection:bg-[#FFC82C] selection:text-black">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-32 relative z-10">
        <div className="mb-10 flex flex-col gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-achiko text-3xl sm:text-5xl font-black uppercase text-white">
              {t("grid.title_prefix")} <span className="text-[#FFC82C]">{t("grid.title_highlight")}</span>
            </h1>
            <p className="mt-2 text-sm text-gray-300 font-azurio">{t("grid.description")}</p>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {[
            { id: "all", label: t("filters.all") },
            { id: "web", label: t("filters.web") },
            { id: "mobile", label: t("filters.mobile") },
            { id: "design", label: t("filters.design") },
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

        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-[#121526]/60 p-10 text-center text-gray-300">
            {t("filters.no_projects") || "No projects found"}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedModalProject(project)}
                className="glass-card group rounded-3xl p-5 border border-white/15 cursor-pointer hover:border-[#FFC82C] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-4 bg-black">
                    <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#FFC82C] block mb-1">
                    {t("grid.project_label")} 0{project.id} · {project.version}
                  </span>
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
                    <span>{t("grid.explore_project")}</span>
                    <i className="pi pi-arrow-right" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedModalProject(null)}
                  aria-label={t("modal.close")}
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
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFC82C] font-bold block mb-2">
                        {t("modal.tech_used")}
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
                        <i className="pi pi-external-link text-xs" /> {t("modal.view_live")}
                      </a>
                    )}
                    {selectedModalProject.github && (
                      <a
                        href={selectedModalProject.github}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-xs font-achiko font-black uppercase text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="pi pi-github text-xs" /> {t("modal.github")}
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
