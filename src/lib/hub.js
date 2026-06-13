export const SCENE_ORDER = ['sensory', 'implicit', 'unforeseen']

export function isHubAvailable({ mode, completedScenes }) {
  if (mode === 'animateur') return true
  return SCENE_ORDER.every((s) => completedScenes.includes(s))
}

export function nextNarrativeScene(completedScenes) {
  return SCENE_ORDER.find((s) => !completedScenes.includes(s)) ?? null
}
