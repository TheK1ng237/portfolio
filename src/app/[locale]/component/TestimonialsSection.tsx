"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";

type Testimonial = {
  id: string;
  authorName: string;
  authorRole?: string | null;
  company?: string | null;
  avatarUrl?: string | null;
  content: string;
  rating: number;
  isPublished: boolean;
};

const defaultTestimonials: Testimonial[] = [
  {
    id: "default-1",
    authorName: "M. Nkayouongam Moustapha",
    authorRole: "Directeur Général",
    company: "Green Startups Hive Incubator (GSHI)",
    avatarUrl: null,
    content:
      "Une collaboration exceptionnelle avec Thek1ng237 pour le site vitrine de GSHI. L'interface est moderne, fluide, ultra-rapide sur mobile et nous permet d'affirmer notre positionnement avec crédibilité.",
    rating: 5,
    isPublished: true,
  },
  {
    id: "default-2",
    authorName: "Direction WeGlow",
    authorRole: "Fondatrice & Directrice",
    company: "WeGlow & WeGlow Surprise",
    avatarUrl: null,
    content:
      "Thek1ng237 a su structurer parfaitement nos deux univers (Bijouterie et Décoration/Événementiel). La solution administrable et le parcours de devis vers WhatsApp ont doublé nos conversions !",
    rating: 5,
    isPublished: true,
  },
  {
    id: "default-3",
    authorName: "Équipe Projet Tech",
    authorRole: "Lead Product Owner",
    company: "Partenaire Digital",
    avatarUrl: null,
    content:
      "Rigueur technique exemplaire, respect des exigences d'ingénierie logicielle et sens aigu du design UI/UX. Les propositions et livrables sont d'un niveau d'exécution remarquable.",
    rating: 5,
    isPublished: true,
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(defaultTestimonials);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    let active = true;
    apiFetch<Testimonial[]>("testimonials/public")
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(() => {
        // Fallback default mock items
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmitTestimonial(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setErrorMessage("Veuillez renseigner votre nom et votre témoignage.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await apiFetch("testimonials/public", {
        method: "POST",
        body: JSON.stringify({
          authorName: authorName.trim(),
          authorRole: authorRole.trim() || undefined,
          company: company.trim() || undefined,
          content: content.trim(),
          rating: Number(rating),
        }),
      });

      setSubmitSuccess(true);
      setAuthorName("");
      setAuthorRole("");
      setCompany("");
      setContent("");
      setRating(5);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'envoi du témoignage.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#07090e] py-24 font-azurio text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-400/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
            Retour d'expérience &amp; Témoignages
          </span>
          <h2 className="mt-4 font-achiko text-3xl font-black tracking-wide text-white sm:text-5xl">
            Avis{" "}
            <span className="text-amber-400">Clients &amp; Partenaires</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-white/60 sm:text-sm">
            Vous avez travaillé avec Thek1ng237 ? Laissez votre avis pour
            partager votre retour d'expérience sur nos réalisations web et
            applicatives.
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                setSubmitSuccess(false);
                setErrorMessage("");
                setShowSubmitModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_20px_rgba(255,200,44,0.3)] transition hover:scale-105"
            >
              <i className="pi pi-pencil text-xs" />
              <span>Laisser un témoignage</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0e121b]/80 p-8 shadow-2xl backdrop-blur-md transition hover:border-amber-400/50 hover:bg-[#121624]"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <i key={i} className="pi pi-star-fill text-xs mr-1" />
                    ))}
                  </div>
                  <span className="font-achiko text-4xl text-amber-400/20 group-hover:text-amber-400/40 transition">
                    “
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-white/80 sm:text-sm italic">
                  "{t.content}"
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="flex size-11 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 font-achiko text-base font-black text-amber-400">
                  {t.authorName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong className="block font-achiko text-sm text-white">
                    {t.authorName}
                  </strong>
                  <span className="block text-[10px] font-semibold text-amber-400/90">
                    {[t.authorRole, t.company].filter(Boolean).join(" · ")}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* SUBMIT TESTIMONIAL MODAL */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#10141e] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Partagez votre expérience
                  </span>
                  <h3 className="font-achiko text-xl text-white">
                    Laisser un Témoignage
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="text-2xl text-white/40 hover:text-white"
                >
                  ×
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/10 text-2xl text-emerald-400">
                    ✓
                  </div>
                  <h4 className="font-achiko text-lg text-white">
                    Merci pour votre retour !
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
                    Votre témoignage a été transmis avec succès. Il sera publié
                    sur le site après validation par l'administrateur.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="mt-4 rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-300"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitTestimonial}
                  className="mt-4 space-y-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">Votre Nom / Prénom *</span>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Ex: Moustapha N."
                        className="w-full rounded-xl border border-white/15 bg-[#0b0d14] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
                      />
                    </label>

                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">Votre Poste / Titre</span>
                      <input
                        type="text"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        placeholder="Ex: Fondateur / CEO"
                        className="w-full rounded-xl border border-white/15 bg-[#0b0d14] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">
                        Entreprise / Organisation
                      </span>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ex: GSHI Incubator"
                        className="w-full rounded-xl border border-white/15 bg-[#0b0d14] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
                      />
                    </label>

                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">Note d'évaluation</span>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full rounded-xl border border-white/15 bg-[#0b0d14] px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                      >
                        <option value={5}>★★★★★ (5 / 5)</option>
                        <option value={4}>★★★★☆ (4 / 5)</option>
                        <option value={3}>★★★☆☆ (3 / 5)</option>
                      </select>
                    </label>
                  </div>

                  <label className="block text-xs font-bold text-white/70">
                    <span className="mb-1 block">
                      Votre témoignage / Avis *
                    </span>
                    <textarea
                      required
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Décrivez votre expérience de travail avec Thek1ng237..."
                      className="w-full rounded-xl border border-white/15 bg-[#0b0d14] p-3 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
                    />
                  </label>

                  {errorMessage && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white/5"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2 text-xs font-black uppercase text-black hover:bg-amber-300 disabled:opacity-50"
                    >
                      <i
                        className={`pi ${submitting ? "pi-spin pi-spinner" : "pi-send"} text-xs`}
                      />
                      <span>
                        {submitting ? "Envoi..." : "Envoyer mon témoignage"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
