## Plan — Burger en bottom nav + overlay plein écran fluide

### Changements de surface
- Supprimer le `MobileTopBar` (et son bouton burger en haut). Le burger devient un onglet du `BottomNav`.
- Le `Sheet` latéral est remplacé par un overlay **plein écran** qui s'ouvre depuis le bas avec une animation fluide (slide-up + fade), couvrant toute la zone (sauf safe-area système).

### Nouveau BottomNav (mobile)
6 onglets, le burger remplace l'onglet le plus secondaire pour rester lisible :
1. Bulletin
2. Coach
3. Élio (centre)
4. Finances
5. Profil
6. **Outils** (icône grille / Menu) → ouvre l'overlay plein écran

Le bouton "Outils" n'est pas un `NavLink` mais un bouton qui bascule l'overlay. État actif visuel quand l'overlay est ouvert.

### Overlay plein écran "Tous les outils"
Composant unique `MobileToolsOverlay` :
- `position: fixed inset-0`, `z-[60]` (au-dessus du BottomNav).
- Animation : slide-in depuis le bas + fade overlay (durée 300ms, ease-out).
- Header sticky : titre "Tous les outils" à gauche, bouton X (h-11 w-11) à droite.
- Body scrollable plein écran avec sections empilées.

### Contenu segmenté
Sections affichées comme **cartes-titres uniquement** (pas de sous-items déroulés) — un tap ouvre/déplie la carte ou navigue selon le cas :

**Sections directes (un seul outil → navigation immédiate)** :
- Bulletin du jour → /bulletin
- Coach → /coach
- Élio Agent → /agent
- Mes finances → /finances
- Calendrier fiscal → /calendrier
- Profil fiscal → /profil
- Aides & dispositifs → /aides
- Coffre-fort → /coffre
- Paramètres → /profil/parametres

**Sections "Simulations" (collapsibles)** — uniquement les **6 titres de segment** au repos, pour ne pas surcharger :
- Famille & Couple
- Vie professionnelle
- Immobilier
- Épargne & placements
- Retraite & événements
- Outils annuels

Au tap sur un titre de segment → la carte se déplie en place (Collapsible animé) et expose les sous-items (label + statut Disponible/Via Élio/Bientôt). Tap sur un sous-item disponible → navigue (et ferme l'overlay) ; statut "agent" → navigue vers `/agent` avec prompt ; "soon" → désactivé. Réutilise les mêmes données que `src/pages/Simulations.tsx` (extraction dans un fichier partagé `src/data/simulationsCatalog.ts`).

Pied : bouton "Déconnexion" discret.

### Comportement
- Ouverture/fermeture animée (Framer Motion AnimatePresence) — slide vertical fluide.
- Fermeture sur : bouton X, Escape, swipe vers le bas, navigation (route change), back système (popstate).
- Body scroll lock pendant l'ouverture.
- Focus trap simple via `inert` sur le reste de la page.
- Aucune sidebar/desktop touchée (overlay reste `lg:hidden`).

### Détails techniques
- Nouveau fichier `src/data/simulationsCatalog.ts` exportant `sections` (déplacé depuis `Simulations.tsx`, importé aussi par cette page).
- Nouveau composant `src/components/layout/MobileToolsOverlay.tsx` (plein écran, animé, segments collapsibles).
- `BottomNav` : passe à 6 cellules, ajoute le bouton "Outils" qui contrôle un état remonté via contexte léger ou via prop drilling depuis `AppLayout`.
- `AppLayout` : monte `MobileToolsOverlay` et possède l'état `toolsOpen`. Passe `toolsOpen` + `onToolsOpenChange` au `BottomNav`. Supprime `MobileTopBar`.
- Suppression des fichiers `MobileTopBar.tsx` et `MobileMenuDrawer.tsx` (remplacés).
- Mise à jour mémoire : remplacer "Mobile Burger Drawer" par "Mobile Tools Overlay (bottom nav)".