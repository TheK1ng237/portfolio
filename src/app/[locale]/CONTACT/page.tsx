"use client";

import React, { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { apiUrl } from "@/lib/api";

/**
 * Page Contact : « le bon de commande ».
 * Le formulaire est une feuille de papier raphia épinglée, avec une bordure de Toghu tissée en haut
 * et des champs écrits sur des lignes. Les coordonnées sont des étiquettes de tissu cousues et épinglées.
 */

/* -------------------------------------------------------------------------- */
/*  Types & données                                                           */
/* -------------------------------------------------------------------------- */

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  missionType: string;
  budget: string;
  desiredDate: string;
  message: string;
  website: string;
  consent: boolean;
};

const emptyForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  missionType: "",
  budget: "",
  desiredDate: "",
  message: "",
  website: "",
  consent: true,
};

const channels = [
  { label: "Email", value: "tangking237@gmail.com", href: "mailto:tangking237@gmail.com", external: false },
  { label: "GitHub", value: "github.com/TangB5", href: "https://github.com/TangB5", external: true },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/ndoh-yannick-tang-5b004934a",
    href: "https://www.linkedin.com/in/ndoh-yannick-tang-5b004934a",
    external: true,
  },
];

/* Champs « écrits sur la ligne » : un simple trait dessous, pas de boîte */
const fieldClass =
  "w-full border-0 border-b-2 border-[#141A3F]/45 bg-transparent px-1 py-2 text-base text-[#141A3F] outline-none transition-colors placeholder:text-[#141A3F]/40 focus:border-[#2B3A8C] focus-visible:border-[#2B3A8C] focus-visible:border-b-4";

const labelClass = "mb-1 block text-sm font-bold text-[#141A3F]";

const STITCH = { outline: "2px dashed rgba(233,216,166,.75)", outlineOffset: "-5px" } as const;
const TAG_BG =
  "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0 2px, transparent 2px 4px), #2B3A8C";

/* -------------------------------------------------------------------------- */
/*  Bordure de Toghu tissée et épingle en bois                                */
/* -------------------------------------------------------------------------- */

const hsl = (h: number, s = 100, l = 60) => `hsl(${((h % 360) + 360) % 360} ${s}% ${l}%)`;

function toghuTile(color: string, hue: number) {
  const cream = "#F4EFE0";
  const c2 = hsl(hue + 130);
  const c3 = hsl(hue + 250);
  return (
    `<rect width="72" height="72" fill="#14070A"/>` +
    [12, 36, 60]
      .map(
        (cx) =>
          `<polygon points="${cx},2 ${cx + 12},12 ${cx},22 ${cx - 12},12" fill="none" stroke="${color}" stroke-width="2"/>` +
          `<polygon points="${cx},7 ${cx + 6},12 ${cx},17 ${cx - 6},12" fill="${c3}"/>`,
      )
      .join("") +
    `<path d="M0 34L9 28L18 34L27 28L36 34L45 28L54 34L63 28L72 34" fill="none" stroke="${c2}" stroke-width="3" stroke-linejoin="round"/>` +
    [0, 24, 48].map((x) => `<polygon points="${x},60 ${x + 12},42 ${x + 24},60" fill="${color}" fill-opacity="0.9"/>`).join("") +
    [-24, 0, 24, 48].map((x) => `<polygon points="${x + 12},42 ${x + 36},42 ${x + 24},60" fill="none" stroke="${c3}" stroke-width="1.5"/>`).join("") +
    Array.from({ length: 9 }, (_, i) => `<circle cx="${4 + i * 8}" cy="66" r="2" fill="${cream}"/>`).join("")
  );
}

