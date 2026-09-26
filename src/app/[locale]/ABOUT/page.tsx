"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type SkillBarProps = {
  name: string;
  icon?: string;
};

const stackGroups = [
  {
    title: "FRONTEND",
    color: "#FFC82C",
    icon: "pi pi-desktop",
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
    title: "BACKEND & API",
    color: "#FF3B56",
    icon: "pi pi-server",
    items: [
      { name: "Node.js", icon: "nodejs3dicon.svg" },
      { name: "Express.js" },
      { name: "Django" },
      { name: "API REST", icon: "postman3dicon.svg" },
    ],
  },
  {
    title: "DATA & WEB3",
    color: "#10B981",
    icon: "pi pi-database",
    items: [
      { name: "MongoDB" },
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "Supabase" },
      { name: "MetaMask & blockchain" },
    ],
  },
  {
    title: "DESIGN & OUTILS",
    color: "#FFE57F",
    icon: "pi pi-palette",
    items: [
      { name: "Figma", icon: "figma.svg" },
      { name: "Photoshop", icon: "potoshop3dicon.svg" },
      { name: "Illustrator", icon: "illustrator.svg" },
      { name: "WordPress & Canva" },
      { name: "Git & GitHub", icon: "github3dicon.svg" },
    ],
  },
];

export default function About() {
  const t = useTranslations("AboutPage");

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] font-azurio pt-28 pb-24">
      {/* HEADER SECTION */}
      <section className="relative pt-10 pb-16 px-6 max-w-7xl mx-auto z-10 ">
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
                INGÉNIERIE LOGICIELLE & <span className="text-[#FFC82C]">VISION CREATIVE</span>
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

      {/* SKILLS MATRIX SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          
          <h2 className="font-achiko text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
            NIVEAU DE <span className="text-[#FFC82C]">MAÎTRISE</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stackGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="glass-card p-5 sm:p-6 border border-white/15 font-azurio"
            >
              <h3 className="font-achiko text-base font-bold uppercase tracking-wider mb-5 flex items-center gap-3" style={{ color: group.color }}>
                <i className={`${group.icon} text-lg`} /> {group.title}
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {group.items.map((item: SkillBarProps) => (
                  <div
                    key={item.name}
                    className="min-h-24 flex flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-2 py-3 text-center transition-colors hover:border-white/25 hover:bg-white/[0.07]"
                  >
                    {item.icon ? (
                      <Image
                        src={`/stack/${item.icon}`}
                        alt=""
                        width={38}
                        height={38}
                        className="h-9 w-9 object-contain"
                      />
                    ) : (
                      <span className="h-9 flex items-center text-xl" style={{ color: group.color }}>
                        <i className="pi pi-bolt" />
                      </span>
                    )}
                    <span className="text-[10px] font-bold leading-tight text-gray-200">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER LINK */}
      <div className="text-center pt-8">
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
