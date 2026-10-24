import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function Communication() {
  const [messages, setMessages] = useState([])
  const [canal, setCanal] = useState('GENERAL')
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const loadMessages = async () => {
    try {
      const res = await api.get('/messages/general')
      setMessages(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    loadMessages()
    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(loadMessages, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleEnvoyer = async (e) => {
    e.preventDefault()
    if (!contenu.trim()) return
    try {
      const res = await api.post('/messages', null, { params: { contenu, canal: 'GENERAL' } })
      setMessages([...messages, res.data])
      setContenu('')
    } catch (err) { alert(err.response?.data?.error || 'Erreur') }
  }

  const handleSupprimer = async (id) => {
    try {
      await api.delete(`/messages/${id}`)
      setMessages(messages.filter(m => m.id !== id))
    } catch (err) { alert('Erreur lors de la suppression') }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const initiales = (m) => m ? `${m.prenom?.[0] || ''}${m.nom?.[0] || ''}`.toUpperCase() : '?'
  const avatarColors = ['#0a2342', '#0f6e56', '#534ab7', '#854f0b', '#993556', '#185fa5']
  const avatarColor = (id) => avatarColors[(id?.charCodeAt(0) || 0) % avatarColors.length]
  const isMe = (msg) => msg.expediteur?.email === user.email

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.title}>💬 Communication interne</h1>
            <p style={s.subtitle}>Canal général — tous les membres du laboratoire</p>
          </div>
          <button onClick={loadMessages} style={s.refreshBtn}>🔄 Actualiser</button>
        </div>

        <div style={s.chatContainer}>
          {/* Zone messages */}
          <div style={s.messagesZone}>
            {loading && <div style={s.loading}>Chargement des messages...</div>}

            {!loading && messages.length === 0 && (
              <div style={s.emptyChat}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>💬</div>
                <p>Aucun message pour l'instant.</p>
                <p style={{ fontSize: '13px', color: '#aaa' }}>Soyez le premier à écrire !</p>
              </div>
            )}

            {messages.map(msg => {
              const me = isMe(msg)
              return (
                <div key={msg.id} style={{ ...s.messageRow, justifyContent: me ? 'flex-end' : 'flex-start' }}>
                  {!me && (
                    <div style={{ ...s.avatar, background: avatarColor(msg.expediteur?.id) }}>
                      {initiales(msg.expediteur)}
                    </div>
                  )}
                  <div style={{ maxWidth: '65%' }}>
                    {!me && (
                      <p style={s.expediteurName}>
                        {msg.expediteur?.prenom} {msg.expediteur?.nom}
                        <span style={s.msgTime}>{formatDate(msg.createdAt)}</span>
                      </p>
                    )}
                    <div style={{ ...s.bubble, ...(me ? s.bubbleMe : s.bubbleThem) }}>
                      <p style={s.msgContenu}>{msg.contenu}</p>
                      {me && <span style={s.msgTimeMe}>{formatDate(msg.createdAt)}</span>}
                    </div>
                    {me && (
                      <button onClick={() => handleSupprimer(msg.id)} style={s.supprimerBtn}>
                        🗑️ Supprimer
                      </button>
                    )}
                  </div>
                  {me && (
                    <div style={{ ...s.avatar, background: '#0f6e56' }}>
                      {initiales(msg.expediteur)}
                    </div>
                  )}
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone saisie */}
          <form onSubmit={handleEnvoyer} style={s.inputZone}>
            <input
              value={contenu}
              onChange={e => setContenu(e.target.value)}
              placeholder="Écrivez un message au laboratoire..."
              style={s.input}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleEnvoyer(e)}
            />
            <button type="submit" style={s.sendBtn} disabled={!contenu.trim()}>
              Envoyer →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const s = {
  page:{background:'#f0f2f5',minHeight:'100vh'},
  container:{maxWidth:'900px',margin:'0 auto',padding:'2rem'},
  pageHeader:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'},
  title:{fontSize:'22px',fontWeight:'600',color:'#0a2342'},
  subtitle:{fontSize:'13px',color:'#888',marginTop:'4px'},
  refreshBtn:{padding:'8px 16px',background:'white',border:'1.5px solid #ddd',borderRadius:'8px',fontSize:'13px',cursor:'pointer',color:'#555'},
  chatContainer:{background:'white',borderRadius:'16px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',overflow:'hidden',display:'flex',flexDirection:'column',height:'70vh'},
  messagesZone:{flex:1,overflowY:'auto',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'16px'},
  loading:{textAlign:'center',padding:'2rem',color:'#888'},
  emptyChat:{textAlign:'center',padding:'3rem',color:'#aaa'},
  messageRow:{display:'flex',gap:'10px',alignItems:'flex-end'},
  avatar:{width:'36px',height:'36px',borderRadius:'50%',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'600',flexShrink:0},
  expediteurName:{fontSize:'12px',fontWeight:'600',color:'#555',marginBottom:'4px'},
  msgTime:{fontSize:'11px',color:'#aaa',fontWeight:'400',marginLeft:'8px'},
  bubble:{padding:'10px 14px',borderRadius:'14px',maxWidth:'100%'},
  bubbleThem:{background:'#f0f2f5',borderBottomLeftRadius:'4px'},
  bubbleMe:{background:'#0a2342',borderBottomRightRadius:'4px'},
  msgContenu:{fontSize:'14px',lineHeight:'1.5',margin:0,color:'inherit',wordBreak:'break-word'},
  msgTimeMe:{fontSize:'11px',color:'rgba(255,255,255,0.6)',display:'block',textAlign:'right',marginTop:'4px'},
  supprimerBtn:{background:'transparent',border:'none',color:'#e74c3c',fontSize:'11px',cursor:'pointer',padding:'2px 0',marginTop:'4px'},
  inputZone:{display:'flex',gap:'10px',padding:'1rem 1.5rem',borderTop:'1px solid #f0f0f0',background:'white'},
  input:{flex:1,padding:'12px 16px',border:'1.5px solid #e0e0e0',borderRadius:'25px',fontSize:'14px',background:'#f8f9fa',outline:'none'},
  sendBtn:{padding:'12px 24px',background:'#0a2342',color:'white',border:'none',borderRadius:'25px',fontSize:'14px',fontWeight:'600',cursor:'pointer'},
}
