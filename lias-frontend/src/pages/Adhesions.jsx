import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const STATUT_COLOR = {
  EN_ATTENTE: { bg: '#faeeda', color: '#854f0b' },
  ACCEPTEE: { bg: '#eaf3de', color: '#3b6d11' },
  REFUSEE: { bg: '#fff3f3', color: '#a32d2d' },
}

export default function Adhesions() {
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('EN_ATTENTE')
  const [nouveauCompte, setNouveauCompte] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    api.get('/adhesions').then(res => {
      setDemandes(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = filtre === 'TOUS'
    ? demandes
    : demandes.filter(d => d.statut === filtre)

  const handleAccepter = async (id) => {
    try {
      const res = await api.post(`/adhesions/${id}/accepter`)
      setNouveauCompte(res.data)
      setDemandes(demandes.map(d => d.id === id ? { ...d, statut: 'ACCEPTEE' } : d))
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de l\'acceptation')
    }
  }

  const handleRefuser = async (id) => {
    const motif = prompt('Motif du refus (optionnel) :') || 'Dossier non retenu'
    try {
      await api.post(`/adhesions/${id}/refuser?motif=${encodeURIComponent(motif)}`)
      setDemandes(demandes.map(d => d.id === id ? { ...d, statut: 'REFUSEE' } : d))
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors du refus')
    }
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.title}>Demandes d'adhésion</h1>
            <p style={s.subtitle}>{demandes.filter(d => d.statut === 'EN_ATTENTE').length} demande(s) en attente</p>
          </div>
        </div>

        {/* Nouveau compte créé */}
        {nouveauCompte && (
          <div style={s.successBanner}>
            <div>
              <strong>✅ Compte créé pour {nouveauCompte.prenom} {nouveauCompte.nom}</strong>
              <div style={s.compteInfo}>
                <span>Email : <code style={s.code}>{nouveauCompte.email}</code></span>
                <span style={s.note}>Le membre peut maintenant se connecter avec son email et un mot de passe temporaire.</span>
              </div>
            </div>
            <button onClick={() => setNouveauCompte(null)} style={s.closeBtn}>✕</button>
          </div>
        )}

        {/* Filtres */}
        <div style={s.filtres}>
          {['TOUS', 'EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'].map(f => (
            <button key={f} onClick={() => setFiltre(f)}
              style={{ ...s.filtreBtn, ...(filtre === f ? s.filtreBtnActive : {}) }}>
              {f === 'TOUS' ? `Toutes (${demandes.length})` :
               f === 'EN_ATTENTE' ? `En attente (${demandes.filter(d => d.statut === 'EN_ATTENTE').length})` :
               f === 'ACCEPTEE' ? `Acceptées (${demandes.filter(d => d.statut === 'ACCEPTEE').length})` :
               `Refusées (${demandes.filter(d => d.statut === 'REFUSEE').length})`}
            </button>
          ))}
        </div>

        {loading ? <div style={s.loading}>Chargement...</div> : (
          <div style={s.list}>
            {filtered.length === 0 && (
              <div style={s.empty}>
                {filtre === 'EN_ATTENTE' ? '✅ Aucune demande en attente' : 'Aucune demande trouvée'}
              </div>
            )}
            {filtered.map(d => (
              <div key={d.id} style={s.card}>
                <div style={s.cardTop}>
                  <div style={s.cardInfo}>
                    <div style={s.avatar}>{d.prenom?.[0]}{d.nom?.[0]}</div>
                    <div>
                      <h3 style={s.name}>{d.prenom} {d.nom}</h3>
                      <p style={s.email}>{d.email}</p>
                    </div>
                  </div>
                  <div style={s.cardRight}>
                    <span style={{ ...s.statutBadge, background: STATUT_COLOR[d.statut]?.bg, color: STATUT_COLOR[d.statut]?.color }}>
                      {d.statut}
                    </span>
                    <span style={s.date}>{d.createdAt ? new Date(d.createdAt).toLocaleDateString('fr-FR') : ''}</span>
                  </div>
                </div>

                <div style={s.cardBody}>
                  {d.etablissementOrigine && (
                    <p style={s.info}>🏛️ <strong>Établissement :</strong> {d.etablissementOrigine}</p>
                  )}
                  {d.motivation && (
                    <div style={s.motivationBox}>
                      <p style={s.motivationLabel}>Lettre de motivation</p>
                      <p style={s.motivationText}>{d.motivation}</p>
                    </div>
                  )}
                </div>

                {d.statut === 'EN_ATTENTE' && (
                  <div style={s.actions}>
                    <button onClick={() => handleAccepter(d.id)} style={s.acceptBtn}>
                      ✅ Accepter — Créer le compte
                    </button>
                    <button onClick={() => handleRefuser(d.id)} style={s.refuserBtn}>
                      ❌ Refuser
                    </button>
                  </div>
                )}

                {d.statut === 'ACCEPTEE' && (
                  <p style={s.acceptedNote}>✅ Demande acceptée — compte créé</p>
                )}
                {d.statut === 'REFUSEE' && (
                  <p style={s.refusedNote}>❌ Demande refusée</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { background: '#f0f2f5', minHeight: '100vh' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  pageHeader: { marginBottom: '1.5rem' },
  title: { fontSize: '22px', fontWeight: '600', color: '#0a2342' },
  subtitle: { fontSize: '13px', color: '#888', marginTop: '4px' },
  successBanner: { background: '#0a2342', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  compteInfo: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', fontSize: '13px' },
  code: { background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' },
  note: { color: 'rgba(255,255,255,0.7)', fontSize: '12px' },
  closeBtn: { background: 'transparent', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer' },
  filtres: { display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filtreBtn: { padding: '7px 16px', border: '1.5px solid #ddd', borderRadius: '20px', background: 'white', fontSize: '13px', color: '#555', cursor: 'pointer' },
  filtreBtnActive: { background: '#0a2342', color: 'white', borderColor: '#0a2342' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  cardInfo: { display: 'flex', gap: '14px', alignItems: 'center' },
  avatar: { width: '46px', height: '46px', borderRadius: '50%', background: '#0a2342', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600', flexShrink: 0 },
  name: { fontSize: '16px', fontWeight: '600', color: '#0a2342', marginBottom: '3px' },
  email: { fontSize: '13px', color: '#888' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  statutBadge: { fontSize: '11px', padding: '4px 12px', borderRadius: '10px', fontWeight: '600' },
  date: { fontSize: '12px', color: '#aaa' },
  cardBody: { marginBottom: '1rem' },
  info: { fontSize: '13px', color: '#555', marginBottom: '8px' },
  motivationBox: { background: '#f8f9fa', borderRadius: '8px', padding: '1rem', border: '1px solid #e0e0e0' },
  motivationLabel: { fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '6px', textTransform: 'uppercase' },
  motivationText: { fontSize: '14px', color: '#444', lineHeight: '1.6' },
  actions: { display: 'flex', gap: '10px', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' },
  acceptBtn: { padding: '10px 24px', background: '#eaf3de', color: '#3b6d11', border: '1px solid #c8e6c9', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
  refuserBtn: { padding: '10px 24px', background: '#fff3f3', color: '#c0392b', border: '1px solid #ffd0d0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
  acceptedNote: { fontSize: '13px', color: '#3b6d11', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' },
  refusedNote: { fontSize: '13px', color: '#c0392b', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' },
  loading: { textAlign: 'center', padding: '3rem', color: '#888' },
  empty: { textAlign: 'center', padding: '3rem', color: '#888', background: 'white', borderRadius: '12px' },
}
