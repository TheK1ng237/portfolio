"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { apiFetch, API_TOKEN_STORAGE_KEY } from "@/lib/api";
import ProposalStudioAdmin from "./ProposalStudioAdmin";
import ProposalDocument, {
  type ProposalDocumentData,
} from "./ProposalDocument";

type AdminUser = { id: string; name: string; email: string; role: string };

type Client = {
  id: string;
  companyName?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  address?: string | null;
  _count?: { proposals: number };
};

type Proposal = {
  id: string;
  proposalNumber: string;
  title: string;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  currency: string;
  totalAmount: number | string;
  createdAt: string;
  validUntil?: string | null;
  client: Pick<Client, "firstName" | "lastName" | "companyName" | "email">;
  _count?: { items: number };
  documentData?: unknown;
};

type ProposalDetail = Proposal & {
  description?: string | null;
  documentData?: unknown;
  items?: {
    id: string;
    label: string;
    description?: string | null;
    quantity: number | string;
    unitPrice: number | string;
    totalPrice: number | string;
  }[];
};

type Testimonial = {
  id: string;
  authorName: string;
  authorRole?: string | null;
  company?: string | null;
  avatarUrl?: string | null;
  content: string;
  rating: number;
  isPublished: boolean;
  createdAt?: string;
};

type View = "overview" | "proposals" | "studio" | "clients" | "testimonials";

type ClientForm = {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
};

type TestimonialForm = {
  authorName: string;
  authorRole: string;
  company: string;
  avatarUrl: string;
  content: string;
  rating: number;
  isPublished: boolean;
};

const emptyClient: ClientForm = {
  companyName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  country: "Cameroun",
};

const emptyTestimonial: TestimonialForm = {
  authorName: "",
  authorRole: "",
  company: "",
  avatarUrl: "",
  content: "",
  rating: 5,
  isPublished: true,
};

