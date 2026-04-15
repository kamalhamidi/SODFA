// src/components/layout/Navbar.jsx — Barre de navigation SODFA avec effet scroll
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'

// Logo SVG inline SODFA
function SodfaLogo({ className = '' }) {
  return (
    <Link to="/" className={`flex flex-col items-center ${className}`}>
      {/* Couronne */}
      <svg width="36" height="24" viewBox="0 0 80 60" fill="none" className="mb-0.5">
        <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="2" fill="none" />
        <path d="M10 48 L70 48" stroke="#c9a96e" strokeWidth="2" />
      </svg>
      <span className="font-cormorant text-xl italic text-sodfa-gold tracking-[0.25em] leading-none">
        SODFA
      </span>
      <span className="text-sodfa-gold/50 text-[8px] leading-none mt-0.5" style={{ fontFamily: 'serif' }}>
        صُدفة
      </span>
    </Link>
  )
}

export default function Navbar({ onCartClick }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { itemCount } = useCart()
  const location = useLocation()

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermer menu mobile au changement de route
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/boutique', label: 'Boutique' },
  ]

  return (
    <>
      {/* Barre de progression scroll */}
      <ScrollProgress />

      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-sodfa-black/90 backdrop-blur-md border-b border-sodfa-gold/10 py-3'
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <SodfaLogo />

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-jost text-sm tracking-[0.15em] uppercase transition-colors duration-300 ${
                  location.pathname === link.to
                    ? 'text-sodfa-gold'
                    : 'text-sodfa-cream/60 hover:text-sodfa-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Bouton panier */}
            <button
              onClick={onCartClick}
              className="relative text-sodfa-cream/60 hover:text-sodfa-gold transition-colors duration-300 p-2"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="absolute -top-0.5 -right-0.5 bg-sodfa-gold text-sodfa-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden text-sodfa-cream/60 hover:text-sodfa-gold transition-colors p-2"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Drawer mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-sodfa-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-sodfa-charcoal border-l border-sodfa-gold/10 z-50 p-8 flex flex-col"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="self-end text-sodfa-cream/40 hover:text-sodfa-gold transition-colors mb-8"
              >
                <X size={24} />
              </button>

              <SodfaLogo className="mb-12" />

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileOpen(false)}
                    className={`font-jost text-sm tracking-[0.2em] uppercase transition-colors duration-300 ${
                      location.pathname === link.to
                        ? 'text-sodfa-gold'
                        : 'text-sodfa-cream/60 hover:text-sodfa-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-sodfa-gold/10">
                <p className="text-sodfa-cream/30 text-xs tracking-wider">
                  © SODFA — Maison de Parfums
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Barre de progression dorée en haut de page
function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setProgress(scrollProgress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="scroll-progress"
      style={{ width: `${progress}%` }}
    />
  )
}
