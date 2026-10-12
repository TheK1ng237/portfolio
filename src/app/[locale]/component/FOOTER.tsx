"use client";

import { useTranslations } from "next-intl";

const LINKS = [
  { label: "Email", href: "mailto:tangking237@gmail.com", external: false },
  { label: "LinkedIn", href: "https://linkedin.com/in/ndoh-yannick-tang-5b004934a", external: true },
  { label: "GitHub", href: "https://github.com/TangB5", external: true },
  { label: "Instagram", href: "https://instagram.com/Thek1ng237337", external: true },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC82C]";

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0B0D18] font-azurio">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-200">
            © {year} Thek1ng237 · {t("metadata.location")}
          </p>
          <p className="mt-1 text-sm text-gray-400">{t("brand.tagline")}</p>
        </div>

        <nav aria-label={t("external_links")}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`text-sm text-gray-300 transition-colors hover:text-[#FFC82C] ${focusRing}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}