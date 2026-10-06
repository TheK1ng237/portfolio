"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

type SkillBarProps = {
  name: string;
  icon?: string;
};

type SkillGroupItem = {
  step: string;
  stepLabel: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  borderColor: string;
  icon: string;
  tag: string;
  items: SkillBarProps[];
};

type VoletItem = {
  id: string;
  voletNumber: string;
  voletTitle: string;
  voletDescription: string;
  color: string;
  groups: SkillGroupItem[];
};

const voletsData: VoletItem[] = [
  {
    id: "skills",
    voletNumber: "VOLET 01",
    voletTitle: "MES SKILLS",
    voletDescription:
      "Compétences techniques et ingénierie logicielle pour la construction d'applications web modernes.",
    color: "#FFC82C",
    groups: [
      {
        step: "1",
        stepLabel: "SKILL 01",
        title: "FRONTEND",
        subtitle: "Interfaces Réactives & UX",
        description:
          "Conception d'interfaces web fluides, performantes et accessibles avec Next.js, Angular et TypeScript.",
        color: "#FFC82C",
        borderColor: "rgba(255, 200, 44, 0.3)",
        icon: "pi pi-desktop",
        tag: "#FRONTEND_DEV",
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
        step: "2",
        stepLabel: "SKILL 02",
        title: "BACKEND & LANGAGES",
        subtitle: "Architecture Serveur & APIs RESTful",
        description:
          "Création d'APIs REST hautes performances et services backend sécurisés avec Node.js, Java, Express et Django.",
        color: "#FF3B56",
        borderColor: "rgba(255, 59, 86, 0.3)",
        icon: "pi pi-server",
        tag: "#BACKEND_ENG",
        items: [
          { name: "Node.js", icon: "nodejs3dicon.svg" },
          { name: "Java", icon: "java3dicon.svg" },
          { name: "Express.js", icon: "express3dicon.svg" },
          { name: "Django", icon: "django3dicon.svg" },
          { name: "API REST", icon: "postman3dicon.svg" },
        ],
      },
      {
        step: "3",
        stepLabel: "SKILL 03",
        title: "DATA & WEB3",
        subtitle: "Bases de Données & Blockchain",
        description:
          "Modélisation de données (SQL & NoSQL) et intégration des protocoles décentralisés Web3.",
        color: "#10B981",
        borderColor: "rgba(16, 185, 129, 0.3)",
        icon: "pi pi-database",
        tag: "#DATA_WEB3",
        items: [
          { name: "MongoDB", icon: "mongodb3dicon.svg" },
          { name: "PostgreSQL", icon: "postgres3dicon.svg" },
          { name: "MySQL", icon: "mysql3dicon.svg" },
          { name: "Supabase", icon: "supabase3dicon.svg" },
          { name: "MetaMask & Blockchain", icon: "metamask3dicon.svg" },
        ],
      },
    ],
  },
  {
    id: "outils",
    voletNumber: "VOLET 02",
    voletTitle: "MES OUTILS",
    voletDescription:
      "Suite logicielle, prototypage design, versioning et outils de développement collaboratif au quotidien.",
    color: "#FFE57F",
    groups: [
      {
        step: "4",
        stepLabel: "OUTIL 01",
        title: "DESIGN & CREATION",
        subtitle: "Prototypage UI/UX & Canvas Visuel",
        description:
          "Design d'interfaces futuristes sur Figma, suite Adobe (Photoshop, Illustrator) et organisation créative sur Milanote.",
        color: "#FFE57F",
        borderColor: "rgba(255, 229, 127, 0.3)",
        icon: "pi pi-palette",
        tag: "#DESIGN_TOOLS",
        items: [
          { name: "Figma", icon: "figma.svg" },
          { name: "Photoshop", icon: "potoshop3dicon.svg" },
          { name: "Illustrator", icon: "illustrator.svg" },
          { name: "Milanote", icon: "milanote3dicon.svg" },
          { name: "Canva & Graphic UI", icon: "canva3dicon.svg" },
        ],
      },
      {
        step: "5",
        stepLabel: "OUTIL 02",
        title: "DEV & ENVIRONMENT",
        subtitle: "Éditeur, Versioning & Hosting",
        description:
          "Environnement de développement sur VS Code, gestion de dépôt Git, GitHub, GitLab, Postman et déploiement Vercel.",
        color: "#3B82F6",
        borderColor: "rgba(59, 130, 246, 0.3)",
        icon: "pi pi-code",
        tag: "#DEV_ENVIRONMENT",
        items: [
          { name: "VS Code", icon: "vscode3dicon.svg" },
          { name: "Git", icon: "git3dicon.svg" },
          { name: "GitHub", icon: "github3dicon.svg" },
          { name: "GitLab", icon: "gitlab3dicon.svg" },
          { name: "Postman", icon: "postman3dicon.svg" },
          { name: "Vercel", icon: "vercel3dicon.svg" },
        ],
      },
      {
        step: "6",
        stepLabel: "OUTIL 03",
        title: "ORGANISATION & WORKFLOW",
        subtitle: "Gestion de Projet & CMS",
        description:
          "Planification Agile sur Trello, intégration CMS sur WordPress et suivi de projet collaboratif.",
        color: "#A855F7",
        borderColor: "rgba(168, 85, 247, 0.3)",
        icon: "pi pi-sliders-h",
        tag: "#WORKFLOW_AGILE",
        items: [{ name: "Trello", icon: "trello3dicon.svg" }],
      },
    ],
  },
];

