"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import "primeicons/primeicons.css";
import { useTranslations } from "next-intl";

type SkillBarProps = {
  skill: string;
  level: number;
  color: string;
};

export default function About() {
  const t = useTranslations("AboutPage");

  const SkillBar = ({ skill, level, color }: SkillBarProps) => (
    <div className="mb-6 group">
      <div className="flex justify-between mb-2 font-mono text-xs uppercase tracking-wider">
        <span className="text-gray-200 group-hover:text-[#FFC82C] transition-colors font-bold">
          {skill}
        </span>
        <span style={{ color: color }} className="font-bold">
          {level}% {t("skills.efficiency")}
        </span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-[1px] border border-white/15">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="h-full rounded-full relative shadow-[0_0_12px_#FFC82C]"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] pt-28 pb-24">
      {/* Radiant Luminous Background Glows (No AI patterns) */}
      <div className="absolute top-20 right-10 w-[30rem] h-[30rem] bg-[#FFC82C]/15 blur-[170px] pointer-events-none rounded-full" />
      <div className="absolute bottom-20 left-10 w-[30rem] h-[30rem] bg-[#FF3B56]/12 blur-[180px] pointer-events-none rounded-full" />

      {/* HEADER SECTION */}
      <section className="relative pt-10 pb-16 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: ID Card */}
          <div className="lg:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-4 rounded-3xl border border-[#FFC82C]/40 shadow-[0_0_35px_rgba(255,200,44,0.2)]"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15 bg-[#0B0D18]">
                <Image
                  src="/profil.png"
                  alt="KingTang"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D18] via-transparent to-transparent opacity-50" />
              </div>

              <div className="mt-6 space-y-3 font-mono text-xs border-t border-white/15 pt-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-300 font-bold">ALIAS //</span>
                  <span className="text-[#FFC82C] font-bold">KINGTANG</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-300 font-bold">ROLE //</span>
                  <span className="text-white font-bold">CREATIVE DEVELOPER & UX</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-300 font-bold">STATUS //</span>
                  <span className="text-emerald-400 font-bold">ACTIVE & READY</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bio */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-mono text-xs text-[#FFC82C] tracking-[0.4em] uppercase block mb-3 font-bold">
                {"// MANIFESTO_BIOGRAPHIE"}
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                INGÉNIERIE LOGICIELLE & <span className="text-gold-shimmer">VISION CREATIVE</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-gray-200 leading-relaxed font-light"
            >
              Spécialiste du développement frontend haut de gamme et du design d’expérience utilisateur (UX/UI). Mon travail s’articule autour d’une conviction claire : combiner la précision algorithmique des meilleures architectures web avec l’élégance visuelle et l’expression culturelle.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border border-white/15">
                <span className="text-xl font-black text-[#FFC82C] font-mono block mb-2">FRONTEND ARCHITECTURE</span>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  Optimisation Next.js 15, React 19, gestion d’état clean et intégrations API robustes.
                </p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border border-white/15">
                <span className="text-xl font-black text-[#FF3B56] font-mono block mb-2">AFRO-FUTURISM UX</span>
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
          <span className="font-mono text-xs text-[#FFC82C] tracking-[0.4em] uppercase block mb-2 font-bold">
            {"// METRIQUES_TECHNIQUES"}
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
            NIVEAU DE <span className="text-[#FFC82C]">MAÎTRISE</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-3xl border border-white/15 shadow-xl"
          >
            <h3 className="text-lg font-bold font-mono text-[#FFC82C] uppercase tracking-wider mb-6 flex items-center gap-3">
              <i className="pi pi-code text-xl" /> FRONTEND & ARCHITECTURE
            </h3>
            <SkillBar skill="React 19 / Next.js 15" level={95} color="#FFC82C" />
            <SkillBar skill="TypeScript / JavaScript ESNext" level={90} color="#FFE57F" />
            <SkillBar skill="Tailwind CSS / PostCSS" level={95} color="#FFC82C" />
            <SkillBar skill="Framer Motion / Motion Systems" level={88} color="#FF3B56" />
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-3xl border border-white/15 shadow-xl"
          >
            <h3 className="text-lg font-bold font-mono text-[#FF3B56] uppercase tracking-wider mb-6 flex items-center gap-3">
              <i className="pi pi-palette text-xl" /> UX/UI DESIGN & CREATIVE CODING
            </h3>
            <SkillBar skill="UI/UX Prototyping & Figma" level={92} color="#FF3B56" />
            <SkillBar skill="Design Systems & Tokenization" level={90} color="#FFC82C" />
            <SkillBar skill="HTML5 Canvas / Interactive Graphics" level={82} color="#FFE57F" />
            <SkillBar skill="Web Performance & SEO Optimizations" level={94} color="#10B981" />
          </motion.div>
        </div>
      </section>

      {/* CTA FOOTER LINK */}
      <div className="text-center pt-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
          <Link
            href="/PROJECT"
            className="px-10 py-4 bg-[#FFC82C] text-black font-bold text-xs font-mono uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(255,200,44,0.4)] transition-all inline-block"
          >
            {t("cta.button")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
