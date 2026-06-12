# ImmersActif — Design validé

Date : 2026-06-12
Statut : validé section par section avec JF (brainstorming complet)

## Objectif

App web interactive pour enseignants FWB (fondamental + secondaire) : approcher certains mécanismes vécus par des élèves porteurs de TSA en milieu scolaire, afin d'ajuster les gestes professionnels d'accueil et d'accompagnement. Double usage : formation animée (PLAI) et exploration autonome.

## Posture éthique (non négociable)

**"Approcher pour ajuster"** — jamais "vivre comme".

- Avertissement d'entrée non contournable : aucune simulation ne fait vivre le TSA ; cette expérience approche certains mécanismes (filtrage sensoriel, implicite, imprévisibilité) pour ajuster ses gestes professionnels.
- Justification scientifique : les simulations de handicap mal cadrées induisent de la pitié plutôt qu'un changement de pratique (Schuhl 2020, tel-03795280 ; Adrian 2021, dumas-03279190 — corpus RISS).
- On simule des **situations**, jamais une **personne** : aucun personnage-élève nommé ou incarné.
- Vocabulaire non déficitaire : des fonctionnements, pas des manques. "Certains élèves", jamais "l'élève TSA".
- Rappel éthique aux deux bouts : écran d'entrée + fiche imprimée.

## Architecture et navigation

### Écran d'entrée
1. Avertissement éthique (obligatoire).
2. Choix du niveau : **fondamental** ou **secondaire** (variante des scènes).
3. Choix du mode :
   - **Découverte** (défaut) : parcours narratif "une matinée" — 3 scènes enchaînées + micro-débriefings + fiche synthèse. Le hub se déverrouille après un premier passage complet.
   - **Animateur** : hub immédiat, accès direct aux scènes, micro-débriefings désactivables, pas de fiche imposée.

### Hub
3 cartes-scènes (sensoriel, consignes, imprévu) + 1 carte "Et les interactions sociales ?" (lecture, visuellement distincte) + accès fiche synthèse.

### Pendant une scène
Bouton "sortir de la scène" permanent — repris en débriefing : *l'élève, lui, ne peut pas sortir.*

### Persistance
`localStorage` uniquement (progression, niveau, gestes cochés, reformulations). Fallback silencieux si indisponible. Aucune donnée ne quitte le navigateur.

## Dispositif transversal : la jauge d'énergie

Visible pendant toute la matinée (mode découverte), se vide à chaque scène, ne remonte jamais. Matérialise le **cumul** — raison du choix de la structure hybride. Fin de matinée : *"Il vous reste l'après-midi."*

## Les scènes

Chaque scène existe en variante fondamental / secondaire. Structure commune : mise en situation interactive → micro-débriefing en 3 temps → gestes à cocher.

### Scène 1 — Sensoriel ("La consigne dans le bruit")
- Tâche simple à accomplir (fondamental : suivre une consigne orale ; secondaire : noter un énoncé) pendant que des couches sonores s'empilent (chaises, chuchotements, néon, couloir, sonnerie) et que le visuel se charge (reflets, mouvements périphériques). La tâche devient quasi impossible — c'est le but.
- Débriefing : particularités de **traitement** de l'information, pas déficience sensorielle (Chataignon 2023, dumas-04905925 ; Fino 2017, dumas-01562085).
- Garde-fous : avertissement volume ; **aucun flash au-dessus des seuils photosensibilité** (pas de strobe).

### Scène 2 — Consignes implicites ("J'ai fait ce que vous avez dit")
- Consignes réelles de classe ("prenez une feuille", "dépêchez-vous de finir", "on range") → l'utilisateur choisit une interprétation → sa lecture, logique, n'était pas celle attendue → il se fait reprendre.
- Débriefing nuancé : la littéralité n'est **pas systématique** (Petit 2023, tel-04575648), mais l'inférence de l'implicite a un coût permanent (Girard et al. 2022, hal-03816069 ; Durand 2018, dumas-02114337).

### Scène 3 — L'imprévu ("Le local a changé")
- L'app installe une routine (horaire visuel, repères), l'utilisateur s'appuie dessus pour anticiper → bascule : remplaçant, changement de local. Les prédictions échouent, la jauge plonge.
- Débriefing : intolérance au changement, détresse face aux transitions (critères DSM-5 repris dans le corpus RISS, p.ex. dumas-05344623).

