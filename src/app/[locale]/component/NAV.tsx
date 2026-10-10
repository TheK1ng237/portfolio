"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import AudioController from "./AudioController";

/**
 * Navigation : une épingle en bois marque la page où l'on se trouve, et elle voyage d'un lien à l'autre.
 * En défilant, la barre devient pleine et gagne un ruban de Ndop tissé en bas (plus de verre ni de halo).
 * Les actions (CV, langue) sont des étiquettes de tissu cousues à la raphia.
 */

const NAV_ITEMS = [
  { key: "about", path: "/ABOUT", icon: "pi pi-home" },
  { key: "projects", path: "/PROJECT", icon: "pi pi-folder" },
  { key: "culture", path: "/CULTURE", icon: "pi pi-star" },
  { key: "solution", path: "/SOLUTION", icon: "pi pi-bolt" },
  { key: "contact", path: "/CONTACT", icon: "pi pi-user" },
];

const CV_HREF = "/cv/NDOH YANNICK TANG - Full Stack Developer - CV.pdf";

const STITCH = { outline: "2px dashed rgba(233,216,166,.7)", outlineOffset: "-4px" } as const;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC82C]";

/* -------------------------------------------------------------------------- */
/*  Épingle en bois et ruban de Ndop                                          */
/* -------------------------------------------------------------------------- */

function Pin({ size = 16 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" focusable="false" style={{ filter: "drop-shadow(1px 3px 2px rgba(0,0,0,.6))" }}>
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

function NdopRibbon() {
  const uid = useId().replace(/:/g, "");
  const gold = "#EDE6D0";
  const cream = "#F4EFE0";
  const body =
    `<rect width="64" height="64" fill="#0E1747"/>` +
    `<polygon points="32,4 60,32 32,60 4,32" fill="none" stroke="${gold}" stroke-width="3"/>` +
    `<polygon points="32,15 49,32 32,49 15,32" fill="none" stroke="${cream}" stroke-width="2"/>` +
    `<polygon points="32,26 38,32 32,38 26,32" fill="${gold}"/>`;
  return (
    <svg className="h-full w-full" aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <defs>
        <pattern id={`n-${uid}`} width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="scale(0.16)">
          <g dangerouslySetInnerHTML={{ __html: body }} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#n-${uid})`} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sélecteur de langue                                                       */
/* -------------------------------------------------------------------------- */

function LanguageSwitcher({ pathname, locale }: { pathname: string; locale: string }) {
  const options = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
  ] as const;
  return (
    <div role="group" aria-label="Langue / Language" className="flex gap-1.5">
      {options.map((o) => {
        const active = locale === o.code;
        return (
          <Link
            key={o.code}
            href={pathname}
            locale={o.code}
            lang={o.code}
            hrefLang={o.code}
            aria-current={active ? "true" : undefined}
            className={`rounded-[3px] px-3 py-1.5 text-sm font-bold transition-colors ${focusRing} ${
              active ? "bg-[#FFC82C] text-[#141A3F]" : "bg-[#2B3A8C] text-[#F4EBD0] hover:bg-[#3446A8]"
            }`}
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Nav");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 25);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Menu mobile : Échap pour fermer
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => pathname.toUpperCase().startsWith(path);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[padding,background-color] duration-300 motion-reduce:transition-none ${
          isScrolled || isMobileMenuOpen ? "bg-[#0B0D18] py-2.5" : "py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* MARQUE */}
          <Link href="/" className={`flex items-center gap-3.5 rounded-[3px] ${focusRing}`}>
            <Image src="/logojaune.png" alt="Thek1ng237" width={42} height={42} priority />
            <span className="hidden sm:block">
              <span className="block text-xs leading-none text-gray-300">{t("identity")}</span>
              <span className="mt-1 block font-achiko text-lg font-black leading-none text-[#FFC82C]">Thek1ng237</span>
            </span>
          </Link>

          {/* NAVIGATION BUREAU */}
          <nav aria-label="Principal" className="hidden items-center md:flex">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.path}
                      aria-current={active ? "page" : undefined}
                      className={`group relative block rounded-[3px] px-4 py-2 ${focusRing}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pin"
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }}
                          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3"
                          aria-hidden="true"
                        >
                          <Pin size={14} />
                        </motion.span>
                      )}
                      <span
                        className={`block border-b-2 border-dashed pb-0.5 font-achiko text-[15px] transition-colors ${
                          active
                            ? "border-[#E9D8A6]/70 font-black text-[#FFC82C]"
                            : "border-transparent text-gray-200 group-hover:border-[#E9D8A6]/50 group-hover:text-white"
                        }`}
                      >
                        {t(item.key)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="ml-6 flex items-center gap-3 border-l-2 border-dashed border-[#E9D8A6]/30 pl-6">
              <a
                href={CV_HREF}
                download
                target="_blank"
                rel="noopener noreferrer"
                title={t("cv_title")}
                className={`hidden rounded-[3px] bg-[#2B3A8C] px-3.5 py-1.5 text-sm font-bold text-[#F4EBD0] transition-colors hover:bg-[#3446A8] lg:block ${focusRing}`}
                style={STITCH}
              >
                CV PDF
              </a>
              <AudioController />
              <LanguageSwitcher pathname={pathname} locale={locale} />
            </div>
          </nav>

          {/* BASCULE MOBILE - Langue seulement */}
          <div className="flex items-center gap-3 md:hidden">
            <AudioController />
            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={t("menu_toggle")}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className={`grid size-9 place-items-center rounded-[3px] bg-[#2B3A8C] text-sm font-bold text-[#F4EBD0] transition-colors hover:bg-[#3446A8] ${focusRing}`}
              style={STITCH}
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>
          </div>
        </div>

        {/* ruban de Ndop : la barre est « cousue » quand on a défilé */}
        <div aria-hidden="true" className={`absolute inset-x-0 -bottom-1.5 h-1.5 transition-opacity duration-300 motion-reduce:transition-none ${isScrolled || isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}>
          <NdopRibbon />
        </div>
      </header>

      {/* MENU MOBILE - Langue seulement */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("menu_toggle")}
            initial={reduce ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={reduce ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-4 top-20 z-[90] rounded-lg bg-[#0B0D18] p-4 shadow-xl md:hidden"
          >
            <LanguageSwitcher pathname={pathname} locale={locale} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BARRE DE NAVIGATION MOBILE (BOTTOM NAV) */}
      <nav aria-label="Navigation mobile" className="fixed bottom-0 left-0 right-0 z-[90] border-t-2 border-dashed border-[#E9D8A6]/30 bg-[#0B0D18] md:hidden">
        <div className="absolute inset-x-0 -top-1.5 h-1.5">
          <NdopRibbon />
        </div>
        <ul className="flex items-center justify-around px-2 py-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.key} className="flex-1">
                <Link
                  href={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 rounded-[3px] py-2 ${focusRing} ${
                    active ? "text-[#FFC82C]" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {active && <Pin size={12} />}
                  <span className="text-xs font-achiko font-bold">{t(item.key)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}