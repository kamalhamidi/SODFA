// src/context/AdminContext.jsx — Contexte pour l'authentification admin
import { createContext, useContext, useState, useCallback } from 'react'

const ADMIN_PASSWORD = 'sodfa2024'
const TOKEN_KEY = 'sodfa_admin_token'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(TOKEN_KEY) === 'authenticated'
  })

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(TOKEN_KEY, 'authenticated')
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setIsAuthenticated(false)
  }, [])

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin doit être utilisé à l\'intérieur de AdminProvider')
  }
  return context
}

export default AdminContext
