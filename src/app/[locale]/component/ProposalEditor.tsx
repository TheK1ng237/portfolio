"use client";

import { useEffect, useRef, useState } from "react";
import ProposalDocument, {
  type ProposalDocumentData,
  type ProposalPhase,
} from "./ProposalDocument";

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
  return (
    <div className="md:col-span-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <button type="button" onClick={() => onChange([...items, ""])} className="text-xs font-bold text-[#ffc82c] hover:text-white">
          + Ajouter
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
            <button type="button" aria-label={`Supprimer ${itemLabel} ${index + 1}`} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="shrink-0 px-3 text-white/50 hover:text-[#ff3b56]">
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
  function updatePhase(index: number, patch: Partial<ProposalPhase>) {
    onChange(phases.map((phase, phaseIndex) => phaseIndex === index ? { ...phase, ...patch } : phase));
  }

  return (
    <div className="md:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <button type="button" onClick={() => onChange([...phases, { number: String(phases.length + 1).padStart(2, "0"), title: "", description: "", deliverables: [] }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">
          + Ajouter une phase
        </button>
      </div>
      <div className="space-y-3">
        {phases.map((phase, phaseIndex) => (
          <fieldset key={`${phase.number}-${phaseIndex}`} className="grid gap-3 border border-white/10 p-3 sm:grid-cols-2">
            <legend className="px-1 text-xs font-bold text-[#ffc82c]">Phase {phase.number}</legend>
            <Field label="Numéro" value={phase.number} onChange={(number) => updatePhase(phaseIndex, { number })} />
            <Field label="Titre" value={phase.title} onChange={(titleValue) => updatePhase(phaseIndex, { title: titleValue })} />
            <div className="sm:col-span-2">
              <Field label="Description" value={phase.description} onChange={(description) => updatePhase(phaseIndex, { description })} multiline />
            </div>
            <StringListEditor
              title="Livrables"
              itemLabel="Livrable"
              items={phase.deliverables}
              onChange={(deliverables) => updatePhase(phaseIndex, { deliverables })}
            />
            <button type="button" onClick={() => onChange(phases.filter((_, index) => index !== phaseIndex))} className="justify-self-start text-xs font-bold text-[#ff8b9a] hover:text-white">
              Supprimer cette phase
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
  return (
    <div className="md:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-white">Objectifs</h4>
        <button type="button" onClick={() => onChange([...objectives, { title: "", description: "", accent: "border-t-[#ffc82c]" }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">
          + Ajouter un objectif
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {objectives.map((objective, index) => (
          <fieldset key={`objective-${index}`} className="grid gap-3 border border-white/10 p-3">
            <legend className="px-1 text-xs font-bold text-[#ffc82c]">Objectif {index + 1}</legend>
            <Field label="Titre" value={objective.title} onChange={(title) => onChange(objectives.map((item, itemIndex) => itemIndex === index ? { ...item, title } : item))} />
            <Field label="Description" value={objective.description} onChange={(description) => onChange(objectives.map((item, itemIndex) => itemIndex === index ? { ...item, description } : item))} multiline />
            <label className="text-xs font-semibold text-white/75">
              Couleur d’accent
              <select className={controlClassName} value={objective.accent} onChange={(event) => onChange(objectives.map((item, itemIndex) => itemIndex === index ? { ...item, accent: event.target.value } : item))}>
                <option value="border-t-[#ffc82c]">Or</option>
                <option value="border-t-[#ff3b56]">Rouge</option>
                <option value="border-t-[#10b981]">Vert</option>
              </select>
            </label>
            <button type="button" onClick={() => onChange(objectives.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start text-xs font-bold text-[#ff8b9a] hover:text-white">
              Supprimer cet objectif
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
  const [proposal, setProposal] = useState(initialProposal);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [notice, setNotice] = useState("");
  const importInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(LEGACY_DRAFT_KEY)) {
        localStorage.removeItem(LEGACY_DRAFT_KEY);
      }

      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed: unknown = JSON.parse(savedDraft);
        if (isProposalDocumentData(parsed)) {
          setProposal(parsed);
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch {
      setNotice("Le brouillon local n’a pas pu être chargé.");
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(proposal));
        setSavedAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
      } catch {
        setNotice("Le brouillon n’a pas pu être enregistré dans ce navigateur.");
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [isLoaded, proposal]);

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
    setNotice("Fichier de devis exporté.");
  }

  async function importProposal(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported: unknown = JSON.parse(await file.text());
      if (!isProposalDocumentData(imported)) throw new Error("invalid proposal");
      setProposal(imported);
      setNotice("Le devis a été importé.");
    } catch {
      setNotice("Ce fichier JSON ne correspond pas au modèle de devis.");
    }
    event.target.value = "";
  }

  const total = proposal.budgetItems.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0), 0);
  const paymentShare = proposal.payments.reduce((sum, payment) => sum + payment.percentage, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 font-azurio text-white md:px-8">
      <section className="mb-8 border border-white/10 bg-[#121526] p-5 shadow-xl md:p-7 print:hidden">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffc82c]">Générateur de devis · {proposal.brand}</p>
            <h1 className="font-achiko text-2xl text-white md:text-3xl">Adapte ce modèle à ton projet</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">Modifie les rubriques, ajoute ou retire des lignes, puis exporte une copie JSON par client. Tes changements sont enregistrés dans ce navigateur.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input ref={importInput} type="file" accept="application/json,.json" className="hidden" onChange={importProposal} />
            <button type="button" onClick={() => importInput.current?.click()} className="border border-white/20 px-3 py-2 text-xs font-bold text-white hover:border-[#ffc82c] hover:text-[#ffc82c]">Importer JSON</button>
            <button type="button" onClick={exportProposal} className="border border-[#ffc82c]/60 px-3 py-2 text-xs font-bold text-[#ffc82c] hover:bg-[#ffc82c] hover:text-[#0b0d18]">Exporter JSON</button>
            <button type="button" onClick={() => { setProposal(initialProposal); setNotice("Exemple GSHI restauré."); }} className="border border-white/20 px-3 py-2 text-xs font-bold text-white/70 hover:border-white hover:text-white">Restaurer l’exemple</button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-white/45">
          <span aria-live="polite">{notice || (savedAt ? `Brouillon enregistré à ${savedAt}` : isLoaded ? "Modifications enregistrées automatiquement" : "Chargement du brouillon…")}</span>
          <a href="#proposal-preview" className="font-bold text-[#ffc82c] hover:text-white">Aller à l’aperçu ↓</a>
        </div>
      </section>

      <div className="mb-10 border border-white/10 bg-[#121526] px-5 md:px-7 print:hidden">
        <EditorSection title="Identité & client" description="Coordonnées, références et présentation du devis." open>
          <Field label="Marque" value={proposal.brand} onChange={(value) => updateField("brand", value)} />
          <Field label="Nom complet" value={proposal.creatorName} onChange={(value) => updateField("creatorName", value)} />
          <Field label="Email" value={proposal.email} onChange={(value) => updateField("email", value)} type="email" />
          <Field label="Téléphone" value={proposal.phone} onChange={(value) => updateField("phone", value)} />
          <Field label="Référence du devis" value={proposal.reference} onChange={(value) => updateField("reference", value)} />
          <Field label="Date d’émission" value={proposal.issuedAt} onChange={(value) => updateField("issuedAt", value)} />
          <Field label="Validité de l’offre" value={proposal.validity} onChange={(value) => updateField("validity", value)} />
          <Field label="Nom du client / organisation" value={proposal.clientName} onChange={(value) => updateField("clientName", value)} />
          <Field label="Nom court" value={proposal.clientShortName} onChange={(value) => updateField("clientShortName", value)} />
          <Field label="Slogan du client" value={proposal.clientSlogan} onChange={(value) => updateField("clientSlogan", value)} />
          <Field label="Destinataire" value={proposal.recipient} onChange={(value) => updateField("recipient", value)} />
          <Field label="Titre du document" value={proposal.summary} onChange={(value) => updateField("summary", value)} multiline />
        </EditorSection>

        <EditorSection title="Besoin & objectifs" description="Le contexte, les résultats attendus et les parcours à concevoir.">
          <Field label="Titre de la section projet" value={proposal.projectOverviewTitle} onChange={(value) => updateField("projectOverviewTitle", value)} />
          <Field label="Titre des objectifs" value={proposal.objectivesHeading} onChange={(value) => updateField("objectivesHeading", value)} />
          <Field label="Contexte du client" value={proposal.context} onChange={(value) => updateField("context", value)} multiline />
          <Field label={proposal.centralChallengeLabel || "Enjeu central"} value={proposal.centralChallenge} onChange={(value) => updateField("centralChallenge", value)} multiline />
          <Field label="Libellé de l’enjeu" value={proposal.centralChallengeLabel} onChange={(value) => updateField("centralChallengeLabel", value)} />
          <Field label="Titre de l’orientation" value={proposal.orientationLabel} onChange={(value) => updateField("orientationLabel", value)} />
          <Field label="Orientation proposée" value={proposal.orientation} onChange={(value) => updateField("orientation", value)} multiline />
          <ObjectiveEditor objectives={proposal.objectives} onChange={(value) => updateField("objectives", value)} />
          <Field label="Titre des parcours" value={proposal.journeysHeading} onChange={(value) => updateField("journeysHeading", value)} />
          <StringListEditor title="Parcours du projet" itemLabel="Parcours" items={proposal.journeys} onChange={(value) => updateField("journeys", value)} />
          <Field label="Titre des principes de conception" value={proposal.designPrinciplesHeading} onChange={(value) => updateField("designPrinciplesHeading", value)} />
          <StringListEditor title="Principes de conception" itemLabel="Principe" items={proposal.designPrinciples} onChange={(value) => updateField("designPrinciples", value)} />
        </EditorSection>

        <EditorSection title="Prestations & livrables" description="Personnalise les phases, leur description et chaque livrable.">
          <Field label="Titre de la section design" value={proposal.designSectionTitle} onChange={(value) => updateField("designSectionTitle", value)} />
          <PhaseListEditor title="Phases design / UX" phases={proposal.designPhases} onChange={(value) => updateField("designPhases", value)} />
          <Field label="Titre de la section développement" value={proposal.developmentSectionTitle} onChange={(value) => updateField("developmentSectionTitle", value)} />
          <Field label="Introduction au développement" value={proposal.developmentIntroduction} onChange={(value) => updateField("developmentIntroduction", value)} multiline />
          <PhaseListEditor title="Phases développement" phases={proposal.developmentPhases} onChange={(value) => updateField("developmentPhases", value)} />
          <Field label="Titre des points de cadrage" value={proposal.implementationNotesLabel} onChange={(value) => updateField("implementationNotesLabel", value)} />
          <Field label="Dépendances et hypothèses" value={proposal.implementationNotes} onChange={(value) => updateField("implementationNotes", value)} multiline />
          <Field label="Titre mise en ligne" value={proposal.deploymentHeading} onChange={(value) => updateField("deploymentHeading", value)} />
          <Field label="Tests, livraison et mise en ligne" value={proposal.deployment} onChange={(value) => updateField("deployment", value)} multiline />
        </EditorSection>

        <EditorSection title="Budget & paiements" description="Les totaux et montants de paiement sont calculés à partir des lignes et pourcentages.">
          <Field label="Titre budget" value={proposal.budgetSectionTitle} onChange={(value) => updateField("budgetSectionTitle", value)} />
          <Field label="Devise" value={proposal.currency} onChange={(value) => updateField("currency", value)} />
          <Field label="Présentation du budget" value={proposal.budgetIntroduction} onChange={(value) => updateField("budgetIntroduction", value)} multiline />
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-white">Lignes budgétaires</h4>
              <button type="button" onClick={() => updateField("budgetItems", [...proposal.budgetItems, { phase: "", deliverables: "", amount: 0 }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">+ Ajouter une ligne</button>
            </div>
            <div className="space-y-3">
              {proposal.budgetItems.map((item, index) => (
                <fieldset key={`budget-${index}`} className="grid gap-3 border border-white/10 p-3 sm:grid-cols-2">
                  <legend className="px-1 text-xs font-bold text-[#ffc82c]">Ligne {index + 1}</legend>
                  <Field label="Phase" value={item.phase} onChange={(phase) => updateField("budgetItems", proposal.budgetItems.map((row, rowIndex) => rowIndex === index ? { ...row, phase } : row))} />
                  <Field label={`Montant (${proposal.currency})`} value={item.amount} onChange={(amount) => updateField("budgetItems", proposal.budgetItems.map((row, rowIndex) => rowIndex === index ? { ...row, amount: Number(amount) || 0 } : row))} type="number" min={0} />
                  <div className="sm:col-span-2"><Field label="Livrables inclus" value={item.deliverables} onChange={(deliverables) => updateField("budgetItems", proposal.budgetItems.map((row, rowIndex) => rowIndex === index ? { ...row, deliverables } : row))} multiline /></div>
                  <button type="button" onClick={() => updateField("budgetItems", proposal.budgetItems.filter((_, rowIndex) => rowIndex !== index))} className="justify-self-start text-xs font-bold text-[#ff8b9a] hover:text-white">Supprimer cette ligne</button>
                </fieldset>
              ))}
            </div>
            <p className="mt-3 text-right text-sm font-bold text-[#ffc82c]">Total calculé : {new Intl.NumberFormat("fr-FR").format(total)} {proposal.currency}</p>
          </div>
          <Field label="Titre de l’échéancier" value={proposal.paymentHeading} onChange={(value) => updateField("paymentHeading", value)} />
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-white">Échéances ({paymentShare}% répartis)</h4>
              <button type="button" onClick={() => updateField("payments", [...proposal.payments, { label: "", percentage: 0, milestone: "" }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">+ Ajouter une échéance</button>
            </div>
            <div className="space-y-3">
              {proposal.payments.map((payment, index) => (
                <fieldset key={`payment-${index}`} className="grid gap-3 border border-white/10 p-3 sm:grid-cols-3">
                  <legend className="px-1 text-xs font-bold text-[#ffc82c]">Échéance {index + 1}</legend>
                  <Field label="Libellé" value={payment.label} onChange={(label) => updateField("payments", proposal.payments.map((row, rowIndex) => rowIndex === index ? { ...row, label } : row))} />
                  <Field label="Pourcentage" value={payment.percentage} onChange={(value) => updateField("payments", proposal.payments.map((row, rowIndex) => rowIndex === index ? { ...row, percentage: Number(value) || 0 } : row))} type="number" min={0} max={100} />
                  <Field label="Moment de paiement" value={payment.milestone} onChange={(milestone) => updateField("payments", proposal.payments.map((row, rowIndex) => rowIndex === index ? { ...row, milestone } : row))} />
                  <button type="button" onClick={() => updateField("payments", proposal.payments.filter((_, rowIndex) => rowIndex !== index))} className="justify-self-start text-xs font-bold text-[#ff8b9a] hover:text-white">Supprimer cette échéance</button>
                </fieldset>
              ))}
            </div>
            {paymentShare !== 100 && <p className="mt-2 text-xs text-[#ff8b9a]">La répartition des paiements devrait totaliser 100 %.</p>}
          </div>
        </EditorSection>

        <EditorSection title="Planning & conditions" description="Durée, jalons, éléments attendus du client et validations finales.">
          <Field label="Titre du planning" value={proposal.timelineTitle} onChange={(value) => updateField("timelineTitle", value)} />
          <Field label="Titre des éléments à fournir" value={proposal.clientInputsHeading} onChange={(value) => updateField("clientInputsHeading", value)} />
          <Field label="Éléments à fournir par le client" value={proposal.clientInputs} onChange={(value) => updateField("clientInputs", value)} multiline />
          <Field label="Titre des conditions finales" value={proposal.finalChecksHeading} onChange={(value) => updateField("finalChecksHeading", value)} />
          <Field label="Points à valider avant accord" value={proposal.finalChecks} onChange={(value) => updateField("finalChecks", value)} multiline />
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-white">Étapes du planning</h4>
              <button type="button" onClick={() => updateField("timeline", [...proposal.timeline, { period: "", description: "" }])} className="text-xs font-bold text-[#ffc82c] hover:text-white">+ Ajouter une étape</button>
            </div>
            <div className="space-y-2">
              {proposal.timeline.map((item, index) => (
                <div key={`timeline-${index}`} className="grid gap-2 border border-white/10 p-3 sm:grid-cols-[1fr_2fr_auto]">
                  <Field label="Période" value={item.period} onChange={(period) => updateField("timeline", proposal.timeline.map((row, rowIndex) => rowIndex === index ? { ...row, period } : row))} />
                  <Field label="Description" value={item.description} onChange={(description) => updateField("timeline", proposal.timeline.map((row, rowIndex) => rowIndex === index ? { ...row, description } : row))} />
                  <button type="button" aria-label={`Supprimer l’étape ${index + 1}`} onClick={() => updateField("timeline", proposal.timeline.filter((_, rowIndex) => rowIndex !== index))} className="self-end px-3 py-2 text-white/50 hover:text-[#ff3b56]">×</button>
                </div>
              ))}
            </div>
          </div>
        </EditorSection>
      </div>

      <div id="proposal-preview">
        <ProposalDocument proposal={proposal} />
      </div>
    </div>
  );
}