const certificationsData = [
  {
    id: "nextjs",
    title: "Next.js 15 & React - Le Guide Complet",
    issuer: "Udemy",
    category: "UDEMY",
    pdf: "/certif/UdemyNextjs.pdf",
    icon: "pi-desktop",
    color: "#FFC82C",
    skills: ["Next.js 15", "React 19", "Server Components", "SSR"],
  },
  {
    id: "typescript",
    title: "TypeScript: Masterclass Ingénierie & Typage Avancé",
    issuer: "Udemy",
    category: "UDEMY",
    pdf: "/certif/UdemyTypescript.pdf",
    icon: "pi-code",
    color: "#3B82F6",
    skills: ["TypeScript", "Generics", "Type Safety", "Interfaces"],
  },
  {
    id: "angular",
    title: "Développez des Applications Web avec Angular",
    issuer: "OpenClassrooms",
    category: "OPENCLASSROOMS",
    pdf: "/certif/Openclassroomangular.pdf",
    icon: "pi-shield",
    color: "#FF3B56",
    skills: ["Angular", "RxJS", "TypeScript", "Services"],
  },
  {
    id: "javascript",
    title: "Apprenez à Programmer avec JavaScript",
    issuer: "OpenClassrooms",
    category: "OPENCLASSROOMS",
    pdf: "/certif/Openclassroomjavascript.pdf",
    icon: "pi-bolt",
    color: "#FFC82C",
    skills: ["JavaScript ES6+", "DOM API", "Promises", "Async/Await"],
  },
  {
    id: "html-css",
    title: "Créez votre site web avec HTML5 et CSS3",
    issuer: "OpenClassrooms",
    category: "OPENCLASSROOMS",
    pdf: "/certif/Openclassroomhtml-css.pdf",
    icon: "pi-palette",
    color: "#10B981",
    skills: ["HTML5", "CSS3", "Flexbox", "Responsive Design"],
  },
  {
    id: "tailwindcss",
    title: "Tailwind CSS: Masterclass Design System & Utility-First",
    issuer: "Udemy",
    category: "UDEMY",
    pdf: "/certif/UdemyTailwindcss.pdf",
    icon: "pi-sliders-h",
    color: "#06B6D4",
    skills: ["Tailwind CSS", "Design Tokens", "UI Architecture"],
  },
  {
    id: "java",
    title: "Apprenez les Bases du Langage Java",
    issuer: "OpenClassrooms",
    category: "OPENCLASSROOMS",
    pdf: "/certif/Openclassroomjava.pdf",
    icon: "pi-server",
    color: "#F97316",
    skills: ["Java", "POO", "JVM", "Classes & Héritage"],
  },
  {
    id: "dart",
    title: "Dart: Masterclass Développement Mobile & Flutter",
    issuer: "Udemy",
    category: "UDEMY",
    pdf: "/certif/UdemyDart.pdf",
    icon: "pi-mobile",
    color: "#02569B",
    skills: ["Dart", "Mobile Dev", "Async", "Flutter SDK"],
  },
  {
    id: "figma",
    title: "Concevez des Maquettes et Prototypes avec Figma",
    issuer: "OpenClassrooms",
    category: "OPENCLASSROOMS",
    pdf: "/certif/Openclassroomfigma.pdf",
    icon: "pi-prime",
    color: "#A855F7",
    skills: ["Figma", "UI/UX Prototyping", "Wireframes", "Design Systems"],
  },
  {
    id: "veille",
    title: "Réaliser une Veille Technologique et Scientifique",
    issuer: "OpenClassrooms",
    category: "OPENCLASSROOMS",
    pdf: "/certif/Openclassroomveilletechnique.pdf",
    icon: "pi-compass",
    color: "#10B981",
    skills: ["Veille Techno", "R&D", "Innovation Web", "Feedly"],
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    scale: 0.96,
  }),
};

