"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ProposalDocument, {
  type ProposalDocumentData,
  type ProposalPhase,
} from "./ProposalDocument";
import { apiFetch, API_TOKEN_STORAGE_KEY } from "@/lib/api";

const DRAFT_KEY = "thek1ng237-proposal-draft-v2";
const LEGACY_DRAFT_KEY = "thek1ng237-proposal-draft-v1";

const controlClassName = "mt-1 w-full border border-white/15 bg-[#0b0d18] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#ffc82c] focus:outline-none";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isPhaseArray(value: unknown): value is ProposalPhase[] {
  return Array.isArray(value) && value.every((phase) =>
    isRecord(phase)
    && typeof phase.number === "string"
    && typeof phase.title === "string"
    && typeof phase.description === "string"
    && isStringArray(phase.deliverables),
  );
}

function isProposalDocumentData(value: unknown): value is ProposalDocumentData {
  if (!isRecord(value)) return false;

  const stringKeys = [
    "brand", "creatorName", "email", "phone", "reference", "issuedAt", "validity",
    "clientName", "clientShortName", "clientSlogan", "recipient", "summary",
    "projectOverviewTitle", "context", "centralChallenge", "centralChallengeLabel",
    "objectivesHeading", "orientation", "orientationLabel", "designSectionTitle",
    "journeysHeading", "designPrinciplesHeading", "developmentSectionTitle",
    "developmentIntroduction", "implementationNotesLabel", "implementationNotes",
    "deploymentHeading", "deployment", "budgetSectionTitle", "budgetIntroduction",
    "currency", "paymentHeading", "timelineTitle", "clientInputsHeading", "clientInputs",
    "finalChecksHeading", "finalChecks",
  ];

  return stringKeys.every((key) => typeof value[key] === "string")
    && Array.isArray(value.objectives)
    && value.objectives.every((objective) => isRecord(objective)
      && typeof objective.title === "string"
      && typeof objective.description === "string"
      && typeof objective.accent === "string")
    && isPhaseArray(value.designPhases)
    && isPhaseArray(value.developmentPhases)
    && isStringArray(value.journeys)
    && isStringArray(value.designPrinciples)
    && Array.isArray(value.budgetItems)
    && value.budgetItems.every((item) => isRecord(item)
      && typeof item.phase === "string"
      && typeof item.deliverables === "string"
      && typeof item.amount === "number")
    && Array.isArray(value.payments)
    && value.payments.every((payment) => isRecord(payment)
      && typeof payment.label === "string"
      && typeof payment.percentage === "number"
      && typeof payment.milestone === "string")
    && Array.isArray(value.timeline)
    && value.timeline.every((item) => isRecord(item)
      && typeof item.period === "string"
      && typeof item.description === "string");
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  min,
  max,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block font-azurio text-xs font-semibold text-white/75">
      {label}
      {multiline ? (
        <textarea
          className={`${controlClassName} min-h-24 resize-y leading-relaxed`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={controlClassName}
          type={type}
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function EditorSection({
  title,
  description,
  children,
  open = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details open={open} className="group border-b border-white/10 last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <span>
          <strong className="block font-achiko text-base text-white">{title}</strong>
          <span className="mt-1 block text-xs text-white/50">{description}</span>
        </span>
        <span className="font-azurio text-lg text-[#ffc82c] group-open:rotate-45">+</span>
      </summary>
      <div className="grid gap-4 pb-5 md:grid-cols-2">{children}</div>
    </details>
  );
}

function StringListEditor({
  title,
  items,
  itemLabel,
  onChange,
}: {
  title: string;
  items: string[];
  itemLabel: string;
  onChange: (items: string[]) => void;
}) {
  const t = useTranslations("AdminPage.editor");
  return (
    <div className="md:col-span-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <button type="button" onClick={() => onChange([...items, ""])} className="text-xs font-bold text-[#ffc82c] hover:text-white">
          + {t("actions.add")}
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-2">
            <input
              aria-label={`${itemLabel} ${index + 1}`}
              className={controlClassName}
              value={item}
              onChange={(event) => onChange(items.map((current, itemIndex) => itemIndex === index ? event.target.value : current))}
            />
            <button type="button" aria-label={t("actions.remove_item", { item: itemLabel, number: index + 1 })} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="shrink-0 px-3 text-white/50 hover:text-[#ff3b56]">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhaseListEditor({
  title,
  phases,
  onChange,
}: {
  title: string;
  phases: ProposalPhase[];
  onChange: (phases: ProposalPhase[]) => void;
}) {
  const t = useTranslations("AdminPage.editor");
  function updatePhase(index: number, patch: Partial<ProposalPhase>) {
    onChange(phases.map((phase, phaseIndex) => phaseIndex === index ? { ...phase, ...patch } : phase));
  }

  return (
    <div className="md:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <button type="button" onClick={() => onChange([...phases, { number: String(phases.length + 1).padStart(2, "0"), title: "", description: "", deliverables: [] }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">
          + {t("actions.add_phase")}
        </button>
      </div>
      <div className="space-y-3">
        {phases.map((phase, phaseIndex) => (
          <fieldset key={`${phase.number}-${phaseIndex}`} className="grid gap-3 border border-white/10 p-3 sm:grid-cols-2">
            <legend className="px-1 text-xs font-bold text-[#ffc82c]">{t("labels.phase_number", { number: phase.number })}</legend>
            <Field label={t("fields.number")} value={phase.number} onChange={(number) => updatePhase(phaseIndex, { number })} />
            <Field label={t("fields.title")} value={phase.title} onChange={(titleValue) => updatePhase(phaseIndex, { title: titleValue })} />
            <div className="sm:col-span-2">
              <Field label={t("fields.description")} value={phase.description} onChange={(description) => updatePhase(phaseIndex, { description })} multiline />
            </div>
            <StringListEditor
              title={t("fields.deliverables")}
              itemLabel={t("fields.deliverable")}
              items={phase.deliverables}
              onChange={(deliverables) => updatePhase(phaseIndex, { deliverables })}
            />
            <button type="button" onClick={() => onChange(phases.filter((_, index) => index !== phaseIndex))} className="justify-self-start text-xs font-bold text-[#ff8b9a] hover:text-white">
              {t("actions.remove_phase")}
            </button>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

function ObjectiveEditor({
  objectives,
  onChange,
}: {
  objectives: ProposalDocumentData["objectives"];
  onChange: (objectives: ProposalDocumentData["objectives"]) => void;
}) {
  const t = useTranslations("AdminPage.editor");
  return (
    <div className="md:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-white">{t("fields.objectives")}</h4>
        <button type="button" onClick={() => onChange([...objectives, { title: "", description: "", accent: "border-t-[#ffc82c]" }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">
          + {t("actions.add_objective")}
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {objectives.map((objective, index) => (
          <fieldset key={`objective-${index}`} className="grid gap-3 border border-white/10 p-3">
            <legend className="px-1 text-xs font-bold text-[#ffc82c]">{t("labels.objective_number", { number: index + 1 })}</legend>
            <Field label={t("fields.title")} value={objective.title} onChange={(title) => onChange(objectives.map((item, itemIndex) => itemIndex === index ? { ...item, title } : item))} />
            <Field label={t("fields.description")} value={objective.description} onChange={(description) => onChange(objectives.map((item, itemIndex) => itemIndex === index ? { ...item, description } : item))} multiline />
            <label className="text-xs font-semibold text-white/75">
              {t("fields.accent_color")}
              <select className={controlClassName} value={objective.accent} onChange={(event) => onChange(objectives.map((item, itemIndex) => itemIndex === index ? { ...item, accent: event.target.value } : item))}>
                <option value="border-t-[#ffc82c]">{t("colors.gold")}</option>
                <option value="border-t-[#ff3b56]">{t("colors.red")}</option>
                <option value="border-t-[#10b981]">{t("colors.green")}</option>
              </select>
            </label>
            <button type="button" onClick={() => onChange(objectives.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start text-xs font-bold text-[#ff8b9a] hover:text-white">
              {t("actions.remove_objective")}
            </button>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

export default function ProposalEditor({
  initialProposal,
}: {
  initialProposal: ProposalDocumentData;
}) {
  const t = useTranslations("AdminPage.editor");
  const locale = useLocale();
  const [proposal, setProposal] = useState(initialProposal);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [notice, setNotice] = useState("");
  const [token, setToken] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [savedProposals, setSavedProposals] = useState<{ id: string; proposalNumber: string; title: string }[]>([]);
  const [selectedSavedProposal, setSelectedSavedProposal] = useState("");
  const importInput = useRef<HTMLInputElement>(null);
  const draftKey = `${DRAFT_KEY}:${initialProposal.reference}`;

  useEffect(() => {
    try {
      setToken(localStorage.getItem(API_TOKEN_STORAGE_KEY) ?? "");
      const recipient = initialProposal.recipient.replace(/^(M\.?|Mme|M\s*me)\s*/i, "").trim().split(/\s+/);
      setClientFirstName(recipient[0] ?? "");
      setClientLastName(recipient.slice(1).join(" "));
      if (localStorage.getItem(LEGACY_DRAFT_KEY)) {
        localStorage.removeItem(LEGACY_DRAFT_KEY);
      }

      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsed: unknown = JSON.parse(savedDraft);
        if (isProposalDocumentData(parsed)) {
          setProposal(parsed);
        } else {
          localStorage.removeItem(draftKey);
        }
      }
    } catch {
      setNotice(t("messages.draft_load_failed"));
    }
    setIsLoaded(true);
  }, [draftKey, initialProposal, t]);

  useEffect(() => {
    if (!isLoaded) return;
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(proposal));
        setSavedAt(new Date().toLocaleTimeString(locale === "fr" ? "fr-FR" : "en-US", { hour: "2-digit", minute: "2-digit" }));
      } catch {
        setNotice(t("messages.draft_save_failed"));
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [draftKey, isLoaded, proposal, locale, t]);

  function updateField<Key extends keyof ProposalDocumentData>(key: Key, value: ProposalDocumentData[Key]) {
    setProposal((current) => ({ ...current, [key]: value }));
  }

  function exportProposal() {
    const file = new Blob([JSON.stringify(proposal, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    const slug = proposal.clientShortName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "projet";
    link.href = url;
    link.download = `devis-${slug}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(t("messages.exported"));
  }

  async function importProposal(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported: unknown = JSON.parse(await file.text());
      if (!isProposalDocumentData(imported)) throw new Error("invalid proposal");
      setProposal(imported);
      setNotice(t("messages.imported"));
    } catch {
      setNotice(t("errors.invalid_file"));
    }
    event.target.value = "";
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await apiFetch<{ token: string }>("auth/login", {
        method: "POST",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      localStorage.setItem(API_TOKEN_STORAGE_KEY, result.token);
      setToken(result.token);
      setLoginPassword("");
      setNotice(t("messages.api_connected"));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : t("errors.connection"));
    }
  }

  async function saveToBackend() {
    if (!token) return;
    if (!clientFirstName.trim() || !clientLastName.trim() || !clientEmail.trim()) {
      setNotice(t("errors.client_fields_required"));
      return;
    }

    setIsSaving(true);
    try {
      const clients = await apiFetch<{ id: string; email: string }[]>(
        `clients?search=${encodeURIComponent(clientEmail.trim())}&limit=100`,
        { token },
      );
      const existingClient = clients.find((client) => client.email.toLowerCase() === clientEmail.trim().toLowerCase());
      const client = existingClient ?? await apiFetch<{ id: string }>("clients", {
        method: "POST",
        token,
        body: JSON.stringify({
          companyName: proposal.clientName,
          firstName: clientFirstName.trim(),
          lastName: clientLastName.trim(),
          email: clientEmail.trim(),
          phone: clientPhone.trim() || undefined,
        }),
      });

      const items = proposal.budgetItems
        .filter((item) => item.phase.trim() && item.amount >= 0)
        .map((item) => ({ label: item.phase, description: item.deliverables, quantity: 1, unitPrice: item.amount }));
      if (!items.length) throw new Error(t("errors.budget_line_required"));

      const validDays = Number.parseInt(proposal.validity, 10);
      const validUntil = Number.isFinite(validDays)
        ? new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined;
      const created = await apiFetch<{ id: string; proposalNumber: string; createdAt: string }>("proposals", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: `${proposal.clientShortName} - ${proposal.summary}`.slice(0, 200),
          description: proposal.summary,
          documentData: proposal,
          clientId: client.id,
          currency: "XAF",
          validUntil,
          items,
        }),
      });
      const savedDocument = {
        ...proposal,
        reference: created.proposalNumber,
        issuedAt: new Date(created.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "long" }),
      };
      await apiFetch(`proposals/${created.id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ documentData: savedDocument }),
      });
      setProposal(savedDocument);
      setSelectedSavedProposal(created.id);
      setNotice(t("messages.proposal_saved", { reference: created.proposalNumber }));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : t("errors.save_failed"));
    } finally {
      setIsSaving(false);
    }
  }

  async function loadSavedProposals() {
    if (!token) return;
    try {
      const proposals = await apiFetch<{ id: string; proposalNumber: string; title: string }[]>("proposals?limit=100", { token });
      setSavedProposals(proposals);
      setNotice(t("messages.proposals_loaded", { count: proposals.length }));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : t("errors.load_proposals"));
    }
  }

  async function loadSelectedProposal() {
    if (!token || !selectedSavedProposal) return;
    try {
      const loaded = await apiFetch<{ documentData?: unknown }>(`proposals/${selectedSavedProposal}`, { token });
      if (!isProposalDocumentData(loaded.documentData)) {
        throw new Error(t("errors.not_editable"));
      }
      setProposal(loaded.documentData);
      setNotice(t("messages.proposal_loaded"));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : t("errors.load_proposals"));
    }
  }

  const total = proposal.budgetItems.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0), 0);
  const paymentShare = proposal.payments.reduce((sum, payment) => sum + payment.percentage, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 font-azurio text-white md:px-8">
      <section className="mb-8 border border-white/10 bg-[#121526] p-5 shadow-xl md:p-7 print:hidden">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffc82c]">{t("ui.generator_title")} · {proposal.brand}</p>
            <h1 className="font-achiko text-2xl text-white md:text-3xl">{t("ui.generator_heading")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">{t("ui.generator_description")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input ref={importInput} type="file" accept="application/json,.json" className="hidden" onChange={importProposal} />
            <button type="button" onClick={() => importInput.current?.click()} className="border border-white/20 px-3 py-2 text-xs font-bold text-white hover:border-[#ffc82c] hover:text-[#ffc82c]">{t("ui.import_json")}</button>
            <button type="button" onClick={exportProposal} className="border border-[#ffc82c]/60 px-3 py-2 text-xs font-bold text-[#ffc82c] hover:bg-[#ffc82c] hover:text-[#0b0d18]">{t("ui.export_json")}</button>
            <button type="button" onClick={() => { setProposal(initialProposal); setNotice(t("messages.template_restored")); }} className="border border-white/20 px-3 py-2 text-xs font-bold text-white/70 hover:border-white hover:text-white">{t("ui.restore_template")}</button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-white/45">
          <span aria-live="polite">{notice || (savedAt ? t("messages.draft_saved_at", { time: savedAt }) : isLoaded ? t("messages.auto_saved") : t("messages.loading_draft"))}</span>
          <button type="button" onClick={() => setIsPreviewOpen(true)} className="font-bold text-[#ffc82c] hover:text-white">{t("ui.go_to_preview")} →</button>
        </div>
      </section>

      <section className="mb-8 grid gap-5 border border-white/10 bg-[#121526] p-5 md:grid-cols-2 print:hidden">
        {!token ? (
          <form onSubmit={login} className="grid gap-3">
            <h2 className="font-achiko text-lg">Connexion à la gestion des devis</h2>
            <Field label="Email du compte admin" value={loginEmail} onChange={setLoginEmail} type="email" />
            <Field label="Mot de passe" value={loginPassword} onChange={setLoginPassword} type="password" />
            <button className="justify-self-start border border-[#ffc82c]/60 px-4 py-2 text-sm font-bold text-[#ffc82c] hover:bg-[#ffc82c] hover:text-[#0b0d18]">Se connecter</button>
          </form>
        ) : (
          <div className="grid gap-3">
            <h2 className="font-achiko text-lg">{t("ui.client_to_save")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("fields.contact_first_name")} value={clientFirstName} onChange={setClientFirstName} />
              <Field label={t("fields.contact_last_name")} value={clientLastName} onChange={setClientLastName} />
              <Field label={t("fields.client_email")} value={clientEmail} onChange={setClientEmail} type="email" />
              <Field label={t("fields.client_phone")} value={clientPhone} onChange={setClientPhone} />
            </div>
            <button type="button" disabled={isSaving} onClick={saveToBackend} className="justify-self-start border border-[#ffc82c]/60 px-4 py-2 text-sm font-bold text-[#ffc82c] hover:bg-[#ffc82c] hover:text-[#0b0d18] disabled:opacity-50">
              {isSaving ? t("messages.saving") : t("actions.save_proposal")}
            </button>
          </div>
        )}
        <div className="grid content-start gap-3">
          <h2 className="font-achiko text-lg">{t("ui.saved_proposals")}</h2>
          <button type="button" disabled={!token} onClick={loadSavedProposals} className="justify-self-start border border-white/20 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">{t("actions.load_list")}</button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select aria-label={t("actions.choose_proposal")} className={controlClassName} value={selectedSavedProposal} onChange={(event) => setSelectedSavedProposal(event.target.value)}>
              <option value="">{t("actions.choose_proposal")}</option>
              {savedProposals.map((saved) => <option key={saved.id} value={saved.id}>{saved.proposalNumber} · {saved.title}</option>)}
            </select>
            <button type="button" disabled={!token || !selectedSavedProposal} onClick={loadSelectedProposal} className="shrink-0 border border-white/20 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">{t("actions.open")}</button>
          </div>
          {token && <button type="button" onClick={() => { localStorage.removeItem(API_TOKEN_STORAGE_KEY); setToken(""); setNotice(t("messages.disconnected")); }} className="justify-self-start text-xs text-white/50 hover:text-white">{t("actions.disconnect")}</button>}
        </div>
      </section>

      <div className="mb-10 border border-white/10 bg-[#121526] px-5 md:px-7 print:hidden">
        <EditorSection title={t("sections.identity_title")} description={t("sections.identity_description")} open>
          <Field label={t("fields.brand")} value={proposal.brand} onChange={(value) => updateField("brand", value)} />
          <Field label={t("fields.full_name")} value={proposal.creatorName} onChange={(value) => updateField("creatorName", value)} />
          <Field label="Email" value={proposal.email} onChange={(value) => updateField("email", value)} type="email" />
          <Field label={t("fields.phone")} value={proposal.phone} onChange={(value) => updateField("phone", value)} />
          <Field label={t("fields.proposal_reference")} value={proposal.reference} onChange={(value) => updateField("reference", value)} />
          <Field label={t("fields.issue_date")} value={proposal.issuedAt} onChange={(value) => updateField("issuedAt", value)} />
          <Field label={t("fields.offer_validity")} value={proposal.validity} onChange={(value) => updateField("validity", value)} />
          <Field label={t("fields.client_organization")} value={proposal.clientName} onChange={(value) => updateField("clientName", value)} />
          <Field label={t("fields.short_name")} value={proposal.clientShortName} onChange={(value) => updateField("clientShortName", value)} />
          <Field label={t("fields.client_slogan")} value={proposal.clientSlogan} onChange={(value) => updateField("clientSlogan", value)} />
          <Field label={t("fields.recipient")} value={proposal.recipient} onChange={(value) => updateField("recipient", value)} />
          <Field label={t("fields.document_title")} value={proposal.summary} onChange={(value) => updateField("summary", value)} multiline />
        </EditorSection>

        <EditorSection title={t("sections.needs_title")} description={t("sections.needs_description")}>
          <Field label={t("fields.project_section_title")} value={proposal.projectOverviewTitle} onChange={(value) => updateField("projectOverviewTitle", value)} />
          <Field label={t("fields.objectives_title")} value={proposal.objectivesHeading} onChange={(value) => updateField("objectivesHeading", value)} />
          <Field label={t("fields.client_context")} value={proposal.context} onChange={(value) => updateField("context", value)} multiline />
          <Field label={proposal.centralChallengeLabel || t("fields.central_challenge")} value={proposal.centralChallenge} onChange={(value) => updateField("centralChallenge", value)} multiline />
          <Field label={t("fields.challenge_label")} value={proposal.centralChallengeLabel} onChange={(value) => updateField("centralChallengeLabel", value)} />
          <Field label={t("fields.orientation_title")} value={proposal.orientationLabel} onChange={(value) => updateField("orientationLabel", value)} />
          <Field label={t("fields.proposed_orientation")} value={proposal.orientation} onChange={(value) => updateField("orientation", value)} multiline />
          <ObjectiveEditor objectives={proposal.objectives} onChange={(value) => updateField("objectives", value)} />
          <Field label={t("fields.journeys_title")} value={proposal.journeysHeading} onChange={(value) => updateField("journeysHeading", value)} />
          <StringListEditor title={t("fields.project_journeys")} itemLabel={t("fields.journey")} items={proposal.journeys} onChange={(value) => updateField("journeys", value)} />
          <Field label={t("fields.design_principles_title")} value={proposal.designPrinciplesHeading} onChange={(value) => updateField("designPrinciplesHeading", value)} />
          <StringListEditor title={t("fields.design_principles")} itemLabel={t("fields.principle")} items={proposal.designPrinciples} onChange={(value) => updateField("designPrinciples", value)} />
        </EditorSection>

        <EditorSection title={t("sections.deliverables_title")} description={t("sections.deliverables_description")}>
          <Field label={t("fields.design_section_title")} value={proposal.designSectionTitle} onChange={(value) => updateField("designSectionTitle", value)} />
          <PhaseListEditor title={t("fields.design_phases")} phases={proposal.designPhases} onChange={(value) => updateField("designPhases", value)} />
          <Field label={t("fields.development_section_title")} value={proposal.developmentSectionTitle} onChange={(value) => updateField("developmentSectionTitle", value)} />
          <Field label={t("fields.development_intro")} value={proposal.developmentIntroduction} onChange={(value) => updateField("developmentIntroduction", value)} multiline />
          <PhaseListEditor title={t("fields.development_phases")} phases={proposal.developmentPhases} onChange={(value) => updateField("developmentPhases", value)} />
          <Field label={t("fields.implementation_notes_title")} value={proposal.implementationNotesLabel} onChange={(value) => updateField("implementationNotesLabel", value)} />
          <Field label={t("fields.dependencies_assumptions")} value={proposal.implementationNotes} onChange={(value) => updateField("implementationNotes", value)} multiline />
          <Field label={t("fields.deployment_title")} value={proposal.deploymentHeading} onChange={(value) => updateField("deploymentHeading", value)} />
          <Field label={t("fields.deployment_description")} value={proposal.deployment} onChange={(value) => updateField("deployment", value)} multiline />
        </EditorSection>

        <EditorSection title={t("sections.budget_title")} description={t("sections.budget_description")}>
          <Field label={t("fields.budget_title")} value={proposal.budgetSectionTitle} onChange={(value) => updateField("budgetSectionTitle", value)} />
          <Field label={t("fields.currency")} value={proposal.currency} onChange={(value) => updateField("currency", value)} />
          <Field label={t("fields.budget_intro")} value={proposal.budgetIntroduction} onChange={(value) => updateField("budgetIntroduction", value)} multiline />
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-white">{t("fields.budget_lines")}</h4>
              <button type="button" onClick={() => updateField("budgetItems", [...proposal.budgetItems, { phase: "", deliverables: "", amount: 0 }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">+ {t("actions.add_budget_line")}</button>
            </div>
            <div className="space-y-3">
              {proposal.budgetItems.map((item, index) => (
                <fieldset key={`budget-${index}`} className="grid gap-3 border border-white/10 p-3 sm:grid-cols-2">
                  <legend className="px-1 text-xs font-bold text-[#ffc82c]">{t("labels.line_number", { number: index + 1 })}</legend>
                  <Field label={t("fields.phase")} value={item.phase} onChange={(phase) => updateField("budgetItems", proposal.budgetItems.map((row, rowIndex) => rowIndex === index ? { ...row, phase } : row))} />
                  <Field label={t("fields.amount_currency", { currency: proposal.currency })} value={item.amount} onChange={(amount) => updateField("budgetItems", proposal.budgetItems.map((row, rowIndex) => rowIndex === index ? { ...row, amount: Number(amount) || 0 } : row))} type="number" min={0} />
                  <div className="sm:col-span-2"><Field label={t("fields.included_deliverables")} value={item.deliverables} onChange={(deliverables) => updateField("budgetItems", proposal.budgetItems.map((row, rowIndex) => rowIndex === index ? { ...row, deliverables } : row))} multiline /></div>
                  <button type="button" onClick={() => updateField("budgetItems", proposal.budgetItems.filter((_, rowIndex) => rowIndex !== index))} className="justify-self-start text-xs font-bold text-[#ff8b9a] hover:text-white">{t("actions.remove_budget_line")}</button>
                </fieldset>
              ))}
            </div>
            <p className="mt-3 text-right text-sm font-bold text-[#ffc82c]">{t("labels.calculated_total")}: {new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(total)} {proposal.currency}</p>
          </div>
          <Field label={t("fields.payment_schedule_title")} value={proposal.paymentHeading} onChange={(value) => updateField("paymentHeading", value)} />
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-white">{t("labels.payment_share", { percentage: paymentShare })}</h4>
              <button type="button" onClick={() => updateField("payments", [...proposal.payments, { label: "", percentage: 0, milestone: "" }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">+ {t("actions.add_payment")}</button>
            </div>
            <div className="space-y-3">
              {proposal.payments.map((payment, index) => (
                <fieldset key={`payment-${index}`} className="grid gap-3 border border-white/10 p-3 sm:grid-cols-3">
                  <legend className="px-1 text-xs font-bold text-[#ffc82c]">{t("labels.payment_number", { number: index + 1 })}</legend>
                  <Field label={t("fields.payment_label")} value={payment.label} onChange={(label) => updateField("payments", proposal.payments.map((row, rowIndex) => rowIndex === index ? { ...row, label } : row))} />
                  <Field label={t("fields.percentage")} value={payment.percentage} onChange={(value) => updateField("payments", proposal.payments.map((row, rowIndex) => rowIndex === index ? { ...row, percentage: Number(value) || 0 } : row))} type="number" min={0} max={100} />
                  <Field label={t("fields.payment_milestone")} value={payment.milestone} onChange={(milestone) => updateField("payments", proposal.payments.map((row, rowIndex) => rowIndex === index ? { ...row, milestone } : row))} />
                  <button type="button" onClick={() => updateField("payments", proposal.payments.filter((_, rowIndex) => rowIndex !== index))} className="justify-self-start text-xs font-bold text-[#ff8b9a] hover:text-white">{t("actions.remove_payment")}</button>
                </fieldset>
              ))}
            </div>
            {paymentShare !== 100 && <p className="mt-2 text-xs text-[#ff8b9a]">{t("messages.payment_total_warning")}</p>}
          </div>
        </EditorSection>

        <EditorSection title={t("sections.timeline_title")} description={t("sections.timeline_description")}>
          <Field label={t("fields.timeline_title")} value={proposal.timelineTitle} onChange={(value) => updateField("timelineTitle", value)} />
          <Field label={t("fields.client_inputs_title")} value={proposal.clientInputsHeading} onChange={(value) => updateField("clientInputsHeading", value)} />
          <Field label={t("fields.client_inputs")} value={proposal.clientInputs} onChange={(value) => updateField("clientInputs", value)} multiline />
          <Field label={t("fields.final_checks_title")} value={proposal.finalChecksHeading} onChange={(value) => updateField("finalChecksHeading", value)} />
          <Field label={t("fields.final_checks")} value={proposal.finalChecks} onChange={(value) => updateField("finalChecks", value)} multiline />
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-white">{t("fields.timeline_steps")}</h4>
              <button type="button" onClick={() => updateField("timeline", [...proposal.timeline, { period: "", description: "" }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">+ {t("actions.add_step")}</button>
            </div>
            <div className="space-y-2">
              {proposal.timeline.map((item, index) => (
                <div key={`timeline-${index}`} className="grid gap-2 border border-white/10 p-3 sm:grid-cols-[1fr_2fr_auto]">
                  <Field label={t("fields.period")} value={item.period} onChange={(period) => updateField("timeline", proposal.timeline.map((row, rowIndex) => rowIndex === index ? { ...row, period } : row))} />
                  <Field label={t("fields.description")} value={item.description} onChange={(description) => updateField("timeline", proposal.timeline.map((row, rowIndex) => rowIndex === index ? { ...row, description } : row))} />
                  <button type="button" aria-label={t("actions.remove_step", { number: index + 1 })} onClick={() => updateField("timeline", proposal.timeline.filter((_, rowIndex) => rowIndex !== index))} className="self-end px-3 py-2 text-white/50 hover:text-[#ff3b56]">×</button>
                </div>
              ))}
            </div>
          </div>
        </EditorSection>
      </div>

      {isPreviewOpen && (
        <div className="proposal-preview-overlay fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 backdrop-blur-md sm:p-8">
          <div className="mx-auto mb-6 flex max-w-[210mm] justify-between rounded border border-white/15 bg-[#121622] p-4 text-white print:hidden">
            <h2 className="font-achiko text-base font-bold text-[#ffc82c]">{t("ui.generator_title")}</h2>
            <button type="button" onClick={() => setIsPreviewOpen(false)} className="border border-white/20 px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10 hover:text-white">
              {t("ui.close_preview")}
            </button>
          </div>
          <ProposalDocument proposal={proposal} />
        </div>
      )}
    </div>
  );
}