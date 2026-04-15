// src/components/shop/AddToCartPopup.jsx — Popup de confirmation après ajout au panier
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

export default function AddToCartPopup({ isOpen, onClose, onViewCart, product }) {
  const [progress, setProgress] = useState(100)
  const AUTO_CLOSE_MS = 8000

  // Auto-fermeture avec barre de progression
  useEffect(() => {
    if (!isOpen) {
      setProgress(100)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / AUTO_CLOSE_MS) * 100)
      setProgress(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
        onClose()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-sodfa-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative bg-sodfa-charcoal border border-sodfa-gold/10 p-8 max-w-sm w-full text-center overflow-hidden"
          >
            {/* Icône succès animée */}
            <motion.div
              className="w-16 h-16 bg-sodfa-gold/10 border border-sodfa-gold/30 rounded-full flex items-center justify-center mx-auto mb-5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2, stiffness: 400 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
              >
                <Check size={28} className="text-sodfa-gold" />
              </motion.div>
            </motion.div>

            <h3 className="font-cormorant text-2xl text-sodfa-cream mb-2">
              Ajouté au panier
            </h3>

            {product && (
              <p className="text-sodfa-cream/40 text-sm mb-6">
                {product.name}
                {product.sizeML && ` — ${product.sizeML} ml`}
              </p>
            )}

            {/* Boutons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onClose}
                className="btn-gold-outline w-full text-center"
              >
                Continuer mes achats
              </button>
              <button
                onClick={() => { onClose(); onViewCart?.() }}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                Voir le panier →
              </button>
            </div>

            {/* Barre de progression auto-close */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-sodfa-gold/10">
              <div
                className="h-full bg-sodfa-gold transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
