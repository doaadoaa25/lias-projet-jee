import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Accueil from './pages/Accueil'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Membres from './pages/Membres'
import Evenements from './pages/Evenements'
import Publications from './pages/Publications'
import Rapport from './pages/Rapport'
import Materiel from './pages/Materiel'
import Adhesions from './pages/Adhesions'
import Conventions from './pages/Conventions'
import Communication from './pages/Communication'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/membres" element={<PrivateRoute><Membres /></PrivateRoute>} />
        <Route path="/evenements" element={<PrivateRoute><Evenements /></PrivateRoute>} />
        <Route path="/publications" element={<PrivateRoute><Publications /></PrivateRoute>} />
        <Route path="/rapport" element={<PrivateRoute><Rapport /></PrivateRoute>} />
        <Route path="/materiel" element={<PrivateRoute><Materiel /></PrivateRoute>} />
        <Route path="/adhesions" element={<PrivateRoute><Adhesions /></PrivateRoute>} />
        <Route path="/conventions" element={<PrivateRoute><Conventions /></PrivateRoute>} />
        <Route path="/communication" element={<PrivateRoute><Communication /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
