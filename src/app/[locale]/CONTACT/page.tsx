"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { apiUrl } from "@/lib/api";

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

export default function Contact() {
  const t = useTranslations("ContactPage");
  const locale = useLocale();

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
      // fallback optional
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0D18] px-4 pb-12 pt-28 font-azurio text-white selection:bg-[#FFC82C] selection:text-black sm:px-8 sm:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute -left-36 top-24 h-96 w-96 rounded-full border border-[#FFC82C]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-36 h-72 w-72 rounded-full border border-[#FF3B56]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 bottom-10 h-[30rem] w-[30rem] rounded-full border border-[#FFC82C]/10" />

      <section className="relative z-10 mx-auto min-h-[620px] max-w-[1240px] overflow-hidden rounded-xl border border-white/5 bg-[#121526] px-5 py-9 shadow-[0_28px_80px_rgba(0,0,0,0.4)] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="mb-8 sm:mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3 font-achiko text-3xl font-black uppercase tracking-[0.12em] text-white sm:text-4xl"
          >
            CONTACT <span className="text-[#FFC82C]">ME</span>
          </motion.h1>

          <div className="inline-block border-b border-[#FFC82C] pb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC82C]">
              DROP A MESSAGE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="flex shrink-0 flex-col gap-3 pt-1 text-[#FFC82C]">
              {[
                { icon: "whatsapp", label: "WhatsApp", val: "+237 653 53 91 02" },
                { icon: "envelope", label: "Email", val: "tangking237@gmail.com" },
                { icon: "github", label: "GitHub", val: "github.com/TangB5" },
                { icon: "linkedin", label: "LinkedIn", val: "linkedin.com/in/ndoh-yannick-tang-5b004934a" },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => copyToClipboard(s.val, s.label)}
                  title={`Copier ${s.label}`}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center text-sm text-[#FFC82C] transition-colors hover:text-[#FF3B56]"
                >
                  <i className={`pi pi-${s.icon}`} />
                </button>
              ))}
            </div>

            <motion.form
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="min-w-0 flex-1 space-y-2 font-azurio sm:space-y-2.5"
            >
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name*"
                  className="w-full rounded-sm border border-white/10 bg-[#0B0D18]/70 px-3 py-2.5 text-[11px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#FFC82C]"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email*"
                  className="w-full rounded-sm border border-white/10 bg-[#0B0D18]/70 px-3 py-2.5 text-[11px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#FFC82C]"
                />
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone*"
                  className="w-full rounded-sm border border-white/10 bg-[#0B0D18]/70 px-3 py-2.5 text-[11px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#FFC82C]"
                />
              </div>

              {/* Subject / Mission Type */}
              <div>
                <select
                  name="missionType"
                  value={formData.missionType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-sm border border-white/10 bg-[#121526] px-3 py-2.5 text-[11px] text-white outline-none transition-colors focus:border-[#FFC82C]"
                >
                  <option value="">Subject / Mission Type*</option>
                  {missionOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Message*"
                  className="w-full resize-y rounded-sm border border-white/10 bg-[#0B0D18]/70 px-3 py-2.5 text-[11px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#FFC82C]"
                />
              </div>

              {/* Honeypot hidden input */}
              <div className="hidden">
                <input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="pt-1">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#FFC82C] px-12 py-3 text-[10px] font-bold tracking-[0.18em] text-[#0B0D18] transition-colors hover:bg-[#FF3B56] hover:text-white disabled:cursor-wait disabled:opacity-60 sm:w-full"
                >
                  {isSubmitting ? (
                    <>
                      <i className="pi pi-spinner animate-spin text-xs" /> SENDING...
                    </>
                  ) : (
                    <>
                      SUBMIT
                    </>
                  )}
                </motion.button>
              </div>

              {/* STATUS FEEDBACK */}
              <AnimatePresence>
                {copiedField && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] font-mono text-emerald-400 font-bold"
                  >
                    ✓ {copiedField} copié dans le presse-papier !
                  </motion.div>
                )}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold"
                  >
                    ✓ MESSAGE TRANSMIS AVEC SUCCÈS !
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold"
                  >
                    ⚠ {submitError || "Erreur lors de l'envoi."}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </div>

          <div className="flex min-h-[340px] flex-col justify-between sm:min-h-[420px]">
            <div className="relative flex min-h-[320px] flex-1 items-center justify-center sm:min-h-[400px]">
              <Image
                src="/phone.svg"
                alt="Téléphone bleu"
                width={480}
                height={480}
                className="h-auto max-h-[420px] w-full max-w-[480px] object-contain"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 text-right font-mono text-[10px] text-white/45">
              <i className="pi pi-map-marker text-sm text-[#FFC82C]" />
              <div>
                <span className="block font-bold text-white/70">Douala, Littoral · Cameroun</span>
                <span className="block text-[10px]">+237 653 53 91 02 · tangking237@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
