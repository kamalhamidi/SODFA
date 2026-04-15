// src/components/admin/Dashboard.jsx — Tableau de bord admin avec KPI, graphique et alertes
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Clock, TrendingUp, Package, AlertTriangle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useStore } from '../../context/StoreContext'
import { StatusBadge } from '../ui/Badge'

// Animation count-up
function CountUp({ end, duration = 1500, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Easing: easeOutExpo
      const eased = 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(eased * end))
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate)
      }
    }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [end, duration])

  return <span>{prefix}{count.toLocaleString('fr-FR')}{suffix}</span>
}

// Mini graphique barres SVG (7 derniers jours)
function MiniBarChart({ orders }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const data = days.map(day => {
    const dayOrders = orders.filter(o => {
      const od = new Date(o.createdAt)
      return od.toDateString() === day.toDateString() && o.status !== 'cancelled'
    })
    return {
      label: day.toLocaleDateString('fr-FR', { weekday: 'short' }),
      value: dayOrders.reduce((sum, o) => sum + o.total, 0),
    }
  })

  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barWidth = 30
  const gap = 12
  const chartHeight = 120
  const chartWidth = data.length * (barWidth + gap)

  return (
    <div className="bg-sodfa-black/40 border border-sodfa-gold/5 p-6">
      <h4 className="text-sodfa-cream/60 text-xs tracking-wider uppercase mb-4">Revenus — 7 derniers jours</h4>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} className="w-full max-w-sm">
        {data.map((d, i) => {
          const barHeight = (d.value / maxVal) * chartHeight
          const x = i * (barWidth + gap)
          return (
            <g key={i}>
              <motion.rect
                x={x}
                y={chartHeight - barHeight}
                width={barWidth}
                height={barHeight}
                fill="url(#goldGradient)"
                rx="2"
                initial={{ height: 0, y: chartHeight }}
                animate={{ height: barHeight, y: chartHeight - barHeight }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight + 16}
                textAnchor="middle"
                className="fill-sodfa-cream/30 text-[9px]"
              >
                {d.label}
              </text>
              {d.value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - barHeight - 6}
                  textAnchor="middle"
                  className="fill-sodfa-gold/60 text-[8px]"
                >
                  {(d.value / 1000).toFixed(1)}k
                </text>
              )}
            </g>
          )
        })}
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a96e" />
            <stop offset="100%" stopColor="#c9a96e" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default function Dashboard() {
  const { orders, orderStats } = useCart()
  const { activeProducts, lowStockProducts } = useStore()

  // 5 dernières commandes
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const kpis = [
    {
      label: 'Total commandes',
      value: orderStats.total,
      icon: ShoppingCart,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'En attente',
      value: orderStats.pending,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Revenu du mois',
      value: orderStats.monthRevenue,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      suffix: ' MAD',
    },
    {
      label: 'Produits actifs',
      value: activeProducts.length,
      icon: Package,
      color: 'text-sodfa-gold',
      bgColor: 'bg-sodfa-gold/10',
    },
  ]

  return (
    <div className="space-y-8">
      <h2 className="font-cormorant text-3xl text-sodfa-cream font-light">Tableau de bord</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-sodfa-charcoal border border-sodfa-gold/5 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${kpi.bgColor} flex items-center justify-center`}>
                <kpi.icon size={18} className={kpi.color} />
              </div>
            </div>
            <p className="font-cormorant text-3xl text-sodfa-cream">
              <CountUp end={kpi.value} suffix={kpi.suffix || ''} />
            </p>
            <p className="text-sodfa-cream/30 text-xs tracking-wider uppercase mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique */}
        <div className="lg:col-span-2">
          <MiniBarChart orders={orders} />
        </div>

        {/* Alertes stock */}
        <div className="bg-sodfa-black/40 border border-sodfa-gold/5 p-6">
          <h4 className="text-sodfa-cream/60 text-xs tracking-wider uppercase mb-4 flex items-center gap-2">
            <AlertTriangle size={14} className="text-orange-400" />
            Alertes stock
          </h4>
          {lowStockProducts.length === 0 ? (
            <p className="text-sodfa-cream/20 text-sm">Aucune alerte</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-sodfa-gold/5 last:border-0">
                  <span className="text-sodfa-cream text-sm">{p.name}</span>
                  <span className="text-red-400 text-xs font-medium">{p.stock} restant{p.stock > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="bg-sodfa-black/40 border border-sodfa-gold/5 p-6">
        <h4 className="text-sodfa-cream/60 text-xs tracking-wider uppercase mb-4">5 dernières commandes</h4>
        {recentOrders.length === 0 ? (
          <p className="text-sodfa-cream/20 text-sm">Aucune commande pour le moment</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-sodfa-cream/30 text-xs tracking-wider uppercase border-b border-sodfa-gold/10">
                  <th className="text-left py-3 pr-4">Commande</th>
                  <th className="text-left py-3 pr-4">Client</th>
                  <th className="text-left py-3 pr-4">Total</th>
                  <th className="text-left py-3 pr-4">Date</th>
                  <th className="text-left py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-sodfa-gold/5 last:border-0">
                    <td className="py-3 pr-4 text-sodfa-gold font-mono text-xs">{order.id}</td>
                    <td className="py-3 pr-4 text-sodfa-cream">{order.customer.firstName} {order.customer.lastName}</td>
                    <td className="py-3 pr-4 text-sodfa-cream">{order.total.toLocaleString('fr-FR')} MAD</td>
                    <td className="py-3 pr-4 text-sodfa-cream/40">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
