"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Project } from "@/app/type";
import { apiFetch } from "@/lib/api";

/**
 * Page Projets : un mur de briques de terre non crépi. Une corde de raphia est tendue le long de chaque
 * joint horizontal ; chaque projet est un pagne accroché à la corde par deux pinces en bois, avec la
 * couverture du projet imprimée sur le tissu. Les joints du mur sont les rails : les cordes s'y posent.
 */

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

/* ---------------------------------------------------------------------------
 * Le mur : briques de terre cuite, joints foncés visibles, grain.
 * Une rangée = 44 px (brique 40 + joint 4). La tuile fait 11 rangées : c'est aussi la hauteur
 * d'une ligne de pagnes ; les cordes se posent sur un joint (toutes les 44 px).
 * ------------------------------------------------------------------------- */

const COURSE = 44;
const COURSES = 11;
const TILE_W = 600;
const TILE_H = COURSE * COURSES; // 484
const ROW = COURSE * 8; // 352 : hauteur d'une ligne de pagnes (multiple d'une rangée de briques)
const ROPE_Y = COURSE - 2; // la corde se pose sur un joint, à 42 px du haut d'une ligne

const BRICK_TONES = ["#B5573A", "#A94E34", "#BE6140", "#9F4A32", "#B85D3C", "#C26A45", "#A3472F"];

function prng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tirage déterministe : même mur côté serveur et côté navigateur
const BRICKS = (() => {
  const r = prng(237);
  const list: { x: number; y: number; w: number; fill: string }[] = [];
  for (let c = 0; c < COURSES; c++) {
    const raw = Array.from({ length: 4 + Math.floor(r() * 2) }, () => 0.75 + r() * 0.6);
    const sum = raw.reduce((a, b) => a + b, 0);
    let x = r() * TILE_W; // décalage de la rangée
    for (const k of raw) {
      const w = (k / sum) * TILE_W;
      list.push({ x, y: c * COURSE, w, fill: BRICK_TONES[Math.floor(r() * BRICK_TONES.length)] });
      x += w;
    }
  }
  return list;
})();

function Wall() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="wall-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <pattern id="wall-bricks" width={TILE_W} height={TILE_H} patternUnits="userSpaceOnUse">
          <rect width={TILE_W} height={TILE_H} fill="#4A281C" />
          {BRICKS.flatMap((b, i) =>
            [0, -TILE_W].map((dx) => (
              <g key={`${i}-${dx}`}>
                <rect x={b.x + dx + 2} y={b.y + 2} width={b.w - 4} height={COURSE - 4} rx="3" fill={b.fill} />
                <rect x={b.x + dx + 2} y={b.y + 2} width={b.w - 4} height={COURSE - 4} rx="3" fill="url(#wall-shade)" />
              </g>
            )),
          )}
        </pattern>
        <filter id="wall-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>
        </filter>
        <radialGradient id="wall-vignette" cx="50%" cy="45%" r="75%">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1a0a05" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#wall-bricks)" />
      <rect width="100%" height="100%" filter="url(#wall-grain)" opacity="0.28" style={{ mixBlendMode: "multiply" }} />
      <rect width="100%" height="100%" fill="url(#wall-vignette)" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * Corde de raphia, pince à linge en bois, épingle en bois
 * ------------------------------------------------------------------------- */

function Rope() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -left-[100vw] -right-[100vw] z-0 block h-[7px] rounded-full"
      style={{
        top: ROPE_Y - 3,
        background: "repeating-linear-gradient(115deg, #D8B87A 0 4px, #9C7A45 4px 8px)",
        boxShadow: "0 6px 6px rgba(26,10,5,.5)",
      }}
    />
  );
}

