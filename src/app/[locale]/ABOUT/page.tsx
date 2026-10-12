"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Page À propos : « la coupe du tronc ».
 * Hero en affiche : « Hello » en arc au-dessus d'un portrait détouré en noir et blanc, cinq étiquettes cousues
 * autour (comme des étiquettes de tailleur), « I'm Yannick » en grand, et une phrase d'accroche.
 * Les compétences sont les cernes d'un tronc d'avocatier : du cœur (ce qui porte tout)
 * jusqu'à l'écorce (les outils). Un seul contrôle : on choisit un cerne, le détail s'affiche.
 * Les certificats sont un registre, pas des cartes.
 */

/* -------------------------------------------------------------------------- */
/*  Données                                                                   */
/* -------------------------------------------------------------------------- */

type Item = { name: string; icon?: string };
type GroupId = "frontend" | "backend" | "data" | "design" | "environment" | "workflow";
type Group = { id: GroupId; volet: "skills" | "tools"; items: Item[] };

// Du cœur du tronc vers l'écorce
const GROUPS: Group[] = [
  {
    id: "frontend",
    volet: "skills",
    items: [
      { name: "Next.js", icon: "nextjs3dicon.svg" },
      { name: "Angular", icon: "angular3dicon.svg" },
      { name: "HTML5", icon: "html3dicon.svg" },
      { name: "CSS3", icon: "css3dicon.svg" },
      { name: "JavaScript", icon: "javascript3dicon.svg" },
      { name: "TypeScript", icon: "typescript3dicon.svg" },
      { name: "Tailwind CSS", icon: "tailwindcss3dicon.svg" },
    ],
  },
  {
    id: "backend",
    volet: "skills",
    items: [
      { name: "Node.js", icon: "nodejs3dicon.svg" },
      { name: "Java", icon: "java3dicon.svg" },
      { name: "Express.js", icon: "express3dicon.svg" },
      { name: "Django", icon: "django3dicon.svg" },
      { name: "API REST", icon: "postman3dicon.svg" },
    ],
  },
  {
    id: "data",
    volet: "skills",
    items: [
      { name: "MongoDB", icon: "mongodb3dicon.svg" },
      { name: "PostgreSQL", icon: "postgres3dicon.svg" },
      { name: "MySQL", icon: "mysql3dicon.svg" },
      { name: "Supabase", icon: "supabase3dicon.svg" },
      { name: "MetaMask & Blockchain", icon: "metamask3dicon.svg" },
    ],
  },
  {
    id: "design",
    volet: "tools",
    items: [
      { name: "Figma", icon: "figma.svg" },
      { name: "Photoshop", icon: "potoshop3dicon.svg" },
      { name: "Illustrator", icon: "illustrator.svg" },
      { name: "Milanote", icon: "milanote3dicon.svg" },
      { name: "Canva & Graphic UI", icon: "canva3dicon.svg" },
    ],
  },
  {
    id: "environment",
    volet: "tools",
    items: [
      { name: "VS Code", icon: "vscode3dicon.svg" },
      { name: "Git", icon: "git3dicon.svg" },
      { name: "GitHub", icon: "github3dicon.svg" },
      { name: "GitLab", icon: "gitlab3dicon.svg" },
      { name: "Postman", icon: "postman3dicon.svg" },
      { name: "Vercel", icon: "vercel3dicon.svg" },
    ],
  },
  { id: "workflow", volet: "tools", items: [{ name: "Trello", icon: "trello3dicon.svg" }] },
];

