## Plan — Menu mobile complet (burger drawer plein écran)

### Constat
- Sur desktop (`Sidebar`), tous les outils sont accessibles : Bulletin, Coach, Élio, Finances, Calendrier fiscal, Profil fiscal, Aides, Simulations, Paramètres, Déconnexion.
- Sur mobile (`BottomNav`), seuls 5 onglets sont exposés : Bulletin, Coach, Finances, Élio, Profil.
- Calendrier, Aides, Simulations (et toute l'arborescence /simulations/*), Paramètres, Déconnexion ne sont accessibles que depuis des liens internes ponctuels — beaucoup d'outils sont donc inaccessibles directement.

### Objectif
Sur mobile/tablette, ajouter un bouton "burger" toujours visible qui ouvre un panneau plein écran (overlay au-dessus de toute la page) listant tous les outils, regroupés par section comme dans la sidebar desktop, avec un accès direct à chaque page.

### Contenu du drawer (mêmes sections que la sidebar)
1. **Accueil** : Bulletin du jour, Coach, Élio Agent
2. **Mes finances** : Mes finances
3. **Pilotage** : Calendrier fiscal, Profil fiscal, Aides & dispositifs
4. **Simulations** : 
   - Toutes les simulations (hub)
   - Sous-segments principaux : Immobilier, Épargne PEA/PER, PACS/Mariage, CDI vs Freelance, Scanner fiscal, Coffre-fort
5. **Compte** : Paramètres, Déconnexion

Chaque entrée affiche son icône, son label, et ferme le drawer après navigation.

### Comportement
- Bouton burger placé dans une **TopBar mobile** fixe (visible uniquement `lg:hidden`), à gauche, avec à droite le logo Élio.
- Au clic : ouverture d'un **Sheet (shadcn) côté gauche, plein hauteur, largeur ~85vw** avec overlay sombre.
- Fermeture : clic overlay, swipe, bouton X, ou choix d'un item.
- Le `BottomNav` reste inchangé (5 onglets principaux) — le burger est complémentaire.
- Sur desktop (`lg:`), aucun changement (la sidebar reste).

### Implémentation
- Nouveau composant `src/components/layout/MobileTopBar.tsx` avec bouton burger + logo, monté dans `AppLayout` (visible `lg:hidden` uniquement).
- Nouveau composant `src/components/layout/MobileMenuDrawer.tsx` basé sur `Sheet` shadcn (`side="left"`), structurant les sections comme la `Sidebar` desktop.
- Réutilisation des mêmes routes et icônes Lucide que `Sidebar.tsx` pour cohérence.
- Ajustement minime du padding-top dans `AppLayout` pour accommoder la TopBar mobile (≈56px), sans toucher au desktop.

### Détails techniques
- Sheet contrôlé par `useState(open)`. `<NavLink>` ferme le drawer via `onClick`.
- Active state via `useLocation` (même logique que `Sidebar`).
- Section "Simulations" rendue en accordéon (`Collapsible` shadcn) pour exposer les sous-segments sans surcharger.
- Bouton "Déconnexion" appelle `signOut()` du `AuthContext`.
- Z-index : TopBar `z-40`, Sheet (overlay+content) au-dessus via Radix portal natif.