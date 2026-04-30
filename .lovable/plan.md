## Plan de correction

1. **Bloquer le débordement global sur la page Agent**
   - Faire en sorte que le wrapper `/agent` occupe exactement la largeur disponible (`min-w-0`, `w-full`, `max-w-full`) sans utiliser une largeur qui peut dépasser le viewport mobile.
   - Ajouter une isolation de scroll horizontal uniquement sur les éléments qui doivent vraiment défiler.

2. **Corriger le layout parent qui dépasse sur mobile**
   - Adapter `AppLayout` pour que le halo décoratif `w-[600px]` ne crée plus de largeur de document supérieure au viewport sur mobile.
   - Encapsuler/masquer le débordement horizontal au niveau du contenu principal, sans casser le desktop.

3. **Rendre les 3 bulles réellement slidables sans faire bouger l’écran**
   - Garder le scroll horizontal dans `ContextualChips`, mais le contenir strictement dans la largeur de la page.
   - Ajouter `touch-action: pan-x`, `overscroll-behavior-x: contain`, `max-w-full`, et un inner strip en `w-max` pour que seul le rail des bulles défile.

4. **Sécuriser les cartes mobiles**
   - Ajouter `min-w-0` sur la grille et les cartes d’actions pour éviter qu’un texte long force la largeur.
   - S’assurer que les labels se coupent proprement si nécessaire.

5. **Vérifier à 390px mobile**
   - Recontrôler visuellement `/agent` sur viewport mobile : plus de barre horizontale de page, mais les bulles restent swipeables.