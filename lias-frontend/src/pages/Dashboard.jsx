import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState({ membres: 0, publications: 0, evenements: 0 })
  const [publications, setPublications] = useState([])
  const [evenements, setEvenements] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    Promise.all([
      api.get('/membres'),
      api.get('/publications'),
      api.get('/evenements'),
    ]).then(([m, p, e]) => {
      setStats({ membres: m.data.length, publications: p.data.length, evenements: e.data.length })
      setPublications(p.data.slice(0, 4))
      setEvenements(e.data.slice(0, 4))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const typeColor = { CONFERENCE: '#185fa5', SEMINAIRE: '#3b6d11', WORKSHOP: '#534ab7' }
  const typeBg = { CONFERENCE: '#e6f1fb', SEMINAIRE: '#eaf3de', WORKSHOP: '#eeedfe' }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>

        {/* Bannière bienvenue */}
        <div style={s.banner}>
          <div>
            <div style={s.bannerTitle}>Bonjour, {user.nomComplet} 👋</div>
            <div style={s.bannerSub}>Tableau de bord — Laboratoire d'Intelligence Artificielle et Systèmes</div>
          </div>
          <div style={s.bannerStats}>
            {[['230+', 'Publications indexées'], ['42', 'Thèses en cours'], ['4', 'Équipes'], ['14', 'Permanents']].map(([v, l]) => (
              <div key={l} style={s.bannerStat}>
                <div style={s.bannerStatVal}>{v}</div>
                <div style={s.bannerStatLab}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cartes stats */}
        {!loading && (
          <div style={s.grid4}>
            {[
              { label: 'Membres actifs', val: stats.membres, bg: '#e6f1fb', color: '#185fa5', icon: '👥' },
              { label: 'Publications', val: stats.publications, bg: '#eeedfe', color: '#534ab7', icon: '📚' },
              { label: 'Événements', val: stats.evenements, bg: '#eaf3de', color: '#3b6d11', icon: '📅' },
              { label: 'Doctorants', val: '42+', bg: '#faeeda', color: '#854f0b', icon: '🎓' },
            ].map(c => (
              <div key={c.label} style={s.statCard}>
                <div style={{ ...s.statIcon, background: c.bg }}>
                  <span style={{ fontSize: '22px' }}>{c.icon}</span>
                </div>
                <div>
                  <div style={{ ...s.statVal, color: c.color }}>{c.val}</div>
                  <div style={s.statLab}>{c.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={s.grid2}>
          {/* Événements */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardTitle}>📅 Événements récents</div>
              <a href="/evenements" style={s.seeAll}>Voir tout →</a>
            </div>
            {evenements.length === 0 && <p style={s.empty}>Aucun événement</p>}
            {evenements.map(e => (
              <div key={e.id} style={s.eventItem}>
                <div style={{ ...s.eventDot, background: typeColor[e.type] || '#888' }} />
                <div style={{ flex: 1 }}>
                  <div style={s.eventTitle}>{e.titre}</div>
                  <div style={s.eventMeta}>
                    {e.lieu && `📍 ${e.lieu} · `}
                    {new Date(e.dateDebut).toLocaleDateString('fr-FR')}
                    <span style={{ ...s.typeBadge, background: typeBg[e.type], color: typeColor[e.type] }}>
                      {e.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Publications */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardTitle}>📚 Publications récentes</div>
              <a href="/publications" style={s.seeAll}>Voir tout →</a>
            </div>
            {publications.length === 0 && <p style={s.empty}>Aucune publication</p>}
            {publications.map(p => (
              <div key={p.id} style={s.pubItem}>
                <div style={s.pubTitle}>{p.titre}</div>
                <div style={s.pubMeta}>
                  {p.membre && `${p.membre.prenom} ${p.membre.nom} · `}
                  <span style={s.pubYear}>{p.annee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

const s = {
  page: { background: '#f0f2f5', minHeight: '100vh' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  banner: {
    background: 'linear-gradient(135deg, #0a2342 0%, #0f6e56 100%)',
    borderRadius: '14px',
    padding: '2rem 2.5rem',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: { color: 'white', fontSize: '22px', fontWeight: '600', marginBottom: '6px' },
  bannerSub: { color: 'rgba(255,255,255,0.65)', fontSize: '13px' },
  bannerStats: { display: 'flex', gap: '2.5rem' },
  bannerStat: { textAlign: 'center' },
  bannerStatVal: { color: 'white', fontSize: '26px', fontWeight: '700' },
  bannerStatLab: { color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '3px' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '1.5rem' },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  statIcon: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statVal: { fontSize: '24px', fontWeight: '700' },
  statLab: { fontSize: '12px', color: '#888', marginTop: '2px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#0a2342' },
  seeAll: { fontSize: '13px', color: '#0f6e56', fontWeight: '500' },
  eventItem: { display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'flex-start' },
  eventDot: { width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0 },
  eventTitle: { fontSize: '13px', fontWeight: '500', color: '#1a1a2e', marginBottom: '4px' },
  eventMeta: { fontSize: '12px', color: '#888' },
  typeBadge: { marginLeft: '8px', fontSize: '10px', padding: '2px 7px', borderRadius: '8px', fontWeight: '600' },
  pubItem: { padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  pubTitle: { fontSize: '13px', fontWeight: '500', color: '#1a1a2e', marginBottom: '4px', lineHeight: '1.4' },
  pubMeta: { fontSize: '12px', color: '#888' },
  pubYear: { background: '#e6f1fb', color: '#185fa5', padding: '1px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
  empty: { color: '#aaa', fontSize: '13px', padding: '1rem 0' },
}
