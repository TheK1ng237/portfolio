"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

/**
 * Navigation.
 * Bureau : une épingle en bois marque la page où l'on se trouve et voyage d'un lien à l'autre.
 * Mobile : une barre d'onglets en bas, taillée dans un ruban de tissu. La page active est une grosse tête
 * d'épingle en bois, gravée d'un symbole Adinkra, plantée dans une encoche du ruban. Elle glisse d'un onglet
 * à l'autre. Chaque icône est un symbole Adinkra dont le sens est celui de la page.
 */

/*  about      -> Fihankra          la maison (accueil, ce qui me définit)
 *  projects   -> Aya               la fougère : endurance, ingéniosité (comme les feuilles de la page)
 *  culture    -> Sankofa           « retourne le chercher » : apprendre du passé
 *  solution   -> Ananse Ntontan    la toile d'araignée : sagesse, créativité
 *  contact    -> Nkonsonkonson     la chaîne : unité et relations humaines                                */
const NAV_ITEMS = [
  { key: "about", path: "/ABOUT", symbol: "fihankra" },
  { key: "projects", path: "/PROJECT", symbol: "aya" },
  { key: "culture", path: "/CULTURE", symbol: "sankofa" },
  { key: "solution", path: "/SOLUTION", symbol: "ananse" },
  { key: "contact", path: "/CONTACT", symbol: "nkonsonkonson" },
] as const;

type SymbolName = (typeof NAV_ITEMS)[number]["symbol"];

const CV_HREF = "/cv/NDOH YANNICK TANG - Full Stack Developer - CV.pdf";

const STITCH = { outline: "2px dashed rgba(233,216,166,.7)", outlineOffset: "-4px" } as const;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC82C]";

/* -------------------------------------------------------------------------- */
/*  Symboles Adinkra (grille 32 x 32, tracés au trait)                        */
/* -------------------------------------------------------------------------- */

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

const AYA_LEAVES = [0, 1, 2, 3].map((i) => {
  const y = 25 - i * 5.2;
  const w = 10.5 - i * 1.8;
  return `M16 ${y}Q${16 - w * 0.55} ${y - 0.5} ${16 - w} ${y - 5.5}M16 ${y}Q${16 + w * 0.55} ${y - 0.5} ${16 + w} ${y - 5.5}`;
}).join("");

/** Le dessin d'un symbole, sans <svg> autour : on le réutilise pour l'onglet et pour la gravure. */
export function AdinkraSymbol({ name }: { name: SymbolName }) {
  switch (name) {
    case "fihankra": // la maison : l'enceinte, ses quatre entrées
      return (
        <>
          <rect x="4" y="4" width="24" height="24" rx="3" />
          <rect x="10.5" y="10.5" width="11" height="11" rx="1.5" />
          <path d="M16 4v6.5M16 21.5V28M4 16h6.5M21.5 16H28" />
        </>
      );
    case "aya": // la fougère
      return (
        <>
          <path d="M16 29V4" />
          <path d={AYA_LEAVES} />
        </>
      );
    case "sankofa": // le cœur et sa spirale
      return (
        <>
          <path d="M16 28C5 20 5.5 9.5 11.2 9.5C14 9.5 16 11.4 16 13.4C16 11.4 18 9.5 20.8 9.5C26.5 9.5 27 20 16 28Z" />
          <path d={spiralPath(16, 17.5, 4.4, 1.6, 1)} />
        </>
      );
    case "ananse": // la toile d'araignée
      return (
        <>
          <circle cx="16" cy="16" r="12.5" />
          <circle cx="16" cy="16" r="7" />
          <path d="M16 3.5V9M16 23V28.5M3.5 16H9M23 16H28.5M7.2 7.2L11 11M21 21L24.8 24.8M24.8 7.2L21 11M11 21L7.2 24.8" />
          <circle cx="16" cy="16" r="1.6" />
        </>
      );
    case "nkonsonkonson": // deux maillons de chaîne
    default:
      return (
        <g transform="rotate(-40 16 16)">
          <rect x="2.5" y="10.5" width="15.5" height="11" rx="5.5" />
          <rect x="14" y="10.5" width="15.5" height="11" rx="5.5" />
        </g>
      );
  }
}

