const LIMITS = [
  {
    t: 'Il ne diagnostique pas',
    d: `Ressentir une scène ne dit rien d'un élève en particulier. Seuls des professionnels posent un diagnostic.`,
  },
  {
    t: `Il n'est pas représentatif de tous`,
    d: `Le spectre est large : chaque profil est individuel (hyper- et/ou hypo-sensibilité, intérêts, besoins). Aucune simulation ne vaut pour « les élèves TSA » en général.`,
  },
  {
    t: `Il ne remplace ni l'élève, ni la famille, ni l'équipe`,
    d: `Les meilleurs aménagements se construisent avec l'élève et l'équipe pluridisciplinaire (PIA), pas seul devant un écran.`,
  },
  {
    t: 'Il approche, il ne reproduit pas',
    d: `L'expérience approche certains mécanismes. Se dire « maintenant je sais ce que c'est » serait une erreur — et un piège connu de la recherche.`,
  },
  {
    t: 'Les gestes sont des pistes, pas des recettes',
    d: `Chaque aménagement est à individualiser avec l'élève, et à poser discrètement pour ne pas stigmatiser.`,
  },
]

export function LimitsPanel({ onBack }) {
  return (
    <section className="mx-auto max-w-3xl space-y-4 p-4">
      <h2 className="text-xl font-semibold">Ce que cet outil ne fait pas</h2>
      <div className="grid gap-3">
        {LIMITS.map((l, i) => (
          <article key={i} className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4">
            <h3 className="font-semibold">{l.t}</h3>
            <p className="read mt-1">{l.d}</p>
          </article>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Repères : éthique des simulations — Schuhl (2020) ; profils individuels — Moutai (2025) ; une
        aide mal posée peut stigmatiser — Aubert Michel (2024).
      </p>
      <button onClick={onBack} className="rounded-lg border border-slate-300 px-4 py-2">
        Retour
      </button>
    </section>
  )
}
