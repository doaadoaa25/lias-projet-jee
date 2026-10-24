import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function Publications() {
  const [publications, setPublications] = useState([])
  const [annees, setAnnees] = useState([])
  const [filtreAnnee, setFiltreAnnee] = useState('TOUTES')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titre: '', resume: '', url: '', type: 'Article', annee: new Date().getFullYear() })

  useEffect(() => {
    Promise.all([api.get('/publications'), api.get('/publications/annees')])
      .then(([p, a]) => { setPublications(p.data); setAnnees(a.data); setLoading(false) })
  }, [])

  const filtered = publications
    .filter(p => filtreAnnee === 'TOUTES' || p.annee === parseInt(filtreAnnee))
    .filter(p => p.titre?.toLowerCase().includes(search.toLowerCase()))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/publications', form)
      setPublications([res.data, ...publications])
      setShowForm(false)
    } catch { alert('Erreur') }
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.title}>Publications scientifiques</h1>
            <p style={s.subtitle}>{publications.length} publications enregistrées</p>
          </div>
          <div style={s.headerActions}>
            <input placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={s.search} />
            <button onClick={() => setShowForm(!showForm)} style={s.addBtn}>
              {showForm ? '✕' : '+ Ajouter'}
            </button>
          </div>
        </div>

        {showForm && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>Nouvelle publication</h3>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formField}>
                <label style={s.label}>Titre *</label>
                <input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} style={s.input} required placeholder="Titre de la publication" />
              </div>
              <div style={s.formRow}>
                <div style={s.formField}>
                  <label style={s.label}>Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={s.input}>
                    {['Article', 'Thèse', 'Rapport', 'Conférence', 'Livre', 'Chapitre'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={s.formField}>
                  <label style={s.label}>Année *</label>
                  <input type="number" value={form.annee} onChange={e => setForm({...form, annee: parseInt(e.target.value)})} style={s.input} required />
                </div>
              </div>
              <div style={s.formField}>
                <label style={s.label}>URL / DOI</label>
                <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} style={s.input} placeholder="https://doi.org/..." />
              </div>
              <div style={s.formField}>
                <label style={s.label}>Résumé</label>
                <textarea value={form.resume} onChange={e => setForm({...form, resume: e.target.value})} style={{...s.input, height: '80px', resize: 'vertical'}} placeholder="Résumé de la publication" />
              </div>
              <button type="submit" style={s.submitBtn}>✅ Ajouter la publication</button>
            </form>
          </div>
        )}

        <div style={s.toolbar}>
          <div style={s.filtres}>
            {['TOUTES', ...annees].map(a => (
              <button key={a} onClick={() => setFiltreAnnee(String(a))}
                style={{ ...s.filtreBtn, ...(filtreAnnee === String(a) ? s.filtreBtnActive : {}) }}>
                {a === 'TOUTES' ? 'Toutes' : a}
              </button>
            ))}
          </div>
          <span style={s.count}>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
        </div>

        {loading ? <div style={s.loading}>Chargement...</div> : (
          <div style={s.list}>
            {filtered.map((p, i) => (
              <div key={p.id} style={s.card}>
                <div style={s.cardLeft}>
                  <div style={s.cardNum}>{String(i + 1).padStart(2, '0')}</div>
                </div>
                <div style={s.cardContent}>
                  <div style={s.cardTop}>
                    <span style={s.typeBadge}>{p.type || 'Article'}</span>
                    <span style={s.yearBadge}>{p.annee}</span>
                  </div>
                  <h3 style={s.pubTitle}>{p.titre}</h3>
                  {p.resume && <p style={s.resume}>{p.resume.substring(0, 150)}{p.resume.length > 150 ? '...' : ''}</p>}
                  <div style={s.cardBottom}>
                    {p.membre && <span style={s.auteur}>👤 {p.membre.prenom} {p.membre.nom}</span>}
                    {p.equipe && <span style={s.equipe}>🔬 {p.equipe.nom}</span>}
                    {p.url && <a href={p.url} target="_blank" rel="noreferrer" style={s.link}>🔗 Voir la publication</a>}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div style={s.empty}>Aucune publication trouvée</div>}
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
  headerActions: { display: 'flex', gap: '10px', alignItems: 'center' },
  search: { padding: '10px 16px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '240px', background: 'white' },
  addBtn: { padding: '10px 18px', background: '#0f6e56', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  formCard: { background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#0a2342', marginBottom: '1.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  input: { padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', background: '#fafafa' },
  submitBtn: { padding: '11px 24px', background: '#0a2342', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', alignSelf: 'flex-start' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  filtres: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  filtreBtn: { padding: '6px 14px', border: '1.5px solid #ddd', borderRadius: '16px', background: 'white', fontSize: '13px', color: '#555' },
  filtreBtnActive: { background: '#0a2342', color: 'white', borderColor: '#0a2342' },
  count: { fontSize: '13px', color: '#888' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', gap: '16px' },
  cardLeft: { display: 'flex', alignItems: 'flex-start', paddingTop: '2px' },
  cardNum: { fontSize: '22px', fontWeight: '700', color: '#e0e0e0', minWidth: '32px' },
  cardContent: { flex: 1 },
  cardTop: { display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' },
  typeBadge: { fontSize: '11px', background: '#e6f1fb', color: '#185fa5', padding: '3px 9px', borderRadius: '8px', fontWeight: '600' },
  yearBadge: { fontSize: '11px', background: '#eaf3de', color: '#3b6d11', padding: '3px 9px', borderRadius: '8px', fontWeight: '600' },
  pubTitle: { fontSize: '15px', fontWeight: '600', color: '#0a2342', marginBottom: '6px', lineHeight: '1.4' },
  resume: { fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '10px' },
  cardBottom: { display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' },
  auteur: { fontSize: '12px', color: '#888' },
  equipe: { fontSize: '12px', color: '#888' },
  link: { fontSize: '12px', color: '#0f6e56', fontWeight: '600' },
  loading: { textAlign: 'center', padding: '3rem', color: '#888' },
  empty: { textAlign: 'center', padding: '3rem', color: '#888' },
}
