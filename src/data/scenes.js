export const SCENES = {
  sensory: {
    title: 'La consigne dans le bruit',
    recap: "Sans filtre sensoriel, une consigne simple peut devenir inaccessible quand le bruit monte.",
    refs: ['chataignon2023', 'fino2017', 'dubreuil2019', 'moutai2025'],
    debrief: {
      lived: "Vous deviez accomplir une tâche simple pendant que les bruits s'empilaient. Pour certains élèves, ces informations sensorielles arrivent sans filtre : ce n'est pas un problème d'audition, mais un traitement différent des informations.",
      student: "Vous pouviez baisser le son et sortir de la scène. L'élève, lui, reçoit cela toute la journée et recommence le lendemain.",
      adjust: 'Quelques gestes qui réduisent la charge sans stigmatiser :',
    },
    // Anti-caricature: hyper- n'est pas la seule possibilité (profils individuels).
    nuance:
      "Tous les élèves concernés ne sont pas hypersensibles : certains sont au contraire hypo-sensibles et recherchent la stimulation. Un même élève peut combiner les deux. Le profil sensoriel s'observe, il ne se devine pas.",
    accommodation: {
      changes: [
        "La consigne est écrite au tableau, en plus d'être dite à l'oral.",
        "Un casque anti-bruit reste disponible, sans en faire un événement.",
        "Un court temps au calme est possible avant la tâche.",
      ],
      relief:
        "La consigne ne dépend plus de la seule oreille : elle reste lisible, et le bruit n'efface plus l'information.",
      refs: ['bartuccio2025', 'hubert2015'],
    },
  },
  implicit: {
    title: "J'ai fait ce que vous avez dit",
    recap: "Une consigne « claire » peut cacher des attentes implicites, coûteuses à décoder en continu.",
    refs: ['petit2023', 'girard2022', 'durand2018'],
    debrief: {
      lived: "Vos interprétations étaient logiques, mais ce n'était pas l'attendu implicite. La compréhension littérale n'est pas systématique chez les élèves concernés ; en revanche, inférer l'implicite a un coût permanent.",
      student: 'Être repris alors qu\'on a « fait ce qui était dit » use la confiance, jour après jour.',
      adjust: "Rendre l'implicite explicite, sans infantiliser :",
    },
    nuance:
      "La lecture littérale n'est ni systématique ni permanente : elle varie d'un élève à l'autre et selon le contexte. L'enjeu n'est pas « l'élève comprend mal » mais « la consigne est ambiguë ».",
    accommodation: {
      changes: [
        "La consigne est rendue explicite : « Sortez vos cahiers de votre sac et posez-les sur le banc. »",
        "Un exemple de ce qui est attendu est donné.",
        "On vérifie la compréhension en faisant reformuler.",
      ],
      relief:
        "L'ambiguïté disparaît : l'élève sait exactement quoi faire, sans avoir à deviner le sous-entendu.",
      refs: ['durand2018', 'petit2023'],
    },
  },
  unforeseen: {
    title: 'Le local a changé',
    recap: "Un imprévu non annoncé fait s'effondrer les repères et coûte cher sur le plan cognitif.",
    refs: ['braida2025'],
    debrief: {
      lived: "Vous vous étiez appuyé sur la routine pour anticiper, puis tout a basculé. L'imprévu a un coût cognitif élevé et peut provoquer une réelle détresse face aux transitions.",
      student: "Ce que vous venez de ressentir une fois peut se rejouer à chaque changement non annoncé.",
      adjust: 'Rendre le déroulé prévisible :',
    },
    nuance:
      "L'intensité de la réaction à l'imprévu varie selon l'élève, et certains la masquent. L'absence de réaction visible ne signifie pas l'absence de coût.",
    accommodation: {
      changes: [
        "Le changement est annoncé à l'avance, dès que possible.",
        "Il est affiché sur un emploi du temps visuel.",
        "Un repère stable est maintenu (place, rituel d'entrée).",
      ],
      relief: "L'imprévu redevient prévu : l'élève peut anticiper, et le repère tient.",
      refs: ['barany2018', 'hubert2015'],
    },
  },
}
