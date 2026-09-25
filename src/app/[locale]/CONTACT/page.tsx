"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import "primeicons/primeicons.css";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050508] text-[#F5F5DC] pt-28 pb-24">
      {/* Background Decor */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#E9B826]/10 blur-[170px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* HERO */}
        <div className="space-y-4">
          <span className="font-mono text-xs text-[#E9B826] tracking-[0.4em] uppercase block">
            {"// INITIER_UN_CANAL_DE_COMMUNICATION"}
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight uppercase text-white leading-[0.9]">
            INITIALISER <span className="text-gold-shimmer font-serif italic">LE CONTACT</span>
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-gray-300 font-light leading-relaxed border-l-2 border-[#E63946] pl-6">
            Une idée de projet, une refonte UI/UX ou une opportunité de collaboration ? Envoyez un message ou utilisez nos canaux directs.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FORM TERMINAL */}
          <div className="lg:col-span-7 glass-card p-8 md:p-10 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E9B826] animate-pulse" />
              <span className="font-mono text-xs text-gray-300 uppercase tracking-widest font-bold">
                TERMINAL_MESSAGERIE
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
                  VOTRE NOM // IDENTITÉ
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="ex: Alexandre Dupont"
                  className="w-full bg-[#0A0A0F] border border-white/15 rounded-lg px-4 py-3.5 text-xs font-mono text-white placeholder-gray-600 outline-none focus:border-[#E9B826] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
                  VOTRE EMAIL // CANAL DE RÉPONSE
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ex: alexandre@entreprise.com"
                  className="w-full bg-[#0A0A0F] border border-white/15 rounded-lg px-4 py-3.5 text-xs font-mono text-white placeholder-gray-600 outline-none focus:border-[#E9B826] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">
                  VOTRE MESSAGE // CAHIER DES CHARGES
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Décrivez votre projet, vos objectifs et délais souhaités..."
                  className="w-full bg-[#0A0A0F] border border-white/15 rounded-lg px-4 py-3.5 text-xs font-mono text-white placeholder-gray-600 outline-none focus:border-[#E9B826] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#E9B826] text-black font-bold text-xs font-mono uppercase tracking-[0.2em] rounded-lg hover:shadow-[0_0_25px_rgba(233,184,38,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="pi pi-spin pi-spinner text-sm" /> TRANSMISSION...
                  </>
                ) : (
                  <>
                    TRANSMETTRE LE MESSAGE <i className="pi pi-send text-sm" />
                  </>
                )}
              </button>

              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono text-center"
                  >
                    ✓ MESSAGE REÇU AVEC SUCCÈS. NOUS REVIENDRONS VERS VOUS DANS LES 24H.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* RIGHT: DIRECT UPLINKS & COPIABLE DETAILS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-xl font-black uppercase text-white font-mono flex items-center gap-3">
                <i className="pi pi-[#E9B826] pi-compass text-[#E9B826]" /> CANAUX DIRECTS
              </h3>

              <div className="space-y-4">
                {[
                  { label: "EMAIL", val: "tangking237@gmail.com", icon: "envelope" },
                  { label: "WHATSAPP", val: "+237 653 53 91 02", icon: "whatsapp" },
                  { label: "GITHUB", val: "github.com/TangB5", icon: "github" },
                  { label: "LINKEDIN", val: "linkedin.com/in/ndoh-yannick-tang-5b004934a", icon: "linkedin" },
                ].map((channel) => (
                  <div
                    key={channel.label}
                    onClick={() => copyToClipboard(channel.val, channel.label)}
                    className="p-4 rounded-xl border border-white/10 bg-[#0A0A0F]/60 hover:border-[#E9B826]/40 transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div>
                      <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                        {channel.label}
                      </span>
                      <span className="block text-xs font-mono font-bold text-white group-hover:text-[#E9B826] transition-colors">
                        {channel.val}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#E9B826] flex items-center gap-1.5">
                      {copiedField === channel.label ? (
                        <span className="text-emerald-400 font-bold">COPIÉ !</span>
                      ) : (
                        <i className="pi pi-copy text-gray-400 group-hover:text-[#E9B826]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[#E9B826]/20 text-center space-y-2">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">
                DISPONIBILITÉ PROCHAINES MISSIONS
              </span>
              <span className="text-sm font-bold font-mono text-[#10B981] uppercase block">
                ● 100% DISPONIBLE POUR Q1/Q2 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}