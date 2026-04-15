// src/components/ui/Loader.jsx — Écran de chargement initial avec animation SVG du logo SODFA
import { motion } from 'framer-motion'

export default function Loader({ onComplete }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-sodfa-black flex items-center justify-center flex-col"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.5 }}
      onAnimationComplete={() => {
        if (onComplete) setTimeout(onComplete, 100)
      }}
    >
      {/* Couronne SVG avec animation de dessin */}
      <motion.svg
        width="80"
        height="60"
        viewBox="0 0 80 60"
        fill="none"
        className="mb-6"
      >
        <motion.path
          d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z"
          stroke="#c9a96e"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.path
          d="M10 48 L70 48"
          stroke="#c9a96e"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        />
      </motion.svg>

      {/* Nom SODFA */}
      <motion.h1
        className="font-cormorant text-4xl italic text-sodfa-gold tracking-[0.3em]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        SODFA
      </motion.h1>

      {/* Nom arabe */}
      <motion.p
        className="text-sodfa-gold/60 text-lg mt-2 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        style={{ fontFamily: 'serif' }}
      >
        صُدفة
      </motion.p>

      {/* Ligne de chargement */}
      <motion.div
        className="mt-8 h-[1px] bg-sodfa-gold/40"
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