const certificationsData = [
  { id: "nextjs", title: "Next.js 15 & React - Le Guide Complet", issuer: "Udemy", category: "UDEMY", pdf: "/certif/UdemyNextjs.pdf", skills: ["Next.js 15", "React 19", "Server Components", "SSR"] },
  { id: "typescript", title: "TypeScript: Masterclass Ingénierie & Typage Avancé", issuer: "Udemy", category: "UDEMY", pdf: "/certif/UdemyTypescript.pdf", skills: ["TypeScript", "Generics", "Type Safety", "Interfaces"] },
  { id: "angular", title: "Développez des Applications Web avec Angular", issuer: "OpenClassrooms", category: "OPENCLASSROOMS", pdf: "/certif/Openclassroomangular.pdf", skills: ["Angular", "RxJS", "TypeScript", "Services"] },
  { id: "javascript", title: "Apprenez à Programmer avec JavaScript", issuer: "OpenClassrooms", category: "OPENCLASSROOMS", pdf: "/certif/Openclassroomjavascript.pdf", skills: ["JavaScript ES6+", "DOM API", "Promises", "Async/Await"] },
  { id: "html-css", title: "Créez votre site web avec HTML5 et CSS3", issuer: "OpenClassrooms", category: "OPENCLASSROOMS", pdf: "/certif/Openclassroomhtml-css.pdf", skills: ["HTML5", "CSS3", "Flexbox", "Responsive Design"] },
  { id: "tailwindcss", title: "Tailwind CSS: Masterclass Design System & Utility-First", issuer: "Udemy", category: "UDEMY", pdf: "/certif/UdemyTailwindcss.pdf", skills: ["Tailwind CSS", "Design Tokens", "UI Architecture"] },
  { id: "java", title: "Apprenez les Bases du Langage Java", issuer: "OpenClassrooms", category: "OPENCLASSROOMS", pdf: "/certif/Openclassroomjava.pdf", skills: ["Java", "POO", "JVM", "Classes & Héritage"] },
  { id: "dart", title: "Dart: Masterclass Développement Mobile & Flutter", issuer: "Udemy", category: "UDEMY", pdf: "/certif/UdemyDart.pdf", skills: ["Dart", "Mobile Dev", "Async", "Flutter SDK"] },
  { id: "figma", title: "Concevez des Maquettes et Prototypes avec Figma", issuer: "OpenClassrooms", category: "OPENCLASSROOMS", pdf: "/certif/Openclassroomfigma.pdf", skills: ["Figma", "UI/UX Prototyping", "Wireframes", "Design Systems"] },
  { id: "veille", title: "Réaliser une Veille Technologique et Scientifique", issuer: "OpenClassrooms", category: "OPENCLASSROOMS", pdf: "/certif/Openclassroomveilletechnique.pdf", skills: ["Veille Techno", "R&D", "Innovation Web", "Feedly"] },
];

const ISSUERS = [
  { id: "OPENCLASSROOMS", key: "certifications_openclassrooms" },
  { id: "UDEMY", key: "certifications_udemy" },
] as const;

/* Étiquettes autour du portrait. Positions en % de l'affiche (largeur x hauteur). */
const FIRST_NAME = "Yannick";

const POSTER_TAGS = [
  { key: "fullstack", left: 70, top: 14, rotate: 2 },
  { key: "design", left: 1, top: 35, rotate: -2 },
  { key: "culture", left: 73, top: 52, rotate: 2 },
  { key: "solutions", left: 0, top: 62, rotate: -2 },
  { key: "craft", left: 62, top: 76, rotate: 1.5 },
] as const;

/* -------------------------------------------------------------------------- */
/*  Le tronc : des cernes irréguliers, un par groupe                          */
/* -------------------------------------------------------------------------- */

const CX = 260;
const CY = 260;
const N = 120;
const R_OUT = [66, 108, 150, 190, 226, 246]; // rayon extérieur de chaque cerne, du cœur vers l'écorce
const TONES = ["#D9AE74", "#C79A62", "#B4854F", "#9C6E3E", "#80542E", "#5E3B20"];
const f = (n: number) => n.toFixed(1);

function prng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Contour fermé et lisse, légèrement irrégulier, autour d'un centre décalé. */
function blob(radius: number, amp: number, seed: number, dx = 0, dy = 0) {
  const r = prng(seed);
  const raw = Array.from({ length: N }, () => (r() - 0.5) * 2 * amp);
  const pass = (a: number[]) => a.map((_, i) => (a[(i + N - 2) % N] + a[(i + N - 1) % N] * 2 + a[i] * 3 + a[(i + 1) % N] * 2 + a[(i + 2) % N]) / 9);
  const sm = pass(pass(raw));
  const pts = sm.map((o, i) => {
    const a = (i / N) * Math.PI * 2;
    return [CX + dx + (radius + o) * Math.cos(a), CY + dy + (radius + o) * Math.sin(a)];
  });
  const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(pts[N - 1], pts[0]);
  let d = `M${f(m0[0])} ${f(m0[1])}`;
  for (let i = 0; i < N; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % N]);
    d += `Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])}`;
  }
  return d + "Z";
}

