# ImmersActif Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 100% static React web app that lets FWB teachers approach three mechanisms experienced by some students with ASD (sensory overload, implicit instructions, unpredictability) in order to adjust their professional practice — never to "experience autism".

**Architecture:** Single-page React app. A pure logic layer (reducer + helper modules) is unit-tested with Vitest. A Web Audio layered mixer drives the sensory scene. State persists to `localStorage` with a silent fallback. Output is a printable A4 synthesis sheet built from teacher-selected, teacher-personalized gestures (80/20 split). No backend, no API keys, no accounts.

**Tech Stack:** React 18, Vite 5, Tailwind CSS v3, Vitest + @testing-library/react, Web Audio API, `window.print()` + CSS print media.

---

## Reference documents

- Validated spec: `docs/specs/2026-06-12-immersactif-design.md`
- Session thread: `../memory/immersactif-session-prompt.md` (workspace memory)

## Ethical guardrails (apply to ALL content tasks)

These are not optional and must be respected in every string written into the app:

- "Approcher pour ajuster", jamais "vivre comme".
- On simule des **situations**, jamais une **personne**. Aucun personnage-élève nommé/incarné.
- Vocabulaire non déficitaire : décrire des fonctionnements, pas des manques. "Certains élèves", jamais "l'élève TSA".
- **Toute affirmation scientifique affichée dans l'app doit être vérifiée individuellement via `mcp__RISS__search_articles` au moment de la rédaction du contenu.** La base de conception (tableau du spec) couvre l'architecture, pas chaque phrase.

## File structure

```
immersactif/
  package.json
  vite.config.js                 # Vite + Vitest config (jsdom)
  tailwind.config.js             # branding colors, import.meta.url fix
  postcss.config.js              # import.meta.url fix
  index.html
  public/
    plai-logo.jpg                # copied from existing PLAI asset
    audio/                       # CC0 loops (chairs, whispers, corridor, bell)
  src/
    main.jsx                     # React root
    index.css                    # Tailwind directives + base + @media print
    App.jsx                      # top-level orchestration / view switch
    state/
      useLocalStorage.js         # persistence hook w/ fallback   [TDD]
      appReducer.js              # pure reducer + initial state    [TDD]
      AppStateContext.jsx        # context provider wiring reducer + persistence
    lib/
      energy.js                  # pure energy drain logic         [TDD]
      hub.js                     # hub unlock logic                [TDD]
      synthesis.js               # sheet assembly + print gate     [TDD]
    data/
      references.js              # RISS references registry
      gestures.js                # gestures per scene (both levels)
      scenes.js                  # scene metadata + debrief copy
      socialCards.js             # volet D reading cards
    audio/
      AudioEngine.js             # Web Audio layered mixer         [TDD: gain logic]
      useAudioLayers.js          # React hook around AudioEngine
    components/
      EthicalBanner.jsx          # reusable ethics reminder
      EntryScreen.jsx            # warning + level + mode          [RTL test]
      Hub.jsx                    # scene cards + lock state
      EnergyGauge.jsx            # transversal gauge display
      SceneShell.jsx             # gauge + permanent exit + chrome
      MicroDebrief.jsx           # 3-step debrief + gesture checkboxes
      SynthesisSheet.jsx         # 80/20 editable sheet + print
      SocialPanel.jsx            # volet D
      scenes/
        SensoryScene.jsx         # scene 1 (audio + visual load)
        ImplicitScene.jsx        # scene 2 (interpretation choices)
        UnforeseenScene.jsx      # scene 3 (routine then rupture)
  docs/...
```

---

### Task 1: Project scaffold (Vite + React + Tailwind v3 + Vitest)

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "immersactif",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.1.1",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "vite": "^5.3.5",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Create `vite.config.js` (with Vitest jsdom config)**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Step 3: Create `src/test-setup.js`**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Create `postcss.config.js` (import.meta.url fix)**

```js
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [tailwindcss, autoprefixer],
}
```

- [ ] **Step 5: Create `tailwind.config.js` (branding + import.meta.url fix)**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        plai: { teal: '#0a9370', orange: '#f97316' },
      },
      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif'],
        read: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
body { @apply font-ui text-[16px] text-slate-800 bg-slate-50; }
.read { @apply font-read text-[16px] leading-relaxed; }

/* Print: only the synthesis sheet is visible */
@media print {
  body * { visibility: hidden; }
  #synthesis-print, #synthesis-print * { visibility: visible; }
  #synthesis-print { position: absolute; inset: 0; font-family: Arial, sans-serif; }
}
```

- [ ] **Step 7: Create `index.html`**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ImmersActif — PLAI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create `src/App.jsx` (temporary placeholder to verify build)**

```jsx
export default function App() {
  return <h1 className="p-8 text-2xl font-bold text-plai-teal">ImmersActif</h1>
}
```

- [ ] **Step 9: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 10: Create `.gitignore`**

```
node_modules
dist
.DS_Store
*.local
.vercel
```

- [ ] **Step 11: Install and verify build**

Run: `npm install && npm run build`
Expected: build succeeds, `dist/` produced, no errors.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + Tailwind v3 + Vitest"
```

---

### Task 2: localStorage persistence hook

**Files:**
- Create: `src/state/useLocalStorage.js`
- Test: `src/state/useLocalStorage.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('returns the default when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('k', { a: 1 }))
    expect(result.current[0]).toEqual({ a: 1 })
  })

  it('persists and reads back a value', () => {
    const { result } = renderHook(() => useLocalStorage('k', 0))
    act(() => result.current[1](42))
    expect(result.current[0]).toBe(42)
    expect(JSON.parse(localStorage.getItem('k'))).toBe(42)
  })

  it('falls back silently to in-memory state when storage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    const { result } = renderHook(() => useLocalStorage('k', 'x'))
    act(() => result.current[1]('y'))
    expect(result.current[0]).toBe('y') // state still updates
    spy.mockRestore()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/state/useLocalStorage.test.js`
Expected: FAIL — "useLocalStorage is not a function" / module not found.

- [ ] **Step 3: Write minimal implementation**

```js
import { useState, useCallback } from 'react'

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? defaultValue : JSON.parse(raw)
    } catch {
      return defaultValue
    }
  })

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        try {
          localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          /* silent fallback: keep in-memory state only */
        }
        return resolved
      })
    },
    [key]
  )

  return [value, set]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/state/useLocalStorage.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/state/useLocalStorage.js src/state/useLocalStorage.test.js
git commit -m "feat: localStorage hook with silent fallback"
```

---

### Task 3: App reducer and state model

**Files:**
- Create: `src/state/appReducer.js`
- Test: `src/state/appReducer.test.js`

**State shape (the contract used by every later task):**

```js
{
  consentEthics: false,        // entry warning acknowledged
  level: null,                 // 'fondamental' | 'secondaire'
  mode: null,                  // 'decouverte' | 'animateur'
  energy: 100,                 // 0..100, never increases
  completedScenes: [],         // e.g. ['sensory','implicit','unforeseen']
  hubUnlocked: false,          // true once first full pass done OR mode==='animateur'
  selectedGestures: {},        // { [gestureId]: { label, personalization } }
}
```

Action types: `ACK_ETHICS`, `SET_LEVEL`, `SET_MODE`, `DRAIN_ENERGY`, `COMPLETE_SCENE`, `TOGGLE_GESTURE`, `SET_PERSONALIZATION`, `RESET`.

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { appReducer, initialState } from './appReducer'

