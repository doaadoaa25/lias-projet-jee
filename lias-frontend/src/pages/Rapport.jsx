import { useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function Rapport() {
  const [rapport, setRapport] = useState(null)
  const [annee, setAnnee] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)

  const generer = async () => {
    setLoading(true)
    try {
      const res = await api.post(`/rapports/generer/${annee}`)
      setRapport(res.data)
    } catch { alert('Erreur lors de la génération') }
    finally { setLoading(false) }
  }

  const consulter = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/rapports/${annee}`)
      setRapport(res.data)
    } catch { alert('Rapport non disponible pour cette année') }
    finally { setLoading(false) }
  }

  const statCards = rapport ? [
    { label: 'Membres actifs', val: rapport.totalMembres, icon: '👥', bg: '#e6f1fb', color: '#185fa5' },
    { label: 'Permanents', val: rapport.totalPermanents, icon: '🎓', bg: '#eaf3de', color: '#3b6d11' },
    { label: 'Associés', val: rapport.totalAssocies, icon: '🤝', bg: '#eeedfe', color: '#534ab7' },
    { label: 'Doctorants', val: rapport.totalDoctorants, icon: '📖', bg: '#faeeda', color: '#854f0b' },
    { label: 'Publications', val: rapport.totalPublications, icon: '📚', bg: '#e6f1fb', color: '#185fa5' },
    { label: 'Événements', val: rapport.totalEvenements, icon: '📅', bg: '#eaf3de', color: '#3b6d11' },
    { label: 'Conférences', val: rapport.totalConferences, icon: '🎤', bg: '#eeedfe', color: '#534ab7' },
    { label: 'Séminaires', val: rapport.totalSeminaires, icon: '📡', bg: '#faeeda', color: '#854f0b' },
  ] : []

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.title}>Rapport d'activité annuel</h1>
            <p style={s.subtitle}>Générez et consultez les rapports d'activité du laboratoire</p>
          </div>
        </div>

        <div style={s.controls}>
          <div style={s.controlsInner}>
            <label style={s.controlLabel}>Année du rapport</label>
            <input type="number" value={annee} onChange={e => setAnnee(parseInt(e.target.value))}
              style={s.yearInput} min="2000" max="2099" />
            <button onClick={consulter} style={s.btnOutline} disabled={loading}>
              👁️ Consulter
            </button>
            <button onClick={generer} style={s.btnPrimary} disabled={loading}>
              {loading ? 'Génération...' : '⚡ Générer le rapport'}
            </button>
          </div>
        </div>

        {rapport && (
          <div>
            <div style={s.banner}>
              <div style={s.bannerLeft}>
                <div style={s.bannerIcon}>📊</div>
                <div>
                  <h2 style={s.bannerTitle}>Rapport d'activité {rapport.annee}</h2>
                  <p style={s.bannerText}>{rapport.resume}</p>
                </div>
              </div>
            </div>

            <div style={s.grid4}>
              {statCards.map(c => (
                <div key={c.label} style={s.statCard}>
                  <div style={{ ...s.statIcon, background: c.bg }}>
                    <span style={{ fontSize: '20px' }}>{c.icon}</span>
                  </div>
                  <div>
                    <div style={{ ...s.statVal, color: c.color }}>{c.val}</div>
                    <div style={s.statLab}>{c.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={s.grid2}>
              {rapport.publications?.length > 0 && (
                <div style={s.card}>
                  <h3 style={s.cardTitle}>📚 Publications {rapport.annee}</h3>
                  {rapport.publications.map(p => (
                    <div key={p.id} style={s.listItem}>
                      <div style={s.listTitle}>{p.titre}</div>
                      <div style={s.listMeta}>{p.type} · {p.annee}</div>
                    </div>
                  ))}
                </div>
              )}
              {rapport.evenements?.length > 0 && (
                <div style={s.card}>
                  <h3 style={s.cardTitle}>📅 Événements {rapport.annee}</h3>
                  {rapport.evenements.map(e => (
                    <div key={e.id} style={s.listItem}>
                      <div style={s.listTitle}>{e.titre}</div>
                      <div style={s.listMeta}>{e.type} · {new Date(e.dateDebut).toLocaleDateString('fr-FR')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!rapport && !loading && (
          <div style={s.empty}>
            <div style={s.emptyIcon}>📋</div>
            <p style={s.emptyText}>Sélectionnez une année et cliquez sur "Consulter" ou "Générer"</p>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { background: '#f0f2f5', minHeight: '100vh' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  pageHeader: { marginBottom: '1.5rem' },
  title: { fontSize: '22px', fontWeight: '600', color: '#0a2342' },
  subtitle: { fontSize: '13px', color: '#888', marginTop: '4px' },
  controls: { background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  controlsInner: { display: 'flex', alignItems: 'center', gap: '12px' },
  controlLabel: { fontSize: '14px', fontWeight: '600', color: '#444' },
  yearInput: { padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '15px', width: '110px', background: '#fafafa' },
  btnPrimary: { padding: '10px 22px', background: '#0a2342', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  btnOutline: { padding: '10px 22px', background: 'white', color: '#0a2342', border: '1.5px solid #0a2342', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  banner: { background: 'linear-gradient(135deg, #0a2342, #0f6e56)', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', color: 'white' },
  bannerLeft: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
  bannerIcon: { fontSize: '40px' },
  bannerTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '8px' },
  bannerText: { fontSize: '14px', opacity: 0.8, lineHeight: '1.6' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '1.5rem' },
  statCard: { background: 'white', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  statIcon: { width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statVal: { fontSize: '22px', fontWeight: '700' },
  statLab: { fontSize: '12px', color: '#888', marginTop: '2px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#0a2342', marginBottom: '1rem' },
  listItem: { padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  listTitle: { fontSize: '13px', fontWeight: '500', color: '#1a1a2e', marginBottom: '3px' },
  listMeta: { fontSize: '12px', color: '#888' },
  empty: { background: 'white', borderRadius: '12px', padding: '4rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  emptyIcon: { fontSize: '48px', marginBottom: '1rem' },
  emptyText: { color: '#888', fontSize: '14px' },
}
