// src/context/CartContext.jsx — Contexte pour le panier et les commandes
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Frais de livraison
const SHIPPING_THRESHOLD = 500 // Gratuit dès 500 MAD
const SHIPPING_COST = 40 // 40 MAD

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && item.sizeML === action.payload.sizeML
      )
      if (existingIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        }
        return { ...state, items: updatedItems }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((_, index) => index !== action.payload),
      }

    case 'UPDATE_QUANTITY': {
      const items = [...state.items]
      if (action.payload.quantity <= 0) {
        items.splice(action.payload.index, 1)
      } else {
        items[action.payload.index] = {
          ...items[action.payload.index],
          quantity: action.payload.quantity,
        }
      }
      return { ...state, items }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] }

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.orderId
            ? {
                ...o,
                status: action.payload.status,
                timeline: [
                  ...o.timeline,
                  { status: action.payload.status, date: new Date().toISOString() },
                ],
              }
            : o
        ),
      }

    default:
      return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [savedCart, setSavedCart] = useLocalStorage('sodfa_cart', [])
  const [savedOrders, setSavedOrders] = useLocalStorage('sodfa_orders', [])

  const [state, dispatch] = useReducer(cartReducer, {
    items: savedCart,
    orders: savedOrders,
  })

  // Synchroniser avec localStorage
  useEffect(() => {
    setSavedCart(state.items)
  }, [state.items, setSavedCart])

  useEffect(() => {
    setSavedOrders(state.orders)
  }, [state.orders, setSavedOrders])

  // Calculs dérivés
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  // Créer une commande
  const createOrder = useCallback((customerInfo) => {
    const orderNumber = `SODFA-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`
    const order = {
      id: orderNumber,
      customer: customerInfo,
      items: [...state.items],
      subtotal,
      shipping,
      total,
      status: 'pending',
      timeline: [
        { status: 'pending', date: new Date().toISOString() },
      ],
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_ORDER', payload: order })
    dispatch({ type: 'CLEAR_CART' })
    return order
  }, [state.items, subtotal, shipping, total])

  // Stats pour le dashboard
  const orderStats = {
    total: state.orders.length,
    pending: state.orders.filter(o => o.status === 'pending').length,
    confirmed: state.orders.filter(o => o.status === 'confirmed').length,
    shipped: state.orders.filter(o => o.status === 'shipped').length,
    delivered: state.orders.filter(o => o.status === 'delivered').length,
    cancelled: state.orders.filter(o => o.status === 'cancelled').length,
    monthRevenue: state.orders
      .filter(o => {
        const orderDate = new Date(o.createdAt)
        const now = new Date()
        return orderDate.getMonth() === now.getMonth() &&
               orderDate.getFullYear() === now.getFullYear() &&
               o.status !== 'cancelled'
      })
      .reduce((sum, o) => sum + o.total, 0),
  }

  return (
    <CartContext.Provider value={{
      items: state.items,
      orders: state.orders,
      itemCount,
      subtotal,
      shipping,
      total,
      orderStats,
      dispatch,
      createOrder,
      SHIPPING_THRESHOLD,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur de CartProvider')
  }
  return context
}

export default CartContext
