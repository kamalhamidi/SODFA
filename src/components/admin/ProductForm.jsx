// src/components/admin/ProductForm.jsx — Formulaire d'ajout/édition de produit avec image drag & drop
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Plus, Minus } from 'lucide-react'
import Modal from '../ui/Modal'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../ui/Toast'

export default function ProductForm({ isOpen, onClose, editProduct = null }) {
  const { categories, dispatch } = useStore()
  const { addToast } = useToast()
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const emptyForm = {
    name: '',
    nameAr: '',
    description: '',
    categoryId: categories[0]?.id || '',
    notes: { top: '', heart: '', base: '' },
    sizes: [{ ml: 30, price: 0 }],
    price: 0,
    stock: 0,
    image: null,
    status: 'active',
  }

  const [form, setForm] = useState(emptyForm)

  // Pré-remplir si édition
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || '',
        nameAr: editProduct.nameAr || '',
        description: editProduct.description || '',
        categoryId: editProduct.categoryId || '',
        notes: editProduct.notes || { top: '', heart: '', base: '' },
        sizes: editProduct.sizes || [{ ml: 30, price: 0 }],
        price: editProduct.price || 0,
        stock: editProduct.stock || 0,
        image: editProduct.image || null,
        status: editProduct.status || 'active',
      })
    } else {
      setForm(emptyForm)
    }
  }, [editProduct, isOpen])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleNoteChange = (noteType, value) => {
    setForm(prev => ({
      ...prev,
      notes: { ...prev.notes, [noteType]: value },
    }))
  }

  // Gestion des contenances dynamiques
  const addSize = () => {
    setForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { ml: 0, price: 0 }],
    }))
  }

  const removeSize = (index) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }))
  }

  const updateSize = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.map((s, i) => i === index ? { ...s, [field]: Number(value) } : s),
    }))
  }

  // Image : drag & drop + FileReader → base64
  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      handleChange('image', e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleImageFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      addToast('Le nom du produit est requis', 'error')
      return
    }
    if (!form.categoryId) {
      addToast('Veuillez sélectionner une catégorie', 'error')
      return
    }

    if (editProduct) {
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: { ...form, id: editProduct.id },
      })
      addToast('Produit mis à jour avec succès', 'success')
    } else {
      dispatch({
        type: 'ADD_PRODUCT',
        payload: {
          ...form,
          id: `prod-${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      })
      addToast('Produit ajouté avec succès', 'success')
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editProduct ? 'Modifier le produit' : 'Nouveau produit'}
      size="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne gauche */}
        <div className="space-y-4">
          {/* Image drag & drop */}
          <div>
            <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Image</label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-square border-2 border-dashed rounded-sm cursor-pointer flex items-center justify-center transition-all duration-300 overflow-hidden ${
                isDragging
                  ? 'border-sodfa-gold bg-sodfa-gold/5'
                  : 'border-sodfa-gold/20 hover:border-sodfa-gold/40'
              }`}
            >
              {form.image ? (
                <div className="relative w-full h-full">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleChange('image', null) }}
                    className="absolute top-2 right-2 bg-sodfa-black/60 p-1 text-white hover:bg-red-500/60 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center p-4">
                  <Upload size={24} className="text-sodfa-gold/40 mx-auto mb-2" />
                  <p className="text-sodfa-cream/30 text-xs">Glissez une image ici</p>
                  <p className="text-sodfa-cream/20 text-xs mt-1">ou cliquez pour parcourir</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFile(e.target.files[0])}
            />
          </div>

          {/* Statut toggle */}
          <div className="flex items-center justify-between py-3 border-t border-sodfa-gold/10">
            <span className="text-sodfa-cream/40 text-xs tracking-wider uppercase">Statut</span>
            <button
              onClick={() => handleChange('status', form.status === 'active' ? 'inactive' : 'active')}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                form.status === 'active' ? 'bg-sodfa-gold' : 'bg-sodfa-cream/10'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow ${
                form.status === 'active' ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          {/* Nom FR */}
          <div>
            <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Nom *</label>
            <input
              type="text"
              className="input-sodfa"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Nom du parfum"
            />
          </div>

          {/* Nom AR */}
          <div>
            <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Nom arabe</label>
            <input
              type="text"
              className="input-sodfa text-right"
              value={form.nameAr}
              onChange={e => handleChange('nameAr', e.target.value)}
              placeholder="الاسم بالعربية"
              dir="rtl"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Description</label>
            <textarea
              className="input-sodfa resize-none h-20"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Description poétique du parfum..."
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Catégorie *</label>
            <select
              className="input-sodfa"
              value={form.categoryId}
              onChange={e => handleChange('categoryId', e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-sodfa-charcoal">
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes olfactives */}
          <div>
            <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Notes olfactives</label>
            <div className="space-y-2">
              {[
                { key: 'top', label: 'Tête', placeholder: 'Safran, Bergamote...' },
                { key: 'heart', label: 'Cœur', placeholder: 'Rose, Oud...' },
                { key: 'base', label: 'Fond', placeholder: 'Santal, Musc...' },
              ].map(note => (
                <div key={note.key} className="flex items-center gap-2">
                  <span className="text-sodfa-gold/50 text-xs w-12 flex-shrink-0">{note.label}</span>
                  <input
                    type="text"
                    className="input-sodfa text-xs"
                    value={form.notes[note.key]}
                    onChange={e => handleNoteChange(note.key, e.target.value)}
                    placeholder={note.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contenances */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase">Contenances</label>
              <button
                onClick={addSize}
                className="text-sodfa-gold text-xs flex items-center gap-1 hover:text-sodfa-gold-light transition-colors"
              >
                <Plus size={12} /> Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {form.sizes.map((size, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="number"
                    className="input-sodfa w-20 text-xs"
                    value={size.ml}
                    onChange={e => updateSize(idx, 'ml', e.target.value)}
                    placeholder="ml"
                  />
                  <span className="text-sodfa-cream/20 text-xs">ml →</span>
                  <input
                    type="number"
                    className="input-sodfa flex-1 text-xs"
                    value={size.price}
                    onChange={e => updateSize(idx, 'price', e.target.value)}
                    placeholder="Prix MAD"
                  />
                  <span className="text-sodfa-cream/20 text-xs">MAD</span>
                  {form.sizes.length > 1 && (
                    <button
                      onClick={() => removeSize(idx)}
                      className="text-red-400/40 hover:text-red-400 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prix principal + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Prix principal (MAD)</label>
              <input
                type="number"
                className="input-sodfa"
                value={form.price}
                onChange={e => handleChange('price', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Stock</label>
              <input
                type="number"
                className="input-sodfa"
                value={form.stock}
                onChange={e => handleChange('stock', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-sodfa-gold/10">
        <button onClick={onClose} className="btn-gold-outline flex-1 text-center">
          Annuler
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="btn-gold flex-1 text-center"
        >
          {editProduct ? 'Mettre à jour' : 'Ajouter le produit'}
        </motion.button>
      </div>
    </Modal>
  )
}
