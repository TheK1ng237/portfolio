"use client";

import React, { useEffect, useId, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Hero from "./component/HERO";
import TestimonialsSection from "./component/TestimonialsSection";
import { useTranslations } from "next-intl";

/* -------------------------------------------------------------------------- */
/*  Données                                                                   */
/* -------------------------------------------------------------------------- */

type TextileKind = "NDOP" | "ADINKRA" | "TOGHU" | "KENTE";

const TEXTILE_COLORS: Record<TextileKind, { color: string; hue: number }> = {
  NDOP: { color: "#FFC82C", hue: 46 },
  ADINKRA: { color: "#FF3B56", hue: 352 },
  TOGHU: { color: "#FFE57F", hue: 47 },
  KENTE: { color: "#FFB300", hue: 44 },
};

type Project = {
  id: string;
  titleKey: string;
  category: "web" | "culture" | "design";
  tags: string[];
  image: string;
  projectLink: string;
};

const projects: Project[] = [
  {
    id: "01",
    titleKey: "01",
    category: "web",
    tags: ["Next.js 15", "TypeScript", "Tailwind CSS", "E-Commerce"],
    image: "/projet1.jpg",
    projectLink: "https://cultureafricaine.vercel.app/",
  },
  {
    id: "02",
    titleKey: "02",
    category: "culture",
    tags: ["React 19", "Framer Motion", "Culture", "UI/UX Architecture"],
    image: "/images/projet2.png",
    projectLink: "https://cultureafricaine.vercel.app/",
  },
  {
    id: "03",
    titleKey: "03",
    category: "design",
    tags: ["Branding", "Ndop Geometry", "Design System", "Art Direction"],
    image: "/projet3.jpg",
    projectLink: "https://github.com/TangB5",
  },
];

const CATEGORY_TEXTILE: Record<Project["category"], TextileKind> = {
  web: "NDOP",
  culture: "ADINKRA",
  design: "TOGHU",
};

const skillMatrix: Array<{ icon: string; key: string; textile: TextileKind }> = [
  { icon: "desktop", key: "frontend", textile: "NDOP" },
  { icon: "palette", key: "design", textile: "ADINKRA" },
  { icon: "sparkles", key: "creative", textile: "TOGHU" },
  { icon: "globe", key: "culture", textile: "KENTE" },
];

/* -------------------------------------------------------------------------- */
/*  Textiles : motifs SVG + texture de tissu                                  */
/* -------------------------------------------------------------------------- */

const hsl = (h: number, s = 100, l = 60) => `hsl(${((h % 360) + 360) % 360} ${s}% ${l}%)`;

function spiralPath(cx: number, cy: number, r: number, turns = 2, dir: 1 | -1 = 1) {
  const steps = Math.round(turns * 28);
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = dir * t * turns * Math.PI * 2;
    const radius = r * (1 - t) + 0.8;
    d += `${i === 0 ? "M" : "L"}${(cx + radius * Math.cos(angle)).toFixed(1)} ${(cy + radius * Math.sin(angle)).toFixed(1)} `;
  }
  return d.trim();
}