### Volet D — Interactions sociales (évoqué, PAS simulé)
- Cartes de lecture ancrées dans le vécu réel d'élèves (Aubineau 2019, hal-02388518) + pistes d'accompagnement (Vallélian 2022, W4220658962 ; projet Passages 2024, hal-05158229).
- Choix assumé : simuler le social honnêtement est impossible sans caricature.

## Débriefing et fiche synthèse

### Micro-débriefing (après chaque scène, mode découverte)
1. *Ce que vous venez de vivre* — nommer le mécanisme, avec sa nuance scientifique.
2. *Ce que vit l'élève* — il ne peut ni sortir ni baisser le volume, et recommence chaque jour.
3. *Ce que vous pouvez ajuster* — 3 à 5 gestes concrets à cocher, formulés en gestes de classe ("j'annonce le changement de local dès l'accueil"), pas en principes.

### Fiche synthèse (split 80/20)
- Assemble les gestes cochés (80 %). Chaque geste est **éditable**.
- Champ obligatoire par geste retenu : *"Pour ma classe, concrètement…"* — **impossible d'imprimer sans au moins une reformulation personnelle**.
- Impression CSS print A4 (logo PLAI, Arial), `window.print()` — pas de librairie PDF.
- La fiche inclut les références RISS et le rappel éthique.
- Encart final : renvoi vers ressources PLAI et aménagements universels.

## Accessibilité

- Arial 16px min pour les contenus, Inter pour l'interface (compromis branding validé) ; Arial dans la fiche imprimable.
- Contrastes AA, navigation clavier complète, pas de mur de texte, feedback visuel clair.
- `prefers-reduced-motion` respecté : variante **descriptive** des scènes (l'expérience racontée plutôt que subie).
- Avertissements par scène (volume, mouvement) + bouton sortie permanent.

## Références RISS validées (conception)

| Mécanisme | Référence | ID RISS |
|---|---|---|
| Éthique simulations / pitié | Schuhl 2020 | tel-03795280 |
| Sensibilisation par simulation | Adrian 2021 | dumas-03279190 |
| Traitement sensoriel | Chataignon 2023 | dumas-04905925 |
| Traitement sensoriel | Fino 2017 | dumas-01562085 |
| Particularités sensorielles | Dubreuil 2019 | dumas-02178074 |
| Littéralité nuancée | Petit 2023 | tel-04575648 |
| Langage figuré / inférences | Girard et al. 2022 | hal-03816069 |
| Actes indirects de langage | Durand 2018 | dumas-02114337 |
| Routines / DSM-5 | Braida-Bardinaud 2025 | dumas-05344623 |
| Vécu élèves TSA secondaire | Aubineau 2019 | hal-02388518 |
| Habiletés sociales | Vallélian 2022 | W4220658962 |
| Accompagnement social | Projet Passages 2024 | hal-05158229 |
| Outils numériques inclusion TSA | Meyer et al. 2022 | hal-03900700 |

**Règle** : chaque affirmation affichée dans l'app fera l'objet d'une vérification RISS individuelle à la rédaction des contenus. La base ci-dessus couvre la conception.

## Stack et déploiement

- React 18 + Vite 5 + Tailwind v3 (fix config : tailwind.config.js + postcss.config.js avec import.meta.url).
- 100 % statique : pas de Supabase, pas d'IA, pas de clé API, pas de compte.
- Audio : fichiers d'ambiance courts en boucle, mixés en couches via Web Audio API (gain par couche pour la montée progressive). Démarrage après geste utilisateur (bouton "entrer dans la scène"). Budget < 2 Mo total. Provenance : sons libres CC0 (freesound.org ou équivalent), complétés si besoin par synthèse Web Audio (néon, sonnerie) — aucun son sous licence restrictive.
- Dossier : `claude-workspace/immersactif`. Repo GitHub `jfb4plai/ImmersActif` (créé dès le début), branche `main`. Vercel → `immersactif.jfb4plai.com`.
- Branding : teal #0a9370, orange #f97316, logo /plai-logo.jpg.

## Tests

- Vitest : jauge d'énergie, progression/déverrouillage du hub, assemblage de la fiche, blocage d'impression sans personnalisation, fallback localStorage.
- Scènes : vérification manuelle navigateur (audio, montée sensorielle, reduced-motion).
- Build check local avant chaque push.

## Hors scope (v1)

- Simulation des interactions sociales (volet D = lecture uniquement).
- Comptes, statistiques d'usage, sauvegarde serveur.
- Personnalisation des scènes par IA.
- Version mobile optimisée (cible : projection + laptop ; le responsive de base suffit en v1).
