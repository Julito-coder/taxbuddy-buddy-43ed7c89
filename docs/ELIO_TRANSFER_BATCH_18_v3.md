# Transfert v3 — Refactor landing Élio terminé (post-Batch 18B)

## Statut

**Refactor landing complet.** 18 batchs effectués sur la branche
`claude/refactor-landing-page-XDXCT`. PR draft ouverte vers `main` :
URL fournie dans la restitution Batch 18B.

État de la branche au push final :
- HEAD : `<hash 18B.2>` (Batch 18B.2 — transfert v3 commit lui-même)
- HEAD~1 : `6cd97ab` (Batch 18B.1 — fix color-contrast WCAG AA)
- HEAD~2 : `29edcf0` (Batch 18A.bis — 3D depth shuffle + multi-card count-up)
- Total commits sur la feature : 28 (1 préchargement Inter + 22 batches
  landing dont 17.1/17.2/17.bis/17.5 + 18A + 18A.bis + 18B.1 + 18B.2,
  plus quelques steps internes Batchs 1-3)
- Ratio diff vs main : 3 479 insertions, 828 deletions sur 25 fichiers

## Contexte projet

**Élio** = copilote administratif et financier B2C particuliers
français. Solo founder Jules, vibe coding sur Lovable, repo GitHub
`Julito-coder/taxbuddy-buddy-43ed7c89`. App précédemment Capitalum.

