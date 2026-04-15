// src/components/ui/Button.jsx — Bouton réutilisable avec variantes SODFA
import { motion } from 'framer-motion'

const variants = {
  gold: 'btn-gold',
  outline: 'btn-gold-outline',
  ghost: 'text-sodfa-gold hover:text-sodfa-gold-light transition-colors duration-300 font-jost font-medium tracking-wider uppercase text-sm',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20 px-8 py-3 font-jost font-medium tracking-wider uppercase text-sm hover:bg-red-500/20 transition-all duration-300',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-8 py-3 text-sm',
  lg: 'px-10 py-4 text-base',
}

export default function Button({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      className={`${variants[variant]} ${size !== 'md' ? sizes[size] : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={disabled || loading ? undefined : onClick}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Chargement...
        </span>
      ) : children}
    </motion.button>
  )
}
