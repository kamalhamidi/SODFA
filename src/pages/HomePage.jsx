// src/pages/HomePage.jsx — Page d'accueil avec Hero et grille de produits
import { useState } from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/shop/Hero'
import ProductGrid from '../components/shop/ProductGrid'
import ProductModal from '../components/shop/ProductModal'
import AddToCartPopup from '../components/shop/AddToCartPopup'
import { useCart } from '../context/CartContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function HomePage({ onCartOpen }) {
  const { dispatch } = useCart()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [addedProduct, setAddedProduct] = useState(null)
  const aboutRef = useScrollReveal()

  const handleAddToCart = (product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        sizeML: product.sizeML || product.sizes?.[0]?.ml || null,
        image: product.image,
      },
    })
    setAddedProduct(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />

      {/* Section À Propos */}
      <section ref={aboutRef} className="reveal py-24 px-6 max-w-4xl mx-auto text-center">
        <span className="text-sodfa-gold/40 text-xs tracking-[0.3em] uppercase">Maison de Parfums</span>
        <h2 className="section-title mt-4 mb-4">L'Essence de SODFA</h2>
        <div className="gold-divider" />
        <p className="text-sodfa-cream/40 font-light leading-relaxed max-w-2xl mx-auto mt-6">
          SODFA — صُدفة — signifie « le hasard heureux ». Chaque rencontre avec nos fragrances est
          une coïncidence heureuse, un moment où l'art du maître parfumeur touche l'âme.
          Nos créations puisent dans les trésors de l'Orient, les épices des souks, les fleurs
          des jardins secrets et les boisés les plus nobles pour composer des symphonies olfactives
          uniques.
        </p>
        <div className="flex justify-center gap-8 mt-12">
          {[
            { number: '100%', label: 'Ingrédients naturels' },
            { number: '24', label: 'Heures de macération' },
            { number: '∞', label: 'Passion' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="font-cormorant text-3xl text-sodfa-gold">{stat.number}</p>
              <p className="text-sodfa-cream/30 text-xs tracking-wider uppercase mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <ProductGrid
        onViewProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Section Promise */}
      <section className="py-24 px-6 bg-gradient-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-cormorant text-3xl md:text-4xl text-sodfa-cream font-light mb-8">
            Notre Promesse
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '🌿', title: 'Naturel', desc: 'Ingrédients sourcés éthiquement des quatre coins du monde' },
              { emoji: '👑', title: 'Luxe', desc: 'Flacons et packaging conçus par des artisans marocains' },
              { emoji: '🚚', title: 'Livraison', desc: 'Expédition soignée, gratuite dès 500 MAD' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass-card p-8"
              >
                <span className="text-3xl mb-4 block">{item.emoji}</span>
                <h3 className="font-cormorant text-xl text-sodfa-gold mb-2">{item.title}</h3>
                <p className="text-sodfa-cream/30 text-sm font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <AddToCartPopup
        isOpen={!!addedProduct}
        onClose={() => setAddedProduct(null)}
        onViewCart={onCartOpen}
        product={addedProduct}
      />
    </motion.div>
  )
}
