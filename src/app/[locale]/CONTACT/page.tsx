"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

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
  consent: false,
};

export default function Contact() {
  const t = useTranslations("ContactPage");
  const locale = useLocale();
  const [formData, setFormData] = useState<ContactFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [submitError, setSubmitError] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const missionOptions = (t.raw("form.mission_options") as string[]) ?? [];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.consent || formData.website) {
      setSubmitStatus("error");
      setSubmitError(t("form.field_error"));
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitError("");

    try {
      const response = await fetch(`${API_BASE}/public/inquiries`, {
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
        throw new Error(typeof payload === "object" && payload && "error" in payload ? String(payload.error) : t("form.api_error"));
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
      // no-op, clipboard is optional here
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] font-azurio pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        <div className="space-y-4 font-azurio">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-azurio text-xs text-[#FFC82C] tracking-[0.4em] uppercase block font-bold"
          >
            {t("badge")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-achiko text-5xl md:text-8xl font-black tracking-tight uppercase text-white leading-[0.9]"
          >
            {t("title_main")} <span className="text-[#FFC82C]">{t("title_sub")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-azurio max-w-2xl text-base md:text-lg text-gray-200 font-light leading-relaxed border-l-3 border-[#FF3B56] pl-6"
          >
            {t("description")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-azurio">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 glass-card p-8 md:p-10 rounded-3xl border border-white/15 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/15">
              <span className="w-3 h-3 rounded-full bg-[#FFC82C] animate-pulse shadow-[0_0_10px_#FFC82C]" />
              <span className="font-azurio text-xs text-gray-200 uppercase tracking-widest font-bold">
                {t("form.title")}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 font-azurio">
              <div className="space-y-2">
                <label className="text-xs font-azurio text-gray-300 uppercase tracking-wider block font-bold">
                  {t("form.type_label")}
                </label>
                <select
                  name="missionType"
                  value={formData.missionType}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-azurio text-white outline-none focus:border-[#FFC82C] transition-colors"
                >
                  <option value="">{t("form.mission_type_placeholder")}</option>
                  {missionOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-azurio text-gray-300 uppercase tracking-wider block font-bold">
                  {t("form.name_label")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t("form.name_placeholder")}
                  className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-azurio text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-colors"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-azurio text-gray-300 uppercase tracking-wider block font-bold">
                    {t("form.email_label")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t("form.email_placeholder")}
                    className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-azurio text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-azurio text-gray-300 uppercase tracking-wider block font-bold">
                    {t("form.phone_label")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+237 ..."
                    className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-azurio text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-colors"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-azurio text-gray-300 uppercase tracking-wider block font-bold">
                    {t("form.budget_label")}
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="15 000 - 60 000 XAF"
                    className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-azurio text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-azurio text-gray-300 uppercase tracking-wider block font-bold">
                    {t("form.date_label")}
                  </label>
                  <input
                    type="text"
                    name="desiredDate"
                    value={formData.desiredDate}
                    onChange={handleChange}
                    placeholder="2 à 4 semaines"
                    className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-azurio text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-azurio text-gray-300 uppercase tracking-wider block font-bold">
                  {t("form.message_label")}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={t("form.message_placeholder")}
                  className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-azurio text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-colors"
                />
              </div>

              <div className="hidden">
                <input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>

              <label className="flex items-start gap-3 text-xs text-gray-300">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-[#121526] text-[#FFC82C] focus:ring-[#FFC82C]"
                />
                <span>{t("form.consent_label")}</span>
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FFC82C] text-black font-achiko font-bold text-sm uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_30px_rgba(255,200,44,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="pi pi-spin pi-spinner text-sm" /> {t("form.submitting")}
                  </>
                ) : (
                  <>
                    {t("form.submit")} <i className="pi pi-send text-sm" />
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-azurio text-center font-bold"
                  >
                    ✓ {t("form.success_msg")}
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-azurio text-center font-bold"
                  >
                    {submitError || t("form.api_error")}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-6 font-azurio"
          >
            <div className="glass-card p-8 rounded-3xl border border-white/15 space-y-6 shadow-xl font-azurio">
              <h3 className="font-achiko text-xl font-black uppercase text-white flex items-center gap-3">
                <i className="pi pi-compass text-[#FFC82C]" /> {t("channels.title")}
              </h3>

              <div className="space-y-4 font-azurio">
                {[
                  { label: t("channels.email"), val: "tangking237@gmail.com", icon: "envelope" },
                  { label: t("channels.whatsapp"), val: "+237 653 53 91 02", icon: "whatsapp" },
                  { label: t("channels.github"), val: "github.com/TangB5", icon: "github" },
                  { label: t("channels.linkedin"), val: "linkedin.com/in/ndoh-yannick-tang-5b004934a", icon: "linkedin" },
                ].map((channel) => (
                  <motion.div
                    key={channel.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => copyToClipboard(channel.val, channel.label)}
                    className="p-4 rounded-2xl border border-white/15 bg-[#121526] hover:border-[#FFC82C] transition-all cursor-pointer flex justify-between items-center group font-azurio"
                  >
                    <div>
                      <span className="block text-[8.5px] font-azurio text-gray-400 uppercase tracking-widest font-bold">
                        {channel.label}
                      </span>
                      <span className="block text-xs font-azurio font-bold text-white group-hover:text-[#FFC82C] transition-colors">
                        {channel.val}
                      </span>
                    </div>
                    <div className="text-xs font-azurio text-[#FFC82C] flex items-center gap-1.5 font-bold">
                      {copiedField === channel.label ? (
                        <span className="text-emerald-400 font-bold">{t("channels.copied")}</span>
                      ) : (
                        <i className="pi pi-copy text-gray-400 group-hover:text-[#FFC82C]" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-[#FF3B56]/50 bg-[#FF3B56]/10 space-y-3 shadow-xl font-azurio">
              <span className="text-[9.5px] font-mono text-gray-300 uppercase tracking-widest block font-bold">
                {t("cv.doc")}
              </span>
              <a
                href="/cv/NDOH YANNICK TANG - Full Stack Developer - CV.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-[#FF3B56] hover:bg-[#FF3B56]/90 text-white font-achiko font-bold text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,59,86,0.3)] group cursor-pointer"
              >
                <i className="pi pi-file-pdf text-base group-hover:scale-110 transition-transform" />
                {t("cv.download")}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