// Tout est tiré une fois, de façon déterministe (même tronc côté serveur et navigateur)
const RINGS = R_OUT.map((rad, k) => ({
  d: blob(rad, 2 + k * 0.9, 100 + k * 13, k * 0.7, -k * 0.5),
  grain: blob((k === 0 ? 0 : R_OUT[k - 1]) + (rad - (k === 0 ? 0 : R_OUT[k - 1])) / 2, 1.5 + k * 0.6, 300 + k * 7, k * 0.7, -k * 0.5),
}));
const BARK = blob(258, 3.5, 999);
const RAYS = (() => {
  const r = prng(55);
  return Array.from({ length: 30 }, () => {
    const a = r() * Math.PI * 2;
    return `M${CX} ${CY}L${f(CX + 262 * Math.cos(a))} ${f(CY + 262 * Math.sin(a))}`;
  }).join("");
})();
const CRACK = (() => {
  const a = (-52 * Math.PI) / 180;
  const p = (rad: number, off: number) => `${f(CX + rad * Math.cos(a + off))} ${f(CY + rad * Math.sin(a + off))}`;
  return `M${p(262, -0.035)}L${p(150, 0)}L${p(262, 0.035)}Z`;
})();

function Trunk({ active, onPick, reduce }: { active: GroupId; onPick: (id: GroupId) => void; reduce: boolean | null }) {
  const uid = useId().replace(/:/g, "");
  const activeIndex = GROUPS.findIndex((g) => g.id === active);
  const annulus = (k: number) => `${RINGS[k].d} ${k > 0 ? RINGS[k - 1].d : ""}`;

  return (
    <svg viewBox="0 0 520 520" aria-hidden="true" focusable="false" className="mx-auto h-auto w-full max-w-[34rem] drop-shadow-[0_18px_28px_rgba(0,0,0,.55)]">
      <defs>
        <clipPath id={`bark-${uid}`}>
          <path d={BARK} />
        </clipPath>
      </defs>

      <path d={BARK} fill="#3B2314" stroke="#24150b" strokeWidth="2" />

      {/* les cernes, tracés du bord vers le cœur ; chacun apparaît du centre vers l'extérieur */}
      {[...RINGS.keys()].reverse().map((k) => (
        <motion.g
          key={k}
          style={{ transformBox: "view-box", transformOrigin: `${CX}px ${CY}px` }}
          initial={reduce ? false : { opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: reduce ? 0 : k * 0.14, ease: "easeOut" }}
        >
          <path d={RINGS[k].d} fill={TONES[k]} stroke="#4A2C17" strokeOpacity="0.85" strokeWidth="1.6" />
          <path d={RINGS[k].grain} fill="none" stroke="#5E3B20" strokeOpacity="0.28" strokeWidth="0.9" />
        </motion.g>
      ))}

      {/* rayons du bois, fente et moelle */}
      <g clipPath={`url(#bark-${uid})`}>
        <path d={RAYS} stroke="#4A2C17" strokeOpacity="0.12" strokeWidth="0.8" fill="none" />
        <path d={CRACK} fill="#24150b" fillOpacity="0.85" />
      </g>
      <circle cx={CX} cy={CY} r="5" fill="#5A3418" />

      {/* le cerne choisi */}
      {activeIndex >= 0 && <path d={annulus(activeIndex)} fill="#FFC82C" fillOpacity="0.38" fillRule="evenodd" stroke="#FFC82C" strokeWidth="3" strokeLinejoin="round" />}

      {/* zones cliquables à la souris (le clavier passe par la liste) */}
      {[...RINGS.keys()].reverse().map((k) => (
        <path key={`hit-${k}`} d={annulus(k)} fill="transparent" fillRule="evenodd" style={{ cursor: "pointer" }} onClick={() => onPick(GROUPS[k].id)} onMouseEnter={() => onPick(GROUPS[k].id)} />
      ))}
    </svg>
  );
}