/** Bande de tissu : motif + tissage + grain (le filtre ne tourne que sur une petite tuile). */
function ToghuBand({ scale = 0.6 }: { scale?: number }) {
  const uid = useId().replace(/:/g, "");
  const thick = 2.5;
  const thread = 0.3;
  return (
    <svg className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`p-${uid}`} width="72" height="72" patternUnits="userSpaceOnUse" patternTransform={`scale(${scale})`}>
          <g dangerouslySetInnerHTML={{ __html: toghuTile("#FFC82C", 46) }} />
        </pattern>
        <pattern id={`w-${uid}`} width={thick * 2} height={thick * 2} patternUnits="userSpaceOnUse">
          <rect width={thick} height={thick} fill="#000" fillOpacity={thread * 0.5} />
          <rect x={thick} y={thick} width={thick} height={thick} fill="#000" fillOpacity={thread * 0.5} />
        </pattern>
        <filter id={`gf-${uid}`} filterUnits="userSpaceOnUse" x="0" y="0" width="160" height="160">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.65" numOctaves="3" seed="7" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.7 0 0 0 -0.6" />
        </filter>
        <pattern id={`g-${uid}`} width="160" height="160" patternUnits="userSpaceOnUse">
          <rect width="160" height="160" fill="#000" filter={`url(#gf-${uid})`} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#p-${uid})`} />
      <rect width="100%" height="100%" fill={`url(#w-${uid})`} />
      <rect width="100%" height="100%" fill={`url(#g-${uid})`} opacity="0.18" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}

