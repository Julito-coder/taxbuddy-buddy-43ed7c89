# Refonte UX du profil fiscal

## Problème actuel

La page `/profil/fiscal` affiche **9 accordéons** simultanés bourrés de champs bruts (Input/Label) avec des emojis dans les titres. Aucun contexte, aucune motivation, aucune progression visible. L'utilisateur voit un mur de formulaire administratif décourageant.

Constats précis :
- Emojis dans tous les titres de section (🪪, 👨‍👩‍👧‍👦, 💼, 📋…) → effet "non sérieux"
- Tous les champs sont visibles d'un coup → surcharge cognitive
- Aucune explication du **bénéfice** (pourquoi remplir ?)
- Pas de logique de priorisation (champs critiques noyés dans les optionnels)
- Toast de confirmation avec emoji ✅
- Indicateur de complétion isolé, peu engageant

## Vision cible

Transformer le profil en **parcours guidé par modules thématiques**, façon "checklist sérieuse façon banque privée" :
1. Vue d'ensemble = tableau de bord des modules avec gain € associé à chaque module complété
2. Édition = drawer/modale plein écran focalisée sur un module à la fois, avec contexte et progression
3. Hiérarchie : champs essentiels d'abord, détails optionnels repliés
4. Aucun emoji, icônes Lucide uniquement, ton sobre et professionnel

## Structure de la nouvelle page `/profil/fiscal`

### 1. En-tête "Hub profil"

Remplace la barre de complétion seule par un bandeau structuré :
- Titre + sous-titre clair ("Plus ton profil est précis, plus mes recommandations te font gagner")
- Score de complétion (anneau ProgressRing existant) + libellé qualitatif ("Profil basique / Bon / Optimisé / Expert")
- Estimation **du gain fiscal potentiel débloqué** restant (basé sur modules manquants)
- CTA principal : "Compléter le prochain module" → ouvre directement le module à plus fort impact

### 2. Grille des modules (vue carte)

Remplace l'Accordion par une grille de **cartes-modules** (1 col mobile, 2 cols desktop). Chaque carte affiche :
- Icône Lucide (UserCircle, Users, Briefcase, Building2, Landmark, TrendingUp, Shield…)
- Nom du module (sans emoji) : Identité · Foyer fiscal · Activité professionnelle · Revenus · Patrimoine immobilier · Patrimoine financier · Préférences & consentements
- Mini-progression (X/Y champs remplis) avec barre fine
- Badge d'état : `À compléter` / `Partiel` / `Complet` / `Recommandé pour toi`
- Gain potentiel ou bénéfice concret ("Débloque +320 €/an d'optimisations détectées")
- Clic → ouvre le drawer d'édition du module

Modules conditionnels (Salarié, Indépendant, Retraité) n'apparaissent **qu'après** sélection du statut dans le module "Activité professionnelle".

### 3. Drawer d'édition par module

Composant `ProfileModuleDrawer` (basé sur `Sheet` shadcn, plein écran mobile, side panel desktop) qui contient :
- En-tête fixe : titre du module, fil d'Ariane "Profil > Module", indicateur "Étape X/Y" si multi-étape
- Section "Pourquoi ces infos" repliable (1 phrase + 2 puces de bénéfice concret)
- Champs regroupés en **sous-sections logiques** avec séparateurs et titres courts
- Champs essentiels visibles, champs optionnels dans un bloc "Détails avancés (facultatif)" replié
- Validations en ligne (helper text sous chaque champ, tonalité positive)
- Footer fixe : bouton "Enregistrer" + lien "Reprendre plus tard" (sauvegarde silencieuse au blur déjà implicite via state)

### 4. Composants réutilisables à créer

```
src/components/fiscal-profile/
├── ProfileHub.tsx              (nouvelle page principale, remplace FiscalProfileForm)
├── ProfileHubHeader.tsx        (bandeau score + gain + CTA)
├── ProfileModuleCard.tsx       (carte module dans la grille)
├── ProfileModuleDrawer.tsx     (Sheet d'édition)
├── ProfileFieldGroup.tsx       (regroupement avec titre + description)
├── ProfileField.tsx            (wrapper Input/Select avec helper, état de validation)
├── modules/
│   ├── identityModule.ts       (config champs + métadonnées)
│   ├── familyModule.ts
│   ├── professionalModule.ts
│   ├── employeeModule.ts
│   ├── selfEmployedModule.ts
│   ├── retiredModule.ts
│   ├── realEstateModule.ts
│   ├── financialModule.ts
│   └── consentsModule.ts
└── moduleRegistry.ts           (liste ordonnée + logique conditionnelle + scoring gain)
```

Les composants section existants (IdentitySection, FamilySection, etc.) sont **réécrits** pour être consommés dans le drawer avec le nouveau design (sous-sections, hiérarchisation essentiel/avancé, suppression des emojis), pas juste habillés.

### 5. Suppression des emojis et ton

- Toast de succès : "Profil mis à jour" (sans ✅), variant standard
- Tous les libellés relus pour ton sobre, "tu", phrases courtes
- Aucun emoji dans titres, sous-titres, badges, toasts, helper text
- Icônes Lucide partout, taille et couleur cohérentes (`h-5 w-5 text-primary`)

## Détails techniques

- Conserve `loadFiscalProfile` / `saveFiscalProfile` / `calculateProfileCompletion` (`src/lib/fiscalProfileService.ts`) sans changement.
- Ajoute dans `moduleRegistry.ts` une fonction `computeModuleCompletion(moduleId, data)` qui renvoie `{ filled, total, status, estimatedGainEuros }`. Le gain s'appuie sur la logique existante de `taxOptimizationEngine.ts` (lecture seule, on mappe quels modules débloquent quels gains).
- Le drawer utilise `Sheet` (shadcn) avec `side="right"` desktop, `side="bottom"` ou plein écran mobile via `useIsMobile`.
- État local du drawer : copie travail du module ouvert, save → merge dans state global puis `saveFiscalProfile`. Permet d'annuler sans toucher la base.
- Animations Framer Motion réutilisées (fade + slide) pour cohérence avec le reste de l'app.
- Respect strict des tokens design (semantic tokens HSL, pas de couleurs hardcodées). Variants Badge : `default | secondary | outline | success` (ajouter `success` si manquant via cva ou utiliser couleur primaire pour "Complet").
- Routes inchangées : `/profil/fiscal` rend le nouveau `ProfileHub` à la place de `FiscalProfileForm`. `FiscalProfile.tsx` adapte son en-tête (titre + sous-titre, retire l'icône doublon car le hub a son propre header).
- Mobile-first : grille 1 col < 768px, 2 cols ≥ 768px. Drawer plein écran sur mobile.
- Aucune migration DB, aucun changement backend, aucun changement de logique métier (purement UI/UX).

## Ce qui n'est PAS dans le scope

- Pas de modification des sections d'onboarding `src/components/onboarding/modern/*` (autre parcours, autre demande si besoin).
- Pas de changement du moteur de scoring, des edge functions, du schéma DB.
- Pas de refonte du `BankFiscalSummary` ni du Bulletin.

## Validation

Après implémentation : visite `/profil/fiscal` au viewport actuel (982×734) puis mobile (390×844) via browser tools, vérifie qu'aucun emoji ne subsiste, que les modules s'ouvrent en drawer, que la progression et le gain s'affichent, que la sauvegarde fonctionne (toast sobre, pas d'erreur console).
