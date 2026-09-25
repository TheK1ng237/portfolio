"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import AudioController from "./AudioController";
import "primeicons/primeicons.css";

const NAV_ITEMS = [
  { id: "01", key: "about", path: "/ABOUT" },
  { id: "02", key: "projects", path: "/PROJECT" },
  { id: "03", key: "culture", path: "/CULTURE" },
  { id: "04", key: "solution", path: "/SOLUTION" },
  { id: "05", key: "contact", path: "/CONTACT" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Nav");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1 font-azurio text-[10px] border border-[#FFC82C]/40 px-2.5 py-1 rounded-full bg-[#121526] shadow-sm">
      <Link
        href={pathname}
        locale="fr"
        className={`px-2 py-0.5 rounded-full transition-all font-bold ${
          locale === "fr"
            ? "bg-[#FFC82C] text-black font-black"
            : "text-gray-300 hover:text-white"
        }`}
      >
        FR
      </Link>
      <span className="text-gray-500">|</span>
      <Link
        href={pathname}
        locale="en"
        className={`px-2 py-0.5 rounded-full transition-all font-bold ${
          locale === "en"
            ? "bg-[#FFC82C] text-black font-black"
            : "text-gray-300 hover:text-white"
        }`}
      >
        EN
      </Link>
    </div>
  );

  return (
    <>
      <motion.header
        className="fixed w-full z-[100] transition-all duration-500"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          paddingTop: isScrolled ? "10px" : "18px",
          paddingBottom: isScrolled ? "10px" : "18px",
          backgroundColor: isScrolled ? "rgba(11, 13, 24, 0.95)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled
            ? "1px solid rgba(255, 200, 44, 0.3)"
            : "1px solid transparent",
          boxShadow: isScrolled ? "0 10px 30px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* BRAND LOGO */}
          <Link href="/" className="relative group flex items-center gap-3.5">
            <div className="relative flex items-center justify-center">
              <Image
                src="/logojaune.png"
                alt="KingTang Seal"
                width={42}
                height={42}
                className="z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(255,200,44,0.4)]"
                priority
              />
            </div>

            <div className="hidden sm:block font-azurio">
              <span className="block text-[9px] font-azurio tracking-[0.35em] text-gray-300 uppercase leading-none mb-1 font-bold">
                IDENTITY
              </span>
              <span className="block text-[14px] font-achiko tracking-[0.2em] text-[#FFC82C] leading-none">
                KINGTANG
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.toUpperCase() === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className="relative px-4 py-2 group rounded-md"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-azurio text-gray-400 mb-0.5 font-bold">
                      {item.id}
                    </span>
                    <span
                      className={`text-[12px] font-achiko tracking-[0.18em] uppercase transition-all duration-300 ${
                        isActive
                          ? "text-[#FFC82C] font-bold"
                          : "text-gray-200 group-hover:text-white"
                      }`}
                    >
                      {t(item.key)}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FFC82C] shadow-[0_0_10px_#FFC82C]"
                    />
                  )}
                </Link>
              );
            })}

            {/* CONTROLS & HUD STATUS */}
            <div className="ml-6 pl-6 border-l border-white/20 flex items-center gap-3.5">
              <AudioController />
              <LanguageSwitcher />

              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 font-azurio">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-azurio text-emerald-400 uppercase tracking-[0.2em] font-bold">
                  CORE_ONLINE
                </span>
              </div>
            </div>
          </nav>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden flex items-center gap-3">
            <AudioController />
            <button
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 border border-[#FFC82C] rounded-lg bg-[#121526]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <motion.div
                animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-5 h-[2px] bg-[#FFC82C]"
              />
              <motion.div
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-3.5 h-[2px] bg-white ml-1.5"
              />
              <motion.div
                animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-5 h-[2px] bg-[#FFC82C]"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-[#0B0D18] md:hidden flex flex-col justify-between p-8 pt-28"
          >
            <div className="space-y-6">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={item.path}
                    className="group flex flex-col"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-azurio text-[#FFC82C] text-[10px] tracking-[0.4em] font-bold">
                      MODULE_{item.id}
                    </span>
                    <span className="text-4xl font-achiko tracking-tight uppercase group-hover:text-[#FFC82C] transition-colors text-white">
                      {t(item.key)}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/20 flex justify-between items-center">
              <LanguageSwitcher />
              <div className="flex gap-4 text-[#FFC82C]">
                <a
                  href="https://github.com/TangB5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <i className="pi pi-github text-xl" />
                </a>
                <a
                  href="https://linkedin.com/in/ndoh-yannick-tang-5b004934a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <i className="pi pi-linkedin text-xl" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}