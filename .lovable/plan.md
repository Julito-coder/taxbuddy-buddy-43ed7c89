## Plan — Refonte responsive de la page Élio Agent

### Audit : sources des sliders et débordements

**1. Conflit de layout racine (cause majeure)**
- `Agent.tsx` est enveloppé dans `AppLayout` qui pose déjà : `min-h-screen pb-20` + `padding p-4` sur le `<main>`.
- À l'intérieur, la page force `height: 100dvh` + `width: 100%` sur son conteneur. Résultat : la hauteur 100dvh **ignore** la barre de nav du bas (68 px) → le composer sticky est masqué OU pousse la page au-delà du viewport → scroll vertical parasite. Le padding `p-4` d'`AppLayout` ajoute des marges qui cassent les pleines largeurs et créent des zones débordantes sur petits écrans.

**2. Slider horizontal des chips**
- `ContextualChips` utilise `overflow-x-auto` + `w-max` + jusqu'à 7 chips. Sur mobile c'est volontaire (scroll horizontal) mais en l'absence de fade/indicateur visuel et avec le `p-4` d'`AppLayout`, ça déborde du viewport.

**3. Slider vertical du thread**
- `MessageThread` a `flex-1 overflow-y-auto`, mais comme la page entière est aussi en `100dvh` + `AppLayout` ajoute son propre scroll → on a deux conteneurs scrollables imbriqués qui se concurrencent.
- Les bulles utilisateur `maxWidth: '85%'` et assistant `maxWidth: '90%'` peuvent sortir si le parent a un padding inattendu.

**4. Header doublon**
- `AgentHeader` est sticky `top-0` MAIS le mobile a déjà `MobileTopBar` (déprécié) ou aucune barre — sur desktop la sidebar est à gauche. Le header agent reste pertinent, mais son `sticky top-0` colle au top du viewport au lieu de coller au top du conteneur scrollable, ce qui crée des artefacts.

**5. Composer sticky**
- `sticky bottom-0` calculé par rapport au mauvais ancêtre scrollable → recouvert par `BottomNav` mobile.

**6. Padding parasite d'AppLayout**
- `p-4 lg:p-8` autour des `children` empêche la page Agent d'être full-bleed. Pour un chat plein écran, on doit annuler ce padding.

### Solution cible

**A. La page Agent ne doit pas utiliser le layout standard `p-4`/scroll.**
Créer un mode "fullscreen chat" pour `AppLayout` (prop optionnelle) ou — plus simple et moins invasif — **bypasser `AppLayout`** et composer directement la page avec `Sidebar` (desktop) + `BottomNav` (mobile) + un conteneur flex column qui occupe précisément `100dvh` moins la nav du bas.

Choix retenu : ajouter une variante `<AppLayout variant="chat">` qui :
- supprime le padding interne (`p-4 lg:p-8` → `p-0`),
- supprime le gradient radial décoratif (qui ajoute du bruit visuel sur le chat),
- garde `pb-20 lg:pb-0` pour ne pas être recouvert par la `BottomNav` mobile,
- garde l'`overflow-x-hidden`.

**B. Architecture de la page Agent (mobile-first)**

```text
[AppLayout variant="chat"]
  <div className="flex flex-col h-[100dvh] lg:h-[calc(100vh-0px)]">
    AgentHeader            ← sticky top dans CE conteneur, pas le viewport
    <main flex-1 min-h-0>  ← unique zone scrollable
      Welcome | Thread     ← occupe l'espace dispo
    </main>
    AgentComposer          ← collé au bas (NON sticky, vrai bottom de flex)
  </div>
```

Règles :
- Hauteur racine = `100dvh` mobile, et sur desktop on retire `pb-20` donc la même formule fonctionne (la sidebar est latérale, pas en bas).
- Pour mobile : on retranche la hauteur de `BottomNav` (68 px) via `min-h-0` sur la zone centrale et un wrapper qui calcule `height: calc(100dvh - 68px)` quand `lg:hidden`. Ou plus simple : laisser `AppLayout` gérer le `pb-20` via un `padding-bottom` sur le conteneur racine et faire que la page Agent occupe `height: 100%` du `<main>`.

Implémentation choisie (la plus robuste) :
- `AppLayout variant="chat"` rend le `<main>` en `flex flex-col` avec `height: 100dvh` et conserve `pb-[68px] lg:pb-0` SUR le main lui-même. Les `children` reçoivent `flex-1 min-h-0 flex flex-col`.
- Page Agent : devient un `flex flex-col` qui remplit cet espace sans chercher elle-même à fixer une hauteur.

