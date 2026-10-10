"use client";

import React, { useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";

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
}

const culturalPillars: Pillar[] = [
  {
    code: "NDOP_GEOMETRY",
    key: "ndop",
    color: "#FFC82C",
    hue: 46,
  },
  {
    code: "ADINKRA_SYMBOLS",
    key: "adinkra",
    color: "#FF3B56",
    hue: 352,
  },
  {
    code: "TOGHU_CONTRAST",
    key: "toghu",
    color: "#FFE57F",
    hue: 47,
  },
  {
    code: "KENTE_WEAVE",
    key: "kente",
    color: "#FFB300",
    hue: 44,
  },
  {
    code: "BOGOLAN_MUDCLOTH",
    key: "bogolan",
    color: "#D9A066",
    hue: 22,
  },
  {
    code: "NDEBELE_WALL",
    key: "ndebele",
    color: "#4FC3F7",
    hue: 199,
  },
];

const processSteps = [
  { index: "01", key: "observe" },
  { index: "02", key: "abstract" },
  { index: "03", key: "implement" },
];

/* -------------------------------------------------------------------------- */
/*  Outils graphiques                                                         */
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
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

/* -------------------------------------------------------------------------- */
/*  Motifs SVG (stylisations géométriques générées en code)                   */
/* -------------------------------------------------------------------------- */

interface Tile {
  w: number;
  h: number;
  node: React.ReactNode;
}

