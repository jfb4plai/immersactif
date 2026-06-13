# ImmersActif

Application web interactive pour aider les enseignants de la Fédération Wallonie-Bruxelles à **accueillir des élèves porteurs d'un trouble du spectre de l'autisme (TSA)**.

Outil PLAI — Pôle Territorial de la Ville de Liège.

## Posture : « approcher pour ajuster », jamais « vivre comme »

Aucune simulation ne fait vivre le TSA. Le spectre est large ; il n'existe aucune expérience représentative. ImmersActif **approche certains mécanismes** vécus par *certains* élèves — surcharge sensorielle, consignes implicites, imprévisibilité — pour amener chaque enseignant à **ajuster ses gestes professionnels**.

L'app simule des **situations**, jamais une **personne** : pas de personnage-élève incarné, vocabulaire non déficitaire, avertissement éthique à l'entrée et rappel sur la fiche imprimée. Cette posture est fondée scientifiquement : les simulations de handicap mal cadrées induisent de la pitié plutôt qu'un changement de pratique (Schuhl 2020 ; Adrian 2021 — corpus RISS).

## Ce que fait l'app

- **Deux modes** : *Découverte* (une matinée narrative, les trois scènes s'enchaînent, jauge d'énergie qui ne remonte jamais, fiche finale) et *Animateur* (accès direct aux scènes, pour la formation).
- **Deux niveaux** : fondamental / secondaire (chaque scène a sa variante).
- **Trois scènes** : sensoriel, consignes implicites, imprévisibilité. Plus un **volet social en lecture** (jamais simulé, pour éviter la caricature).
- **Micro-débriefing** après chaque scène (ce que vous venez de vivre / ce que vit l'élève / ce que vous pouvez ajuster) avec gestes concrets à cocher.
- **Fiche synthèse imprimable** (split 80/20) : l'app propose, l'enseignant reformule. **L'impression est bloquée tant qu'aucun geste n'est personnalisé.**

## Garde-fous

- Aucun flash au-delà des seuils de photosensibilité (saturation visuelle par opacité/flou uniquement).
- `prefers-reduced-motion` respecté : variante descriptive des scènes.
- Bouton « sortir de la scène » permanent.
- Police Arial 16px sur les contenus (cohérence examens FWB), Inter pour l'interface.
- 100 % statique : aucune donnée d'élève, aucun compte, aucune clé API. État local (`localStorage`) uniquement.

## Références scientifiques (corpus RISS)

Toutes vérifiées dans le corpus RISS. Voir le tableau complet dans [docs/specs/2026-06-12-immersactif-design.md](docs/specs/2026-06-12-immersactif-design.md).

## Stack

React 18 · Vite 5 · Tailwind CSS v3 · Vitest · Web Audio API.

## Développement

```bash
npm install
npm run dev      # serveur de dev (Vite)
npm test         # suite Vitest
npm run build    # build de production
```

### Audio

Les quatre couches d'ambiance (`public/audio/*.wav`) sont **générées procéduralement** par `scripts/generate-audio.mjs` (domaine public par construction). Ce sont des textures sensorielles abstraites, pas des enregistrements de terrain. Pour utiliser de vrais enregistrements, remplacer les fichiers par des boucles CC0 de mêmes noms — l'app charge `public/audio/<nom>.wav` sans modification. Régénérer : `node scripts/generate-audio.mjs`.

## Déploiement

GitHub `jfb4plai/ImmersActif` (branche `main`) → Vercel → `immersactif.jfb4plai.com`. Application statique, aucune variable d'environnement requise.

## Documentation

- Design validé : [docs/specs/2026-06-12-immersactif-design.md](docs/specs/2026-06-12-immersactif-design.md)
- Plan d'implémentation : [docs/superpowers/plans/2026-06-13-immersactif.md](docs/superpowers/plans/2026-06-13-immersactif.md)
