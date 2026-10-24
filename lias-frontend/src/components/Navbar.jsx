import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => { localStorage.clear(); navigate('/') }
  const initiales = (nom) => nom ? nom.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() : 'U'

  const links = [
    { to: '/dashboard', label: 'Accueil' },
    { to: '/membres', label: 'Membres' },
    { to: '/evenements', label: 'Événements' },
    { to: '/publications', label: 'Publications' },
    { to: '/materiel', label: 'Matériel' },
    { to: '/conventions', label: 'Conventions' },
    { to: '/communication', label: '💬' },
    ...(user.role === 'DIRECTEUR' ? [
      { to: '/adhesions', label: 'Adhésions' },
      { to: '/rapport', label: 'Rapport' },
    ] : []),
  ]

  return (
    <nav style={s.nav}>
      <div style={s.brand}>
        <div style={s.logo}>LIAS</div>
        <div>
          <div style={s.brandTitle}>Laboratoire LIAS</div>
          <div style={s.brandSub}>FSBM — Hassan II</div>
        </div>
      </div>
      <div style={s.links}>
        {links.map(link => (
          <Link key={link.to} to={link.to} style={{...s.link,...(location.pathname===link.to?s.activeLink:{})}}>
            {link.label}
          </Link>
        ))}
      </div>
      <div style={s.userSection}>
        <div style={s.avatar}>{initiales(user.nomComplet)}</div>
        <div>
          <div style={s.userName}>{user.nomComplet}</div>
          <span style={s.badge}>{user.role}</span>
        </div>
        <button onClick={logout} style={s.logoutBtn}>Déco.</button>
      </div>
    </nav>
  )
}

const s = {
  nav:{background:'#0a2342',padding:'0 1.5rem',height:'62px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 8px rgba(0,0,0,0.25)'},
  brand:{display:'flex',alignItems:'center',gap:'10px'},
  logo:{background:'white',color:'#0a2342',fontWeight:'700',fontSize:'12px',width:'38px',height:'38px',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center'},
  brandTitle:{color:'white',fontSize:'13px',fontWeight:'600'},brandSub:{color:'rgba(255,255,255,0.5)',fontSize:'10px'},
  links:{display:'flex',gap:'2px'},
  link:{color:'rgba(255,255,255,0.65)',padding:'6px 10px',borderRadius:'6px',fontSize:'12px',fontWeight:'500',textDecoration:'none'},
  activeLink:{color:'white',background:'rgba(255,255,255,0.12)'},
  userSection:{display:'flex',alignItems:'center',gap:'8px'},
  avatar:{width:'32px',height:'32px',borderRadius:'50%',background:'#0f6e56',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'600'},
  userName:{color:'rgba(255,255,255,0.9)',fontSize:'12px',fontWeight:'500'},
  badge:{background:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.75)',fontSize:'10px',padding:'2px 6px',borderRadius:'10px'},
  logoutBtn:{background:'rgba(231,76,60,0.2)',color:'#ff8a80',border:'1px solid rgba(231,76,60,0.3)',padding:'5px 10px',borderRadius:'6px',fontSize:'11px',cursor:'pointer'},
}