function buildTile(kind: TextileKind, color: string, hue: number): { w: number; h: number; node: React.ReactNode } {
  const cream = "#F4EFE0";

  if (kind === "NDOP") {
    return {
      w: 64,
      h: 64,
      node: (
        <>
          <rect width="64" height="64" fill="#0E1747" />
          <polygon points="32,4 60,32 32,60 4,32" fill="none" stroke={color} strokeWidth="2" />
          <polygon points="32,15 49,32 32,49 15,32" fill="none" stroke={cream} strokeWidth="1.5" />
          <polygon points="32,26 38,32 32,38 26,32" fill={color} />
          <path d="M32 4V15M60 32H49M32 60V49M4 32H15" stroke={cream} strokeWidth="1.5" fill="none" />
          <path d="M0 12L12 0M52 0L64 12M64 52L52 64M12 64L0 52" stroke={color} strokeWidth="2" fill="none" />
          {[
            [32, 4],
            [60, 32],
            [32, 60],
            [4, 32],
          ].map(([x, y]) => (
            <circle key={`v-${x}-${y}`} cx={x} cy={y} r="2.5" fill={cream} />
          ))}
          {[
            [0, 0],
            [64, 0],
            [0, 64],
            [64, 64],
          ].map(([x, y]) => (
            <circle key={`c-${x}-${y}`} cx={x} cy={y} r="3" fill={color} />
          ))}
        </>
      ),
    };
  }

  if (kind === "ADINKRA") {
    return {
      w: 120,
      h: 120,
      node: (
        <>
          <rect width="120" height="120" fill="#1A0F0C" />
          <path
            d="M0 0H120M0 60H120M0 120H120M0 0V120M60 0V120M120 0V120"
            stroke={color}
            strokeOpacity="0.4"
            strokeWidth="2"
            fill="none"
          />
          {[0, 60, 120].flatMap((x) =>
            [0, 60, 120].map((y) => <circle key={`n-${x}-${y}`} cx={x} cy={y} r="2.5" fill={color} />)
          )}
          <g fill="none" stroke={color} strokeWidth="2.5">
            <circle cx="30" cy="30" r="19" />
            <circle cx="30" cy="30" r="12" />
            <circle cx="30" cy="30" r="5" fill={color} />
          </g>
          <g fill="none" stroke={cream} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={spiralPath(82, 30, 8, 1.75, 1)} />
            <path d={spiralPath(98, 30, 8, 1.75, -1)} />
            <path d="M76 46H104" />
          </g>
          <g fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 106C10 92 12 72 24 72C28 72 30 76 30 79C30 76 32 72 36 72C48 72 50 92 30 106Z" />
            <path d={spiralPath(30, 87, 7, 1.75, 1)} />
          </g>
          <path
            d="M76 74L104 82L76 90L104 98L76 106"
            fill="none"
            stroke={cream}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ),
    };
  }

  if (kind === "KENTE") {
    const gold = hsl(hue, 100, 50);
    const red = "#E4283E";
    const green = "#0E8F4F";
    const black = "#111111";
    const bands = [
      { x: 0, w: 12, fill: gold, block: black },
      { x: 12, w: 6, fill: black, block: null },
      { x: 18, w: 12, fill: green, block: gold },
      { x: 30, w: 6, fill: black, block: null },
      { x: 36, w: 12, fill: red, block: black },
      { x: 48, w: 6, fill: black, block: null },
      { x: 54, w: 6, fill: gold, block: null },
    ];
    return {
      w: 60,
      h: 60,
      node: (
        <>
          {bands.map((b) => (
            <rect key={`b-${b.x}`} x={b.x} y="0" width={b.w} height="60" fill={b.fill} />
          ))}
          {bands
            .filter((b) => b.block)
            .flatMap((b) => [
              <rect key={`s1-${b.x}`} x={b.x + 3} y="6" width="6" height="6" fill={b.block as string} />,
              <rect key={`s2-${b.x}`} x={b.x + 3} y="40" width="6" height="6" fill={b.block as string} />,
              <rect key={`s3-${b.x}`} x={b.x + 3} y="14" width="6" height="6" fill={b.block as string} fillOpacity="0.45" />,
              <rect key={`s4-${b.x}`} x={b.x + 3} y="48" width="6" height="6" fill={b.block as string} fillOpacity="0.45" />,
            ])}
          <rect y="26" width="60" height="5" fill={black} />
          <path d="M0 28.5H60" stroke={gold} strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          <rect y="57" width="60" height="3" fill={black} />
        </>
      ),
    };
  }

  // TOGHU
  const c2 = hsl(hue + 130);
  const c3 = hsl(hue + 250);
  return {
    w: 72,
    h: 72,
    node: (
      <>
        <rect width="72" height="72" fill="#14070A" />
        {[12, 36, 60].map((cx) => (
          <g key={`d-${cx}`}>
            <polygon points={`${cx},2 ${cx + 12},12 ${cx},22 ${cx - 12},12`} fill="none" stroke={color} strokeWidth="2" />
            <polygon points={`${cx},7 ${cx + 6},12 ${cx},17 ${cx - 6},12`} fill={c3} />
          </g>
        ))}
        <path
          d="M0 34L9 28L18 34L27 28L36 34L45 28L54 34L63 28L72 34"
          fill="none"
          stroke={c2}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {[0, 24, 48].map((x) => (
          <polygon key={`u-${x}`} points={`${x},60 ${x + 12},42 ${x + 24},60`} fill={color} fillOpacity="0.9" />
        ))}
        {[-24, 0, 24, 48].map((x) => (
          <polygon
            key={`dn-${x}`}
            points={`${x + 12},42 ${x + 36},42 ${x + 24},60`}
            fill="none"
            stroke={c3}
            strokeWidth="1.5"
          />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={`p-${i}`} cx={4 + i * 8} cy="66" r="2" fill={cream} />
        ))}
      </>
    ),
  };
}

