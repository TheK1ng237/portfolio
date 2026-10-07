"use client";

import React, { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { apiUrl } from "@/lib/api";

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
  {
    icon: "whatsapp",
    label: "WhatsApp",
    value: "+237 653 53 91 02",
    href: "https://wa.me/237653539102",
  },
  {
    icon: "envelope",
    label: "Email",
    value: "tangking237@gmail.com",
    href: "mailto:tangking237@gmail.com",
  },
  {
    icon: "github",
    label: "GitHub",
    value: "github.com/TangB5",
    href: "https://github.com/TangB5",
  },
  {
    icon: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/ndoh-yannick-tang-5b004934a",
    href: "https://www.linkedin.com/in/ndoh-yannick-tang-5b004934a",
  },
];

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-[#0B0D18]/80 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#FFC82C] focus-visible:ring-2 focus-visible:ring-[#FFC82C]/40";

const labelClass = "mb-1.5 block text-xs font-bold text-gray-200";

/* -------------------------------------------------------------------------- */
/*  Textiles : motifs SVG + texture de tissu                                  */
/* -------------------------------------------------------------------------- */

type TextileKind = "NDOP" | "TOGHU";

const hsl = (h: number, s = 100, l = 60) => `hsl(${((h % 360) + 360) % 360} ${s}% ${l}%)`;

function buildTile(kind: TextileKind, color: string, hue: number): { w: number; h: number; node: React.ReactNode } {
  const cream = "#F4EFE0";

  if (kind === "NDOP") {
    return {
      w: 64,
      h: 64,
      node: (
        <>
          <rect width="64" height="64" fill="#0E1747" />
          <polygon points="32,4 60,32 32,60 4,32" fill="none" stroke={color} strokeWidth="2" />
          <polygon points="32,15 49,32 32,49 15,32" fill="none" stroke={cream} strokeWidth="1.5" />
          <polygon points="32,26 38,32 32,38 26,32" fill={color} />
          <path d="M32 4V15M60 32H49M32 60V49M4 32H15" stroke={cream} strokeWidth="1.5" fill="none" />
          <path d="M0 12L12 0M52 0L64 12M64 52L52 64M12 64L0 52" stroke={color} strokeWidth="2" fill="none" />
          {[
            [32, 4],
            [60, 32],
            [32, 60],
            [4, 32],
          ].map(([x, y]) => (
            <circle key={`v-${x}-${y}`} cx={x} cy={y} r="2.5" fill={cream} />
          ))}
          {[
            [0, 0],
            [64, 0],
            [0, 64],
            [64, 64],
          ].map(([x, y]) => (
            <circle key={`c-${x}-${y}`} cx={x} cy={y} r="3" fill={color} />
          ))}
        </>
      ),
    };
  }

  const c2 = hsl(hue + 130);
  const c3 = hsl(hue + 250);
  return {
    w: 72,
    h: 72,
    node: (
      <>
        <rect width="72" height="72" fill="#14070A" />
        {[12, 36, 60].map((cx) => (
          <g key={`d-${cx}`}>
            <polygon points={`${cx},2 ${cx + 12},12 ${cx},22 ${cx - 12},12`} fill="none" stroke={color} strokeWidth="2" />
            <polygon points={`${cx},7 ${cx + 6},12 ${cx},17 ${cx - 6},12`} fill={c3} />
          </g>
        ))}
        <path
          d="M0 34L9 28L18 34L27 28L36 34L45 28L54 34L63 28L72 34"
          fill="none"
          stroke={c2}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {[0, 24, 48].map((x) => (
          <polygon key={`u-${x}`} points={`${x},60 ${x + 12},42 ${x + 24},60`} fill={color} fillOpacity="0.9" />
        ))}
        {[-24, 0, 24, 48].map((x) => (
          <polygon
            key={`dn-${x}`}
            points={`${x + 12},42 ${x + 36},42 ${x + 24},60`}
            fill="none"
            stroke={c3}
            strokeWidth="1.5"
          />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={`p-${i}`} cx={4 + i * 8} cy="66" r="2" fill={cream} />
        ))}
      </>
    ),
  };
}

const TEXTURE: Record<TextileKind, { displace: number; thread: number; grain: number; thick: number }> = {
  NDOP: { displace: 2.2, thread: 0.22, grain: 0.35, thick: 3 },
  TOGHU: { displace: 1.2, thread: 0.3, grain: 0.3, thick: 2.5 },
};

function Textile({
  kind,
  color,
  hue,
  scale = 1,
}: {
  kind: TextileKind;
  color: string;
  hue: number;
  scale?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const id = `tx-${uid}`;
  const weaveId = `weave-${uid}`;
  const warpId = `warp-${uid}`;
  const grainId = `grain-${uid}`;

  const { w, h, node } = buildTile(kind, color, hue);
  const t = TEXTURE[kind];
  const half = t.thick / 2;

  return (
    <svg className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse" patternTransform={`scale(${scale})`}>
          {node}
        </pattern>

        <pattern id={weaveId} width={t.thick * 2} height={t.thick * 2} patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width={t.thick} height={t.thick} fill="#000" fillOpacity={t.thread * 0.5} />
          <rect x={t.thick} y={t.thick} width={t.thick} height={t.thick} fill="#000" fillOpacity={t.thread * 0.5} />
          <path
            d={`M0 ${half}H${t.thick * 2}M0 ${t.thick + half}H${t.thick * 2}`}
            stroke="#000"
            strokeOpacity={t.thread}
            strokeWidth={t.thick * 0.3}
            fill="none"
          />
          <path
            d={`M${half} 0V${t.thick * 2}M${t.thick + half} 0V${t.thick * 2}`}
            stroke="#FFF"
            strokeOpacity={t.thread * 0.55}
            strokeWidth={t.thick * 0.25}
            fill="none"
          />
        </pattern>

        <filter id={warpId} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={t.displace} xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id={grainId} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.65" numOctaves="3" seed="7" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.7 0 0 0 -0.6" />
        </filter>
      </defs>

      <g filter={`url(#${warpId})`}>
        <rect x="-12" y="-12" width="120%" height="120%" fill={`url(#${id})`} />
      </g>
      <rect width="100%" height="100%" fill={`url(#${weaveId})`} />
      <rect
        width="100%"
        height="100%"
        fill="#000"
        filter={`url(#${grainId})`}
        opacity={t.grain}
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

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
    "Application Web Full-Stack",
    "Application Mobile iOS/Android",
    "UI/UX Design & Direction Artistique",
    "Expérience 3D WebGL / Motion",
    "Consulting Tech & Architecture",
  ];

  const getTrans = (key: string, fallback: string) => {
    try {
      return t(key);
    } catch {
      return fallback;
    }
  };

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
      setSubmitError("Requête invalide.");
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
          typeof payload === "object" && payload && "error" in payload
            ? String(payload.error)
            : getTrans("form.api_error", "Erreur lors de l'envoi du message.")
        );
      }

      setSubmitStatus("success");
      setFormData(emptyForm);
    } catch (error) {
      setSubmitStatus("error");
      setSubmitError(error instanceof Error ? error.message : getTrans("form.api_error", "Erreur d'envoi."));
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
    <main className="relative min-h-screen overflow-hidden bg-[#0B0D18] px-4 pb-16 pt-28 font-azurio text-white selection:bg-[#FFC82C] selection:text-black sm:px-8">
      <div className="relative z-10 mx-auto max-w-6xl space-y-10">
        {/* TITRE */}
        <header className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: reduce ? 0 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-achiko text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            PARLONS DE <span className="text-[#FFC82C]">VOTRE PROJET</span>
          </motion.h1>
          <p className="max-w-2xl border-l-4 border-[#FFC82C] pl-5 text-base font-light leading-relaxed text-gray-200">
            Décrivez votre besoin, vos délais et votre budget. Plus le message est précis, plus le devis sera juste.
          </p>
        </header>

        <motion.section
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="overflow-hidden rounded-3xl border border-white/15 bg-[#121526] shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
        >
          {/* bande de tissu */}
          <div className="h-4 w-full" aria-hidden="true">
            <Textile kind="NDOP" color="#FFC82C" hue={46} scale={0.45} />
          </div>

          <div className="grid lg:grid-cols-[1.15fr_1fr]">
            {/* FORMULAIRE */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-10" noValidate={false}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    Nom complet <span className="text-[#FFC82C]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Votre nom"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Email <span className="text-[#FFC82C]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className={labelClass}>
                    Téléphone <span className="font-light text-gray-400">(facultatif)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="+237 …"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-mission" className={labelClass}>
                    Type de mission <span className="text-[#FFC82C]">*</span>
                  </label>
                  <select
                    id="contact-mission"
                    name="missionType"
                    value={formData.missionType}
                    onChange={handleChange}
                    required
                    className={`${fieldClass} bg-[#121526]`}
                  >
                    <option value="">Choisir une mission</option>
                    {missionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-budget" className={labelClass}>
                    Budget estimé <span className="font-light text-gray-400">(facultatif)</span>
                  </label>
                  <input
                    id="contact-budget"
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Ex : 500 000 FCFA"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-date" className={labelClass}>
                    Date souhaitée <span className="font-light text-gray-400">(facultatif)</span>
                  </label>
                  <input
                    id="contact-date"
                    type="date"
                    name="desiredDate"
                    value={formData.desiredDate}
                    onChange={handleChange}
                    className={`${fieldClass} [color-scheme:dark]`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  Message <span className="text-[#FFC82C]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Contexte, objectifs, public visé, fonctionnalités attendues…"
                  className={`${fieldClass} resize-y`}
                />
              </div>

              {/* Honeypot : invisible pour les humains */}
              <div className="hidden" aria-hidden="true">
                <input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-3 pt-1">
                <motion.button
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FFC82C] px-8 py-4 font-achiko text-sm font-bold uppercase tracking-widest text-[#0B0D18] shadow-[0_0_30px_rgba(255,200,44,0.25)] transition-colors hover:bg-[#FF3B56] hover:text-white disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <i className="pi pi-spinner animate-spin text-sm" /> Envoi en cours…
                    </>
                  ) : (
                    "Envoyer le message"
                  )}
                </motion.button>

                <p className="text-xs font-light leading-relaxed text-gray-400">
                  En envoyant ce formulaire, vous acceptez d’être recontacté au sujet de votre demande.
                </p>
              </div>

              {/* RETOURS */}
              <div aria-live="polite" role="status">
                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-sm font-bold text-emerald-300"
                    >
                      <i className="pi pi-check mr-2" />
                      Message transmis avec succès. Merci !
                    </motion.div>
                  )}
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl border border-red-500/40 bg-red-500/15 p-4 text-sm font-bold text-red-300"
                    >
                      <i className="pi pi-exclamation-triangle mr-2" />
                      {submitError || "Erreur lors de l'envoi."}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* PANNEAU TEXTILE + COORDONNÉES */}
            <aside className="relative min-h-[420px] overflow-hidden border-t border-white/10 lg:border-l lg:border-t-0">
              <div className="absolute inset-0">
                <Textile kind="TOGHU" color="#FFC82C" hue={46} scale={1.25} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D18] via-[#0B0D18]/55 to-[#0B0D18]/10" />

              <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                <div className="space-y-4 rounded-2xl border border-white/15 bg-[#0B0D18]/85 p-5 backdrop-blur-md">
                  <h2 className="font-achiko text-lg font-black uppercase text-white">
                    Écrire <span className="text-[#FFC82C]">directement</span>
                  </h2>

                  <ul className="space-y-1">
                    {channels.map((channel) => (
                      <li key={channel.label} className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5">
                        <a
                          href={channel.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-w-0 flex-1 items-center gap-3"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#FFC82C]/30 bg-[#FFC82C]/10 text-[#FFC82C]">
                            <i className={`pi pi-${channel.icon}`} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs font-bold text-gray-400">{channel.label}</span>
                            <span className="block truncate text-sm text-white">{channel.value}</span>
                          </span>
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(channel.value, channel.label)}
                          aria-label={`Copier ${channel.label}`}
                          title={`Copier ${channel.label}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-300 transition-colors hover:text-[#FFC82C]"
                        >
                          <i className="pi pi-copy" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div aria-live="polite" className="min-h-[1.25rem] text-xs font-bold text-emerald-400">
                    {copiedField ? `${copiedField} copié dans le presse-papiers.` : ""}
                  </div>

                  <div className="flex items-center gap-2 border-t border-white/10 pt-3 text-xs text-gray-300">
                    <i className="pi pi-map-marker text-[#FFC82C]" />
                    <span>Douala, Littoral · Cameroun</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </motion.section>
      </div>
    </main>
  );
}