**C. Welcome zone (Hero + Chips + QuickActions)**
- Conteneur centré `max-w-[760px]` conservé.
- `ContextualChips` : garder le scroll horizontal (volontaire), MAIS :
  - ajouter un fade-edge à droite (mask CSS) pour signaler qu'il y a plus à droite,
  - empêcher tout débordement parent via `overflow-x-hidden` sur le wrapper extérieur,
  - réduire la hauteur de chip à 32 px sur < 380 px.
- `QuickActionsGrid` : `grid-cols-2` sur mobile (déjà OK). Vérifier que les cartes ne forcent pas de largeur min. Réduire `min-h-[88px]` à `min-h-[80px]` mobile.
- Ajouter `overflow-y-auto` au conteneur welcome pour qu'il scrolle si l'écran est très court (clavier ouvert, paysage).

**D. Thread**
- Une seule zone scrollable (`MessageThread`) ; supprimer tout autre `overflow` sur les ancêtres.
- Bulles utilisateur : remplacer `maxWidth: '85%'` par `max-w-[min(85%,520px)]` pour borner sur grand écran.
- Bulles assistant : `min-w-0 flex-1` + `max-w-full` (le `90%` est inutile dans un flex avec mascot fixe).
- Vérifier que `RichViewRenderer` ne contient pas d'élément `min-w` qui dépasse la bulle (TaxBreakdown, RealEstateCashflow OK car `grid-cols-2`).

**E. Composer**
- Devient le dernier enfant flex (pas `sticky bottom-0`) → toujours visible.
- `padding-bottom: env(safe-area-inset-bottom)` conservé pour les iPhone à encoche.
- Sur mobile, le clavier déclenche `visualViewport.resize` → la zone scrollable thread s'ajuste automatiquement (déjà géré dans `MessageThread`).

**F. Header**
- Reste un enfant flex (pas `sticky`). Devient simplement un `<header className="shrink-0 h-[60px]">` en haut du flex.
- Cela élimine le bug du sticky par rapport au mauvais ancêtre.
- Sur desktop, on peut le masquer (`lg:hidden`) car la sidebar fournit déjà la nav — à confirmer avec le user. Pour ce plan, on le garde sur tous les écrans (pas une régression).

**G. Sécurités globales**
- Wrapper racine de la page : `overflow-hidden` (pas `overflow-x-hidden` seul) pour éviter tout scroll vertical involontaire au niveau page.
- Chaque zone explicitement `min-w-0` pour que `flex` n'élargisse pas les enfants au-delà du parent (cause classique de scroll horizontal).
- Supprimer `width: 100%, maxWidth: 100vw` inline (redondants et source de bugs avec scrollbar).

### Fichiers à modifier

1. **`src/components/layout/AppLayout.tsx`** — ajouter prop `variant?: 'default' | 'chat'`. En mode `chat` : pas de padding interne, pas de gradient, `<main>` devient `flex flex-col h-[100dvh]` avec `pb-[68px] lg:pb-0` ; `children` reçoit un wrapper `flex-1 min-h-0 flex flex-col`.
2. **`src/pages/Agent.tsx`** — passer `variant="chat"` à `AppLayout`. Restructurer en `<div className="flex flex-col h-full min-h-0">` avec Header (shrink-0), zone centrale (`flex-1 min-h-0 overflow-hidden`) qui contient soit Welcome (scrollable) soit Thread (scrollable). Composer en bas du flex (non sticky). Retirer `height: 100dvh`, `width: 100%`, `maxWidth: 100vw` inline.
3. **`src/components/agent/AgentHeader.tsx`** — passer de `sticky top-0` à `shrink-0` simple. Garder le style.
4. **`src/components/agent/ContextualChips.tsx`** — wrapper `overflow-hidden` extérieur + masque dégradé droite. Hauteur chip 32 px sous 380 px.
5. **`src/components/agent/MessageThread.tsx`** — bulles `max-w-[min(85%,520px)]`, retirer le `90%` assistant, ajouter `min-w-0` sur le wrapper interne.
6. **`src/components/agent/AgentComposer.tsx`** — retirer `sticky bottom-0` (devient plat). Conserver `border-t` et `safe-area-inset-bottom`.
7. **`src/components/agent/QuickActionsGrid.tsx`** — `min-h-[80px] md:min-h-[88px]`.
8. Aucune modification des `rich-views` (audit OK : utilisent `grid-cols-2`, pas de `min-w` problématique).

### Points techniques

- `100dvh` (dynamic viewport height) pour gérer correctement la barre d'URL mobile qui s'escamote.
- `pb-[68px]` sur le `<main>` chat correspond exactement à la hauteur de `BottomNav`. Si la valeur change, exposer une CSS var `--bottom-nav-h` plus tard.
- `min-h-0` sur les flex children est OBLIGATOIRE pour que `overflow-y-auto` fonctionne dans un parent flex (piège classique flexbox).
- Pas d'impact desktop (`lg:` neutralise `pb-[68px]`, le reste fonctionne identiquement).