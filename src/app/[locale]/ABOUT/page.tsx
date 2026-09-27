"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    voletDescription: "Compétences techniques et ingénierie logicielle pour la construction d'applications web modernes.",
    color: "#FFC82C",
    groups: [
      {
        step: "1",
        stepLabel: "SKILL 01",
        title: "FRONTEND",
        subtitle: "Interfaces Réactives & UX",
        description: "Conception d'interfaces web fluides, performantes et accessibles avec Next.js, Angular et TypeScript.",
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
        description: "Création d'APIs REST hautes performances et services backend sécurisés avec Node.js, Java, Express et Django.",
        color: "#FF3B56",
        borderColor: "rgba(255, 59, 86, 0.3)",
        icon: "pi pi-server",
        tag: "#BACKEND_ENG",
        items: [
          { name: "Node.js", icon: "nodejs3dicon.svg" },
          { name: "Java", icon: "java3dicon.svg" },
          { name: "Express.js" ,icon: "express3dicon.svg"},
          { name: "Django",icon: "django3dicon.svg" },
          { name: "API REST", icon: "postman3dicon.svg" },
        ],
      },
      {
        step: "3",
        stepLabel: "SKILL 03",
        title: "DATA & WEB3",
        subtitle: "Bases de Données & Blockchain",
        description: "Modélisation de données (SQL & NoSQL) et intégration des protocoles décentralisés Web3.",
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
    voletDescription: "Suite logicielle, prototypage design, versioning et outils de développement collaboratif au quotidien.",
    color: "#FFE57F",
    groups: [
      {
        step: "4",
        stepLabel: "OUTIL 01",
        title: "DESIGN & CREATION",
        subtitle: "Prototypage UI/UX & Canvas Visuel",
        description: "Design d'interfaces futuristes sur Figma, suite Adobe (Photoshop, Illustrator) et organisation créative sur Milanote.",
        color: "#FFE57F",
        borderColor: "rgba(255, 229, 127, 0.3)",
        icon: "pi pi-palette",
        tag: "#DESIGN_TOOLS",
        items: [
          { name: "Figma", icon: "figma.svg" },
          { name: "Photoshop", icon: "potoshop3dicon.svg" },
          { name: "Illustrator", icon: "illustrator.svg" },
          { name: "Milanote", icon: "milanote3dicon.svg" },
          { name: "Canva & Graphic UI",icon: "canva3dicon.svg" },
        ],
      },
      {
        step: "5",
        stepLabel: "OUTIL 02",
        title: "DEV & ENVIRONMENT",
        subtitle: "Éditeur, Versioning & Hosting",
        description: "Environnement de développement sur VS Code, gestion de dépôt Git, GitHub, GitLab, Postman et déploiement Vercel.",
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
        description: "Planification Agile sur Trello, intégration CMS sur WordPress et suivi de projet collaboratif.",
        color: "#A855F7",
        borderColor: "rgba(168, 85, 247, 0.3)",
        icon: "pi pi-sliders-h",
        tag: "#WORKFLOW_AGILE",
        items: [
          { name: "Trello", icon: "trello3dicon.svg" },
          
        ],
      },
    ],
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

export default function About() {
  const t = useTranslations("AboutPage");
  const [activeVoletIndex, setActiveVoletIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const activeVolet = voletsData[activeVoletIndex];

  const handleSelectVolet = (index: number) => {
    setDirection(index > activeVoletIndex ? 1 : -1);
    setActiveVoletIndex(index);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveVoletIndex((prev) => (prev === 0 ? voletsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveVoletIndex((prev) => (prev === voletsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] font-azurio pt-28 pb-24">
      {/* HEADER SECTION */}
      <section className="relative pt-10 pb-16 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: ID Card */}
          <div className="lg:col-span-5 relative font-azurio">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-4 rounded-3xl border border-[#FFC82C] shadow-[0_0_35px_rgba(255,200,44,0.2)]"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15 bg-[#0B0D18]">
                <img
                  src="/images/yann.jpg"
                  alt="KingTang"
                  className="object-cover h-full w-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bio */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-achiko text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                INGÉNIERIE LOGICIELLE &amp; <span className="text-[#FFC82C]">VISION CREATIVE</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-azurio text-base md:text-lg text-gray-200 leading-relaxed font-light"
            >
              Développeur full-stack, je conçois des applications web de bout en bout : interfaces soignées, API, bases de données et intégrations. J’allie architecture fiable, expérience utilisateur et expression culturelle.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border border-white/15 font-azurio">
                <span className="font-achiko text-xl font-black text-[#FFC82C] block mb-2">FULL-STACK ENGINEERING</span>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  Next.js, Angular, Node.js, Express.js et Django, des interfaces aux API.
                </p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border border-white/15 font-azurio">
                <span className="font-achiko text-xl font-black text-[#FF3B56] block mb-2">AFRO-FUTURISM UX</span>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  Design d’interface fondé sur les mathématiques des motifs africains ancestraux.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP SWIPER / EXPERTISE SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative border-t border-white/10">
        
        {/* NARRATIVE HEADER (MON EXPERTISE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#FFC82C]/10 text-[#FFC82C] border border-[#FFC82C]/30 mb-4">
              <i className="pi pi-compass text-xs" /> Swiper d&apos;Expertise en 2 Volets
            </div>
            
            <h2 className="font-achiko text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight leading-none">
              MON <span className="text-[#FFC82C]">EXPERTISE</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-gray-300 font-light max-w-xl leading-relaxed">
              Naviguez interactivement entre le <strong>Volet 1 : Mes Skills</strong> et le <strong>Volet 2 : Mes Outils</strong> via le Swiper ci-dessous.
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
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${
                      isActive ? "bg-black text-[#FFC82C]" : "bg-white/10 text-gray-300"
                    }`}>
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
        <div className="relative min-h-[600px] overflow-hidden rounded-3xl pt-4">
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
                  <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none" fill="none">
                    <path
                      d="M 500 0 C 500 80, 800 80, 800 240 C 800 400, 200 400, 200 560 C 200 720, 500 720, 500 800"
                      stroke="#1B2035"
                      strokeWidth="50"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 500 0 C 500 80, 800 80, 800 240 C 800 400, 200 400, 200 560 C 200 720, 500 720, 500 800"
                      stroke="#0D0F1C"
                      strokeWidth="40"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 500 0 C 500 80, 800 80, 800 240 C 800 400, 200 400, 200 560 C 200 720, 500 720, 500 800"
                      stroke={activeVolet.color}
                      strokeWidth="42"
                      strokeLinecap="round"
                      opacity="0.25"
                    />
                    <path
                      d="M 500 0 C 500 80, 800 80, 800 240 C 800 400, 200 400, 200 560 C 200 720, 500 720, 500 800"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                      strokeDasharray="12 12"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg>
                </div>

                {/* MOBILE VERTICAL ROAD LINE */}
                <div className="lg:hidden absolute left-6 sm:left-10 top-0 bottom-0 w-2.5 bg-[#121526] border-x border-white/20 z-0">
                  <div className="w-full h-full border-r border-dashed border-white/40" />
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
                            <h4 className="font-achiko text-lg font-bold uppercase tracking-wider" style={{ color: group.color }}>
                              {group.title}
                            </h4>
                          </div>
                        </div>

                        {/* DESKTOP ALTERNATING CARD PLACEMENT */}
                        <div className={`lg:col-span-6 ${isEven ? "lg:pr-8" : "lg:pl-8 lg:col-start-7"}`}>
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
                              <i className={`${group.icon} text-2xl opacity-80`} style={{ color: group.color }} />
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
                                      style={{ filter: `drop-shadow(0 0 3px ${group.color}bb) drop-shadow(0 0 10px ${group.color}66)` }}
                                    />
                                  ) : (
                                    <span
                                      className="h-24  flex items-center text-2xl transition-all duration-300 group-hover/icon:scale-110"
                                      style={{ color: group.color, filter: `drop-shadow(0 0 3px ${group.color}bb) drop-shadow(0 0 15px ${group.color}66)` }}
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
                        <div className={`hidden lg:flex lg:col-span-6 items-center justify-center ${
                          isEven ? "lg:col-start-7 lg:pl-12" : "lg:col-start-1 lg:row-start-1 lg:pr-12"
                        }`}>
                          <div className="relative flex items-center justify-center">
                            <div
                              className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed opacity-60"
                              style={{ borderColor: group.color }}
                            />
                            <div
                              className="absolute w-16 h-16 rounded-full flex flex-col items-center justify-center text-black shadow-[0_0_30px_rgba(0,0,0,0.8)] border-4 border-[#0B0D18] z-20 transition-transform hover:scale-110"
                              style={{ backgroundColor: group.color }}
                            >
                              <span className="font-achiko text-2xl font-black leading-none">{group.step}</span>
                              <span className="text-[8px] font-bold tracking-tighter uppercase font-mono">NODE</span>
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

      {/* CTA FOOTER LINK */}
      <div className="text-center pt-8 relative z-10">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
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



