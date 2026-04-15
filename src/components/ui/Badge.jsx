// src/components/ui/Badge.jsx — Badge de statut réutilisable
const variantClasses = {
  gold: 'bg-sodfa-gold/10 text-sodfa-gold border-sodfa-gold/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  gray: 'bg-white/5 text-sodfa-cream/50 border-white/10',
}

// Mapping statut commande → variante
const statusMap = {
  pending: { label: 'En attente', variant: 'yellow', icon: '🟡' },
  confirmed: { label: 'Confirmée', variant: 'blue', icon: '🔵' },
  shipped: { label: 'Expédiée', variant: 'orange', icon: '🟠' },
  delivered: { label: 'Livrée', variant: 'green', icon: '🟢' },
  cancelled: { label: 'Annulée', variant: 'red', icon: '🔴' },
}

export default function Badge({ children, variant = 'gold', className = '' }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium tracking-wider uppercase border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Badge spécialisé pour les statuts de commande
export function StatusBadge({ status }) {
  const config = statusMap[status] || statusMap.pending
  return (
    <Badge variant={config.variant}>
      <span className="mr-1.5">{config.icon}</span>
      {config.label}
    </Badge>
  )
}
