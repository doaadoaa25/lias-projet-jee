import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function Evenements() {
  const [evenements, setEvenements] = useState([])
  const [filtre, setFiltre] = useState('TOUS')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titre: '', type: 'CONFERENCE', description: '', dateDebut: '', lieu: '' })
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    api.get('/evenements').then(res => {
      setEvenements(res.data)
      setLoading(false)
    })
  }, [])

  const filtres = filtre === 'TOUS'
    ? evenements
    : evenements.filter(e => e.type === filtre)

  const typeColor = {
    CONFERENCE: '#1e3a5f',
    SEMINAIRE: '#2d6a4f',
    WORKSHOP: '#8e44ad',
  }

  const typeIcon = {
    CONFERENCE: '🎤',
    SEMINAIRE: '📖',
    WORKSHOP: '🛠️',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/evenements', form)
      setEvenements([res.data, ...evenements])
      setShowForm(false)
      setForm({ titre: '', type: 'CONFERENCE', description: '', dateDebut: '', lieu: '' })
    } catch (err) {
      alert('Erreur lors de la création')
    }
  }

  const canCreate = ['DIRECTEUR', 'PERMANENT', 'VICE_DIRECTEUR'].includes(user.role)

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📅 Événements scientifiques</h1>
          {canCreate && (
            <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
              {showForm ? '✕ Annuler' : '+ Nouvel événement'}
            </button>
          )}
        </div>

        {/* Formulaire création */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Créer un événement</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input placeholder="Titre" value={form.titre}
                onChange={e => setForm({...form, titre: e.target.value})}
                style={styles.input} required />
              <select value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                style={styles.input}>
                <option value="CONFERENCE">Conférence</option>
                <option value="SEMINAIRE">Séminaire</option>
                <option value="WORKSHOP">Workshop</option>
              </select>
              <input placeholder="Lieu" value={form.lieu}
                onChange={e => setForm({...form, lieu: e.target.value})}
                style={styles.input} />
              <input type="date" value={form.dateDebut}
                onChange={e => setForm({...form, dateDebut: e.target.value})}
                style={styles.input} required />
              <textarea placeholder="Description" value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                style={{...styles.input, height: '80px'}} />
              <button type="submit" style={styles.submitBtn}>✅ Créer</button>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div style={styles.filtres}>
          {['TOUS', 'CONFERENCE', 'SEMINAIRE', 'WORKSHOP'].map(f => (
            <button key={f} onClick={() => setFiltre(f)}
              style={{ ...styles.filtreBtn, ...(filtre === f ? styles.filtreBtnActive : {}) }}>
              {typeIcon[f] || '📋'} {f}
            </button>
          ))}
        </div>

        {/* Liste */}
        {loading ? <p>Chargement...</p> : (
          <div style={styles.list}>
            {filtres.map(e => (
              <div key={e.id} style={styles.card}>
                <div style={{ ...styles.typeTag, background: typeColor[e.type] }}>
                  {typeIcon[e.type]} {e.type}
                </div>
                <h3 style={styles.eventTitle}>{e.titre}</h3>
                <p style={styles.eventDesc}>{e.description}</p>
                <div style={styles.eventMeta}>
                  {e.lieu && <span>📍 {e.lieu}</span>}
                  <span>📆 {new Date(e.dateDebut).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
            {filtres.length === 0 && (
              <p style={styles.empty}>Aucun événement trouvé</p>
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
  input: { padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px', outline: 'none', resize: 'vertical' },
  submitBtn: { padding: '12px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  filtres: { display: 'flex', gap: '10px', marginBottom: '24px' },
  filtreBtn: { padding: '8px 18px', border: '2px solid #e0e0e0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px' },
  filtreBtnActive: { background: '#1e3a5f', color: 'white', borderColor: '#1e3a5f' },
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  card: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  typeTag: { display: 'inline-block', color: 'white', fontSize: '12px', padding: '4px 12px', borderRadius: '12px', marginBottom: '12px', fontWeight: '600' },
  eventTitle: { fontSize: '17px', fontWeight: '600', color: '#1e3a5f', margin: '0 0 8px' },
  eventDesc: { fontSize: '14px', color: '#666', margin: '0 0 12px', lineHeight: '1.5' },
  eventMeta: { display: 'flex', gap: '16px', fontSize: '13px', color: '#888' },
  empty: { color: '#666', textAlign: 'center', padding: '40px' },
}
