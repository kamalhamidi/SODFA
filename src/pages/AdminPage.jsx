// src/pages/AdminPage.jsx — Wrapper de la page admin avec protection de route
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import AdminLayout from '../components/layout/AdminLayout'

export default function AdminPage() {
  const { isAuthenticated } = useAdmin()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <AdminLayout />
}
