import {
  Heart, Briefcase, Building2, PiggyBank, Sun,
  Baby, Users, HandCoins, Coins, FileText, TrendingUp,
  Wallet, Bitcoin, Home, Hammer, Calendar as CalendarIcon,
  LogOut, ScanSearch, FolderLock,
} from 'lucide-react';

export type Status = 'available' | 'agent' | 'soon';

export interface SubItem {
  label: string;
  icon: React.ElementType;
  status: Status;
  to?: string;
  prompt?: string;
}

export interface Section {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  items: SubItem[];
}

export const sections: Section[] = [
  {
    title: 'Famille & Couple',
    subtitle: 'Union, séparation, enfants, transmission',
    icon: Heart,
    accent: 'bg-primary/10 text-primary',
    items: [
      { label: 'PACS / Mariage', icon: Heart, status: 'available', to: '/simulations/pacs' },
      { label: 'Régime matrimonial', icon: Users, status: 'agent', prompt: 'Compare les régimes matrimoniaux (communauté réduite, séparation de biens, participation aux acquêts) dans ma situation.' },
      { label: 'Naissance / quotient familial', icon: Baby, status: 'agent', prompt: "Quel est l'impact fiscal d'une naissance sur mon quotient familial et mon impôt ?" },
      { label: 'Garde alternée', icon: Users, status: 'agent', prompt: "Explique l'impact fiscal d'une garde alternée (demi-parts) dans ma situation." },
      { label: 'Pension alimentaire', icon: HandCoins, status: 'agent', prompt: 'Comment déduire ou déclarer une pension alimentaire versée ou reçue ?' },
      { label: 'Rattachement enfant majeur', icon: Users, status: 'agent', prompt: 'Vaut-il mieux rattacher mon enfant majeur étudiant à mon foyer fiscal ou verser une pension ?' },
      { label: 'Donation entre vifs', icon: HandCoins, status: 'agent', prompt: 'Explique-moi les abattements de donation (100 000€ / 15 ans) et la stratégie optimale.' },
      { label: 'Divorce / dissolution PACS', icon: LogOut, status: 'soon' },
      { label: 'Succession', icon: FileText, status: 'soon' },
    ],
  },
  {
    title: 'Vie professionnelle',
    subtitle: 'Statut, rémunération, transitions',
    icon: Briefcase,
    accent: 'bg-coral-500/10 text-coral-700',
    items: [
      { label: 'CDI vs Freelance', icon: Briefcase, status: 'available', to: '/simulations/freelance' },
      { label: 'Choix IR vs IS', icon: FileText, status: 'agent', prompt: "Mon entreprise doit-elle être à l'IR ou à l'IS ? Compare les deux dans ma situation." },
      { label: 'Dividendes vs salaire', icon: Coins, status: 'agent', prompt: 'En SASU/EURL, vaut-il mieux me verser un salaire ou des dividendes ?' },
      { label: 'Versement libératoire micro', icon: FileText, status: 'agent', prompt: "Le versement libératoire de l'impôt en micro-entreprise est-il intéressant pour moi ?" },
      { label: 'Passage micro → réel', icon: TrendingUp, status: 'agent', prompt: 'Quand basculer de la micro-entreprise au régime réel ?' },
      { label: 'Franchise TVA', icon: FileText, status: 'agent', prompt: 'Dois-je sortir de la franchise de TVA ou y rester ?' },
      { label: 'Rupture conventionnelle', icon: LogOut, status: 'agent', prompt: 'Compare rupture conventionnelle vs démission : ARE, fiscalité des indemnités.' },
      { label: 'Stock-options / BSPCE / AGA', icon: TrendingUp, status: 'agent', prompt: 'Explique-moi la fiscalité de mes stock-options / BSPCE / AGA.' },
      { label: 'Expatriation / impatriation', icon: LogOut, status: 'soon' },
    ],
  },
  {
    title: 'Immobilier',
    subtitle: 'Achat, locatif, travaux, revente',
    icon: Building2,
    accent: 'bg-success/10 text-success',
    items: [
      { label: 'Simulateur immobilier complet', icon: Building2, status: 'available', to: '/simulations/immobilier' },
      { label: 'Résidence principale vs location', icon: Home, status: 'available', to: '/simulations/immobilier' },
      { label: 'Locatif nu (micro-foncier vs réel)', icon: Building2, status: 'available', to: '/simulations/immobilier' },
      { label: 'Locatif meublé (LMNP/LMP)', icon: Building2, status: 'available', to: '/simulations/immobilier' },
      { label: 'Meublé tourisme / Airbnb', icon: Home, status: 'agent', prompt: 'Quels sont les nouveaux seuils 2025 pour la location meublée touristique (Airbnb) ?' },
      { label: "SCI à l'IR vs IS", icon: FileText, status: 'agent', prompt: "SCI à l'IR ou à l'IS : que choisir dans ma situation ?" },
      { label: 'Travaux / déficit foncier', icon: Hammer, status: 'agent', prompt: "Comment optimiser mes travaux locatifs avec le déficit foncier et MaPrimeRénov' ?" },
      { label: 'Démembrement (usufruit / NP)', icon: FileText, status: 'agent', prompt: 'Explique-moi la stratégie de démembrement (usufruit / nue-propriété).' },
      { label: 'Plus-value à la revente', icon: TrendingUp, status: 'agent', prompt: 'Calcule ma plus-value à la revente et les abattements pour durée de détention.' },
      { label: "Pinel / Denormandie / Loc'Avantages", icon: Building2, status: 'soon' },
    ],
  },
  {
    title: 'Épargne & placements',
    subtitle: 'PER, AV, PEA, SCPI, crypto',
    icon: PiggyBank,
    accent: 'bg-primary/10 text-primary',
    items: [
      { label: 'Simulateur épargne PEA / PER', icon: PiggyBank, status: 'available', to: '/simulations/epargne' },
      { label: 'Versement PER (déduction IR)', icon: Wallet, status: 'agent', prompt: "Combien verser sur mon PER pour optimiser ma déduction d'impôt ?" },
      { label: 'Assurance-vie (rachat / clause)', icon: FileText, status: 'agent', prompt: 'Comment optimiser mes rachats sur assurance-vie et la clause bénéficiaire ?' },
      { label: 'Arbitrage CTO → PEA', icon: TrendingUp, status: 'agent', prompt: 'Vaut-il mieux investir via mon CTO ou ouvrir un PEA ?' },
      { label: 'SCPI (direct, AV, démembrement)', icon: Building2, status: 'agent', prompt: 'Compare les façons d\'investir en SCPI : en direct, via AV, en démembrement.' },
      { label: 'Crypto (déclaration 2086)', icon: Bitcoin, status: 'available', to: '/simulations/scanner' },
      { label: 'Épargne salariale (PEE/PERCO)', icon: Wallet, status: 'agent', prompt: 'Comment optimiser mon épargne salariale (PEE, PERCO, intéressement, participation) ?' },
      { label: 'Dons aux œuvres (66% / 75%)', icon: HandCoins, status: 'agent', prompt: 'Quelle réduction d\'impôt puis-je obtenir avec mes dons aux œuvres ?' },
      { label: 'FCPI / FIP', icon: TrendingUp, status: 'soon' },
    ],
  },
  {
    title: 'Retraite & événements',
    subtitle: 'Préparer, anticiper, transmettre',
    icon: Sun,
    accent: 'bg-coral-500/10 text-coral-700',
    items: [
      { label: 'Rachat de trimestres', icon: CalendarIcon, status: 'agent', prompt: 'Le rachat de trimestres pour ma retraite est-il rentable dans ma situation ?' },
      { label: 'Date optimale de départ', icon: CalendarIcon, status: 'agent', prompt: 'Quelle est la date optimale pour partir à la retraite (taux plein, surcote) ?' },
      { label: 'Sortie PER (capital vs rente)', icon: Wallet, status: 'agent', prompt: 'À la retraite, vaut-il mieux sortir mon PER en capital ou en rente ?' },
      { label: 'Cumul emploi-retraite', icon: Briefcase, status: 'agent', prompt: 'Comment fonctionne le cumul emploi-retraite et son imposition ?' },
      { label: 'Prime / bonus exceptionnel', icon: Coins, status: 'agent', prompt: "J'ai reçu une prime exceptionnelle. Comment lisser l'impôt ou la verser sur un PER ?" },
      { label: "Vente d'entreprise (150-0 B ter)", icon: TrendingUp, status: 'soon' },
      { label: 'Pacte Dutreil', icon: FileText, status: 'soon' },
    ],
  },
  {
    title: 'Outils annuels',
    subtitle: 'Déclaration, documents, archivage',
    icon: ScanSearch,
    accent: 'bg-warning/10 text-warning',
    items: [
      { label: 'Scanner fiscal (déclaration)', icon: ScanSearch, status: 'available', to: '/simulations/scanner' },
      { label: 'Coffre-fort documents', icon: FolderLock, status: 'available', to: '/coffre' },
    ],
  },
];
