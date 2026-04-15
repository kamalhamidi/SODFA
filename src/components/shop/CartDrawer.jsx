// src/components/shop/CartDrawer.jsx — Tiroir latéral du panier
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, itemCount, subtotal, shipping, total, dispatch, SHIPPING_THRESHOLD } = useCart()

  const handleQuantity = (index, delta) => {
    const newQty = items[index].quantity + delta
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity: newQty } })
  }

  const handleRemove = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-sodfa-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-sodfa-charcoal border-l border-sodfa-gold/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sodfa-gold/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-sodfa-gold" />
                <h3 className="font-cormorant text-2xl text-sodfa-cream">Mon Panier</h3>
                <span className="text-sodfa-cream/30 text-sm">({itemCount})</span>
              </div>
              <button
                onClick={onClose}
                className="text-sodfa-cream/30 hover:text-sodfa-gold transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Articles */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-sodfa-gold/20 mb-4" />
                  <p className="text-sodfa-cream/30 font-light mb-2">Votre panier est vide</p>
                  <p className="text-sodfa-cream/20 text-xs">Découvrez nos créations exceptionnelles</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.productId}-${item.sizeML}-${index}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-4 p-4 bg-sodfa-black/40 border border-sodfa-gold/5"
                      >
                        {/* Image */}
                        <div className="w-16 h-20 bg-gradient-to-br from-sodfa-charcoal to-sodfa-black flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg width="20" height="14" viewBox="0 0 80 60" fill="none" opacity="0.15">
                                <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="2" fill="none" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sodfa-cream text-sm font-medium truncate">{item.name}</h4>
                          {item.sizeML && (
                            <p className="text-sodfa-cream/30 text-xs mt-0.5">{item.sizeML} ml</p>
                          )}
                          <p className="text-sodfa-gold text-sm mt-1 font-cormorant">
                            {item.price.toLocaleString('fr-FR')} MAD
                          </p>

                          {/* Quantité */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleQuantity(index, -1)}
                              className="w-6 h-6 border border-sodfa-gold/20 flex items-center justify-center text-sodfa-cream/40 hover:text-sodfa-gold hover:border-sodfa-gold/50 transition-all"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sodfa-cream text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantity(index, 1)}
                              className="w-6 h-6 border border-sodfa-gold/20 flex items-center justify-center text-sodfa-cream/40 hover:text-sodfa-gold hover:border-sodfa-gold/50 transition-all"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Supprimer */}
                        <button
                          onClick={() => handleRemove(index)}
                          className="self-start text-sodfa-cream/20 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer avec totaux */}
            {items.length > 0 && (
              <div className="border-t border-sodfa-gold/10 p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-sodfa-cream/40">Sous-total</span>
                  <span className="text-sodfa-cream">{subtotal.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-sodfa-cream/40">Livraison</span>
                  <span className={shipping === 0 ? 'text-emerald-400' : 'text-sodfa-cream'}>
                    {shipping === 0 ? 'Gratuite' : `${shipping} MAD`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-sodfa-gold/40 text-xs">
                    Plus que {(SHIPPING_THRESHOLD - subtotal).toLocaleString('fr-FR')} MAD pour la livraison gratuite
                  </p>
                )}
                <div className="border-t border-sodfa-gold/10 pt-3 flex justify-between">
                  <span className="text-sodfa-cream font-medium">Total</span>
                  <span className="font-cormorant text-2xl text-sodfa-gold">
                    {total.toLocaleString('fr-FR')} MAD
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onClose(); onCheckout?.() }}
                  className="btn-gold w-full mt-3 text-center"
                >
                  Commander
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
