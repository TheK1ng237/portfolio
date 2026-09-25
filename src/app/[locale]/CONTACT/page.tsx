"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen relative overflow-hidden bg-[#0B0D18] text-[#F8F9FA] pt-28 pb-24">
      {/* Radiant Luminous Ambient Glows (No AI grid patterns) */}
      <div className="absolute top-20 left-10 w-[30rem] h-[30rem] bg-[#FFC82C]/15 blur-[170px] pointer-events-none rounded-full" />
      <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-[#FF3B56]/12 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* HERO */}
        <div className="space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xs text-[#FFC82C] tracking-[0.4em] uppercase block font-bold"
          >
            {"// INITIER_UN_CANAL_DE_COMMUNICATION"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-black tracking-tight uppercase text-white leading-[0.9]"
          >
            INITIALISER <span className="text-gold-shimmer font-serif italic">LE CONTACT</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-base md:text-lg text-gray-200 font-light leading-relaxed border-l-2 border-[#FF3B56] pl-6"
          >
            Une idée de projet, une refonte UI/UX ou une opportunité de collaboration ? Envoyez un message ou utilisez nos canaux directs.
          </motion.p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FORM TERMINAL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 glass-card p-8 md:p-10 rounded-3xl border border-white/15 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/15">
              <span className="w-3 h-3 rounded-full bg-[#FFC82C] animate-pulse shadow-[0_0_10px_#FFC82C]" />
              <span className="font-mono text-xs text-gray-200 uppercase tracking-widest font-bold">
                TERMINAL_MESSAGERIE
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block font-bold">
                  VOTRE NOM // IDENTITÉ
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="ex: Alexandre Dupont"
                  className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-mono text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block font-bold">
                  VOTRE EMAIL // CANAL DE RÉPONSE
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ex: alexandre@entreprise.com"
                  className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-mono text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block font-bold">
                  VOTRE MESSAGE // CAHIER DES CHARGES
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Décrivez votre projet, vos objectifs et délais souhaités..."
                  className="w-full bg-[#121526] border border-white/20 rounded-xl px-4 py-3.5 text-xs font-mono text-white placeholder-gray-400 outline-none focus:border-[#FFC82C] transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FFC82C] text-black font-bold text-xs font-mono uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_30px_rgba(255,200,44,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
              </motion.button>

              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center font-bold"
                  >
                    ✓ MESSAGE REÇU AVEC SUCCÈS. NOUS REVIENDRONS VERS VOUS DANS LES 24H.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* RIGHT: DIRECT UPLINKS & COPIABLE DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-card p-8 rounded-3xl border border-white/15 space-y-6 shadow-xl">
              <h3 className="text-xl font-black uppercase text-white font-mono flex items-center gap-3">
                <i className="pi pi-compass text-[#FFC82C]" /> CANAUX DIRECTS
              </h3>

              <div className="space-y-4">
                {[
                  { label: "EMAIL", val: "tangking237@gmail.com", icon: "envelope" },
                  { label: "WHATSAPP", val: "+237 653 53 91 02", icon: "whatsapp" },
                  { label: "GITHUB", val: "github.com/TangB5", icon: "github" },
                  { label: "LINKEDIN", val: "linkedin.com/in/ndoh-yannick-tang-5b004934a", icon: "linkedin" },
                ].map((channel) => (
                  <motion.div
                    key={channel.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => copyToClipboard(channel.val, channel.label)}
                    className="p-4 rounded-2xl border border-white/15 bg-[#121526]/80 hover:border-[#FFC82C] transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div>
                      <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                        {channel.label}
                      </span>
                      <span className="block text-xs font-mono font-bold text-white group-hover:text-[#FFC82C] transition-colors">
                        {channel.val}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#FFC82C] flex items-center gap-1.5 font-bold">
                      {copiedField === channel.label ? (
                        <span className="text-emerald-400 font-bold">COPIÉ !</span>
                      ) : (
                        <i className="pi pi-copy text-gray-400 group-hover:text-[#FFC82C]" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-[#FFC82C]/30 text-center space-y-2 shadow-lg">
              <span className="text-[9px] font-mono text-gray-300 uppercase tracking-widest block font-bold">
                DISPONIBILITÉ PROCHAINES MISSIONS
              </span>
              <span className="text-sm font-bold font-mono text-[#10B981] uppercase block">
                ● 100% DISPONIBLE POUR Q1/Q2 2026
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}