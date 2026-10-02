import ProposalEditor from "../component/ProposalEditor";
import type { ProposalDocumentData } from "../component/ProposalDocument";

const gshiProposal: ProposalDocumentData = {
  brand: "Thek1ng237",
  creatorName: "NDOH YANNICK TANG",
  email: "ndohyannick78@gmail.com",
  phone: "+237 653 53 91 02",
  reference: "KT-2026-GSHI-001",
  issuedAt: "30 septembre 2026",
  validity: "15 jours",
  clientName: "Green Startups Hive Incubator",
  clientShortName: "GSHI",
  clientSlogan: "Incubons des talents, cultivons l’innovation en milieu rural",
  recipient: "M. Nkayouongam Moustapha",
  summary: "Conception et réalisation d’un site vitrine moderne pour présenter l’identité, les services et les actions de GSHI.",
  projectOverviewTitle: "Un site vitrine simple et efficace",
  context: "GSHI souhaite renforcer sa visibilité numérique avec un site vitrine clair, professionnel et adapté aux visiteurs, partenaires et potentiels bénéficiaires. Le site doit présenter la mission, les services, les initiatives et les moyens de contact sans complexifier le périmètre.",
  centralChallenge: "Créer une présence digitale crédible et lisible, tout en gardant un projet abordable, rapide à livrer et centré sur les informations essentielles.",
  centralChallengeLabel: "Enjeu central",
  objectives: [
    { title: "Visibilité institutionnelle", description: "Présenter clairement la mission, les services et les actions de GSHI.", accent: "border-t-[#ffc82c]" },
    { title: "Accès rapide à l’information", description: "Mettre en avant les informations clés pour les visiteurs, partenaires et candidats.", accent: "border-t-[#ff3b56]" },
    { title: "Contact simplifié", description: "Faciliter le contact et la demande de partenariat ou d’accompagnement.", accent: "border-t-[#10b981]" },
    { title: "Mise en ligne rapide", description: "Livrer une solution légère, propre et facilement maintenable.", accent: "border-t-[#ffc82c]" },
  ],
  objectivesHeading: "Résultats visés",
  orientation: "Nous proposons un site vitrine responsive et administrable, sans paiement, sans e-learning et sans modules plus complexes. Le périmètre est volontairement limité à la vitrine, la présentation des services et la conversion des visiteurs en contacts utiles.",
  orientationLabel: "Orientation proposée",
  designSectionTitle: "Poser une identité claire et un parcours simple",
  designPhases: [
    {
      number: "01",
      title: "Identité visuelle & direction artistique",
      description: "Une expression visuelle cohérente avec les valeurs de GSHI et son environnement rural innovant.",
      deliverables: [
        "Palette graphique, typographies et principes visuels adaptés au projet.",
        "Mise en forme de l’identité GSHI pour un rendu propre et crédible.",
        "Éléments visuels pour les sections d’accueil, services, actualités et contact.",
        "Charte visuelle de base pour garantir la cohérence du site.",
      ],
    },
    {
      number: "02",
      title: "UX / conception UI",
      description: "Structure de navigation et maquettes des pages prioritaires du site vitrine.",
      deliverables: [
        "Arborescence claire des principales pages du site.",
        "Maquettes desktop et mobile pour l’accueil, les services, l’about et le contact.",
        "Hiérarchisation des contenus pour une lecture facile et rapide.",
        "Prototype de base pour valider le parcours utilisateur avant développement.",
      ],
    },
  ],
  journeysHeading: "Parcours principaux",
  journeys: [
    "Découvrir GSHI et sa mission.",
    "Voir les services et initiatives clés.",
    "Contacter l’équipe ou demander un accompagnement.",
  ],
  designPrinciplesHeading: "Principes de conception",
  designPrinciples: [
    "Navigation simple et lisible sur mobile.",
    "Contenus hiérarchisés pour un public large et varié.",
    "Design professionnel sans surcomplexité fonctionnelle.",
  ],
  developmentSectionTitle: "Développer un site vitrine fiable et moderne",
  developmentIntroduction: "Le périmètre est limité à un site vitrine, sans paiement, sans e-learning et sans modules transverses avancés. L’objectif est d’obtenir une présence web professionnelle, rapide à lancer et facile à maintenir.",
  developmentPhases: [
    {
      number: "03",
      title: "Développement frontend",
      description: "Mise en place de l’interface web responsive et des sections prioritaires.",
      deliverables: [
        "Page d’accueil avec message clair et identité visuelle.",
        "Sections services, à propos, actualités et contact.",
        "Version mobile optimisée et navigation fluide.",
        "Mise en œuvre des composants réutilisables pour un rendu propre.",
      ],
    },
    {
      number: "04",
      title: "Mise en ligne & paramétrage",
      description: "Livraison du site final et mise en ligne avec la configuration de base.",
      deliverables: [
        "Déploiement sur un hébergement adapté.",
        "Validation fonctionnelle sur différents écrans.",
        "Prise en main de la gestion de contenu simple.",
        "Ajustements finaux avant mise en ligne.",
      ],
    },
  ],
  implementationNotesLabel: "Périmètre retenu :",
  implementationNotes: "Pour cette version, les fonctionnalités de paiement, d’e-learning, de génération de documents et de modules avancés sont retirées. Le projet se limite à un site vitrine moderne, lisible et orienté conversion.",
  deploymentHeading: "Mise en ligne",
  deployment: "Tests de navigation et correction des derniers points avant mise en ligne. Hébergement, nom de domaine et configuration technique seront validés selon le plan de déploiement retenu.",
  budgetSectionTitle: "Budget proposé",
  budgetIntroduction: "Le budget ci-dessous correspond à une version simple et ciblée de site vitrine, sans modules avancés ni intégrations de paiement. Il constitue une base de travail pour une mise en ligne rapide et professionnelle.",
  budgetItems: [
    { phase: "01 · Direction artistique", deliverables: "Charte visuelle et éléments de marque pour le site.", amount: 15000 },
    { phase: "02 · UX / maquettes", deliverables: "Arborescence, wireframes et maquettes responsive.", amount: 12000 },
    { phase: "03 · Développement du site vitrine", deliverables: "Pages d’accueil, services, about, actualité et contact.", amount: 18000 },
    { phase: "04 · Déploiement & ajustements", deliverables: "Mise en ligne, tests finaux et réglages de finition.", amount: 5000 },
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
    { period: "Semaine 1", description: "Direction artistique, cadrage, arborescence et maquettes.", },
    { period: "Semaine 2", description: "Développement des pages et intégration du design validé.", },
    { period: "Semaine 3", description: "Tests, ajustements, validation finale et mise en ligne.", },
  ],
  clientInputsHeading: "À fournir par le client",
  clientInputs: "Texte institutionnel, contenus, visuels, logos, informations de contact et éventuels éléments de communication à intégrer.",
  finalChecksHeading: "À confirmer au devis final",
  finalChecks: "Périmètre exact, contenus retenus, délais, hébergement et validation finale avant mise en ligne.",
};

export default function ProposalPage() {
  return <ProposalEditor initialProposal={gshiProposal} />;
}