/** Pince à linge en bois : deux branches, un ressort en métal. */
function Peg() {
  const uid = useId().replace(/:/g, "");
  return (
    <svg width="14" height="38" viewBox="0 0 14 38" aria-hidden="true" focusable="false" style={{ filter: "drop-shadow(2px 4px 2px rgba(20,8,4,.55))" }}>
      <defs>
        <linearGradient id={`pg-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9A867" />
          <stop offset="0.55" stopColor="#A9743A" />
          <stop offset="1" stopColor="#7A4B22" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="12" height="36" rx="3" fill={`url(#pg-${uid})`} stroke="#4A2C14" strokeWidth="1" />
      <path d="M7 5V34" stroke="#5A3618" strokeOpacity="0.55" strokeWidth="1.2" />
      <rect x="0" y="14" width="14" height="4" rx="1.5" fill="#7C838C" stroke="#4B5159" strokeWidth="0.8" />
    </svg>
  );
}

/** Épingle en bois : tête tournée, veinage, ombre portée sur le mur. */
function Pin({ size = 28 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" focusable="false" style={{ filter: "drop-shadow(2px 4px 2px rgba(20,8,4,.55))" }}>
      <defs>
        <radialGradient id={`pw-${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#D9A867" />
          <stop offset="0.6" stopColor="#A9743A" />
          <stop offset="1" stopColor="#6A4120" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill={`url(#pw-${uid})`} stroke="#4A2C14" strokeWidth="1" />
      <path d="M5 11C9 8 19 8 23 11M4.5 15C9 12 19 12 23.5 15M6 19.5C10 17 18 17 22 19.5" stroke="#5A3618" strokeOpacity="0.5" strokeWidth="1" fill="none" />
      <ellipse cx="10" cy="9" rx="3.4" ry="2" fill="#fff" opacity="0.28" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * Un pagne accroché à la corde
 * ------------------------------------------------------------------------- */

const REST = [-1.2, 1, -0.8, 1.4, -1];
const SHIFT = [-24, 18, -10, 26, -16];

// lisière tissée : fines rayures, comme au bord d'un pagne
const SELVEDGE =
  "repeating-linear-gradient(90deg, #EDE6D0 0 2px, #0E1747 2px 5px, #FFC82C 5px 6px, #0E1747 6px 9px, #FF3B56 9px 10px, #0E1747 10px 14px)";
// grain du tissu par-dessus l'impression
const WEAVE =
  "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0 2px, transparent 2px 4px)";

function Specimen({
  project,
  order,
  dim,
  reduced,
  onOpen,
  ariaLabel,
}: {
  project: Project;
  order: number;
  dim: boolean;
  reduced: boolean;
  onOpen: (p: Project, el: HTMLElement) => void;
  ariaLabel: string;
}) {
  const rest = REST[order % REST.length];
  const dx = SHIFT[order % SHIFT.length];
  const gust = (order % 2 === 0 ? 1 : -1) * 3.5;

  return (
    <li className="relative" style={{ height: ROW }}>
      <Rope />
      <div
        className="relative z-10 mx-auto"
        style={{
          width: "min(420px, 100%)",
          marginTop: ROPE_Y + 4,
          transform: `translateX(${dx}px)`,
          opacity: dim ? 0.28 : 1,
          filter: dim ? "grayscale(0.85)" : undefined,
          transition: "opacity .35s, filter .35s",
        }}
      >
        <motion.div
          style={{ transformOrigin: "50% 0%" }}
          initial={{ rotate: rest }}
          whileInView={
            reduced
              ? undefined
              : { rotate: [rest, rest + gust, rest - gust * 0.6, rest + gust * 0.3, rest - gust * 0.1, rest], transition: { duration: 2.6, delay: 0.12 * order, ease: "easeOut" } }
          }
          viewport={{ once: true, margin: "-8% 0px" }}
          whileHover={reduced ? undefined : { rotate: rest + 1.5, y: -3, transition: { type: "spring", stiffness: 140, damping: 12 } }}
        >
          <button
            type="button"
            aria-label={ariaLabel}
            onClick={(e) => onOpen(project, e.currentTarget)}
            className="relative block aspect-[1.45/1] w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC82C]"
            style={{ filter: "drop-shadow(8px 12px 10px rgba(26,10,5,.5))" }}
          >
            {/* le tissu : couverture imprimée, grain, lisières et ourlets */}
            <span className="absolute inset-0 block overflow-hidden rounded-[2px] bg-[#0E1747]">
              <Image src={project.image} alt="" fill sizes="(min-width: 1024px) 420px, 92vw" className="object-cover" style={{ filter: "saturate(.92) contrast(.97)" }} />
              <span aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: WEAVE }} />
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3.5" style={{ background: SELVEDGE }} />
              <span aria-hidden="true" className="absolute inset-y-0 right-0 w-3.5" style={{ background: SELVEDGE }} />
              <span aria-hidden="true" className="absolute inset-x-3.5 top-0 h-3 border-b-2 border-dashed border-[#E9D8A6]/70 bg-[#141A3F]/80" />
              <span aria-hidden="true" className="absolute inset-x-3.5 bottom-0 h-3 border-t-2 border-dashed border-[#E9D8A6]/70 bg-[#141A3F]/80" />
            </span>

            {/* étiquette en tissu indigo, cousue à la raphia */}
            <span
              className="absolute -bottom-5 left-6 block w-[52%] min-w-[150px] -rotate-2 rounded-[3px] px-3 pb-2 pt-3.5 text-left"
              style={{
                background:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0 2px, transparent 2px 4px), #2B3A8C",
                outline: "2px dashed rgba(233,216,166,.85)",
                outlineOffset: "-5px",
                boxShadow: "0 6px 10px rgba(0,0,0,.4)",
              }}
            >
              <span aria-hidden="true" className="absolute left-1/2 top-1 size-2 -translate-x-1/2 rounded-full bg-[#C99A5B] shadow-[0_1px_1px_rgba(0,0,0,.5)]" />
              <span className="line-clamp-2 block font-achiko text-[13px] font-black leading-tight text-[#F4EBD0]">{project.title}</span>
              <span className="mt-0.5 block text-[11px] text-[#E9D8A6]/85">{project.version}</span>
            </span>
          </button>

          {/* les deux pinces qui tiennent le pagne à la corde */}
          <span aria-hidden="true" className="pointer-events-none absolute -top-3 left-[12%]">
            <Peg />
          </span>
          <span aria-hidden="true" className="pointer-events-none absolute -top-3 right-[12%]">
            <Peg />
          </span>
        </motion.div>
      </div>
    </li>
  );
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export default function ProjectsPage() {
  const t = useTranslations("ProjectsPage");
  const locale = useLocale();
  const reduced = !!useReducedMotion();

  const localizedFallbackProjects = useMemo(
    () =>
      fallbackProjects.map((project) => ({
        ...project,
        title: t(`items.${project.id}.title`),
        description: t(`items.${project.id}.description`),
      })),
    [t],
  );

  const [filter, setFilter] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>(localizedFallbackProjects);
  const [selected, setSelected] = useState<Project | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

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

  const matches = useMemo(
    () => (filter === "all" ? projects.length : projects.filter((p) => p.category === filter).length),
    [filter, projects],
  );

  function open(project: Project, el: HTMLElement) {
    lastFocus.current = el;
    setSelected(project);
  }
  function close() {
    setSelected(null);
    lastFocus.current?.focus();
  }

  // Fiche ouverte : focus sur « fermer », Échap pour fermer, pas de défilement derrière
  useEffect(() => {
    if (!selected) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const filters = [
    { id: "all", label: t("filters.all") },
    { id: "web", label: t("filters.web") },
    { id: "mobile", label: t("filters.mobile") },
    { id: "design", label: t("filters.design") },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D18] font-azurio text-[#F8F9FA] selection:bg-[#FFC82C] selection:text-black">
      <header className="mx-auto max-w-6xl px-6 pb-10 pt-32">
        <h1 className="font-achiko text-3xl font-black text-white sm:text-5xl">
          {t("grid.title_prefix")} {t("grid.title_highlight")}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300">{t("grid.description")}</p>

        <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label={t("filters.all")}>
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-[3px] px-5 py-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C] ${
                filter === f.id ? "bg-[#FFC82C] text-[#141A3F]" : "bg-[#2B3A8C] text-[#F4EBD0] hover:bg-[#3446A8]"
              }`}
              style={filter === f.id ? undefined : { outline: "2px dashed rgba(233,216,166,.7)", outlineOffset: "-4px" }}
            >
              {f.label}
            </button>
          ))}
        </div>
        {matches === 0 && <p className="mt-6 text-sm text-gray-300">{t("filters.no_projects")}</p>}
      </header>

      {/* Le mur et ses cordes */}
      <section>
        <div aria-hidden="true" className="h-5 bg-gradient-to-b from-[#6B4527] via-[#4A2E18] to-[#2A190C] shadow-[0_14px_22px_rgba(0,0,0,.55)]" />
        <div className="relative overflow-hidden bg-[#4A281C]">
          <Wall />
          <ul className="relative mx-auto grid max-w-6xl grid-cols-1 px-6 pb-6 lg:grid-cols-2">
            {projects.map((project, i) => (
              <Specimen
                key={project.id}
                project={project}
                order={i}
                reduced={reduced}
                dim={filter !== "all" && project.category !== filter}
                onOpen={open}
                ariaLabel={`${project.title}, ${t("grid.explore_project")}`}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* Fiche du projet : une feuille de papier épinglée */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[99999] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/80 p-3 sm:items-center sm:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-title"
              initial={reduced ? false : { y: -28, rotate: -1.5, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { y: -20, rotate: 1, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-auto w-full max-w-3xl rounded-[4px] bg-[#E9D8A6] p-5 pt-9 text-[#141A3F] shadow-2xl sm:p-8 sm:pt-10"
            >
              <div className="absolute left-6 top-0 -translate-y-1/2">
                <Pin size={30} />
              </div>
              <div className="absolute right-6 top-0 -translate-y-1/2">
                <Pin size={30} />
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={t("modal.close")}
                className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-xl text-[#141A3F]/70 hover:bg-[#141A3F]/10 hover:text-[#141A3F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#141A3F]"
              >
                ×
              </button>

              <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
                <div className="relative h-52 w-full overflow-hidden rounded-[3px] border-2 border-[#141A3F]/70 bg-black sm:h-72">
                  <Image src={selected.image} alt={selected.title} fill sizes="(min-width: 768px) 420px, 92vw" className="object-cover" />
                </div>

                <div className="flex flex-col justify-between gap-6">
                  <div>
                    <p className="text-sm text-[#141A3F]/70">{selected.version}</p>
                    <h2 id="project-title" className="mt-1 font-achiko text-2xl font-black leading-tight sm:text-3xl">
                      {selected.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#141A3F]/85">{selected.description}</p>
                    {selected.tech.length > 0 && (
                      <p className="mt-4 text-sm">
                        <span className="font-bold">{t("modal.tech_used")} : </span>
                        {selected.tech.join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {selected.link && (
                      <a
                        href={selected.link}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[3px] bg-[#2B3A8C] px-4 py-3 text-center text-sm font-bold text-[#F4EBD0] transition-colors hover:bg-[#3446A8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141A3F]"
                      >
                        {t("modal.view_live")}
                      </a>
                    )}
                    {selected.github && (
                      <a
                        href={selected.github}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[3px] border-2 border-[#141A3F]/70 px-4 py-3 text-center text-sm font-bold text-[#141A3F] transition-colors hover:bg-[#141A3F]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141A3F]"
                      >
                        {t("modal.github")}
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