const atelierStages = [
  {
    number: "01",
    title: "Comprendre",
    label: "LE BESOIN",
    description: "Clarifier le contexte, les objectifs et les personnes pour lesquelles on conçoit.",
    color: "#FFC82C",
    icon: "pi pi-compass",
  },
  {
    number: "02",
    title: "Dessiner",
    label: "L'EXPÉRIENCE",
    description: "Structurer les parcours et l'interface avant de choisir la solution technique.",
    color: "#FF3B56",
    icon: "pi pi-pencil",
  },
  {
    number: "03",
    title: "Construire",
    label: "LE PRODUIT",
    description: "Relier frontend, API et données dans une architecture claire et maintenable.",
    color: "#10B981",
    icon: "pi pi-code",
  },
  {
    number: "04",
    title: "Faire évoluer",
    label: "LA SUITE",
    description: "Tester, livrer et continuer à apprendre pour améliorer chaque version.",
    color: "#59CBE8",
    icon: "pi pi-sync",
  },
];

const parcoursSteps = [
  {
    title: "Dessiner l’expérience",
    text: "Partir des besoins réels, organiser l’information et rendre chaque interface simple à parcourir.",
    accent: "#FFC82C",
  },
  {
    title: "Construire le produit",
    text: "Étendre cette attention au frontend, aux API et aux données pour livrer des applications cohérentes de bout en bout.",
    accent: "#10B981",
  },
  {
    title: "Créer avec une identité",
    text: "Associer ingénierie moderne et expression culturelle pour donner aux projets une présence qui leur ressemble.",
    accent: "#FF3B56",
  },
];

