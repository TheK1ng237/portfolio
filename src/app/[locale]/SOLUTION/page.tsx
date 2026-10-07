"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import React, { useEffect, useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*  Types & données                                                           */
/* -------------------------------------------------------------------------- */

type Category = "ENGINE" | "PROTOCOL" | "LAB";

interface Solution {
  id: string;
  key: "01" | "02" | "03";
  title: string;
  description: string;
  price: string;
  icon: string;
  features: string[];
  fullDescription: string;
  benefits: string[];
  targetAudience: string;
  category: Category;
}

const fallbackSolutions: Solution[] = [
  {
    id: "01",
    key: "01",
    category: "ENGINE",
    title: "",
    description: "",
    price: "",
    icon: "pi pi-box",
    features: [],
    fullDescription: "",
    benefits: [],
    targetAudience: "",
  },
  {
    id: "02",
    key: "02",
    category: "PROTOCOL",
    title: "",
    description: "",
    price: "",
    icon: "pi pi-shield",
    features: [],
    fullDescription: "",
    benefits: [],
    targetAudience: "",
  },
  {
    id: "03",
    key: "03",
    category: "LAB",
    title: "",
    description: "",
    price: "",
    icon: "pi pi-microchip",
    features: [],
    fullDescription: "",
    benefits: [],
    targetAudience: "",
  },
];

type SolutionApiItem = {
  id?: string | number;
  slug?: string;
  title?: string;
  titleFr?: string;
  titleEn?: string;
  description?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  priceLabel?: string;
  priceLabelFr?: string;
  priceLabelEn?: string;
  icon?: string;
  features?: string[];
  featuresFr?: string[];
  featuresEn?: string[];
  fullDescription?: string;
  fullDescriptionFr?: string;
  fullDescriptionEn?: string;
  benefits?: string[];
  benefitsFr?: string[];
  benefitsEn?: string[];
  targetAudience?: string;
  targetAudienceFr?: string;
  targetAudienceEn?: string;
  category?: Category | string;
};

const mapService = (item: SolutionApiItem, locale: string): Solution => ({
  id: String(item.id ?? item.slug ?? "01"),
  key: "01",
  title: (locale === "en" ? item.titleEn ?? item.titleFr : item.titleFr ?? item.titleEn) ?? item.title ?? "",
  description: (locale === "en" ? item.descriptionEn ?? item.descriptionFr : item.descriptionFr ?? item.descriptionEn) ?? item.description ?? "",
  price: (locale === "en" ? item.priceLabelEn ?? item.priceLabelFr : item.priceLabelFr ?? item.priceLabelEn) ?? item.priceLabel ?? "",
  icon: item.icon ?? "pi pi-box",
  features: locale === "en" ? item.featuresEn ?? item.featuresFr ?? item.features ?? [] : item.featuresFr ?? item.features ?? item.featuresEn ?? [],
  fullDescription: (locale === "en" ? item.fullDescriptionEn ?? item.fullDescriptionFr : item.fullDescriptionFr ?? item.fullDescriptionEn) ?? item.fullDescription ?? "",
  benefits: locale === "en" ? item.benefitsEn ?? item.benefitsFr ?? item.benefits ?? [] : item.benefitsFr ?? item.benefits ?? item.benefitsEn ?? [],
  targetAudience: (locale === "en" ? item.targetAudienceEn ?? item.targetAudienceFr : item.targetAudienceFr ?? item.targetAudienceEn) ?? item.targetAudience ?? "",
  category: item.category === "ENGINE" || item.category === "PROTOCOL" || item.category === "LAB" ? item.category : "ENGINE",
});

/** Chaque catégorie a son tissu : structure (Ndop), système de signes (Adinkra), broderie de fête (Toghu). */
type TextileKind = "NDOP" | "ADINKRA" | "TOGHU";

const CATEGORY_META: Record<Category, { textile: TextileKind; color: string; hue: number }> = {
  ENGINE: { textile: "NDOP", color: "#FFC82C", hue: 46 },
  PROTOCOL: { textile: "ADINKRA", color: "#FF3B56", hue: 352 },
  LAB: { textile: "TOGHU", color: "#FFE57F", hue: 47 },
};

const quoteSteps = [
  { key: "describe" },
  { key: "estimate" },
  { key: "build" },
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
};