function buildTile(kind: PatternKind, color: string, hue: number): Tile {
  const cream = "#F4EFE0";

  switch (kind) {
    /* --- NDOP : treillis de losanges, indigo et réserve ------------------- */
    case "NDOP_GEOMETRY":
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
            <path
              d="M0 12L12 0M52 0L64 12M64 52L52 64M12 64L0 52"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
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

    /* --- ADINKRA : grille de symboles estampés ---------------------------- */
    case "ADINKRA_SYMBOLS":
      return {
        w: 120,
        h: 120,
        node: (
          <>
            <rect width="120" height="120" fill="#1A0F0C" />
            {/* sillons de la grille d'estampage */}
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

            {/* Adinkrahene : cercles concentriques */}
            <g fill="none" stroke={color} strokeWidth="2.5">
              <circle cx="30" cy="30" r="19" />
              <circle cx="30" cy="30" r="12" />
              <circle cx="30" cy="30" r="5" fill={color} />
            </g>

            {/* Dwennimmen : cornes de bélier */}
            <g fill="none" stroke={cream} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={spiralPath(82, 30, 8, 1.75, 1)} />
              <path d={spiralPath(98, 30, 8, 1.75, -1)} />
              <path d="M76 46H104" />
            </g>

            {/* Sankofa : cœur et spirale */}
            <g fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M30 106C10 92 12 72 24 72C28 72 30 76 30 79C30 76 32 72 36 72C48 72 50 92 30 106Z" />
              <path d={spiralPath(30, 87, 7, 1.75, 1)} />
            </g>

            {/* Nkyinkyim : zigzag de l'adaptabilité */}
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

    /* --- TOGHU : bandes brodées sur fond sombre --------------------------- */
    case "TOGHU_CONTRAST": {
      const c2 = hsl(hue + 130);
      const c3 = hsl(hue + 250);
      return {
        w: 72,
        h: 72,
        node: (
          <>
            <rect width="72" height="72" fill="#14070A" />
            {/* chaîne de losanges */}
            {[12, 36, 60].map((cx) => (
              <g key={`d-${cx}`}>
                <polygon
                  points={`${cx},2 ${cx + 12},12 ${cx},22 ${cx - 12},12`}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                />
                <polygon points={`${cx},7 ${cx + 6},12 ${cx},17 ${cx - 6},12`} fill={c3} />
              </g>
            ))}
            {/* zigzag */}
            <path
              d="M0 34L9 28L18 34L27 28L36 34L45 28L54 34L63 28L72 34"
              fill="none"
              stroke={c2}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* triangles */}
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
            {/* points de broderie */}
            {Array.from({ length: 9 }).map((_, i) => (
              <circle key={`p-${i}`} cx={4 + i * 8} cy="66" r="2" fill={cream} />
            ))}
          </>
        ),
      };
    }

    /* --- KENTE : bandes tissées et damiers -------------------------------- */
    case "KENTE_WEAVE": {
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
            {/* blocs de trame */}
            {bands
              .filter((b) => b.block)
              .flatMap((b) => [
                <rect key={`s1-${b.x}`} x={b.x + 3} y="6" width="6" height="6" fill={b.block as string} />,
                <rect key={`s2-${b.x}`} x={b.x + 3} y="40" width="6" height="6" fill={b.block as string} />,
                <rect key={`s3-${b.x}`} x={b.x + 3} y="14" width="6" height="6" fill={b.block as string} fillOpacity="0.45" />,
                <rect key={`s4-${b.x}`} x={b.x + 3} y="48" width="6" height="6" fill={b.block as string} fillOpacity="0.45" />,
              ])}
            {/* fil de trame horizontal */}
            <rect y="26" width="60" height="5" fill={black} />
            <path d="M0 28.5H60" stroke={gold} strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            <rect y="57" width="60" height="3" fill={black} />
          </>
        ),
      };
    }

    /* --- BOGOLAN : lignes, croix et chevrons sur fond de boue claire ------- */
    case "BOGOLAN_MUDCLOTH": {
      const brown = "#3A2212";
      const accent = hsl(hue, 80, 38);
      return {
        w: 72,
        h: 72,
        node: (
          <>
            <rect width="72" height="72" fill="#E9DDC3" />
            <path d="M0 5H72M0 9H72" stroke={brown} strokeWidth="2" fill="none" />
            {[9, 27, 45, 63].map((x) => (
              <path key={`x-${x}`} d={`M${x - 4} 22H${x + 4}M${x} 18V26`} stroke={brown} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            ))}
            <path
              d="M0 36L9 44L18 36L27 44L36 36L45 44L54 36L63 44L72 36"
              fill="none"
              stroke={brown}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {[0, 18, 36, 54, 72].map((x) => (
              <circle key={`k-${x}`} cx={x} cy="54" r="3" fill={accent} />
            ))}
            {[9, 27, 45, 63].map((x) => (
              <circle key={`s-${x}`} cx={x} cy="54" r="1.5" fill={brown} />
            ))}
            <path d="M0 63H72M0 67H72" stroke={brown} strokeWidth="2" fill="none" />
          </>
        ),
      };
    }

    /* --- NDEBELE : aplats vifs et contours noirs épais -------------------- */
    case "NDEBELE_WALL":
    default: {
      const b = hsl(hue + 160);
      const c = hsl(hue + 230);
      const ink = "#111111";
      return {
        w: 80,
        h: 80,
        node: (
          <>
            <rect width="80" height="80" fill="#F8F4EA" />
            <rect x="2" y="2" width="76" height="76" fill="none" stroke={ink} strokeWidth="3" />
            {[
              "2,2 26,2 2,26",
              "78,2 54,2 78,26",
              "2,78 26,78 2,54",
              "78,78 54,78 78,54",
            ].map((pts) => (
              <polygon key={pts} points={pts} fill={c} stroke={ink} strokeWidth="3" strokeLinejoin="miter" />
            ))}
            <polygon points="40,10 70,40 40,70 10,40" fill={color} stroke={ink} strokeWidth="3" />
            <polygon points="40,24 56,40 40,56 24,40" fill={b} stroke={ink} strokeWidth="3" />
            <rect x="36" y="36" width="8" height="8" fill={ink} />
          </>
        ),
      };
    }
  }
}

interface PatternProps {
  kind: PatternKind;
  color: string;
  hue?: number;
  scale?: number;
}