function Pin({ size = 24 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" focusable="false" style={{ filter: "drop-shadow(2px 4px 2px rgba(0,0,0,.55))" }}>
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

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const TILT = [-2, 1.5, -1];

export default function Contact() {
  const t = useTranslations("ContactPage");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const [formData, setFormData] = useState<ContactFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [submitError, setSubmitError] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const missionOptions = (t.raw("form.mission_options") as string[]) ?? [
    "Web application",
    "Mobile application",
    "UI/UX design",
    "3D web experience",
    "Technical consulting",
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const checked = "checked" in event.target ? Boolean((event.target as HTMLInputElement).checked) : false;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.website) {
      setSubmitStatus("error");
      setSubmitError(t("form.invalid_request"));
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitError("");

    try {
      const response = await fetch(apiUrl("v1/public/inquiries"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          locale,
          website: "",
          consent: true,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof payload === "object" && payload && "error" in payload ? String(payload.error) : t("form.api_error"),
        );
      }

      setSubmitStatus("success");
      setFormData(emptyForm);
    } catch (error) {
      setSubmitStatus("error");
      setSubmitError(error instanceof Error ? error.message : t("form.api_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      // le presse-papiers peut être indisponible (contexte non sécurisé) : on ignore
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#0B0D18] px-4 pb-20 pt-28 font-azurio text-white selection:bg-[#FFC82C] selection:text-black sm:px-8">
      <div className="mx-auto max-w-6xl space-y-14">
        <header>
          <h1 className="max-w-3xl font-achiko text-4xl font-black leading-[1.05] text-white md:text-6xl">
            {t("content.title_prefix")} {t("content.title_highlight")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-gray-200">{t("content.description")}</p>
        </header>

        <div className="grid items-start gap-14 lg:grid-cols-[1.4fr_1fr]">
          {/* LE BON DE COMMANDE : la feuille se pose et s'épingle une fois */}
          <motion.section
            aria-labelledby="form-title"
            initial={reduce ? false : { y: -26, rotate: -1.2, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 14 }}
            className="relative bg-[#E9D8A6] text-[#141A3F] shadow-[0_24px_50px_rgba(0,0,0,.5)]"
          >
            <div className="h-7 overflow-hidden">
              <ToghuBand />
            </div>
            <span className="absolute left-5 top-0 -translate-y-1/2">
              <Pin size={26} />
            </span>
            <span className="absolute right-5 top-0 -translate-y-1/2">
              <Pin size={26} />
            </span>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 pb-8 sm:p-10" aria-busy={isSubmitting}>
              <h2 id="form-title" className="sr-only">
                {t("form.submit")}
              </h2>

              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    {t("form.name_label")} <span className="text-[#B3263A]">*</span>
                  </label>
                  <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" placeholder={t("form.name_placeholder")} className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    {t("form.email_label")} <span className="text-[#B3263A]">*</span>
                  </label>
                  <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" placeholder={t("form.email_placeholder")} className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="contact-phone" className={labelClass}>
                    {t("form.phone_label")} <span className="font-normal opacity-70">({t("form.optional")})</span>
                  </label>
                  <input id="contact-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" placeholder={t("form.phone_placeholder")} className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="contact-mission" className={labelClass}>
                    {t("form.mission_label")} <span className="text-[#B3263A]">*</span>
                  </label>
                  <select id="contact-mission" name="missionType" value={formData.missionType} onChange={handleChange} required className={fieldClass}>
                    <option value="">{t("form.mission_placeholder")}</option>
                    {missionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-budget" className={labelClass}>
                    {t("form.budget_label")} <span className="font-normal opacity-70">({t("form.optional")})</span>
                  </label>
                  <input id="contact-budget" type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder={t("form.budget_placeholder")} className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="contact-date" className={labelClass}>
                    {t("form.date_label")} <span className="font-normal opacity-70">({t("form.optional")})</span>
                  </label>
                  <input id="contact-date" type="date" name="desiredDate" value={formData.desiredDate} onChange={handleChange} className={fieldClass} />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  {t("form.message_label")} <span className="text-[#B3263A]">*</span>
                </label>
                {/* lignes de papier réglé */}
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={t("form.message_placeholder")}
                  className="w-full resize-y border-0 bg-transparent px-1 text-base leading-8 text-[#141A3F] outline-none placeholder:text-[#141A3F]/40 focus-visible:bg-[#141A3F]/5"
                  style={{ backgroundImage: "repeating-linear-gradient(transparent 0 31px, rgba(20,26,63,.4) 31px 32px)", backgroundSize: "100% 32px" }}
                />
              </div>

              {/* Honeypot : invisible pour les humains */}
              <div className="hidden" aria-hidden="true">
                <input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-[3px] bg-[#2B3A8C] px-8 py-4 text-base font-bold text-[#F4EBD0] transition-colors hover:bg-[#3446A8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141A3F] disabled:cursor-wait disabled:opacity-60"
                  style={STITCH}
                >
                  {isSubmitting ? t("form.submitting") : t("form.submit")}
                </button>
                <p className="text-sm leading-relaxed text-[#141A3F]/75">{t("form.consent")}</p>
              </div>

              {/* RETOURS */}
              <div aria-live="polite" role="status">
                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[3px] bg-[#1F5F3A] p-4 text-sm font-bold text-[#F4EBD0]">
                      {t("form.success")}
                    </motion.p>
                  )}
                  {submitStatus === "error" && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[3px] bg-[#9C2233] p-4 text-sm font-bold text-[#F4EBD0]">
                      {submitError || t("form.api_error")}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.section>

          {/* COORDONNÉES : des étiquettes cousues, épinglées */}
          <aside aria-labelledby="direct-title" className="space-y-10">
            <h2 id="direct-title" className="font-achiko text-2xl font-black text-white md:text-3xl">
              {t("content.direct_title_prefix")} {t("content.direct_title_highlight")}
            </h2>

            <ul className="space-y-9">
              {channels.map((channel, i) => (
                <li key={channel.label} className="relative" style={{ transform: `rotate(${TILT[i % TILT.length]}deg)` }}>
                  <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
                    <Pin size={22} />
                  </span>
                  <div className="flex items-center gap-3 rounded-[3px] px-5 pb-4 pt-6 shadow-[0_10px_18px_rgba(0,0,0,.45)]" style={{ background: TAG_BG, ...STITCH }}>
                    <a
                      href={channel.href}
                      {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="min-w-0 flex-1 rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC82C]"
                    >
                      <span className="block text-sm text-[#E9D8A6]/85">{channel.label}</span>
                      <span className="mt-0.5 block break-all font-achiko text-base font-black leading-snug text-[#F4EBD0] underline decoration-[#E9D8A6]/50 underline-offset-4 sm:text-lg">
                        {channel.value}
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(channel.value, channel.label)}
                      aria-label={t("form.copy_channel", { channel: channel.label })}
                      title={t("form.copy_channel", { channel: channel.label })}
                      className="grid size-10 shrink-0 place-items-center rounded-[3px] text-[#F4EBD0] transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC82C]"
                    >
                      <i className="pi pi-copy" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div aria-live="polite" className="min-h-[1.25rem] text-sm font-bold text-[#E9D8A6]">
              {copiedField ? t("form.copy_success", { channel: copiedField }) : ""}
            </div>

            <p className="flex items-center gap-3 text-sm text-gray-300">
              <Pin size={20} />
              <span>{t("content.location")}</span>
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}