/** Épingle en bois (même que sur les pages Projets et Solutions). */
function Pin({ size = 16 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" style={{ filter: "drop-shadow(2px 3px 2px rgba(0,0,0,.55))" }}>
      <defs>
        <radialGradient id={`pw-${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#D9A867" />
          <stop offset="0.6" stopColor="#A9743A" />
          <stop offset="1" stopColor="#6A4120" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="12" fill={`url(#pw-${uid})`} stroke="#4A2C14" strokeWidth="1" />
      <ellipse cx="10" cy="9" rx="3.4" ry="2" fill="#fff" opacity="0.28" />
    </svg>
  );
}

const STITCH = { outline: "2px dashed rgba(233,216,166,.75)", outlineOffset: "-5px" } as const;

/** Fond de tissu indigo tissé, utilisé par les étiquettes cousues. */
const TAG_FABRIC =
  "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0 2px, transparent 2px 4px), #2B3A8C";

/* -------------------------------------------------------------------------- */
/*  L'affiche d'accueil                                                       */
/*  Repère : 100 x 125 (rapport 4/5). Les % des étiquettes suivent ce repère. */
/* -------------------------------------------------------------------------- */

function Poster({ reduce }: { reduce: boolean | null }) {
  const t = useTranslations("AboutPage");
  const uid = useId().replace(/:/g, "");

  return (
    <div className="relative aspect-[4/5] w-full   ">
      {/* fils décoratifs : deux arcs cousus, derrière le portrait */}

      {/* <svg viewBox="0 0 100 185" aria-hidden="true" focusable="false" className="absolute  h-full w-full overflow-visible">
        <defs>
          <path id={`hello-${uid}`} d="M 22 27 Q 50 -2 78 27" />
        </defs>
        <g fill="none" stroke="rgba(233,216,166,.75)" strokeWidth="0.5" strokeDasharray="1.4 1.6" strokeLinecap="round">
          <path d="M 78 24 C 99 30 94 52 68 66" />
          <path d="M 32 70 C 6 80 4 100 15 109" />
          <path d="M 12 105 L 15 109.5 L 19.5 106.5" strokeDasharray="none" />
        </g>
        <text className="font-achiko font-black" fill="#F4EBD0" fontSize="15" letterSpacing="0.6" textAnchor="middle">
          <textPath href={`#hello-${uid}`} startOffset="50%">
            {t("poster.hello")}
          </textPath>
        </text>
      </svg> */}


      {/* Fils décoratifs : arcs cousus et flèche dorée */}
      <svg
        viewBox="0 0 100 185"
        aria-hidden="true"
        focusable="false"
        className="absolute h-full w-full overflow-visible"
      >
        <defs>
          <path id={`hello-${uid}`} d="M 22 27 Q 50 -2 78 27" />
        </defs>


        <g
          fill="none"
          stroke="rgba(233,216,166,0.95)"
          strokeWidth="0.8"
          strokeDasharray="1.8 1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Courbe supérieure droite */}
          <path d="M 78 24 C 99 30 94 52 68 66" />


          <g className="md:hidden" transform="translate(-30, 56)">
            <path d="M 32 70 C 6 80 4 100 15 109" />
            <g transform="rotate(-45 15 109)">
              <path
                d="M 10.8 104.5 L 15 109.5 L 20.2 106.3"
                strokeDasharray="none"
                strokeWidth="1.1"
              />
            </g>
          </g>

          <g className="hidden md:block" transform="translate(-30, 30)">
            <path d="M 32 70 C 6 80 4 100 15 109" />
            <g transform="rotate(-45 15 109)">
              <path
                d="M 10.8 104.5 L 15 109.5 L 20.2 106.3"
                strokeDasharray="none"
                strokeWidth="1.1"
              />
            </g>
          </g>
        </g>



        <text
          className="font-achiko font-black"
          fill="#F4EBD0"
          fontSize="15"
          letterSpacing="0.6"
          textAnchor="middle"
        >
          <textPath href={`#hello-${uid}`} startOffset="50%">
            {t("poster.hello")}
          </textPath>
        </text>
      </svg>


      <div className="absolute inset-x-0  z-[1] flex items-end justify-center pointer-events-none top-[10%]">
        <div className="relative h-[80%] w-[80%] flex items-end justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/yann.png"
            alt={t("content.portrait_alt")}
            className="h-full w-auto max-w-full object-contain object-bottom grayscale contrast-[1.08] drop-shadow-[0_18px_30px_rgba(0,0,0,.6)]"
          />
          {/* fondu vers le fond de page en bas, pour que « I'm Yannick » reste lisible sur le costume */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#0B0D18] via-[#0B0D18]/60 to-transparent" />
        </div>
      </div>

      {/* étiquettes cousues */}
      <ul>
        {POSTER_TAGS.map((tag, i) => (
          <motion.li
            key={tag.key}
            className="absolute z-10 w-[29%] rounded-[3px] px-[2.5%] pb-[1.6%] pt-[2.4%] text-[clamp(.62rem,2.6vw,.9rem)] font-bold leading-tight text-[#F4EBD0] shadow-[0_8px_14px_rgba(0,0,0,.45)]"
            style={{ left: `${tag.left}%`, top: `${tag.top}%`, rotate: tag.rotate, background: TAG_FABRIC, ...STITCH }}
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: reduce ? 0 : 0.2 + i * 0.12, ease: "easeOut" }}
          >
            <span aria-hidden="true" className="absolute -top-1.5 left-1/2 -translate-x-1/2">
              <Pin size={12} />
            </span>
            {t(`poster.tags.${tag.key}`)}
          </motion.li>
        ))}
      </ul>

      {/* « I'm Yannick » : le vrai h1 de la page (« Hello » est lu en début de titre) */}
      <h1 className="absolute bottom-[0%] left-[3%] z-20 font-achiko font-black leading-[0.88] drop-shadow-[0_6px_14px_rgba(0,0,0,.7)]">
        <span className="sr-only">{t("poster.hello")} </span>
        <span className="block text-[clamp(2.4rem,11vw,5rem)] text-white">
          {t("poster.im")}
        </span>

      </h1>


    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function About() {
  const t = useTranslations("AboutPage");
  const reduce = useReducedMotion();
  const [active, setActive] = useState<GroupId>("frontend");
  const group = GROUPS.find((g) => g.id === active) ?? GROUPS[0];
  const activeIndex = GROUPS.findIndex((g) => g.id === active);

  return (
    <div className="relative min-h-screen  bg-[#0B0D18] pb-24 pt-28 font-azurio text-[#F8F9FA]">
      {/* AFFICHE ET PRÉSENTATION */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12 lg:gap-16 lg:px-8">
        <div className="mx-auto w-full max-w-[32rem] md:max-w-none">
          <Poster reduce={reduce} />
        </div>

        <div className="flex w-full flex-col gap-6">
          <h2 className="font-achiko text-3xl font-black leading-[1.05] text-white md:text-5xl">
            {t("content.hero_title_prefix")} {t("content.hero_title_highlight")}
          </h2>
          <p className="max-w-2xl text-base font-light leading-relaxed text-gray-200 md:text-lg">{t("content.hero_description")}</p>

          <dl className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            <div className="border-t-2 border-dashed border-[#E9D8A6]/50 pt-4">
              <dt className="font-achiko text-xl font-black text-[#FFC82C]">{t("content.engineering_title")}</dt>
              <dd className="mt-2 text-sm font-light leading-relaxed text-gray-300">{t("content.engineering_description")}</dd>
            </div>
            <div className="border-t-2 border-dashed border-[#E9D8A6]/50 pt-4">
              <dt className="font-achiko text-xl font-black text-[#FF3B56]">{t("content.culture_title")}</dt>
              <dd className="mt-2 text-sm font-light leading-relaxed text-gray-300">{t("content.culture_description")}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="/cv/NDOH YANNICK TANG - Full Stack Developer - CV.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-[#FFC82C] px-6 py-3 text-center text-sm font-bold text-[#141A3F] transition-colors hover:bg-[#ffd75e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-8 sm:py-4"
            >
              {t("content.download_cv")}
            </a>
            <Link
              href="/CONTACT"
              className="inline-block rounded-xl border border-[#E9D8A6]/50 px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:border-[#E9D8A6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-8 sm:py-4"
            >
              {t("poster.contact")}
            </Link>
          </div>
        </div>
      </section>

      {/* EXPERTISE : la coupe du tronc */}
      <section aria-labelledby="expertise-title" className="mx-auto max-w-6xl border-t border-white/10 px-6 py-20">
        <h2 id="expertise-title" className="font-achiko text-3xl font-black text-white md:text-5xl">
          {t("content.expertise_title_prefix")} {t("content.expertise_title_highlight")}
        </h2>
        <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-gray-300">{t("content.expertise_description")}</p>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <Trunk active={active} onPick={setActive} reduce={reduce} />

          <div>
            {(["skills", "tools"] as const).map((volet) => (
              <div key={volet} className="mb-8">
                <h3 className="mb-3 font-achiko text-sm font-black text-[#E9D8A6]">{t(`expertise.${volet}.title`)}</h3>
                <ul className="flex flex-wrap gap-2">
                  {GROUPS.map((g, i) =>
                    g.volet !== volet ? null : (
                      <li key={g.id}>
                        <button
                          type="button"
                          aria-pressed={active === g.id}
                          onClick={() => setActive(g.id)}
                          className={`flex items-center gap-2.5 rounded-[3px] px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C] ${active === g.id ? "bg-[#FFC82C] text-[#141A3F]" : "bg-[#2B3A8C] text-[#F4EBD0] hover:bg-[#3446A8]"
                            }`}
                          style={active === g.id ? undefined : STITCH}
                        >
                          <span aria-hidden="true" className="size-3.5 rounded-full ring-2 ring-black/40" style={{ background: TONES[i] }} />
                          {t(`expertise.${volet}.groups.${g.id}.title`)}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}

            <div aria-live="polite" className="border-t-2 border-dashed border-[#E9D8A6]/40 pt-6">
              <h3 className="font-achiko text-2xl font-black text-white">{t(`expertise.${group.volet}.groups.${group.id}.title`)}</h3>
              <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-gray-300">{t(`expertise.${group.volet}.groups.${group.id}.description`)}</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-center gap-3">
                    {item.icon && <Image src={`/stack/${item.icon}`} alt="" width={28} height={28} className="size-7 shrink-0 object-contain" />}
                    <span className="text-sm text-gray-100">{item.name}</span>
                  </li>
                ))}
              </ul>
              <p className="sr-only">{activeIndex + 1} / {GROUPS.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS : un registre */}
      <section aria-labelledby="certifs-title" className="mx-auto max-w-6xl border-t border-white/10 px-6 py-20">
        <h2 id="certifs-title" className="font-achiko text-3xl font-black text-white md:text-5xl">
          {t("content.certifications_title_prefix")} {t("content.certifications_title_highlight")}
        </h2>
        <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-gray-300">{t("content.certifications_description")}</p>

        <div className="mt-14 space-y-14">
          {ISSUERS.map((issuer) => {
            const list = certificationsData.filter((c) => c.category === issuer.id);
            return (
              <div key={issuer.id}>
                <h3 className="font-achiko text-xl font-black text-[#E9D8A6]">{t(`content.${issuer.key}`, { count: list.length })}</h3>
                <ul className="mt-4">
                  {list.map((cert) => (
                    <li key={cert.id} className="grid gap-3 border-t-2 border-dashed border-[#E9D8A6]/30 py-6 md:grid-cols-[1fr_auto] md:items-baseline md:gap-10">
                      <div>
                        <h4 className="font-achiko text-lg font-black leading-snug text-white">{cert.title}</h4>
                        <p className="mt-1 text-sm text-gray-400">{cert.skills.join(", ")}</p>
                      </div>
                      <a
                        href={cert.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-[#FFC82C] underline decoration-[#FFC82C]/50 underline-offset-4 hover:decoration-[#FFC82C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC82C]"
                      >
                        {t("content.view_certificate")}
                        <span className="sr-only"> : {cert.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUITE */}
      <div className="px-6 pt-8 text-center">
        <Link
          href="/PROJECT"
          className="inline-block rounded-xl bg-[#FFC82C] px-10 py-4 text-sm font-bold text-[#141A3F] transition-colors hover:bg-[#ffd75e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {t("cta.button")}
        </Link>
      </div>
    </div>
  );
}