"use client";

import React, { useEffect, useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Page Culture : « le métier à tisser ».
 * La page est une étoffe : chaque motif est une grande bande tissée, avec une réserve unie
 * pour le texte (comme sur un vrai tissu). Le Ndebele est de la peinture murale, pas du tissu :
 * il est traité comme un pan de mur. Le laboratoire exporte du CSS et du SVG réellement utilisables.
 */

/* -------------------------------------------------------------------------- */
/*  Données                                                                   */
/* -------------------------------------------------------------------------- */

type PatternKind =
  | "NDOP_GEOMETRY"
  | "ADINKRA_SYMBOLS"
  | "TOGHU_CONTRAST"
  | "KENTE_WEAVE"
  | "BOGOLAN_MUDCLOTH"
  | "NDEBELE_WALL";

interface Pillar {
  code: PatternKind;
  key: "ndop" | "adinkra" | "toghu" | "kente" | "bogolan" | "ndebele";
  color: string;
  hue: number;
  medium: "cloth" | "wall";
  reserve: "paper" | "ink"; // couleur de la réserve unie qui porte le texte
  scale: number; // taille du motif dans la bande
}

const culturalPillars: Pillar[] = [
  { code: "NDOP_GEOMETRY", key: "ndop", color: "#EDE6D0", hue: 46, medium: "cloth", reserve: "paper", scale: 1.6 },
  { code: "ADINKRA_SYMBOLS", key: "adinkra", color: "#FF3B56", hue: 352, medium: "cloth", reserve: "paper", scale: 1.1 },
  { code: "TOGHU_CONTRAST", key: "toghu", color: "#FFE57F", hue: 47, medium: "cloth", reserve: "paper", scale: 1.5 },
  { code: "KENTE_WEAVE", key: "kente", color: "#FFB300", hue: 44, medium: "cloth", reserve: "ink", scale: 1.8 },
  { code: "BOGOLAN_MUDCLOTH", key: "bogolan", color: "#D9A066", hue: 22, medium: "cloth", reserve: "ink", scale: 1.5 },
  { code: "NDEBELE_WALL", key: "ndebele", color: "#4FC3F7", hue: 199, medium: "wall", reserve: "ink", scale: 1.3 },
];

const processSteps = [{ key: "observe" }, { key: "abstract" }, { key: "implement" }];

const RESERVE = {
  paper: { bg: "#E9D8A6", fg: "#141A3F", stitch: "rgba(20,26,63,.55)", btn: "#2B3A8C", btnFg: "#F4EBD0" },
  ink: { bg: "#141A3F", fg: "#F4EBD0", stitch: "rgba(233,216,166,.7)", btn: "#FFC82C", btnFg: "#141A3F" },
} as const;

/* -------------------------------------------------------------------------- */
/*  Motifs : chaque tuile est une chaîne SVG (pour pouvoir l'exporter telle quelle) */
/* -------------------------------------------------------------------------- */

const hsl = (h: number, s = 100, l = 60) => `hsl(${((h % 360) + 360) % 360} ${s}% ${l}%)`;

/** Spirale (de l'extérieur vers le centre), utilisée pour Dwennimmen / Sankofa. */
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

interface Tile {
  w: number;
  h: number;
  bg: string;
  body: string;
}

function tileSvg(kind: PatternKind, color: string, hue: number): Tile {
  const cream = "#F4EFE0";
  const circles = (pts: number[][], r: number, fill: string) =>
    pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join("");

  switch (kind) {
    /* NDOP : treillis de losanges, indigo et réserve */
    case "NDOP_GEOMETRY":
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
          circles([[32, 4], [60, 32], [32, 60], [4, 32]], 2.5, cream) +
          circles([[0, 0], [64, 0], [0, 64], [64, 64]], 3, color),
      };

    /* ADINKRA : grille de symboles estampés */
    case "ADINKRA_SYMBOLS":
      return {
        w: 120,
        h: 120,
        bg: "#1A0F0C",
        body:
          `<rect width="120" height="120" fill="#1A0F0C"/>` +
          `<path d="M0 0H120M0 60H120M0 120H120M0 0V120M60 0V120M120 0V120" stroke="${color}" stroke-opacity="0.4" stroke-width="2" fill="none"/>` +
          circles([0, 60, 120].flatMap((x) => [0, 60, 120].map((y) => [x, y])), 2.5, color) +
          /* Adinkrahene : cercles concentriques */
          `<g fill="none" stroke="${color}" stroke-width="2.5"><circle cx="30" cy="30" r="19"/><circle cx="30" cy="30" r="12"/><circle cx="30" cy="30" r="5" fill="${color}"/></g>` +
          /* Dwennimmen : cornes de bélier */
          `<g fill="none" stroke="${cream}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${spiralPath(82, 30, 8, 1.75, 1)}"/><path d="${spiralPath(98, 30, 8, 1.75, -1)}"/><path d="M76 46H104"/></g>` +
          /* Sankofa : cœur et spirale */
          `<g fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 106C10 92 12 72 24 72C28 72 30 76 30 79C30 76 32 72 36 72C48 72 50 92 30 106Z"/><path d="${spiralPath(30, 87, 7, 1.75, 1)}"/></g>` +
          /* Nkyinkyim : zigzag de l'adaptabilité */
          `<path d="M76 74L104 82L76 90L104 98L76 106" fill="none" stroke="${cream}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
      };

    /* TOGHU : bandes brodées sur fond sombre */
    case "TOGHU_CONTRAST": {
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

    /* KENTE : bandes tissées et blocs de trame */
    case "KENTE_WEAVE": {
      const gold = hsl(hue, 100, 50);
      const red = "#E4283E";
      const green = "#0E8F4F";
      const black = "#111111";
      const bands = [
        { x: 0, w: 12, fill: gold, block: black },
        { x: 12, w: 6, fill: black, block: "" },
        { x: 18, w: 12, fill: green, block: gold },
        { x: 30, w: 6, fill: black, block: "" },
        { x: 36, w: 12, fill: red, block: black },
        { x: 48, w: 6, fill: black, block: "" },
        { x: 54, w: 6, fill: gold, block: "" },
      ];
      return {
        w: 60,
        h: 60,
        bg: black,
        body:
          bands.map((b) => `<rect x="${b.x}" y="0" width="${b.w}" height="60" fill="${b.fill}"/>`).join("") +
          bands
            .filter((b) => b.block)
            .map(
              (b) =>
                `<rect x="${b.x + 3}" y="6" width="6" height="6" fill="${b.block}"/>` +
                `<rect x="${b.x + 3}" y="40" width="6" height="6" fill="${b.block}"/>` +
                `<rect x="${b.x + 3}" y="14" width="6" height="6" fill="${b.block}" fill-opacity="0.45"/>` +
                `<rect x="${b.x + 3}" y="48" width="6" height="6" fill="${b.block}" fill-opacity="0.45"/>`,
            )
            .join("") +
          `<rect y="26" width="60" height="5" fill="${black}"/>` +
          `<path d="M0 28.5H60" stroke="${gold}" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/>` +
          `<rect y="57" width="60" height="3" fill="${black}"/>`,
      };
    }

    /* BOGOLAN : lignes, croix et chevrons sur boue claire */
    case "BOGOLAN_MUDCLOTH": {
      const brown = "#3A2212";
      const accent = hsl(hue, 80, 38);
      return {
        w: 72,
        h: 72,
        bg: "#E9DDC3",
        body:
          `<rect width="72" height="72" fill="#E9DDC3"/>` +
          `<path d="M0 5H72M0 9H72" stroke="${brown}" stroke-width="2" fill="none"/>` +
          [9, 27, 45, 63].map((x) => `<path d="M${x - 4} 22H${x + 4}M${x} 18V26" stroke="${brown}" stroke-width="2.5" stroke-linecap="round" fill="none"/>`).join("") +
          `<path d="M0 36L9 44L18 36L27 44L36 36L45 44L54 36L63 44L72 36" fill="none" stroke="${brown}" stroke-width="2.5" stroke-linejoin="round"/>` +
          circles([0, 18, 36, 54, 72].map((x) => [x, 54]), 3, accent) +
          circles([9, 27, 45, 63].map((x) => [x, 54]), 1.5, brown) +
          `<path d="M0 63H72M0 67H72" stroke="${brown}" stroke-width="2" fill="none"/>`,
      };
    }

    /* NDEBELE : aplats vifs et contours noirs épais (peinture murale) */
    case "NDEBELE_WALL":
    default: {
      const b = hsl(hue + 160);
      const c = hsl(hue + 230);
      const ink = "#111111";
      return {
        w: 80,
        h: 80,
        bg: "#F8F4EA",
        body:
          `<rect width="80" height="80" fill="#F8F4EA"/>` +
          `<rect x="2" y="2" width="76" height="76" fill="none" stroke="${ink}" stroke-width="3"/>` +
          ["2,2 26,2 2,26", "78,2 54,2 78,26", "2,78 26,78 2,54", "78,78 54,78 78,54"]
            .map((pts) => `<polygon points="${pts}" fill="${c}" stroke="${ink}" stroke-width="3" stroke-linejoin="miter"/>`)
            .join("") +
          `<polygon points="40,10 70,40 40,70 10,40" fill="${color}" stroke="${ink}" stroke-width="3"/>` +
          `<polygon points="40,24 56,40 40,56 24,40" fill="${b}" stroke="${ink}" stroke-width="3"/>` +
          `<rect x="36" y="36" width="8" height="8" fill="${ink}"/>`,
      };
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Export : vrai CSS et vrai SVG                                             */
/* -------------------------------------------------------------------------- */

function tileCss(pillar: Pillar, scale: number) {
  const { w, h, bg, body } = tileSvg(pillar.code, pillar.color, pillar.hue);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  const css =
    `.motif-${pillar.key} {\n` +
    `  background-color: ${bg};\n` +
    `  background-image: url("data:image/svg+xml,${encodeURIComponent(svg)}");\n` +
    `  background-size: ${Math.round(w * scale)}px ${Math.round(h * scale)}px;\n` +
    `}`;
  return { css, preview: css.replace(/(data:image\/svg\+xml,)[^"]+/, "$1…") };
}

function fabricSvg(pillar: Pillar, scale: number) {
  const { w, h, body } = tileSvg(pillar.code, pillar.color, pillar.hue);
  const S = 640;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">` +
    `<defs><pattern id="${pillar.key}" width="${w}" height="${h}" patternUnits="userSpaceOnUse" patternTransform="scale(${scale})">${body}</pattern></defs>` +
    `<rect width="${S}" height="${S}" fill="url(#${pillar.key})"/></svg>`
  );
}

/* -------------------------------------------------------------------------- */
/*  Rendu d'un motif                                                          */
/*  plain : motif seul (miniatures)  light : + tissage et grain  rich : + bords irréguliers */
/* -------------------------------------------------------------------------- */

const TEXTURE: Record<PatternKind, { displace: number; thread: number; grain: number; thick: number }> = {
  NDOP_GEOMETRY: { displace: 2.2, thread: 0.22, grain: 0.35, thick: 3 },
  ADINKRA_SYMBOLS: { displace: 3, thread: 0.16, grain: 0.45, thick: 4 },
  TOGHU_CONTRAST: { displace: 1.2, thread: 0.3, grain: 0.3, thick: 2.5 },
  KENTE_WEAVE: { displace: 0.8, thread: 0.42, grain: 0.25, thick: 3 },
  BOGOLAN_MUDCLOTH: { displace: 3.5, thread: 0.22, grain: 0.6, thick: 4 },
  NDEBELE_WALL: { displace: 1.6, thread: 0.08, grain: 0.5, thick: 5 },
};

function Pattern({
  pillar,
  scale = 1,
  weave = 1,
  mode = "light",
}: {
  pillar: Pillar;
  scale?: number;
  weave?: number;
  mode?: "plain" | "light" | "rich";
}) {
  const uid = useId().replace(/:/g, "");
  const { w, h, body } = tileSvg(pillar.code, pillar.color, pillar.hue);
  const t = TEXTURE[pillar.code];
  const half = t.thick / 2;
  const thread = t.thread * weave;
  const isCloth = pillar.medium === "cloth";

  return (
    <svg className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`p-${uid}`} width={w} height={h} patternUnits="userSpaceOnUse" patternTransform={`scale(${scale})`}>
          <g dangerouslySetInnerHTML={{ __html: body }} />
        </pattern>
        {mode !== "plain" && (
          <>
            {/* fils de chaîne et de trame (tissu seulement) */}
            <pattern id={`w-${uid}`} width={t.thick * 2} height={t.thick * 2} patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width={t.thick} height={t.thick} fill="#000" fillOpacity={thread * 0.5} />
              <rect x={t.thick} y={t.thick} width={t.thick} height={t.thick} fill="#000" fillOpacity={thread * 0.5} />
              <path d={`M0 ${half}H${t.thick * 2}M0 ${t.thick + half}H${t.thick * 2}`} stroke="#000" strokeOpacity={thread} strokeWidth={t.thick * 0.3} fill="none" />
              <path d={`M${half} 0V${t.thick * 2}M${t.thick + half} 0V${t.thick * 2}`} stroke="#FFF" strokeOpacity={thread * 0.55} strokeWidth={t.thick * 0.25} fill="none" />
            </pattern>
            {/* grain du support : le filtre ne tourne que sur une petite tuile, répétée */}
            <filter id={`gf-${uid}`} filterUnits="userSpaceOnUse" x="0" y="0" width="160" height="160">
              <feTurbulence type="fractalNoise" baseFrequency="0.9 0.65" numOctaves="3" seed="7" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.7 0 0 0 -0.6" />
            </filter>
            <pattern id={`g-${uid}`} width="160" height="160" patternUnits="userSpaceOnUse">
              <rect width="160" height="160" fill="#000" filter={`url(#gf-${uid})`} />
            </pattern>
          </>
        )}
        {mode === "rich" && (
          /* bords irréguliers, comme une teinture ou un estampage fait à la main */
          <filter id={`warp-${uid}`} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={t.displace} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        )}
      </defs>

      <g filter={mode === "rich" ? `url(#warp-${uid})` : undefined}>
        <rect x="-12" y="-12" width="120%" height="120%" fill={`url(#p-${uid})`} />
      </g>
      {mode !== "plain" && isCloth && thread > 0 && <rect width="100%" height="100%" fill={`url(#w-${uid})`} />}
      {mode !== "plain" && <rect width="100%" height="100%" fill={`url(#g-${uid})`} opacity={t.grain * 0.6} style={{ mixBlendMode: "multiply" }} />}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tissage : une trame après l'autre, une seule fois                         */
/* -------------------------------------------------------------------------- */

const rows = (n: number) => (t: number) => Math.floor(t * n) / n;

function Woven({
  children,
  delay = 0,
  duration = 1.6,
  reduce,
  onView = true,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  reduce: boolean | null;
  onView?: boolean;
  className?: string;
}) {
  if (reduce) return <div className={className}>{children}</div>;
  const hidden = { clipPath: "inset(0 0 100% 0)" };
  const shown = { clipPath: "inset(0 0 0% 0)" };
  const transition = { duration, delay, ease: rows(14) };
  return onView ? (
    <motion.div className={className} initial={hidden} whileInView={shown} viewport={{ once: true, margin: "-12% 0px" }} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div className={className} initial={hidden} animate={shown} transition={transition}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Une bande                                                                 */
/* -------------------------------------------------------------------------- */

function Band({ pillar, index, reduce, onOpenLab }: { pillar: Pillar; index: number; reduce: boolean | null; onOpenLab: (k: PatternKind) => void }) {
  const t = useTranslations("CulturePage");
  const r = RESERVE[pillar.reserve];
  const flip = index % 2 === 1;

  return (
    <section id={`band-${pillar.key}`} aria-labelledby={`title-${pillar.key}`} className="relative scroll-mt-20 overflow-hidden border-y-2 border-black/50">
      <Woven reduce={reduce} className="absolute inset-0">
        <Pattern pillar={pillar} scale={pillar.scale} />
      </Woven>
      <div className={`relative mx-auto flex min-h-[28rem] max-w-6xl items-center px-6 py-14 md:py-20 ${flip ? "md:justify-end" : ""}`}>
        <article
          className="w-full rounded-[3px] p-7 shadow-[0_18px_40px_rgba(0,0,0,.45)] sm:p-9 md:max-w-md"
          style={{ background: r.bg, color: r.fg, outline: `2px dashed ${r.stitch}`, outlineOffset: "-7px" }}
        >
          <p className="text-sm opacity-75">{t(`labels.medium_${pillar.medium}`)}</p>
          <h3 id={`title-${pillar.key}`} className="mt-1 font-achiko text-2xl font-black leading-tight sm:text-3xl">
            {t(`pillars.${pillar.key}.title`)}
          </h3>
          <dl className="mt-5 space-y-4 text-sm leading-relaxed">
            <div>
              <dt className="font-bold">{t("labels.origin")}</dt>
              <dd className="opacity-90">{t(`pillars.${pillar.key}.origin`)}</dd>
            </div>
            <div>
              <dt className="font-bold">{t("labels.symbolism")}</dt>
              <dd className="opacity-90">{t(`pillars.${pillar.key}.symbolism`)}</dd>
            </div>
            <div>
              <dt className="font-bold">{t("labels.web_implementation")}</dt>
              <dd className="opacity-90">{t(`pillars.${pillar.key}.implementation`)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => onOpenLab(pillar.code)}
            className="mt-6 rounded-[3px] px-4 py-2.5 text-sm font-bold transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: r.btn, color: r.btnFg, outlineColor: r.fg }}
          >
            {t("lab.open_in_loom")}
          </button>
        </article>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lisière : navigation latérale, un échantillon par motif                    */
/* -------------------------------------------------------------------------- */

function Selvedge({ active }: { active: string | null }) {
  const t = useTranslations("CulturePage");
  return (
    <nav aria-label={t("nav_label")} className="fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 xl:flex">
      {culturalPillars.map((p) => (
        <a
          key={p.key}
          href={`#band-${p.key}`}
          aria-label={t(`pillars.${p.key}.title`)}
          aria-current={active === p.key ? "true" : undefined}
          className={`block size-7 overflow-hidden rounded-[2px] ring-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C] ${
            active === p.key ? "scale-110 ring-[#FFC82C]" : "opacity-70 ring-white/20 hover:opacity-100"
          }`}
        >
          <Pattern pillar={p} scale={0.3} mode="plain" />
        </a>
      ))}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Laboratoire : le métier                                                   */
/* -------------------------------------------------------------------------- */

function PatternLab({ kind, setKind }: { kind: PatternKind; setKind: (k: PatternKind) => void }) {
  const t = useTranslations("CulturePage");
  const [scale, setScale] = useState(1.4);
  const [weave, setWeave] = useState(1);
  const [status, setStatus] = useState("");

  const pillar = culturalPillars.find((p) => p.code === kind) ?? culturalPillars[0];
  const { css, preview } = tileCss(pillar, scale);

  async function copy() {
    try {
      await navigator.clipboard.writeText(css);
      setStatus(t("lab.copied"));
    } catch {
      setStatus("");
    }
    window.setTimeout(() => setStatus(""), 2000);
  }

  function download() {
    const url = URL.createObjectURL(new Blob([fabricSvg(pillar, scale)], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `motif-${pillar.key}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const btn =
    "rounded-[3px] px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C]";

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      <div
        className="min-h-[18rem] overflow-hidden rounded-[3px] border-2 border-[#E9D8A6]/50 bg-black/40 shadow-2xl md:min-h-[26rem]"
        role="img"
        aria-label={t("lab.preview_label", { pattern: t(`pillars.${pillar.key}.title`), scale: scale.toFixed(1) })}
      >
        <Pattern pillar={pillar} scale={scale} weave={weave} mode="rich" />
      </div>

      <div className="space-y-6">
        <fieldset>
          <legend className="mb-3 text-sm font-bold text-white">{t("lab.pattern")}</legend>
          <div className="flex flex-wrap gap-2">
            {culturalPillars.map((p) => (
              <button
                key={p.code}
                type="button"
                aria-pressed={kind === p.code}
                onClick={() => setKind(p.code)}
                className={`${btn} ${kind === p.code ? "bg-[#FFC82C] text-[#141A3F]" : "bg-[#2B3A8C] text-[#F4EBD0] hover:bg-[#3446A8]"}`}
              >
                {t(`pillars.${p.key}.title`)}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="lab-scale" className="mb-2 flex justify-between text-sm font-bold text-white">
            <span>{t("lab.scale")}</span>
            <span className="font-light text-gray-300">×{scale.toFixed(1)}</span>
          </label>
          <input id="lab-scale" type="range" min={0.6} max={2.4} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-[#FFC82C]" />
        </div>

        {pillar.medium === "cloth" && (
          <div>
            <label htmlFor="lab-weave" className="mb-2 flex justify-between text-sm font-bold text-white">
              <span>{t("lab.weave")}</span>
              <span className="font-light text-gray-300">{Math.round(weave * 100)} %</span>
            </label>
            <input id="lab-weave" type="range" min={0} max={1.6} step={0.1} value={weave} onChange={(e) => setWeave(Number(e.target.value))} className="w-full accent-[#FFC82C]" />
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-bold text-white">{t("lab.export_title")}</p>
          <pre className="overflow-x-auto rounded-[3px] bg-black/50 p-4 text-xs leading-relaxed text-[#FFE57F]">
            <code>{preview}</code>
          </pre>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={copy} className={`${btn} bg-[#FFC82C] text-[#141A3F] hover:bg-[#ffd75e]`}>
              {t("lab.copy_css")}
            </button>
            <button type="button" onClick={download} className={`${btn} border border-[#E9D8A6]/60 text-white hover:border-[#E9D8A6]`}>
              {t("lab.download_svg")}
            </button>
            <span aria-live="polite" className="text-sm text-[#E9D8A6]">
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Culture() {
  const t = useTranslations("CulturePage");
  const reduce = useReducedMotion();
  const [labKind, setLabKind] = useState<PatternKind>("NDOP_GEOMETRY");
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = culturalPillars.map((p) => document.getElementById(`band-${p.key}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("band-", ""))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function openLab(kind: PatternKind) {
    setLabKind(kind);
    document.getElementById("laboratoire")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0B0D18] pb-24 pt-28 font-azurio text-[#F8F9FA]">
      <Selvedge active={active} />

      {/* ÉCHANTILLON : les six motifs, tissés une fois à l'arrivée */}
      <header className="mx-auto max-w-6xl px-6">
        <h1 className="max-w-3xl font-achiko text-4xl font-black leading-[1.05] text-white md:text-6xl">
          {t("content.hero_title_prefix")} {t("content.hero_title_highlight")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-gray-200 md:text-xl">{t("content.hero_description")}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#laboratoire"
            className="rounded-xl bg-[#FFC82C] px-7 py-3 text-sm font-bold text-[#141A3F] transition-colors hover:bg-[#ffd75e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("content.test_pattern")}
          </a>
          <a
            href="#band-ndop"
            className="rounded-xl border border-[#E9D8A6]/50 px-7 py-3 text-sm font-bold text-white transition-colors hover:border-[#E9D8A6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("content.view_pillars")}
          </a>
        </div>
      </header>

      <ul className="mx-auto mt-14 max-w-6xl border-y-2 border-black/50">
        {culturalPillars.map((p, i) => (
          <li key={p.key} className="relative h-12 overflow-hidden sm:h-14">
            <Woven reduce={reduce} onView={false} delay={0.25 + i * 0.22} duration={1.1} className="absolute inset-0">
              <Pattern pillar={p} scale={0.7} />
            </Woven>
            <a
              href={`#band-${p.key}`}
              className="absolute left-0 top-0 flex h-full items-center px-4 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#FFC82C]"
              style={{ background: RESERVE[p.reserve].bg, color: RESERVE[p.reserve].fg }}
            >
              {t(`pillars.${p.key}.title`)}
            </a>
          </li>
        ))}
      </ul>

      {/* LES BANDES */}
      <div id="motifs" className="mt-24 scroll-mt-24 space-y-0">
        <h2 className="sr-only">
          {t("content.pillars_title_prefix")} {t("content.pillars_title_highlight")}
        </h2>
        {culturalPillars.map((p, i) => (
          <Band key={p.key} pillar={p} index={i} reduce={reduce} onOpenLab={openLab} />
        ))}
      </div>

      <div className="mx-auto max-w-6xl space-y-28 px-6 pt-20">
        <p className="max-w-3xl text-sm font-light leading-relaxed text-gray-300">{t("content.pillars_disclaimer")}</p>

        {/* LABORATOIRE */}
        <section id="laboratoire" className="scroll-mt-24 space-y-10 border-t border-white/10 pt-16">
          <div>
            <h2 className="font-achiko text-3xl font-black text-white md:text-5xl">
              {t("content.lab_title_prefix")} {t("content.lab_title_highlight")}
            </h2>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-gray-200">{t("content.lab_description")}</p>
          </div>
          <PatternLab kind={labKind} setKind={setLabKind} />
        </section>

        {/* PROCESSUS */}
        <section className="space-y-10 border-t border-white/10 pt-16">
          <h2 className="font-achiko text-3xl font-black text-white md:text-5xl">
            {t("content.process_title_prefix")} {t("content.process_title_highlight")}
          </h2>
          <ol className="grid gap-10 md:grid-cols-3">
            {processSteps.map((step, i) => (
              <li key={step.key} className="border-t-2 border-dashed border-[#E9D8A6]/60 pt-5">
                <p className="font-achiko text-sm text-[#E9D8A6]">{i + 1}</p>
                <h3 className="mt-2 font-achiko text-xl font-black text-white">{t(`process.${step.key}.title`)}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-200">{t(`process.${step.key}.text`)}</p>
              </li>
            ))}
          </ol>
          <p className="max-w-3xl border-l-4 border-[#FFC82C]/60 pl-5 text-sm font-light leading-relaxed text-gray-300">{t("content.principle")}</p>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 pt-16">
          <h2 className="max-w-3xl font-achiko text-3xl font-black text-white md:text-5xl">
            {t("content.cta_title_prefix")} {t("content.cta_title_highlight")} {t("content.cta_title_suffix")}
          </h2>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-200">{t("content.cta_description")}</p>
          <Link
            href="/CONTACT"
            className="mt-8 inline-block rounded-xl bg-[#FFC82C] px-9 py-4 text-sm font-bold text-[#141A3F] transition-colors hover:bg-[#ffd75e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("content.cta_button")}
          </Link>
        </section>
      </div>
    </div>
  );
}