// src/pages/ShopPage.jsx — Page boutique dédiée
import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductGrid from '../components/shop/ProductGrid'
import ProductModal from '../components/shop/ProductModal'
import AddToCartPopup from '../components/shop/AddToCartPopup'
import { useCart } from '../context/CartContext'

export default function ShopPage({ onCartOpen }) {
  const { dispatch } = useCart()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [addedProduct, setAddedProduct] = useState(null)

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
      {/* Header boutique */}
      <section className="pt-32 pb-16 px-6 text-center bg-gradient-dark">
        <motion.span
          className="text-sodfa-gold/40 text-xs tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Notre Collection
        </motion.span>
        <motion.h1
          className="section-title mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          La Boutique
        </motion.h1>
        <motion.div
          className="gold-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
        <motion.p
          className="text-sodfa-cream/40 font-light text-sm tracking-wider mt-4 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Explorez notre collection de fragrances d'exception, créées avec passion et savoir-faire
        </motion.p>
      </section>

      <ProductGrid
        onViewProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
      />

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
