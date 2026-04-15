// src/components/shop/ProductModal.jsx — Modal détail produit avec sélection de taille
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Droplets } from 'lucide-react'
import Modal from '../ui/Modal'
import { useStore } from '../../context/StoreContext'

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const { getCategoryById } = useStore()
  const [selectedSize, setSelectedSize] = useState(0)

  if (!product) return null

  const category = getCategoryById(product.categoryId)
  const currentSize = product.sizes?.[selectedSize]
  const currentPrice = currentSize?.price || product.price

  const handleAdd = () => {
    onAddToCart?.({
      ...product,
      price: currentPrice,
      sizeML: currentSize?.ml || null,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-sodfa-charcoal to-sodfa-black flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <svg width="80" height="55" viewBox="0 0 80 60" fill="none" className="mx-auto mb-4 opacity-15">
                <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="1.5" fill="none" />
                <path d="M10 48 L70 48" stroke="#c9a96e" strokeWidth="1.5" />
              </svg>
              <p className="text-sodfa-gold/15 text-sm tracking-[0.3em] uppercase">SODFA</p>
            </div>
          )}
        </div>

        {/* Détails */}
        <div className="flex flex-col">
          {/* Catégorie */}
          {category && (
            <span className="text-sodfa-gold/50 text-xs tracking-[0.2em] uppercase mb-2">
              {category.emoji} {category.name}
            </span>
          )}

          {/* Nom */}
          <h2 className="font-cormorant text-3xl md:text-4xl text-sodfa-cream font-light mb-1">
            {product.name}
          </h2>
          {product.nameAr && (
            <p className="text-sodfa-gold/40 text-lg mb-4" style={{ fontFamily: 'serif' }}>
              {product.nameAr}
            </p>
          )}

          {/* Divider */}
          <div className="w-12 h-px bg-sodfa-gold/30 mb-4" />

          {/* Description */}
          <p className="text-sodfa-cream/50 text-sm leading-relaxed mb-6 font-light">
            {product.description}
          </p>

          {/* Notes olfactives */}
          {product.notes && (
            <div className="mb-6 space-y-3">
              <h4 className="text-sodfa-gold text-xs tracking-[0.2em] uppercase flex items-center gap-2">
                <Droplets size={14} />
                Notes Olfactives
              </h4>
              <div className="space-y-2">
                {[
                  { label: 'Tête', value: product.notes.top },
                  { label: 'Cœur', value: product.notes.heart },
                  { label: 'Fond', value: product.notes.base },
                ].map(note => note.value && (
                  <div key={note.label} className="flex items-start gap-3">
                    <span className="text-sodfa-gold/60 text-xs w-12 flex-shrink-0 pt-0.5">{note.label}</span>
                    <span className="text-sodfa-cream/40 text-sm">{note.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sélection taille */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sodfa-gold text-xs tracking-[0.2em] uppercase mb-3">Contenance</h4>
              <div className="flex gap-2">
                {product.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(idx)}
                    className={`px-4 py-2 text-sm border transition-all duration-300 ${
                      selectedSize === idx
                        ? 'bg-sodfa-gold text-sodfa-black border-sodfa-gold'
                        : 'bg-transparent text-sodfa-cream/50 border-sodfa-gold/20 hover:border-sodfa-gold/50'
                    }`}
                  >
                    {size.ml} ml
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prix et CTA */}
          <div className="mt-auto pt-4 border-t border-sodfa-gold/10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-cormorant text-3xl text-sodfa-gold">
                {currentPrice.toLocaleString('fr-FR')} <span className="text-lg">MAD</span>
              </span>
              {product.stock > 0 ? (
                <span className="text-emerald-400/60 text-xs">En stock ({product.stock})</span>
              ) : (
                <span className="text-red-400/60 text-xs">Rupture de stock</span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} />
              Ajouter au panier
            </motion.button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
