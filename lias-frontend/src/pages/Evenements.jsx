import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const TYPE_CONFIG = {
  CONFERENCE: { bg: '#e6f1fb', color: '#185fa5', label: 'Conférence' },
  SEMINAIRE: { bg: '#eaf3de', color: '#3b6d11', label: 'Séminaire' },
  WORKSHOP: { bg: '#eeedfe', color: '#534ab7', label: 'Workshop' },
}

export default function Evenements() {
  const [evenements, setEvenements] = useState([])
  const [filtre, setFiltre] = useState('TOUS')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titre: '', type: 'CONFERENCE', description: '', dateDebut: '', lieu: '' })
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const canCreate = ['DIRECTEUR', 'PERMANENT', 'VICE_DIRECTEUR'].includes(user.role)

  useEffect(() => {
    api.get('/evenements').then(res => { setEvenements(res.data); setLoading(false) })
  }, [])

  const filtered = filtre === 'TOUS' ? evenements : evenements.filter(e => e.type === filtre)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/evenements', form)
      setEvenements([res.data, ...evenements])
      setShowForm(false)
      setForm({ titre: '', type: 'CONFERENCE', description: '', dateDebut: '', lieu: '' })
    } catch { alert('Erreur lors de la création') }
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.title}>Événements scientifiques</h1>
            <p style={s.subtitle}>{evenements.length} événements enregistrés</p>
          </div>
          {canCreate && (
            <button onClick={() => setShowForm(!showForm)} style={s.addBtn}>
              {showForm ? '✕ Annuler' : '+ Nouvel événement'}
            </button>
          )}
        </div>

        {showForm && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>Créer un nouvel événement</h3>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formRow}>
                <div style={s.formField}>
                  <label style={s.label}>Titre *</label>
                  <input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} style={s.input} required placeholder="Titre de l'événement" />
                </div>
                <div style={s.formField}>
                  <label style={s.label}>Type *</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={s.input}>
                    <option value="CONFERENCE">Conférence</option>
                    <option value="SEMINAIRE">Séminaire</option>
                    <option value="WORKSHOP">Workshop</option>
                  </select>
                </div>
              </div>
              <div style={s.formRow}>
                <div style={s.formField}>
                  <label style={s.label}>Lieu</label>
                  <input value={form.lieu} onChange={e => setForm({...form, lieu: e.target.value})} style={s.input} placeholder="Lieu de l'événement" />
                </div>
                <div style={s.formField}>
                  <label style={s.label}>Date *</label>
                  <input type="date" value={form.dateDebut} onChange={e => setForm({...form, dateDebut: e.target.value})} style={s.input} required />
                </div>
              </div>
              <div style={s.formField}>
                <label style={s.label}>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...s.input, height: '80px', resize: 'vertical'}} placeholder="Description de l'événement" />
              </div>
              <button type="submit" style={s.submitBtn}>✅ Créer l'événement</button>
            </form>
          </div>
        )}

        <div style={s.filtres}>
          {['TOUS', 'CONFERENCE', 'SEMINAIRE', 'WORKSHOP'].map(f => (
            <button key={f} onClick={() => setFiltre(f)}
              style={{ ...s.filtreBtn, ...(filtre === f ? s.filtreBtnActive : {}) }}>
              {f === 'TOUS' ? `Tous (${evenements.length})` : `${TYPE_CONFIG[f]?.label} (${evenements.filter(e => e.type === f).length})`}
            </button>
          ))}
        </div>

        {loading ? <div style={s.loading}>Chargement...</div> : (
          <div style={s.grid}>
            {filtered.map(e => {
              const cfg = TYPE_CONFIG[e.type] || { bg: '#f0f0f0', color: '#666', label: e.type }
              return (
                <div key={e.id} style={s.card}>
                  <div style={s.cardTop}>
                    <span style={{ ...s.typeBadge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    <span style={s.date}>{new Date(e.dateDebut).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <h3 style={s.eventTitle}>{e.titre}</h3>
                  {e.description && <p style={s.eventDesc}>{e.description.substring(0, 100)}...</p>}
                  <div style={s.cardBottom}>
                    {e.lieu && <span style={s.lieu}>📍 {e.lieu}</span>}
                    {e.organisateur && <span style={s.org}>👤 {e.organisateur.prenom} {e.organisateur.nom}</span>}
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && <div style={s.empty}>Aucun événement trouvé</div>}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { background: '#f0f2f5', minHeight: '100vh' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { fontSize: '22px', fontWeight: '600', color: '#0a2342' },
  subtitle: { fontSize: '13px', color: '#888', marginTop: '4px' },
  addBtn: { padding: '10px 20px', background: '#0f6e56', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  formCard: { background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#0a2342', marginBottom: '1.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  input: { padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', background: '#fafafa' },
  submitBtn: { padding: '11px', background: '#0a2342', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', alignSelf: 'flex-start', paddingLeft: '24px', paddingRight: '24px' },
  filtres: { display: 'flex', gap: '8px', marginBottom: '1.5rem' },
  filtreBtn: { padding: '7px 16px', border: '1.5px solid #ddd', borderRadius: '20px', background: 'white', fontSize: '13px', color: '#555' },
  filtreBtnActive: { background: '#0a2342', color: 'white', borderColor: '#0a2342' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  typeBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: '600' },
  date: { fontSize: '12px', color: '#888' },
  eventTitle: { fontSize: '15px', fontWeight: '600', color: '#0a2342', marginBottom: '8px', lineHeight: '1.4' },
  eventDesc: { fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '12px' },
  cardBottom: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  lieu: { fontSize: '12px', color: '#888' },
  org: { fontSize: '12px', color: '#888' },
  loading: { textAlign: 'center', padding: '3rem', color: '#888' },
  empty: { gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#888' },
}
