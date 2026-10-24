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
    Promise.all([
      api.get('/publications'),
      api.get('/publications/annees'),
    ]).then(([pubRes, anneeRes]) => {
      setPublications(pubRes.data)
      setAnnees(anneeRes.data)
      setLoading(false)
    })
  }, [])

  const filtres = publications
    .filter(p => filtreAnnee === 'TOUTES' || p.annee === parseInt(filtreAnnee))
    .filter(p => p.titre?.toLowerCase().includes(search.toLowerCase()))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/publications', form)
      setPublications([res.data, ...publications])
      setShowForm(false)
      setForm({ titre: '', resume: '', url: '', type: 'Article', annee: new Date().getFullYear() })
    } catch (err) {
      alert('Erreur lors de l\'ajout')
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📚 Publications</h1>
          <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
            {showForm ? '✕ Annuler' : '+ Ajouter une publication'}
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Nouvelle publication</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input placeholder="Titre *" value={form.titre}
                onChange={e => setForm({...form, titre: e.target.value})}
                style={styles.input} required />
              <div style={styles.row}>
                <select value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                  style={styles.input}>
                  <option>Article</option>
                  <option>Thèse</option>
                  <option>Rapport</option>
                  <option>Conférence</option>
                  <option>Livre</option>
                </select>
                <input type="number" placeholder="Année" value={form.annee}
                  onChange={e => setForm({...form, annee: parseInt(e.target.value)})}
                  style={styles.input} required />
              </div>
              <input placeholder="URL (lien vers la publication)" value={form.url}
                onChange={e => setForm({...form, url: e.target.value})}
                style={styles.input} />
              <textarea placeholder="Résumé" value={form.resume}
                onChange={e => setForm({...form, resume: e.target.value})}
                style={{...styles.input, height: '80px'}} />
              <button type="submit" style={styles.submitBtn}>✅ Ajouter</button>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div style={styles.toolbar}>
          <div style={styles.filtres}>
            <button onClick={() => setFiltreAnnee('TOUTES')}
              style={{ ...styles.filtreBtn, ...(filtreAnnee === 'TOUTES' ? styles.filtreBtnActive : {}) }}>
              Toutes
            </button>
            {annees.map(a => (
              <button key={a} onClick={() => setFiltreAnnee(String(a))}
                style={{ ...styles.filtreBtn, ...(filtreAnnee === String(a) ? styles.filtreBtnActive : {}) }}>
                {a}
              </button>
            ))}
          </div>
          <input placeholder="🔍 Rechercher..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.search} />
        </div>

        {/* Liste */}
        {loading ? <p>Chargement...</p> : (
          <div style={styles.list}>
            {filtres.map(p => (
              <div key={p.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.type}>{p.type || 'Article'}</span>
                  <span style={styles.annee}>{p.annee}</span>
                </div>
                <h3 style={styles.pubTitle}>{p.titre}</h3>
                {p.resume && <p style={styles.resume}>{p.resume}</p>}
                <div style={styles.cardBottom}>
                  {p.membre && (
                    <span style={styles.auteur}>
                      👤 {p.membre.prenom} {p.membre.nom}
                    </span>
                  )}
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" style={styles.link}>
                      🔗 Voir la publication
                    </a>
                  )}
                </div>
              </div>
            ))}
            {filtres.length === 0 && (
              <p style={styles.empty}>Aucune publication trouvée</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1e3a5f', margin: 0 },
  addBtn: { padding: '10px 20px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  formCard: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  formTitle: { fontSize: '18px', fontWeight: '600', color: '#1e3a5f', margin: '0 0 16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  input: { padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px', outline: 'none', resize: 'vertical' },
  submitBtn: { padding: '12px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  filtres: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filtreBtn: { padding: '7px 16px', border: '2px solid #e0e0e0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px' },
  filtreBtnActive: { background: '#1e3a5f', color: 'white', borderColor: '#1e3a5f' },
  search: { padding: '10px 16px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px', outline: 'none', width: '240px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  type: { fontSize: '12px', background: '#e8f4fd', color: '#1e3a5f', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' },
  annee: { fontSize: '14px', color: '#888', fontWeight: '600' },
  pubTitle: { fontSize: '17px', fontWeight: '600', color: '#1e3a5f', margin: '0 0 8px' },
  resume: { fontSize: '14px', color: '#666', margin: '0 0 12px', lineHeight: '1.6' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  auteur: { fontSize: '13px', color: '#888' },
  link: { fontSize: '13px', color: '#1e3a5f', fontWeight: '600', textDecoration: 'none' },
  empty: { color: '#666', textAlign: 'center', padding: '40px' },
}
