// src/components/admin/ProductsManager.jsx — Gestion des produits avec recherche, filtrage et pagination
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../ui/Toast'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import ProductForm from './ProductForm'

const ITEMS_PER_PAGE = 10

export default function ProductsManager() {
  const { products, categories, getCategoryById, dispatch } = useStore()
  const { addToast } = useToast()

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Filtrage et recherche
  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.nameAr && p.nameAr.includes(search))
      const matchCategory = filterCategory === 'all' || p.categoryId === filterCategory
      return matchSearch && matchCategory
    })
  }, [products, search, filterCategory])

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleEdit = (product) => {
    setEditProduct(product)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id })
    setDeleteConfirm(null)
    addToast('Produit supprimé', 'info')
  }

  const handleToggleStatus = (product) => {
    dispatch({
      type: 'UPDATE_PRODUCT',
      payload: {
        id: product.id,
        status: product.status === 'active' ? 'inactive' : 'active',
      },
    })
    addToast(
      product.status === 'active' ? 'Produit désactivé' : 'Produit activé',
      'info'
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-cormorant text-3xl text-sodfa-cream font-light">Produits</h2>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditProduct(null); setShowForm(true) }}
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={16} />
          Nouveau produit
        </motion.button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sodfa-cream/30" />
          <input
            type="text"
            className="input-sodfa pl-10"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
          />
        </div>
        <select
          className="input-sodfa w-full sm:w-48"
          value={filterCategory}
          onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1) }}
        >
          <option value="all" className="bg-sodfa-charcoal">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-sodfa-charcoal">
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-sodfa-charcoal border border-sodfa-gold/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-sodfa-cream/30 text-xs tracking-wider uppercase border-b border-sodfa-gold/10">
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Nom</th>
              <th className="text-left p-4">Catégorie</th>
              <th className="text-left p-4">Prix</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Statut</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((product) => {
              const category = getCategoryById(product.categoryId)
              return (
                <tr key={product.id} className="border-b border-sodfa-gold/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-sodfa-black overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg width="16" height="12" viewBox="0 0 80 60" fill="none" opacity="0.15">
                            <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sodfa-cream font-medium">{product.name}</p>
                    {product.nameAr && (
                      <p className="text-sodfa-cream/30 text-xs mt-0.5">{product.nameAr}</p>
                    )}
                  </td>
                  <td className="p-4">
                    {category && (
                      <Badge variant="gold">{category.emoji} {category.name}</Badge>
                    )}
                  </td>
                  <td className="p-4 text-sodfa-gold font-cormorant text-lg">
                    {product.price.toLocaleString('fr-FR')} MAD
                  </td>
                  <td className="p-4">
                    <span className={product.stock < 5 ? 'text-red-400' : 'text-sodfa-cream'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant={product.status === 'active' ? 'green' : 'gray'}>
                      {product.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className="p-2 text-sodfa-cream/30 hover:text-sodfa-gold transition-colors"
                        title={product.status === 'active' ? 'Désactiver' : 'Activer'}
                      >
                        {product.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-sodfa-cream/30 hover:text-blue-400 transition-colors"
                        title="Modifier"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="p-2 text-sodfa-cream/30 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {paginated.length === 0 && (
          <div className="text-center py-12 text-sodfa-cream/20">Aucun produit trouvé</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 text-xs transition-all duration-300 ${
                page === currentPage
                  ? 'bg-sodfa-gold text-sodfa-black'
                  : 'text-sodfa-cream/30 hover:text-sodfa-cream border border-sodfa-gold/10 hover:border-sodfa-gold/30'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal formulaire */}
      <ProductForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditProduct(null) }}
        editProduct={editProduct}
      />

      {/* Modal confirmation suppression */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmer la suppression"
        size="sm"
      >
        <p className="text-sodfa-cream/60 mb-6">
          Supprimer <strong className="text-sodfa-cream">{deleteConfirm?.name}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="btn-gold-outline flex-1 text-center">
            Annuler
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm.id)}
            className="bg-red-500/10 text-red-400 border border-red-500/20 px-8 py-3 font-jost font-medium tracking-wider uppercase text-sm hover:bg-red-500/20 transition-all duration-300 flex-1 text-center"
          >
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  )
}