function TabIcon({ name, size = 26 }: { name: SymbolName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <AdinkraSymbol name={name} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Épingle en bois (bureau) et tête d'épingle gravée (mobile)                */
/* -------------------------------------------------------------------------- */

function Pin({ size = 16 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" focusable="false" style={{ filter: "drop-shadow(1px 3px 2px rgba(0,0,0,.6))" }}>
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

/** Tête d'épingle de 44 px : bois tourné, symbole gravé (trait sombre + reflet clair décalé). */
export function PinHead({ name }: { name: SymbolName }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" focusable="false" style={{ filter: "drop-shadow(0 5px 5px rgba(0,0,0,.55))" }}>
      <defs>
        <radialGradient id={`ph-${uid}`} cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor="#E3B878" />
          <stop offset="0.55" stopColor="#B07B3E" />
          <stop offset="1" stopColor="#6A4120" />
        </radialGradient>
      </defs>
      <circle cx="22" cy="22" r="21" fill={`url(#ph-${uid})`} stroke="#4A2C14" strokeWidth="1.5" />
      <path d="M6 17C12 12 32 12 38 17M4.7 24C12 19 32 19 39.3 24M7 31C13 27 31 27 37 31" stroke="#5A3618" strokeOpacity="0.35" strokeWidth="1" fill="none" />
      <g transform="translate(8 8) scale(0.875)" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="rgba(255,236,200,.55)" transform="translate(0.9 0.9)">
          <AdinkraSymbol name={name} />
        </g>
        <g stroke="#3B2210">
          <AdinkraSymbol name={name} />
        </g>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ruban de la barre mobile : un rectangle arrondi avec une encoche          */
/* -------------------------------------------------------------------------- */

export const BAR_H = 64; // hauteur du ruban
export const BAR_PAD = 30; // marge intérieure gauche et droite (pour que l'encoche tienne aux extrémités)
export const HEAD_R = 22; // rayon de la tête d'épingle
const CORNER = 16;
const NOTCH_HALF = 40; // demi-largeur de l'encoche au niveau du bord
const NOTCH_DEPTH = 27;
export const HEAD_CY = -5; // centre de la tête, par rapport au bord haut du ruban

/** Contour du ruban pour une largeur W, avec l'encoche centrée en cx. */
export function barPath(W: number, cx: number, H = BAR_H) {
  const r = CORNER;
  const x1 = Math.max(cx - NOTCH_HALF, r);
  const x2 = Math.min(cx + NOTCH_HALF, W - r);
  const hl = cx - x1;
  const hr = x2 - cx;
  return [
    `M0 ${r}`,
    `Q0 0 ${r} 0`,
    `H${x1}`,
    `C${x1 + hl * 0.5} 0 ${cx - hl * 0.55} ${NOTCH_DEPTH} ${cx} ${NOTCH_DEPTH}`,
    `C${cx + hr * 0.55} ${NOTCH_DEPTH} ${x2 - hr * 0.5} 0 ${x2} 0`,
    `H${W - r}`,
    `Q${W} 0 ${W} ${r}`,
    `V${H - r}`,
    `Q${W} ${H} ${W - r} ${H}`,
    `H${r}`,
    `Q0 ${H} 0 ${H - r}`,
    "Z",
  ].join(" ");
}

function TabBar({ pathname, activeIndex }: { pathname: string; activeIndex: number }) {
  const t = useTranslations("Nav");
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement | null>(null);
  const [W, setW] = useState(0);

  const cx = useMotionValue(-300);
  const d = useTransform(cx, (v) => barPath(W || 1, v));
  const headX = useTransform(cx, (v) => v - HEAD_R);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.getBoundingClientRect().width));
    ro.observe(el);
    setW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const itemW = W ? (W - BAR_PAD * 2) / NAV_ITEMS.length : 0;
  const centerOf = (i: number) => BAR_PAD + (i + 0.5) * itemW;

  useEffect(() => {
    if (!W) return;
    const target = activeIndex < 0 ? -300 : centerOf(activeIndex);
    // pas de glissement depuis « nulle part » : on se place directement au premier affichage
    if (reduce || cx.get() < 0 || target < 0) cx.set(target);
    else animate(cx, target, { type: "spring", stiffness: 280, damping: 26 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, activeIndex, reduce]);

  void pathname;

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-3 z-[90] md:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div ref={ref} className="relative" style={{ height: BAR_H }}>
        {/* le ruban : tissu indigo, bord cousu à la raphia */}
        {W > 0 ? (
          <svg width={W} height={BAR_H} viewBox={`0 0 ${W} ${BAR_H}`} aria-hidden="true" focusable="false" className="absolute inset-0 overflow-visible" style={{ filter: "drop-shadow(0 8px 14px rgba(0,0,0,.55))" }}>
            <defs>
              <pattern id={`wv-${uid}`} width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="2" height="2" fill="#fff" fillOpacity="0.04" />
                <rect x="2" y="2" width="2" height="2" fill="#000" fillOpacity="0.14" />
              </pattern>
            </defs>
            <motion.path d={d} fill="#141A3F" />
            <motion.path d={d} fill={`url(#wv-${uid})`} />
            <motion.path d={d} fill="none" stroke="rgba(233,216,166,.75)" strokeWidth="2" strokeDasharray="3 5" strokeLinecap="round" />
          </svg>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 rounded-[20px] bg-[#141A3F]" />
        )}

        {/* la tête d'épingle de la page active */}
        {activeIndex >= 0 && W > 0 && (
          <motion.div aria-hidden="true" className="pointer-events-none absolute left-0" style={{ x: headX, top: HEAD_CY - HEAD_R }}>
            <PinHead name={NAV_ITEMS[activeIndex].symbol} />
          </motion.div>
        )}

        <ul className="absolute inset-0 flex" style={{ paddingLeft: BAR_PAD, paddingRight: BAR_PAD }}>
          {NAV_ITEMS.map((item, i) => {
            const active = i === activeIndex;
            return (
              <li key={item.key} className="flex-1">
                <Link
                  href={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-full flex-col items-center justify-between rounded-[8px] pb-2 pt-3 ${focusRing} ${
                    active ? "text-[#FFC82C]" : "text-[#E9D8A6]/80 hover:text-white"
                  }`}
                >
                  <span className={active ? "invisible" : ""}>
                    <TabIcon name={item.symbol} />
                  </span>
                  <span className={`text-xs leading-none ${active ? "font-achiko font-black" : "font-achiko"}`}>{t(item.key)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ruban de Ndop (barre du haut) et sélecteur de langue                      */
/* -------------------------------------------------------------------------- */

function NdopRibbon() {
  const uid = useId().replace(/:/g, "");
  const gold = "#EDE6D0";
  const cream = "#F4EFE0";
  const body =
    `<rect width="64" height="64" fill="#0E1747"/>` +
    `<polygon points="32,4 60,32 32,60 4,32" fill="none" stroke="${gold}" stroke-width="3"/>` +
    `<polygon points="32,15 49,32 32,49 15,32" fill="none" stroke="${cream}" stroke-width="2"/>` +
    `<polygon points="32,26 38,32 32,38 26,32" fill="${gold}"/>`;
  return (
    <svg className="h-full w-full" aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <defs>
        <pattern id={`n-${uid}`} width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="scale(0.16)">
          <g dangerouslySetInnerHTML={{ __html: body }} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#n-${uid})`} />
    </svg>
  );
}

function LanguageSwitcher({ pathname, locale }: { pathname: string; locale: string }) {
  const options = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
  ] as const;
  return (
    <div role="group" aria-label="Langue / Language" className="flex gap-1.5">
      {options.map((o) => {
        const active = locale === o.code;
        return (
          <Link
            key={o.code}
            href={pathname}
            locale={o.code}
            lang={o.code}
            hrefLang={o.code}
            aria-current={active ? "true" : undefined}
            className={`rounded-[3px] px-3 py-1.5 text-sm font-bold transition-colors ${focusRing} ${
              active ? "bg-[#FFC82C] text-[#141A3F]" : "bg-[#2B3A8C] text-[#F4EBD0] hover:bg-[#3446A8]"
            }`}
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Nav");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 25);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = NAV_ITEMS.findIndex((item) => pathname.toUpperCase().startsWith(item.path));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[padding,background-color] duration-300 motion-reduce:transition-none ${
          isScrolled ? "bg-[#0B0D18] py-2.5" : "py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* MARQUE */}
          <Link href="/" className={`flex items-center gap-3.5 rounded-[3px] ${focusRing}`}>
            <Image src="/logojaune.png" alt="Thek1ng237" width={42} height={42} priority />
            <span className="hidden sm:block">
              <span className="block text-xs leading-none text-gray-300">{t("identity")}</span>
              <span className="mt-1 block font-achiko text-lg font-black leading-none text-[#FFC82C]">Thek1ng237</span>
            </span>
          </Link>

          {/* NAVIGATION BUREAU */}
          <nav aria-label="Principal" className="hidden items-center md:flex">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname.toUpperCase().startsWith(item.path);
                return (
                  <li key={item.key}>
                    <Link href={item.path} aria-current={active ? "page" : undefined} className={`group relative block rounded-[3px] px-4 py-2 ${focusRing}`}>
                      {active && (
                        <motion.span
                          layoutId="nav-pin"
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }}
                          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3"
                          aria-hidden="true"
                        >
                          <Pin size={14} />
                        </motion.span>
                      )}
                      <span
                        className={`block border-b-2 border-dashed pb-0.5 font-achiko text-[15px] transition-colors ${
                          active
                            ? "border-[#E9D8A6]/70 font-black text-[#FFC82C]"
                            : "border-transparent text-gray-200 group-hover:border-[#E9D8A6]/50 group-hover:text-white"
                        }`}
                      >
                        {t(item.key)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="ml-6 flex items-center gap-3 border-l-2 border-dashed border-[#E9D8A6]/30 pl-6">
              <a
                href={CV_HREF}
                download
                target="_blank"
                rel="noopener noreferrer"
                title={t("cv_title")}
                className={`hidden rounded-[3px] bg-[#2B3A8C] px-3.5 py-1.5 text-sm font-bold text-[#F4EBD0] transition-colors hover:bg-[#3446A8] lg:block ${focusRing}`}
                style={STITCH}
              >
                CV PDF
              </a>
              <LanguageSwitcher pathname={pathname} locale={locale} />
            </div>
          </nav>

          {/* MOBILE : seulement la langue en haut, la navigation est en bas */}
          <div className="md:hidden">
            <LanguageSwitcher pathname={pathname} locale={locale} />
          </div>
        </div>

        {/* ruban de Ndop : la barre est « cousue » quand on a défilé */}
        <div aria-hidden="true" className={`absolute inset-x-0 -bottom-1.5 h-1.5 transition-opacity duration-300 motion-reduce:transition-none ${isScrolled ? "opacity-100" : "opacity-0"}`}>
          <NdopRibbon />
        </div>
      </header>

      <TabBar pathname={pathname} activeIndex={activeIndex} />
    </>
  );
}