// Doubles sens et actes de langage indirects entendus en classe.
// Chaque item : la consigne (instruction), la réaction littérale possible de l'élève
// (reaction), et l'explication du double sens (why) révélée après que l'enseignant
// a formulé son hypothèse.
const ITEMS = (cartable) => [
  {
    instruction: '« Sortez vos cahiers. »',
    reaction: 'L\'élève prend ses cahiers et se dirige vers la porte pour sortir de la classe.',
    why: '« Sortez » a deux sens : faire sortir un objet… ou quitter la pièce. L\'élève n\'a pas désobéi : il a choisi une lecture parfaitement logique du mot.',
  },
  {
    instruction: '« Tu peux me passer la colle ? »',
    reaction: 'L\'élève répond « oui »… et ne bouge pas.',
    why: 'C\'est une demande déguisée en question. Pris au mot, l\'élève répond simplement à ce qui est demandé : oui, il en est capable.',
  },
  {
    instruction: '« Mets ça au propre. »',
    reaction: 'L\'élève cherche un mouchoir pour nettoyer sa feuille tachée.',
    why: '« Au propre » signifie « recopie soigneusement », mais le mot « propre » renvoie aussi à la propreté. Les deux lectures se valent.',
  },
  {
    instruction: '« Va au tableau. »',
    reaction: 'L\'élève se lève, va se placer devant le tableau… et attend, sans rien faire.',
    why: '« Aller au tableau » est un code scolaire : venir faire l\'exercice devant la classe. Littéralement, la consigne demande seulement de s\'y rendre.',
  },
  {
    instruction: '« Tu me suis ? »',
    reaction: `L'élève se lève pour suivre l'enseignant, ${cartable} à la main.`,
    why: '« Suivre » veut dire ici « comprendre », mais désigne aussi se déplacer derrière quelqu\'un. Sans le sens figuré, le mot est pris au pied de la lettre.',
  },
]

export const IMPLICIT_ITEMS = {
  fondamental: ITEMS('cartable'),
  secondaire: ITEMS('sac'),
}
