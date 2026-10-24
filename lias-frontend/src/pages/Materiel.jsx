import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const STATUT_COLOR = {
  EN_ATTENTE: { bg: '#faeeda', color: '#854f0b' },
  ACCEPTEE: { bg: '#eaf3de', color: '#3b6d11' },
  REFUSEE: { bg: '#fff3f3', color: '#a32d2d' },
  ANNULEE: { bg: '#f0f0f0', color: '#666' },
}

export default function Materiel() {
  const [materiels, setMateriels] = useState([])
  const [mesReservations, setMesReservations] = useState([])
  const [demandesEnAttente, setDemandesEnAttente] = useState([])
  const [calendrier, setCalendrier] = useState([])
  const [selectedMateriel, setSelectedMateriel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState('liste')
  const [showReserveForm, setShowReserveForm] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [dispo, setDispo] = useState(null)
  const [reserveForm, setReserveForm] = useState({ dateDebut: '', dateFin: '', motif: '' })
  const [addForm, setAddForm] = useState({ nom: '', description: '', categorie: 'Informatique', quantiteTotal: 1 })

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const canManage = ['DIRECTEUR', 'VICE_DIRECTEUR'].includes(user.role)
  const canAdd = user.role === 'DIRECTEUR'

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [matRes, mesRes] = await Promise.all([api.get('/materiels'), api.get('/materiels/reservations/mes')])
      setMateriels(matRes.data)
      setMesReservations(mesRes.data)
      if (canManage) {
        const attente = await api.get('/materiels/reservations/en-attente')
        setDemandesEnAttente(attente.data)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const verifierDispo = async () => {
    if (!reserveForm.dateDebut || !reserveForm.dateFin) return
    try {
      const res = await api.get(`/materiels/${showReserveForm}/disponibilite`, { params: { dateDebut: reserveForm.dateDebut, dateFin: reserveForm.dateFin } })
      setDispo(res.data.disponible)
    } catch { setDispo(false) }
  }

  const loadCalendrier = async (materielId) => {
    const res = await api.get(`/materiels/${materielId}/calendrier`)
    setCalendrier(res.data)
    setSelectedMateriel(selectedMateriel === materielId ? null : materielId)
  }

  const handleReserver = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/materiels/${showReserveForm}/reserver`, null, { params: { dateDebut: reserveForm.dateDebut, dateFin: reserveForm.dateFin, motif: reserveForm.motif } })
      alert('Demande envoyée ! En attente de validation.')
      setShowReserveForm(null); setDispo(null); setReserveForm({ dateDebut: '', dateFin: '', motif: '' }); loadData()
    } catch (err) { alert(err.response?.data?.error || 'Erreur') }
  }

  const handleAjouter = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/materiels', addForm)
      setMateriels([...materiels, res.data]); setShowAddForm(false)
    } catch (err) { alert(err.response?.data?.error || 'Erreur') }
  }

  const handleAccepter = async (id) => { try { await api.post(`/materiels/reservations/${id}/accepter`); loadData() } catch (err) { alert(err.response?.data?.error || 'Erreur') } }
  const handleRefuser = async (id) => { const c = prompt('Motif du refus :') || 'Refusé'; try { await api.post(`/materiels/reservations/${id}/refuser`, null, { params: { commentaire: c } }); loadData() } catch (err) { alert(err.response?.data?.error || 'Erreur') } }
  const handleAnnuler = async (id) => { if (!window.confirm('Annuler ?')) return; try { await api.post(`/materiels/reservations/${id}/annuler`); loadData() } catch (err) { alert(err.response?.data?.error || 'Erreur') } }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div><h1 style={s.title}>Gestion du matériel</h1><p style={s.subtitle}>Réservez du matériel pour vos activités de recherche</p></div>
          {canAdd && <button onClick={() => setShowAddForm(!showAddForm)} style={s.addBtn}>{showAddForm ? 'Annuler' : '+ Ajouter du matériel'}</button>}
        </div>

        {showAddForm && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>Ajouter du matériel</h3>
            <form onSubmit={handleAjouter} style={s.form}>
              <div style={s.formRow}>
                <div style={s.formField}><label style={s.label}>Nom *</label><input value={addForm.nom} onChange={e => setAddForm({...addForm, nom: e.target.value})} style={s.input} required /></div>
                <div style={s.formField}><label style={s.label}>Catégorie</label><select value={addForm.categorie} onChange={e => setAddForm({...addForm, categorie: e.target.value})} style={s.input}>{['Informatique','Audio-visuel','Mobilier','Salle','Autre'].map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div style={s.formRow}>
                <div style={s.formField}><label style={s.label}>Description</label><input value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})} style={s.input} /></div>
                <div style={s.formField}><label style={s.label}>Quantité</label><input type="number" min="1" value={addForm.quantiteTotal} onChange={e => setAddForm({...addForm, quantiteTotal: parseInt(e.target.value)})} style={s.input} /></div>
              </div>
              <button type="submit" style={s.submitBtn}>Ajouter</button>
            </form>
          </div>
        )}

        <div style={s.onglets}>
          {[{key:'liste',label:`Matériels (${materiels.length})`},{key:'mes-reservations',label:`Mes réservations (${mesReservations.length})`},...(canManage?[{key:'demandes',label:`En attente (${demandesEnAttente.length})`}]:[])].map(o => (
            <button key={o.key} onClick={() => setOnglet(o.key)} style={{...s.ongletBtn,...(onglet===o.key?s.ongletBtnActive:{})}}>{o.label}</button>
          ))}
        </div>

        {loading ? <div style={s.loading}>Chargement...</div> : <>
          {onglet === 'liste' && (
            <div style={s.grid}>
              {materiels.map(m => (
                <div key={m.id} style={s.card}>
                  <div style={s.cardTop}><span style={s.categorieBadge}>{m.categorie||'Autre'}</span><span style={s.quantite}>x{m.quantiteTotal}</span></div>
                  <h3 style={s.cardName}>{m.nom}</h3>
                  {m.description && <p style={s.cardDesc}>{m.description}</p>}
                  <div style={s.cardActions}>
                    <button onClick={() => { setShowReserveForm(showReserveForm===m.id?null:m.id); setDispo(null); setReserveForm({dateDebut:'',dateFin:'',motif:''}) }} style={s.reserveBtn}>Réserver</button>
                    <button onClick={() => loadCalendrier(m.id)} style={s.calBtn}>Calendrier</button>
                  </div>
                  {showReserveForm === m.id && (
                    <form onSubmit={handleReserver} style={s.reserveForm}>
                      <div style={s.formRow}>
                        <div style={s.formField}><label style={s.label}>Date début *</label><input type="date" value={reserveForm.dateDebut} min={new Date().toISOString().split('T')[0]} onChange={e => {setReserveForm({...reserveForm,dateDebut:e.target.value});setDispo(null)}} style={s.input} required /></div>
                        <div style={s.formField}><label style={s.label}>Date fin *</label><input type="date" value={reserveForm.dateFin} min={reserveForm.dateDebut||new Date().toISOString().split('T')[0]} onChange={e => {setReserveForm({...reserveForm,dateFin:e.target.value});setDispo(null)}} style={s.input} required /></div>
                      </div>
                      <div style={s.formField}><label style={s.label}>Motif</label><input value={reserveForm.motif} onChange={e => setReserveForm({...reserveForm,motif:e.target.value})} style={s.input} placeholder="Ex: Soutenance de thèse..." /></div>
                      {reserveForm.dateDebut && reserveForm.dateFin && <button type="button" onClick={verifierDispo} style={s.checkBtn}>Vérifier disponibilité</button>}
                      {dispo===true && <div style={s.dispoOk}>✅ Disponible !</div>}
                      {dispo===false && <div style={s.dispoNon}>❌ Non disponible sur cette période</div>}
                      <div style={{display:'flex',gap:'8px'}}><button type="submit" style={s.submitBtn} disabled={dispo===false}>Envoyer la demande</button><button type="button" onClick={() => {setShowReserveForm(null);setDispo(null)}} style={s.cancelBtn}>Annuler</button></div>
                    </form>
                  )}
                  {selectedMateriel === m.id && (
                    <div style={s.calendrier}>
                      <p style={s.calTitle}>Réservations à venir</p>
                      {calendrier.length === 0 ? <p style={{color:'#888',fontSize:'13px'}}>✅ Libre — aucune réservation</p> : calendrier.map(r => (
                        <div key={r.id} style={s.calItem}>
                          <span style={{...s.calStatut,background:STATUT_COLOR[r.statut]?.bg,color:STATUT_COLOR[r.statut]?.color}}>{r.statut}</span>
                          <span style={s.calDates}>{r.dateDebut} → {r.dateFin}</span>
                          <span style={s.calMembre}>{r.membre?.prenom} {r.membre?.nom}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {materiels.length === 0 && <div style={s.empty}>Aucun matériel enregistré</div>}
            </div>
          )}

          {onglet === 'mes-reservations' && (
            <div style={s.list}>
              {mesReservations.length === 0 && <div style={s.empty}>Vous n'avez aucune réservation</div>}
              {mesReservations.map(r => (
                <div key={r.id} style={s.reservCard}>
                  <div style={s.reservTop}><h3 style={s.reservNom}>{r.materiel?.nom}</h3><span style={{...s.statutBadge,background:STATUT_COLOR[r.statut]?.bg,color:STATUT_COLOR[r.statut]?.color}}>{r.statut}</span></div>
                  <p style={s.reservDates}>📅 {r.dateDebut} → {r.dateFin}</p>
                  {r.motif && <p style={s.reservMotif}>💬 {r.motif}</p>}
                  {r.commentaireRefus && <p style={s.reservRefus}>❌ {r.commentaireRefus}</p>}
                  {r.statut === 'EN_ATTENTE' && <button onClick={() => handleAnnuler(r.id)} style={s.annulerBtn}>Annuler</button>}
                </div>
              ))}
            </div>
          )}

          {onglet === 'demandes' && canManage && (
            <div style={s.list}>
              {demandesEnAttente.length === 0 && <div style={s.empty}>✅ Aucune demande en attente</div>}
              {demandesEnAttente.map(r => (
                <div key={r.id} style={s.reservCard}>
                  <div style={s.reservTop}><div><h3 style={s.reservNom}>{r.materiel?.nom}</h3><p style={s.reservMembre}>👤 {r.membre?.prenom} {r.membre?.nom}</p></div><span style={{...s.statutBadge,background:STATUT_COLOR[r.statut]?.bg,color:STATUT_COLOR[r.statut]?.color}}>{r.statut}</span></div>
                  <p style={s.reservDates}>📅 {r.dateDebut} → {r.dateFin}</p>
                  {r.motif && <p style={s.reservMotif}>💬 {r.motif}</p>}
                  <div style={s.actionBtns}><button onClick={() => handleAccepter(r.id)} style={s.acceptBtn}>✅ Accepter</button><button onClick={() => handleRefuser(r.id)} style={s.refuserBtn}>❌ Refuser</button></div>
                </div>
              ))}
            </div>
          )}
        </>}
      </div>
    </div>
  )
}

const s = {
  page:{background:'#f0f2f5',minHeight:'100vh'},container:{maxWidth:'1200px',margin:'0 auto',padding:'2rem'},
  pageHeader:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'},
  title:{fontSize:'22px',fontWeight:'600',color:'#0a2342'},subtitle:{fontSize:'13px',color:'#888',marginTop:'4px'},
  addBtn:{padding:'10px 18px',background:'#0f6e56',color:'white',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'},
  formCard:{background:'white',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'},
  formTitle:{fontSize:'16px',fontWeight:'600',color:'#0a2342',marginBottom:'1.25rem'},
  form:{display:'flex',flexDirection:'column',gap:'14px'},formRow:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'},
  formField:{display:'flex',flexDirection:'column',gap:'5px'},label:{fontSize:'13px',fontWeight:'600',color:'#444'},
  input:{padding:'10px 12px',border:'1.5px solid #e0e0e0',borderRadius:'8px',fontSize:'14px',background:'#fafafa'},
  submitBtn:{padding:'10px 20px',background:'#0a2342',color:'white',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'},
  cancelBtn:{padding:'10px 20px',background:'white',color:'#666',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'14px',cursor:'pointer'},
  onglets:{display:'flex',gap:'8px',marginBottom:'1.5rem',flexWrap:'wrap'},
  ongletBtn:{padding:'9px 18px',border:'1.5px solid #ddd',borderRadius:'20px',background:'white',fontSize:'13px',color:'#555',cursor:'pointer'},
  ongletBtnActive:{background:'#0a2342',color:'white',borderColor:'#0a2342'},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))',gap:'16px'},
  card:{background:'white',borderRadius:'12px',padding:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'},
  cardTop:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'},
  categorieBadge:{fontSize:'11px',background:'#e6f1fb',color:'#185fa5',padding:'3px 10px',borderRadius:'10px',fontWeight:'600'},
  quantite:{fontSize:'13px',color:'#888',fontWeight:'600'},cardName:{fontSize:'16px',fontWeight:'600',color:'#0a2342',marginBottom:'6px'},
  cardDesc:{fontSize:'13px',color:'#666',marginBottom:'12px',lineHeight:'1.4'},
  cardActions:{display:'flex',gap:'8px',marginBottom:'12px'},
  reserveBtn:{flex:1,padding:'8px',background:'#0a2342',color:'white',border:'none',borderRadius:'8px',fontSize:'13px',cursor:'pointer'},
  calBtn:{padding:'8px 14px',background:'#f0f2f5',color:'#0a2342',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'13px',cursor:'pointer'},
  reserveForm:{borderTop:'1px solid #f0f0f0',paddingTop:'14px',display:'flex',flexDirection:'column',gap:'10px',marginTop:'8px'},
  checkBtn:{padding:'8px 16px',background:'#eeedfe',color:'#534ab7',border:'none',borderRadius:'8px',fontSize:'13px',cursor:'pointer',fontWeight:'600'},
  dispoOk:{background:'#eaf3de',color:'#3b6d11',padding:'8px 12px',borderRadius:'8px',fontSize:'13px',fontWeight:'600'},
  dispoNon:{background:'#fff3f3',color:'#c0392b',padding:'8px 12px',borderRadius:'8px',fontSize:'13px',fontWeight:'600'},
  calendrier:{borderTop:'1px solid #f0f0f0',paddingTop:'12px',marginTop:'8px'},
  calTitle:{fontSize:'12px',fontWeight:'600',color:'#0a2342',marginBottom:'8px'},
  calItem:{display:'flex',gap:'8px',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #f5f5f5',flexWrap:'wrap'},
  calStatut:{fontSize:'10px',padding:'2px 8px',borderRadius:'8px',fontWeight:'600'},
  calDates:{fontSize:'12px',color:'#555'},calMembre:{fontSize:'12px',color:'#888'},
  list:{display:'flex',flexDirection:'column',gap:'12px'},
  reservCard:{background:'white',borderRadius:'12px',padding:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'},
  reservTop:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'},
  reservNom:{fontSize:'16px',fontWeight:'600',color:'#0a2342',marginBottom:'2px'},reservMembre:{fontSize:'13px',color:'#888'},
  reservDates:{fontSize:'13px',color:'#666',marginBottom:'4px'},reservMotif:{fontSize:'13px',color:'#888',marginBottom:'4px'},
  reservRefus:{fontSize:'13px',color:'#c0392b',marginBottom:'8px'},
  statutBadge:{fontSize:'11px',padding:'4px 12px',borderRadius:'10px',fontWeight:'600',whiteSpace:'nowrap'},
  annulerBtn:{padding:'7px 16px',background:'#fff3f3',color:'#c0392b',border:'1px solid #ffd0d0',borderRadius:'6px',fontSize:'12px',cursor:'pointer',marginTop:'8px'},
  actionBtns:{display:'flex',gap:'10px',marginTop:'10px'},
  acceptBtn:{padding:'8px 20px',background:'#eaf3de',color:'#3b6d11',border:'1px solid #c8e6c9',borderRadius:'8px',fontSize:'13px',cursor:'pointer',fontWeight:'600'},
  refuserBtn:{padding:'8px 20px',background:'#fff3f3',color:'#c0392b',border:'1px solid #ffd0d0',borderRadius:'8px',fontSize:'13px',cursor:'pointer',fontWeight:'600'},
  loading:{textAlign:'center',padding:'3rem',color:'#888'},empty:{textAlign:'center',padding:'3rem',color:'#888',background:'white',borderRadius:'12px'},
}
