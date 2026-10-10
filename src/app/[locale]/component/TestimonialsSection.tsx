"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

/* ---------- Portrait en forme de guillemet ---------- */

const COL = { raffia: "#E9D8A6", gold: "#FFC82C", night: "#141A3F", deep: "#1B2358" };

// Une couleur de fond par personne, pour que l'avatar par défaut ne soit jamais le même
const TONES = [
  { block: "#2B3A8C", figure: COL.night },
  { block: COL.gold, figure: COL.deep },
  { block: "#FF3B56", figure: COL.night },
  { block: "#4458C8", figure: COL.night },
];

// Un grand guillemet ouvrant : une bulle ronde et une queue qui descend
const BLOB =
  "M150 0A140 140 0 0 1 290 140C290 270 240 350 150 412C178 340 150 296 92 272A140 140 0 0 1 10 140A140 140 0 0 1 150 0Z";

/** Avatar par défaut : buste sur un bloc de couleur, avec un ourlet en triangles (clin d'œil au tissu). */
function DefaultFigure({ tone }: { tone: (typeof TONES)[number] }) {
  const hem = Array.from({ length: 10 }, (_, i) => 30 + i * 24);
  return (
    <>
      <rect x="0" y="82" width="300" height="178" fill={tone.block} />
      <path d="M30 312V302C30 234 86 200 150 200C214 200 270 234 270 302V312Z" fill={tone.figure} />
      <rect x="130" y="152" width="40" height="52" fill={tone.figure} />
      <circle cx="150" cy="116" r="52" fill={tone.figure} />
      {hem.map((x) => (
        <path key={x} d={`M${x} 311L${x + 12} 338L${x + 24} 311Z`} fill={tone.figure} />
      ))}
    </>
  );
}

function Portrait({ item, toneIndex }: { item: Testimonial; toneIndex: number }) {
  const uid = useId().replace(/:/g, "");
  const tone = TONES[toneIndex % TONES.length];
  return (
    <svg viewBox="0 0 300 420" role="img" aria-label={item.authorName} className="h-auto w-full">
      <defs>
        <clipPath id={uid}>
          <path d={BLOB} />
        </clipPath>
      </defs>
      <path d={BLOB} fill={COL.raffia} />
      <g clipPath={`url(#${uid})`}>
        {item.avatarUrl ? (
          <image href={item.avatarUrl} x="0" y="0" width="300" height="420" preserveAspectRatio="xMidYMin slice" />
        ) : (
          <DefaultFigure tone={tone} />
        )}
        {/* points de broderie le long du bord, comme la raphia du Ndop */}
        <path d={BLOB} fill="none" stroke={tone.block} strokeWidth="13" strokeDasharray="0.1 9" strokeLinecap="round" opacity="0.9" />
      </g>
    </svg>
  );
}

function MiniAvatar({ item, toneIndex }: { item: Testimonial; toneIndex: number }) {
  const uid = useId().replace(/:/g, "");
  const tone = TONES[toneIndex % TONES.length];
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true" className="size-11 shrink-0">
      <defs>
        <clipPath id={uid}>
          <circle cx="150" cy="150" r="150" />
        </clipPath>
      </defs>
      <circle cx="150" cy="150" r="150" fill={COL.raffia} />
      <g clipPath={`url(#${uid})`} transform="translate(0 -10)">
        {item.avatarUrl ? (
          <image href={item.avatarUrl} x="0" y="0" width="300" height="320" preserveAspectRatio="xMidYMin slice" />
        ) : (
          <DefaultFigure tone={tone} />
        )}
      </g>
    </svg>
  );
}

/* ---------- Section ---------- */

