const SCENES = [
  {
    title: 'La consigne dans le bruit',
    note: 'casque recommandé',
    desc: 'Filtrage sensoriel : consigne orale dans un environnement bruyant qui monte progressivement.',
  },
  {
    title: "J'ai fait ce que vous avez dit",
    note: '',
    desc: "Implicite langagier : des consignes ambiguës interprétées à la lettre, sans malveillance.",
  },
  {
    title: 'Le local a changé',
    note: '',
    desc: "Imprévisibilité : rupture d'une routine automatisée, sans annonce préalable.",
  },
]

const FLOW = [
  "Choisissez votre niveau (fondamental / secondaire) — les exemples s'adaptent.",
  "Mode Découverte : les 3 scènes s'enchaînent, avec une jauge d'énergie qui descend au fil de la matinée.",
  "Chaque scène se termine par la même situation avec aménagements simples : ressentir la différence.",
  "Débriefing : ancrer ce que vous venez de vivre, choisir 1 à 3 gestes à tester.",
  "Après les 3 scènes : accès au parcours complet et à votre fiche de gestes imprimable.",
]

const ANIM = [
  "Mode Animateur : accès direct à chaque scène, sans ordre imposé.",
  "Lancer la scène sur grand écran — sans expliquer à l'avance ce qui va se passer.",
  "Discussion ouverte après : « Qu'avez-vous ressenti ? Qu'attendiez-vous ? »",
  "Montrer la situation avec aménagements, puis débriefing collectif.",
  "Engagement individuel : chaque participant complète sa propre fiche de gestes.",
]

export function GuidePanel({ onBack }) {
  return (
    <section className="mx-auto max-w-3xl space-y-6 p-4 print:p-0">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold">Mode d'emploi</h2>
        <span className="shrink-0 rounded border border-slate-200 px-3 py-1 text-sm text-slate-500">
          35 – 45 min · 3 scènes
        </span>
      </div>

      {/* Objectif */}
      <div className="rounded-lg border border-plai-teal bg-teal-50 p-4">
        <p className="read text-sm">
          ImmersActif propose 3 situations simulées pour <strong>approcher</strong> certains mécanismes
          vécus par des élèves porteurs de TSA. L'objectif n'est pas de « savoir ce que c'est » —
          c'est de choisir des <strong>gestes professionnels concrets</strong> à tester en classe.
        </p>
      </div>

      {/* Pourquoi cet outil — ancrage RISS */}
      <section className="space-y-2">
        <h3 className="font-semibold">Pourquoi cet outil ?</h3>
        <p className="read text-sm text-slate-700">
          Plus de 95 % des enseignants déclarent n'avoir reçu aucune formation sur le TSA (Dhahri, 2025).
          La recherche reconnaît la sensibilisation aux mécanismes vécus par l'élève comme un levier du
          changement de pratiques (Hubert, 2015 ; Burtz, 2022). Comprendre <em>pourquoi</em> un geste
          simple — écrire la consigne au tableau, annoncer un changement à l'avance — change quelque
          chose, c'est ce qui rend l'aménagement durable.
        </p>
        <p className="read text-sm text-slate-500">
          ImmersActif ne remplace pas une formation spécialisée. Il propose un point d'entrée
          expérientiel, ancré dans les mécanismes documentés, pour que les gestes choisis aient un sens.
        </p>
      </section>

      {/* Les 3 scènes */}
      <section className="space-y-2">
        <h3 className="font-semibold">Les 3 situations</h3>
        <ol className="space-y-2">
          {SCENES.map((s, i) => (
            <li key={i} className="rounded border border-slate-200 p-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold">{i + 1}. {s.title}</span>
                {s.note && (
                  <span className="text-xs text-amber-700 border border-amber-300 rounded px-1.5 py-0.5">
                    {s.note}
                  </span>
                )}
              </div>
              <p className="read mt-1 text-sm text-slate-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Usage solo */}
      <section className="space-y-2">
        <h3 className="font-semibold">Utilisation en autonomie</h3>
        <ol className="space-y-1.5 pl-4">
          {FLOW.map((step, i) => (
            <li key={i} className="read text-sm text-slate-700">
              <span className="font-semibold text-plai-teal mr-1">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
        <p className="read text-xs text-slate-500 pt-1">
          Vos sélections de gestes sont sauvegardées localement dans le navigateur.
          Aucune connexion requise après le premier chargement.
        </p>
      </section>

      {/* Usage formation */}
      <section className="space-y-2">
        <h3 className="font-semibold">Utilisation en formation</h3>
        <p className="read text-sm text-slate-500">Durée suggérée : 15 – 20 min par scène en groupe.</p>
        <ol className="space-y-1.5 pl-4">
          {ANIM.map((step, i) => (
            <li key={i} className="read text-sm text-slate-700">
              <span className="font-semibold text-plai-teal mr-1">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Posture */}
      <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4">
        <p className="read text-sm">
          <strong>Posture : « approcher pour ajuster »</strong>, jamais « je sais maintenant ce que c'est ».
          Les meilleurs aménagements se construisent avec l'élève, la famille et l'équipe — pas seul devant un écran.
        </p>
      </div>

      <p className="read text-xs text-slate-400">
        Repères RISS : Dhahri (2025, tel-05405230) — formation insuffisante des enseignants au TSA ;
        Hubert (2015, dumas-01169754) — sensibilisation comme levier du changement de pratiques ;
        Burtz (2022, dumas-03884951) — vécu scolaire TSA et nécessité d'adaptation ;
        Nivet (2016, dumas-01579221) — gestes professionnels en contexte d'inclusion autisme.
      </p>

      <div className="flex gap-3 print:hidden">
        <button onClick={onBack} className="rounded-lg border border-slate-300 px-4 py-2">
          Retour
        </button>
        <button
          onClick={() => window.print()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600"
        >
          Imprimer
        </button>
      </div>
    </section>
  )
}
