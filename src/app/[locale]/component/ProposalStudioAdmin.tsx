"use client";

import { useEffect, useState } from "react";
import ProposalEditor from "./ProposalEditor";
import ProposalDocument, { type ProposalDocumentData } from "./ProposalDocument";
import { apiFetch } from "@/lib/api";

type Client = {
  id: string;
  companyName?: string | null;
  firstName: string;
  lastName: string;
  email: string;
};

const gshiTemplate: ProposalDocumentData = {
  brand: "Thek1ng237",
  creatorName: "NDOH YANNICK TANG",
  email: "ndohyannick78@gmail.com",
  phone: "+237 653 53 91 02",
  reference: "KT-2026-GSHI-001",
  issuedAt: new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date()),
  validity: "30 jours",
  clientName: "Green Startups Hive Incubator",
  clientShortName: "GSHI",
  clientSlogan: "Incubons des talents, cultivons l’innovation en milieu rural",
  recipient: "M. Nkayouongam Moustapha",
  summary: "Conception et réalisation d’un site vitrine moderne pour présenter l’identité, les services et les actions de GSHI.",
  projectOverviewTitle: "Un site vitrine simple et efficace",
  context: "GSHI souhaite renforcer sa visibilité numérique avec un site vitrine clair, professionnel et adapté aux visiteurs, partenaires et potentiels bénéficiaires.",
  centralChallenge: "Créer une présence digitale crédible et lisible, tout en gardant un projet abordable, rapide à livrer et centré sur les informations essentielles.",
  centralChallengeLabel: "Enjeu central",
  objectives: [
    { title: "Visibilité institutionnelle", description: "Présenter clairement la mission, les services et les actions de GSHI.", accent: "border-t-[#ffc82c]" },
    { title: "Accès rapide à l’information", description: "Mettre en avant les informations clés pour les visiteurs, partenaires et candidats.", accent: "border-t-[#ff3b56]" },
    { title: "Contact simplifié", description: "Faciliter le contact et la demande de partenariat ou d’accompagnement.", accent: "border-t-[#10b981]" },
    { title: "Mise en ligne rapide", description: "Livrer une solution légère, propre et facilement maintenable.", accent: "border-t-[#ffc82c]" },
  ],
  objectivesHeading: "Résultats visés",
  orientation: "Nous proposons un site vitrine responsive et administrable, sans paiement, sans e-learning et sans modules plus complexes.",
  orientationLabel: "Orientation proposée",
  designSectionTitle: "Poser une identité claire et un parcours simple",
  designPhases: [
    {
      number: "01",
      title: "Identité visuelle & direction artistique",
      description: "Une expression visuelle cohérente avec les valeurs de GSHI.",
      deliverables: [
        "Palette graphique, typographies et principes visuels adaptés.",
        "Mise en forme de l’identité GSHI pour un rendu propre.",
        "Charte visuelle de base pour garantir la cohérence.",
      ],
    },
    {
      number: "02",
      title: "UX / conception UI",
      description: "Structure de navigation et maquettes des pages prioritaires.",
      deliverables: [
        "Arborescence claire des principales pages du site.",
        "Maquettes desktop et mobile pour l’accueil, les services et le contact.",
      ],
    },
  ],
  journeysHeading: "Parcours principaux",
  journeys: ["Découvrir GSHI et sa mission.", "Voir les services et initiatives clés.", "Contacter l’équipe."],
  designPrinciplesHeading: "Principes de conception",
  designPrinciples: ["Navigation simple et lisible sur mobile.", "Contenus hiérarchisés.", "Design professionnel."],
  developmentSectionTitle: "Développer un site vitrine fiable et moderne",
  developmentIntroduction: "L’objectif est d’obtenir une présence web professionnelle, rapide à lancer et facile à maintenir.",
  developmentPhases: [
    {
      number: "03",
      title: "Développement frontend",
      description: "Mise en place de l’interface web responsive.",
      deliverables: ["Page d’accueil.", "Sections services, à propos et contact.", "Version mobile optimisée."],
    },
    {
      number: "04",
      title: "Mise en ligne & paramétrage",
      description: "Livraison du site final et mise en ligne.",
      deliverables: ["Déploiement sur hébergement.", "Validation fonctionnelle.", "Ajustements finaux."],
    },
  ],
  implementationNotesLabel: "Périmètre retenu :",
  implementationNotes: "Le projet se limite à un site vitrine moderne, lisible et orienté conversion.",
  deploymentHeading: "Mise en ligne",
  deployment: "Tests de navigation et correction des derniers points avant mise en ligne.",
  budgetSectionTitle: "Budget proposé",
  budgetIntroduction: "Chiffrage indicatif pour une mise en ligne rapide et professionnelle.",
  budgetItems: [
    { phase: "01 · Direction artistique", deliverables: "Charte visuelle et éléments de marque.", amount: 150000 },
    { phase: "02 · UX / maquettes", deliverables: "Arborescence, wireframes et maquettes responsive.", amount: 120000 },
    { phase: "03 · Développement du site vitrine", deliverables: "Pages d’accueil, services, about, actualité et contact.", amount: 180000 },
    { phase: "04 · Déploiement & ajustements", deliverables: "Mise en ligne, tests finaux et réglages de finition.", amount: 50000 },
  ],
  currency: "FCFA",
  payments: [
    { label: "À l’acceptation", percentage: 50, milestone: "Lancement du projet" },
    { label: "Validation design", percentage: 30, milestone: "Après validation des maquettes" },
    { label: "Livraison finale", percentage: 20, milestone: "Après mise en ligne et recette" },
  ],
  paymentHeading: "Échéancier indicatif",
  timelineTitle: "Planning indicatif · 2 à 3 semaines",
  timeline: [
    { period: "Semaine 1", description: "Direction artistique, cadrage et maquettes." },
    { period: "Semaine 2", description: "Développement des pages et intégration." },
    { period: "Semaine 3", description: "Tests, ajustements et mise en ligne." },
  ],
  clientInputsHeading: "À fournir par le client",
  clientInputs: "Texte institutionnel, visuels, logos et informations de contact.",
  finalChecksHeading: "À confirmer au devis final",
  finalChecks: "Périmètre exact, contenus retenus, délais et hébergement.",
};

