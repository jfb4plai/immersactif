export const IMPLICIT_ITEMS = {
  fondamental: [
    {
      instruction: '« Sortez vos cahiers. »',
      literal: 'Je prends mes cahiers et je sors de la classe avec.',
      expected: 'Sortir les cahiers de son cartable et les poser sur le banc.',
      reframe:
        "« Sortez » a deux sens : faire sortir un objet… ou quitter la pièce. L'élève n'a pas désobéi : il a choisi une lecture parfaitement logique du mot.",
    },
    {
      instruction: '« Prenez une feuille. »',
      literal: 'Je prends une feuille et j\'attends.',
      expected: 'Prendre une feuille, écrire son nom et la date, et commencer.',
      reframe: "La consigne ne disait rien de tout cela : l'attendu était implicite.",
    },
    {
      instruction: '« On range. »',
      literal: 'Je range ma trousse.',
      expected: 'Tout ranger, se taire, et se mettre en rang.',
      reframe: 'Le « on range » contenait une suite d\'actions non dites.',
    },
  ],
  secondaire: [
    {
      instruction: '« Sortez vos cahiers. »',
      literal: 'Je prends mes cahiers et je sors de la classe avec.',
      expected: 'Sortir les cahiers de son sac et les poser sur le banc.',
      reframe:
        "« Sortez » a deux sens : faire sortir un objet… ou quitter la pièce. L'élève n'a pas désobéi : il a choisi une lecture parfaitement logique du mot.",
    },
    {
      instruction: '« Dépêchez-vous de finir. »',
      literal: 'J\'écris plus vite la phrase en cours.',
      expected: 'Terminer l\'exercice, rendre la feuille et se tenir prêt à changer d\'activité.',
      reframe: "« Finir » recouvrait plusieurs attentes non formulées.",
    },
    {
      instruction: '« Mettez-vous par groupes. »',
      literal: 'J\'attends qu\'on me dise avec qui.',
      expected: 'Se lever, choisir/rejoindre un groupe et s\'organiser seul.',
      reframe: 'Les règles sociales du regroupement étaient implicites.',
    },
  ],
}
