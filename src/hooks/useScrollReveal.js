// src/hooks/useScrollReveal.js — Hook pour révéler les éléments au scroll via Intersection Observer
import { useEffect, useRef } from 'react'

/**
 * Hook Intersection Observer pour animer les éléments à leur entrée dans le viewport.
 * Ajoute la classe "visible" quand l'élément entre dans le viewport.
 * @param {Object} options — Options IntersectionObserver
 * @param {number} options.threshold — Seuil de visibilité (0-1)
 * @param {string} options.rootMargin — Marge autour du viewport
 * @returns {React.RefObject} — Ref à attacher à l'élément
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // Une fois visible, on arrête d'observer
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    )

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [options.threshold, options.rootMargin])

  return ref
}

export default useScrollReveal
