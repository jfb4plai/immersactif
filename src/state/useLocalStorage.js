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
