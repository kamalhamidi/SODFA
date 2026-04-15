// src/components/shop/ProductGrid.jsx — Grille de produits avec filtrage par catégorie
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../context/StoreContext'
import ProductCard from './ProductCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function ProductGrid({ onViewProduct, onAddToCart }) {
  const { activeProducts, categories } = useStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const revealRef = useScrollReveal()

  // Filtrage
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return activeProducts
    return activeProducts.filter(p => p.categoryId === selectedCategory)
  }, [activeProducts, selectedCategory])

  return (
    <section ref={revealRef} className="reveal py-20 px-6 max-w-7xl mx-auto">
      {/* En-tête section */}
      <div className="text-center mb-14">
        <h2 className="section-title mb-4">Nos Créations</h2>
        <div className="gold-divider" />
        <p className="text-sodfa-cream/40 font-light text-sm tracking-wider mt-4 max-w-lg mx-auto">
          Chaque fragrance est une œuvre d'art, composée avec les ingrédients les plus nobles
        </p>
      </div>

      {/* Filtres catégories */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-2 text-xs tracking-[0.15em] uppercase font-jost transition-all duration-300 border ${
            selectedCategory === 'all'
              ? 'bg-sodfa-gold text-sodfa-black border-sodfa-gold'
              : 'bg-transparent text-sodfa-cream/40 border-sodfa-gold/20 hover:border-sodfa-gold/50 hover:text-sodfa-cream'
          }`}
        >
          Tous
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 text-xs tracking-[0.15em] uppercase font-jost transition-all duration-300 border ${
              selectedCategory === cat.id
                ? 'bg-sodfa-gold text-sodfa-black border-sodfa-gold'
                : 'bg-transparent text-sodfa-cream/40 border-sodfa-gold/20 hover:border-sodfa-gold/50 hover:text-sodfa-cream'
            }`}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Grille produits */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onView={onViewProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Aucun produit */}
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-sodfa-cream/30 font-light">
            Aucun produit dans cette catégorie pour le moment.
          </p>
        </motion.div>
      )}
    </section>
  )
}
