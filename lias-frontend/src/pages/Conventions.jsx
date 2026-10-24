import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const STATUT_COLOR = {
  ACTIVE: { bg: '#eaf3de', color: '#3b6d11' },
  EXPIREE: { bg: '#f0f0f0', color: '#666' },
  EN_COURS_DE_RENOUVELLEMENT: { bg: '#faeeda', color: '#854f0b' },
  SUSPENDUE: { bg: '#fff3f3', color: '#a32d2d' },
}

export default function Conventions() {
  const [conventions, setConventions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titre: '', partenaire: '', typePartenaire: 'Université', pays: 'Maroc', description: '', dateDebut: '', dateFin: '' })

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const canManage = ['DIRECTEUR', 'VICE_DIRECTEUR'].includes(user.role)
  const canDelete = user.role === 'DIRECTEUR'

  useEffect(() => {
    api.get('/conventions').then(res => { setConventions(res.data); setLoading(false) })
  }, [])

  const filtered = conventions.filter(c =>
    `${c.titre} ${c.partenaire}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/conventions', form)
      setConventions([res.data, ...conventions])
      setShowForm(false)
      setForm({ titre: '', partenaire: '', typePartenaire: 'Université', pays: 'Maroc', description: '', dateDebut: '', dateFin: '' })
    } catch (err) { alert(err.response?.data?.error || 'Erreur') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette convention ?')) return
    try { await api.delete(`/conventions/${id}`); setConventions(conventions.filter(c => c.id !== id)) }
    catch (err) { alert(err.response?.data?.error || 'Erreur') }
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.title}>Conventions & Collaborations</h1>
            <p style={s.subtitle}>{conventions.length} partenariat(s) enregistré(s)</p>
          </div>
          <div style={s.headerActions}>
            <input placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={s.search} />
            {canManage && <button onClick={() => setShowForm(!showForm)} style={s.addBtn}>{showForm ? '✕ Annuler' : '+ Nouvelle convention'}</button>}
          </div>
        </div>

        {showForm && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>Nouvelle convention</h3>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formRow}>
                <div style={s.formField}><label style={s.label}>Titre *</label><input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} style={s.input} required /></div>
                <div style={s.formField}><label style={s.label}>Partenaire *</label><input value={form.partenaire} onChange={e => setForm({...form, partenaire: e.target.value})} style={s.input} required placeholder="Nom de l'organisme" /></div>
              </div>
              <div style={s.formRow}>
                <div style={s.formField}><label style={s.label}>Type</label>
                  <select value={form.typePartenaire} onChange={e => setForm({...form, typePartenaire: e.target.value})} style={s.input}>
                    {['Université', 'École', 'Entreprise', 'ONG', 'Institution gouvernementale', 'Centre de recherche'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={s.formField}><label style={s.label}>Pays</label><input value={form.pays} onChange={e => setForm({...form, pays: e.target.value})} style={s.input} /></div>
              </div>
              <div style={s.formRow}>
                <div style={s.formField}><label style={s.label}>Date début</label><input type="date" value={form.dateDebut} onChange={e => setForm({...form, dateDebut: e.target.value})} style={s.input} /></div>
                <div style={s.formField}><label style={s.label}>Date fin (vide = en cours)</label><input type="date" value={form.dateFin} onChange={e => setForm({...form, dateFin: e.target.value})} style={s.input} /></div>
              </div>
              <div style={s.formField}><label style={s.label}>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...s.input, height: '80px', resize: 'vertical'}} /></div>
              <button type="submit" style={s.submitBtn}>✅ Créer</button>
            </form>
          </div>
        )}

        {loading ? <div style={s.loading}>Chargement...</div> : (
          <div style={s.grid}>
            {filtered.map(c => {
              const sc = STATUT_COLOR[c.statut] || { bg: '#f0f0f0', color: '#666' }
              return (
                <div key={c.id} style={s.card}>
                  <div style={s.cardTop}>
                    <span style={{ ...s.typeBadge }}>{c.typePartenaire || 'Partenaire'}</span>
                    <span style={{ ...s.statutBadge, background: sc.bg, color: sc.color }}>{c.statut?.replace(/_/g, ' ')}</span>
                  </div>
                  <h3 style={s.cardTitle}>{c.titre}</h3>
                  <p style={s.partenaire}>🤝 {c.partenaire}</p>
                  {c.pays && <p style={s.pays}>🌍 {c.pays}</p>}
                  {c.description && <p style={s.desc}>{c.description.substring(0, 100)}...</p>}
                  <div style={s.dates}>
                    {c.dateDebut && <span>📅 Depuis {c.dateDebut}</span>}
                    {c.dateFin ? <span>→ {c.dateFin}</span> : <span style={{ color: '#3b6d11', fontWeight: '600' }}>En cours ✓</span>}
                  </div>
                  {c.responsable && <p style={s.responsable}>👤 {c.responsable.prenom} {c.responsable.nom}</p>}
                  {canDelete && <button onClick={() => handleDelete(c.id)} style={s.deleteBtn}>🗑️ Supprimer</button>}
                </div>
              )
            })}
            {filtered.length === 0 && <div style={s.empty}>Aucune convention trouvée</div>}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page:{background:'#f0f2f5',minHeight:'100vh'},container:{maxWidth:'1200px',margin:'0 auto',padding:'2rem'},
  pageHeader:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'},
  title:{fontSize:'22px',fontWeight:'600',color:'#0a2342'},subtitle:{fontSize:'13px',color:'#888',marginTop:'4px'},
  headerActions:{display:'flex',gap:'10px',alignItems:'center'},
  search:{padding:'10px 16px',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'14px',width:'220px',background:'white'},
  addBtn:{padding:'10px 18px',background:'#0f6e56',color:'white',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'},
  formCard:{background:'white',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'},
  formTitle:{fontSize:'16px',fontWeight:'600',color:'#0a2342',marginBottom:'1.25rem'},
  form:{display:'flex',flexDirection:'column',gap:'14px'},
  formRow:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'},
  formField:{display:'flex',flexDirection:'column',gap:'5px'},
  label:{fontSize:'13px',fontWeight:'600',color:'#444'},
  input:{padding:'10px 12px',border:'1.5px solid #e0e0e0',borderRadius:'8px',fontSize:'14px',background:'#fafafa'},
  submitBtn:{padding:'10px 24px',background:'#0a2342',color:'white',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',alignSelf:'flex-start'},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))',gap:'16px'},
  card:{background:'white',borderRadius:'12px',padding:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'},
  cardTop:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'},
  typeBadge:{fontSize:'11px',background:'#e6f1fb',color:'#185fa5',padding:'3px 10px',borderRadius:'10px',fontWeight:'600'},
  statutBadge:{fontSize:'11px',padding:'3px 10px',borderRadius:'10px',fontWeight:'600'},
  cardTitle:{fontSize:'16px',fontWeight:'600',color:'#0a2342',marginBottom:'6px'},
  partenaire:{fontSize:'14px',color:'#444',marginBottom:'4px'},pays:{fontSize:'13px',color:'#666',marginBottom:'8px'},
  desc:{fontSize:'13px',color:'#888',lineHeight:'1.5',marginBottom:'10px'},
  dates:{display:'flex',gap:'10px',fontSize:'12px',color:'#888',marginBottom:'8px',flexWrap:'wrap'},
  responsable:{fontSize:'12px',color:'#aaa',marginBottom:'8px'},
  deleteBtn:{width:'100%',padding:'7px',background:'#fff3f3',color:'#c0392b',border:'1px solid #ffd0d0',borderRadius:'6px',fontSize:'12px',cursor:'pointer',marginTop:'8px'},
  loading:{textAlign:'center',padding:'3rem',color:'#888'},
  empty:{gridColumn:'1/-1',textAlign:'center',padding:'3rem',color:'#888',background:'white',borderRadius:'12px'},
}