describe('appReducer', () => {
  it('acknowledges ethics', () => {
    const s = appReducer(initialState, { type: 'ACK_ETHICS' })
    expect(s.consentEthics).toBe(true)
  })

  it('sets level and mode; animateur unlocks the hub immediately', () => {
    let s = appReducer(initialState, { type: 'SET_LEVEL', level: 'secondaire' })
    expect(s.level).toBe('secondaire')
    s = appReducer(s, { type: 'SET_MODE', mode: 'animateur' })
    expect(s.mode).toBe('animateur')
    expect(s.hubUnlocked).toBe(true)
  })

  it('decouverte mode does not unlock the hub up front', () => {
    const s = appReducer(initialState, { type: 'SET_MODE', mode: 'decouverte' })
    expect(s.hubUnlocked).toBe(false)
  })

  it('drains energy and clamps at 0, never increases', () => {
    let s = appReducer(initialState, { type: 'DRAIN_ENERGY', amount: 40 })
    expect(s.energy).toBe(60)
    s = appReducer(s, { type: 'DRAIN_ENERGY', amount: 80 })
    expect(s.energy).toBe(0)
    s = appReducer(s, { type: 'DRAIN_ENERGY', amount: -10 })
    expect(s.energy).toBe(0) // negative drains ignored
  })

  it('records completed scenes without duplicates', () => {
    let s = appReducer(initialState, { type: 'COMPLETE_SCENE', scene: 'sensory' })
    s = appReducer(s, { type: 'COMPLETE_SCENE', scene: 'sensory' })
    expect(s.completedScenes).toEqual(['sensory'])
  })

  it('toggles a gesture on and off', () => {
    let s = appReducer(initialState, {
      type: 'TOGGLE_GESTURE',
      id: 'g1',
      label: "J'annonce le changement de local dès l'accueil",
    })
    expect(s.selectedGestures.g1.label).toMatch(/changement de local/)
    expect(s.selectedGestures.g1.personalization).toBe('')
    s = appReducer(s, { type: 'TOGGLE_GESTURE', id: 'g1' })
    expect(s.selectedGestures.g1).toBeUndefined()
  })

  it('stores a personalization for a selected gesture', () => {
    let s = appReducer(initialState, { type: 'TOGGLE_GESTURE', id: 'g1', label: 'X' })
    s = appReducer(s, { type: 'SET_PERSONALIZATION', id: 'g1', text: 'Pour ma 3e année…' })
    expect(s.selectedGestures.g1.personalization).toBe('Pour ma 3e année…')
  })

  it('RESET returns a fresh initial state', () => {
    let s = appReducer(initialState, { type: 'ACK_ETHICS' })
    s = appReducer(s, { type: 'RESET' })
    expect(s).toEqual(initialState)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/state/appReducer.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
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
    case 'RESET':
      return initialState
    default:
      return state
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/state/appReducer.test.js`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/state/appReducer.js src/state/appReducer.test.js
git commit -m "feat: app reducer and state model"
```

---

### Task 4: Energy drain logic

**Files:**
- Create: `src/lib/energy.js`
- Test: `src/lib/energy.test.js`

The reducer clamps energy; this module owns the *meaning* of the gauge: per-scene drain amounts and the display level (label/color band) shown in `EnergyGauge`.

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { SCENE_DRAIN, energyBand } from './energy'

describe('energy', () => {
  it('defines a drain amount for each scene', () => {
    expect(SCENE_DRAIN.sensory).toBeGreaterThan(0)
    expect(SCENE_DRAIN.implicit).toBeGreaterThan(0)
    expect(SCENE_DRAIN.unforeseen).toBeGreaterThan(0)
  })

  it('maps energy to a band', () => {
    expect(energyBand(90).key).toBe('ok')
    expect(energyBand(50).key).toBe('low')
    expect(energyBand(15).key).toBe('critical')
    expect(energyBand(0).key).toBe('critical')
  })

  it('each band has a label and a tailwind color class', () => {
    const b = energyBand(50)
    expect(typeof b.label).toBe('string')
    expect(b.color).toMatch(/^(bg|text)-/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/energy.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
// Drain amounts sum to 90 so the matinée ends "low/critical" but not at 0,
// reinforcing the closing line "Il vous reste l'après-midi."
export const SCENE_DRAIN = {
  sensory: 35,
  implicit: 25,
  unforeseen: 30,
}

export function energyBand(energy) {
  if (energy <= 25) return { key: 'critical', label: 'Épuisement', color: 'bg-red-500' }
  if (energy <= 60) return { key: 'low', label: 'En tension', color: 'bg-amber-500' }
  return { key: 'ok', label: 'Disponible', color: 'bg-plai-teal' }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/energy.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/energy.js src/lib/energy.test.js
git commit -m "feat: energy drain amounts and display bands"
```

---

### Task 5: Hub unlock logic

**Files:**
- Create: `src/lib/hub.js`
- Test: `src/lib/hub.test.js`

Centralizes the rule "hub is available when animateur mode OR all three scenes completed", and the ordered scene list for the découverte narrative.

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { SCENE_ORDER, isHubAvailable, nextNarrativeScene } from './hub'

describe('hub', () => {
  it('defines the narrative order', () => {
    expect(SCENE_ORDER).toEqual(['sensory', 'implicit', 'unforeseen'])
  })

  it('animateur mode makes the hub available regardless of progress', () => {
    expect(isHubAvailable({ mode: 'animateur', completedScenes: [] })).toBe(true)
  })

  it('decouverte unlocks the hub only after all scenes are done', () => {
    expect(isHubAvailable({ mode: 'decouverte', completedScenes: ['sensory'] })).toBe(false)
    expect(
      isHubAvailable({ mode: 'decouverte', completedScenes: ['sensory', 'implicit', 'unforeseen'] })
    ).toBe(true)
  })

  it('returns the next unfinished narrative scene, or null when done', () => {
    expect(nextNarrativeScene([])).toBe('sensory')
    expect(nextNarrativeScene(['sensory'])).toBe('implicit')
    expect(nextNarrativeScene(['sensory', 'implicit'])).toBe('unforeseen')
    expect(nextNarrativeScene(['sensory', 'implicit', 'unforeseen'])).toBe(null)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/hub.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
export const SCENE_ORDER = ['sensory', 'implicit', 'unforeseen']

export function isHubAvailable({ mode, completedScenes }) {
  if (mode === 'animateur') return true
  return SCENE_ORDER.every((s) => completedScenes.includes(s))
}

export function nextNarrativeScene(completedScenes) {
  return SCENE_ORDER.find((s) => !completedScenes.includes(s)) ?? null
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/hub.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/hub.js src/lib/hub.test.js
git commit -m "feat: hub unlock and narrative ordering"
```

---

### Task 6: Synthesis assembly and print gate

**Files:**
- Create: `src/lib/synthesis.js`
- Test: `src/lib/synthesis.test.js`

Owns the 80/20 rule: the sheet can only be printed once at least one selected gesture carries a non-empty personalization.

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { buildSheet, canPrint } from './synthesis'

const gestures = {
  g1: { label: 'Annoncer les changements', personalization: '' },
  g2: { label: 'Afficher la consigne écrite', personalization: 'Au tableau, à gauche.' },
}

describe('synthesis', () => {
  it('builds a sheet listing selected gestures with their personalizations', () => {
    const sheet = buildSheet(gestures)
    expect(sheet.items).toHaveLength(2)
    expect(sheet.items[0]).toMatchObject({ id: 'g1', label: 'Annoncer les changements' })
  })

  it('counts how many gestures are personalized', () => {
    expect(buildSheet(gestures).personalizedCount).toBe(1)
  })

  it('cannot print without at least one personalization', () => {
    expect(canPrint({ g1: { label: 'A', personalization: '' } })).toBe(false)
    expect(canPrint({})).toBe(false)
  })

  it('can print once one gesture is personalized (whitespace does not count)', () => {
    expect(canPrint({ g1: { label: 'A', personalization: '   ' } })).toBe(false)
    expect(canPrint({ g1: { label: 'A', personalization: 'Pour ma classe…' } })).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/synthesis.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/synthesis.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/synthesis.js src/lib/synthesis.test.js
git commit -m "feat: synthesis sheet assembly and 80/20 print gate"
```

---

### Task 7: References registry (RISS)

**Files:**
- Create: `src/data/references.js`
- Test: `src/data/references.test.js`

A single source of truth for RISS citations, referenced by id from scene debriefs and printed on the synthesis sheet.

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { REFERENCES, formatRef } from './references'

describe('references', () => {
  it('every reference has id, authors, year and a RISS id', () => {
    Object.values(REFERENCES).forEach((r) => {
      expect(r.authors).toBeTruthy()
      expect(r.year).toBeTruthy()
      expect(r.rissId).toBeTruthy()
    })
  })

  it('formats a reference as a short citation string', () => {
    const s = formatRef('schuhl2020')
    expect(s).toMatch(/Schuhl/)
    expect(s).toMatch(/2020/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/references.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation** (ids/data taken from the validated spec's RISS table)

```js
export const REFERENCES = {
  schuhl2020: { authors: 'Schuhl', year: 2020, rissId: 'tel-03795280', note: 'éthique des simulations / risque de pitié' },
  adrian2021: { authors: 'Adrian', year: 2021, rissId: 'dumas-03279190', note: 'sensibilisation par simulation' },
  chataignon2023: { authors: 'Chataignon', year: 2023, rissId: 'dumas-04905925', note: 'traitement sensoriel' },
  fino2017: { authors: 'Fino', year: 2017, rissId: 'dumas-01562085', note: 'particularités sensorielles' },
  dubreuil2019: { authors: 'Dubreuil', year: 2019, rissId: 'dumas-02178074', note: 'particularités sensorielles' },
  petit2023: { authors: 'Petit', year: 2023, rissId: 'tel-04575648', note: 'littéralité nuancée' },
  girard2022: { authors: 'Girard et al.', year: 2022, rissId: 'hal-03816069', note: 'langage figuré / inférences' },
  durand2018: { authors: 'Durand', year: 2018, rissId: 'dumas-02114337', note: 'actes indirects de langage' },
  braida2025: { authors: 'Braida-Bardinaud', year: 2025, rissId: 'dumas-05344623', note: 'routines / DSM-5' },
  aubineau2019: { authors: 'Aubineau', year: 2019, rissId: 'hal-02388518', note: 'vécu élèves TSA secondaire' },
  vallelian2022: { authors: 'Vallélian', year: 2022, rissId: 'W4220658962', note: 'habiletés sociales' },
  passages2024: { authors: 'Projet Passages', year: 2024, rissId: 'hal-05158229', note: 'accompagnement social' },
  meyer2022: { authors: 'Meyer et al.', year: 2022, rissId: 'hal-03900700', note: 'outils numériques inclusion TSA' },
}

export function formatRef(id) {
  const r = REFERENCES[id]
  if (!r) return ''
  return `${r.authors} (${r.year})`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/references.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/references.js src/data/references.test.js
git commit -m "feat: RISS references registry"
```

---

### Task 8: Gestures and scene metadata (content — RISS-checked)

**Files:**
- Create: `src/data/gestures.js`, `src/data/scenes.js`
- Test: `src/data/scenes.test.js`

**Before writing any debrief string in this task:** run `mcp__RISS__search_articles` to confirm each scientific claim, and attach the matching `REFERENCES` id. Use the design's nuances (e.g. literality is *not* systematic — Petit 2023).

- [ ] **Step 1: Write the failing test (structural contract)**

```js
import { describe, it, expect } from 'vitest'
import { GESTURES } from './gestures'
import { SCENES } from './scenes'
import { REFERENCES } from './references'

const SCENE_IDS = ['sensory', 'implicit', 'unforeseen']

describe('scene content', () => {
  it('each scene has 3-5 gestures per level', () => {
    SCENE_IDS.forEach((id) => {
      ['fondamental', 'secondaire'].forEach((lvl) => {
        const list = GESTURES[id][lvl]
        expect(list.length).toBeGreaterThanOrEqual(3)
        expect(list.length).toBeLessThanOrEqual(5)
        list.forEach((g) => {
          expect(g.id).toBeTruthy()
          expect(g.label).toBeTruthy()
        })
      })
    })
  })

  it('gesture ids are globally unique', () => {
    const ids = []
    SCENE_IDS.forEach((id) =>
      ['fondamental', 'secondaire'].forEach((lvl) =>
        GESTURES[id][lvl].forEach((g) => ids.push(g.id))
      )
    )
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each scene has a title and a 3-step debrief referencing valid RISS ids', () => {
    SCENE_IDS.forEach((id) => {
      const s = SCENES[id]
      expect(s.title).toBeTruthy()
      expect(s.debrief.lived).toBeTruthy()
      expect(s.debrief.student).toBeTruthy()
      expect(s.debrief.adjust).toBeTruthy()
      s.refs.forEach((rid) => expect(REFERENCES[rid]).toBeTruthy())
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/scenes.test.js`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/data/gestures.js`** (author 3–5 concrete classroom gestures per scene per level; phrased as actions, not principles. Example shape below — author all entries respecting the guardrails)

```js
export const GESTURES = {
  sensory: {
    fondamental: [
      { id: 'sf1', label: "Je prévois un coin calme où l'élève peut se retirer quelques minutes" },
      { id: 'sf2', label: "Je donne la consigne au calme avant de lancer l'activité bruyante" },
      { id: 'sf3', label: "J'autorise un casque anti-bruit sans en faire un événement" },
    ],
    secondaire: [
      { id: 'ss1', label: "J'écris la consigne au tableau en plus de la dire à l'oral" },
      { id: 'ss2', label: "Je place l'élève loin des sources de bruit (couloir, radiateur)" },
      { id: 'ss3', label: "J'accorde un temps de récupération avant un contrôle" },
    ],
  },
  implicit: {
    fondamental: [
      { id: 'if1', label: 'Je formule une consigne = une action, sans sous-entendu' },
      { id: 'if2', label: "Je vérifie la compréhension en faisant reformuler, pas en demandant « c'est compris ? »" },
      { id: 'if3', label: "J'affiche les étapes de la tâche en images" },
    ],
    secondaire: [
      { id: 'is1', label: 'Je rends explicites les attentes implicites (« finir » = ranger + rendre la feuille)' },
      { id: 'is2', label: 'Je donne un exemple de réponse attendue' },
      { id: 'is3', label: "J'évite l'ironie et les expressions imagées dans les consignes" },
    ],
  },
  unforeseen: {
    fondamental: [
      { id: 'uf1', label: "J'affiche l'emploi du temps du jour et je signale les changements dès l'accueil" },
      { id: 'uf2', label: "Je préviens d'un remplaçant ou d'un changement de local à l'avance quand je le peux" },
      { id: 'uf3', label: "Je laisse un repère stable (place, rituel d'entrée) même quand le reste change" },
    ],
    secondaire: [
      { id: 'us1', label: "J'annonce le changement de local dès le début de l'heure précédente" },
      { id: 'us2', label: 'Je laisse une consigne écrite au remplaçant sur les besoins de la classe' },
      { id: 'us3', label: "Je préviens à l'avance des changements d'organisation (examens, sorties)" },
    ],
  },
}
```

- [ ] **Step 4: Write `src/data/scenes.js`** (author titles + 3-step debriefs; attach RISS ref ids. Example shape — author all three respecting nuances and guardrails)

```js
export const SCENES = {
  sensory: {
    title: 'La consigne dans le bruit',
    refs: ['chataignon2023', 'fino2017', 'dubreuil2019'],
    debrief: {
      lived: "Vous deviez accomplir une tâche simple pendant que les bruits s'empilaient. Pour certains élèves, ces informations sensorielles arrivent sans filtre : ce n'est pas un problème d'audition, mais un traitement différent des informations.",
      student: "Vous pouviez baisser le son et sortir de la scène. L'élève, lui, reçoit cela toute la journée et recommence le lendemain.",
      adjust: 'Quelques gestes qui réduisent la charge sans stigmatiser :',
    },
  },
  implicit: {
    title: "J'ai fait ce que vous avez dit",
    refs: ['petit2023', 'girard2022', 'durand2018'],
    debrief: {
      lived: "Vos interprétations étaient logiques, mais ce n'était pas l'attendu implicite. La compréhension littérale n'est pas systématique chez les élèves concernés ; en revanche, inférer l'implicite a un coût permanent.",
      student: 'Être repris alors qu\'on a « fait ce qui était dit » use la confiance, jour après jour.',
      adjust: "Rendre l'implicite explicite, sans infantiliser :",
    },
  },
  unforeseen: {
    title: 'Le local a changé',
    refs: ['braida2025'],
    debrief: {
      lived: "Vous vous étiez appuyé sur la routine pour anticiper, puis tout a basculé. L'imprévu a un coût cognitif élevé et peut provoquer une réelle détresse face aux transitions.",
      student: "Ce que vous venez de ressentir une fois peut se rejouer à chaque changement non annoncé.",
      adjust: 'Rendre le déroulé prévisible :',
    },
  },
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/data/scenes.test.js`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/data/gestures.js src/data/scenes.js src/data/scenes.test.js
git commit -m "feat: scene metadata and gestures (RISS-checked content)"
```

---

### Task 9: Audio engine (Web Audio layered mixer)

**Files:**
- Create: `src/audio/AudioEngine.js`
- Test: `src/audio/AudioEngine.test.js`

The engine layers looping ambience tracks, each with an independent gain, so the sensory scene can raise saturation progressively. It must start only after a user gesture (browser autoplay policy) — the scene's "entrer" button calls `start()`.

- [ ] **Step 1: Write the failing test (gain/level logic with a mock AudioContext)**

```js
import { describe, it, expect, vi } from 'vitest'
import { AudioEngine } from './AudioEngine'

function mockContext() {
  const gains = []
  return {
    createGain: () => {
      const g = { gain: { value: 0 }, connect: vi.fn() }
      gains.push(g)
      return g
    },
    createBufferSource: () => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn(), loop: false }),
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    state: 'suspended',
    _gains: gains,
  }
}

describe('AudioEngine', () => {
  it('setIntensity(0) keeps all layer gains at 0', () => {
    const ctx = mockContext()
    const e = new AudioEngine(ctx, ['a', 'b', 'c'])
    e.setIntensity(0)
    e.layers.forEach((l) => expect(l.gain.gain.value).toBe(0))
  })

  it('raising intensity progressively brings in more layers', () => {
    const ctx = mockContext()
    const e = new AudioEngine(ctx, ['a', 'b', 'c', 'd'])
    e.setIntensity(0.25)
    const audibleLow = e.layers.filter((l) => l.gain.gain.value > 0).length
    e.setIntensity(1)
    const audibleHigh = e.layers.filter((l) => l.gain.gain.value > 0).length
    expect(audibleHigh).toBeGreaterThan(audibleLow)
  })

  it('start() resumes a suspended context', async () => {
    const ctx = mockContext()
    const e = new AudioEngine(ctx, ['a'])
    await e.start()
    expect(ctx.resume).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/audio/AudioEngine.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
// Layer ordering = order of escalation. Intensity 0..1 fades layers in,
// each layer crossing its threshold proportionally to its index.
export class AudioEngine {
  constructor(ctx, layerNames) {
    this.ctx = ctx
    this.buffers = {} // name -> AudioBuffer, filled by load()
    this.layers = layerNames.map((name, i) => {
      const gain = ctx.createGain()
      gain.gain.value = 0
      gain.connect(ctx.destination)
      return { name, gain, source: null, threshold: i / layerNames.length }
    })
    this.intensity = 0
  }

  setIntensity(value) {
    this.intensity = Math.max(0, Math.min(1, value))
    this.layers.forEach((l) => {
      // gain ramps from 0 at its threshold up to a ceiling as intensity grows
      const over = this.intensity - l.threshold
      l.gain.gain.value = over <= 0 ? 0 : Math.min(0.8, over * 1.6)
    })
  }

  async load(name, url) {
    const res = await fetch(url)
    const arr = await res.arrayBuffer()
    this.buffers[name] = await this.ctx.decodeAudioData(arr)
  }

  async start() {
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    this.layers.forEach((l) => {
      if (l.source || !this.buffers[l.name]) return
      const src = this.ctx.createBufferSource()
      src.buffer = this.buffers[l.name]
      src.loop = true
      src.connect(l.gain)
      src.start(0)
      l.source = src
    })
  }

  stop() {
    this.layers.forEach((l) => {
      if (l.source) {
        try { l.source.stop() } catch { /* already stopped */ }
        l.source = null
      }
      l.gain.gain.value = 0
    })
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/audio/AudioEngine.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/audio/AudioEngine.js src/audio/AudioEngine.test.js
git commit -m "feat: Web Audio layered mixer with progressive intensity"
```

---

### Task 10: useAudioLayers hook + audio assets

**Files:**
- Create: `src/audio/useAudioLayers.js`
- Create: `public/audio/` (place CC0 loops: `chairs.mp3`, `whispers.mp3`, `corridor.mp3`, `bell.mp3`)

**Asset sourcing:** Use CC0 loops (e.g. freesound.org CC0 filter) or synthesize neon-hum/bell via Web Audio. Keep total `public/audio/` under 2 MB. Record source URLs/licenses in `public/audio/CREDITS.txt`.

- [ ] **Step 1: Add audio files and credits**

Create `public/audio/CREDITS.txt` listing each file, its source URL and CC0 confirmation. Add the four loop files.

- [ ] **Step 2: Write the hook (lazy AudioContext, respects reduced-motion/silent fallback)**

```js
import { useEffect, useRef, useState } from 'react'
import { AudioEngine } from './AudioEngine'

const LAYERS = ['chairs', 'whispers', 'corridor', 'bell']

export function useAudioLayers() {
  const engineRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    return () => engineRef.current?.stop()
  }, [])

  async function init() {
    if (engineRef.current) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return // no Web Audio: scene falls back to visual-only
    const ctx = new Ctx()
    const engine = new AudioEngine(ctx, LAYERS)
    await Promise.all(
      LAYERS.map((name) => engine.load(name, `${import.meta.env.BASE_URL}audio/${name}.mp3`).catch(() => {}))
    )
    await engine.start()
    engineRef.current = engine
    setReady(true)
  }

  function setIntensity(v) {
    engineRef.current?.setIntensity(v)
  }

  function stop() {
    engineRef.current?.stop()
  }

  return { init, setIntensity, stop, ready }
}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, temporarily mount the hook in `App.jsx`, click a button calling `init()`, then `setIntensity(1)`.
Expected: layered ambience audible, rising with intensity; no console errors; revert the temporary mount before committing.

- [ ] **Step 4: Commit**

```bash
git add src/audio/useAudioLayers.js public/audio
git commit -m "feat: audio layers hook and CC0 ambience assets"
```

---

### Task 11: App state context provider

**Files:**
- Create: `src/state/AppStateContext.jsx`
- Test: `src/state/AppStateContext.test.jsx`

Wires `appReducer` to `useLocalStorage` so state survives reloads, and exposes `{ state, dispatch }`.

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AppStateProvider, useAppState } from './AppStateContext'

function Probe() {
  const { state, dispatch } = useAppState()
  return (
    <div>
      <span data-testid="energy">{state.energy}</span>
      <button onClick={() => dispatch({ type: 'DRAIN_ENERGY', amount: 10 })}>drain</button>
    </div>
  )
}

describe('AppStateContext', () => {
  beforeEach(() => localStorage.clear())

  it('provides state and dispatch, and persists across remounts', () => {
    const { unmount } = render(
      <AppStateProvider>
        <Probe />
      </AppStateProvider>
    )
    act(() => screen.getByText('drain').click())
    expect(screen.getByTestId('energy').textContent).toBe('90')
    unmount()
    render(
      <AppStateProvider>
        <Probe />
      </AppStateProvider>
    )
    expect(screen.getByTestId('energy').textContent).toBe('90')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/state/AppStateContext.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```jsx
import { createContext, useContext, useReducer, useEffect } from 'react'
import { appReducer, initialState } from './appReducer'
import { useLocalStorage } from './useLocalStorage'

const Ctx = createContext(null)
const STORAGE_KEY = 'immersactif:v1'

export function AppStateProvider({ children }) {
  const [persisted, setPersisted] = useLocalStorage(STORAGE_KEY, initialState)
  const [state, dispatch] = useReducer(appReducer, persisted)

  useEffect(() => {
    setPersisted(state)
  }, [state, setPersisted])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useAppState() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAppState must be used within AppStateProvider')
  return v
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/state/AppStateContext.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/state/AppStateContext.jsx src/state/AppStateContext.test.jsx
git commit -m "feat: app state context with persistence"
```

---

### Task 12: EthicalBanner + EntryScreen

**Files:**
- Create: `src/components/EthicalBanner.jsx`, `src/components/EntryScreen.jsx`
- Test: `src/components/EntryScreen.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EntryScreen } from './EntryScreen'

describe('EntryScreen', () => {
  it('shows the ethical warning and blocks start until level+mode chosen', () => {
    const onStart = vi.fn()
    render(<EntryScreen onStart={onStart} />)
    expect(screen.getByText(/aucune simulation ne fait vivre/i)).toBeInTheDocument()
    const startBtn = screen.getByRole('button', { name: /commencer/i })
    expect(startBtn).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /fondamental/i }))
    fireEvent.click(screen.getByRole('button', { name: /découverte/i }))
    expect(startBtn).toBeEnabled()
    fireEvent.click(startBtn)
    expect(onStart).toHaveBeenCalledWith({ level: 'fondamental', mode: 'decouverte' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/EntryScreen.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `EthicalBanner.jsx`**

```jsx
export function EthicalBanner({ compact = false }) {
  return (
    <div className={`rounded-lg border-l-4 border-plai-orange bg-orange-50 p-4 ${compact ? 'text-sm' : ''}`}>
      <p className="read">
        <strong>Aucune simulation ne fait vivre le TSA.</strong> Cette expérience approche
        certains mécanismes (filtrage sensoriel, implicite, imprévisibilité) pour vous aider à
        ajuster vos gestes professionnels. Le spectre autistique est large : il s'agit de
        situations, jamais d'un portrait d'élève.
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Write `EntryScreen.jsx`**

```jsx
import { useState } from 'react'
import { EthicalBanner } from './EthicalBanner'

function Choice({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-lg border px-4 py-3 text-left ${
        selected ? 'border-plai-teal bg-teal-50 ring-2 ring-plai-teal' : 'border-slate-300'
      }`}
    >
      {label}
    </button>
  )
}

export function EntryScreen({ onStart }) {
  const [level, setLevel] = useState(null)
  const [mode, setMode] = useState(null)
  const canStart = level && mode

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-plai-teal">ImmersActif</h1>
      <EthicalBanner />

      <section className="space-y-2">
        <h2 className="font-semibold">Votre niveau</h2>
        <div className="grid grid-cols-2 gap-3">
          <Choice label="Fondamental" selected={level === 'fondamental'} onClick={() => setLevel('fondamental')} />
          <Choice label="Secondaire" selected={level === 'secondaire'} onClick={() => setLevel('secondaire')} />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Votre mode</h2>
        <div className="grid grid-cols-1 gap-3">
          <Choice
            label="Découverte — vivre une matinée complète, puis accéder aux scènes"
            selected={mode === 'decouverte'}
            onClick={() => setMode('decouverte')}
          />
          <Choice
            label="Animateur — accès direct aux scènes (formation)"
            selected={mode === 'animateur'}
            onClick={() => setMode('animateur')}
          />
        </div>
      </section>

      <button
        disabled={!canStart}
        onClick={() => onStart({ level, mode })}
        className="w-full rounded-lg bg-plai-teal py-3 font-semibold text-white disabled:opacity-40"
      >
        Commencer
      </button>
    </main>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/EntryScreen.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add src/components/EthicalBanner.jsx src/components/EntryScreen.jsx src/components/EntryScreen.test.jsx
git commit -m "feat: ethical banner and entry screen"
```

---

### Task 13: EnergyGauge + SceneShell

**Files:**
- Create: `src/components/EnergyGauge.jsx`, `src/components/SceneShell.jsx`
- Test: `src/components/SceneShell.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SceneShell } from './SceneShell'

describe('SceneShell', () => {
  it('renders the gauge and a permanent exit button', () => {
    const onExit = vi.fn()
    render(
      <SceneShell energy={70} onExit={onExit} title="Test">
        <p>contenu</p>
      </SceneShell>
    )
    expect(screen.getByText('contenu')).toBeInTheDocument()
    expect(screen.getByText(/70/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /sortir de la scène/i }))
    expect(onExit).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/SceneShell.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `EnergyGauge.jsx`**

```jsx
import { energyBand } from '../lib/energy'

export function EnergyGauge({ energy }) {
  const band = energyBand(energy)
  return (
    <div className="flex items-center gap-2" aria-label={`Énergie : ${energy}%, ${band.label}`}>
      <span className="text-xs text-slate-500">Énergie</span>
      <div className="h-3 w-32 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full ${band.color} transition-all`} style={{ width: `${energy}%` }} />
      </div>
      <span className="text-xs font-medium">{energy}% · {band.label}</span>
    </div>
  )
}
```

- [ ] **Step 4: Write `SceneShell.jsx`**

```jsx
import { EnergyGauge } from './EnergyGauge'

export function SceneShell({ title, energy, onExit, children }) {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <header className="mb-4 flex items-center justify-between gap-4 border-b pb-3">
        <h2 className="font-semibold">{title}</h2>
        <div className="flex items-center gap-4">
          <EnergyGauge energy={energy} />
          <button
            onClick={onExit}
            className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
          >
            Sortir de la scène
          </button>
        </div>
      </header>
      {children}
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/SceneShell.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add src/components/EnergyGauge.jsx src/components/SceneShell.jsx src/components/SceneShell.test.jsx
git commit -m "feat: energy gauge and scene shell with permanent exit"
```

---

### Task 14: MicroDebrief

**Files:**
- Create: `src/components/MicroDebrief.jsx`
- Test: `src/components/MicroDebrief.test.jsx`

Shows the 3-step debrief, lists the scene's gestures as checkboxes wired to `TOGGLE_GESTURE`, and cites RISS refs.

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MicroDebrief } from './MicroDebrief'

const scene = {
  title: 'T',
  refs: ['fino2017'],
  debrief: { lived: 'LIVED', student: 'STUDENT', adjust: 'ADJUST' },
}
const gestures = [{ id: 'g1', label: 'Geste un' }]

describe('MicroDebrief', () => {
  it('renders the three debrief steps and toggles a gesture', () => {
    const onToggle = vi.fn()
    render(
      <MicroDebrief scene={scene} gestures={gestures} selected={{}} onToggle={onToggle} onContinue={() => {}} />
    )
    expect(screen.getByText('LIVED')).toBeInTheDocument()
    expect(screen.getByText('STUDENT')).toBeInTheDocument()
    expect(screen.getByText('ADJUST')).toBeInTheDocument()
    expect(screen.getByText(/Fino/)).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Geste un'))
    expect(onToggle).toHaveBeenCalledWith({ id: 'g1', label: 'Geste un' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/MicroDebrief.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```jsx
import { formatRef } from '../data/references'

export function MicroDebrief({ scene, gestures, selected, onToggle, onContinue }) {
  return (
    <section className="mx-auto max-w-3xl space-y-5 p-4">
      <div className="space-y-3 read">
        <div>
          <p className="text-xs font-semibold uppercase text-plai-teal">Ce que vous venez de vivre</p>
          <p>{scene.debrief.lived}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-plai-teal">Ce que vit l'élève</p>
          <p>{scene.debrief.student}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-plai-teal">Ce que vous pouvez ajuster</p>
          <p>{scene.debrief.adjust}</p>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="sr-only">Gestes à retenir</legend>
        {gestures.map((g) => (
          <label key={g.id} className="flex items-start gap-2 rounded border border-slate-200 p-2">
            <input
              type="checkbox"
              aria-label={g.label}
              checked={!!selected[g.id]}
              onChange={() => onToggle(g)}
              className="mt-1"
            />
            <span className="read">{g.label}</span>
          </label>
        ))}
      </fieldset>

      <p className="text-xs text-slate-500">
        Sources : {scene.refs.map(formatRef).join(' · ')}
      </p>

      <button onClick={onContinue} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
        Continuer
      </button>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/MicroDebrief.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/MicroDebrief.jsx src/components/MicroDebrief.test.jsx
git commit -m "feat: micro-debrief with gesture selection and RISS sources"
```

---

### Task 15: SensoryScene (scene 1)

**Files:**
- Create: `src/components/scenes/SensoryScene.jsx`

Interactive task while audio/visual saturation rises with a timer; on finish, drains energy and calls `onDone`. Respects `prefers-reduced-motion` with a descriptive variant (no rising audio/visual, narrated instead). No flashing above photosensitivity thresholds.

- [ ] **Step 1: Write the component**

```jsx
import { useEffect, useRef, useState } from 'react'
import { useAudioLayers } from '../../audio/useAudioLayers'

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function SensoryScene({ level, onDone }) {
  const audio = useAudioLayers()
  const [started, setStarted] = useState(false)
  const [intensity, setIntensity] = useState(0)
  const reduced = REDUCED()
  const raf = useRef(null)
  const t0 = useRef(0)

  const task =
    level === 'fondamental'
      ? "Écoutez la consigne et entourez l'image demandée."
      : "Notez l'énoncé dicté pendant que le cours continue."

  useEffect(() => {
    if (!started || reduced) return
    t0.current = performance.now()
    const DURATION = 20000
    const tick = (now) => {
      const p = Math.min(1, (now - t0.current) / DURATION)
      setIntensity(p)
      audio.setIntensity(p)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [started, reduced, audio])

  async function begin() {
    if (!reduced) await audio.init()
    setStarted(true)
  }

  if (!started) {
    return (
      <div className="space-y-4">
        <p className="read">{task}</p>
        <p className="text-sm text-amber-700">⚠ Cette scène comporte du son. Réglez votre volume.</p>
        <button onClick={begin} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Entrer dans la scène
        </button>
      </div>
    )
  }

  if (reduced) {
    return (
      <div className="space-y-4 read">
        <p>
          Imaginez : vous tentez de {task.toLowerCase()} Pendant ce temps, les chaises raclent, des
          voix chuchotent, un néon grésille, le couloir résonne, une sonnerie retentit. Chaque
          couche s'ajoute, sans filtre. La tâche, simple au départ, devient presque impossible.
        </p>
        <button onClick={() => { audio.stop(); onDone() }} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Terminer la scène
        </button>
      </div>
    )
  }

  // Visual saturation: opacity overlays only (no strobe / no flashing).
  const blur = (intensity * 3).toFixed(1)
  return (
    <div className="relative space-y-4">
      <p className="read" style={{ filter: `blur(${blur}px)` }}>{task}</p>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-slate-900"
        style={{ opacity: intensity * 0.25 }}
      />
      <p className="text-sm text-slate-500">Intensité : {Math.round(intensity * 100)}%</p>
      {intensity >= 1 && (
        <button onClick={() => { audio.stop(); onDone() }} className="relative rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Terminer la scène
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, mount `SensoryScene` temporarily. Confirm: audio rises over ~20s, visual gets harder to read (blur/dim, no flashing), "Terminer" appears at 100%. Toggle OS reduced-motion → descriptive variant shows, no audio rise. Revert temp mount.

- [ ] **Step 3: Commit**

```bash
git add src/components/scenes/SensoryScene.jsx
git commit -m "feat: sensory scene with progressive load and reduced-motion variant"
```

---

### Task 16: ImplicitScene (scene 2)

**Files:**
- Create: `src/components/scenes/ImplicitScene.jsx`
- Create: `src/data/implicitItems.js` (RISS-checked content)
- Test: `src/data/implicitItems.test.js`

The student picks a literal-but-logical interpretation of a real instruction, then sees it was not the implicit expectation. Content authored with guardrails.

- [ ] **Step 1: Write the failing test (content contract)**

```js
import { describe, it, expect } from 'vitest'
import { IMPLICIT_ITEMS } from './implicitItems'

describe('implicit items', () => {
  it('has items per level, each with a prompt, a literal choice and the expected one', () => {
    ['fondamental', 'secondaire'].forEach((lvl) => {
      const items = IMPLICIT_ITEMS[lvl]
      expect(items.length).toBeGreaterThanOrEqual(2)
      items.forEach((it) => {
        expect(it.instruction).toBeTruthy()
        expect(it.literal).toBeTruthy()
        expect(it.expected).toBeTruthy()
        expect(it.reframe).toBeTruthy()
      })
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/implicitItems.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/data/implicitItems.js`** (author real classroom instructions; literal reading is reasonable, expected reading is the implicit social norm)

```js
export const IMPLICIT_ITEMS = {
  fondamental: [
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
```

- [ ] **Step 4: Write `ImplicitScene.jsx`**

```jsx
import { useState } from 'react'
import { IMPLICIT_ITEMS } from '../../data/implicitItems'

export function ImplicitScene({ level, onDone }) {
  const items = IMPLICIT_ITEMS[level]
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const item = items[idx]

  function next() {
    if (idx + 1 < items.length) {
      setIdx(idx + 1)
      setRevealed(false)
    } else {
      onDone()
    }
  }

  return (
    <div className="space-y-4 read">
      <p className="text-lg font-semibold">{item.instruction}</p>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="rounded-lg border border-slate-300 px-4 py-3 text-left"
        >
          {item.literal}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="rounded bg-red-50 p-3">
            On vous reprend : ce n'était pas l'attendu. <strong>{item.expected}</strong>
          </p>
          <p className="text-slate-600">{item.reframe}</p>
          <button onClick={next} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
            {idx + 1 < items.length ? 'Situation suivante' : 'Terminer la scène'}
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Run test + manual check**

Run: `npx vitest run src/data/implicitItems.test.js` → PASS.
Then `npm run dev`, mount temporarily: pick the literal answer → reframe appears → advance through items → "Terminer". Revert temp mount.

- [ ] **Step 6: Commit**

```bash
git add src/components/scenes/ImplicitScene.jsx src/data/implicitItems.js src/data/implicitItems.test.js
git commit -m "feat: implicit-instructions scene and content"
```

---

### Task 17: UnforeseenScene (scene 3)

**Files:**
- Create: `src/components/scenes/UnforeseenScene.jsx`

Establishes a routine (visual schedule the user relies on to predict the next step), then ruptures it (substitute teacher / room change). The user's prediction fails.

- [ ] **Step 1: Write the component**

```jsx
import { useState } from 'react'

const SCHEDULE = {
  fondamental: ['Accueil', 'Lecture', 'Maths', 'Récréation'],
  secondaire: ['Français (local 12)', 'Maths (local 12)', 'Sciences (local 12)'],
}

export function UnforeseenScene({ level, onDone }) {
  const steps = SCHEDULE[level]
  const [phase, setPhase] = useState('routine') // routine -> predict -> rupture
  const [guess, setGuess] = useState(null)

  if (phase === 'routine') {
    return (
      <div className="space-y-4 read">
        <p>Voici le déroulé prévu. Appuyez-vous dessus, comme un repère stable.</p>
        <ol className="space-y-1">
          {steps.map((s, i) => (
            <li key={i} className="rounded border border-slate-200 p-2">{i + 1}. {s}</li>
          ))}
        </ol>
        <button onClick={() => setPhase('predict')} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Et après la prochaine étape ?
        </button>
      </div>
    )
  }

  if (phase === 'predict') {
    return (
      <div className="space-y-4 read">
        <p>Que va-t-il se passer ensuite, d'après le déroulé ?</p>
        <div className="grid gap-2">
          {steps.slice(1).map((s, i) => (
            <button
              key={i}
              onClick={() => { setGuess(s); setPhase('rupture') }}
              className="rounded-lg border border-slate-300 px-4 py-3 text-left"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // rupture
  return (
    <div className="space-y-4 read">
      <p className="rounded bg-red-50 p-3">
        Changement : enseignant remplaçant, et le cours a lieu dans un autre local. Votre
        prévision (« {guess} ») ne tient plus. Le repère sur lequel vous comptiez a disparu.
      </p>
      <button onClick={onDone} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
        Terminer la scène
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Manual verification**

`npm run dev`, mount temporarily: routine shows → predict → rupture invalidates the guess → "Terminer". Revert temp mount.

- [ ] **Step 3: Commit**

```bash
git add src/components/scenes/UnforeseenScene.jsx
git commit -m "feat: unforeseen scene (routine then rupture)"
```

---

### Task 18: SocialPanel (volet D — reading, not simulation)

**Files:**
- Create: `src/data/socialCards.js` (RISS-checked content), `src/components/SocialPanel.jsx`
- Test: `src/data/socialCards.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { SOCIAL_CARDS } from './socialCards'
import { REFERENCES } from './references'

describe('social cards', () => {
  it('has reading cards, each with title, body and a valid RISS ref', () => {
    expect(SOCIAL_CARDS.length).toBeGreaterThanOrEqual(2)
    SOCIAL_CARDS.forEach((c) => {
      expect(c.title).toBeTruthy()
      expect(c.body).toBeTruthy()
      expect(REFERENCES[c.ref]).toBeTruthy()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/socialCards.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/data/socialCards.js`** (author from RISS-validated sources; framed as understanding + accompaniment, no simulation)

```js
export const SOCIAL_CARDS = [
  {
    title: 'La récréation n\'est pas une pause pour tout le monde',
    body: "Les codes sociaux implicites (rejoindre un jeu, lire une intention) ne s'apprennent pas spontanément pour certains élèves. Un espace calme et un adulte repère peuvent transformer ce moment.",
    ref: 'vallelian2022',
  },
  {
    title: 'Le point de vue des élèves eux-mêmes',
    body: "Au secondaire, les élèves concernés décrivent souvent la fatigue de « faire semblant » de suivre les codes. Les écouter oriente mieux l'accompagnement que de le présumer.",
    ref: 'aubineau2019',
  },
  {
    title: 'Travailler les habiletés, pas corriger l\'élève',
    body: "Les groupes d'entraînement aux habiletés sociales visent à outiller, pas à normaliser. L'objectif est l'aisance de l'élève dans ses interactions, à son rythme.",
    ref: 'passages2024',
  },
]
```

- [ ] **Step 4: Write `SocialPanel.jsx`**

```jsx
import { SOCIAL_CARDS } from '../data/socialCards'
import { formatRef } from '../data/references'
import { EthicalBanner } from './EthicalBanner'

export function SocialPanel({ onBack }) {
  return (
    <section className="mx-auto max-w-3xl space-y-4 p-4">
      <h2 className="text-xl font-semibold">Et les interactions sociales ?</h2>
      <p className="read text-slate-600">
        Ce volet ne se simule pas : nous le présentons en lecture, pour éviter toute caricature.
      </p>
      <EthicalBanner compact />
      <div className="grid gap-3">
        {SOCIAL_CARDS.map((c, i) => (
          <article key={i} className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="read mt-1">{c.body}</p>
            <p className="mt-2 text-xs text-slate-500">Source : {formatRef(c.ref)}</p>
          </article>
        ))}
      </div>
      <button onClick={onBack} className="rounded-lg border border-slate-300 px-4 py-2">Retour</button>
    </section>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/data/socialCards.test.js`
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add src/data/socialCards.js src/components/SocialPanel.jsx src/data/socialCards.test.js
git commit -m "feat: social reading panel (volet D)"
```

---

### Task 19: SynthesisSheet (80/20 + print)

**Files:**
- Create: `src/components/SynthesisSheet.jsx`
- Test: `src/components/SynthesisSheet.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SynthesisSheet } from './SynthesisSheet'

describe('SynthesisSheet', () => {
  it('disables print until a gesture is personalized, then enables it', () => {
    const onPersonalize = vi.fn()
    const { rerender } = render(
      <SynthesisSheet
        selectedGestures={{ g1: { label: 'Geste', personalization: '' } }}
        onPersonalize={onPersonalize}
      />
    )
    const printBtn = screen.getByRole('button', { name: /imprimer/i })
    expect(printBtn).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/pour ma classe/i), { target: { value: 'Concret' } })
    expect(onPersonalize).toHaveBeenCalledWith('g1', 'Concret')
    rerender(
      <SynthesisSheet
        selectedGestures={{ g1: { label: 'Geste', personalization: 'Concret' } }}
        onPersonalize={onPersonalize}
      />
    )
    expect(screen.getByRole('button', { name: /imprimer/i })).toBeEnabled()
  })

  it('shows an empty-state message when no gestures are selected', () => {
    render(<SynthesisSheet selectedGestures={{}} onPersonalize={() => {}} />)
    expect(screen.getByText(/aucun geste sélectionné/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/SynthesisSheet.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```jsx
import { buildSheet, canPrint } from '../lib/synthesis'
import { REFERENCES } from '../data/references'

export function SynthesisSheet({ selectedGestures, onPersonalize }) {
  const sheet = buildSheet(selectedGestures)
  const printable = canPrint(selectedGestures)

  if (sheet.items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl p-4">
        <p className="read text-slate-600">
          Aucun geste sélectionné. Cochez des gestes pendant les scènes pour construire votre fiche.
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4 p-4">
      <h2 className="text-xl font-semibold">Ma fiche — gestes pour ma classe</h2>
      <p className="read text-slate-600">
        L'outil propose ; vous décidez. Reformulez au moins un geste pour votre classe avant
        d'imprimer.
      </p>

      <div id="synthesis-print" className="space-y-4">
        <h1 className="text-lg font-bold">ImmersActif — gestes retenus</h1>
        {sheet.items.map((it) => (
          <div key={it.id} className="rounded-lg border border-slate-200 p-3">
            <p className="font-medium read">{it.label}</p>
            <label className="mt-2 block text-sm">
              <span className="text-slate-600">Pour ma classe, concrètement…</span>
              <textarea
                value={it.personalization}
                onChange={(e) => onPersonalize(it.id, e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 p-2 read"
                rows={2}
              />
            </label>
          </div>
        ))}
        <p className="text-xs text-slate-500">
          Cette expérience approche certains mécanismes, elle ne reproduit pas le vécu réel.
          Sources : {Object.values(REFERENCES).map((r) => `${r.authors} ${r.year}`).join(' · ')}
        </p>
      </div>

      <button
        disabled={!printable}
        onClick={() => window.print()}
        className="rounded-lg bg-plai-orange px-4 py-2 font-semibold text-white disabled:opacity-40"
      >
        Imprimer ma fiche
      </button>
      {!printable && (
        <p className="text-sm text-amber-700">Reformulez au moins un geste pour activer l'impression.</p>
      )}
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/SynthesisSheet.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Manual print check**

`npm run dev`, select gestures, personalize one, use browser Print preview → only the sheet shows, Arial, clean A4.

- [ ] **Step 6: Commit**

```bash
git add src/components/SynthesisSheet.jsx src/components/SynthesisSheet.test.jsx
git commit -m "feat: synthesis sheet with 80/20 personalization and print"
```

---

### Task 20: Hub component

**Files:**
- Create: `src/components/Hub.jsx`
- Test: `src/components/Hub.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Hub } from './Hub'

describe('Hub', () => {
  it('renders scene cards, the social card and the sheet entry, and navigates', () => {
    const onOpen = vi.fn()
    render(<Hub completedScenes={['sensory', 'implicit', 'unforeseen']} onOpen={onOpen} />)
    fireEvent.click(screen.getByRole('button', { name: /la consigne dans le bruit/i }))
    expect(onOpen).toHaveBeenCalledWith('sensory')
    fireEvent.click(screen.getByRole('button', { name: /interactions sociales/i }))
    expect(onOpen).toHaveBeenCalledWith('social')
    fireEvent.click(screen.getByRole('button', { name: /ma fiche/i }))
    expect(onOpen).toHaveBeenCalledWith('synthesis')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Hub.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```jsx
import { SCENES } from '../data/scenes'
import { SCENE_ORDER } from '../lib/hub'

export function Hub({ completedScenes, onOpen }) {
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <h1 className="text-2xl font-bold text-plai-teal">Parcours</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {SCENE_ORDER.map((id) => (
          <button
            key={id}
            onClick={() => onOpen(id)}
            className="rounded-lg border border-slate-200 p-4 text-left hover:border-plai-teal"
          >
            <span className="block font-semibold">{SCENES[id].title}</span>
            {completedScenes.includes(id) && <span className="text-xs text-plai-teal">✓ vu</span>}
          </button>
        ))}
      </div>

      <button
        onClick={() => onOpen('social')}
        className="w-full rounded-lg border-2 border-dashed border-slate-300 p-4 text-left"
      >
        <span className="block font-semibold">Et les interactions sociales ?</span>
        <span className="text-xs text-slate-500">Lecture — non simulé</span>
      </button>

      <button onClick={() => onOpen('synthesis')} className="w-full rounded-lg bg-plai-orange p-4 font-semibold text-white">
        Ma fiche de gestes
      </button>
    </main>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Hub.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Hub.jsx src/components/Hub.test.jsx
git commit -m "feat: hub with scene/social/sheet entries"
```

---

### Task 21: App orchestration (wire everything)

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/main.jsx` (wrap in `AppStateProvider`)
- Test: `src/App.test.jsx`

Drives the view machine: entry → (découverte: scene → debrief → next scene → … → "il vous reste l'après-midi" → hub) or (animateur: hub). Scenes drain energy on completion; debrief records completion.

- [ ] **Step 1: Write the failing test (découverte happy path through one scene to debrief)**

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import { AppStateProvider } from './state/AppStateContext'

// Audio is irrelevant to this flow test
vi.mock('./audio/useAudioLayers', () => ({
  useAudioLayers: () => ({ init: vi.fn(), setIntensity: vi.fn(), stop: vi.fn(), ready: true }),
}))

function renderApp() {
  return render(
    <AppStateProvider>
      <App />
    </AppStateProvider>
  )
}

describe('App flow', () => {
  beforeEach(() => localStorage.clear())

  it('entry → start (découverte/fondamental) lands in the first scene', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /fondamental/i }))
    fireEvent.click(screen.getByRole('button', { name: /découverte/i }))
    fireEvent.click(screen.getByRole('button', { name: /commencer/i }))
    // First narrative scene chrome is visible
    expect(screen.getByText(/la consigne dans le bruit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sortir de la scène/i })).toBeInTheDocument()
  })

  it('animateur mode lands directly on the hub', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /secondaire/i }))
    fireEvent.click(screen.getByRole('button', { name: /animateur/i }))
    fireEvent.click(screen.getByRole('button', { name: /commencer/i }))
    expect(screen.getByRole('heading', { name: /parcours/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL — current App is the placeholder.

- [ ] **Step 3: Update `src/main.jsx` to provide state**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AppStateProvider } from './state/AppStateContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </StrictMode>
)
```

- [ ] **Step 4: Write `src/App.jsx`**

```jsx
import { useState } from 'react'
import { useAppState } from './state/AppStateContext'
import { EntryScreen } from './components/EntryScreen'
import { Hub } from './components/Hub'
import { SceneShell } from './components/SceneShell'
import { MicroDebrief } from './components/MicroDebrief'
import { SynthesisSheet } from './components/SynthesisSheet'
import { SocialPanel } from './components/SocialPanel'
import { SensoryScene } from './components/scenes/SensoryScene'
import { ImplicitScene } from './components/scenes/ImplicitScene'
import { UnforeseenScene } from './components/scenes/UnforeseenScene'
import { SCENES } from './data/scenes'
import { GESTURES } from './data/gestures'
import { SCENE_DRAIN } from './lib/energy'
import { nextNarrativeScene } from './lib/hub'

const SCENE_COMPONENTS = {
  sensory: SensoryScene,
  implicit: ImplicitScene,
  unforeseen: UnforeseenScene,
}

export default function App() {
  const { state, dispatch } = useAppState()
  // view: 'entry' | 'scene' | 'debrief' | 'hub' | 'social' | 'synthesis' | 'closing'
  const [view, setView] = useState('entry')
  const [activeScene, setActiveScene] = useState(null)

  if (!state.consentEthics || view === 'entry') {
    return (
      <EntryScreen
        onStart={({ level, mode }) => {
          dispatch({ type: 'ACK_ETHICS' })
          dispatch({ type: 'SET_LEVEL', level })
          dispatch({ type: 'SET_MODE', mode })
          if (mode === 'animateur') {
            setView('hub')
          } else {
            setActiveScene('sensory')
            setView('scene')
          }
        }}
      />
    )
  }

  function openScene(id) {
    if (id === 'social') return setView('social')
    if (id === 'synthesis') return setView('synthesis')
    setActiveScene(id)
    setView('scene')
  }

  function finishScene() {
    dispatch({ type: 'DRAIN_ENERGY', amount: SCENE_DRAIN[activeScene] })
    setView('debrief')
  }

  function afterDebrief() {
    dispatch({ type: 'COMPLETE_SCENE', scene: activeScene })
    if (state.mode === 'animateur') return setView('hub')
    const completed = [...new Set([...state.completedScenes, activeScene])]
    const next = nextNarrativeScene(completed)
    if (next) {
      setActiveScene(next)
      setView('scene')
    } else {
      setView('closing')
    }
  }

  if (view === 'scene') {
    const SceneComp = SCENE_COMPONENTS[activeScene]
    return (
      <SceneShell
        title={SCENES[activeScene].title}
        energy={state.energy}
        onExit={() => setView(state.mode === 'animateur' ? 'hub' : 'closing')}
      >
        <SceneComp level={state.level} onDone={finishScene} />
      </SceneShell>
    )
  }

  if (view === 'debrief') {
    const sceneGestures = GESTURES[activeScene][state.level]
    return (
      <MicroDebrief
        scene={SCENES[activeScene]}
        gestures={sceneGestures}
        selected={state.selectedGestures}
        onToggle={(g) => dispatch({ type: 'TOGGLE_GESTURE', id: g.id, label: g.label })}
        onContinue={afterDebrief}
      />
    )
  }

  if (view === 'closing') {
    return (
      <main className="mx-auto max-w-2xl space-y-4 p-6 text-center">
        <h2 className="text-xl font-semibold">Il vous reste l'après-midi.</h2>
        <p className="read text-slate-600">
          L'élève, lui, recommencera demain. Vous pouvez maintenant revisiter chaque scène et
          composer votre fiche de gestes.
        </p>
        <button onClick={() => setView('hub')} className="rounded-lg bg-plai-teal px-4 py-2 font-semibold text-white">
          Accéder au parcours
        </button>
      </main>
    )
  }

  if (view === 'social') return <SocialPanel onBack={() => setView('hub')} />

  if (view === 'synthesis') {
    return (
      <div className="space-y-4 p-2">
        <SynthesisSheet
          selectedGestures={state.selectedGestures}
          onPersonalize={(id, text) => dispatch({ type: 'SET_PERSONALIZATION', id, text })}
        />
        <div className="mx-auto max-w-3xl px-4">
          <button onClick={() => setView('hub')} className="rounded border border-slate-300 px-4 py-2">Retour au parcours</button>
        </div>
      </div>
    )
  }

  // hub
  return <Hub completedScenes={state.completedScenes} onOpen={openScene} />
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/App.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx src/main.jsx src/App.test.jsx
git commit -m "feat: wire entry, scenes, debrief, hub, social and synthesis"
```

---

### Task 22: Full manual walkthrough + accessibility pass

**Files:**
- Modify as needed for fixes found during the pass.

- [ ] **Step 1: Découverte walkthrough**

`npm run dev`. Entry (fondamental + découverte) → scene 1 audio rises → finish → debrief, check a gesture → scene 2 → scene 3 → "Il vous reste l'après-midi" → hub. Confirm energy gauge dropped across scenes and never rose.

- [ ] **Step 2: Animateur walkthrough**

Reload, clear storage. Entry (secondaire + animateur) → hub directly → open each scene → social panel → synthesis.

- [ ] **Step 3: Accessibility checks**

- Keyboard-only: every button reachable and operable (Tab/Enter).
- Body text is Arial 16px+ (`.read`), contrast AA on teal/orange buttons.
- OS reduced-motion on → sensory scene shows descriptive variant, no audio ramp.
- Confirm no flashing anywhere in scene 1 (opacity/blur only).
- "Sortir de la scène" present in every scene.

- [ ] **Step 4: Synthesis print check**

Select gestures across scenes, personalize one, Print preview → only the sheet, Arial, A4 clean, RISS sources + ethics line present. Confirm print is blocked with zero personalizations.

- [ ] **Step 5: Fix any issues found, then commit**

```bash
git add -A
git commit -m "fix: accessibility and walkthrough corrections"
```

---

### Task 23: README, deploy config, repo + Vercel

**Files:**
- Create: `README.md`, `vercel.json` (optional SPA fallback)

- [ ] **Step 1: Write `README.md`**

Cover: purpose, ethical stance, "approcher pour ajuster", stack, `npm install / dev / test / build`, audio credits location, deploy target `immersactif.jfb4plai.com`, link to spec.

- [ ] **Step 2: Create `vercel.json`** (static SPA)

```json
{
  "cleanUrls": true,
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

- [ ] **Step 3: Final build check**

Run: `npm run build`
Expected: success, `dist/` < a few MB (audio < 2 MB).

- [ ] **Step 4: Create GitHub repo and push** (per CLAUDE.md: jfb4plai, branch main)

```bash
gh repo create jfb4plai/ImmersActif --public --source=. --remote=origin
git push -u origin main
```

- [ ] **Step 5: Commit any config**

```bash
git add README.md vercel.json
git commit -m "docs: README and Vercel config"
git push
```

- [ ] **Step 6: Connect Vercel** (manual, by JF): import `jfb4plai/ImmersActif`, branch `main`, add subdomain `immersactif.jfb4plai.com`. No env vars needed (static app).

---

## Post-build checklist (from CLAUDE.md)

- [ ] Toutes les affirmations scientifiques affichées vérifiées via RISS au moment de la rédaction (Tasks 8, 16, 18).
- [ ] Aucune clé exposée — N/A (pas d'API, pas de backend).
- [ ] Split 80/20 respecté : la fiche n'est imprimable qu'après reformulation (Task 6 + 19).
- [ ] Accessibilité : Arial 16px+, contraste AA, clavier, reduced-motion (Task 22).
- [ ] Pas de données élèves, pas de compte, localStorage only (Tasks 2, 11).
- [ ] Build check local avant push (Task 23).

## Self-review notes

- **Spec coverage:** entry+ethics (T12), level/mode (T3,T12,T21), hybrid découverte/animateur + hub unlock (T5,T21), energy cumul + "après-midi" (T4,T21), 3 scenes ×2 levels (T8,T15-17), volet D reading (T18), micro-debrief 3 steps + gestures (T8,T14), synthesis 80/20 + print (T6,T19), Arial/Inter + reduced-motion + exit button (T1,T13,T15,T22), static stack + Web Audio + localStorage (T1,T2,T9-11), CC0 audio <2MB (T10), deploy (T23). All spec sections mapped.
- **Type consistency:** scene ids `sensory|implicit|unforeseen` used uniformly; `selectedGestures[id] = {label, personalization}` consistent across reducer (T3), synthesis (T6,T19), debrief (T14), App (T21); `SCENE_DRAIN`/`energyBand` (T4) consumed in App (T21)/gauge (T13); `nextNarrativeScene`/`isHubAvailable` (T5) used in App (T21).
- **Content vs RISS:** Tasks 8/16/18 carry explicit "verify each claim in RISS before writing" instructions, satisfying the absolute PLAI rule without blocking the architecture.
