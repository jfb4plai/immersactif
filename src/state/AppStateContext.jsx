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
