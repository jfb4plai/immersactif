// Extraits de conversation typiques d'un livre pour enfants (priorité M3 / P1-P2).
// Hors contexte, chaque séquence s'interprète tout autrement : la première lecture,
// logique détail par détail, est renversée dès que le cadre global est donné.
// Illustre la désambiguïsation par le contexte et la faiblesse de cohérence centrale.
// Chaque item : les répliques (lines), 3 questions dont la réponse spontanée sera
// probablement fausse (questions), et le contexte qui renverse tout (context).
const ITEMS = [
  {
    id: 'bonhomme',
    lines: [
      "— On le laisse vraiment tout seul dehors, toute la nuit ?",
      "— Oui. De toute façon, demain matin, il aura sûrement disparu.",
      "— Mais il va être tout mouillé !",
      "— C'est normal. C'est ce qui arrive quand le soleil revient.",
    ],
    questions: [
      {
        q: "Qui est laissé dehors cette nuit ?",
        spontaneous: "Un animal, un enfant — quelqu'un de vivant.",
        real: "Un bonhomme de neige. Pas un être vivant.",
      },
      {
        q: "Pourquoi va-t-il « disparaître » demain matin ?",
        spontaneous: "Il va partir, s'enfuir, on va le perdre.",
        real: "Il va fondre : la neige, avec le redoux.",
      },
      {
        q: "Que ressentent les deux personnages ?",
        spontaneous: "De l'inquiétude, de la tristesse : ils abandonnent quelqu'un.",
        real: "Rien de tout cela — ils ont simplement fini leur bonhomme.",
      },
    ],
    context: "Léa et son papa viennent de terminer leur bonhomme de neige. Ce soir, il fait déjà plus doux.",
  },
  {
    id: 'bulbe',
    lines: [
      "— On l'a mis dans un trou, et on a remis la terre par-dessus.",
      "— Mais il fait tout noir, là-dessous !",
      "— Je sais. Mais c'est ce qu'il faut faire.",
      "— Et il va rester là tout seul ?",
      "— Tout l'hiver. On ne peut pas faire autrement.",
    ],
    questions: [
      {
        q: "Qu'est-ce qu'on a mis dans le trou ?",
        spontaneous: "Un animal mort, quelqu'un — on enterre quelque chose.",
        real: "Un bulbe de tulipe : quelque chose de vivant, qu'on plante.",
      },
      {
        q: "Pourquoi le laisse-t-on sous la terre tout l'hiver ?",
        spontaneous: "Parce qu'il est mort, pour s'en séparer.",
        real: "Pour qu'il fleurisse au printemps ; le froid de l'hiver lui est nécessaire.",
      },
      {
        q: "Quel est le sentiment de la scène ?",
        spontaneous: "Triste, grave : un deuil, un enterrement.",
        real: "Plein d'attente et d'espoir : on jardine, on attend une fleur.",
      },
    ],
    context: "Jade et son papi viennent de planter un bulbe de tulipe dans le jardin.",
  },
]

// Les extraits, de style « livre pour enfants », visent M3 / P1-P2 (fondamental).
// Ils fonctionnent tels quels comme démonstration pour l'enseignant, quel que soit
// le niveau : la scène partage donc le même matériel pour les deux niveaux en v1.
// (Des extraits spécifiques au secondaire pourront être ajoutés ultérieurement.)
export const CONTEXT_ITEMS = {
  fondamental: ITEMS,
  secondaire: ITEMS,
}
