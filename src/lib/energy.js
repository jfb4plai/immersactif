// Drain amounts sum to 90 so the matinée ends "low/critical" but not at 0,
// reinforcing the closing line "Il vous reste l'après-midi."
export const SCENE_DRAIN = {
  sensory: 30,
  implicit: 20,
  context: 15,
  unforeseen: 25,
}

export function energyBand(energy) {
  if (energy <= 25) return { key: 'critical', label: 'Épuisement', color: 'bg-red-500' }
  if (energy <= 60) return { key: 'low', label: 'En tension', color: 'bg-amber-500' }
  return { key: 'ok', label: 'Disponible', color: 'bg-plai-teal' }
}
