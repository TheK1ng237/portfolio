"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Hero : reproduit la boucle de la vidéo de référence (6 s).
 *  0,0 - 0,5 s  empilé
 *  0,5 - 1,6 s  les plaques montent (verticalement, comme dans la vidéo) ; le disque sort après
 *  1,6 - 4,5 s  pause écartée
 *  4,5 - 5,5 s  tout redescend ; le disque se repose dans son trou
 * Les plaques sont opaques, la plaque du dessus est en L et percée : on voit les couches du dessous
 * par le trou, la fenêtre, la fente et l'angle manquant.
 * On dessine à plat dans le plan (u, v) ; la matrice ISO l'incline.
 */

const N = 150; // côté d'une plaque
const T = 9; // épaisseur
const GAP = 12; // écart quand les plaques sont empilées
const LIFT = 42; // écart supplémentaire d'une plaque à l'autre quand elles s'écartent
const DISC_LIFT = 44; // hauteur dont le disque sort au-dessus de sa plaque
const C = 0.866; // cos 30°
const ORIGIN = { x: 320, y: 230 };
const ISO = `matrix(${C} 0.5 ${-C} 0.5 0 0)`;

const COL = {
  indigo: "#2B3A8C",
  indigoLight: "#4458C8",
  deep: "#1B2358",
  night: "#141A3F",
  gold: "#FFC82C",
  goldDark: "#8A6A12",
  red: "#FF3B56",
  raffia: "#E9D8A6",
};

const p = (u: number, v: number): [number, number] => [(u - v) * C, (u + v) * 0.5];

const LAYERS = ["data", "components", "tokens", "motif"] as const; // du bas vers le haut
type LayerId = (typeof LAYERS)[number];

const FILL: Record<LayerId, string> = {
  data: COL.night,
  components: COL.deep,
  tokens: "#1E2A6B",
  motif: COL.indigo,
};

// Contour de chaque plaque (plan u, v). La plaque du dessus : en L, avec un trou rond,
// une fenêtre et deux fentes (fill-rule evenodd => ce sont des trous).
const OUTLINE: Record<LayerId, string> = {
  data: `M0 0H${N}V${N}H0Z`,
  components: `M0 0H${N}V${N}H0Z`,
  tokens: `M0 0H${N}V${N}H0Z`,
  motif:
    "M0 0H150V75H75V150H0Z" +
    " M84 52a16 16 0 1 0 32 0a16 16 0 1 0-32 0Z" + // trou du disque
    " M30 42h50v30H30Z" + // fenêtre
    " M134 14h7v34h-7Z M134 54h7v16h-7Z", // fentes
};

// Boucle de la vidéo : empilé / montée / pause / descente / empilé
const TIMES = [0, 0.083, 0.267, 0.75, 0.917, 1];
const LOOP = { duration: 6, times: TIMES, ease: "easeInOut" as const, repeat: Infinity };
const DISC_LOOP = { duration: 6, times: [0, 0.15, 0.33, 0.75, 0.88, 1], ease: "easeInOut" as const, repeat: Infinity };
const HOLD = { duration: 0.6, ease: "easeInOut" as const };

/* ---------- Dessins à plat de chaque couche (plan u, v) ---------- */

function MotifArt() {
  return (
    <>
      <defs>
        <pattern id="hero-zig" width="12" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 10 L6 0 L12 10Z" fill={COL.gold} opacity="0.95" />
        </pattern>
      </defs>
      {/* frise de triangles le long des deux bords du fond */}
      <rect x="0" y="0" width={N} height="10" fill="url(#hero-zig)" />
      <rect x="0" y="10" width="10" height={N - 10} fill="url(#hero-zig)" />
      {/* losanges concentriques dans le bras gauche du L */}
      {[40, 28, 16].map((s, i) => (
        <rect
          key={s}
          x={40 - s / 2}
          y={110 - s / 2}
          width={s}
          height={s}
          transform={`rotate(45 40 110)`}
          fill="none"
          stroke={i % 2 === 0 ? COL.raffia : COL.gold}
          strokeWidth="2.5"
        />
      ))}
      <rect x="35" y="105" width="10" height="10" transform="rotate(45 40 110)" fill={COL.gold} />
    </>
  );
}

