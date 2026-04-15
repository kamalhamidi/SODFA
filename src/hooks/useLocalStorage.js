// src/hooks/useLocalStorage.js — Hook custom pour la persistance localStorage
import { useState, useCallback } from 'react'

/**
 * Hook personnalisé pour synchroniser un état React avec localStorage.
 * Gère la sérialisation/désérialisation JSON automatiquement.
 * @param {string} key — Clé localStorage
 * @param {*} initialValue — Valeur initiale si aucune donnée en cache
 * @returns {[*, Function]} — [valeur, setter]
 */
export function useLocalStorage(key, initialValue) {
  // Initialisation : lecture depuis localStorage ou valeur par défaut
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Erreur lecture localStorage pour "${key}":`, error)
      return initialValue
    }
  })

  // Setter qui met à jour l'état ET localStorage
  const setValue = useCallback((value) => {
    try {
      // Supporter les fonctions de mise à jour comme useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Erreur écriture localStorage pour "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

export default useLocalStorage