**Positionnement v4** : warm anti-Finary, mass-market français,
tutoiement, Inter only (Sora retiré), Coral #F06449 signature ownable
(gold #C8943E retiré). Phrase signature : "Le pro que tu n'avais pas
les moyens de payer." Hook signature : "Combien tu perds chaque année
sans le savoir ?"

**Dev platform** : Lovable connecté à GitHub. Preview Lovable
accessible par switch de branche. Sessions Claude Code CLOUD
exclusivement (path `/home/user/...`), JAMAIS en local
(les sessions locales `/Users/...` cassent l'auth GitHub via le proxy
local du cloud env).

## Récap exhaustif des 18 batchs

| # | Batch | Hash | Description |
|---|-------|------|-------------|
| - | Préchargement Inter | aa87565 | Init landing |
| 1 | Tokens étendus + Inter + a11y | 8259dcb, 3515f18 | Bascule Sora → Inter, palette --coral, accessibilité base |
| 2 | Header glassmorphism + LandingLogo | bf4d6ac, d8595c7 | Header sticky + extraction Logo |
| 3 | Hero texte | f5d6e95, 47822cf | H1 + paragraphe + CTAs |
| 4 | Phone mockup 3D + floating cards | db0ccb9 | Mockup signature + cards orbitales |
| 5 | Stats bar | 11880ca | 3 chiffres clés horizontaux |
| 6 | Steps "Comment ça marche" | 70383d9 | 3 cards 01/02/03 |
| 7 | Features bento grid 3×3 | d953c92 | Grid bento + featured card |
| 8 | Pricing avec toggle billing | 3896d51 | Mensuel/Annuel + 2 plans |
| 9 | Trust social proof institutionnelle | 43c582a | 6 wordmarks + manifesto |
| 10 | FAQ custom accordion useState | 9582bd8 | 5 Q/R sans framer-motion |
| 11 | FinalCTA + double cleanup motion/fadeUp | a6e3007 | Boucle narrative |
| 12 | Footer 4 cols + ajout id="trust" | 7414bdd | Footer marque + liens |
| 13 | Animations scroll-triggered (3 hooks) | 58a1e87 | useScrollReveal, useCountUp, useMousemoveTilt |
| 14 | Ajustements visuels Lovable v1 | 7d6859f | Hero phrase signature, Trust glow |
| 15 | Ajustements visuels Lovable v2 | a0f941b | Mobile reorder, bento featured tweaks |
| 16 | Bugs floating cards + mousemove parallax 3D | 57c8513 | Mousemove tilt ±15°, cards repositionnées |
| 17.1 | Fix translateZ floating cards | 4cd51fa | Cumul translate3d dans keyframes |
| 17.2 | Bulletin stack live | 054002c | Refonte featured bento en 3D stack |
| 17.bis | Fix useScrollReveal mount | ba4688c | Hook trigger above-the-fold au mount |
| 17.5 | Merge main → feature (pre-PR safety) | 217b426 | 106 commits main intégrés, fix --coral-600 |
| 18A | Auto-rotation bulletin + dots | 57504dc | Rotation 4500ms + 3 dots cliquables |
| 18A.bis | 3D depth shuffle + multi-card count-up | 29edcf0 | Choré séquencée 800ms + count-up par carte |
| 18B.1 | Fix WCAG AA color-contrast | 6cd97ab | Tokens --coral-700 + --ds-color-text-tertiary assombri |
| 18B.2 | Transfert v3 | `<hash 18B.2>` | docs/ELIO_TRANSFER_BATCH_18_v3.md |

## Architecture finale

### Fichiers landing
- **Welcome.tsx** : 69 lignes (orchestrateur pur, parti de 732)
- **11 composants** dans `src/components/landing/` :
  Logo, Header, Hero, Stats, Steps, Features, Pricing, Trust,
  FAQ, FinalCTA, Footer
- **3 hooks** dans `src/components/landing/hooks/` :
  - `useScrollReveal.ts` (~70 lignes) — IntersectionObserver +
    fix mount above-the-fold (Batch 17.bis)
  - `useCountUp.ts` (41 lignes) — RAF tick easeOutQuart
  - `useMousemoveTilt.ts` (66 lignes) — tilt 3D ±15° du Hero phone

### Bundle final
- CSS : ~143 kB (gzip ~24 kB)
- JS principal : 2.68 MB (gzip ~753 kB)
- Build time : ~13-26s (variation VM cloud)

### Scores Lighthouse finaux (post-Batch 18B)
- Performance : 69 (à valider en preview Lovable / staging réel —
  scores VM cloud peuvent être pessimistes : `--no-sandbox`,
  `--disable-gpu`, software rendering)
- Accessibility : **100/100** ✅ (post-fix color-contrast Batch 18B)
- SEO : 100/100 ✅
- Best Practices : 96/100 ✅
  (`errors-in-console` = artefact VM Chromium sans CA pour Google
  Fonts, faux positif. `valid-source-maps` = comportement Vite
  par défaut, hors scope landing)

## Conventions techniques établies

### Tokens design
- **Navy** : `--navy-950 #0B1929` → `--navy-50 #EDF4FA`
- **Coral** :
  - `--coral-500 #F06449` (signature ownable, UI éléments larges,
    décoratifs comme dot pulse, gradients, action cards 18px+)
  - `--coral-700 #C44528` (text-only assombri WCAG AA, ratio 4.71:1
    sur surface claire — ajouté Batch 18B)
  - `--coral-400/300/100/50` (variantes)
- **Surfaces** : `--surface-1` (#FAFAF9 warm white bg landing)
- **Texte** :
  - `--ds-color-text-inverse` (#FFFFFF — préfixe `--ds-color-` strict)
  - `--ds-color-text-primary` = `--navy-900`
  - `--ds-color-text-secondary` = `#475569`
  - `--ds-color-text-tertiary` = `#576475` (post-fix Batch 18B,
    ratio ~4.7:1 — était `#8896A6` à 2.88:1, valeur intermédiaire
    `#6B7A8D` proposée n'atteignait que 4.19:1, d'où l'assombrissement
    plus marqué)
  - **Bug récurrent à éviter** : `--text-inverse` SANS préfixe
    n'existe PAS dans le DS feature (existe côté DS main, distinct).
    Toujours utiliser `var(--ds-color-text-inverse)`.
- **Espacement grille 4px** : `--s1` 4px → `--s32` 128px
- **Radius** : `--r-sm` 8 / `--r-md` 12 / `--r-lg` 16 / `--r-xl` 20
  / `--r-2xl` 24 / `--r-pill` 9999
- **Motion** : `--ease cubic-bezier(0.16, 1, 0.3, 1)`,
  `--duration 300ms`

### CSS variables paramétrables (Bulletin stack — Batch 18A.bis)
Sur `.lp-bulletin-stack`, exposées pour itération devtools live :
- `--bulletin-rotation-duration` (0.8s)
- `--bulletin-stagger-delay` (100ms)
- `--bulletin-translate-y-mid/-deep` (-34px/-56px)
- `--bulletin-translate-z-mid/-deep` (-40px/-80px)
- `--bulletin-scale-mid/-deep` (0.93/0.86)
- `--bulletin-rotate-deep` (8deg)
- `--bulletin-ease-3d` (cubic-bezier(0.4, 0, 0.2, 1))

### Interdictions absolues
- Ne JAMAIS toucher (app-wide, hérités) : `.glass-card`, `.btn-primary`
  legacy, `.btn-secondary` legacy, `.gradient-text`, `.metric-card`,
  `.glow-sm`, `.status-*`
- Ne JAMAIS toucher aux tokens shadcn HSL (`--background`,
  `--primary`, etc. dans le bloc `:root` initial)
- Ne JAMAIS toucher aux calculation engines (`src/domain/`,
  `src/services/scoring/`, `*Engine.ts`)
- Ne JAMAIS toucher à `src/components/layout/ElioLogo.tsx`
- Ne JAMAIS modifier `src/components/ui/accordion.tsx`
- Pas de framer-motion sur la landing
  (présent globalement post-merge 17.5 pour `Agent.tsx`,
  MAIS interdit d'usage sur les composants landing
  `src/components/landing/*`)

### Workflow Claude Code
- Sessions CLOUD obligatoires : path `/home/user/...`,
  pas `/Users/...` qui force un init Git local sans credentials
- Au démarrage de session : vérifier `pwd` + branche
  `git branch --show-current`
- Phase A audit read-only → STOP → validation Jules → Phase B
  exécution avec re-greps défensifs
- Pas de plan mode, pas de Task tool / sous-agent
- Commits atomiques, push fin de batch sur la branche feature
- Pas de PR avant feu vert explicite Jules

## Wording v4 figé exhaustif (post-Batch 18B)

### Hero
- Badge pill coral (15px, pas d'icône) : "Le pro que tu n'avais
  pas les moyens de payer."
- H1 : "Combien <span class='lp-accent-text'>tu perds</span>
  chaque année sans le savoir ?"
- Paragraphe : "Élio détecte ce que tu peux récupérer en 90 secondes.
  Aides oubliées, optimisations fiscales, contrats sous-optimisés —
  **tout, sans expert-comptable.**"
- CTA primary : "Faire mon diagnostic" + ArrowRight → `/quiz`
- CTA secondary : "Comment ça marche" → `#how`
- Sous-texte : "Sans CB · Diagnostic offert · 2 minutes"

### Mockup phone Hero
- Greeting : "Aujourd'hui / Bonjour Léa"
- Action card centrale : "TU PEUX RÉCUPÉRER / 1 240 € de prime
  d'activité / Demande à faire avant le 15 mai. / Lancer la démarche →"
- Stats : "SCORE ÉLIO 72" + "RÉCUPÉRABLE 2 140 €" coral
- Floating top : "+420 € détectés" (dot vert, translateZ 50px
  pour passer au-dessus du frame 3D)
- Floating bottom : "3 aides éligibles" (dot coral, sticker bottom)

### Stats bar
- 10 Md€ : "d'aides non réclamées chaque année en France"
- 2 000 € : "récupérables en moyenne par foyer chaque année"
- 90 s : "pour faire ton diagnostic"
- Count-up animation 1500ms, easeOutQuart

### Steps "Comment ça marche"
- 3 cartes 01/02/03 verbes d'action

### Features bento (post-Batch 18A.bis)
- H2 : "Tout ce qu'il faut pour ne plus rien laisser passer."
- **Featured card "Ton bulletin quotidien"** :
  - Icône Bell coral 44×44, border 2px coral 0.40, glow ::before
  - Description : "Chaque matin, une action concrète à faire en
    moins de 60 secondes. Élio te dit quoi prioriser, sans te noyer."
  - **3 cards rotantes en stack 3D** (depth shuffle, choré
    séquencée 800ms, rotation auto 4500ms, pause hover, dots
    cliquables) :
    - **AUJOURD'HUI** : 1 240 € à récupérer en prime d'activité
      + CTA "Lancer →"
    - **DEMAIN** : +540 € détectés sur ton APL
    - **VENDREDI** : +780 € optimisables sur tes contrats
  - Count-up sur le montant à chaque première apparition en
    position hero (1 fois par carte, délai 300ms post-arrivée)
- Scanner fiscal IA (ScanLine coral)
- Détecteur d'aides (HandCoins navy)
- Calendrier prédictif (CalendarClock coral)
- Agent IA Élio (wide span-2)

### Pricing
- H2 : "Choisis ton plan"
- Toggle Mensuel/Annuel
- Découverte 0€/mois (5 bénéfices)
- Élio + 9,90€/mois ou 79€/an (7 bénéfices "Tout Découverte" en bold)
  + badge "Recommandé" gradient coral

### Trust
- H2 : "Élio s'appuie sur les sources officielles"
- Manifesto : "Aucune approximation. Aucune donnée inventée. Élio
  puise directement dans les sources officielles de l'État français
  pour te donner des informations fiables — celles qui te
  concernent vraiment."
- 6 wordmarks SVG inline currentColor : CAF / impots.gouv.fr /
  URSSAF / France Travail / service-public.fr / Insee
- Glow coral haut-droit `rgba(240,100,73,0.30)` 480px
- Fade gradient bottom 80px avec pivot 70%

### FAQ
- H2 : "Tout ce que tu te demandes avant de te lancer."
- 5 Q/R figées :
  Q1 sécurité Supabase RGPD,
  Q2 précision moteurs déterministes + promesse remboursement,
  Q3 vs Mes Aides/MCF,
  Q4 pricing,
  Q5 démarches "Tu restes toujours en contrôle"
- Accordion custom useState avec ChevronDown rotate cercle coral

### FinalCTA
- H2 : "Combien <span class='lp-accent-text'>tu perds</span>
  chaque année sans le savoir ?" (boucle narrative)
- Paragraphe : "Le diagnostic Élio te donne ton bilan en 90 secondes.
  Gratuit, sans carte bancaire, et tu sauras ce que tu peux
  récupérer immédiatement."
- CTA primary : "Faire mon diagnostic" + ArrowRight + CTA secondary
  "Voir les tarifs" → `#pricing`

### Footer
- Tagline : "Le copilote administratif et financier des Français.
  Récupère ce qui te revient en 90 secondes."
- 4 cols : Brand / Produit (#how, #features, #pricing, #faq) /
  Ressources (#trust, /blog placeholder, /glossaire placeholder,
  mailto:contact@eliotax.fr) / Légal (/legal/mentions-legales,
  /legal/confidentialite, /legal/cgu)
- Bottom : copyright dynamique + "Hébergé en France · Données
  100% sécurisées" + LinkedIn

## Dette technique connue (pour suivi post-merge)

### Critique (à investiguer en priorité post-merge)

1. **Bug Hero animation 3D au premier load** (non résolu malgré
   Batch 17.bis)
   - Symptôme : sur preview Lovable, l'animation 3D du Hero
     (mousemove parallax + floating cards) ne s'active pas au
     premier load. Aller-retour sur une autre section déclenche
     l'animation.
   - Le fix `useScrollReveal` du Batch 17.bis (check
     `getBoundingClientRect` au mount) n'a pas résolu le symptôme
     observé en validation Lovable.
   - Pistes restantes :
     - `useMousemoveTilt` mount cycle : le hook attache son
       listener `mousemove` au mount, mais peut-être que l'event
       n'est dispatché que sur premier survol → pas d'init des
       valeurs `--tilt-x`/`--tilt-y`.
     - Classe `is-leaving` du Batch 16 : appliquée au mount,
       retirée seulement au premier `mouseenter` ?
     - Cascade CSS : `data-revealed` est bien `true` au mount
       (post-fix) mais une autre classe maintient le mockup en
       état "non-actif".
   - Recommandation : ticket post-prod dédié, audit
     `useMousemoveTilt` + observer le DOM live pour voir l'état
     exact des classes au load.

### Importante (à traiter dans un batch perf dédié)

2. **Bundle JS 2.65 MB** (chunk size warning Vite pré-existant)
   - Cause : framer-motion réintroduit globalement par la refonte
     `Agent.tsx` (post-merge 17.5), embarqué dans le bundle
     principal même sur la landing qui ne l'utilise pas
   - Solution : code splitting Vite via `manualChunks` dans
     `vite.config.ts`, lazy import de toutes les routes pro qui
     dorment, dynamic import des composants lourds non critiques
     above-the-fold
   - Impact attendu : -1MB à -1.5MB sur le bundle landing

3. **`--coral-600` token orphelin** (consommé sans définition)
   - `src/components/agent/ErrorCard.tsx:61` consomme
     `var(--coral-600)` non défini ni feature ni main
   - Fix défensif Batch 17.5 : fallback inline
     `var(--coral-600, #D85535)`
   - Solution propre : ajouter `--coral-600: #D85535` dans `:root`
     du DS landing, et retirer le fallback inline. Ou mieux,
     utiliser `--coral-700 #C44528` (introduit Batch 18B) si la
     teinte convient.

### Mineure (cosmétique ou secondaire)

4. **Duplications SIGNUP_HREF/LOGIN_HREF**
   - Définies localement dans `Header.tsx` et `Hero.tsx`
   - Recommandation : factoriser dans
     `src/components/landing/constants.ts`

5. **3 `useCountUp` custom locaux ailleurs dans l'app**
   - `Stats.tsx` (Batch 13 — utilise le hook commun OK)
   - `QuizResult.tsx` et `ScoreResultStep.tsx` : closures locales
     pré-existantes, pas dans le scope landing
   - Recommandation : factoriser dans hook commun
     `src/hooks/useCountUp.ts` au niveau global

6. **Variance de hauteur cards bulletin stack**
   - AUJOURD'HUI a 4 lignes (header + amount + caption + CTA),
     DEMAIN/VENDREDI ont 3 (sans CTA)
   - Si la différence visuelle est gênante en validation utilisateurs,
     deux options :
     - `min-height` sur `.lp-bulletin-card`
     - Padding-bottom compensatoire conditionnel
   - À valider après mise en prod selon retours users

7. **Breakpoint `(max-width: 480px)` isolé**
   - 1 usage unique dans le CSS landing, hors grille Tailwind sm/md/lg
   - Acceptable mais à uniformiser si refactor responsive futur

8. **Animation Batch 4 dead code complète**
   - Tous les fragments `lp-floatUp` (sans tiret) ont été cleanup
     dans Batch 17.1 ✅

## Pattern de prompt pour reprendre un nouveau chantier post-merge

```
Hello, refactor landing Élio terminé et mergé sur main.
Je démarre un nouveau chantier sur Élio.

Contexte : repo Julito-coder/taxbuddy-buddy-43ed7c89.
Sessions Claude Code CLOUD obligatoires (path /home/user/...,
PAS /Users/... qui casse l'auth GitHub).

J'ai un fichier de transfert v3 qui résume tout l'état du projet
post-PR landing. Je le colle ci-dessous. Lis-le puis demande-moi
le scope du nouveau chantier.

[coller le contenu COMPLET de ELIO_TRANSFER_BATCH_18_v3.md]
```

## Note importante au démarrage de toute nouvelle session

- Vérifier mode cloud : `pwd` doit retourner `/home/user/...`
- Vérifier branche cible (selon le chantier en cours)
- Phase A audit read-only systématique avant Phase B
- Cleanup dette technique (section ci-dessus) en priorité
  selon disponibilité avant features nouvelles
