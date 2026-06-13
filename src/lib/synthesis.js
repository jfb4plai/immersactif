export function buildSheet(selectedGestures) {
  const items = Object.entries(selectedGestures).map(([id, g]) => ({
    id,
    label: g.label,
    personalization: g.personalization ?? '',
  }))
  const personalizedCount = items.filter((i) => i.personalization.trim().length > 0).length
  return { items, personalizedCount }
}

export function canPrint(selectedGestures) {
  return Object.values(selectedGestures).some(
    (g) => (g.personalization ?? '').trim().length > 0
  )
}