const weglowTemplate: ProposalDocumentData = {
  ...gshiTemplate,
  reference: "KT-2026-WEGLOW-001",
  validity: "30 jours",
  clientName: "WeGlow & WeGlow Surprise",
  clientShortName: "WeGlow",
  clientSlogan: "Bijouterie · Accessoires · Surprises · Événementiel",
  recipient: "Direction WeGlow",
  summary: "Conception et réalisation d’un site vitrine administrable pour les univers Bijouterie & Accessoires et WeGlow Surprise.",
  projectOverviewTitle: "Valoriser la dualité de la marque",
  context: "WeGlow a développé WeGlow Surprise autour des cadeaux personnalisés, de la décoration événementielle et des animations musicales.",
  centralChallenge: "Conserver la notoriété de WeGlow tout en séparant clairement les univers.",
  budgetItems: [
    { phase: "01 · Direction artistique & UI/UX", deliverables: "Charte web et maquettes des deux univers.", amount: 250000 },
    { phase: "02 · Frontend & galerie", deliverables: "Pages, catalogue, galerie filtrable, devis et WhatsApp.", amount: 450000 },
    { phase: "03 · Back-office & backend", deliverables: "API et administration des réalisations et devis.", amount: 350000 },
    { phase: "04 · Déploiement & formation", deliverables: "Configuration, mise en ligne et prise en main.", amount: 150000 },
  ],
};

