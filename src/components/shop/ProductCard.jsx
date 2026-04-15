// src/components/shop/ProductCard.jsx — Carte produit avec hover overlay et animations
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Eye } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import Badge from '../ui/Badge'

export default function ProductCard({ product, onView, onAddToCart, index = 0 }) {
  const { getCategoryById } = useStore()
  const [imageLoaded, setImageLoaded] = useState(false)
  const category = getCategoryById(product.categoryId)

  return (
    <motion.div
      className="product-card group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-sodfa-charcoal">
        {product.image ? (
          <>
            {/* Skeleton loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-sodfa-charcoal to-sodfa-black animate-pulse" />
            )}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          // Placeholder doré si pas d'image
          <div className="absolute inset-0 bg-gradient-to-br from-sodfa-charcoal via-sodfa-black to-sodfa-charcoal flex items-center justify-center">
            <div className="text-center">
              <svg width="50" height="35" viewBox="0 0 80 60" fill="none" className="mx-auto mb-3 opacity-20">
                <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="1.5" fill="none" />
                <path d="M10 48 L70 48" stroke="#c9a96e" strokeWidth="1.5" />
              </svg>
              <p className="text-sodfa-gold/20 text-xs tracking-widest uppercase">SODFA</p>
            </div>
          </div>
        )}

        {/* Catégorie badge */}
        {category && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="gold" className="backdrop-blur-sm bg-sodfa-black/50">
              {category.emoji} {category.name}
            </Badge>
          </div>
        )}

        {/* Stock faible */}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="red" className="backdrop-blur-sm bg-sodfa-black/50">
              Plus que {product.stock}
            </Badge>
          </div>
        )}

        {/* Overlay au hover */}
        <div className="card-overlay">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onView?.(product) }}
              className="bg-sodfa-cream/10 backdrop-blur-md border border-sodfa-cream/20 text-sodfa-cream px-5 py-2.5 text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-sodfa-cream/20 transition-all duration-300"
            >
              <Eye size={14} />
              Voir
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(product) }}
              className="bg-sodfa-gold text-sodfa-black px-5 py-2.5 text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-sodfa-gold-light transition-all duration-300"
            >
              <ShoppingBag size={14} />
              Ajouter
            </motion.button>
          </div>
        </div>
      </div>

      {/* Infos produit */}
      <div className="p-4">
        <h3 className="font-cormorant text-lg text-sodfa-cream mb-1 group-hover:text-sodfa-gold transition-colors duration-300">
          {product.name}
        </h3>
        {product.nameAr && (
          <p className="text-sodfa-gold/40 text-sm mb-2" style={{ fontFamily: 'serif' }}>
            {product.nameAr}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sodfa-gold font-cormorant text-xl">
            {product.price.toLocaleString('fr-FR')} <span className="text-sm">MAD</span>
          </span>
          {product.sizes && product.sizes.length > 1 && (
            <span className="text-sodfa-cream/30 text-xs">
              dès {Math.min(...product.sizes.map(s => s.price))} MAD
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
