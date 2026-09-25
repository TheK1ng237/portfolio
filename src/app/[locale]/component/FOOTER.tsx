"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import "primeicons/primeicons.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer");

  const socialNetworks = [
    { icon: "linkedin", url: "https://linkedin.com/in/ndoh-yannick-tang-5b004934a", label: "LinkedIn" },
    { icon: "github", url: "https://github.com/TangB5", label: "GitHub" },
    { icon: "whatsapp", url: "https://wa.me/237653539102", label: "WhatsApp" },
    { icon: "instagram", url: "https://instagram.com/kingtang337", label: "Instagram" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      className="relative pt-28 pb-12 overflow-hidden border-t border-[#E9B826]/15 bg-[#050508]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#E9B826]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-4 gap-12 mb-20">
          {/* BRAND SEAL */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative group inline-block">
              <div className="absolute inset-0 bg-[#E9B826]/20 blur-2xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative flex items-center gap-3.5">
                <div className="relative p-1.5 border border-[#E9B826]/30 bg-[#0A0A0F] rounded-lg shadow-[0_0_15px_rgba(233,184,38,0.2)]">
                  <Image
                    src="/logojaune.png"
                    alt="KingTang Totem"
                    width={48}
                    height={48}
                    className="z-10 transition-transform duration-700 group-hover:rotate-[360deg]"
                  />
                </div>
                <div>
                  <span className="block text-[8px] font-mono tracking-[0.35em] text-gray-400 uppercase leading-none mb-1">
                    AUTHENTIC_NODE
                  </span>
                  <span className="block text-xl font-black tracking-wider uppercase text-white font-mono">
                    KING<span className="text-[#E9B826]">.</span>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs font-mono text-gray-400 leading-relaxed uppercase tracking-tight">
              {t("brand.tagline")}
            </p>

            <Link
              href="/CONTACT"
              className="group inline-flex items-center gap-3 text-xs font-mono tracking-widest text-[#E9B826] uppercase transition-all"
            >
              <span className="h-[1px] w-8 bg-[#E9B826]/40 group-hover:w-14 group-hover:bg-[#E9B826] transition-all" />
              {t("brand.open_channel")}
            </Link>
          </div>

          {/* SYSTEM MAP */}
          <div>
            <h4 className="text-xs font-mono text-[#E9B826] uppercase tracking-[0.3em] mb-8 font-bold">
              {t("system_map")}
            </h4>
            <ul className="space-y-4">
              {[
                { path: "/ABOUT", key: 0 },
                { path: "/PROJECT", key: 1 },
                { path: "/CULTURE", key: 2 },
                { path: "/SOLUTION", key: 3 },
                { path: "/CONTACT", key: 4 },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className="text-xs font-mono text-gray-300 hover:text-[#E9B826] tracking-wider uppercase transition-colors flex items-center gap-2.5 group"
                  >
                    <span className="text-[10px] text-gray-500 group-hover:text-[#E9B826]">
                      0{index + 1}
                    </span>
                    {t(`nav_items.${index}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* EXTERNAL LINKS */}
          <div>
            <h4 className="text-xs font-mono text-gray-300 uppercase tracking-[0.3em] mb-8 font-bold">
              {t("external_links")}
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {socialNetworks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-lg border border-white/10 bg-[#0A0A0F]/60 hover:bg-[#E9B826]/10 hover:border-[#E9B826]/40 transition-all group"
                >
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-300 group-hover:text-[#E9B826]">
                    {social.label}
                  </span>
                  <i className={`pi pi-${social.icon} text-sm text-gray-400 group-hover:text-[#E9B826]`} />
                </a>
              ))}
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-xs font-mono text-gray-300 uppercase tracking-[0.3em] mb-8 font-bold">
              {t("data_subscription")}
            </h4>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t("newsletter_placeholder")}
                  className="w-full bg-[#0A0A0F] border border-white/15 rounded-lg px-4 py-3.5 text-xs font-mono text-white placeholder-gray-500 outline-none focus:border-[#E9B826] transition-colors"
                />
              </div>
              <button className="w-full py-3.5 bg-[#E9B826] text-black text-xs font-bold font-mono uppercase tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(233,184,38,0.4)] active:scale-98 transition-all">
                {t("newsletter_button")}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                {t("metadata.protocol_year")}
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-gray-300 uppercase">
                © {currentYear} {t("metadata.global_registry")}
              </span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-8">
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                {t("metadata.base_location")}
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-[#E9B826] uppercase">
                {t("metadata.location")}
              </span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E9B826]/30 bg-[#0A0A0F] hover:bg-[#E9B826] text-[#E9B826] hover:text-black transition-all text-xs font-mono tracking-widest uppercase group"
          >
            <span>TOP</span>
            <i className="pi pi-arrow-up text-xs group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.footer>
  );
}