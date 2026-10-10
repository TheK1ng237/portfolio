"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import React, { useEffect, useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";

/**
 * Page Solutions : « l'atelier du tailleur ».
 * Une offre = un coupon de tissu enroulé sur son rouleau : bordures tissées en haut et en bas,
 * champ uni pour le texte, bord droit cranté aux ciseaux, étiquette de prix cousue.
 * « Dérouler » ouvre le détail à l'intérieur du coupon (plus de fenêtre modale).
 * Le devis est un mètre ruban : on prend les mesures, on coupe, on coud.
 */

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

const emptyOffer = {
  title: "",
  description: "",
  price: "",
  icon: "",
  features: [] as string[],
  fullDescription: "",
  benefits: [] as string[],
  targetAudience: "",
};

const fallbackSolutions: Solution[] = [
  { id: "01", key: "01", category: "ENGINE", ...emptyOffer, icon: "pi pi-box" },
  { id: "02", key: "02", category: "PROTOCOL", ...emptyOffer, icon: "pi pi-shield" },
  { id: "03", key: "03", category: "LAB", ...emptyOffer, icon: "pi pi-microchip" },
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
  ENGINE: { textile: "NDOP", color: "#EDE6D0", hue: 46 },
  PROTOCOL: { textile: "ADINKRA", color: "#FF3B56", hue: 352 },
  LAB: { textile: "TOGHU", color: "#FFE57F", hue: 47 },
};

const quoteSteps = [{ key: "describe" }, { key: "estimate" }, { key: "build" }];

/* -------------------------------------------------------------------------- */
/*  Textiles                                                                  */
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

