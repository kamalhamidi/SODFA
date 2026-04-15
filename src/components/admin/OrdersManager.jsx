// src/components/admin/OrdersManager.jsx — Gestion des commandes avec filtres, détail et changement de statut
import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Printer, Eye, ChevronRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { StatusBadge } from '../ui/Badge'
import Modal from '../ui/Modal'

const STATUS_TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: '🟡 En attente' },
  { key: 'confirmed', label: '🔵 Confirmées' },
  { key: 'shipped', label: '🟠 Expédiées' },
  { key: 'delivered', label: '🟢 Livrées' },
  { key: 'cancelled', label: '🔴 Annulées' },
]

const STATUS_TRANSITIONS = {
  pending: [
    { status: 'confirmed', label: 'Confirmer', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { status: 'cancelled', label: 'Annuler', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  ],
  confirmed: [
    { status: 'shipped', label: 'Expédier', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    { status: 'cancelled', label: 'Annuler', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  ],
  shipped: [
    { status: 'delivered', label: 'Marquer livrée', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  ],
  delivered: [],
  cancelled: [],
}

export default function OrdersManager() {
  const { orders, dispatch } = useCart()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const printRef = useRef(null)

  // Filtrage
  const filtered = useMemo(() => {
    return orders
      .filter(o => {
        const matchTab = activeTab === 'all' || o.status === activeTab
        const matchSearch = search === '' ||
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(search.toLowerCase())
        return matchTab && matchSearch
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, activeTab, search])

  const handleStatusChange = (orderId, newStatus) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: newStatus },
    })
  }

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Commande ${order.id}</title>
        <style>
          body { font-family: 'Georgia', serif; color: #0a0a0a; padding: 40px; max-width: 700px; margin: 0 auto; }
          h1 { font-size: 28px; font-weight: 300; letter-spacing: 3px; text-align: center; margin-bottom: 5px; }
          .subtitle { text-align: center; color: #999; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
          .divider { width: 60px; height: 1px; background: #c9a96e; margin: 20px auto; }
          .info-block { margin: 20px 0; padding: 15px; border: 1px solid #eee; }
          .info-block h3 { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 10px; }
          .info-block p { margin: 4px 0; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { text-align: left; padding: 8px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999; border-bottom: 1px solid #eee; }
          td { padding: 8px; font-size: 14px; border-bottom: 1px solid #f5f5f5; }
          .total-row { font-weight: bold; font-size: 16px; }
          .gold { color: #c9a96e; }
          .footer { text-align: center; margin-top: 40px; color: #ccc; font-size: 11px; }
        </style>
      </head>
      <body>
        <h1>SODFA</h1>
        <p class="subtitle">Maison de Parfums de Luxe</p>
        <div class="divider"></div>
        <p style="text-align:center; font-size:12px; color:#999;">Commande N° <span class="gold">${order.id}</span></p>
        <p style="text-align:center; font-size:12px; color:#999;">${new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div class="info-block">
          <h3>Client</h3>
          <p>${order.customer.firstName} ${order.customer.lastName}</p>
          <p>${order.customer.phone}</p>
          <p>${order.customer.address}</p>
          <p>${order.customer.city} ${order.customer.postalCode || ''}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Qté</th>
              <th style="text-align:right">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}${item.sizeML ? ` (${item.sizeML}ml)` : ''}</td>
                <td>${item.quantity}</td>
                <td style="text-align:right">${(item.price * item.quantity).toLocaleString('fr-FR')} MAD</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="2">Sous-total</td>
              <td style="text-align:right">${order.subtotal.toLocaleString('fr-FR')} MAD</td>
            </tr>
            <tr>
              <td colspan="2">Livraison</td>
              <td style="text-align:right">${order.shipping === 0 ? 'Gratuite' : order.shipping + ' MAD'}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">Total</td>
              <td style="text-align:right" class="gold">${order.total.toLocaleString('fr-FR')} MAD</td>
            </tr>
          </tbody>
        </table>

        ${order.customer.note ? `<div class="info-block"><h3>Note</h3><p>${order.customer.note}</p></div>` : ''}

        <p class="footer">SODFA — صُدفة — Maison de Parfums de Luxe</p>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      <h2 className="font-cormorant text-3xl text-sodfa-cream font-light">Commandes</h2>

      {/* Tabs statut */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs tracking-wider uppercase font-jost transition-all duration-300 border ${
              activeTab === tab.key
                ? 'bg-sodfa-gold text-sodfa-black border-sodfa-gold'
                : 'bg-transparent text-sodfa-cream/40 border-sodfa-gold/10 hover:border-sodfa-gold/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sodfa-cream/30" />
        <input
          type="text"
          className="input-sodfa pl-10"
          placeholder="Rechercher par N° commande ou nom client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tableau */}
      <div className="bg-sodfa-charcoal border border-sodfa-gold/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-sodfa-cream/30 text-xs tracking-wider uppercase border-b border-sodfa-gold/10">
              <th className="text-left p-4">N° Commande</th>
              <th className="text-left p-4">Client</th>
              <th className="text-left p-4">Articles</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Statut</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr
                key={order.id}
                className="border-b border-sodfa-gold/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="p-4 text-sodfa-gold font-mono text-xs">{order.id}</td>
                <td className="p-4 text-sodfa-cream">{order.customer.firstName} {order.customer.lastName}</td>
                <td className="p-4 text-sodfa-cream/40">{order.items.length} article{order.items.length > 1 ? 's' : ''}</td>
                <td className="p-4 text-sodfa-cream font-cormorant text-lg">{order.total.toLocaleString('fr-FR')} MAD</td>
                <td className="p-4 text-sodfa-cream/40 text-xs">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="p-4"><StatusBadge status={order.status} /></td>
                <td className="p-4 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}
                    className="p-2 text-sodfa-cream/30 hover:text-sodfa-gold transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sodfa-cream/20">Aucune commande trouvée</div>
        )}
      </div>

      {/* Modal détail commande */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Commande ${selectedOrder?.id || ''}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Infos client */}
            <div className="bg-sodfa-black/40 border border-sodfa-gold/5 p-4">
              <h4 className="text-sodfa-gold text-xs tracking-wider uppercase mb-3">Client</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-sodfa-cream">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                  <p className="text-sodfa-cream/40">{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sodfa-cream/40">{selectedOrder.customer.address}</p>
                  <p className="text-sodfa-cream/40">{selectedOrder.customer.city} {selectedOrder.customer.postalCode}</p>
                </div>
              </div>
              {selectedOrder.customer.note && (
                <p className="text-sodfa-cream/30 text-xs mt-3 italic">Note : {selectedOrder.customer.note}</p>
              )}
            </div>

            {/* Articles */}
            <div className="bg-sodfa-black/40 border border-sodfa-gold/5 p-4">
              <h4 className="text-sodfa-gold text-xs tracking-wider uppercase mb-3">Articles</h4>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-sodfa-gold/5 last:border-0">
                  <div className="w-12 h-12 bg-sodfa-charcoal flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="14" height="10" viewBox="0 0 80 60" fill="none" opacity="0.15">
                          <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sodfa-cream text-sm">{item.name}</p>
                    {item.sizeML && <p className="text-sodfa-cream/30 text-xs">{item.sizeML} ml</p>}
                  </div>
                  <span className="text-sodfa-cream/40 text-sm">×{item.quantity}</span>
                  <span className="text-sodfa-cream text-sm">{(item.price * item.quantity).toLocaleString('fr-FR')} MAD</span>
                </div>
              ))}
              {/* Totaux */}
              <div className="pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-sodfa-cream/40">Sous-total</span>
                  <span className="text-sodfa-cream">{selectedOrder.subtotal.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-sodfa-cream/40">Livraison</span>
                  <span className={selectedOrder.shipping === 0 ? 'text-emerald-400' : 'text-sodfa-cream'}>
                    {selectedOrder.shipping === 0 ? 'Gratuite' : `${selectedOrder.shipping} MAD`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sodfa-gold/10">
                  <span className="text-sodfa-cream font-medium">Total</span>
                  <span className="font-cormorant text-2xl text-sodfa-gold">{selectedOrder.total.toLocaleString('fr-FR')} MAD</span>
                </div>
              </div>
            </div>

            {/* Timeline statut */}
            <div className="bg-sodfa-black/40 border border-sodfa-gold/5 p-4">
              <h4 className="text-sodfa-gold text-xs tracking-wider uppercase mb-4">Historique</h4>
              <div className="space-y-3">
                {selectedOrder.timeline.map((entry, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      i === selectedOrder.timeline.length - 1 ? 'bg-sodfa-gold' : 'bg-sodfa-cream/20'
                    }`} />
                    <StatusBadge status={entry.status} />
                    <span className="text-sodfa-cream/30 text-xs">
                      {new Date(entry.date).toLocaleString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions de changement de statut */}
            <div className="flex flex-wrap gap-3">
              {(STATUS_TRANSITIONS[selectedOrder.status] || []).map(transition => (
                <button
                  key={transition.status}
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, transition.status)
                    // Mettre à jour l'ordre sélectionné
                    setSelectedOrder(prev => ({
                      ...prev,
                      status: transition.status,
                      timeline: [
                        ...prev.timeline,
                        { status: transition.status, date: new Date().toISOString() },
                      ],
                    }))
                  }}
                  className={`border px-6 py-2.5 text-xs tracking-wider uppercase font-jost transition-all duration-300 hover:opacity-80 ${transition.color}`}
                >
                  {transition.label}
                </button>
              ))}
              <button
                onClick={() => handlePrint(selectedOrder)}
                className="border border-sodfa-gold/20 text-sodfa-cream/40 px-6 py-2.5 text-xs tracking-wider uppercase font-jost hover:text-sodfa-gold hover:border-sodfa-gold/50 transition-all duration-300 flex items-center gap-2"
              >
                <Printer size={14} />
                Imprimer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