function Textile({
  kind,
  color,
  hue,
  scale = 1,
}: {
  kind: TextileKind;
  color: string;
  hue: number;
  scale?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const id = `tx-${uid}`;
  const weaveId = `weave-${uid}`;
  const warpId = `warp-${uid}`;
  const grainId = `grain-${uid}`;

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
/*  Échantillons de tissu (hero)                                              */
/* -------------------------------------------------------------------------- */

function Swatches() {
  const order: Category[] = ["PROTOCOL", "ENGINE", "LAB"];
  const layout = [
    { left: "0%", top: "14%", rotate: -8 },
    { left: "30%", top: "0%", rotate: 2 },
    { left: "60%", top: "18%", rotate: 9 },
  ];

  return (
    <div className="relative mx-auto h-64 w-full max-w-sm md:h-80" aria-hidden="true">
      <div className="absolute inset-6 rounded-full bg-[#FFC82C]/10 blur-3xl" />
      {order.map((cat, i) => {
        const meta = CATEGORY_META[cat];
        return (
          <div
            key={cat}
            className="absolute h-44 w-32 overflow-hidden rounded-md border border-white/20 shadow-2xl md:h-56 md:w-40"
            style={{ left: layout[i].left, top: layout[i].top, transform: `rotate(${layout[i].rotate}deg)` }}
          >
            <Textile kind={meta.textile} color={meta.color} hue={meta.hue} />
            <div className="pointer-events-none absolute inset-1.5 rounded-sm border border-dashed border-white/40" />
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ligne de solution                                                         */
/* -------------------------------------------------------------------------- */

function SolutionRow({
  solution,
  index,
  onOpen,
}: {
  solution: Solution;
  index: number;
  onOpen: (solution: Solution) => void;
}) {
  const meta = CATEGORY_META[solution.category];
  const reduce = useReducedMotion();
  const t = useTranslations("SolutionPage");

  return (
    <motion.article
      layout={!reduce}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -12 }}
      transition={{ delay: Math.min(index, 4) * 0.08, duration: 0.45 }}
      style={{ "--accent": meta.color } as React.CSSProperties}
      className="group glass-card grid overflow-hidden rounded-3xl border border-white/15 shadow-xl transition-colors duration-300 hover:border-[var(--accent)] md:grid-cols-[150px_1fr_270px]"
    >
      {/* Bande de tissu */}
      <div className="relative h-28 overflow-hidden md:h-auto">
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none">
          <Textile kind={meta.textile} color={meta.color} hue={meta.hue} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0D18]/50 md:bg-gradient-to-r md:from-transparent md:to-[#0B0D18]/70" />
        <span className="absolute left-3 top-3 rounded-md bg-[#0B0D18]/85 px-2 py-0.5 text-xs font-bold text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-[#0B0D18]/90 shadow-lg"
            style={{ borderColor: meta.color }}
          >
            <i className={`${solution.icon} text-2xl`} style={{ color: meta.color }} />
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="space-y-4 p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden="true" />
          {t(`categories.${solution.category.toLowerCase()}`)}
        </div>

        <h3 className="font-achiko text-xl font-black uppercase text-white transition-colors group-hover:text-[var(--accent)] md:text-2xl">
          {solution.title}
        </h3>

        <p className="max-w-2xl text-sm font-light leading-relaxed text-gray-300">{solution.description}</p>

        <ul className="grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2">
          {solution.features.slice(0, 4).map((feature, idx) => (
            <li key={`${solution.id}-${idx}`} className="flex items-start gap-2 text-xs font-bold text-gray-200">
              <i className="pi pi-check mt-0.5 text-[10px]" style={{ color: meta.color }} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tarification */}
      <div className="flex flex-col justify-between gap-6 border-t border-white/10 bg-black/20 p-6 md:border-l md:border-t-0 md:p-8">
        <div>
          <span className="text-xs font-bold text-gray-400">{t("labels.pricing")}</span>
          <p className="mt-1 font-achiko text-2xl font-black" style={{ color: meta.color }}>
            {solution.price}
          </p>
          <p className="mt-2 text-xs font-light leading-relaxed text-gray-400">{solution.targetAudience}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/CONTACT"
            className="rounded-xl px-5 py-3 text-center font-achiko text-xs font-bold uppercase tracking-wider text-black transition-shadow hover:shadow-[0_0_24px_rgba(255,200,44,0.35)]"
            style={{ backgroundColor: meta.color }}
          >
            {t("actions.request_quote")}
          </Link>
          <button
            type="button"
            onClick={() => onOpen(solution)}
            className="rounded-xl border border-white/20 px-5 py-3 font-achiko text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {t("actions.view_details")}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Solutions() {
  const t = useTranslations("SolutionPage");
  const locale = useLocale();
  const localizedFallbackSolutions = useMemo(
    () => fallbackSolutions.map((solution) => ({
      ...solution,
      title: t(`offers.${solution.key}.title`),
      description: t(`offers.${solution.key}.description`),
      price: t(`offers.${solution.key}.price`),
      features: t.raw(`offers.${solution.key}.features`) as string[],
      fullDescription: t(`offers.${solution.key}.full_description`),
      benefits: t.raw(`offers.${solution.key}.benefits`) as string[],
      targetAudience: t(`offers.${solution.key}.target_audience`),
    })),
    [t],
  );
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>(localizedFallbackSolutions);
  const [filter, setFilter] = useState<"ALL" | Category>("ALL");

  useEffect(() => {
    let cancelled = false;
    const loadServices = async () => {
      try {
        const data = await apiFetch<{ items: SolutionApiItem[] }>("/public/services", { locale, method: "GET" });
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setSolutions(data.items.map((item) => mapService(item, locale)));
        }
      } catch {
        if (!cancelled) setSolutions(localizedFallbackSolutions);
      }
    };
    void loadServices();
    return () => {
      cancelled = true;
    };
  }, [locale, localizedFallbackSolutions]);

  // Fermeture au clavier et blocage du scroll quand la fenêtre de détail est ouverte
  useEffect(() => {
    if (!selectedSolution) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedSolution(null);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedSolution]);

  const presentCategories = (Object.keys(CATEGORY_META) as Category[]).filter((cat) =>
    solutions.some((s) => s.category === cat)
  );
  const visible = filter === "ALL" ? solutions : solutions.filter((s) => s.category === filter);
  const selectedMeta = selectedSolution ? CATEGORY_META[selectedSolution.category] : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0D18] pb-24 pt-28 font-azurio text-[#F8F9FA]">
      <div className="relative z-10 mx-auto max-w-7xl space-y-24 px-6">
        {/* HERO */}
        <section className="grid items-center gap-12 md:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-achiko text-4xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-7xl"
            >
              {t("content.hero_title_prefix")} <span className="text-[#FFC82C]">{t("content.hero_title_highlight")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl border-l-4 border-[#FFC82C] pl-6 text-base font-light leading-relaxed text-gray-200"
            >
              {t("content.hero_description")}
            </motion.p>
          </div>

          <Swatches />
        </section>

        {/* OFFRES */}
        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
            <h2 className="font-achiko text-2xl font-black uppercase tracking-tight text-white md:text-4xl">
              {t("content.offers_title_prefix")} <span className="text-[#FFC82C]">{t("content.offers_title_highlight")}</span>
            </h2>

            <div role="tablist" aria-label={t("content.filter_offers")} className="flex flex-wrap gap-2">
              {(["ALL", ...presentCategories] as Array<"ALL" | Category>).map((cat) => {
                const active = filter === cat;
                const label = cat === "ALL" ? t("content.all_categories") : t(`categories.${cat.toLowerCase()}`);
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(cat)}
                    className={`relative rounded-lg border px-4 py-2 text-xs font-bold transition-colors ${
                      active
                        ? "border-[#FFC82C] text-black"
                        : "border-white/20 text-gray-200 hover:border-[#FFC82C] hover:text-[#FFC82C]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="solutions-tab"
                        className="absolute inset-0 rounded-lg bg-[#FFC82C]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {visible.map((solution, index) => (
                <SolutionRow key={solution.id} solution={solution} index={index} onOpen={setSelectedSolution} />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* PROCESSUS DE DEVIS */}
        <section className="space-y-12 border-t border-white/10 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-achiko text-2xl font-black uppercase tracking-tight text-white md:text-4xl">
              {t("content.process_title_prefix")} <span className="text-[#FFC82C]">{t("content.process_title_highlight")}</span>
            </h2>
          </motion.div>

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            <div
              className="absolute left-6 right-6 top-6 hidden border-t-2 border-dashed border-[#FFC82C]/40 md:block"
              aria-hidden="true"
            />
            {quoteSteps.map((step, i) => (
              <motion.li
                key={step.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative space-y-3"
              >
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#FFC82C] bg-[#0B0D18] font-achiko text-lg font-black text-[#FFC82C]">
                  {i + 1}
                </span>
                <h3 className="font-achiko text-lg font-black uppercase text-white">{t(`process.${step.key}.title`)}</h3>
                <p className="max-w-xs text-sm font-light leading-relaxed text-gray-300">{t(`process.${step.key}.description`)}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-[#FFC82C] shadow-2xl">
          <div className="absolute inset-0 opacity-50">
            <Textile kind="NDOP" color="#FFC82C" hue={46} scale={1.4} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D18] via-[#0B0D18]/85 to-[#0B0D18]/40" />

          <div className="relative grid items-center gap-8 p-10 md:grid-cols-[1.5fr_1fr] md:p-14">
            <div className="space-y-4">
              <h2 className="font-achiko text-2xl font-black uppercase tracking-tight text-white md:text-4xl">
                {t("content.custom_title_prefix")} <span className="text-[#FFC82C]">{t("content.custom_title_highlight")}</span>
              </h2>
              <p className="max-w-xl text-base font-light leading-relaxed text-gray-200">
                {t("content.custom_description")}
              </p>
            </div>
            <div className="md:justify-self-end">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link
                  href="/CONTACT"
                  className="inline-block rounded-xl bg-[#FFC82C] px-10 py-4 font-achiko text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_30px_rgba(255,200,44,0.4)]"
                >
                  {t("content.custom_cta")}
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* DÉTAIL */}
        <AnimatePresence>
          {selectedSolution && selectedMeta && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSolution(null)}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl md:p-6"
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="solution-title"
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                onClick={(event) => event.stopPropagation()}
                className="glass-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border shadow-2xl"
                style={{ borderColor: selectedMeta.color }}
              >
                <div className="relative h-28 overflow-hidden">
                  <Textile kind={selectedMeta.textile} color={selectedMeta.color} hue={selectedMeta.hue} scale={1.2} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D18] to-transparent" />
                  <button
                    type="button"
                    onClick={() => setSelectedSolution(null)}
                    aria-label={t("actions.close")}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0D18]/80 text-gray-200 transition-colors hover:text-white"
                  >
                    <i className="pi pi-times" />
                  </button>
                </div>

                <div className="space-y-6 p-6 md:p-8">
                  <div className="space-y-2">
                    <span className="text-xs font-bold" style={{ color: selectedMeta.color }}>
                      {t(`categories.${selectedSolution.category.toLowerCase()}`)}
                    </span>
                    <h3 id="solution-title" className="font-achiko text-2xl font-black uppercase text-white md:text-3xl">
                      {selectedSolution.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-gray-200">{selectedSolution.fullDescription}</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase" style={{ color: selectedMeta.color }}>
                        {t("modal.benefits_title")}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-200">
                        {selectedSolution.benefits.map((benefit, idx) => (
                          <li key={`${selectedSolution.id}-b-${idx}`} className="flex items-start gap-2">
                            <i className="pi pi-check mt-1 text-[10px]" style={{ color: selectedMeta.color }} />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase" style={{ color: selectedMeta.color }}>
                        {t("modal.included_title")}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-200">
                        {selectedSolution.features.map((feature, idx) => (
                          <li key={`${selectedSolution.id}-f-${idx}`} className="flex items-start gap-2">
                            <i className="pi pi-circle-fill mt-1.5 text-[5px]" style={{ color: selectedMeta.color }} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm font-light text-gray-300">
                    <strong className="font-bold text-white">{t("modal.audience_label")}</strong> {selectedSolution.targetAudience}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
                    <span className="font-achiko text-xl font-black" style={{ color: selectedMeta.color }}>
                      {selectedSolution.price}
                    </span>
                    <Link
                      href="/CONTACT"
                      className="rounded-xl px-6 py-3 font-achiko text-xs font-bold uppercase tracking-wider text-black hover:shadow-[0_0_20px_rgba(255,200,44,0.4)]"
                      style={{ backgroundColor: selectedMeta.color }}
                    >
                      {t("actions.request_quote")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}