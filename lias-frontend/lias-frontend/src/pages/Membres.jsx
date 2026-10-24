import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function Membres() {
  const [membres, setMembres] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/membres').then(res => {
      setMembres(res.data)
      setLoading(false)
    })
  }, [])

  const filtres = membres.filter(m =>
    `${m.nom} ${m.prenom} ${m.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const statutColor = {
    PERMANENT: '#2d6a4f',
    ASSOCIE: '#8e44ad',
    DOCTORANT: '#e67e22',
    RETRAITE: '#95a5a6',
    ANCIEN_MEMBRE: '#e74c3c',
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👥 Membres du laboratoire</h1>
          <input
            placeholder="🔍 Rechercher un membre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.search}
          />
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div style={styles.grid}>
            {filtres.map(m => (
              <div key={m.id} style={styles.card}>
                <div style={styles.avatar}>
                  {m.photoUrl
                    ? <img src={m.photoUrl} alt="" style={styles.avatarImg} />
                    : <span style={styles.avatarLetter}>
                        {m.prenom?.[0]}{m.nom?.[0]}
                      </span>
                  }
                </div>
                <div style={styles.info}>
                  <h3 style={styles.name}>{m.prenom} {m.nom}</h3>
                  <p style={styles.email}>{m.email}</p>
                  <span style={{
                    ...styles.badge,
                    background: statutColor[m.statut] || '#666'
                  }}>
                    {m.statut}
                  </span>
                  {m.etablissementOrigine && (
                    <p style={styles.etablissement}>🏛️ {m.etablissementOrigine}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtres.length === 0 && (
          <div style={styles.empty}>
            <p>Aucun membre trouvé pour "{search}"</p>
          </div>
        )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e3a5f',
    margin: 0,
  },
  search: {
    padding: '10px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    width: '280px',
    outline: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#1e3a5f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarImg: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarLetter: {
    color: 'white',
    fontWeight: '700',
    fontSize: '18px',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e3a5f',
    margin: '0 0 4px',
  },
  email: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 8px',
  },
  badge: {
    display: 'inline-block',
    color: 'white',
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '12px',
    fontWeight: '600',
  },
  etablissement: {
    fontSize: '13px',
    color: '#888',
    margin: '8px 0 0',
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    color: '#666',
  },
}
