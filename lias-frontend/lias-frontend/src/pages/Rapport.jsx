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
    } catch (err) {
      alert('Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  const consulter = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/rapports/${annee}`)
      setRapport(res.data)
    } catch (err) {
      alert('Erreur lors de la consultation')
    } finally {
      setLoading(false)
    }
  }

  const stats = rapport ? [
    { label: 'Membres actifs', value: rapport.totalMembres, icon: '👥', color: '#1e3a5f' },
    { label: 'Permanents', value: rapport.totalPermanents, icon: '🎓', color: '#2d6a4f' },
    { label: 'Doctorants', value: rapport.totalDoctorants, icon: '📖', color: '#8e44ad' },
    { label: 'Publications', value: rapport.totalPublications, icon: '📚', color: '#e67e22' },
    { label: 'Événements', value: rapport.totalEvenements, icon: '📅', color: '#e74c3c' },
    { label: 'Conférences', value: rapport.totalConferences, icon: '🎤', color: '#3498db' },
  ] : []

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>📊 Rapport d'activité annuel</h1>

        {/* Contrôles */}
        <div style={styles.controls}>
          <input type="number" value={annee}
            onChange={e => setAnnee(parseInt(e.target.value))}
            style={styles.yearInput} min="2000" max="2099" />
          <button onClick={consulter} style={styles.btnSecondary} disabled={loading}>
            👁️ Consulter
          </button>
          <button onClick={generer} style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Génération...' : '⚡ Générer'}
          </button>
        </div>

        {/* Rapport */}
        {rapport && (
          <div>
            {/* Résumé */}
            <div style={styles.resumeCard}>
              <h2 style={styles.resumeTitle}>Rapport {rapport.annee}</h2>
              <p style={styles.resumeText}>{rapport.resume}</p>
            </div>

            {/* Stats */}
            <div style={styles.grid}>
              {stats.map(s => (
                <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
                  <div style={styles.statIcon}>{s.icon}</div>
                  <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Publications */}
            {rapport.publications?.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>📚 Publications {rapport.annee}</h3>
                {rapport.publications.map(p => (
                  <div key={p.id} style={styles.item}>
                    <span style={styles.itemTitle}>{p.titre}</span>
                    <span style={styles.itemMeta}>{p.type} — {p.annee}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Événements */}
            {rapport.evenements?.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>📅 Événements {rapport.annee}</h3>
                {rapport.evenements.map(e => (
                  <div key={e.id} style={styles.item}>
                    <span style={styles.itemTitle}>{e.titre}</span>
                    <span style={styles.itemMeta}>{e.type} — {new Date(e.dateDebut).toLocaleDateString('fr-FR')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!rapport && !loading && (
          <div style={styles.empty}>
            <p>📋 Sélectionne une année et clique sur "Consulter" ou "Générer"</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1e3a5f', marginBottom: '28px' },
  controls: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px' },
  yearInput: { padding: '10px 16px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', width: '120px', outline: 'none' },
  btnPrimary: { padding: '10px 24px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  btnSecondary: { padding: '10px 24px', background: 'white', color: '#1e3a5f', border: '2px solid #1e3a5f', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  resumeCard: { background: 'linear-gradient(135deg, #1e3a5f, #2d6a4f)', color: 'white', borderRadius: '12px', padding: '28px', marginBottom: '24px' },
  resumeTitle: { fontSize: '22px', fontWeight: '700', margin: '0 0 12px' },
  resumeText: { fontSize: '15px', lineHeight: '1.7', margin: 0, opacity: 0.9 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' },
  statCard: { background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  statIcon: { fontSize: '32px', marginBottom: '10px' },
  statValue: { fontSize: '36px', fontWeight: '700', marginBottom: '6px' },
  statLabel: { color: '#666', fontSize: '13px' },
  section: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1e3a5f', margin: '0 0 16px' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  itemTitle: { fontSize: '15px', color: '#333', fontWeight: '500' },
  itemMeta: { fontSize: '13px', color: '#888' },
  empty: { textAlign: 'center', padding: '80px', color: '#666', background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
}
