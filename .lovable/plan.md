## Diagnostic

Tu as raison : le path n'est pas en cause. Le bouton "Compléter mon profil (2 min)" du bulletin (`BulletinEmptyState`) navigue bien vers `/profil/fiscal` (le même écran que via l'onglet Profil → Mon profil fiscal).

Le vrai bug se situe dans la **synchronisation post-quiz**.

### Chaîne de l'incident

1. Le quiz public stocke ses 5 réponses dans `localStorage` sous la clé `elio_quiz_data` (`storeQuizData`).
2. `ProtectedRoute` monte le hook `usePostAuthQuizSync` à **chaque navigation entre routes protégées**.
3. Ce hook lit `elio_quiz_data` et appelle `saveModernOnboarding(...)` qui fait un `UPDATE` sur `profiles` avec **un payload partiel issu uniquement du quiz** :
   - `full_name`, `professional_status`, `is_employee/self_employed/retired`, `is_homeowner`, `family_status`, `age_range`, `income_range`, `children_count`, `patrimony_range`, `onboarding_completed=true`, `onboarding_partial`, `onboarding_completed_at`.
4. Or, dans le payload, `full_name: data.fullName || null` et `family_status: data.familyStatus || 'single'` **écrasent** les champs riches saisis depuis `/profil/fiscal` (par ex. statut familial fin, prénom, statuts cumulés via `is_investor`, etc.).
5. Le hook s'auto-protège seulement par `useRef` → ces refs sont **réinitialisés à chaque démontage**, donc dès qu'on quitte `/bulletin` et qu'on revient, la sync rejoue.
6. Résultat : `calculateProfileCompletion(...)` recalcule à partir d'un profil amputé → retombe à ~26 %.

C'est pour ça que ça arrive surtout en passant par `/bulletin` : si l'EmptyState s'affiche, c'est typiquement un user dont le profil est encore léger → souvent celui qui a fait le quiz public récemment → `elio_quiz_data` est encore en localStorage.

### Pourquoi ce n'est pas la route

Les deux entrées (`Profil → Mon profil fiscal` et `Bulletin → Compléter mon profil`) pointent toutes les deux vers `/profil/fiscal`. La différence c'est juste qu'en passant par Bulletin on fait au moins une transition de route protégée → re-mount du `ProtectedRoute` → re-jeu de la sync.

---

## Correctifs proposés

### 1. Rendre la sync post-quiz **idempotente et non destructive**

Dans `src/hooks/usePostAuthQuizSync.ts` :

- Avant d'appeler `saveModernOnboarding`, **vérifier en DB** que `onboarding_completed = false` (via `loadOnboardingStatus`). Si l'onboarding est déjà marqué complété → ne pas re-sync, juste `clearStoredQuizData()`. Ça empêche tout rejeu une fois que l'utilisateur a un profil.
- Garder le `useRef` mais s'appuyer **prioritairement** sur l'état serveur, pas sur la mémoire de session.

### 2. Sécuriser `saveModernOnboarding` contre l'écrasement

Dans `src/lib/modernOnboardingService.ts` :

- Ne plus envoyer `full_name: data.fullName || null` : si `data.fullName` est vide, **ne pas inclure la clé** dans le payload (pattern `if (data.fullName) payload.full_name = ...`), comme le fait déjà `saveFiscalProfile`.
- Idem pour `family_status` (ne pas forcer `'single'` si déjà renseigné).
- Avant l'`UPDATE`, faire un `select` du profil existant et **ne pas écraser** les champs déjà renseignés en base avec des valeurs vides/par défaut venant du quiz. Règle : le quiz **ne complète que ce qui est encore vide**.

### 3. Nettoyer le localStorage plus tôt

- Appeler `clearStoredQuizData()` dès que la sync **a commencé** (avant le `then`), pour qu'un re-mount du `ProtectedRoute` pendant le requête en vol ne relance pas une 2e sync concurrente.
- Et bien sûr, le clear final reste après succès.

### 4. (Mineur) Empêcher la course `ProtectedRoute` × `ProfileHub`

`ProfileHub` charge le profil au mount avec `loadFiscalProfile`. Si `usePostAuthQuizSync` écrit en parallèle, on peut afficher l'ancien profil puis l'autosave réémet ces anciennes valeurs. Solution simple : dans `ProfileHub`, écouter l'événement `elio:profile-updated` (déjà émis par les deux flux) pour recharger `loadFiscalProfile` et synchroniser le state local avec la DB.

---

## Fichiers touchés

- `src/lib/modernOnboardingService.ts` — payload non destructif (skip des clés vides, fusion avec valeurs existantes).
- `src/hooks/usePostAuthQuizSync.ts` — guard `onboarding_completed` côté DB + clear du localStorage en amont.
- `src/components/fiscal-profile/ProfileHub.tsx` — listener `elio:profile-updated` pour recharger depuis la DB et éviter de réémettre des valeurs périmées via l'autosave.

Aucune migration DB nécessaire (tous les champs ciblés existent déjà sur `profiles`).

---

## Test mental

- Utilisateur fait le quiz public → atterrit sur `/auth` → se connecte → sync → profil à ~26 % (normal, on vient juste d'arriver).
- Va dans `/profil/fiscal`, ajoute son prénom, ses revenus, ses biens → autosave en DB → complétude monte à 60 %.
- Retour sur `/bulletin` (re-mount du `ProtectedRoute`).
  - **Avant** : sync rejoue, écrase, retombe à 26 %.
  - **Après** : guard `onboarding_completed=true` → sync skip → `localStorage` nettoyé → complétude reste à 60 %.
- Retour sur `/profil/fiscal` → les ajouts sont toujours là.
