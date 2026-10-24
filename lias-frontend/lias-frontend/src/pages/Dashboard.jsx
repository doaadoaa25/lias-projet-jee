import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [membres, publications, evenements] = await Promise.all([
          api.get('/membres'),
          api.get('/publications'),
          api.get('/evenements'),
        ])
        setStats({
          membres: membres.data.length,
          publications: publications.data.length,
          evenements: evenements.data.length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Membres actifs', value: stats?.membres, icon: '👥', color: '#1e3a5f' },
    { label: 'Publications', value: stats?.publications, icon: '📚', color: '#2d6a4f' },
    { label: 'Événements', value: stats?.evenements, icon: '📅', color: '#8e44ad' },
  ]

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        {/* Bienvenue */}
        <div style={styles.welcome}>
          <h1 style={styles.welcomeTitle}>
            Bonjour, {user.nomComplet} 👋
          </h1>
          <p style={styles.welcomeSub}>
            Bienvenue sur la plateforme du laboratoire LIAS
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div style={styles.grid}>
            {cards.map((card) => (
              <div key={card.label} style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}>
                <div style={styles.cardIcon}>{card.icon}</div>
                <div style={{ ...styles.cardValue, color: card.color }}>{card.value}</div>
                <div style={styles.cardLabel}>{card.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Liens rapides */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Accès rapide</h2>
          <div style={styles.quickLinks}>
            {[
              { href: '/membres', icon: '👥', label: 'Voir les membres' },
              { href: '/evenements', icon: '📅', label: 'Voir les événements' },
              { href: '/publications', icon: '📚', label: 'Voir les publications' },
            ].map(link => (
              <a key={link.href} href={link.href} style={styles.quickLink}>
                <span style={styles.quickIcon}>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  welcome: {
    marginBottom: '32px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e3a5f',
    margin: '0 0 8px',
  },
  welcomeSub: {
    color: '#666',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '40px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '28px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  cardIcon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  cardValue: {
    fontSize: '42px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  cardLabel: {
    color: '#666',
    fontSize: '14px',
  },
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e3a5f',
    margin: '0 0 20px',
  },
  quickLinks: {
    display: 'flex',
    gap: '16px',
  },
  quickLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 20px',
    background: '#f5f7fa',
    borderRadius: '10px',
    textDecoration: 'none',
    color: '#1e3a5f',
    fontWeight: '500',
    fontSize: '15px',
  },
  quickIcon: {
    fontSize: '20px',
  },
}
