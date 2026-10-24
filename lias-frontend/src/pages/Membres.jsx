import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const STATUT_COLOR = {
  PERMANENT: { bg: '#eaf3de', color: '#3b6d11' },
  ASSOCIE: { bg: '#eeedfe', color: '#534ab7' },
  DOCTORANT: { bg: '#faeeda', color: '#854f0b' },
  RETRAITE: { bg: '#f0f0f0', color: '#666' },
  ANCIEN_MEMBRE: { bg: '#fff3f3', color: '#a32d2d' },
}

const STATUTS = ['PERMANENT', 'ASSOCIE', 'DOCTORANT', 'RETRAITE', 'ANCIEN_MEMBRE']

export default function Membres() {
  const [membres, setMembres] = useState([])
  const [equipes, setEquipes] = useState([])
  const [search, setSearch] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('TOUS')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null) // id du membre en cours d'édition de rôle
  const [nouveauMdp, setNouveauMdp] = useState(null)
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', statut: 'PERMANENT',
    etablissementOrigine: '', biographie: '', equipeId: ''
  })

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const canManage = ['DIRECTEUR', 'VICE_DIRECTEUR'].includes(user.role)
  const canDelete = user.role === 'DIRECTEUR'
  const canChangeRole = user.role === 'DIRECTEUR'

  useEffect(() => {
    api.get('/membres').then(res => { setMembres(res.data); setLoading(false) })
    api.get('/equipes').then(res => setEquipes(res.data)).catch(() => setEquipes([]))
  }, [])

  const initiales = (m) => `${m.prenom?.[0] || ''}${m.nom?.[0] || ''}`.toUpperCase()
  const avatarColors = ['#0a2342', '#0f6e56', '#534ab7', '#854f0b', '#993556', '#185fa5']
  const avatarColor = (id) => avatarColors[(id?.charCodeAt(0) || 0) % avatarColors.length]

  const filtered = membres
    .filter(m => filtreStatut === 'TOUS' || m.statut === filtreStatut)
    .filter(m => `${m.nom} ${m.prenom} ${m.email}`.toLowerCase().includes(search.toLowerCase()))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, equipeId: form.equipeId || null }
      const res = await api.post('/membres', payload)
      setMembres([res.data.membre, ...membres])
      setNouveauMdp({ membre: res.data.membre, motDePasse: res.data.motDePasseTemporaire })
      setShowForm(false)
      setForm({ nom: '', prenom: '', email: '', statut: 'PERMANENT', etablissementOrigine: '', biographie: '', equipeId: '' })
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la création du membre')
    }
  }

  const handleDelete = async (membre) => {
    if (!window.confirm(`Supprimer définitivement ${membre.prenom} ${membre.nom} ?\nCette action est irréversible.`)) return
    try {
      await api.delete(`/membres/${membre.id}`)
      setMembres(membres.filter(m => m.id !== membre.id))
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression')
    }
  }

  const handleChangerStatut = async (membre, nouveauStatut) => {
    try {
      const res = await api.patch(`/membres/${membre.id}/statut?statut=${nouveauStatut}`)
      setMembres(membres.map(m => m.id === membre.id ? res.data : m))
      setEditingId(null)
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors du changement de statut')
    }
  }

  const copierMdp = () => {
    navigator.clipboard.writeText(nouveauMdp.motDePasse)
    alert('Mot de passe copié dans le presse-papiers !')
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.title}>Membres du laboratoire</h1>
            <p style={s.subtitle}>{membres.length} membres enregistrés</p>
          </div>
          <div style={s.headerActions}>
            <input placeholder="🔍 Rechercher un membre..." value={search}
              onChange={e => setSearch(e.target.value)} style={s.search} />
            {canManage && (
              <button onClick={() => setShowForm(!showForm)} style={s.addBtn}>
                {showForm ? '✕ Annuler' : '+ Ajouter un membre'}
              </button>
            )}
          </div>
        </div>

        {/* Bannière mot de passe généré */}
        {nouveauMdp && (
          <div style={s.mdpBanner}>
            <div>
              <strong>✅ Membre créé : {nouveauMdp.membre.prenom} {nouveauMdp.membre.nom}</strong>
              <div style={s.mdpRow}>
                <span>Email : <code style={s.code}>{nouveauMdp.membre.email}</code></span>
                <span>Mot de passe : <code style={s.code}>{nouveauMdp.motDePasse}</code></span>
                <button onClick={copierMdp} style={s.copyBtn}>📋 Copier</button>
              </div>
              <p style={s.mdpWarning}>⚠️ Ce mot de passe ne sera plus affiché — transmettez-le maintenant au membre.</p>
            </div>
            <button onClick={() => setNouveauMdp(null)} style={s.closeBtn}>✕</button>
          </div>
        )}

        {/* Formulaire création */}
        {showForm && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>Ajouter un nouveau membre</h3>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formRow}>
                <div style={s.formField}>
                  <label style={s.label}>Prénom *</label>
                  <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} style={s.input} required />
                </div>
                <div style={s.formField}>
                  <label style={s.label}>Nom *</label>
                  <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} style={s.input} required />
                </div>
              </div>
              <div style={s.formRow}>
                <div style={s.formField}>
                  <label style={s.label}>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={s.input} required placeholder="prenom.nom@lias.ma" />
                </div>
                <div style={s.formField}>
                  <label style={s.label}>Statut *</label>
                  <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})} style={s.input}>
                    {STATUTS.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>
              {equipes.length > 0 && (
                <div style={s.formField}>
                  <label style={s.label}>Équipe</label>
                  <select value={form.equipeId} onChange={e => setForm({...form, equipeId: e.target.value})} style={s.input}>
                    <option value="">Aucune équipe pour l'instant</option>
                    {equipes.map(eq => <option key={eq.id} value={eq.id}>{eq.nom}</option>)}
                  </select>
                </div>
              )}
              <div style={s.formField}>
                <label style={s.label}>Établissement d'origine</label>
                <input value={form.etablissementOrigine} onChange={e => setForm({...form, etablissementOrigine: e.target.value})} style={s.input} placeholder="FSBM - Université Hassan II" />
              </div>
              <div style={s.formField}>
                <label style={s.label}>Biographie</label>
                <textarea value={form.biographie} onChange={e => setForm({...form, biographie: e.target.value})} style={{...s.input, height: '70px', resize: 'vertical'}} />
              </div>
              <button type="submit" style={s.submitBtn}>✅ Créer le membre</button>
            </form>
          </div>
        )}

        {/* Filtres statut */}
        <div style={s.filtres}>
          {['TOUS', ...STATUTS].map(f => (
            <button key={f} onClick={() => setFiltreStatut(f)}
              style={{ ...s.filtreBtn, ...(filtreStatut === f ? s.filtreBtnActive : {}) }}>
              {f === 'TOUS' ? `Tous (${membres.length})` : `${f} (${membres.filter(m => m.statut === f).length})`}
            </button>
          ))}
        </div>

        {loading ? <div style={s.loading}>Chargement...</div> : (
          <div style={s.grid}>
            {filtered.map(m => (
              <div key={m.id} style={s.card}>
                <div style={s.cardTop}>
                  <div style={{ ...s.avatar, background: avatarColor(m.id) }}>
                    {m.photoUrl ? <img src={m.photoUrl} alt="" style={s.avatarImg} /> : initiales(m)}
                  </div>

                  {/* Badge statut OU sélecteur si en édition */}
                  {editingId === m.id ? (
                    <select
                      autoFocus
                      defaultValue={m.statut}
                      onChange={e => handleChangerStatut(m, e.target.value)}
                      onBlur={() => setEditingId(null)}
                      style={s.statutSelect}
                    >
                      {STATUTS.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  ) : (
                    <div
                      onClick={() => canChangeRole && setEditingId(m.id)}
                      style={{
                        ...(STATUT_COLOR[m.statut] ? { ...s.statutBadge, background: STATUT_COLOR[m.statut].bg, color: STATUT_COLOR[m.statut].color } : s.statutBadge),
                        cursor: canChangeRole ? 'pointer' : 'default'
                      }}
                      title={canChangeRole ? 'Cliquer pour changer le statut' : ''}
                    >
                      {m.statut} {canChangeRole && '✏️'}
                    </div>
                  )}
                </div>

                <h3 style={s.name}>{m.prenom} {m.nom}</h3>
                <p style={s.email}>{m.email}</p>
                {m.etablissementOrigine && <p style={s.etab}>🏛️ {m.etablissementOrigine}</p>}
                {m.biographie && <p style={s.bio}>{m.biographie.substring(0, 80)}...</p>}

                {canDelete && (
                  <button onClick={() => handleDelete(m)} style={s.deleteBtn}>
                    🗑️ Supprimer
                  </button>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={s.empty}>Aucun membre trouvé pour "{search}"</div>
            )}
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
  mdpBanner: { background: '#0a2342', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  mdpRow: { display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px', fontSize: '13px', flexWrap: 'wrap' },
  code: { background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '13px' },
  copyBtn: { background: '#0f6e56', color: 'white', border: 'none', padding: '5px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  mdpWarning: { fontSize: '12px', opacity: 0.75, marginTop: '8px' },
  closeBtn: { background: 'transparent', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer' },
  formCard: { background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#0a2342', marginBottom: '1.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  input: { padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', background: '#fafafa' },
  submitBtn: { padding: '11px 24px', background: '#0a2342', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', alignSelf: 'flex-start' },
  filtres: { display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filtreBtn: { padding: '7px 16px', border: '1.5px solid #ddd', borderRadius: '20px', background: 'white', fontSize: '13px', color: '#555' },
  filtreBtnActive: { background: '#0a2342', color: 'white', borderColor: '#0a2342' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' },
  avatar: { width: '50px', height: '50px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600' },
  avatarImg: { width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' },
  statutBadge: { fontSize: '10px', padding: '3px 10px', borderRadius: '10px', fontWeight: '600', background: '#f0f0f0', color: '#666' },
  statutSelect: { fontSize: '11px', padding: '3px 6px', borderRadius: '8px', border: '1.5px solid #0a2342', background: 'white' },
  name: { fontSize: '15px', fontWeight: '600', color: '#0a2342', marginBottom: '4px' },
  email: { fontSize: '12px', color: '#888', marginBottom: '8px' },
  etab: { fontSize: '12px', color: '#666', marginBottom: '6px' },
  bio: { fontSize: '12px', color: '#999', lineHeight: '1.5', marginBottom: '10px' },
  deleteBtn: { width: '100%', marginTop: '8px', padding: '7px', background: '#fff3f3', color: '#c0392b', border: '1px solid #ffd0d0', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '3rem', color: '#888' },
  empty: { gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#888' },
}
