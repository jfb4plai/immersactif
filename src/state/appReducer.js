export const initialState = {
  consentEthics: false,
  level: null,
  mode: null,
  energy: 100,
  completedScenes: [],
  hubUnlocked: false,
  selectedGestures: {},
}

export function appReducer(state, action) {
  switch (action.type) {
    case 'ACK_ETHICS':
      return { ...state, consentEthics: true }
    case 'SET_LEVEL':
      return { ...state, level: action.level }
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
        hubUnlocked: action.mode === 'animateur' ? true : state.hubUnlocked,
      }
    case 'DRAIN_ENERGY': {
      if (action.amount <= 0) return state
      return { ...state, energy: Math.max(0, state.energy - action.amount) }
    }
    case 'COMPLETE_SCENE':
      return state.completedScenes.includes(action.scene)
        ? state
        : { ...state, completedScenes: [...state.completedScenes, action.scene] }
    case 'TOGGLE_GESTURE': {
      const next = { ...state.selectedGestures }
      if (next[action.id]) {
        delete next[action.id]
      } else {
        next[action.id] = { label: action.label, personalization: '' }
      }
      return { ...state, selectedGestures: next }
    }
    case 'SET_PERSONALIZATION': {
      const g = state.selectedGestures[action.id]
      if (!g) return state
      return {
        ...state,
        selectedGestures: {
          ...state.selectedGestures,
          [action.id]: { ...g, personalization: action.text },
        },
      }
    }
    case 'RESET_ENERGY':
      return { ...state, energy: 100 }
    case 'RESET_RUN':
      // Fresh parcours: refill energy and clear progress (keeps selected gestures).
      return { ...state, energy: 100, completedScenes: [] }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
