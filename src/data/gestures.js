export const GESTURES = {
  sensory: {
    fondamental: [
      { id: 'sf1', label: "Je prévois un coin calme où l'élève peut se retirer quelques minutes" },
      { id: 'sf2', label: "Je donne la consigne au calme avant de lancer l'activité bruyante" },
      { id: 'sf3', label: "J'autorise un casque anti-bruit sans en faire un événement" },
    ],
    secondaire: [
      { id: 'ss1', label: "J'écris la consigne au tableau en plus de la dire à l'oral" },
      { id: 'ss2', label: "Je place l'élève loin des sources de bruit (couloir, radiateur)" },
      { id: 'ss3', label: "J'accorde un temps de récupération avant un contrôle" },
    ],
  },
  implicit: {
    fondamental: [
      { id: 'if1', label: 'Je formule une consigne = une action, sans sous-entendu' },
      { id: 'if2', label: "Je vérifie la compréhension en faisant reformuler, pas en demandant « c'est compris ? »" },
      { id: 'if3', label: "J'affiche les étapes de la tâche en images" },
    ],
    secondaire: [
      { id: 'is1', label: 'Je rends explicites les attentes implicites (« finir » = ranger + rendre la feuille)' },
      { id: 'is2', label: 'Je donne un exemple de réponse attendue' },
      { id: 'is3', label: "J'évite l'ironie et les expressions imagées dans les consignes" },
    ],
  },
  unforeseen: {
    fondamental: [
      { id: 'uf1', label: "J'affiche l'emploi du temps du jour et je signale les changements dès l'accueil" },
      { id: 'uf2', label: "Je préviens d'un remplaçant ou d'un changement de local à l'avance quand je le peux" },
      { id: 'uf3', label: "Je laisse un repère stable (place, rituel d'entrée) même quand le reste change" },
    ],
    secondaire: [
      { id: 'us1', label: "J'annonce le changement de local dès le début de l'heure précédente" },
      { id: 'us2', label: 'Je laisse une consigne écrite au remplaçant sur les besoins de la classe' },
      { id: 'us3', label: "Je préviens à l'avance des changements d'organisation (examens, sorties)" },
    ],
  },
}
