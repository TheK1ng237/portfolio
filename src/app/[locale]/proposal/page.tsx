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
  summary: "Conception et réalisation d’une plateforme web bilingue dédiée à l’incubation, au conseil et à la formation.",
  projectOverviewTitle: "Une plateforme au service de l’impact",
  context: "GSHI accompagne les jeunes, les PME et les agripreneurs autour de l’agribusiness, de l’économie verte et de l’entrepreneuriat rural. La plateforme doit rendre cette mission visible et transformer l’intérêt des visiteurs en parcours concrets.",
  centralChallenge: "Créer une présence numérique crédible auprès des bénéficiaires et partenaires, tout en réunissant les services d’accompagnement et de formation dans une expérience accessible sur mobile.",
  centralChallengeLabel: "Enjeu central",
  objectives: [
    { title: "Crédibilité institutionnelle", description: "Présenter clairement la mission, les actions, les équipes et les résultats de GSHI.", accent: "border-t-[#ffc82c]" },
    { title: "Accès bilingue", description: "Rendre les contenus essentiels disponibles en français et en anglais.", accent: "border-t-[#ff3b56]" },
    { title: "Accompagnement utile", description: "Orienter les candidats et agripreneurs vers les ressources et services adaptés.", accent: "border-t-[#10b981]" },
    { title: "Autonomie numérique", description: "Prévoir une gestion des contenus et des parcours de formation évolutive.", accent: "border-t-[#ffc82c]" },
  ],
  objectivesHeading: "Résultats visés",
  orientation: "Un socle web responsive et administrable, livré par étapes. Les paiements, le générateur de documents et l’e-learning feront l’objet d’un cadrage technique dédié avant engagement définitif.",
  orientationLabel: "Orientation proposée",
  designSectionTitle: "Poser une identité claire, concevoir des parcours simples",
  designPhases: [
    {
      number: "01",
      title: "Identité visuelle & direction artistique",
      description: "Une expression cohérente avec l’innovation rurale et l’économie verte.",
      deliverables: [
        "Palette, typographies et principes graphiques pour le web et les documents numériques.",
        "Déclinaison des valeurs de GSHI en éléments visuels et iconographiques.",
        "Gabarits de communication pour les annonces de formation et les actualités.",
        "Document de référence synthétique pour assurer la cohérence des supports.",
      ],
    },
    {
      number: "02",
      title: "UX research & conception UI",
      description: "Architecture de l’information et maquettes responsive avant développement.",
      deliverables: [
        "Arborescence et wireframes des pages principales et des parcours prioritaires.",
        "Maquettes haute fidélité desktop et mobile pour l’accueil, la présentation de GSHI, les services et les actions.",
        "Conception des interfaces de consultation des formations et de l’espace candidat.",
        "Prototype Figma et kit UI de base pour guider l’intégration.",
      ],
    },
  ],
  journeysHeading: "Parcours principaux",
  journeys: [
    "Découvrir GSHI et ses domaines d’intervention.",
    "Explorer les services Consulting et Training.",
    "Accéder aux offres, ressources et formations.",
  ],
  designPrinciplesHeading: "Principes de conception",
  designPrinciples: [
    "Navigation courte et lisible sur smartphone.",
    "Contenus hiérarchisés pour les partenaires et bénéficiaires.",
    "Composants réutilisables et bilinguisme prévu dès la conception.",
  ],
  developmentSectionTitle: "Construire un socle évolutif et fiable",
  developmentIntroduction: "Le développement sera organisé autour d’un socle responsive, puis complété par les fonctions métier retenues après validation du périmètre et des dépendances externes.",
  developmentPhases: [
    {
      number: "03",
      title: "Développement frontend",
      description: "Interfaces accessibles, performantes et adaptées aux usages mobiles.",
      deliverables: [
        "Intégration des maquettes et composants responsive.",
        "Mise en place du parcours français / anglais.",
        "Formulaires, navigation, catalogue de contenus et interfaces prévues au périmètre.",
        "Optimisation des performances et vérifications sur les formats d’écran courants.",
      ],
    },
    {
      number: "04",
      title: "Backend, données & administration",
      description: "Services nécessaires à la gestion des comptes, contenus et parcours retenus.",
      deliverables: [
        "Modèle de données et API pour les contenus et fonctionnalités confirmés.",
        "Espace d’administration pour les offres, articles et formations selon le périmètre validé.",
        "Génération de CV ou de plans d’accompagnement PDF, après validation des règles métier.",
        "Préparation des intégrations de paiement et des parcours e-learning retenus.",
      ],
    },
  ],
  implementationNotesLabel: "Points de cadrage obligatoires :",
  implementationNotes: "Les intégrations Orange Money / MTN Mobile Money, l’e-learning et la génération automatique de documents dépendent des API, comptes marchands, contenus et règles métier fournis par GSHI. Leur faisabilité, leurs coûts tiers et leur calendrier seront confirmés avant validation du devis final.",
  deploymentHeading: "Mise en ligne",
  deployment: "Tests fonctionnels, corrections prévues au périmètre, déploiement et prise en main de l’administration. Hébergement, nom de domaine, frais de transaction et services tiers sont à confirmer séparément.",
  budgetSectionTitle: "Investissement proposé",
  budgetIntroduction: "Les montants ci-dessous reprennent la base budgétaire du document de référence. Ils constituent un brouillon de travail et devront être recalculés puis approuvés par Thek1ng237 et GSHI avant signature.",
  budgetItems: [
    { phase: "01 · Identité & direction artistique", deliverables: "Principes graphiques, document de référence, éléments de communication.", amount: 200000 },
    { phase: "02 · UX research & design UI", deliverables: "Architecture, wireframes, maquettes responsive et kit UI.", amount: 300000 },
    { phase: "03 · Développement frontend", deliverables: "Interfaces web responsive, bilinguisme et parcours retenus.", amount: 350000 },
    { phase: "04 · Backend & intégrations", deliverables: "API, données, administration et modules confirmés au cadrage.", amount: 400000 },
  ],
  currency: "FCFA",
  payments: [
    { label: "Au démarrage", percentage: 40, milestone: "Lancement du projet" },
    { label: "Maquettes & API", percentage: 35, milestone: "Après validation intermédiaire" },
    { label: "Livraison", percentage: 25, milestone: "Après recette et avant mise en ligne" },
  ],
  paymentHeading: "Échéancier indicatif",
  timelineTitle: "Planning indicatif · 4 à 6 semaines",
  timeline: [
    { period: "Semaines 1–2", description: "Direction artistique, architecture, wireframes et maquettes." },
    { period: "Semaines 3–4", description: "Développement des interfaces et mise en place des services confirmés." },
    { period: "Semaine 5", description: "Intégrations métier retenues, tests et ajustements." },
    { period: "Semaine 6", description: "Recette, prise en main et déploiement, si les dépendances sont disponibles." },
  ],
  clientInputsHeading: "À fournir par le client",
  clientInputs: "Textes, traductions, identité existante, accès aux services tiers et interlocuteur de validation.",
  finalChecksHeading: "À confirmer au devis final",
  finalChecks: "Périmètre détaillé, révisions incluses, coûts tiers, maintenance et calendrier ferme.",
};

export default function ProposalPage() {
  return <ProposalEditor initialProposal={gshiProposal} />;
}