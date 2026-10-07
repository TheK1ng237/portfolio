"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Testimonials");
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
      setErrorMessage(t("errors.required_fields"));
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
          : t("errors.submit"),
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
         
          <h2 className="mt-4 font-achiko text-3xl font-black tracking-wide text-white sm:text-5xl">
            {t("title_prefix")} <span className="text-amber-400">{t("title_highlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-white/60 sm:text-sm">
            {t("description")}
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
              <span>{t("actions.leave_testimonial")}</span>
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
                  &quot;{t.content}&quot;
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
                    {t("form.share_experience")}
                  </span>
                  <h3 className="font-achiko text-xl text-white">
                    {t("form.title")}
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
                    {t("success.title")}
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
                    {t("success.description")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="mt-4 rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-300"
                  >
                    {t("actions.close")}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitTestimonial}
                  className="mt-4 space-y-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">{t("form.name_label")} *</span>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={t("form.name_placeholder")}
                        className="w-full rounded-xl border border-white/15 bg-[#0b0d14] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
                      />
                    </label>

                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">{t("form.role_label")}</span>
                      <input
                        type="text"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        placeholder={t("form.role_placeholder")}
                        className="w-full rounded-xl border border-white/15 bg-[#0b0d14] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">
                        {t("form.company_label")}
                      </span>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder={t("form.company_placeholder")}
                        className="w-full rounded-xl border border-white/15 bg-[#0b0d14] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
                      />
                    </label>

                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">{t("form.rating_label")}</span>
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
                      {t("form.content_label")} *
                    </span>
                    <textarea
                      required
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={t("form.content_placeholder")}
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
                      {t("actions.cancel")}
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
                        {submitting ? t("actions.submitting") : t("actions.submit")}
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
