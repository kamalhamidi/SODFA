// src/components/layout/AdminLayout.jsx — Layout du dashboard admin
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, Tag, ShoppingCart, LogOut, ChevronRight, Home
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const sidebarLinks = [
  { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { path: '/admin/produits', label: 'Produits', icon: Package },
  { path: '/admin/categories', label: 'Catégories', icon: Tag },
  { path: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
]

export default function AdminLayout() {
  const { logout } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // Déterminer le breadcrumb
  const currentLink = sidebarLinks.find(l =>
    l.exact ? location.pathname === l.path : location.pathname.startsWith(l.path) && l.path !== '/admin'
  ) || sidebarLinks[0]

  return (
    <div className="min-h-screen bg-sodfa-black flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sodfa-charcoal border-r border-sodfa-gold/10 flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-sodfa-gold/10">
          <div className="flex flex-col items-center">
            <svg width="30" height="20" viewBox="0 0 80 60" fill="none" className="mb-1">
              <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="2" fill="none" />
              <path d="M10 48 L70 48" stroke="#c9a96e" strokeWidth="2" />
            </svg>
            <span className="font-cormorant text-lg italic text-sodfa-gold tracking-[0.2em]">SODFA</span>
            <span className="text-sodfa-gold/40 text-[7px]" style={{ fontFamily: 'serif' }}>Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = link.exact
              ? location.pathname === link.path
              : location.pathname.startsWith(link.path) && link.path !== '/admin'
            const Icon = link.icon

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-jost tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-sodfa-gold/10 text-sodfa-gold border-l-2 border-sodfa-gold'
                    : 'text-sodfa-cream/40 hover:text-sodfa-cream hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </button>
            )
          })}
        </nav>

        {/* Actions bas de sidebar */}
        <div className="p-4 border-t border-sodfa-gold/10 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sodfa-cream/40 hover:text-sodfa-cream hover:bg-white/5 transition-all duration-300"
          >
            <Home size={18} />
            Voir la boutique
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-sodfa-black/80 backdrop-blur-md border-b border-sodfa-gold/10 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-sodfa-cream/30">Admin</span>
              <ChevronRight size={14} className="text-sodfa-cream/20" />
              <span className="text-sodfa-gold">{currentLink.label}</span>
            </div>
            {/* Info admin */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sodfa-gold/10 border border-sodfa-gold/20 flex items-center justify-center text-sodfa-gold text-xs font-bold">
                A
              </div>
              <span className="text-sodfa-cream/60 text-sm">Administrateur</span>
            </div>
          </div>
        </header>

        {/* Zone contenu */}
        <motion.main
          className="p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={location.pathname}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
