import { CAT_META } from '../data/gestures'

// Tag for a gesture: its reasonable-accommodation category, plus an optional
// "benefits the whole class" (CUA) badge.
export function CatChip({ cat, cua }) {
  const m = CAT_META[cat]
  if (!m) return null
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${m.color}`}>{m.label}</span>
      {cua && (
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
          Aide toute la classe
        </span>
      )}
    </span>
  )
}