export default function About() {
  const t = useTranslations("AboutPage");
  const prefersReducedMotion = useReducedMotion();
  const [activeVoletIndex, setActiveVoletIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [certifCategoryFilter, setCertifCategoryFilter] = useState("ALL");

  const activeVolet = voletsData[activeVoletIndex];

  const handleSelectVolet = (index: number) => {
    setDirection(index > activeVoletIndex ? 1 : -1);
    setActiveVoletIndex(index);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveVoletIndex((prev) =>
      prev === 0 ? voletsData.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setDirection(1);
    setActiveVoletIndex((prev) =>
      prev === voletsData.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0D18] pb-16 pt-20 font-azurio text-[#F8F9FA] sm:pt-24">
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
        <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="relative font-azurio sm:row-span-2 lg:col-span-4 lg:row-span-1">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto max-w-[360px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden border border-[#FFC82C]/45 bg-[#121526] sm:rounded-t-[45%] sm:rounded-b-sm">
                <Image
                  src="/images/yann.jpg"
                  alt="Thek1ng237"
                  fill
                  priority
                  sizes="(max-width: 639px) 96px, (max-width: 1023px) 38vw, 360px"
                  className="object-cover object-[center_28%]"
                />
              </div>
              <span className="absolute -bottom-3 -right-2 bg-[#FFC82C] px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[#0B0D18] sm:-right-3 sm:px-3 sm:py-2 sm:text-[10px]">Full-stack · UX</span>
            </motion.div>
          </div>

          <div className="min-w-0 space-y-4 sm:space-y-5 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="mb-2 font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#FFC82C] sm:text-[10px] sm:tracking-[0.2em]">MON ATELIER NUMÉRIQUE · DOUALA, CAMEROUN</p>
              <h1 className="break-words font-achiko text-[clamp(1.35rem,5.3vw,4rem)] font-black uppercase leading-[1.04] text-white">
                Je transforme les idées en{" "}
                <span className="text-[#FFC82C]">expériences numériques.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-xs font-light leading-relaxed text-gray-200 sm:text-base lg:text-lg"
            >
              Je suis développeur full-stack. Je relie design d’interface,
              architecture backend et expression culturelle pour concevoir des
              produits web utiles, lisibles et durables.
            </motion.p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 border-l-2 border-[#FF3B56] pl-3 text-[9px] font-bold uppercase tracking-[0.08em] text-white/55 sm:gap-x-6 sm:pl-4 sm:text-[10px] sm:tracking-[0.12em]">
              <span>Design UI/UX</span><span>Frontend</span><span>API &amp; data</span>
            </div>
          </div>

          <div className="col-span-2 flex flex-wrap gap-3 sm:col-span-1 lg:col-span-8 lg:col-start-5">
            <a
              href="/cv/NDOH YANNICK TANG - Full Stack Developer - CV.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#FFC82C] px-4 py-3 font-achiko text-[10px] font-bold uppercase tracking-[0.08em] text-[#101018] transition hover:bg-[#FFE57F] sm:px-6 sm:text-xs sm:tracking-[0.14em]"
            >
              <i className="pi pi-file-pdf" aria-hidden="true" /> Télécharger mon CV
            </a>
            <a href="#mon-atelier" className="inline-flex min-h-11 items-center gap-2 border border-white/20 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white/75 transition hover:border-[#10B981] hover:text-[#10B981] sm:px-5 sm:text-xs sm:tracking-[0.12em]">
              Découvrir ma méthode <i className="pi pi-arrow-down" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <nav aria-label="Sommaire de la page À propos" className="relative z-20 border-y border-white/10 bg-[#0B0D18]/95">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3 sm:gap-9 sm:px-6">
          {[
            ["#mon-parcours", "Mon parcours"],
            ["#mon-atelier", "Ma méthode"],
            ["#expertises", "Expertises & outils"],
            ["#certifications", "Certifications"],
          ].map(([href, label], index) => (
            <a key={href} href={href} className="flex shrink-0 items-center gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-white/50 transition hover:text-[#FFC82C] sm:text-[10px] sm:tracking-[0.13em]">
              <span className="font-mono text-[#FFC82C]/70">0{index + 1}</span>{label}
            </a>
          ))}
        </div>
      </nav>

      <section id="mon-parcours" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.5fr] lg:items-start">
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#FF3B56]">MON PARCOURS</p>
            <h2 className="mt-3 max-w-sm font-achiko text-3xl font-black uppercase leading-tight text-white sm:text-5xl">Du pixel au <span className="text-[#FF3B56]">produit complet.</span></h2>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/55">Mon approche s’est construite autour d’un même fil : rendre la technologie claire, utile et expressive.</p>
          </div>
          <div className="border-l border-white/15 pl-5 sm:pl-8">
            {parcoursSteps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="relative pb-7 last:pb-0 sm:pb-9"
              >
                <span className="absolute -left-[26px] top-1 grid size-3 place-items-center rounded-full border-2 border-[#0B0D18] sm:-left-[39px]" style={{ backgroundColor: step.accent, boxShadow: `0 0 18px ${step.accent}70` }} />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: step.accent }}>0{index + 1} / REPÈRE</span>
                <h3 className="mt-1 font-achiko text-lg font-bold text-white sm:text-xl">{step.title}</h3>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/50 sm:text-sm">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="mon-atelier" className="relative z-10 border-y border-white/10 bg-[#10131d] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr] lg:items-end">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#10B981]">LE PROCESSUS DE CRÉATION</p>
              <h2 className="mt-3 max-w-md font-achiko text-3xl font-black uppercase leading-tight text-white sm:text-5xl">De l’idée au <span className="text-[#10B981]">produit.</span></h2>
            </div>
            <p className="max-w-2xl text-sm font-light leading-relaxed text-white/55 sm:text-base">Chaque projet traverse quatre temps. L’atelier relie la compréhension du besoin, l’expérience, l’ingénierie et l’amélioration continue.</p>
          </div>

          <div className="mt-10 grid gap-0 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {atelierStages.map((stage, index) => (
              <motion.article
                key={stage.number}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className="relative border-t border-white/15 py-5 pr-5 sm:min-h-48 sm:border-l sm:border-t-0 sm:pl-5 sm:first:border-l-0 lg:min-h-56"
              >
                <span className="font-achiko text-4xl font-black" style={{ color: stage.color }}>{stage.number}</span>
                <div className="mt-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/40"><i className={stage.icon} style={{ color: stage.color }} aria-hidden="true" />{stage.label}</div>
                <h3 className="mt-2 font-achiko text-xl font-bold text-white">{stage.title}</h3>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/50">{stage.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="expertises" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 border-t border-white/10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#FFC82C]">LES OUTILS DE L’ATELIER</p>
            <h2 className="font-achiko text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight leading-none">
              Mes <span className="text-[#FFC82C]">expertises</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-gray-300 font-light max-w-xl leading-relaxed">
              Des compétences qui couvrent le produit de bout en bout. Choisis un domaine pour parcourir les outils utilisés dans mon travail.
            </p>
          </motion.div>

          {/* SWIPER TAB BUTTONS & NAV CONTROLS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center lg:justify-end gap-4"
          >
            {/* Volet Tabs */}
            <div className="p-1.5 rounded-2xl glass-card border border-white/15 flex items-center gap-2 bg-[#121526]">
              {voletsData.map((volet, idx) => {
                const isActive = activeVoletIndex === idx;
                return (
                  <button
                    key={volet.id}
                    onClick={() => handleSelectVolet(idx)}
                    className={`px-5 py-3 rounded-xl font-achiko text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? "bg-[#FFC82C] text-black shadow-[0_0_25px_rgba(255,200,44,0.4)] scale-105"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${
                        isActive
                          ? "bg-black text-[#FFC82C]"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    {volet.voletTitle}
                  </button>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Volet précédent"
                className="w-12 h-12 rounded-2xl glass-card border border-white/15 flex items-center justify-center text-white hover:border-[#FFC82C] hover:bg-[#FFC82C]/10 transition-all cursor-pointer group"
              >
                <i className="pi pi-chevron-left text-lg group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Volet suivant"
                className="w-12 h-12 rounded-2xl glass-card border border-white/15 flex items-center justify-center text-white hover:border-[#FFC82C] hover:bg-[#FFC82C]/10 transition-all cursor-pointer group"
              >
                <i className="pi pi-chevron-right text-lg group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* SWIPER CONTAINER WITH ANIMATE PRESENCE */}
        <div className="relative min-h-[420px] overflow-hidden pt-4 sm:min-h-[560px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeVolet.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              {/* VOLET SLIDE BANNER */}
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/10">
                <div
                  className="px-4 py-2 rounded-xl text-xs font-achiko font-black uppercase text-black shadow-lg"
                  style={{ backgroundColor: activeVolet.color }}
                >
                  {activeVolet.voletNumber}
                </div>
                <div>
                  <h3 className="font-achiko text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                    {activeVolet.voletTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 font-light mt-1">
                    {activeVolet.voletDescription}
                  </p>
                </div>
              </div>

              {/* ROADMAP CONTENT FOR THIS VOLET */}
              <div className="relative">
                {/* DESKTOP SVG ROAD PATH */}
                <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 1000 800"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M 500 0 C 500 80, 800 80, 800 240 C 800 400, 200 400, 200 560 C 200 720, 500 720, 500 800"
                      stroke={activeVolet.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.35"
                    />
                    <path
                      d="M 500 0 C 500 80, 800 80, 800 240 C 800 400, 200 400, 200 560 C 200 720, 500 720, 500 800"
                      stroke="#FFFFFF"
                      strokeWidth="1"
                      strokeDasharray="3 12"
                      strokeLinecap="round"
                      opacity="0.45"
                    />
                  </svg>
                </div>

                {/* MOBILE VERTICAL ROAD LINE */}
                <div className="lg:hidden absolute left-[25px] sm:left-[49px] top-0 bottom-0 w-px bg-white/15 z-0">
                  <div className="absolute inset-0 border-r border-dashed border-white/30" />
                </div>

                {/* GROUPS INSIDE VOLET */}
                <div className="space-y-12 lg:space-y-20 relative z-10">
                  {activeVolet.groups.map((group, index) => {
                    const isEven = index % 2 === 0;

                    return (
                      <div
                        key={group.title}
                        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                          isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                        }`}
                      >
                        {/* MOBILE ROADMAP STEP BADGE */}
                        <div className="lg:hidden flex items-center gap-4 pl-1 sm:pl-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-achiko text-xl font-black text-black shadow-lg ring-4 ring-[#0B0D18]"
                            style={{ backgroundColor: group.color }}
                          >
                            {group.step}
                          </div>
                          <div>
                            <span className="text-xs font-mono font-bold tracking-widest text-gray-400 block">
                              {group.stepLabel} &bull; {activeVolet.voletTitle}
                            </span>
                            <h4
                              className="font-achiko text-lg font-bold uppercase tracking-wider"
                              style={{ color: group.color }}
                            >
                              {group.title}
                            </h4>
                          </div>
                        </div>

                        {/* DESKTOP ALTERNATING CARD PLACEMENT */}
                        <div
                          className={`lg:col-span-6 ${isEven ? "lg:pr-8" : "lg:pl-8 lg:col-start-7"}`}
                        >
                          <div
                            className="glass-card p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative group overflow-hidden"
                            style={{ borderColor: group.borderColor }}
                          >
                            {/* Ambient Card Glow */}
                            <div
                              className="absolute -right-16 -top-16 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                              style={{ backgroundColor: group.color }}
                            />

                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-achiko font-black text-lg"
                                  style={{ backgroundColor: group.color }}
                                >
                                  {group.step}
                                </div>
                                <div>
                                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
                                    {group.stepLabel} &bull; {group.tag}
                                  </span>
                                  <h4 className="font-achiko text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                                    {group.title}
                                  </h4>
                                </div>
                              </div>
                              <i
                                className={`${group.icon} text-2xl opacity-80`}
                                style={{ color: group.color }}
                              />
                            </div>

                            <p className="text-xs sm:text-sm text-gray-300 font-light mb-6 leading-relaxed">
                              {group.description}
                            </p>

                            {/* SKILLS / TOOLS GRID */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {group.items.map((item: SkillBarProps) => (
                                <motion.div
                                  key={item.name}
                                  whileHover={{ scale: 1.04, y: -2 }}
                                  className="group/icon min-h-24 flex flex-col items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center "
                                >
                                  {item.icon ? (
                                    <Image
                                      src={`/stack/${item.icon}`}
                                      alt={item.name}
                                      width={38}
                                      height={38}
                                      className="h-24 w-24 object-contain transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:brightness-125"
                                      style={{
                                        filter: `drop-shadow(0 0 3px ${group.color}bb) drop-shadow(0 0 10px ${group.color}66)`,
                                      }}
                                    />
                                  ) : (
                                    <span
                                      className="h-24  flex items-center text-2xl transition-all duration-300 group-hover/icon:scale-110"
                                      style={{
                                        color: group.color,
                                        filter: `drop-shadow(0 0 3px ${group.color}bb) drop-shadow(0 0 15px ${group.color}66)`,
                                      }}
                                    >
                                      <i className="pi pi-bolt" />
                                    </span>
                                  )}
                                  <span className="text-[11px] font-bold leading-tight text-gray-200">
                                    {item.name}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* DESKTOP CENTER ROAD MAP BADGE PIN */}
                        <div
                          className={`hidden lg:flex lg:col-span-6 items-center justify-center ${
                            isEven
                              ? "lg:col-start-7 lg:pl-12"
                              : "lg:col-start-1 lg:row-start-1 lg:pr-12"
                          }`}
                        >
                          <div className="relative flex items-center justify-center">
                            <div
                              className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed opacity-60"
                              style={{ borderColor: group.color }}
                            />
                            <div
                              className="absolute w-16 h-16 rounded-full flex flex-col items-center justify-center text-black shadow-[0_0_30px_rgba(0,0,0,0.8)] border-4 border-[#0B0D18] z-20 transition-transform hover:scale-110"
                              style={{ backgroundColor: group.color }}
                            >
                              <span className="font-achiko text-2xl font-black leading-none">
                                {group.step}
                              </span>
                              <span className="text-[8px] font-bold tracking-tighter uppercase font-mono">
                                NODE
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SWIPER PAGINATION INDICATORS */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {voletsData.map((volet, idx) => {
            const isActive = activeVoletIndex === idx;
            return (
              <button
                key={volet.id}
                onClick={() => handleSelectVolet(idx)}
                aria-label={`Aller au ${volet.voletTitle}`}
                className={`h-3 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "w-10 bg-[#FFC82C] shadow-[0_0_15px_rgba(255,200,44,0.6)]"
                    : "w-3 bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
      </section>

      {/* CERTIFICATIONS & ACCRÉDITATIONS SECTION */}
      <section id="certifications" className="scroll-mt-28 py-16 px-4 max-w-7xl mx-auto z-10 relative border-t border-white/10 font-azurio sm:px-6 sm:py-24">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-achiko text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight leading-none">
              CERTIFICATIONS &amp;{" "}
              <span className="text-[#FFC82C]">DIPLÔMES</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-gray-300 font-light max-w-xl leading-relaxed">
              Formations certifiantes et diplômes obtenus sur{" "}
              <strong>OpenClassrooms</strong> et <strong>Udemy</strong>{" "}
              attestant d&apos;une maîtrise technique rigoureuse.
            </p>
          </motion.div>

          {/* FILTER TABS */}
          <div className="p-1.5 rounded-2xl glass-card border border-white/15 flex flex-wrap items-center gap-2 bg-[#121526] self-start md:self-auto">
            {[
              { id: "ALL", label: "TOUS (10)" },
              { id: "OPENCLASSROOMS", label: "OPENCLASSROOMS (6)" },
              { id: "UDEMY", label: "UDEMY (4)" },
            ].map((tab) => {
              const isActive = certifCategoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCertifCategoryFilter(tab.id)}
                  className={`px-4 py-2.5 rounded-xl font-achiko text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FFC82C] text-black shadow-[0_0_20px_rgba(255,200,44,0.4)] scale-105"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CERTIFICATIONS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificationsData
            .filter(
              (cert) =>
                certifCategoryFilter === "ALL" ||
                cert.category === certifCategoryFilter,
            )
            .map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="glass-card rounded-3xl p-6 border border-white/15 hover:border-[#FFC82C] transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden bg-[#121526]/90"
              >
                {/* Ambient Subtle Glow */}
                <div
                  className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: cert.color }}
                />

                <div>
                  {/* Card Header: Platform Tag + Icon */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border"
                      style={{
                        backgroundColor: `${cert.color}15`,
                        borderColor: `${cert.color}40`,
                        color: cert.color,
                      }}
                    >
                      {cert.issuer}
                    </span>

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: cert.color }}
                    >
                      <i className={`pi ${cert.icon} text-base`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-achiko text-lg font-bold uppercase text-white tracking-tight leading-snug mb-3 group-hover:text-[#FFC82C] transition-colors">
                    {cert.title}
                  </h3>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* PDF Download Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">
                    FORMAT: PDF VERIFIÉ
                  </span>

                  <a
                    href={cert.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#FFC82C] text-white hover:text-black font-achiko text-xs font-bold uppercase tracking-wider transition-all border border-white/15 hover:border-[#FFC82C] group/btn cursor-pointer"
                  >
                    <i className="pi pi-file-pdf text-sm" />
                    <span>VOIR DIPLÔME</span>
                  </a>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* CTA FOOTER LINK */}
      <div className="text-center pt-8 relative z-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href="/PROJECT"
            className="px-10 py-4 bg-[#FFC82C] text-black font-achiko font-bold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(255,200,44,0.4)] transition-all inline-block"
          >
            {t("cta.button")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
