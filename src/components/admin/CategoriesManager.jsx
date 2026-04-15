// src/components/admin/CategoriesManager.jsx — Gestion des catégories avec drag to reorder
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, GripVertical, Package } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../ui/Toast'
import Modal from '../ui/Modal'

export default function CategoriesManager() {
  const { categories, products, dispatch } = useStore()
  const { addToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editCategory, setEditCategory] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm] = useState({ name: '', nameAr: '', emoji: '✨', description: '' })

  // Drag state
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

  const sortedCategories = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0))

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const openAdd = () => {
    setEditCategory(null)
    setForm({ name: '', nameAr: '', emoji: '✨', description: '' })
    setShowForm(true)
  }

  const openEdit = (cat) => {
    setEditCategory(cat)
    setForm({
      name: cat.name,
      nameAr: cat.nameAr || '',
      emoji: cat.emoji || '✨',
      description: cat.description || '',
    })
    setShowForm(true)
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      addToast('Le nom de la catégorie est requis', 'error')
      return
    }

    if (editCategory) {
      dispatch({
        type: 'UPDATE_CATEGORY',
        payload: { ...form, id: editCategory.id },
      })
      addToast('Catégorie mise à jour', 'success')
    } else {
      dispatch({
        type: 'ADD_CATEGORY',
        payload: {
          ...form,
          id: `cat-${Date.now()}`,
          order: categories.length,
        },
      })
      addToast('Catégorie ajoutée', 'success')
    }
    setShowForm(false)
  }

  const handleDelete = (id) => {
    const productCount = products.filter(p => p.categoryId === id).length
    if (productCount > 0) {
      addToast(`Impossible : ${productCount} produit(s) dépendent de cette catégorie`, 'error')
      setDeleteConfirm(null)
      return
    }
    dispatch({ type: 'DELETE_CATEGORY', payload: id })
    setDeleteConfirm(null)
    addToast('Catégorie supprimée', 'info')
  }

  // Drag to reorder
  const handleDragStart = (index) => {
    dragItem.current = index
  }

  const handleDragEnter = (index) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    const items = [...sortedCategories]
    const draggedItem = items.splice(dragItem.current, 1)[0]
    items.splice(dragOverItem.current, 0, draggedItem)
    const reordered = items.map((item, index) => ({ ...item, order: index }))
    dispatch({ type: 'REORDER_CATEGORIES', payload: reordered })
    dragItem.current = null
    dragOverItem.current = null
  }

  const getProductCount = (catId) => products.filter(p => p.categoryId === catId).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-cormorant text-3xl text-sodfa-cream font-light">Catégories</h2>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={16} />
          Nouvelle catégorie
        </motion.button>
      </div>

      {/* Grille de catégories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {sortedCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="bg-sodfa-charcoal border border-sodfa-gold/5 p-6 cursor-grab active:cursor-grabbing hover:border-sodfa-gold/20 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.emoji}</span>
                  <GripVertical size={16} className="text-sodfa-cream/10 group-hover:text-sodfa-cream/30 transition-colors" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-sodfa-cream/20 hover:text-blue-400 transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cat)}
                    className="p-1.5 text-sodfa-cream/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-sodfa-cream font-medium text-lg mb-1">{cat.name}</h3>
              {cat.nameAr && (
                <p className="text-sodfa-gold/40 text-sm mb-2" style={{ fontFamily: 'serif' }}>{cat.nameAr}</p>
              )}
              {cat.description && (
                <p className="text-sodfa-cream/30 text-xs mb-3 line-clamp-2">{cat.description}</p>
              )}

              <div className="flex items-center gap-2 text-sodfa-cream/20 text-xs">
                <Package size={12} />
                <span>{getProductCount(cat.id)} produit{getProductCount(cat.id) > 1 ? 's' : ''}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Formulaire modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-20">
              <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Emoji</label>
              <input
                type="text"
                className="input-sodfa text-center text-2xl"
                value={form.emoji}
                onChange={e => handleFormChange('emoji', e.target.value)}
                maxLength={4}
              />
            </div>
            <div className="flex-1">
              <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Nom FR *</label>
              <input
                type="text"
                className="input-sodfa"
                value={form.name}
                onChange={e => handleFormChange('name', e.target.value)}
                placeholder="Nom de la catégorie"
              />
            </div>
          </div>

          <div>
            <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Nom arabe</label>
            <input
              type="text"
              className="input-sodfa text-right"
              value={form.nameAr}
              onChange={e => handleFormChange('nameAr', e.target.value)}
              placeholder="الاسم بالعربية"
              dir="rtl"
            />
          </div>

          <div>
            <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Description</label>
            <textarea
              className="input-sodfa resize-none h-20"
              value={form.description}
              onChange={e => handleFormChange('description', e.target.value)}
              placeholder="Description courte..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowForm(false)} className="btn-gold-outline flex-1 text-center">
              Annuler
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="btn-gold flex-1 text-center"
            >
              {editCategory ? 'Modifier' : 'Ajouter'}
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Confirmation suppression */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Supprimer la catégorie"
        size="sm"
      >
        <p className="text-sodfa-cream/60 mb-6">
          Supprimer <strong className="text-sodfa-cream">{deleteConfirm?.name}</strong> ?
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="btn-gold-outline flex-1 text-center">
            Annuler
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm.id)}
            className="bg-red-500/10 text-red-400 border border-red-500/20 px-8 py-3 font-jost font-medium tracking-wider uppercase text-sm hover:bg-red-500/20 transition-all flex-1 text-center"
          >
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  )
}