function TokensArt() {
  const sw = [
    [44, 44, COL.raffia],
    [92, 44, COL.gold],
    [44, 92, COL.red],
    [92, 92, COL.indigoLight],
  ] as const;
  return (
    <>
      {sw.map(([x, y, f]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="38" height="38" rx="5" fill={f} stroke={COL.raffia} strokeOpacity="0.5" />
      ))}
    </>
  );
}

function ComponentsArt() {
  const s = { fill: "none", stroke: COL.raffia, strokeOpacity: 0.75, strokeWidth: 2.5 };
  return (
    <>
      <rect x="40" y="40" width="100" height="96" rx="5" {...s} />
      <rect x="40" y="40" width="100" height="16" rx="5" fill={COL.raffia} opacity="0.3" />
      <rect x="50" y="66" width="34" height="30" rx="3" {...s} />
      <rect x="92" y="66" width="40" height="30" rx="3" {...s} />
      <rect x="50" y="106" width="46" height="20" rx="5" fill={COL.red} />
      <rect x="104" y="110" width="26" height="4" rx="2" fill={COL.raffia} opacity="0.75" />
      <rect x="104" y="118" width="18" height="4" rx="2" fill={COL.raffia} opacity="0.75" />
    </>
  );
}

function DataArt() {
  return (
    <>
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <rect x="40" y={56 + k * 22} width="96" height="14" rx="4" fill={COL.indigoLight} opacity="0.75" />
          <circle cx="50" cy={63 + k * 22} r="3" fill={COL.gold} />
          <rect x="60" y={61 + k * 22} width="44" height="4" rx="2" fill={COL.raffia} opacity="0.65" />
        </g>
      ))}
    </>
  );
}

const ART: Record<LayerId, () => React.JSX.Element> = {
  data: DataArt,
  components: ComponentsArt,
  tokens: TokensArt,
  motif: MotifArt,
};

/* ---------- Le disque : la pièce qui sort du trou de la plaque du dessus ---------- */

function Disc({ hold }: { hold: boolean }) {
  const [cx, cy] = p(100, 52);
  return (
    <motion.g
      initial={false}
      animate={hold ? { y: -DISC_LIFT } : { y: [0, 0, -DISC_LIFT, -DISC_LIFT, 0, 0] }}
      transition={hold ? HOLD : DISC_LOOP}
    >
      <g transform={`translate(${cx} ${cy})`}>
        {/* épaisseur : visible seulement quand le disque est sorti du trou */}
        <motion.g
          initial={false}
          animate={hold ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0, 0] }}
          transition={hold ? HOLD : DISC_LOOP}
        >
          {[4, 2].map((k) => (
            <g key={k} transform={`translate(0 ${k})`}>
              <g transform={ISO}>
                <circle r="15.4" fill={COL.goldDark} stroke="rgba(0,0,0,.35)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
              </g>
            </g>
          ))}
        </motion.g>
        <g transform={ISO}>
          <circle r="15.4" fill={COL.gold} stroke={COL.raffia} strokeOpacity="0.7" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <circle r="7.5" fill="none" stroke={COL.goldDark} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </g>
      </g>
    </motion.g>
  );
}

/* ---------- Une plaque ---------- */

const POSTS: [number, number][] = [[0, N], [N, 0]];

