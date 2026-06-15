// Catégories d'aménagements raisonnables (typologie administrative FWB —
// réglementaire, hors corpus RISS). `cua: true` = bénéficie à toute la classe
// (conception universelle de l'apprentissage — RISS : Bartuccio 2025).
export const CAT_META = {
  materiel: { label: 'Matériel', color: 'bg-sky-100 text-sky-800' },
  organisationnel: { label: 'Organisationnel', color: 'bg-violet-100 text-violet-800' },
  pedagogique: { label: 'Pédagogique', color: 'bg-teal-100 text-teal-800' },
}

export const GESTURES = {
  sensory: {
    fondamental: [
      { id: 'sf1', label: "Je prévois un coin calme où l'élève peut se retirer quelques minutes", cat: 'organisationnel' },
      { id: 'sf2', label: "Je donne la consigne au calme avant de lancer l'activité bruyante", cat: 'pedagogique', cua: true },
      { id: 'sf3', label: "J'autorise un casque anti-bruit sans en faire un événement", cat: 'materiel' },
    ],
    secondaire: [
      { id: 'ss1', label: "J'écris la consigne au tableau en plus de la dire à l'oral", cat: 'pedagogique', cua: true },
      { id: 'ss2', label: "Je place l'élève loin des sources de bruit (couloir, radiateur)", cat: 'organisationnel' },
      { id: 'ss3', label: "J'accorde un temps de récupération avant un contrôle", cat: 'organisationnel' },
    ],
  },
  implicit: {
    fondamental: [
      { id: 'if1', label: 'Je formule une consigne = une action, sans sous-entendu', cat: 'pedagogique', cua: true },
      { id: 'if2', label: "Je vérifie la compréhension en faisant reformuler, pas en demandant « c'est compris ? »", cat: 'pedagogique', cua: true },
      { id: 'if3', label: "J'affiche les étapes de la tâche en images", cat: 'materiel', cua: true },
    ],
    secondaire: [
      { id: 'is1', label: 'Je rends explicites les attentes implicites (« finir » = ranger + rendre la feuille)', cat: 'pedagogique', cua: true },
      { id: 'is2', label: 'Je donne un exemple de réponse attendue', cat: 'pedagogique', cua: true },
      { id: 'is3', label: "J'évite l'ironie et les expressions imagées dans les consignes", cat: 'pedagogique' },
    ],
  },
  unforeseen: {
    fondamental: [
      { id: 'uf1', label: "J'affiche l'emploi du temps du jour et je signale les changements dès l'accueil", cat: 'organisationnel', cua: true },
      { id: 'uf2', label: "Je préviens d'un remplaçant ou d'un changement de local à l'avance quand je le peux", cat: 'organisationnel' },
      { id: 'uf3', label: "Je laisse un repère stable (place, rituel d'entrée) même quand le reste change", cat: 'organisationnel' },
    ],
    secondaire: [
      { id: 'us1', label: "J'annonce le changement de local dès le début de l'heure précédente", cat: 'organisationnel', cua: true },
      { id: 'us2', label: 'Je laisse une consigne écrite au remplaçant sur les besoins de la classe', cat: 'organisationnel' },
      { id: 'us3', label: "Je préviens à l'avance des changements d'organisation (examens, sorties)", cat: 'organisationnel', cua: true },
    ],
  },
}

// Flat lookup id -> gesture (the synthesis sheet only stores ids).
export const GESTURE_INDEX = Object.values(GESTURES)
  .flatMap((byLevel) => Object.values(byLevel).flat())
  .reduce((acc, g) => ((acc[g.id] = g), acc), {})
