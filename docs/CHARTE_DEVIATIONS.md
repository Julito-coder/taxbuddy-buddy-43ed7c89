# Charte Deviations — Élio v1.0

État permanent des écarts assumés entre la charte graphique
officielle et l'implémentation code. Chaque entrée doit être
escaladée à l'équipe Brand pour révision en charte v1.1+.

## DEV-001 · Text tertiary token

**Date** : Mai 2026 (Batch 0 dashboard refactor)
**Charte v1.0 spec** : `#6B7689` (HSL 215 16% 47%)
**Implémentation** : `#576475` (HSL 215 14% 40%)
**Raison écart** : Le token `#6B7689` ne passe pas WCAG AA body text
(ratio 4.39:1 sur cream `#FAFAF7`, seuil requis 4.5:1).

**Mesures** :
- `#6B7689` (charte) : 4.39:1 — fail
- `#576475` (impl) : 4.7:1 — pass
- `#677181` (suggestion v1.1) : 4.5:1 — pass à la limite
- `#5C6878` (suggestion v1.1) : 4.6:1 — pass

**Action escalade Brand** : proposer correction charte v1.1 vers
`#677181` ou `#5C6878` pour préserver l'esprit charte tout en
respectant WCAG AA.

## DEV-002 · --secondary shadcn token

**Date** : Mai 2026 (Batch 0 ter)
**Charte v1.0 spec** : pas de spec explicite pour le slot
shadcn `--secondary`
**Implémentation** : `213 30% 92%` (navy-pâle warm `#E5EAF1`)
**Foreground** : `213 37% 20%` (encre `#2A3F56`)

**Raison** : le slot shadcn `--secondary` est une surface neutre
tinted, pas une couleur de marque. Le mettre en coral violerait
P.02 charte (« une seule couleur d'action »). Le navy-pâle warm
respecte la fonction sémantique tout en évitant le gold legacy.

**Composants impactés** : button variant="secondary",
badge variant="secondary", progress track, slider track,
~50 usages bg-secondary/text-secondary applicatifs.
