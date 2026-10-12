"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";

/**
 * Témoignages : le portrait garde sa forme de guillemet (une épingle le fixe au mur) ; la citation est un
 * morceau de tissu cousu et épinglé ; le sélecteur est une rangée d'étiquettes ; le formulaire est une
 * feuille de papier raphia à lignes, comme le bon de commande de la page Contact.
 */

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

const STITCH = { outline: "2px dashed rgba(233,216,166,.75)", outlineOffset: "-5px" } as const;
const CLOTH =
  "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.1) 0 2px, transparent 2px 4px)";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC82C]";

/* ---------- Épingle en bois ---------- */

function Pin({ size = 22 }: { size?: number }) {
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
    <svg viewBox="0 0 300 420" role="img" aria-label={item.authorName} className="h-auto w-full drop-shadow-[8px_12px_10px_rgba(0,0,0,.45)]">
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
  const lastFocus = useRef<HTMLElement | null>(null);
  const firstField = useRef<HTMLInputElement | null>(null);

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

  function openModal(el: HTMLElement) {
    lastFocus.current = el;
    setSubmitSuccess(false);
    setErrorMessage("");
    setShowSubmitModal(true);
  }
  function closeModal() {
    setShowSubmitModal(false);
    lastFocus.current?.focus();
  }

  // Fenêtre d'envoi : Échap pour fermer, pas de défilement derrière, focus sur le premier champ
  useEffect(() => {
    if (!showSubmitModal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstField.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
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

  // Champs « écrits sur la ligne », comme le bon de commande de la page Contact
  const field =
    "w-full border-0 border-b-2 border-[#141A3F]/45 bg-transparent px-1 py-2 text-base text-[#141A3F] outline-none transition-colors placeholder:text-[#141A3F]/40 focus:border-[#2B3A8C] focus-visible:border-b-4 focus-visible:border-[#2B3A8C]";
  const label = "mb-1 block text-sm font-bold text-[#141A3F]";

  return (
    <section className="relative overflow-hidden bg-[#0B0D18] py-24 font-azurio text-white">
      <div className="mx-auto max-w-6xl px-6">
        {/* En-tête : titre à gauche, action à droite */}
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-achiko text-3xl font-black text-white sm:text-5xl">
              {t("title_prefix")} {t("title_highlight")}
            </h2>
            <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/70">{t("description")}</p>
          </div>
          <button
            type="button"
            onClick={(e) => openModal(e.currentTarget)}
            className={`justify-self-start rounded-[3px] bg-[#2B3A8C] px-6 py-3 text-sm font-bold text-[#F4EBD0] transition-colors hover:bg-[#3446A8] lg:justify-self-end ${focusRing}`}
            style={STITCH}
          >
            {t("actions.leave_testimonial")}
          </button>
        </div>

        {/* Témoignage mis en avant */}
        <div id="testimonial-panel" role="tabpanel" aria-labelledby={`tab-${item.id}`} className="mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={reduced ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, x: -18 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
              className="grid items-center gap-10 lg:grid-cols-[minmax(240px,300px)_1fr] lg:gap-0"
            >
              {/* le portrait, épinglé au mur */}
              <div className="relative z-10 mx-auto w-full max-w-[240px] lg:mx-0 lg:-mr-12 lg:max-w-none">
                <Portrait item={item} toneIndex={current} />
                <span className="absolute left-1/2 top-[3%] -translate-x-1/2 -translate-y-1/2">
                  <Pin size={26} />
                </span>
              </div>

              <figure className="relative">
                {/* la citation : un morceau de tissu cousu, épinglé */}
                <div
                  className="relative rounded-[3px] bg-[#141A3F] px-7 pb-12 pt-14 shadow-[0_20px_40px_rgba(0,0,0,.5)] sm:px-12 lg:py-16 lg:pl-20 lg:pr-14"
                  style={{ backgroundImage: CLOTH, ...STITCH }}
                >
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <Pin size={26} />
                  </span>
                  <span aria-hidden="true" className="absolute left-6 top-1 font-serif text-[110px] font-bold leading-none text-[#FFC82C] sm:left-10 lg:left-16">
                    “
                  </span>
                  <blockquote className="text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-[1.7rem]">{item.content}</blockquote>
                  <span aria-hidden="true" className="absolute -bottom-2 right-6 translate-y-1/2 font-serif text-[110px] font-bold leading-[0.5] text-[#FFC82C] sm:right-10">
                    ”
                  </span>
                </div>
                <figcaption className="mt-12 pr-4 text-right sm:pr-10">
                  <strong className="block font-achiko text-xl text-[#FFC82C] sm:text-2xl">{item.authorName}</strong>
                  {item.authorRole && <span className="mt-1 block text-base text-white/85">{item.authorRole}</span>}
                  {item.company && <span className="block text-base text-[#E9D8A6]/85">{item.company}</span>}
                </figcaption>
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sélecteur : une rangée d'étiquettes */}
        {testimonials.length > 1 && (
          <div role="tablist" aria-label={t("list_label")} onKeyDown={onTabKey} className="mt-14 flex gap-4 overflow-x-auto px-1 pb-3 pt-3">
            {testimonials.map((it, i) => {
              const active = i === current;
              return (
                <button
                  key={it.id}
                  id={`tab-${it.id}`}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="testimonial-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={`relative flex min-w-[240px] items-center gap-3 rounded-[3px] px-4 pb-3 pt-4 text-left transition-colors ${focusRing} ${
                    active ? "bg-[#FFC82C] text-[#141A3F]" : "bg-[#2B3A8C] text-[#F4EBD0] hover:bg-[#3446A8]"
                  }`}
                  style={active ? { boxShadow: "0 8px 14px rgba(0,0,0,.45)" } : { backgroundImage: CLOTH, ...STITCH }}
                >
                  {active && (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                      <Pin size={18} />
                    </span>
                  )}
                  <MiniAvatar item={it} toneIndex={i} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{it.authorName}</span>
                    <span className={`block truncate text-xs ${active ? "text-[#141A3F]/75" : "text-[#E9D8A6]/85"}`}>{it.company || it.authorRole}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FORMULAIRE D'ENVOI : une feuille de papier raphia épinglée */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 sm:items-center"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="testimonial-form-title"
              initial={reduced ? false : { y: -28, rotate: -1.2, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { y: -20, rotate: 1, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-auto w-full max-w-lg rounded-[3px] bg-[#E9D8A6] p-6 pt-9 text-[#141A3F] shadow-2xl sm:p-8 sm:pt-10"
            >
              <span className="absolute left-6 top-0 -translate-y-1/2">
                <Pin size={28} />
              </span>
              <span className="absolute right-6 top-0 -translate-y-1/2">
                <Pin size={28} />
              </span>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#141A3F]/70">{t("form.share_experience")}</p>
                  <h3 id="testimonial-form-title" className="font-achiko text-2xl font-black leading-tight">
                    {t("form.title")}
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label={t("actions.close")}
                  onClick={closeModal}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-2xl text-[#141A3F]/70 hover:bg-[#141A3F]/10 hover:text-[#141A3F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#141A3F]"
                >
                  ×
                </button>
              </div>

              {submitSuccess ? (
                <div className="space-y-4 py-8">
                  <h4 className="font-achiko text-xl font-black">{t("success.title")}</h4>
                  <p className="text-base leading-relaxed text-[#141A3F]/85">{t("success.description")}</p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-2 rounded-[3px] bg-[#2B3A8C] px-6 py-3 text-sm font-bold text-[#F4EBD0] transition-colors hover:bg-[#3446A8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141A3F]"
                    style={STITCH}
                  >
                    {t("actions.close")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTestimonial} className="mt-6 space-y-5" aria-busy={submitting}>
                  <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="tm-name" className={label}>
                        {t("form.name_label")} <span className="text-[#B3263A]">*</span>
                      </label>
                      <input id="tm-name" ref={firstField} type="text" required value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder={t("form.name_placeholder")} className={field} />
                    </div>
                    <div>
                      <label htmlFor="tm-role" className={label}>
                        {t("form.role_label")}
                      </label>
                      <input id="tm-role" type="text" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} placeholder={t("form.role_placeholder")} className={field} />
                    </div>
                    <div>
                      <label htmlFor="tm-company" className={label}>
                        {t("form.company_label")}
                      </label>
                      <input id="tm-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t("form.company_placeholder")} className={field} />
                    </div>
                    <div>
                      <label htmlFor="tm-rating" className={label}>
                        {t("form.rating_label")}
                      </label>
                      <select id="tm-rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} className={field}>
                        <option value={5}>★★★★★ (5 / 5)</option>
                        <option value={4}>★★★★☆ (4 / 5)</option>
                        <option value={3}>★★★☆☆ (3 / 5)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tm-content" className={label}>
                      {t("form.content_label")} <span className="text-[#B3263A]">*</span>
                    </label>
                    {/* lignes de papier réglé */}
                    <textarea
                      id="tm-content"
                      required
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={t("form.content_placeholder")}
                      className="w-full resize-y border-0 bg-transparent px-1 text-base leading-8 text-[#141A3F] outline-none placeholder:text-[#141A3F]/40 focus-visible:bg-[#141A3F]/5"
                      style={{ backgroundImage: "repeating-linear-gradient(transparent 0 31px, rgba(20,26,63,.4) 31px 32px)", backgroundSize: "100% 32px" }}
                    />
                  </div>

                  {errorMessage && (
                    <p role="alert" className="rounded-[3px] bg-[#9C2233] p-3 text-sm font-bold text-[#F4EBD0]">
                      {errorMessage}
                    </p>
                  )}

                  <div className="flex flex-wrap justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-[3px] border-2 border-[#141A3F]/60 px-5 py-3 text-sm font-bold text-[#141A3F] transition-colors hover:bg-[#141A3F]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141A3F]"
                    >
                      {t("actions.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-[3px] bg-[#2B3A8C] px-6 py-3 text-sm font-bold text-[#F4EBD0] transition-colors hover:bg-[#3446A8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141A3F] disabled:cursor-wait disabled:opacity-60"
                      style={STITCH}
                    >
                      {submitting ? t("actions.submitting") : t("actions.submit")}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}