const statusStyles: Record<Proposal["status"], string> = {
  DRAFT: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  SENT: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  ACCEPTED: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  REJECTED: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  CANCELLED: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

function formatMoney(value: number | string, currency: string, locale: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `0 ${currency}`;
  return `${new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 0 }).format(amount)} ${currency}`;
}

function formatDate(value: string, locale: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function getClientName(client: Proposal["client"]) {
  return client.companyName || `${client.firstName} ${client.lastName}`;
}

function StatusBadge({ status }: { status: Proposal["status"] }) {
  const t = useTranslations("AdminPage");
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {t(`status.${status.toLowerCase()}`)}
    </span>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs font-bold text-white/70">
      <span className="mb-1.5 block">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-[#0b0d14] px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none transition focus:border-amber-400"
      />
    </label>
  );
}

export default function AdminDashboard({ locale }: { locale: string }) {
  const t = useTranslations("AdminPage");
  const [view, setView] = useState<View>("overview");
  const [token, setToken] = useState("");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authState, setAuthState] = useState<
    "checking" | "signed-out" | "ready"
  >("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Client Modal
  const [clientDialog, setClientDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientForm, setClientForm] = useState<ClientForm>(emptyClient);

  // Testimonial Modal
  const [testimonialDialog, setTestimonialDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] =
    useState<TestimonialForm>(emptyTestimonial);

  // Proposal Detail Modal & Full Document Preview Modal
  const [selectedProposal, setSelectedProposal] =
    useState<ProposalDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [previewDocumentData, setPreviewDocumentData] =
    useState<ProposalDocumentData | null>(null);

  useEffect(() => {
    let active = true;
    const savedToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem(API_TOKEN_STORAGE_KEY)
        : null;
    if (!savedToken) {
      setAuthState("signed-out");
      return () => {
        active = false;
      };
    }

    setToken(savedToken);
    apiFetch<AdminUser>("auth/me", { token: savedToken })
      .then((profile) => {
        if (!active) return;
        if (profile.role !== "ADMIN")
          throw new Error(
            "Ce compte ne possède pas les privilèges administrateur.",
          );
        setUser(profile);
        setAuthState("ready");
      })
      .catch((err: unknown) => {
        if (!active) return;
        window.localStorage.removeItem(API_TOKEN_STORAGE_KEY);
        setToken("");
        setAuthState("signed-out");
        setMessage(
          err instanceof Error
            ? err.message
            : t("errors.session"),
        );
      });

    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    if (!token || !user) return;
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      const query = new URLSearchParams({
        limit: "100",
        sortBy: "createdAt",
        order: "desc",
      });
      if (search.trim()) query.set("search", search.trim());
      if (statusFilter) query.set("status", statusFilter);

      Promise.all([
        apiFetch<Proposal[]>(`proposals?${query.toString()}`, { token }),
        apiFetch<Client[]>(
          `clients?limit=100&sortBy=createdAt&order=desc${search.trim() ? `&search=${encodeURIComponent(search.trim())}` : ""}`,
          { token },
        ),
        apiFetch<Testimonial[]>("testimonials", { token }).catch(() => []),
      ])
        .then(([propList, clientList, testimonialList]) => {
          if (!active) return;
          setProposals(propList);
          setClients(clientList);
          setTestimonials(testimonialList);
        })
        .catch((err: unknown) => {
          if (active)
            setMessage(
              err instanceof Error
                ? err.message
                : t("errors.load_data"),
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 200);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [token, user, search, statusFilter, refreshKey, t]);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const result = await apiFetch<{ token: string }>("auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const profile = await apiFetch<AdminUser>("auth/me", {
        token: result.token,
      });
      if (profile.role !== "ADMIN")
        throw new Error(t("errors.admin_required"));
      window.localStorage.setItem(API_TOKEN_STORAGE_KEY, result.token);
      setToken(result.token);
      setUser(profile);
      setAuthState("ready");
      setPassword("");
      setMessage("");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : t("errors.authentication"),
      );
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    window.localStorage.removeItem(API_TOKEN_STORAGE_KEY);
    setToken("");
    setUser(null);
    setAuthState("signed-out");
    setProposals([]);
    setClients([]);
    setTestimonials([]);
    setView("overview");
  }

  async function changeProposalStatus(
    proposal: Proposal,
    action: "send" | "accept" | "reject" | "cancel",
  ) {
    try {
      await apiFetch(`proposals/${proposal.id}/${action}`, {
        method: "POST",
        token,
      });
      setMessage(t("messages.proposal_status_updated", { reference: proposal.proposalNumber }));
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : t("errors.update_status"),
      );
    }
  }

  async function removeProposal(proposal: Proposal) {
    if (
      !window.confirm(
        t("confirm.delete_proposal", { reference: proposal.proposalNumber }),
      )
    )
      return;
    try {
      await apiFetch(`proposals/${proposal.id}`, { method: "DELETE", token });
      setMessage(t("messages.proposal_deleted"));
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : t("errors.delete"),
      );
    }
  }

  function openClientEditor(client?: Client) {
    setEditingClient(client ?? null);
    setClientForm(
      client
        ? {
            companyName: client.companyName ?? "",
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            phone: client.phone ?? "",
            city: client.city ?? "",
            country: client.country ?? "",
          }
        : emptyClient,
    );
    setClientDialog(true);
  }

  async function saveClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(clientForm).map(([k, v]) => [k, v.trim() || undefined]),
    );
    try {
      await apiFetch(
        editingClient ? `clients/${editingClient.id}` : "clients",
        {
          method: editingClient ? "PUT" : "POST",
          token,
          body: JSON.stringify(payload),
        },
      );
      setClientDialog(false);
      setMessage(
        editingClient ? t("messages.client_updated") : t("messages.client_created"),
      );
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : t("errors.save_client"),
      );
    }
  }

  async function removeClient(client: Client) {
    const name = client.companyName || `${client.firstName} ${client.lastName}`;
    if (!window.confirm(t("confirm.delete_client", { name }))) return;
    try {
      await apiFetch(`clients/${client.id}`, { method: "DELETE", token });
      setMessage(t("messages.client_deleted"));
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Suppression impossible.",
      );
    }
  }

  // Testimonial Actions
  function openTestimonialEditor(item?: Testimonial) {
    setEditingTestimonial(item ?? null);
    setTestimonialForm(
      item
        ? {
            authorName: item.authorName,
            authorRole: item.authorRole ?? "",
            company: item.company ?? "",
            avatarUrl: item.avatarUrl ?? "",
            content: item.content,
            rating: item.rating ?? 5,
            isPublished: item.isPublished,
          }
        : emptyTestimonial,
    );
    setTestimonialDialog(true);
  }

  async function saveTestimonial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = {
      authorName: testimonialForm.authorName.trim(),
      authorRole: testimonialForm.authorRole.trim() || undefined,
      company: testimonialForm.company.trim() || undefined,
      avatarUrl: testimonialForm.avatarUrl.trim() || undefined,
      content: testimonialForm.content.trim(),
      rating: Number(testimonialForm.rating),
      isPublished: Boolean(testimonialForm.isPublished),
    };

    try {
      await apiFetch(
        editingTestimonial
          ? `testimonials/${editingTestimonial.id}`
          : "testimonials",
        {
          method: editingTestimonial ? "PUT" : "POST",
          token,
          body: JSON.stringify(payload),
        },
      );
      setTestimonialDialog(false);
      setMessage(
        editingTestimonial
          ? t("messages.testimonial_updated")
          : t("messages.testimonial_created"),
      );
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : t("errors.save_testimonial"),
      );
    }
  }

  async function toggleTestimonialPublish(item: Testimonial) {
    try {
      await apiFetch(`testimonials/${item.id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      setMessage(t("messages.testimonial_visibility_updated", { name: item.authorName }));
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : t("errors.update"),
      );
    }
  }

  async function removeTestimonial(item: Testimonial) {
    if (!window.confirm(t("confirm.delete_testimonial", { name: item.authorName })))
      return;
    try {
      await apiFetch(`testimonials/${item.id}`, { method: "DELETE", token });
      setMessage(t("messages.testimonial_deleted"));
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : t("errors.delete"),
      );
    }
  }

  async function openProposalDetail(proposal: Proposal) {
    setDetailLoading(true);
    try {
      const detail = await apiFetch<ProposalDetail>(
        `proposals/${proposal.id}`,
        { token },
      );
      setSelectedProposal(detail);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : t("errors.load_proposal"),
      );
    } finally {
      setDetailLoading(false);
    }
  }

  async function openDocumentPreview(proposal: Proposal) {
    setDetailLoading(true);
    try {
      const detail = await apiFetch<ProposalDetail>(
        `proposals/${proposal.id}`,
        { token },
      );
      if (detail.documentData && typeof detail.documentData === "object") {
        setPreviewDocumentData(detail.documentData as ProposalDocumentData);
      } else {
        setPreviewDocumentData({
          brand: "Thek1ng237",
          creatorName: "NDOH YANNICK TANG",
          email: "ndohyannick78@gmail.com",
          phone: "+237 653 53 91 02",
          reference: detail.proposalNumber,
          issuedAt: formatDate(detail.createdAt, locale),
          validity: detail.validUntil
            ? formatDate(detail.validUntil, locale)
            : "30 jours",
          clientName: getClientName(detail.client),
          clientShortName: detail.client.companyName || detail.client.firstName,
          clientSlogan: detail.client.email,
          recipient: `${detail.client.firstName} ${detail.client.lastName}`,
          summary: detail.title,
          projectOverviewTitle: "Proposition commerciale sur mesure",
          context:
            detail.description ||
            "Cadrage et livraison des prestations demandées.",
          centralChallenge: "Réaliser le projet selon le cahier des charges.",
          centralChallengeLabel: "Objectif du projet",
          objectives: [
            {
              title: "Livraison de qualité",
              description: "Respect des exigences techniques.",
              accent: "border-t-[#ffc82c]",
            },
          ],
          objectivesHeading: "Objectifs clés",
          orientation: "Mise en place d'une solution moderne et évolutive.",
          orientationLabel: "Approche préconisée",
          designSectionTitle: "Spécifications & Design",
          designPhases: [],
          journeysHeading: "Parcours utilisateur",
          journeys: ["Découverte de l'offre", "Validation du périmètre"],
          designPrinciplesHeading: "Principes clés",
          designPrinciples: ["Performance", "Sécurité", "Ergonomie"],
          developmentSectionTitle: "Réalisation & Technologie",
          developmentIntroduction: "Architecture solide et maintenable.",
          developmentPhases: [],
          implementationNotesLabel: "Notes d'exécution :",
          implementationNotes:
            "Inclusions et périmètres validés avec le client.",
          deploymentHeading: "Recette et mise en ligne",
          deployment: "Tests et livraison finale.",
          budgetSectionTitle: "Proposition Financière",
          budgetIntroduction:
            "Chiffrage des prestations incluses dans cette offre.",
          budgetItems: (detail.items || []).map((it) => ({
            phase: it.label,
            deliverables: it.description || "",
            amount: Number(it.totalPrice),
          })),
          currency: detail.currency,
          payments: [
            {
              label: "Acompte démarrage",
              percentage: 50,
              milestone: "À l'acceptation",
            },
            {
              label: "Livraison finale",
              percentage: 50,
              milestone: "Après validation",
            },
          ],
          paymentHeading: "Échéancier indicatif",
          timelineTitle: "Planning indicatif",
          timeline: [
            { period: "Livraison", description: "Selon calendrier convenu." },
          ],
          clientInputsHeading: "À fournir par le client",
          clientInputs: "Contenus, visuels et accès requis.",
          finalChecksHeading: "Confidentialité & Validation",
          finalChecks: "Document confidentiel adressé au client.",
        });
      }
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : t("errors.load_document"),
      );
    } finally {
      setDetailLoading(false);
    }
  }

  // Statistics Computations
  const totalsByCurrency = proposals.reduce<Record<string, number>>(
    (acc, p) => {
      acc[p.currency] = (acc[p.currency] ?? 0) + Number(p.totalAmount || 0);
      return acc;
    },
    {},
  );

  const draftCount = proposals.filter((p) => p.status === "DRAFT").length;
  const sentCount = proposals.filter((p) => p.status === "SENT").length;
  const acceptedCount = proposals.filter((p) => p.status === "ACCEPTED").length;

  if (authState === "checking") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07090e] font-azurio text-sm text-amber-400">
        <div className="flex items-center gap-3">
          <i className="pi pi-spin pi-spinner text-xl" />
          <span>{t("ui.checking_session")}</span>
        </div>
      </main>
    );
  }

  if (authState === "signed-out") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07090e] px-4 py-12 font-azurio text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10141e]/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <a
              href={`/${locale}`}
              className="text-xs font-bold uppercase tracking-widest text-amber-400 hover:underline"
            >
              ← Portfolio
            </a>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
              {t("ui.api_online")}
            </span>
          </div>

          <div className="mt-6 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/10 font-achiko text-2xl font-black text-amber-400 shadow-[0_0_20px_rgba(255,200,44,0.2)]">
              K
            </div>
            <h1 className="mt-4 font-achiko text-2xl tracking-wide text-white">
              {t("ui.console_title")}
            </h1>
            <p className="mt-1 text-xs text-white/50">
              {t("ui.login_description")}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={signIn}>
            <InputField
              label={t("ui.email_label")}
              type="email"
              value={email}
              onChange={setEmail}
              required
              placeholder="admin@Thek1ng237.com"
            />
            <InputField
              label={t("ui.password_label")}
              type="password"
              value={password}
              onChange={setPassword}
              required
              placeholder="••••••••••••"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-xs font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,200,44,0.3)] transition hover:scale-[1.02] disabled:opacity-50"
            >
              {loading
                ? t("ui.authenticating")
                : t("ui.open_backoffice")}
            </button>
          </form>

          {message && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {message}
            </div>
          )}

          <p className="mt-6 text-center text-[10px] text-white/30">
            {t("ui.security_note")}
          </p>
        </div>
      </main>
    );
  }

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: "overview", label: t("ui.nav.overview"), icon: "pi pi-chart-line" },
    { id: "proposals", label: t("ui.nav.proposals"), icon: "pi pi-file-edit" },
    { id: "studio", label: t("ui.nav.studio"), icon: "pi pi-pencil" },
    { id: "clients", label: t("ui.nav.clients"), icon: "pi pi-users" },
    { id: "testimonials", label: t("ui.nav.testimonials"), icon: "pi pi-star" },
  ];

  return (
    <div className="admin-shell min-h-screen bg-[#07090e] font-azurio text-white print:bg-white print:text-black">
      <div className="mx-auto grid min-h-screen max-w-[1720px] lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="sticky top-0 z-40 flex flex-col justify-between border-b border-white/10 bg-[#0c0f18] px-5 py-6 lg:h-screen lg:border-b-0 lg:border-r print:hidden">
          <div>
            <div className="flex items-center justify-between">
              <a href={`/${locale}`} className="group flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-amber-400/50 bg-amber-400/10 font-achiko text-base font-black text-amber-400 transition group-hover:scale-105">
                  K
                </div>
                <div>
                  <span className="block text-xs font-bold tracking-widest text-white">
                    Thek1ng237
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-amber-400/80">
                    {t("ui.suite_name")}
                  </span>
                </div>
              </a>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                API
              </span>
            </div>

            <nav
              className="mt-8 space-y-1.5"
              aria-label={t("ui.nav_label")}
            >
              {navItems.map((item) => {
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setView(item.id)}
                    className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition ${
                      isActive
                        ? "bg-amber-400/15 text-amber-300 shadow-[0_0_15px_rgba(255,200,44,0.15)]"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <i
                      className={`${item.icon} text-sm ${isActive ? "text-amber-400" : "text-white/40"}`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-amber-400"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#121622] p-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-400/20 font-achiko text-xs font-black text-amber-400">
                {user?.name?.slice(0, 2).toUpperCase() || "KT"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">
                  {user?.name}
                </p>
                <p className="truncate text-[10px] text-white/40">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <a
                href={`/${locale}`}
                className="text-[10px] font-bold text-white/50 hover:text-amber-300 transition"
              >
                ← {t("ui.public_portfolio")}
              </a>
              <button
                type="button"
                onClick={signOut}
                className="text-[10px] font-bold text-rose-400/80 hover:text-rose-300 transition"
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="min-w-0 px-4 py-6 sm:px-8 lg:px-10 print:p-0">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 print:hidden">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                {t("ui.console_label")} ·{" "}
                {new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "full" }).format(
                  new Date(),
                )}
              </p>
              <h1 className="mt-1 font-achiko text-2xl text-white sm:text-3xl">
                {view === "overview" && t("ui.nav.overview")}
                {view === "proposals" && t("ui.headers.proposals")}
                {view === "studio" && t("ui.nav.studio")}
                {view === "clients" && t("ui.headers.clients")}
                {view === "testimonials" && t("ui.headers.testimonials")}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setRefreshKey((k) => k + 1)}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#121622] px-3.5 py-2 text-xs font-bold text-white/80 transition hover:border-amber-400/50 hover:text-amber-300 disabled:opacity-50"
              >
                <i
                  className={`pi pi-refresh text-xs ${loading ? "animate-spin" : ""}`}
                />
                <span>{t("ui.refresh")}</span>
              </button>

              {view === "testimonials" ? (
                <button
                  type="button"
                  onClick={() => openTestimonialEditor()}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300"
                >
                  <i className="pi pi-plus text-xs" />
                  <span>{t("ui.new_testimonial")}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setView("studio")}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-400 hover:text-black"
                >
                  <i className="pi pi-plus text-xs" />
                  <span>{t("ui.new_proposal")}</span>
                </button>
              )}
            </div>
          </header>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex items-center justify-between rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-xs text-amber-200 print:hidden"
              >
                <span>{message}</span>
                <button
                  type="button"
                  onClick={() => setMessage("")}
                  className="text-base text-amber-400 hover:text-white"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: OVERVIEW */}
          {view === "overview" && (
            <div className="space-y-8 print:hidden">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  {
                    label: t("ui.stats.total_proposals"),
                    value: String(proposals.length),
                    icon: "pi pi-file",
                    color: "text-amber-400",
                  },
                  {
                    label: t("ui.stats.drafts"),
                    value: String(draftCount),
                    icon: "pi pi-clock",
                    color: "text-slate-400",
                  },
                  {
                    label: t("ui.stats.awaiting_client"),
                    value: String(sentCount),
                    icon: "pi pi-send",
                    color: "text-sky-400",
                  },
                  {
                    label: t("ui.stats.accepted"),
                    value: String(acceptedCount),
                    icon: "pi pi-check-circle",
                    color: "text-emerald-400",
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-2xl border border-white/10 bg-[#0e121b] p-5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                        {kpi.label}
                      </span>
                      <i className={`${kpi.icon} ${kpi.color} text-base`} />
                    </div>
                    <strong className="mt-3 block font-achiko text-3xl text-white">
                      {kpi.value}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.9fr)]">
                <section className="rounded-2xl border border-white/10 bg-[#0e121b] p-6 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-achiko text-lg text-white">
                        {t("ui.recent_proposals")}
                      </h2>
                      <p className="text-xs text-white/40">
                        {t("ui.recent_proposals_description")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setView("proposals")}
                      className="text-xs font-bold text-amber-400 hover:underline"
                    >
                      {t("ui.view_all")} →
                    </button>
                  </div>

                  <ProposalTable
                    locale={locale}
                    proposals={proposals.slice(0, 6)}
                    loading={loading}
                    onOpenDetail={openProposalDetail}
                    onOpenPreview={openDocumentPreview}
                    onStatus={changeProposalStatus}
                    onDelete={removeProposal}
                  />
                </section>

                <section className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-[#0e121b] p-6 shadow-xl">
                    <h2 className="font-achiko text-lg text-white">
                      {t("ui.financial_volume")}
                    </h2>
                    <p className="mt-1 text-xs text-white/40">
                      {t("ui.proposals_by_currency")}
                    </p>
                    <div className="mt-4 space-y-2">
                      {Object.entries(totalsByCurrency).map(([curr, total]) => (
                        <div
                          key={curr}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-[#131824] p-3"
                        >
                          <span className="text-xs font-bold text-white/70">
                            {curr}
                          </span>
                          <strong className="font-achiko text-xl text-amber-400">
                            {formatMoney(total, curr, locale)}
                          </strong>
                        </div>
                      ))}
                      {Object.keys(totalsByCurrency).length === 0 && (
                        <div className="rounded-xl border border-white/10 bg-[#131824] p-3">
                          <strong className="font-achiko text-xl text-amber-400">
                            0 XAF
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0e121b] p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h2 className="font-achiko text-lg text-white">
                        {t("ui.recent_clients")}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setView("clients")}
                        className="text-xs font-bold text-amber-400 hover:underline"
                      >
                        CRM →
                      </button>
                    </div>
                    <div className="mt-4 divide-y divide-white/10">
                      {clients.slice(0, 5).map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="min-w-0">
                            <strong className="block truncate text-xs text-white">
                              {c.companyName || `${c.firstName} ${c.lastName}`}
                            </strong>
                            <span className="truncate text-[10px] text-white/40">
                              {c.email}
                            </span>
                          </div>
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                            {t("ui.proposal_count", { count: c._count?.proposals ?? 0 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: PROPOSALS */}
          {view === "proposals" && (
            <section className="space-y-6 print:hidden">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("ui.search_proposals")}
                    className="w-full rounded-xl border border-white/15 bg-[#0e121b] pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/15 bg-[#0e121b] px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400 sm:w-52"
                >
                  <option value="">{t("ui.all_statuses")}</option>
                  {Object.keys(statusStyles).map((status) => (
                    <option key={status} value={status}>
                      {t(`status.${status.toLowerCase()}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0e121b] p-4 sm:p-6 shadow-xl">
                <ProposalTable
                  locale={locale}
                  proposals={proposals}
                  loading={loading}
                  onOpenDetail={openProposalDetail}
                  onOpenPreview={openDocumentPreview}
                  onStatus={changeProposalStatus}
                  onDelete={removeProposal}
                />
              </div>
            </section>
          )}

          {/* TAB 3: STUDIO DEVIS */}
          {view === "studio" && (
            <div className="print:hidden">
              <ProposalStudioAdmin
                token={token}
                clients={clients}
                onSaved={() => {
                  setRefreshKey((k) => k + 1);
                  setView("proposals");
                }}
              />
            </div>
          )}

          {/* TAB 4: CLIENTS CRM */}
          {view === "clients" && (
            <section className="space-y-6 print:hidden">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("ui.search_clients")}
                    className="w-full rounded-xl border border-white/15 bg-[#0e121b] pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => openClientEditor()}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-300"
                >
                  <i className="pi pi-plus text-xs" />
                  <span>{t("ui.add_client")}</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0e121b] p-4 shadow-xl">
                <table className="w-full min-w-[750px] text-left text-xs">
                  <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-white/40">
                    <tr>
                      <th className="py-3 px-4">{t("ui.table.client_company")}</th>
                      <th className="py-3 px-4">{t("ui.table.contact")}</th>
                      <th className="py-3 px-4">{t("ui.table.location")}</th>
                      <th className="py-3 px-4">{t("ui.table.proposals_made")}</th>
                      <th className="py-3 px-4 text-right">{t("ui.table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {clients.map((c) => (
                      <tr key={c.id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 px-4">
                          <strong className="block text-white">
                            {c.companyName || `${c.firstName} ${c.lastName}`}
                          </strong>
                          <span className="text-[10px] text-white/40">
                            {c.firstName} {c.lastName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <a
                            href={`mailto:${c.email}`}
                            className="text-white/80 hover:text-amber-300"
                          >
                            {c.email}
                          </a>
                          <span className="block text-[10px] text-white/40">
                            {c.phone || t("ui.no_phone")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-white/60">
                          {[c.city, c.country].filter(Boolean).join(", ") ||
                            "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-amber-400">
                            {c._count?.proposals ?? 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openClientEditor(c)}
                              className="rounded-lg border border-white/15 p-1.5 text-white/70 hover:border-amber-400 hover:text-amber-300"
                              title={t("ui.edit")}
                            >
                              <i className="pi pi-pencil text-xs" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeClient(c)}
                              className="rounded-lg border border-white/15 p-1.5 text-rose-400/80 hover:border-rose-400 hover:text-rose-300"
                              title={t("ui.delete")}
                            >
                              <i className="pi pi-trash text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {view === "testimonials" && (
            <section className="space-y-6 print:hidden">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-achiko text-lg text-white">
                    {t("ui.testimonial_moderation_title")}
                  </h2>
                  <p className="text-xs text-white/60">
                    {t("ui.testimonial_moderation_description")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openTestimonialEditor()}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-300"
                >
                  <i className="pi pi-plus text-xs" />
                  <span>{t("ui.add_testimonial")}</span>
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className={`flex flex-col justify-between rounded-2xl border p-6 shadow-xl transition ${
                      !testimonial.isPublished
                        ? "border-amber-400/50 bg-[#121622]"
                        : "border-white/10 bg-[#0e121b]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-400">
                            {Array.from({ length: testimonial.rating || 5 }).map(
                              (_, i) => (
                                <i
                                  key={i}
                                  className="pi pi-star-fill text-xs mr-0.5"
                                />
                              ),
                            )}
                          </div>
                          {!testimonial.isPublished && (
                            <span className="rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                              {t("ui.pending_moderation")}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleTestimonialPublish(testimonial)}
                          className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition ${
                            testimonial.isPublished
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                              : "border-amber-400 bg-amber-400 text-black hover:bg-amber-300"
                          }`}
                        >
                          {testimonial.isPublished
                            ? t("ui.published")
                            : t("ui.approve_publish")}
                        </button>
                      </div>

                      <p className="text-xs leading-relaxed text-white/80 italic">
                          &quot;{testimonial.content}&quot;
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                      <div>
                        <strong className="block font-achiko text-xs text-white">
                          {testimonial.authorName}
                        </strong>
                        <span className="text-[10px] text-amber-400">
                          {[testimonial.authorRole, testimonial.company]
                            .filter(Boolean)
                            .join(" · ") || t("ui.client")}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openTestimonialEditor(testimonial)}
                          className="rounded-lg border border-white/15 p-1.5 text-white/70 hover:border-amber-400 hover:text-amber-300"
                          title={t("ui.edit_testimonial")}
                        >
                          <i className="pi pi-pencil text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTestimonial(testimonial)}
                          className="rounded-lg border border-white/15 p-1.5 text-rose-400/80 hover:border-rose-400 hover:text-rose-300"
                          title={t("ui.delete")}
                        >
                          <i className="pi pi-trash text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {testimonials.length === 0 && (
                  <div className="col-span-2 rounded-2xl border border-white/10 bg-[#0e121b] p-12 text-center text-xs text-white/40">
                    {t("ui.no_testimonials")}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* CLIENT MODAL */}
      {clientDialog && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm print:hidden">
          <form
            onSubmit={saveClient}
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#10141e] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-achiko text-xl text-white">
                {editingClient
                  ? t("ui.edit_client")
                  : t("ui.new_client")}
              </h2>
              <button
                type="button"
                onClick={() => setClientDialog(false)}
                className="text-xl text-white/40 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InputField
                label={t("ui.company_label")}
                value={clientForm.companyName}
                onChange={(v) =>
                  setClientForm((f) => ({ ...f, companyName: v }))
                }
                placeholder={t("ui.company_placeholder")}
              />
              <InputField
                label={t("ui.first_name")}
                value={clientForm.firstName}
                onChange={(v) => setClientForm((f) => ({ ...f, firstName: v }))}
                required
                placeholder={t("ui.first_name_placeholder")}
              />
              <InputField
                label={t("ui.last_name")}
                value={clientForm.lastName}
                onChange={(v) => setClientForm((f) => ({ ...f, lastName: v }))}
                required
                placeholder={t("ui.last_name_placeholder")}
              />
              <InputField
                label="Email"
                type="email"
                value={clientForm.email}
                onChange={(v) => setClientForm((f) => ({ ...f, email: v }))}
                required
                placeholder={t("ui.client_email_placeholder")}
              />
              <InputField
                label={t("ui.phone")}
                value={clientForm.phone}
                onChange={(v) => setClientForm((f) => ({ ...f, phone: v }))}
                placeholder="+237 6..."
              />
              <InputField
                label={t("ui.city")}
                value={clientForm.city}
                onChange={(v) => setClientForm((f) => ({ ...f, city: v }))}
                placeholder={t("ui.city_placeholder")}
              />
              <InputField
                label={t("ui.country")}
                value={clientForm.country}
                onChange={(v) => setClientForm((f) => ({ ...f, country: v }))}
                placeholder={t("ui.country_placeholder")}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setClientDialog(false)}
                className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white/5"
              >
                {t("ui.cancel")}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300"
              >
                {editingClient ? t("ui.save") : t("ui.create_client")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {testimonialDialog && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm print:hidden">
          <form
            onSubmit={saveTestimonial}
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#10141e] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-achiko text-xl text-white">
                {editingTestimonial
                  ? t("ui.edit_testimonial")
                  : t("ui.new_testimonial")}
              </h2>
              <button
                type="button"
                onClick={() => setTestimonialDialog(false)}
                className="text-xl text-white/40 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InputField
                label={t("ui.author_name")}
                value={testimonialForm.authorName}
                onChange={(v) =>
                  setTestimonialForm((f) => ({ ...f, authorName: v }))
                }
                required
                placeholder={t("ui.author_name_placeholder")}
              />
              <InputField
                label={t("ui.role")}
                value={testimonialForm.authorRole}
                onChange={(v) =>
                  setTestimonialForm((f) => ({ ...f, authorRole: v }))
                }
                placeholder={t("ui.role_placeholder")}
              />
              <InputField
                label={t("ui.company_label")}
                value={testimonialForm.company}
                onChange={(v) =>
                  setTestimonialForm((f) => ({ ...f, company: v }))
                }
                placeholder={t("ui.company_placeholder")}
              />
              <label className="block text-xs font-bold text-white/70">
                <span className="mb-1.5 block">{t("ui.rating_label")}</span>
                <select
                  value={testimonialForm.rating}
                  onChange={(e) =>
                    setTestimonialForm((f) => ({
                      ...f,
                      rating: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl border border-white/15 bg-[#0b0d14] px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                >
                  <option value={5}>★★★★★ (5 {t("ui.stars")})</option>
                  <option value={4}>★★★★☆ (4 {t("ui.stars")})</option>
                  <option value={3}>★★★☆☆ (3 {t("ui.stars")})</option>
                </select>
              </label>
            </div>

            <label className="block text-xs font-bold text-white/70">
              <span className="mb-1.5 block">{t("ui.testimonial_content")}</span>
              <textarea
                required
                rows={4}
                value={testimonialForm.content}
                onChange={(e) =>
                  setTestimonialForm((f) => ({ ...f, content: e.target.value }))
                }
                placeholder={t("ui.testimonial_placeholder")}
                className="w-full rounded-xl border border-white/15 bg-[#0b0d14] p-3 text-xs text-white placeholder-white/30 outline-none focus:border-amber-400"
              />
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={testimonialForm.isPublished}
                onChange={(e) =>
                  setTestimonialForm((f) => ({
                    ...f,
                    isPublished: e.target.checked,
                  }))
                }
                className="size-4 rounded border-white/20 bg-[#0b0d14] accent-amber-400"
              />
              <span>{t("ui.publish_immediately")}</span>
            </label>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setTestimonialDialog(false)}
                className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white/5"
              >
                {t("ui.cancel")}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300"
              >
                {editingTestimonial
                  ? t("ui.save_changes")
                  : t("ui.create_testimonial")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PROPOSAL DETAIL MODAL */}
      {(selectedProposal || detailLoading) && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm print:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedProposal(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#10141e] p-6 shadow-2xl">
            {detailLoading || !selectedProposal ? (
              <p className="py-12 text-center text-xs text-white/50">
                {t("ui.loading_proposal_detail")}
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      {selectedProposal.proposalNumber}
                    </span>
                    <h2 className="font-achiko text-xl text-white">
                      {selectedProposal.title}
                    </h2>
                    <p className="mt-1 text-xs text-white/50">
                      {t("ui.client_label")}: {getClientName(selectedProposal.client)} (
                      {selectedProposal.client.email})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProposal(null)}
                    className="text-xl text-white/40 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#141926] p-4">
                  <StatusBadge status={selectedProposal.status} />
                  <strong className="font-achiko text-2xl text-amber-400">
                    {formatMoney(
                      selectedProposal.totalAmount,
                      selectedProposal.currency,
                      locale,
                    )}
                  </strong>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#141926] p-4">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 text-[9px] uppercase tracking-wider text-white/40">
                      <tr>
                        <th className="py-2">{t("ui.proposal_table.item")}</th>
                        <th className="py-2 text-right">{t("ui.proposal_table.quantity")}</th>
                        <th className="py-2 text-right">{t("ui.proposal_table.unit_price")}</th>
                        <th className="py-2 text-right">{t("ui.proposal_table.amount")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {(selectedProposal.items ?? []).map((item) => (
                        <tr key={item.id}>
                          <td className="py-2.5 pr-4">
                            <strong className="text-white">{item.label}</strong>
                            {item.description && (
                              <span className="block text-[10px] text-white/40">
                                {item.description}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 text-right text-white/70">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 text-right text-white/70">
                            {formatMoney(
                              item.unitPrice,
                              selectedProposal.currency,
                              locale,
                            )}
                          </td>
                          <td className="py-2.5 text-right font-bold text-amber-300">
                            {formatMoney(
                              item.totalPrice,
                              selectedProposal.currency,
                              locale,
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/40">
                  <button
                    type="button"
                    onClick={() => {
                      const prop = selectedProposal;
                      setSelectedProposal(null);
                      openDocumentPreview(prop);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300"
                  >
                    <i className="pi pi-print text-xs" />
                    <span>{t("ui.print_proposal")}</span>
                  </button>
                  <span>{t("labels.created_at", { date: formatDate(selectedProposal.createdAt, locale) })}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL DOCUMENT PREVIEW MODAL */}
      {previewDocumentData && (
        <div className="proposal-preview-overlay fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 sm:p-8 backdrop-blur-md">
          <div className="sticky top-4 z-50 mx-auto flex max-w-[210mm] justify-between rounded-xl border border-white/15 bg-[#121622] p-4 text-white shadow-2xl print:hidden">
            <div className="flex items-center gap-3">
              <span className="font-achiko text-base font-bold text-amber-400">
                {t("ui.official_document")}
              </span>
              <span className="text-xs text-white/50">
                {t("ui.a4_pdf_note")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300"
              >
                <i className="pi pi-print text-xs" />
                <span>{t("ui.print_export_pdf")}</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDocumentData(null)}
                className="rounded-lg border border-white/20 p-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                {t("ui.close")}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <ProposalDocument proposal={previewDocumentData} />
          </div>
        </div>
      )}
    </div>
  );
}

function ProposalTable({
  locale,
  proposals,
  loading,
  onOpenDetail,
  onOpenPreview,
  onStatus,
  onDelete,
}: {
  locale: string;
  proposals: Proposal[];
  loading: boolean;
  onOpenDetail: (p: Proposal) => void;
  onOpenPreview: (p: Proposal) => void;
  onStatus: (
    p: Proposal,
    action: "send" | "accept" | "reject" | "cancel",
  ) => void;
  onDelete: (p: Proposal) => void;
}) {
  const t = useTranslations("AdminPage");
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-xs">
        <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-white/40">
          <tr>
            <th className="py-3 px-4">{t("ui.proposal_table.reference_subject")}</th>
            <th className="py-3 px-4">{t("ui.proposal_table.client")}</th>
            <th className="py-3 px-4">{t("ui.proposal_table.date")}</th>
            <th className="py-3 px-4">{t("ui.proposal_table.status")}</th>
            <th className="py-3 px-4 text-right">{t("ui.proposal_table.amount")}</th>
            <th className="py-3 px-4 text-right">{t("ui.proposal_table.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {proposals.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.02] transition">
              <td className="py-3.5 px-4 max-w-[260px]">
                <button
                  type="button"
                  onClick={() => onOpenDetail(p)}
                  className="text-left group"
                >
                  <span className="block text-[10px] font-bold text-amber-400">
                    {p.proposalNumber}
                  </span>
                  <strong className="block truncate text-xs text-white group-hover:text-amber-300">
                    {p.title}
                  </strong>
                </button>
              </td>
              <td className="py-3.5 px-4">
                <span className="block font-semibold text-white/80">
                  {getClientName(p.client)}
                </span>
                <span className="text-[10px] text-white/40">
                  {p.client.email}
                </span>
              </td>
              <td className="py-3.5 px-4 text-white/60">
                {formatDate(p.createdAt, locale)}
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={p.status} />
              </td>
              <td className="py-3.5 px-4 text-right font-achiko text-sm font-bold text-amber-300">
                {formatMoney(p.totalAmount, p.currency, locale)}
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(p)}
                    className="rounded-lg border border-white/15 p-1.5 text-white/80 hover:border-amber-400 hover:text-amber-300"
                    title={t("ui.view_details")}
                  >
                    <i className="pi pi-eye text-xs" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenPreview(p)}
                    className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-1.5 text-amber-300 hover:bg-amber-400 hover:text-black"
                    title={t("ui.print_preview")}
                  >
                    <i className="pi pi-print text-xs" />
                  </button>

                  {p.status === "DRAFT" && (
                    <>
                      <button
                        type="button"
                        onClick={() => onStatus(p, "send")}
                        className="rounded-lg border border-sky-400/30 bg-sky-400/10 p-1.5 text-sky-300 hover:bg-sky-400 hover:text-black"
                        title={t("ui.mark_sent")}
                      >
                        <i className="pi pi-send text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onStatus(p, "cancel")}
                        className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-1.5 text-amber-300 hover:bg-amber-400 hover:text-black"
                        title={t("ui.cancel")}
                      >
                        <i className="pi pi-ban text-xs" />
                      </button>
                    </>
                  )}

                  {p.status === "SENT" && (
                    <>
                      <button
                        type="button"
                        onClick={() => onStatus(p, "accept")}
                        className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-1.5 text-emerald-300 hover:bg-emerald-400 hover:text-black"
                        title={t("ui.accept")}
                      >
                        <i className="pi pi-check text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onStatus(p, "reject")}
                        className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-1.5 text-rose-300 hover:bg-rose-400 hover:text-black"
                        title={t("ui.reject")}
                      >
                        <i className="pi pi-times text-xs" />
                      </button>
                    </>
                  )}

                  {(p.status === "DRAFT" || p.status === "CANCELLED") && (
                    <button
                      type="button"
                      onClick={() => onDelete(p)}
                      className="rounded-lg border border-rose-400/30 p-1.5 text-rose-400 hover:border-rose-400 hover:bg-rose-400 hover:text-black"
                      title={t("ui.delete")}
                    >
                      <i className="pi pi-trash text-xs" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <p className="py-12 text-center text-xs text-white/40">
          {t("ui.loading_proposals")}
        </p>
      )}
      {!loading && proposals.length === 0 && (
        <p className="py-12 text-center text-xs text-white/40">
          {t("ui.no_proposals")}
        </p>
      )}
    </div>
  );
}