function Plate({
  id,
  index,
  hold,
  dim,
  focused,
  onActive,
}: {
  id: LayerId;
  index: number;
  hold: boolean;
  dim: boolean;
  focused: boolean;
  onActive: (id: LayerId | null) => void;
}) {
  const D = index * LIFT;
  const Art = ART[id];
  const edge = focused ? COL.gold : "rgba(233,216,166,.6)";

  return (
    <g
      style={{ opacity: dim ? 0.38 : 1, transition: "opacity .3s" }}
      onMouseEnter={() => onActive(id)}
      onMouseLeave={() => onActive(null)}
    >
      <motion.g
        initial={false}
        animate={hold ? { y: -D } : { y: [0, 0, -D, -D, 0, 0] }}
        transition={hold ? HOLD : LOOP}
      >
        <g transform={`translate(${ORIGIN.x} ${ORIGIN.y - index * GAP})`}>
          {/* poteaux entre cette plaque et celle du dessous */}
          {index > 0 && (
            <motion.g
              initial={false}
              animate={hold ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0, 0] }}
              transition={hold ? HOLD : { ...LOOP }}
            >
              {POSTS.map(([u, v], k) => {
                const [x, y] = p(u, v);
                return (
                  <g key={k}>
                    <line x1={x} y1={y + T} x2={x} y2={y + GAP + LIFT} stroke={COL.raffia} strokeOpacity="0.7" strokeWidth="2" strokeDasharray="1 4" strokeLinecap="round" />
                    <circle cx={x} cy={y + GAP + LIFT} r="3" fill="#0B0D18" stroke={COL.raffia} strokeOpacity="0.85" />
                  </g>
                );
              })}
            </motion.g>
          )}

          {/* épaisseur : le même contour répété vers le bas */}
          {[T, T - 2, T - 4, T - 6, T - 8].map((k) => (
            <g key={k} transform={`translate(0 ${k})`}>
              <g transform={ISO}>
                <path d={OUTLINE[id]} fillRule="evenodd" fill="#0E1233" stroke={k === T ? edge : "none"} strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </g>
            </g>
          ))}
          {/* face du dessus */}
          <g transform={ISO}>
            <path
              d={OUTLINE[id]}
              fillRule="evenodd"
              fill={FILL[id]}
              stroke={edge}
              strokeWidth={focused ? 2.2 : 1.3}
              vectorEffect="non-scaling-stroke"
            />
            <Art />
          </g>

          {id === "motif" && <Disc hold={hold} />}
        </g>
      </motion.g>
    </g>
  );
}

/* ---------- Cartes posées au sol ---------- */

function PaletteCard() {
  return (
    <g>
      <rect x="0" y="170" width="80" height="70" rx="6" fill="#10153A" stroke={COL.raffia} strokeOpacity="0.4" />
      {[COL.raffia, COL.gold, COL.red, COL.indigoLight].map((f, i) => (
        <rect key={f} x={8 + i * 17} y="180" width="12" height="12" rx="2" fill={f} />
      ))}
      <rect x="8" y="205" width="54" height="4" rx="2" fill={COL.raffia} opacity="0.45" />
      <rect x="8" y="215" width="36" height="4" rx="2" fill={COL.raffia} opacity="0.45" />
    </g>
  );
}

function CodeCard() {
  const lines: [number, number][] = [[0, 36], [8, 48], [8, 28], [0, 42], [8, 22]];
  return (
    <g>
      <rect x="170" y="0" width="70" height="80" rx="6" fill="#10153A" stroke={COL.raffia} strokeOpacity="0.4" />
      {lines.map(([dx, w], i) => (
        <rect key={i} x={178 + dx} y={10 + i * 13} width={w} height="5" rx="2" fill={i === 0 ? COL.gold : COL.raffia} opacity={i === 0 ? 0.9 : 0.5} />
      ))}
    </g>
  );
}

/* ---------- Le Hero ---------- */