/**
 * Réglages de texture par motif :
 * - displace : irrégularité des bords (teinture, estampage, peinture à la main)
 * - thread   : visibilité des fils de trame
 * - grain    : rugosité du support (coton, boue, mur)
 * - thick    : taille d'un fil (px)
 */
const TEXTURE: Record<PatternKind, { displace: number; thread: number; grain: number; thick: number }> = {
  NDOP_GEOMETRY: { displace: 2.2, thread: 0.22, grain: 0.35, thick: 3 },
  ADINKRA_SYMBOLS: { displace: 3, thread: 0.16, grain: 0.45, thick: 4 },
  TOGHU_CONTRAST: { displace: 1.2, thread: 0.3, grain: 0.3, thick: 2.5 },
  KENTE_WEAVE: { displace: 0.8, thread: 0.42, grain: 0.25, thick: 3 },
  BOGOLAN_MUDCLOTH: { displace: 3.5, thread: 0.22, grain: 0.6, thick: 4 },
  NDEBELE_WALL: { displace: 1.6, thread: 0.08, grain: 0.5, thick: 5 },
};

function Pattern({ kind, color, hue = 46, scale = 1 }: PatternProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  const id = `pat-${uid}`;
  const weaveId = `weave-${uid}`;
  const warpId = `warp-${uid}`;
  const fibersId = `fibers-${uid}`;
  const grainId = `grain-${uid}`;

  const { w, h, node } = buildTile(kind, color, hue);
  const t = TEXTURE[kind];
  const half = t.thick / 2;

  return (
    <svg className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        {/* motif */}
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse" patternTransform={`scale(${scale})`}>
          {node}
        </pattern>

        {/* fils de chaîne et de trame (damier de fils clairs et sombres) */}
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

        {/* bords irréguliers, comme une teinture ou un estampage fait à la main */}
        <filter id={warpId} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={t.displace} xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* fibres allongées (irrégularités du fil) */}
        <filter id={fibersId} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.7" numOctaves="2" seed="11" result="f" />
          <feColorMatrix
            in="f"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.4 0 0 0 -0.55"
          />
        </filter>

        {/* grain du support */}
        <filter id={grainId} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.65" numOctaves="3" seed="7" result="g" />
          <feColorMatrix
            in="g"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.7 0 0 0 -0.6"
          />
        </filter>
      </defs>

      <g filter={`url(#${warpId})`}>
        <rect x="-12" y="-12" width="120%" height="120%" fill={`url(#${id})`} />
      </g>
      <rect width="100%" height="100%" fill={`url(#${weaveId})`} />
      <rect width="100%" height="100%" fill="#000" filter={`url(#${fibersId})`} opacity="0.22" />
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
/*  Hero : médaillon en rotation lente                                        */
/*  Dents Toghu, losanges Ndop, étoile à 8 pointes, cercles Adinkrahene       */
/* -------------------------------------------------------------------------- */

function Spin({
  children,
  duration,
  dir = 1,
  reduce,
}: {
  children: React.ReactNode;
  duration: number;
  dir?: 1 | -1;
  reduce: boolean | null;
}) {
  return (
    <motion.g
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      animate={reduce ? undefined : { rotate: 360 * dir }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {children}
    </motion.g>
  );
}

function HeroPattern() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const rotate1 = useTransform(scrollY, [0, 1000], [0, 360]);
  const rotate2 = useTransform(scrollY, [0, 1000], [180, 540]);

  return (
    <div className="fixed right-0 top-0 h-full w-1/2 pointer-events-none z-0 overflow-hidden">
      {/* Effet de profondeur avec blur en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#FFC82C]/5 to-transparent blur-3xl" aria-hidden="true" />

      {/* SVG principal avec effet parallax au scroll */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[120vh] w-auto opacity-60"
        aria-hidden="true"
        focusable="false"
        style={{ rotate: reduce ? 0 : rotate1, x: "50%" }}
      >
        {/* anneau de triangles (Toghu) */}
        <Spin duration={140} reduce={reduce}>
          {Array.from({ length: 24 }).map((_, i) => (
            <polygon
              key={`t-${i}`}
              points="200,10 208,30 192,30"
              fill={i % 2 === 0 ? "#FFC82C" : "#FF3B56"}
              transform={`rotate(${i * 15} 200 200)`}
            />
          ))}
        </Spin>

        {/* anneau de losanges (Ndop) */}
        <Spin duration={110} dir={-1} reduce={reduce}>
          {Array.from({ length: 16 }).map((_, i) => (
            <polygon
              key={`d-${i}`}
              points="200,46 209,60 200,74 191,60"
              fill="none"
              stroke="#FFE57F"
              strokeWidth="2"
              transform={`rotate(${i * 22.5} 200 200)`}
            />
          ))}
        </Spin>

        {/* fil de broderie */}
        <circle
          cx="200"
          cy="200"
          r="112"
          fill="none"
          stroke="#FFE57F"
          strokeOpacity="0.7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 9"
        />

        {/* étoile à 8 pointes */}
        <Spin duration={90} reduce={reduce}>
          <rect x="130" y="130" width="140" height="140" fill="none" stroke="#FFC82C" strokeWidth="2" />
          <rect
            x="130"
            y="130"
            width="140"
            height="140"
            fill="none"
            stroke="#FF3B56"
            strokeWidth="2"
            transform="rotate(45 200 200)"
          />
        </Spin>

        {/* Adinkrahene : cercles concentriques */}
        <g fill="none" strokeWidth="3">
          <circle cx="200" cy="200" r="46" stroke="#FFFFFF" />
          <circle cx="200" cy="200" r="32" stroke="#FFC82C" />
          <circle cx="200" cy="200" r="18" stroke="#FF3B56" />
        </g>
        <circle cx="200" cy="200" r="7" fill="#FFC82C" />
      </motion.svg>

      {/* Deuxième couche pour effet de profondeur (plus grande et plus floue) */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute right-[-20%] top-1/2 -translate-y-1/2 h-[150vh] w-auto opacity-30 blur-xl"
        aria-hidden="true"
        focusable="false"
        style={{ rotate: reduce ? 180 : rotate2, x: "50%" }}
      >
        {/* anneau de triangles (Toghu) */}
        <Spin duration={160} reduce={reduce}>
          {Array.from({ length: 24 }).map((_, i) => (
            <polygon
              key={`t-bg-${i}`}
              points="200,10 208,30 192,30"
              fill={i % 2 === 0 ? "#FFC82C" : "#FF3B56"}
              transform={`rotate(${i * 15} 200 200)`}
            />
          ))}
        </Spin>

        {/* étoile à 8 pointes */}
        <Spin duration={120} reduce={reduce}>
          <rect x="130" y="130" width="140" height="140" fill="none" stroke="#FFC82C" strokeWidth="2" />
          <rect
            x="130"
            y="130"
            width="140"
            height="140"
            fill="none"
            stroke="#FF3B56"
            strokeWidth="2"
            transform="rotate(45 200 200)"
          />
        </Spin>
      </motion.svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Carte de pilier                                                           */
/* -------------------------------------------------------------------------- */

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  const reduce = useReducedMotion();
  const t = useTranslations("CulturePage");

  return (
    <motion.article
      initial={{ opacity: 0, y: reduce ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduce ? undefined : { y: -7 }}
      transition={{ delay: (index % 3) * 0.15, duration: 0.5 }}
      viewport={{ once: true }}
      className="glass-card group flex flex-col justify-between rounded-3xl border border-white/15 p-8 font-azurio shadow-xl transition-all hover:border-[#FFC82C]"
    >
      <div className="space-y-4">
        <div className="relative mb-2 h-40 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none">
            <Pattern kind={pillar.code} color={pillar.color} hue={pillar.hue} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D18]/70 to-transparent" />
        </div>

        <span className="block font-azurio text-xs font-bold tracking-widest text-gray-300">{pillar.code}</span>

        <h3 className="font-achiko text-2xl font-black uppercase text-white transition-colors group-hover:text-[#FFC82C]">
          {t(`pillars.${pillar.key}.title`)}
        </h3>

        <div className="inline-block rounded-lg bg-[#FFC82C]/15 px-3 py-1.5 font-azurio text-sm font-bold text-[#FFC82C]">
          {t("labels.origin")}: {t(`pillars.${pillar.key}.origin`)}
        </div>

        <p className="text-sm font-light leading-relaxed text-gray-200">
          <strong className="font-bold text-white">{t("labels.symbolism")}:</strong> {t(`pillars.${pillar.key}.symbolism`)}
        </p>
        <p className="text-sm font-light leading-relaxed text-gray-300">
          <strong className="font-bold text-white">{t("labels.web_implementation")}:</strong> {t(`pillars.${pillar.key}.implementation`)}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
        <span className="font-azurio text-xs font-bold uppercase text-gray-400">ETHNO_SYSTEM_V2</span>
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: pillar.color, boxShadow: `0 0 10px ${pillar.color}` }}
          aria-hidden="true"
        />
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Laboratoire interactif                                                    */
/* -------------------------------------------------------------------------- */

function PatternLab() {
  const t = useTranslations("CulturePage");
  const [kind, setKind] = useState<PatternKind>("NDOP_GEOMETRY");
  const [hue, setHue] = useState(46);
  const [scale, setScale] = useState(1);

  const color = `hsl(${hue} 100% 60%)`;
  const activePillar = culturalPillars.find((pillar) => pillar.code === kind) ?? culturalPillars[0];
  const css = [
    `--motif: ${kind.toLowerCase()};`,
    `--motif-hue: ${hue};`,
    `--motif-scale: ${scale.toFixed(1)};`,
    `color: hsl(var(--motif-hue) 100% 60%);`,
  ].join("\n");

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      <div
        className="min-h-[18rem] overflow-hidden rounded-3xl border border-[#FFC82C]/40 bg-black/40 shadow-2xl md:min-h-[26rem]"
        role="img"
        aria-label={t("lab.preview", {
          pattern: t(`pillars.${activePillar.key}.title`),
          hue,
          scale: scale.toFixed(1),
        })}
      >
        <Pattern kind={kind} color={color} hue={hue} scale={scale} />
      </div>

      <div className="glass-panel space-y-6 rounded-3xl border border-white/15 p-6 font-azurio md:p-8">
        <fieldset>
          <legend className="mb-3 text-sm font-bold text-white">{t("lab.pattern")}</legend>
          <div className="flex flex-wrap gap-2">
            {culturalPillars.map((pillar) => (
              <button
                key={pillar.code}
                type="button"
                aria-pressed={kind === pillar.code}
                onClick={() => {
                  setKind(pillar.code);
                  setHue(pillar.hue);
                }}
                className={`rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
                  kind === pillar.code
                    ? "border-[#FFC82C] bg-[#FFC82C] text-black"
                    : "border-white/20 text-gray-200 hover:border-[#FFC82C]"
                }`}
              >
                {t(`pillars.${pillar.key}.title`)}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="lab-hue" className="mb-2 flex justify-between text-sm font-bold text-white">
            <span>{t("lab.hue")}</span>
            <span className="font-light text-gray-300">{hue}°</span>
          </label>
          <input
            id="lab-hue"
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="w-full accent-[#FFC82C]"
          />
        </div>

        <div>
          <label htmlFor="lab-scale" className="mb-2 flex justify-between text-sm font-bold text-white">
            <span>{t("lab.scale")}</span>
            <span className="font-light text-gray-300">×{scale.toFixed(1)}</span>
          </label>
          <input
            id="lab-scale"
            type="range"
            min={0.6}
            max={2.4}
            step={0.1}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-full accent-[#FFC82C]"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-white">{t("lab.generated_settings")}</p>
          <pre className="overflow-x-auto rounded-xl bg-black/50 p-4 text-xs leading-relaxed text-[#FFE57F]">
            <code>{css}</code>
          </pre>
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0D18] pb-24 pt-28 font-azurio text-[#F8F9FA]">
      <div className="relative z-10 mx-auto max-w-7xl space-y-28 px-6">
        {/* HERO */}
        <section className="relative z-10">
          <HeroPattern />
          <div className="max-w-2xl space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-achiko text-5xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-8xl"
            >
              {t("content.hero_title_prefix")} <br />
              <span className="text-[#FFC82C]">{t("content.hero_title_highlight")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-3xl  font-azurio text-lg font-light leading-relaxed text-gray-200 md:text-xl"
            >
              {t("content.hero_description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <a
                href="#laboratoire"
                className="rounded-xl bg-[#FFC82C] px-7 py-3 font-achiko text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
              >
                {t("content.test_pattern")}
              </a>
              <a
                href="#motifs"
                className="rounded-xl border border-white/30 px-7 py-3 font-achiko text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-[#FFC82C] hover:text-[#FFC82C]"
              >
                {t("content.view_pillars")}
              </a>
            </motion.div>
          </div>
        </section>

        {/* PILIERS */}
        <section id="motifs" className="scroll-mt-28 space-y-12 border-t border-white/10 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-achiko text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
              {t("content.pillars_title_prefix")} <span className="text-[#FFC82C]">{t("content.pillars_title_highlight")}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {culturalPillars.map((pillar, i) => (
              <PillarCard key={pillar.code} pillar={pillar} index={i} />
            ))}
          </div>

          <p className="max-w-3xl text-sm font-light leading-relaxed text-gray-300">
            {t("content.pillars_disclaimer")}
          </p>
        </section>

        {/* LABORATOIRE */}
        <section id="laboratoire" className="scroll-mt-28 space-y-12 border-t border-white/10 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-achiko text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
              {t("content.lab_title_prefix")} <span className="text-[#FFC82C]">{t("content.lab_title_highlight")}</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-gray-200">
              {t("content.lab_description")}
            </p>
          </motion.div>

          <PatternLab />
        </section>

        {/* PROCESSUS */}
        <section className="space-y-12 border-t border-white/10 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-achiko text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
              {t("content.process_title_prefix")} <span className="text-[#FFC82C]">{t("content.process_title_highlight")}</span>
            </h2>
          </motion.div>

          <ol className="grid gap-6 md:grid-cols-3">
            {processSteps.map((step, i) => (
              <motion.li
                key={step.index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="glass-card rounded-3xl border border-white/15 p-8"
              >
                <span className="font-achiko text-5xl font-black text-[#FFC82C]/40">{step.index}</span>
                <h3 className="mt-4 font-achiko text-xl font-black uppercase text-white">{t(`process.${step.key}.title`)}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-200">{t(`process.${step.key}.text`)}</p>
              </motion.li>
            ))}
          </ol>

          <p className="max-w-3xl border-l-4 border-[#FFC82C]/60 pl-5 text-sm font-light leading-relaxed text-gray-300">
            {t("content.principle")}
          </p>
        </section>

        {/* CTA */}
        <section className="glass-panel space-y-6 rounded-3xl border border-[#FFC82C] p-12 text-center font-azurio shadow-2xl">
          <h2 className="font-achiko text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
            {t("content.cta_title_prefix")} <span className="text-[#FFC82C]">{t("content.cta_title_highlight")}</span> {t("content.cta_title_suffix")}
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-gray-200">
            {t("content.cta_description")}
          </p>
          <div className="pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                href="/CONTACT"
                className="inline-block rounded-xl bg-[#FFC82C] px-10 py-4 font-achiko text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_30px_rgba(255,200,44,0.4)] transition-all"
              >
                {t("content.cta_button")}
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}