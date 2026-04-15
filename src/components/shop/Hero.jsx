// src/components/shop/Hero.jsx — Section hero avec particules dorées et animation staggerée
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  // === Particules dorées animées ===
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Créer les particules
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 - 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }))

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += 0.02

        // Reboucler si hors écran
        if (p.y < -10) p.y = canvas.height + 10
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        const currentOpacity = p.opacity * (0.5 + Math.sin(p.pulse) * 0.5)

        // Dessiner la particule avec glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${currentOpacity})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${currentOpacity * 0.15})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Titre avec animation staggerée par lettre
  const title = "L'Art du Parfum"
  const titleLetters = title.split('')

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas particules */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sodfa-black/40 via-transparent to-sodfa-black z-[1]" />

      {/* Contenu centré */}
      <div className="relative z-10 text-center px-6">
        {/* Couronne décorative */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <svg width="60" height="40" viewBox="0 0 80 60" fill="none" className="mx-auto">
            <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M10 48 L70 48" stroke="#c9a96e" strokeWidth="1.5" opacity="0.6" />
          </svg>
        </motion.div>

        {/* Titre avec animation lettre par lettre */}
        <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl font-light text-sodfa-cream tracking-wide mb-6">
          {titleLetters.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.8 + index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
              style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </h1>

        {/* Divider */}
        <motion.div
          className="w-20 h-px bg-sodfa-gold mx-auto mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        />

        {/* Sous-titre arabe */}
        <motion.p
          className="text-sodfa-gold/70 text-xl md:text-2xl mb-4 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          style={{ fontFamily: 'serif' }}
        >
          صُدفة — Extrait de Parfum
        </motion.p>

        <motion.p
          className="text-sodfa-cream/40 text-sm md:text-base font-light tracking-wider max-w-md mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          Des fragrances d'exception, inspirées de l'art oriental
        </motion.p>

        {/* CTA */}
        <motion.button
          className="btn-gold relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/boutique')}
        >
          <span className="relative z-10">Découvrir la Collection</span>
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <span className="text-sodfa-cream/20 text-xs tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-sodfa-gold/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
