// src/App.jsx — Composant racine avec Router, Providers et transitions de pages
import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Contexts
import { StoreProvider } from './context/StoreContext'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'

// UI
import { ToastProvider } from './components/ui/Toast'
import Loader from './components/ui/Loader'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'

// Shop
import CartDrawer from './components/shop/CartDrawer'
import CheckoutForm from './components/shop/CheckoutForm'

// Admin sub-pages
import Dashboard from './components/admin/Dashboard'
import ProductsManager from './components/admin/ProductsManager'
import CategoriesManager from './components/admin/CategoriesManager'
import OrdersManager from './components/admin/OrdersManager'

// Bouton retour en haut
import { ChevronUp } from 'lucide-react'
import { motion, AnimatePresence as AP } from 'framer-motion'

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AP>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 w-10 h-10 bg-sodfa-gold/10 border border-sodfa-gold/20 flex items-center justify-center text-sodfa-gold hover:bg-sodfa-gold hover:text-sodfa-black transition-all duration-300"
          aria-label="Retour en haut"
        >
          <ChevronUp size={18} />
        </motion.button>
      )}
    </AP>
  )
}

function AppContent() {
  const location = useLocation()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Déterminer si on est dans l'admin
  const isAdmin = location.pathname.startsWith('/admin')

  // Scroll to top au changement de route
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      {/* Navbar seulement pour la boutique */}
      {!isAdmin && (
        <Navbar onCartClick={() => setIsCartOpen(true)} />
      )}

      {/* Routes avec transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Boutique publique */}
          <Route
            path="/"
            element={<HomePage onCartOpen={() => setIsCartOpen(true)} />}
          />
          <Route
            path="/boutique"
            element={<ShopPage onCartOpen={() => setIsCartOpen(true)} />}
          />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<Dashboard />} />
            <Route path="produits" element={<ProductsManager />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="commandes" element={<OrdersManager />} />
          </Route>
        </Routes>
      </AnimatePresence>

      {/* Footer seulement pour la boutique */}
      {!isAdmin && <Footer />}

      {/* Drawers & Modals globaux */}
      {!isAdmin && (
        <>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={() => setIsCheckoutOpen(true)}
          />
          <CheckoutForm
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
        </>
      )}

      {/* Back to top */}
      {!isAdmin && <BackToTop />}
    </>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Afficher le loader pendant 3 secondes
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <StoreProvider>
      <CartProvider>
        <AdminProvider>
          <ToastProvider>
            <AnimatePresence>
              {loading && <Loader key="loader" />}
            </AnimatePresence>
            {!loading && <AppContent />}
          </ToastProvider>
        </AdminProvider>
      </CartProvider>
    </StoreProvider>
  )
}