export default function Hero() {
  const t = useTranslations("Hero");
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState<LayerId | null>(null); // survol / focus clavier

  // La boucle de la vidéo tourne seule. Au survol (ou en mouvement réduit), les plaques restent écartées.
  const hold = reduced || active !== null;

  const GRID = Array.from({ length: 25 }, (_, i) => -480 + i * 40);
  const face = (u: number, v: number) => p(u, v).join(",");
  const square = [face(0, 0), face(N, 0), face(N, N), face(0, N)].join(" ");

  return (
    <section className="relative flex min-h-[92vh] w-full items-center overflow-hidden bg-[#0B0D18] px-6 pb-16 pt-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* GAUCHE : diagramme (sous le texte sur mobile) */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          <svg viewBox="0 0 640 450" role="img" aria-label={t("diagram_label")} className="mx-auto h-auto max-h-[68vh] w-full">
            <defs>
              <radialGradient id="hero-fade" gradientUnits="userSpaceOnUse" cx="320" cy="300" r="320">
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#000" />
              </radialGradient>
              <mask id="hero-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="450">
                <rect width="640" height="450" fill="url(#hero-fade)" />
              </mask>
            </defs>

            {/* grille isométrique au sol */}
            <g mask="url(#hero-mask)">
              <g transform={`translate(${ORIGIN.x} ${ORIGIN.y + T}) ${ISO}`}>
                {GRID.map((k) => (
                  <g key={k} stroke={COL.raffia} strokeOpacity="0.1" strokeDasharray="2 5">
                    <path d={`M-480 ${k}H480`} vectorEffect="non-scaling-stroke" />
                    <path d={`M${k} -480V480`} vectorEffect="non-scaling-stroke" />
                  </g>
                ))}
              </g>
            </g>

            {/* ombre portée */}
            <g transform={`translate(${ORIGIN.x} ${ORIGIN.y + T + 6})`}>
              <polygon points={square} fill="#000" opacity="0.35" />
            </g>

            {/* cartes + liaisons */}
            <g transform={`translate(${ORIGIN.x} ${ORIGIN.y + T}) ${ISO}`}>
              <PaletteCard />
              <CodeCard />
            </g>
            <g stroke={COL.raffia} strokeOpacity="0.5" fill="none">
              <path d="M190 334 L190 320 L206 320" />
              <path d="M490 337 L490 320 L434 320" />
              <circle cx="206" cy="320" r="2.5" fill="#0B0D18" />
              <circle cx="434" cy="320" r="2.5" fill="#0B0D18" />
            </g>

            {/* les 4 couches */}
            {LAYERS.map((id, index) => (
              <Plate
                key={id}
                id={id}
                index={index}
                hold={hold}
                dim={active !== null && active !== id}
                focused={active === id}
                onActive={setActive}
              />
            ))}
          </svg>

          <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[...LAYERS].reverse().map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(id)}
                  onBlur={() => setActive(null)}
                  className={`font-azurio w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC82C] ${
                    active === id ? "border-[#FFC82C] text-white" : "border-white/15 text-gray-300 hover:border-white/40"
                  }`}
                >
                  {t(`layers.${id}.name`)}
                </button>
              </li>
            ))}
          </ul>
          <p aria-live="polite" className="font-azurio mt-3 min-h-[3rem] max-w-md text-sm text-gray-300">
            {active ? t(`layers.${active}.desc`) : t("hint")}
          </p>
        </div>

        {/* DROITE : texte */}
        <div className="order-1 space-y-7 lg:order-2 lg:col-span-5">
          <p className="font-azurio text-base text-[#E9D8A6]">{t("name")}</p>
          <h1 className="font-achiko text-4xl font-black leading-[1.04] text-white md:text-5xl xl:text-6xl">{t("title")}</h1>
          <p className="font-azurio max-w-md text-base font-light leading-relaxed text-gray-200 md:text-lg">{t("intro")}</p>
          <div className="font-azurio flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="/PROJECT"
              className="inline-flex items-center rounded-xl bg-[#FFC82C] px-7 py-4 text-sm font-bold text-[#0B0D18] transition-colors hover:bg-[#ffd75e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("cta_projects")}
            </Link>
            <a
              href="/cv/NDOH YANNICK TANG - Full Stack Developer - CV.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-[#E9D8A6]/50 px-7 py-4 text-sm font-bold text-white transition-colors hover:border-[#E9D8A6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("cta_cv")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}