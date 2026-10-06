"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { apiUrl } from "@/lib/api";
import { CyberPhoneContactSceneRef } from "@/components/3d/CyberPhoneContactScene";

const CyberPhoneContactScene = dynamic(
  () => import("@/components/3d/CyberPhoneContactScene").then((m) => m.CyberPhoneContactScene),
  { ssr: false }
);

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

  const sceneRef = useRef<CyberPhoneContactSceneRef>(null);

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

    // Trigger 3D Telephone Handset Lift Animation
    sceneRef.current?.triggerSubmitAnimation();

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
      sceneRef.current?.triggerSubmitAnimation();
    } catch {
      // fallback optional
    }
  };

  return (
    <div className="min-h-screen relative bg-[#0B0D18] text-[#F8F9FA] font-azurio pt-28 pb-20 overflow-hidden selection:bg-[#FFC82C] selection:text-black">
      {/* GLOWING GOLD & CRIMSON BACKGROUND BLOB ACCENTS */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFC82C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#FF3B56]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* TOP TITLE SECTION MATCHING REFERENCE DESIGN IN GOLD DA */}
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-achiko text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-widest mb-3"
          >
            CONTACT <span className="text-[#FFC82C]">ME</span>
          </motion.h1>

          <div className="inline-block border-b-2 border-[#FFC82C] pb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#FFC82C]">
              DROP A MESSAGE
            </span>
          </div>
        </div>

        {/* MAIN LAYOUT: LEFT FORM & SOCIALS | RIGHT 3D MODEL & FOOTER INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT SIDE: SOCIAL ICONS BAR + CONTACT FORM */}
          <div className="lg:col-span-6 flex gap-6 items-start">
            {/* VERTICAL SOCIAL MEDIA BAR (Matching image left icons in Gold DA) */}
            <div className="flex flex-col gap-5 pt-3 text-gray-400">
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
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFC82C] hover:text-[#FFC82C] flex items-center justify-center transition-all cursor-pointer text-sm"
                >
                  <i className={`pi pi-${s.icon}`} />
                </button>
              ))}
            </div>

            {/* FORM CONTAINER MATCHING REFERENCE INPUT STYLING IN GOLD DA */}
            <motion.form
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="flex-1 space-y-4 font-azurio"
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
                  className="w-full bg-[#121526]/90 border border-white/15 rounded-xl px-5 py-3.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-all shadow-inner"
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
                  className="w-full bg-[#121526]/90 border border-white/15 rounded-xl px-5 py-3.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-all shadow-inner"
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
                  className="w-full bg-[#121526]/90 border border-white/15 rounded-xl px-5 py-3.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-all shadow-inner"
                />
              </div>

              {/* Subject / Mission Type */}
              <div>
                <select
                  name="missionType"
                  value={formData.missionType}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#121526]/90 border border-white/15 rounded-xl px-5 py-3.5 text-xs text-white outline-none focus:border-[#FFC82C] transition-all"
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
                  className="w-full bg-[#121526]/90 border border-white/15 rounded-xl px-5 py-3.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-all shadow-inner"
                />
              </div>

              {/* Honeypot hidden input */}
              <div className="hidden">
                <input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>

              {/* SUBMIT BUTTON MATCHING REFERENCE IMAGE PILL BUTTON IN GOLD DA */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-12 py-3.5 rounded-full bg-[#FFC82C] hover:bg-[#ffe082] text-black font-achiko text-xs font-black tracking-widest uppercase shadow-[0_0_30px_rgba(255,200,44,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <i className="pi pi-spinner animate-spin text-xs text-black" /> SENDING...
                    </>
                  ) : (
                    <>
                      SUBMIT <i className="pi pi-arrow-right text-xs text-black" />
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

          {/* RIGHT SIDE: 3D CYBER SMARTPHONE & CHAT BUBBLE (FLOATING FREELY - NO CADRAN / NO BOX FRAME) */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-[500px]">
            {/* 3D WebGL Phone & Chat Bubble Scene */}
            <div className="relative w-full h-[520px] sm:h-[600px]">
              <CyberPhoneContactScene ref={sceneRef} accentColor="#FFC82C" />
            </div>

            {/* BOTTOM RIGHT LOCATION & DIRECT CONTACT INFO MATCHING IMAGE IN GOLD DA */}
            <div className="flex items-center justify-end gap-3 text-right text-gray-400 text-xs font-mono pt-4 border-t border-white/10">
              <i className="pi pi-map-marker text-[#FFC82C] text-base" />
              <div>
                <span className="block text-white font-bold">Douala, Littoral · Cameroun</span>
                <span className="block text-[11px] text-gray-400">+237 653 53 91 02 · tangking237@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
