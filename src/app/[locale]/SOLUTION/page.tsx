"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";

interface Solution {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  features: string[];
  fullDescription: string;
  benefits: string[];
  targetAudience: string;
  category: "ENGINE" | "PROTOCOL" | "LAB";
}

const fallbackSolutions: Solution[] = [
  {
    id: "01",
    category: "ENGINE",
    title: "ARCHITECTURE WEB SUR-MESURE",
    description: "Développement complet d'applications web Next.js & React réactives, scalables et optimisées pour le SEO.",
    price: "Sur Devis",
    icon: "pi pi-box",
    features: ["Next.js 15 & React 19 Full-Stack", "Design Responsive Afro-Futuriste", "Optimisation Performance & SEO 99+"],
    fullDescription: "Conception de bout en bout de votre plateforme web. De l'architecture front-end aux API RESTful et à la base de données, nous construisons une solution performante, moderne et totalement sur-mesure.",
    benefits: ["Architecture moderne et zéro dette technique", "Performance d'affichage ultra-rapide", "Identité visuelle unique et captivante"],
    targetAudience: "Startups, entreprises et projets ambitieux",
  },
  {
    id: "02",
    category: "PROTOCOL",
    title: "AUDIT UX/UI & REFONTE GRAPHIQUE",
    description: "Analyse ergonomique approfondie, création de système de design et optimisation du parcours utilisateur.",
    price: "Sur Devis",
    icon: "pi pi-shield",
    features: ["Audit ergonomique & UX Research", "Création de design system complet", "Prototypes Figma haute-fidélité"],
    fullDescription: "Améliorez le taux de conversion et la satisfaction de vos utilisateurs grâce à une révision globale de votre expérience visuelle et interactive.",
    benefits: ["Augmentation de l'engagement", "Cohérence visuelle sur toutes les pages", "Prototypes prêts pour dev"],
    targetAudience: "Applications existantes souhaitant moderniser leur interface",
  },
  {
    id: "03",
    category: "LAB",
    title: "DESIGN CULTUREL AFRO-FUTURISTE",
    description: "Intégration d'art numérique, géométrie sacrée et identité culturelle forte dans vos projets web.",
    price: "Sur Devis",
    icon: "pi pi-microchip",
    features: ["Vectorisation de motifs ancestraux", "Animations & micro-interactions CSS", "Direction artistique & branding"],
    fullDescription: "Donnez une âme unique à vos produits digitaux en fusionnant les motifs visuels africains ancestraux avec les standards du web moderne.",
    benefits: ["Démarque concrète", "Valorisation du patrimoine", "Expérience immersive et mémorable"],
    targetAudience: "Marques, institutions culturelles et créateurs passionnés",
  },
];

const mapService = (item: any): Solution => ({
  id: item.id ?? item.slug ?? "01",
  title: item.title ?? item.titleFr ?? item.titleEn ?? "Service",
  description: item.description ?? item.descriptionFr ?? item.descriptionEn ?? "",
  price: item.priceLabel ?? item.priceLabelFr ?? item.priceLabelEn ?? "Sur Devis",
  icon: item.icon ?? "pi pi-box",
  features: Array.isArray(item.features) ? item.features : Array.isArray(item.featuresFr) ? item.featuresFr : [],
  fullDescription: item.fullDescription ?? item.fullDescriptionFr ?? item.fullDescriptionEn ?? "",
  benefits: item.benefits ?? ["Qualité", "Performance", "Évolution"],
  targetAudience: item.targetAudience ?? "Entreprises & projets ambitieux",
  category: "ENGINE",
});

export default function Solutions() {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>(fallbackSolutions);
  const locale = useLocale();
  const t = useTranslations("SolutionPage");

  useEffect(() => {
    let cancelled = false;
    const loadServices = async () => {
      try {
        const data = await apiFetch<{ items: any[] }>("/public/services", { locale, method: "GET" });
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setSolutions(data.items.map(mapService));
        }
      } catch {
        if (!cancelled) setSolutions(fallbackSolutions);
      }
    };
    void loadServices();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] font-azurio pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-20">
        <section className="space-y-4 font-azurio">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-achiko text-4xl md:text-7xl font-black tracking-tight uppercase text-white"
          >
            {t("title_main")} <span className="text-[#FFC82C]">{t("title_sub")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-azurio max-w-2xl text-base text-gray-200 font-light leading-relaxed"
          >
            {t("description")}
          </motion.p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-azurio">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -7 }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 border border-white/15 flex flex-col justify-between hover:border-[#FFC82C] transition-all duration-500 group shadow-xl"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center font-azurio">
                  <span className="text-xs text-[#FFC82C] font-bold">MODULE // {solution.id}</span>
                  <span className="text-[9.5px] border border-white/20 px-3 py-1 rounded-md bg-white/5 uppercase text-gray-200 font-bold">
                    {solution.category}
                  </span>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#FFC82C]/15 border border-[#FFC82C]/30 flex items-center justify-center group-hover:bg-[#FFC82C] group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,200,44,0.2)]">
                  <i className={`${solution.icon} text-2xl text-[#FFC82C] group-hover:text-black`} />
                </div>

                <h3 className="font-achiko text-2xl font-black uppercase text-white group-hover:text-[#FFC82C] transition-colors">
                  {solution.title}
                </h3>

                <p className="font-azurio text-xs text-gray-300 font-light leading-relaxed">
                  {solution.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 font-azurio">
                  {solution.features.slice(0, 3).map((feature, idx) => (
                    <div key={`${solution.id}-${idx}`} className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                      <i className="pi pi-check text-[10px] text-[#FFC82C]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/15 mt-8 space-y-4 font-azurio">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9.5px] text-gray-300 uppercase font-bold">{t("pricing")}</span>
                  <span className="text-lg font-achiko font-black text-[#FFC82C]">{solution.price}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSolution(solution)}
                  className="w-full py-3.5 bg-white/10 border border-white/20 hover:border-[#FFC82C] text-xs font-achiko font-bold text-white hover:text-[#FFC82C] uppercase rounded-xl transition-all"
                >
                  {t("details_btn")}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedSolution && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSolution(null)}
              className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 font-azurio"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(event) => event.stopPropagation()}
                className="glass-panel max-w-2xl w-full rounded-3xl border border-[#FFC82C] p-8 space-y-6 shadow-2xl"
              >
                <div className="flex justify-between items-center border-b border-white/15 pb-4">
                  <span className="font-azurio text-xs text-[#FFC82C] font-bold">MODULE_SPEC // {selectedSolution.id}</span>
                  <button onClick={() => setSelectedSolution(null)} className="text-gray-300 hover:text-white">
                    <i className="pi pi-times text-xl" />
                  </button>
                </div>

                <h3 className="font-achiko text-3xl font-black uppercase text-white">{selectedSolution.title}</h3>
                <p className="font-azurio text-sm text-gray-200 font-light leading-relaxed">{selectedSolution.fullDescription}</p>

                <div className="space-y-2">
                  <h4 className="font-azurio text-xs text-[#FFC82C] uppercase font-bold">{t("benefits_title")}</h4>
                  <ul className="space-y-1 text-xs text-gray-300 font-azurio">
                    {selectedSolution.benefits.map((benefit, idx) => (
                      <li key={`${selectedSolution.id}-${idx}`}>⚡ {benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/15">
                  <span className="text-lg font-achiko font-black text-[#FFC82C]">{selectedSolution.price}</span>
                  <Link href="/CONTACT" className="px-6 py-3 bg-[#FFC82C] text-black text-xs font-bold font-achiko uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(255,200,44,0.4)]">
                    {t("order_btn")}
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
