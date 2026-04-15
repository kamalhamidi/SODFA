// src/components/shop/CheckoutForm.jsx — Formulaire de commande en 2 étapes avec animation
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Package, User, MapPin, Phone, FileText } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import Modal from '../ui/Modal'
import { useToast } from '../ui/Toast'

// Validation patterns
const PHONE_REGEX = /^(\+212|0)(5|6|7)\d{8}$/

export default function CheckoutForm({ isOpen, onClose }) {
  const { items, subtotal, shipping, total, createOrder } = useCart()
  const { addToast } = useToast()
  const [step, setStep] = useState(1)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [errors, setErrors] = useState({})
  const confettiRef = useRef(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    note: '',
  })

  // Reset au fermeture
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1)
        setCompletedOrder(null)
        setErrors({})
        setForm({ firstName: '', lastName: '', phone: '', address: '', city: '', postalCode: '', note: '' })
      }, 300)
    }
  }, [isOpen])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = 'Le prénom est requis'
    if (!form.lastName.trim()) newErrors.lastName = 'Le nom est requis'
    if (!form.phone.trim()) newErrors.phone = 'Le téléphone est requis'
    else if (!PHONE_REGEX.test(form.phone.replace(/\s/g, ''))) newErrors.phone = 'Format invalide (+212XXXXXXXXX)'
    if (!form.address.trim()) newErrors.address = 'L\'adresse est requise'
    if (!form.city.trim()) newErrors.city = 'La ville est requise'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (step === 1) {
      if (validate()) setStep(2)
    } else {
      // Créer la commande
      const order = createOrder(form)
      setCompletedOrder(order)
      setStep(3)
      addToast('Commande passée avec succès !', 'success')
    }
  }

  // Confettis SVG simples après commande réussie
  const Confetti = () => {
    const confettis = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      color: ['#c9a96e', '#e8d5b0', '#f8f5f0', '#c9a96e'][Math.floor(Math.random() * 4)],
      size: 4 + Math.random() * 6,
    }))

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettis.map(c => (
          <motion.div
            key={c.id}
            className="absolute"
            style={{
              left: `${c.x}%`,
              top: '-5%',
              width: c.size,
              height: c.size * 1.5,
              backgroundColor: c.color,
              borderRadius: '1px',
            }}
            initial={{ y: 0, rotate: 0, opacity: 1 }}
            animate={{
              y: '120vh',
              rotate: c.rotation + 360,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={step === 3 ? undefined : onClose} size="lg" showClose={step !== 3}>
      {/* Stepper */}
      {step < 3 && (
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { num: 1, label: 'Informations', icon: User },
            { num: 2, label: 'Confirmation', icon: Package },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-medium transition-all duration-300 ${
                step >= s.num
                  ? 'bg-sodfa-gold border-sodfa-gold text-sodfa-black'
                  : 'border-sodfa-gold/20 text-sodfa-cream/30'
              }`}>
                {step > s.num ? <Check size={14} /> : s.num}
              </div>
              <span className={`text-xs tracking-wider uppercase hidden sm:block ${
                step >= s.num ? 'text-sodfa-gold' : 'text-sodfa-cream/20'
              }`}>
                {s.label}
              </span>
              {idx < 1 && <div className={`w-12 h-px ${step > 1 ? 'bg-sodfa-gold' : 'bg-sodfa-gold/20'}`} />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ÉTAPE 1 : Formulaire infos */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="font-cormorant text-2xl text-sodfa-cream mb-6">Informations de livraison</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prénom */}
              <div>
                <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Prénom *</label>
                <input
                  type="text"
                  className={`input-sodfa ${errors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={form.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                  placeholder="Votre prénom"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Nom */}
              <div>
                <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Nom *</label>
                <input
                  type="text"
                  className={`input-sodfa ${errors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={form.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                  placeholder="Votre nom"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>

              {/* Téléphone */}
              <div className="sm:col-span-2">
                <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
                  <Phone size={12} /> Téléphone *
                </label>
                <input
                  type="tel"
                  className={`input-sodfa ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Adresse */}
              <div className="sm:col-span-2">
                <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
                  <MapPin size={12} /> Adresse *
                </label>
                <input
                  type="text"
                  className={`input-sodfa ${errors.address ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                  placeholder="Numéro, rue, quartier"
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* Ville */}
              <div>
                <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Ville *</label>
                <input
                  type="text"
                  className={`input-sodfa ${errors.city ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={form.city}
                  onChange={e => handleChange('city', e.target.value)}
                  placeholder="Casablanca"
                />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>

              {/* Code postal */}
              <div>
                <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 block">Code postal</label>
                <input
                  type="text"
                  className="input-sodfa"
                  value={form.postalCode}
                  onChange={e => handleChange('postalCode', e.target.value)}
                  placeholder="20000"
                />
              </div>

              {/* Note */}
              <div className="sm:col-span-2">
                <label className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
                  <FileText size={12} /> Note (optionnel)
                </label>
                <textarea
                  className="input-sodfa resize-none h-20"
                  value={form.note}
                  onChange={e => handleChange('note', e.target.value)}
                  placeholder="Instructions de livraison, emballage cadeau..."
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="btn-gold w-full mt-6 text-center"
            >
              Continuer →
            </motion.button>
          </motion.div>
        )}

        {/* ÉTAPE 2 : Récapitulatif */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="font-cormorant text-2xl text-sodfa-cream mb-6">Récapitulatif de commande</h3>

            {/* Infos client */}
            <div className="bg-sodfa-black/40 border border-sodfa-gold/5 p-4 mb-4">
              <h4 className="text-sodfa-gold text-xs tracking-wider uppercase mb-3">Livraison</h4>
              <p className="text-sodfa-cream text-sm">{form.firstName} {form.lastName}</p>
              <p className="text-sodfa-cream/40 text-sm">{form.phone}</p>
              <p className="text-sodfa-cream/40 text-sm">{form.address}</p>
              <p className="text-sodfa-cream/40 text-sm">{form.city} {form.postalCode}</p>
            </div>

            {/* Articles */}
            <div className="bg-sodfa-black/40 border border-sodfa-gold/5 p-4 mb-4">
              <h4 className="text-sodfa-gold text-xs tracking-wider uppercase mb-3">Articles ({items.length})</h4>
              {items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-sm border-b border-sodfa-gold/5 last:border-0">
                  <span className="text-sodfa-cream/60">
                    {item.name} {item.sizeML && `(${item.sizeML}ml)`} × {item.quantity}
                  </span>
                  <span className="text-sodfa-cream">{(item.price * item.quantity).toLocaleString('fr-FR')} MAD</span>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="space-y-2 mb-6">
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
              <div className="border-t border-sodfa-gold/10 pt-2 flex justify-between">
                <span className="text-sodfa-cream font-medium">Total</span>
                <span className="font-cormorant text-2xl text-sodfa-gold">{total.toLocaleString('fr-FR')} MAD</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-gold-outline flex-1 text-center">
                ← Retour
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="btn-gold flex-1 text-center"
              >
                Confirmer la commande
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ÉTAPE 3 : Succès */}
        {step === 3 && completedOrder && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center relative"
          >
            <Confetti />

            <motion.div
              className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3, stiffness: 300 }}
            >
              <Check size={36} className="text-emerald-400" />
            </motion.div>

            <h3 className="font-cormorant text-3xl text-sodfa-cream mb-2">Merci pour votre commande !</h3>
            <p className="text-sodfa-cream/40 mb-6">Votre commande a été enregistrée avec succès</p>

            <div className="bg-sodfa-black/40 border border-sodfa-gold/10 p-6 mb-6 inline-block">
              <p className="text-sodfa-cream/40 text-xs tracking-wider uppercase mb-2">Numéro de commande</p>
              <p className="font-cormorant text-2xl text-sodfa-gold tracking-wider">{completedOrder.id}</p>
            </div>

            <p className="text-sodfa-cream/30 text-sm mb-8">
              Un récapitulatif sera envoyé par SMS au {form.phone}
            </p>

            <button onClick={onClose} className="btn-gold">
              Retour à la boutique
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}
