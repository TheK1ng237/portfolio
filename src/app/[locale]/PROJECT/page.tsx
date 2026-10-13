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
 * couverture du projet imprimée sur le tissu. Quatre sections, chacune ouverte par une bannière de tissu :
 * culture africaine, projets communautaires, challenges, open source.
 * Tout ce qui est empilé sur le mur a une hauteur multiple d'une rangée de briques (44 px) : les cordes
 * tombent donc toujours sur un joint.
 */

type GroupId = "culture" | "community" | "challenges" | "opensource";
type Item = Project & { group: GroupId };

/* ---------------------------------------------------------------------------
 * Les quatre sections (textes FR / EN) et la bande tissée de chaque bannière
 * ------------------------------------------------------------------------- */

const GROUPS: {
  id: GroupId;
  band: string;
  fr: { short: string; title: string; intro: string };
  en: { short: string; title: string; intro: string };
}[] = [
  {
    id: "culture",
    band: "repeating-linear-gradient(90deg, #EDE6D0 0 3px, #0E1747 3px 8px, #FFC82C 8px 10px, #0E1747 10px 16px)",
    fr: {
      short: "Culture africaine",
      title: "Promouvoir la culture africaine",
      intro: "Des interfaces qui font vivre les motifs, les tissus et les récits d'Afrique.",
    },
    en: {
      short: "African culture",
      title: "Promoting African culture",
      intro: "Interfaces that bring African patterns, textiles and stories to life.",
    },
  },
  {
    id: "community",
    band: "repeating-linear-gradient(90deg, #FFC82C 0 3px, #14070A 3px 8px, #FF3B56 8px 10px, #14070A 10px 16px)",
    fr: {
      short: "Communautaires",
      title: "Projets communautaires",
      intro: "Les plateformes construites en bénévole avec Google Developer Groups Douala.",
    },
    en: {
      short: "Community",
      title: "Community projects",
      intro: "Platforms built as a volunteer with Google Developer Groups Douala.",
    },
  },
  {
    id: "challenges",
    band: "repeating-linear-gradient(90deg, #FF3B56 0 3px, #1A0F0C 3px 8px, #F4EFE0 8px 10px, #1A0F0C 10px 16px)",
    fr: {
      short: "Mes challenges",
      title: "Mes challenges",
      intro: "Des défis que je me suis donnés : une boutique, des cartes de vœux, des portfolios pour mes pairs.",
    },
    en: {
      short: "My challenges",
      title: "My challenges",
      intro: "Challenges I set myself: a shop, greeting cards, portfolios for my peers.",
    },
  },
  {
    id: "opensource",
    band: "repeating-linear-gradient(90deg, #FFB300 0 4px, #111111 4px 7px, #0E8F4F 7px 11px, #111111 11px 14px, #E4283E 14px 18px, #111111 18px 21px)",
    fr: {
      short: "Open source",
      title: "Open source",
      intro: "Un standard de design numérique ouvert, né du patrimoine textile africain.",
    },
    en: {
      short: "Open source",
      title: "Open source",
      intro: "An open digital design standard, born from African textile heritage.",
    },
  },
];

/* ---------------------------------------------------------------------------
 * Les projets
 * Section « culture » : tes projets actuels (textes dans tes fichiers de traduction).
 * Autres sections : textes ci-dessous, d'après ton CV. Images à déposer dans /public/projet/.
 * ------------------------------------------------------------------------- */

