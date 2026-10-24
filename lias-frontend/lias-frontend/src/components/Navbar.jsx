import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const links = [
    { to: '/dashboard', label: '🏠 Accueil' },
    { to: '/membres', label: '👥 Membres' },
    { to: '/evenements', label: '📅 Événements' },
    { to: '/publications', label: '📚 Publications' },
    ...(user.role === 'DIRECTEUR' ? [{ to: '/rapport', label: '📊 Rapport' }] : []),
  ]

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        🔬 <span style={styles.brandText}>LIAS</span>
      </div>

      <div style={styles.links}>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              ...styles.link,
              ...(location.pathname === link.to ? styles.activeLink : {})
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div style={styles.user}>
        <span style={styles.userName}>👤 {user.nomComplet}</span>
        <span style={styles.role}>{user.role}</span>
        <button onClick={logout} style={styles.logoutBtn}>
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '64px',
    background: '#1e3a5f',
    color: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: '20px',
    fontWeight: '700',
  },
  brandText: {
    marginLeft: '8px',
  },
  links: {
    display: 'flex',
    gap: '8px',
  },
  link: {
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  activeLink: {
    color: 'white',
    background: 'rgba(255,255,255,0.15)',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontSize: '14px',
  },
  role: {
    fontSize: '12px',
    background: 'rgba(255,255,255,0.2)',
    padding: '3px 8px',
    borderRadius: '12px',
  },
  logoutBtn: {
    padding: '6px 14px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
}
