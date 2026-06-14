export const SCENES = {
  sensory: {
    title: 'La consigne dans le bruit',
    recap: "Sans filtre sensoriel, une consigne simple peut devenir inaccessible quand le bruit monte.",
    refs: ['chataignon2023', 'fino2017', 'dubreuil2019'],
    debrief: {
      lived: "Vous deviez accomplir une tâche simple pendant que les bruits s'empilaient. Pour certains élèves, ces informations sensorielles arrivent sans filtre : ce n'est pas un problème d'audition, mais un traitement différent des informations.",
      student: "Vous pouviez baisser le son et sortir de la scène. L'élève, lui, reçoit cela toute la journée et recommence le lendemain.",
      adjust: 'Quelques gestes qui réduisent la charge sans stigmatiser :',
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
  },
}