export default function TestimonialsSection() {
  const t = useTranslations("Testimonials");
  const reduced = !!useReducedMotion();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

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
        if (Array.isArray(data) && data.length > 0) setTestimonials(data);
      })
      .catch(() => {
        // on garde les témoignages par défaut
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!showSubmitModal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowSubmitModal(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSubmitModal]);

  const current = Math.min(index, testimonials.length - 1);
  const item = testimonials[current];

  function onTabKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (current + (e.key === "ArrowRight" ? 1 : -1) + testimonials.length) % testimonials.length;
    setIndex(next);
    tabs.current[next]?.focus();
  }

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
      setErrorMessage(err instanceof Error ? err.message : t("errors.submit"));
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-[#0B0D18] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#FFC82C]";

  return (
    <section className="relative overflow-hidden bg-[#0B0D18] py-24 font-azurio text-white">
      <div className="mx-auto max-w-6xl px-6">
        {/* En-tête : titre à gauche, action à droite */}
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-achiko text-3xl font-black text-white sm:text-5xl">
              {t("title_prefix")} {t("title_highlight")}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">{t("description")}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSubmitSuccess(false);
              setErrorMessage("");
              setShowSubmitModal(true);
            }}
            className="justify-self-start rounded-xl border border-[#E9D8A6]/50 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-[#E9D8A6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C] lg:justify-self-end"
          >
            {t("actions.leave_testimonial")}
          </button>
        </div>

        {/* Témoignage mis en avant : portrait en guillemet + carte de citation */}
        <div id="testimonial-panel" role="tabpanel" aria-labelledby={`tab-${item.id}`} className="mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={reduced ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, x: -18 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
              className="grid items-center gap-8 lg:grid-cols-[minmax(240px,300px)_1fr] lg:gap-0"
            >
              <div className="relative z-10 mx-auto w-full max-w-[240px] lg:mx-0 lg:-mr-12 lg:max-w-none">
                <Portrait item={item} toneIndex={current} />
              </div>

              <figure className="relative">
                <div className="relative rounded-[28px] border border-white/10 bg-[#141A3F] px-7 pb-12 pt-14 sm:px-12 lg:py-16 lg:pl-20 lg:pr-14">
                  <span aria-hidden="true" className="absolute left-6 top-1 font-serif text-[110px] font-bold leading-none text-[#FFC82C] sm:left-10 lg:left-16">
                    “
                  </span>
                  <blockquote className="text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-[1.7rem]">
                    {item.content}
                  </blockquote>
                  <span aria-hidden="true" className="absolute -bottom-2 right-6 translate-y-1/2 font-serif text-[110px] font-bold leading-[0.5] text-[#FFC82C] sm:right-10">
                    ”
                  </span>
                </div>
                <figcaption className="mt-12 pr-4 text-right sm:pr-10">
                  <strong className="block font-achiko text-xl text-[#FFC82C] sm:text-2xl">{item.authorName}</strong>
                  {item.authorRole && <span className="mt-1 block text-sm text-white/85">{item.authorRole}</span>}
                  {item.company && <span className="block text-sm text-[#E9D8A6]/80">{item.company}</span>}
                </figcaption>
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sélecteur */}
        {testimonials.length > 1 && (
          <div
            role="tablist"
            aria-label={t("list_label")}
            onKeyDown={onTabKey}
            className="mt-12 flex gap-3 overflow-x-auto pb-2"
          >
            {testimonials.map((it, i) => (
              <button
                key={it.id}
                id={`tab-${it.id}`}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-controls="testimonial-panel"
                tabIndex={i === current ? 0 : -1}
                onClick={() => setIndex(i)}
                className={`flex min-w-[230px] items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC82C] ${
                  i === current ? "border-[#FFC82C] bg-white/5" : "border-white/15 hover:border-white/40"
                }`}
              >
                <MiniAvatar item={it} toneIndex={i} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-white">{it.authorName}</span>
                  <span className="block truncate text-xs text-white/60">{it.company || it.authorRole}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SUBMIT TESTIMONIAL MODAL */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("form.title")}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#10141E] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#FFC82C]">{t("form.share_experience")}</span>
                  <h3 className="font-achiko text-xl text-white">{t("form.title")}</h3>
                </div>
                <button
                  type="button"
                  aria-label={t("actions.close")}
                  onClick={() => setShowSubmitModal(false)}
                  className="text-2xl text-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC82C]"
                >
                  ×
                </button>
              </div>

              {submitSuccess ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/10 text-2xl text-emerald-400">
                    ✓
                  </div>
                  <h4 className="font-achiko text-lg text-white">{t("success.title")}</h4>
                  <p className="mx-auto max-w-xs text-xs leading-relaxed text-white/60">{t("success.description")}</p>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="mt-4 rounded-xl bg-[#FFC82C] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#ffd75e]"
                  >
                    {t("actions.close")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTestimonial} className="mt-4 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">{t("form.name_label")} *</span>
                      <input type="text" required value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder={t("form.name_placeholder")} className={field} />
                    </label>
                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">{t("form.role_label")}</span>
                      <input type="text" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} placeholder={t("form.role_placeholder")} className={field} />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">{t("form.company_label")}</span>
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t("form.company_placeholder")} className={field} />
                    </label>
                    <label className="block text-xs font-bold text-white/70">
                      <span className="mb-1 block">{t("form.rating_label")}</span>
                      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className={field}>
                        <option value={5}>★★★★★ (5 / 5)</option>
                        <option value={4}>★★★★☆ (4 / 5)</option>
                        <option value={3}>★★★☆☆ (3 / 5)</option>
                      </select>
                    </label>
                  </div>

                  <label className="block text-xs font-bold text-white/70">
                    <span className="mb-1 block">{t("form.content_label")} *</span>
                    <textarea required rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder={t("form.content_placeholder")} className={field} />
                  </label>

                  {errorMessage && (
                    <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                    <button type="button" onClick={() => setShowSubmitModal(false)} className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white/5">
                      {t("actions.cancel")}
                    </button>
                    <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-[#FFC82C] px-5 py-2 text-xs font-black text-black hover:bg-[#ffd75e] disabled:opacity-50">
                      <i className={`pi ${submitting ? "pi-spin pi-spinner" : "pi-send"} text-xs`} />
                      <span>{submitting ? t("actions.submitting") : t("actions.submit")}</span>
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