/** Réglages de texture : bords irréguliers (displace), fils (thread), rugosité (grain), taille de fil (thick). */
const TEXTURE: Record<TextileKind, { displace: number; thread: number; grain: number; thick: number }> = {
  NDOP: { displace: 2.2, thread: 0.22, grain: 0.35, thick: 3 },
  ADINKRA: { displace: 3, thread: 0.16, grain: 0.45, thick: 4 },
  TOGHU: { displace: 1.2, thread: 0.3, grain: 0.3, thick: 2.5 },
  KENTE: { displace: 0.8, thread: 0.42, grain: 0.25, thick: 3 },
};

function Textile({ kind, scale = 1 }: { kind: TextileKind; scale?: number }) {
  const uid = useId().replace(/:/g, "");
  const id = `tx-${uid}`;
  const weaveId = `weave-${uid}`;
  const warpId = `warp-${uid}`;
  const grainId = `grain-${uid}`;

  const { color, hue } = TEXTILE_COLORS[kind];
  const { w, h, node } = buildTile(kind, color, hue);
  const t = TEXTURE[kind];
  const half = t.thick / 2;

  return (
    <svg className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse" patternTransform={`scale(${scale})`}>
          {node}
        </pattern>

        <pattern id={weaveId} width={t.thick * 2} height={t.thick * 2} patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width={t.thick} height={t.thick} fill="#000" fillOpacity={t.thread * 0.5} />
          <rect x={t.thick} y={t.thick} width={t.thick} height={t.thick} fill="#000" fillOpacity={t.thread * 0.5} />
          <path
            d={`M0 ${half}H${t.thick * 2}M0 ${t.thick + half}H${t.thick * 2}`}
            stroke="#000"
            strokeOpacity={t.thread}
            strokeWidth={t.thick * 0.3}
            fill="none"
          />
          <path
            d={`M${half} 0V${t.thick * 2}M${t.thick + half} 0V${t.thick * 2}`}
            stroke="#FFF"
            strokeOpacity={t.thread * 0.55}
            strokeWidth={t.thick * 0.25}
            fill="none"
          />
        </pattern>

        <filter id={warpId} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={t.displace} xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id={grainId} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.65" numOctaves="3" seed="7" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.7 0 0 0 -0.6" />
        </filter>
      </defs>

      <g filter={`url(#${warpId})`}>
        <rect x="-12" y="-12" width="120%" height="120%" fill={`url(#${id})`} />
      </g>
      <rect width="100%" height="100%" fill={`url(#${weaveId})`} />
      <rect
        width="100%"
        height="100%"
        fill="#000"
        filter={`url(#${grainId})`}
        opacity={t.grain}
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Carte projet                                                              */
/* -------------------------------------------------------------------------- */

function ProjectCard({
  projet,
  index,
  featured,
  onPreview,
}: {
  projet: Project;
  index: number;
  featured: boolean;
  onPreview: (project: Project) => void;
}) {
  const t = useTranslations("HomePage");
  const reduce = useReducedMotion();
  const textile = CATEGORY_TEXTILE[projet.category];
  const { color } = TEXTILE_COLORS[textile];
  const title = t(`projects.items.${projet.titleKey}.title`);

  return (
    <motion.article
      layout={!reduce}
      initial={{ opacity: 0, y: reduce ? 0 : 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -12 }}
      transition={{ delay: Math.min(index, 3) * 0.1, duration: 0.5 }}
      style={{ "--accent": color } as React.CSSProperties}
      className={`group flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#121526] shadow-xl transition-colors duration-300 hover:border-[var(--accent)] ${
        featured ? "lg:col-span-2 lg:flex-row" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`relative h-56 w-full overflow-hidden bg-black ${
          featured ? "lg:h-auto lg:min-h-[340px] lg:w-[55%]" : ""
        }`}
      >
        <Image
          src={projet.image}
          alt={title}
          fill
          sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className="object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121526]/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg bg-[#0B0D18]/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
          {t(`projects.filters.${projet.category}`)}
        </span>
      </div>

      {/* Lisière de tissu */}
      <div className={`shrink-0 ${featured ? "h-2 lg:h-auto lg:w-2" : "h-2"}`} aria-hidden="true">
        <Textile kind={textile} scale={0.4} />
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col justify-between gap-6 p-6 md:p-8">
        <div className="space-y-4">
          <h3
            className={`font-achiko font-black uppercase leading-tight text-white transition-colors group-hover:text-[var(--accent)] ${
              featured ? "text-3xl" : "text-2xl"
            }`}
          >
            {title}
          </h3>
          <p className="text-sm font-light leading-relaxed text-gray-300">
            {t(`projects.items.${projet.titleKey}.description`)}
          </p>
          <ul className="flex flex-wrap gap-2">
            {projet.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold text-gray-200"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-5">
          <a
            href={projet.projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all hover:gap-3"
            style={{ color }}
          >
            {t("projects.access_grant")}
            <i className="pi pi-arrow-right text-xs" />
          </a>

          <button
            type="button"
            onClick={() => onPreview(projet)}
            className="cursor-pointer rounded-xl border border-white/15 bg-white/5 p-2.5 text-gray-300 transition-all hover:border-[var(--accent)] hover:text-white"
            title={t("projects.quick_preview")}
            aria-label={t("projects.quick_preview")}
          >
            <i className="pi pi-eye text-sm" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const t = useTranslations("HomePage");
  const [activeCategory, setActiveCategory] = useState<"all" | Project["category"]>("all");
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);

  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((p) => p.category === activeCategory);

  // Fermeture au clavier et blocage du scroll quand la fenêtre d'aperçu est ouverte
  useEffect(() => {
    if (!selectedProjectModal) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProjectModal(null);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProjectModal]);

  const filters: Array<{ id: "all" | Project["category"]; label: string }> = [
    { id: "all", label: t("projects.filters.all") },
    { id: "web", label: t("projects.filters.web") },
    { id: "culture", label: t("projects.filters.culture") },
    { id: "design", label: t("projects.filters.design") },
  ];

  const modalTextile = selectedProjectModal ? CATEGORY_TEXTILE[selectedProjectModal.category] : null;
  const modalColor = modalTextile ? TEXTILE_COLORS[modalTextile].color : "#FFC82C";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0D18] font-azurio text-[#F8F9FA]">
      {/* 1. HERO */}
      <Hero />

      
      {/* 5. TÉMOIGNAGES */}
      <TestimonialsSection />

      {/* APERÇU RAPIDE */}
      <AnimatePresence>
        {selectedProjectModal && modalTextile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProjectModal(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl md:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border shadow-2xl"
              style={{ borderColor: modalColor }}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={selectedProjectModal.image}
                  alt={t(`projects.items.${selectedProjectModal.titleKey}.title`)}
                  fill
                  sizes="(min-width: 768px) 672px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D18]/90 to-transparent" />
                <span className="absolute left-5 top-5 rounded-lg bg-[#0B0D18]/85 px-3 py-1.5 text-xs font-bold text-white">
                  {t("projects.modal_title")} {" // "} {selectedProjectModal.id}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProjectModal(null)}
                  aria-label={t("projects.close")}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0D18]/80 text-gray-200 transition-colors hover:text-white"
                >
                  <i className="pi pi-times" />
                </button>
              </div>

              <div className="h-2" aria-hidden="true">
                <Textile kind={modalTextile} scale={0.4} />
              </div>

              <div className="space-y-6 p-6 md:p-8">
                <div className="space-y-3">
                  <h3 id="project-modal-title" className="font-achiko text-2xl font-black uppercase text-white">
                    {t(`projects.items.${selectedProjectModal.titleKey}.title`)}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-gray-200">
                    {t(`projects.items.${selectedProjectModal.titleKey}.description`)}
                  </p>
                </div>

                <div
                  className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-4 text-sm font-bold"
                  style={{ color: modalColor }}
                >
                  <i className="pi pi-bolt mt-0.5" />
                  <span>
                    {t("projects.metrics_label")} : {t(`projects.metrics.${selectedProjectModal.titleKey}`)}
                  </span>
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-white/15 pt-6">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectModal(null)}
                    className="rounded-xl border border-white/25 px-6 py-3 text-xs font-bold uppercase text-white transition-colors hover:bg-white/10"
                  >
                    {t("projects.close")}
                  </button>
                  <a
                    href={selectedProjectModal.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl px-6 py-3 font-achiko text-xs font-bold uppercase tracking-wider text-black hover:shadow-[0_0_20px_rgba(255,200,44,0.4)]"
                    style={{ backgroundColor: modalColor }}
                  >
                    {t("projects.open_live")}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}