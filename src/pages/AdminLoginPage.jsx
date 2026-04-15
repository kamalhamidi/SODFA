// src/pages/AdminLoginPage.jsx — Page de connexion admin
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useToast } from '../components/ui/Toast'

export default function AdminLoginPage() {
  const { login } = useAdmin()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(password)) {
      addToast('Connexion réussie', 'success')
      navigate('/admin')
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      addToast('Mot de passe incorrect', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-sodfa-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <svg width="50" height="35" viewBox="0 0 80 60" fill="none" className="mx-auto mb-4">
            <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="1.5" fill="none" />
            <path d="M10 48 L70 48" stroke="#c9a96e" strokeWidth="1.5" />
          </svg>
          <h1 className="font-cormorant text-3xl italic text-sodfa-gold tracking-[0.2em]">SODFA</h1>
          <p className="text-sodfa-cream/20 text-xs tracking-[0.2em] uppercase mt-2">Administration</p>
        </div>

        {/* Formulaire */}
        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-sodfa-charcoal border border-sodfa-gold/10 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-sodfa-gold/10 flex items-center justify-center">
              <Lock size={18} className="text-sodfa-gold" />
            </div>
            <div>
              <h2 className="text-sodfa-cream font-medium">Connexion</h2>
              <p className="text-sodfa-cream/30 text-xs">Accès réservé à l'administration</p>
            </div>
          </div>

          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`input-sodfa pr-10 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              placeholder="Mot de passe"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sodfa-cream/20 hover:text-sodfa-cream/40 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs mb-4"
            >
              Mot de passe incorrect
            </motion.p>
          )}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="btn-gold w-full text-center"
          >
            Se connecter
          </motion.button>
        </motion.form>

        <p className="text-center text-sodfa-cream/10 text-xs mt-8">
          SODFA — صُدفة — Maison de Parfums de Luxe
        </p>
      </motion.div>
    </div>
  )
}
