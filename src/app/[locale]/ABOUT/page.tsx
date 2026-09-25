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
        <span className="text-gray-300 group-hover:text-[#E9B826] transition-colors">
          {skill}
        </span>
        <span style={{ color: color }} className="font-bold">
          {level}% {t("skills.efficiency")}
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="h-full rounded-full relative shadow-[0_0_10px_#E9B826]"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050508] text-[#F5F5DC] pt-24 pb-20">
      {/* Background Decor */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#E9B826]/10 blur-[150px] pointer-events-none rounded-full" />

      {/* HEADER SECTION */}
      <section className="relative pt-12 pb-16 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: ID Card */}
          <div className="lg:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-4 rounded-2xl border border-[#E9B826]/30 shadow-[0_0_30px_rgba(233,184,38,0.15)]"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black">
                <Image
                  src="/profil.png"
                  alt="KingTang"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-60" />
              </div>

              <div className="mt-6 space-y-3 font-mono text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">ALIAS //</span>
                  <span className="text-[#E9B826] font-bold">KINGTANG</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">ROLE //</span>
                  <span className="text-white font-bold">CREATIVE DEVELOPER & UX</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">STATUS //</span>
                  <span className="text-emerald-400 font-bold">ACTIVE & READY</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bio */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-mono text-xs text-[#E9B826] tracking-[0.4em] uppercase block mb-3">
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
              className="text-base md:text-lg text-gray-300 leading-relaxed font-light"
            >
              Spécialiste du développement frontend haut de gamme et du design d’expérience utilisateur (UX/UI). Mon travail s’articule autour d’une conviction claire : combiner la précision algorithmique des meilleures architectures web avec l’élégance visuelle et l’expression culturelle.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="glass-card p-5 rounded-xl border border-white/10">
                <span className="text-2xl font-black text-[#E9B826] font-mono block mb-1">FRONTEND ARCHITECTURE</span>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Optimisation Next.js 15, React 19, gestion d’état clean et intégrations API robustes.
                </p>
              </div>
              <div className="glass-card p-5 rounded-xl border border-white/10">
                <span className="text-2xl font-black text-[#E63946] font-mono block mb-1">AFRO-FUTURISM UX</span>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Design d’interface fondé sur les mathématiques des motifs africains ancestraux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS MATRIX SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative border-t border-white/10">
        <div className="mb-12">
          <span className="font-mono text-xs text-[#E9B826] tracking-[0.4em] uppercase block mb-2">
            {"// METRIQUES_TECHNIQUES"}
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
            NIVEAU DE <span className="text-[#E9B826]">MAÎTRISE</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold font-mono text-[#E9B826] uppercase tracking-wider mb-6 flex items-center gap-3">
              <i className="pi pi-code text-xl" /> FRONTEND & ARCHITECTURE
            </h3>
            <SkillBar skill="React 19 / Next.js 15" level={95} color="#E9B826" />
            <SkillBar skill="TypeScript / JavaScript ESNext" level={90} color="#FFD700" />
            <SkillBar skill="Tailwind CSS / PostCSS" level={95} color="#E9B826" />
            <SkillBar skill="Framer Motion / Motion Systems" level={88} color="#E63946" />
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold font-mono text-[#E63946] uppercase tracking-wider mb-6 flex items-center gap-3">
              <i className="pi pi-palette text-xl" /> UX/UI DESIGN & CREATIVE CODING
            </h3>
            <SkillBar skill="UI/UX Prototyping & Figma" level={92} color="#E63946" />
            <SkillBar skill="Design Systems & Tokenization" level={90} color="#E9B826" />
            <SkillBar skill="HTML5 Canvas / Interactive Graphics" level={82} color="#FFD700" />
            <SkillBar skill="Web Performance & SEO Optimizations" level={94} color="#10B981" />
          </div>
        </div>
      </section>

      {/* CTA FOOTER LINK */}
      <div className="text-center pt-8">
        <Link
          href="/PROJECT"
          className="px-8 py-4 bg-[#E9B826] text-black font-bold text-xs font-mono uppercase tracking-widest rounded-lg hover:shadow-[0_0_25px_rgba(233,184,38,0.4)] transition-all inline-block"
        >
          {t("cta.button")}
        </Link>
      </div>
    </div>
  );
}
