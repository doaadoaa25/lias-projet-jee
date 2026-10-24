import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Membres from './pages/Membres'
import Evenements from './pages/Evenements'
import Publications from './pages/Publications'
import Rapport from './pages/Rapport'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page publique */}
        <Route path="/login" element={<Login />} />

        {/* Pages protégées */}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/membres" element={
          <PrivateRoute><Membres /></PrivateRoute>
        } />
        <Route path="/evenements" element={
          <PrivateRoute><Evenements /></PrivateRoute>
        } />
        <Route path="/publications" element={
          <PrivateRoute><Publications /></PrivateRoute>
        } />
        <Route path="/rapport" element={
          <PrivateRoute><Rapport /></PrivateRoute>
        } />

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