const fallbackProjects: Item[] = [
  {
    id: 1,
    group: "culture",
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
    group: "culture",
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
    group: "culture",
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
    group: "culture",
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
    group: "culture",
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

type Copy = { title: string; description: string };

const EXTRA_PROJECTS: (Item & { copy: { fr: Copy; en: Copy } })[] = [
  /* --- Projets communautaires : Google Developer Groups, Douala --- */
  {
    id: 101,
    group: "community",
    title: "",
    description: "",
    image: "/projet/devfest2026.png",
    link: "https://devfest.gdgdouala.org/",
    github: "https://github.com/GDG-Douala/devfest2026",
    tech: ["Angular"],
    category: "web",
    featured: true,
    isCompleted: true,
    version: "2026",
    copy: {
      fr: {
        title: "GDG Event Platform 2026",
        description:
          "Page d'accueil complète (couches 00 à 05), landing page du thème, du manifeste et des chiffres clés, profils et annuaire des intervenants, agenda multi-salles filtrable et pages de session.",
      },
      en: {
        title: "GDG Event Platform 2026",
        description:
          "Complete homepage experience (layers 00–05), landing page with the theme, manifesto and key figures, speaker profiles and directory, a filterable multi-room agenda and dedicated session pages.",
      },
    },
  },
  {
    id: 102,
    group: "community",
    title: "",
    description: "",
    image: "/projet/devfest2025.png",
    link: "https://devfest2025.gdgdouala.org/",
    github: "https://github.com/GDG-Douala/devfest2025",
    tech: ["Angular"],
    category: "web",
    featured: false,
    isCompleted: true,
    version: "2025",
    copy: {
      fr: {
        title: "GDG Event Marketplace 2025",
        description: "La marketplace de l'édition 2025 : un accès simplifié aux sessions et aux offres de l'événement.",
      },
      en: {
        title: "GDG Event Marketplace 2025",
        description: "The 2025 edition marketplace: easier access to the event's sessions and offers.",
      },
    },
  },

  /* --- Mes challenges --- */
  {
    id: 201,
    group: "challenges",
    title: "",
    description: "",
    image: "/projet/lingerie.png",
    link: "https://lingerieluxe.vercel.app",
    github: "https://github.com/TheK1ng237/projetlingerie",
    tech: ["Next.js", "Tailwind CSS"],
    category: "web",
    featured: false,
    isCompleted: true,
    version: "v1.0",
    copy: {
      fr: {
        title: "Lingerie Luxe",
        description: "Interface e-commerce haut de gamme : mise en page responsive et parcours d'achat fluide.",
      },
      en: {
        title: "Lingerie Luxe",
        description: "A high-end e-commerce interface: responsive layout and a smooth shopping experience.",
      },
    },
  },
  {
    id: 202,
    group: "challenges",
    title: "",
    description: "",
    image: "/projet/christmass.png",
    link: "https://christmass-three.vercel.app",
    github: "https://github.com/TheK1ng237/christmass",
    tech: ["Next.js", "Supabase", "PostgreSQL"],
    category: "web",
    featured: false,
    isCompleted: true,
    version: "v1.0",
    copy: {
      fr: {
        title: "Christmas Three",
        description: "Plateforme de cartes de vœux full-stack : authentification sécurisée et interactions dynamiques avec la base de données.",
      },
      en: {
        title: "Christmas Three",
        description: "A full-stack greeting card platform with secure authentication and dynamic database interactions.",
      },
    },
  },
  {
    id: 203,
    group: "challenges",
    title: "",
    description: "",
    image: "/projet/salem.png",
    link: "https://salem-kaweina.vercel.app",
    github: "https://github.com/TheK1ng237/porfoliosalem",
    tech: ["Next.js"],
    category: "web",
    featured: false,
    isCompleted: true,
    version: "v1.0",
    copy: {
      fr: {
        title: "Portfolio Salem Kaweina",
        description: "Un portfolio sur mesure pour un pair, pour valoriser sa marque personnelle et ses réalisations.",
      },
      en: {
        title: "Salem Kaweina's portfolio",
        description: "A custom portfolio for a peer, to showcase their personal brand and achievements.",
      },
    },
  },
  {
    id: 204,
    group: "challenges",
    title: "",
    description: "",
    image: "/projet/gustave.png",
    link: "https://portofoliogustave.vercel.app",
    github: "https://github.com/TheK1ng237/portofoliogustave",
    tech: ["Next.js"],
    category: "web",
    featured: false,
    isCompleted: true,
    version: "v1.0",
    copy: {
      fr: {
        title: "Portfolio Gustave",
        description: "Un portfolio sur mesure pour un collègue, pour valoriser sa marque personnelle et ses réalisations.",
      },
      en: {
        title: "Gustave's portfolio",
        description: "A custom portfolio for a colleague, to showcase their personal brand and achievements.",
      },
    },
  },

  /* --- Open source : lien et dépôt à renseigner --- */
  {
    id: 301,
    group: "opensource",
    title: "",
    description: "",
    image: "/projet/buni.png",
    link: "https://buni-avs.vercel.app/",
    github: "",
    tech: ["Next.js", "next-intl", "Framer Motion"],
    category: "design",
    featured: true,
    isCompleted: false,
    version: "BUNI",
    copy: {
      fr: {
        title: "BUNI, le standard de design africain",
        description:
          "Le premier système de design natif du continent : les proportions du Ndop, du Kente et de l'Adinkra traduites en pixels, avec un manifeste et une documentation ouverts.",
      },
      en: {
        title: "BUNI, the African design standard",
        description:
          "The continent's first native design system: the proportions of Ndop, Kente and Adinkra translated into pixels, with an open manifesto and documentation.",
      },
    },
  },
];

type ProjectApiItem = {
  id?: number | string;
  group?: string;
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

const isGroup = (v?: string): v is GroupId => v === "culture" || v === "community" || v === "challenges" || v === "opensource";

const mapProject = (item: ProjectApiItem, locale: string): Item => ({
  id: Number(item.id ?? Math.random()),
  group: isGroup(item.group) ? item.group : "culture",
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

/** Les projets locaux des sections que l'API ne fournit pas encore, dans la langue de la page. */
const localExtras = (locale: string): Item[] =>
  EXTRA_PROJECTS.map(({ copy, ...project }) => ({ ...project, ...(locale === "en" ? copy.en : copy.fr) }));

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
// tissu uni, tant que la couverture du projet n'est pas là
const BLANK_CLOTH = "repeating-linear-gradient(45deg, #1B2358 0 10px, #141A3F 10px 20px)";

function Specimen({
  project,
  order,
  centered,
  reduced,
  onOpen,
  ariaLabel,
}: {
  project: Item;
  order: number;
  centered: boolean;
  reduced: boolean;
  onOpen: (p: Item, el: HTMLElement) => void;
  ariaLabel: string;
}) {
  const rest = REST[order % REST.length];
  const dx = SHIFT[order % SHIFT.length];
  const gust = (order % 2 === 0 ? 1 : -1) * 3.5;
  const [broken, setBroken] = useState(false);

  return (
    <li className={`relative ${centered ? "lg:col-span-2" : ""}`} style={{ height: ROW }}>
      <Rope />
      <div className="relative z-10 mx-auto" style={{ width: "min(420px, 100%)", marginTop: ROPE_Y + 4, transform: `translateX(${dx}px)` }}>
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
              {broken ? (
                <span aria-hidden="true" className="absolute inset-0" style={{ background: BLANK_CLOTH }} />
              ) : (
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 420px, 92vw"
                  className="object-cover"
                  style={{ filter: "saturate(.92) contrast(.97)" }}
                  onError={() => setBroken(true)}
                />
              )}
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
 * Bannière de section : une bande de tissu épinglée au mur
 * Hauteur fixe, multiple de 44 px (264 / 220 / 176) pour ne pas décaler les cordes.
 * ------------------------------------------------------------------------- */

function SectionBanner({ id, band, title, intro }: { id: GroupId; band: string; title: string; intro: string }) {
  return (
    <div id={`group-${id}`} className="relative h-[264px] scroll-mt-20 sm:h-[220px] lg:h-[176px]">
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div
          className="relative rounded-[2px] shadow-[0_14px_24px_rgba(26,10,5,.55)]"
          style={{
            backgroundColor: "#141A3F",
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.12) 0 2px, transparent 2px 4px)",
          }}
        >
          <span aria-hidden="true" className="block h-2.5" style={{ background: band }} />
          <div className="px-6 py-5 sm:px-10">
            <h2 id={`title-${id}`} className="font-achiko text-2xl font-black leading-tight text-[#F4EBD0] sm:text-3xl">{title}</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#E9D8A6]/90">{intro}</p>
          </div>
          <span aria-hidden="true" className="block h-2.5" style={{ background: band }} />
          <span aria-hidden="true" className="absolute left-5 top-0 -translate-y-1/2">
            <Pin size={24} />
          </span>
          <span aria-hidden="true" className="absolute right-5 top-0 -translate-y-1/2">
            <Pin size={24} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export default function ProjectsPage() {
  const t = useTranslations("ProjectsPage");
  const locale = useLocale();
  const lang = locale === "en" ? "en" : "fr";
  const reduced = !!useReducedMotion();

  const localizedFallbackProjects = useMemo<Item[]>(
    () => [
      ...fallbackProjects.map((project) => ({
        ...project,
        title: t(`items.${project.id}.title`),
        description: t(`items.${project.id}.description`),
      })),
      ...localExtras(locale),
    ],
    [t, locale],
  );

  const [projects, setProjects] = useState<Item[]>(localizedFallbackProjects);
  const [selected, setSelected] = useState<Item | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const data = await apiFetch<{ items: ProjectApiItem[] }>("/public/projects", { locale, method: "GET" });
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          const fromApi = data.items.map((item) => mapProject(item, locale));
          // les sections que l'API ne renseigne pas gardent leurs projets locaux
          const have = new Set(fromApi.map((p) => p.group));
          setProjects([...fromApi, ...localExtras(locale).filter((p) => !have.has(p.group))]);
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

  const sections = useMemo(
    () => GROUPS.map((g) => ({ ...g, items: projects.filter((p) => p.group === g.id) })).filter((g) => g.items.length > 0),
    [projects],
  );

  function open(project: Item, el: HTMLElement) {
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

  return (
    <div className="min-h-screen bg-[#0B0D18] font-azurio text-[#F8F9FA] selection:bg-[#FFC82C] selection:text-black">
      <header className="mx-auto max-w-6xl px-6 pb-10 pt-32">
        <h1 className="font-achiko text-3xl font-black text-white sm:text-5xl">
          {t("grid.title_prefix")} {t("grid.title_highlight")}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300">{t("grid.description")}</p>

        {/* aller à une section */}
        <nav aria-label={t("grid.title_prefix")} className="mt-8">
          <ul className="flex flex-wrap gap-3">
            {sections.map((g) => (
              <li key={g.id}>
                <a
                  href={`#group-${g.id}`}
                  className="block rounded-[3px] bg-[#2B3A8C] px-5 py-2 text-sm font-bold text-[#F4EBD0] transition-colors hover:bg-[#3446A8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C]"
                  style={{ outline: "2px dashed rgba(233,216,166,.7)", outlineOffset: "-4px" }}
                >
                  {g[lang].short}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Le mur et ses cordes */}
      <section>
        <div aria-hidden="true" className="h-5 bg-gradient-to-b from-[#6B4527] via-[#4A2E18] to-[#2A190C] shadow-[0_14px_22px_rgba(0,0,0,.55)]" />
        <div className="relative overflow-hidden bg-[#4A281C]">
          <Wall />
          <div className="relative pb-6">
            {sections.map((g) => (
              <section key={g.id} aria-labelledby={`title-${g.id}`}>
                <SectionBanner id={g.id} band={g.band} title={g[lang].title} intro={g[lang].intro} />
                <ul className="relative mx-auto grid max-w-6xl grid-cols-1 px-6 lg:grid-cols-2">
                  {g.items.map((project, i) => (
                    <Specimen
                      key={project.id}
                      project={project}
                      order={i}
                      centered={g.items.length % 2 === 1 && i === g.items.length - 1}
                      reduced={reduced}
                      onOpen={open}
                      ariaLabel={`${project.title}, ${t("grid.explore_project")}`}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
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