export default function ProposalStudioAdmin({
  token,
  clients,
  onSaved,
}: {
  token: string;
  clients: Client[];
  onSaved: () => void;
}) {
  const [template, setTemplate] = useState<"gshi" | "weglow" | "custom">("gshi");
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || "");
  const [proposalData, setProposalData] = useState<ProposalDocumentData>(gshiTemplate);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (template === "gshi") setProposalData(gshiTemplate);
    else if (template === "weglow") setProposalData(weglowTemplate);
  }, [template]);

  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  async function handleSaveToDatabase() {
    if (!selectedClientId) {
      setSaveMessage("Erreur : Veuillez d'abord sélectionner ou ajouter un client.");
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const payload = {
        title: proposalData.summary || `Devis ${proposalData.reference}`,
        description: `Cadrage et proposition tarifaire pour ${proposalData.clientName}`,
        clientId: selectedClientId,
        currency: proposalData.currency || "XAF",
        discount: 0,
        documentData: proposalData,
        items: proposalData.budgetItems.map((item, index) => ({
          label: item.phase,
          description: item.deliverables,
          quantity: 1,
          unitPrice: Number(item.amount) || 0,
          position: index,
        })),
      };

      await apiFetch("proposals", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
      });

      setSaveMessage("✅ Devis enregistré avec succès dans la base de données !");
      onSaved();
    } catch (error) {
      setSaveMessage(error instanceof Error ? `❌ Erreur : ${error.message}` : "Impossible d'enregistrer le devis.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#121620]/80 p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="studio-template" className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Modèle de départ
            </label>
            <select
              id="studio-template"
              className="mt-1 rounded-lg border border-white/15 bg-[#0b0d14] px-3 py-1.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
              value={template}
              onChange={(e) => setTemplate(e.target.value as "gshi" | "weglow" | "custom")}
            >
              <option value="gshi">GSHI · Site Vitrine</option>
              <option value="weglow">WeGlow · Plateforme Web Administrable</option>
              <option value="custom">Personnalisé / Vierge</option>
            </select>
          </div>

          <div>
            <label htmlFor="studio-client" className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Client associé en base
            </label>
            <select
              id="studio-client"
              className="mt-1 rounded-lg border border-white/15 bg-[#0b0d14] px-3 py-1.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              {clients.length === 0 ? (
                <option value="">Aucun client (Ajoutez un client d'abord)</option>
              ) : (
                clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName || `${c.firstName} ${c.lastName}`} ({c.email})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-white/15 bg-[#0b0d14] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1 text-xs font-bold transition rounded-md ${
                activeTab === "edit" ? "bg-amber-400 text-black shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              <i className="pi pi-pencil mr-1 text-xs" /> Éditeur
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 text-xs font-bold transition rounded-md ${
                activeTab === "preview" ? "bg-amber-400 text-black shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              <i className="pi pi-eye mr-1 text-xs" /> Aperçu PDF / Impresssion
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveToDatabase}
            disabled={saving || !selectedClientId}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-400/50 bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_15px_rgba(255,200,44,0.3)] transition hover:scale-105 disabled:opacity-50"
          >
            <i className={`pi ${saving ? "pi-spin pi-spinner" : "pi-save"} text-xs`} />
            <span>{saving ? "Enregistrement..." : "Sauvegarder Devis BDD"}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`rounded-xl border p-3.5 text-xs font-semibold ${
            saveMessage.includes("✅")
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/40 bg-rose-500/10 text-rose-300"
          }`}
        >
          {saveMessage}
        </div>
      )}

      {/* Main Studio Viewport */}
      {activeTab === "edit" ? (
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-4 sm:p-6 shadow-2xl">
          <ProposalEditor initialProposal={proposalData} />
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-4 sm:p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Aperçu en direct du document de devis
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
            >
              <i className="pi pi-print text-xs" /> Imprimer / Exporter PDF
            </button>
          </div>
          <ProposalDocument proposal={proposalData} />
        </div>
      )}
    </div>
  );
}