function tileSvg(kind: TextileKind, color: string, hue: number): { w: number; h: number; bg: string; body: string } {
  const cream = "#F4EFE0";
  const dots = (pts: number[][], r: number, fill: string) =>
    pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join("");

  if (kind === "NDOP") {
    return {
      w: 64,
      h: 64,
      bg: "#0E1747",
      body:
        `<rect width="64" height="64" fill="#0E1747"/>` +
        `<polygon points="32,4 60,32 32,60 4,32" fill="none" stroke="${color}" stroke-width="2"/>` +
        `<polygon points="32,15 49,32 32,49 15,32" fill="none" stroke="${cream}" stroke-width="1.5"/>` +
        `<polygon points="32,26 38,32 32,38 26,32" fill="${color}"/>` +
        `<path d="M32 4V15M60 32H49M32 60V49M4 32H15" stroke="${cream}" stroke-width="1.5" fill="none"/>` +
        `<path d="M0 12L12 0M52 0L64 12M64 52L52 64M12 64L0 52" stroke="${color}" stroke-width="2" fill="none"/>` +
        dots([[32, 4], [60, 32], [32, 60], [4, 32]], 2.5, cream) +
        dots([[0, 0], [64, 0], [0, 64], [64, 64]], 3, color),
    };
  }

  if (kind === "ADINKRA") {
    return {
      w: 120,
      h: 120,
      bg: "#1A0F0C",
      body:
        `<rect width="120" height="120" fill="#1A0F0C"/>` +
        `<path d="M0 0H120M0 60H120M0 120H120M0 0V120M60 0V120M120 0V120" stroke="${color}" stroke-opacity="0.4" stroke-width="2" fill="none"/>` +
        dots([0, 60, 120].flatMap((x) => [0, 60, 120].map((y) => [x, y])), 2.5, color) +
        `<g fill="none" stroke="${color}" stroke-width="2.5"><circle cx="30" cy="30" r="19"/><circle cx="30" cy="30" r="12"/><circle cx="30" cy="30" r="5" fill="${color}"/></g>` +
        `<g fill="none" stroke="${cream}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${spiralPath(82, 30, 8, 1.75, 1)}"/><path d="${spiralPath(98, 30, 8, 1.75, -1)}"/><path d="M76 46H104"/></g>` +
        `<g fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 106C10 92 12 72 24 72C28 72 30 76 30 79C30 76 32 72 36 72C48 72 50 92 30 106Z"/><path d="${spiralPath(30, 87, 7, 1.75, 1)}"/></g>` +
        `<path d="M76 74L104 82L76 90L104 98L76 106" fill="none" stroke="${cream}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    };
  }

  const c2 = hsl(hue + 130);
  const c3 = hsl(hue + 250);
  return {
    w: 72,
    h: 72,
    bg: "#14070A",
    body:
      `<rect width="72" height="72" fill="#14070A"/>` +
      [12, 36, 60]
        .map(
          (cx) =>
            `<polygon points="${cx},2 ${cx + 12},12 ${cx},22 ${cx - 12},12" fill="none" stroke="${color}" stroke-width="2"/>` +
            `<polygon points="${cx},7 ${cx + 6},12 ${cx},17 ${cx - 6},12" fill="${c3}"/>`,
        )
        .join("") +
      `<path d="M0 34L9 28L18 34L27 28L36 34L45 28L54 34L63 28L72 34" fill="none" stroke="${c2}" stroke-width="3" stroke-linejoin="round"/>` +
      [0, 24, 48].map((x) => `<polygon points="${x},60 ${x + 12},42 ${x + 24},60" fill="${color}" fill-opacity="0.9"/>`).join("") +
      [-24, 0, 24, 48].map((x) => `<polygon points="${x + 12},42 ${x + 36},42 ${x + 24},60" fill="none" stroke="${c3}" stroke-width="1.5"/>`).join("") +
      Array.from({ length: 9 }, (_, i) => `<circle cx="${4 + i * 8}" cy="66" r="2" fill="${cream}"/>`).join(""),
  };
}

const TEXTURE: Record<TextileKind, { thread: number; grain: number; thick: number }> = {
  NDOP: { thread: 0.22, grain: 0.35, thick: 3 },
  ADINKRA: { thread: 0.16, grain: 0.45, thick: 4 },
  TOGHU: { thread: 0.3, grain: 0.3, thick: 2.5 },
};

/** Motif répété + tissage + grain. Le filtre de grain ne tourne que sur une petite tuile. */
function Textile({ kind, color, hue, scale = 1, plain = false }: { kind: TextileKind; color: string; hue: number; scale?: number; plain?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const { w, h, body } = tileSvg(kind, color, hue);
  const t = TEXTURE[kind];
  const half = t.thick / 2;

  return (
    <svg className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`p-${uid}`} width={w} height={h} patternUnits="userSpaceOnUse" patternTransform={`scale(${scale})`}>
          <g dangerouslySetInnerHTML={{ __html: body }} />
        </pattern>
        {!plain && (
          <>
            <pattern id={`w-${uid}`} width={t.thick * 2} height={t.thick * 2} patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width={t.thick} height={t.thick} fill="#000" fillOpacity={t.thread * 0.5} />
              <rect x={t.thick} y={t.thick} width={t.thick} height={t.thick} fill="#000" fillOpacity={t.thread * 0.5} />
              <path d={`M0 ${half}H${t.thick * 2}M0 ${t.thick + half}H${t.thick * 2}`} stroke="#000" strokeOpacity={t.thread} strokeWidth={t.thick * 0.3} fill="none" />
              <path d={`M${half} 0V${t.thick * 2}M${t.thick + half} 0V${t.thick * 2}`} stroke="#FFF" strokeOpacity={t.thread * 0.55} strokeWidth={t.thick * 0.25} fill="none" />
            </pattern>
            <filter id={`gf-${uid}`} filterUnits="userSpaceOnUse" x="0" y="0" width="160" height="160">
              <feTurbulence type="fractalNoise" baseFrequency="0.9 0.65" numOctaves="3" seed="7" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.7 0 0 0 -0.6" />
            </filter>
            <pattern id={`g-${uid}`} width="160" height="160" patternUnits="userSpaceOnUse">
              <rect width="160" height="160" fill="#000" filter={`url(#gf-${uid})`} />
            </pattern>
          </>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#p-${uid})`} />
      {!plain && <rect width="100%" height="100%" fill={`url(#w-${uid})`} />}
      {!plain && <rect width="100%" height="100%" fill={`url(#g-${uid})`} opacity={t.grain * 0.6} style={{ mixBlendMode: "multiply" }} />}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pièces de l'atelier : mètre ruban, rouleau, bord cranté, épingle           */
/* -------------------------------------------------------------------------- */

/** Mètre ruban : 1 unité = 1 cm, graduation tous les 5 et 10 cm. */
function Tape({ className = "" }: { className?: string }) {
  const cm = Array.from({ length: 120 }, (_, i) => i);
  return (
    <svg viewBox="0 0 1200 48" preserveAspectRatio="xMinYMid slice" aria-hidden="true" focusable="false" className={className}>
      <rect width="1200" height="48" fill="#F2DC9B" />
      <rect width="1200" height="3" fill="#C9A650" />
      <rect y="45" width="1200" height="3" fill="#C9A650" />
      {cm.map((i) => {
        const len = i % 10 === 0 ? 24 : i % 5 === 0 ? 16 : 9;
        return <line key={i} x1={i * 10 + 0.5} x2={i * 10 + 0.5} y1="3" y2={3 + len} stroke="#141A3F" strokeWidth={i % 10 === 0 ? 2 : 1} />;
      })}
      {cm
        .filter((i) => i % 10 === 0)
        .map((i) => (
          <text key={i} x={i * 10 + 5} y="40" fontSize="13" fontWeight="700" fill="#141A3F" fontFamily="system-ui, sans-serif">
            {i}
          </text>
        ))}
    </svg>
  );
}

/** Bout d'un rouleau de tissu : les couches enroulées en spirale, le tube de carton au centre. */
function Roll({ kind, color, hue }: { kind: TextileKind; color: string; hue: number }) {
  const uid = useId().replace(/:/g, "");
  const { bg } = tileSvg(kind, color, hue);
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" className="h-28 w-28 drop-shadow-[6px_8px_8px_rgba(0,0,0,.5)]">
      <defs>
        <radialGradient id={`rs-${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill={bg} />
      <path d={spiralPath(60, 60, 54, 6, 1)} fill="none" stroke={color} strokeOpacity="0.55" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="11" fill="#C9A06B" stroke="#7A5A33" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="5" fill="#0B0D18" />
      <circle cx="60" cy="60" r="58" fill={`url(#rs-${uid})`} />
      <circle cx="60" cy="60" r="58" fill="none" stroke="#fff" strokeOpacity="0.25" />
    </svg>
  );
}

/** Bord droit cranté aux ciseaux : des dents de la couleur du fond de page. */
function Pinked() {
  const uid = useId().replace(/:/g, "");
  return (
    <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute right-0 top-0 h-full w-3">
      <defs>
        <pattern id={`pk-${uid}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0L0 6L12 12Z" fill="#0B0D18" />
        </pattern>
      </defs>
      <rect width="12" height="100%" fill={`url(#pk-${uid})`} />
    </svg>
  );
}

/** Épingle en bois (même que sur la page Projets). */
function Pin({ size = 24 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" style={{ filter: "drop-shadow(2px 4px 2px rgba(0,0,0,.55))" }}>
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

const STITCH = { outline: "2px dashed rgba(233,216,166,.75)", outlineOffset: "-5px" } as const;

/* -------------------------------------------------------------------------- */
/*  Un coupon de tissu = une offre                                            */
/* -------------------------------------------------------------------------- */

function Coupon({
  solution,
  open,
  onToggle,
  reduce,
}: {
  solution: Solution;
  open: boolean;
  onToggle: () => void;
  reduce: boolean | null;
}) {
  const t = useTranslations("SolutionPage");
  const meta = CATEGORY_META[solution.category];
  const { bg } = tileSvg(meta.textile, meta.color, meta.hue);
  const panelId = `details-${solution.id}`;
  const btn =
    "rounded-[3px] px-5 py-3 text-center text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C]";

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
      className="relative flex items-start"
    >
      <div className="relative z-10 hidden shrink-0 md:block md:-mr-14">
        <Roll kind={meta.textile} color={meta.color} hue={meta.hue} />
      </div>

      <article aria-labelledby={`offer-${solution.id}`} className="relative min-w-0 flex-1 shadow-[0_16px_30px_rgba(0,0,0,.45)]" style={{ background: bg }}>
        <div className="h-7 overflow-hidden">
          <Textile kind={meta.textile} color={meta.color} hue={meta.hue} scale={0.6} />
        </div>

        <div className="px-6 pb-14 pt-7 text-[#F4EBD0] md:pl-20 md:pr-12" style={STITCH}>
          <p className="text-sm" style={{ color: meta.color }}>
            {t(`categories.${solution.category.toLowerCase()}`)}
          </p>
          <h3 id={`offer-${solution.id}`} className="mt-1 max-w-2xl font-achiko text-2xl font-black leading-tight md:text-3xl">
            {solution.title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-[#F4EBD0]/85">{solution.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/CONTACT" className={btn} style={{ background: meta.color, color: "#141A3F" }}>
              {t("actions.request_quote")}
            </Link>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={onToggle}
              className={`${btn} border border-[#E9D8A6]/60 text-[#F4EBD0] hover:border-[#E9D8A6]`}
            >
              {open ? t("actions.hide_details") : t("actions.view_details")}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                key="details"
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-8 space-y-6 border-t-2 border-dashed border-[#E9D8A6]/40 pt-6">
                  <p className="max-w-2xl text-sm font-light leading-relaxed text-[#F4EBD0]/90">{solution.fullDescription}</p>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: meta.color }}>
                        {t("modal.benefits_title")}
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm">
                        {solution.benefits.map((b, i) => (
                          <li key={`${solution.id}-b-${i}`} className="flex gap-3">
                            <span aria-hidden="true" className="font-bold" style={{ color: meta.color }}>
                              ×
                            </span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: meta.color }}>
                        {t("modal.included_title")}
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm">
                        {solution.features.map((f, i) => (
                          <li key={`${solution.id}-f-${i}`} className="flex gap-3">
                            <span aria-hidden="true" className="font-bold" style={{ color: meta.color }}>
                              ×
                            </span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="text-sm text-[#F4EBD0]/85">
                    <strong className="font-bold text-[#F4EBD0]">{t("modal.audience_label")}</strong> {solution.targetAudience}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-7 overflow-hidden">
          <Textile kind={meta.textile} color={meta.color} hue={meta.hue} scale={0.6} />
        </div>

        <Pinked />

        {/* étiquette de prix, cousue à la raphia */}
        <div
          className="absolute -bottom-5 right-8 z-10 -rotate-2 rounded-[3px] px-5 pb-2.5 pt-4 shadow-[0_8px_14px_rgba(0,0,0,.45)]"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0 2px, transparent 2px 4px), #2B3A8C",
            ...STITCH,
          }}
        >
          <span aria-hidden="true" className="absolute left-1/2 top-1 -translate-x-1/2">
            <Pin size={14} />
          </span>
          <span className="block text-xs text-[#E9D8A6]/85">{t("labels.pricing")}</span>
          <span className="block font-achiko text-xl font-black text-[#F4EBD0]">{solution.price}</span>
        </div>
      </article>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Solutions() {
  const t = useTranslations("SolutionPage");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const localizedFallbackSolutions = useMemo(
    () =>
      fallbackSolutions.map((solution) => ({
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
  const [solutions, setSolutions] = useState<Solution[]>(localizedFallbackSolutions);
  const [filter, setFilter] = useState<"ALL" | Category>("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

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

  const presentCategories = (Object.keys(CATEGORY_META) as Category[]).filter((cat) => solutions.some((s) => s.category === cat));
  const visible = filter === "ALL" ? solutions : solutions.filter((s) => s.category === filter);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0B0D18] pb-24 pt-28 font-azurio text-[#F8F9FA]">
      <div className="mx-auto max-w-6xl space-y-24 px-6">
        {/* ENTRÉE : le titre, puis le mètre ruban qui se déroule une fois */}
        <header>
          <h1 className="max-w-3xl font-achiko text-4xl font-black leading-[1.05] text-white md:text-6xl">
            {t("content.hero_title_prefix")} {t("content.hero_title_highlight")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-gray-200">{t("content.hero_description")}</p>

          <motion.div
            className="mt-12 overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,.4)]"
            initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tape className="block h-10 w-full sm:h-12" />
          </motion.div>
        </header>

        {/* OFFRES */}
        <section aria-labelledby="offers-title" className="space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="offers-title" className="font-achiko text-3xl font-black text-white md:text-4xl">
              {t("content.offers_title_prefix")} {t("content.offers_title_highlight")}
            </h2>

            <div role="group" aria-label={t("content.filter_offers")} className="flex flex-wrap gap-3">
              {(["ALL", ...presentCategories] as Array<"ALL" | Category>).map((cat) => {
                const active = filter === cat;
                const label = cat === "ALL" ? t("content.all_categories") : t(`categories.${cat.toLowerCase()}`);
                const m = cat === "ALL" ? null : CATEGORY_META[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(cat)}
                    className={`flex items-center gap-2 rounded-[3px] px-4 py-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C] ${
                      active ? "bg-[#FFC82C] text-[#141A3F]" : "bg-[#2B3A8C] text-[#F4EBD0] hover:bg-[#3446A8]"
                    }`}
                    style={active ? undefined : STITCH}
                  >
                    {m && (
                      <span className="block size-5 overflow-hidden rounded-[2px] ring-1 ring-white/40">
                        <Textile kind={m.textile} color={m.color} hue={m.hue} scale={0.25} plain />
                      </span>
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="space-y-14 pb-6">
            <AnimatePresence mode="popLayout">
              {visible.map((solution) => (
                <Coupon
                  key={solution.id}
                  solution={solution}
                  reduce={reduce}
                  open={openId === solution.id}
                  onToggle={() => setOpenId(openId === solution.id ? null : solution.id)}
                />
              ))}
            </AnimatePresence>
          </ul>
        </section>

        {/* DEVIS : un mètre ruban, trois étapes épinglées */}
        <section aria-labelledby="process-title" className="space-y-10">
          <h2 id="process-title" className="font-achiko text-3xl font-black text-white md:text-4xl">
            {t("content.process_title_prefix")} {t("content.process_title_highlight")}
          </h2>

          <div>
            <Tape className="block h-10 w-full shadow-[0_8px_16px_rgba(0,0,0,.4)]" />
            <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
              {quoteSteps.map((step, i) => (
                <li key={step.key} className="relative pt-9">
                  <span className="absolute left-5 top-0 -translate-y-1/2">
                    <Pin size={26} />
                  </span>
                  <span aria-hidden="true" className="absolute left-[31px] top-3 h-6 border-l-2 border-dashed border-[#E9D8A6]/60" />
                  <h3 className="font-achiko text-xl font-black text-white">
                    <span className="mr-2 text-[#E9D8A6]">{i + 1}.</span>
                    {t(`process.${step.key}.title`)}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-gray-300">{t(`process.${step.key}.description`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SUR MESURE */}
        <section aria-labelledby="custom-title">
          <div className="mb-10 h-7 overflow-hidden">
            <Textile kind="NDOP" color="#EDE6D0" hue={46} scale={0.6} />
          </div>
          <h2 id="custom-title" className="max-w-3xl font-achiko text-3xl font-black text-white md:text-5xl">
            {t("content.custom_title_prefix")} {t("content.custom_title_highlight")}
          </h2>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-200">{t("content.custom_description")}</p>
          <Link
            href="/CONTACT"
            className="mt-8 inline-block rounded-xl bg-[#FFC82C] px-9 py-4 text-sm font-bold text-[#141A3F] transition-colors hover:bg-[#ffd75e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("content.custom_cta")}
          </Link>
        </section>
      </div>
    </div>
  );
}