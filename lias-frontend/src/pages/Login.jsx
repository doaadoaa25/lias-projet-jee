import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ email: '', motDePasse: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      navigate('/dashboard')
    } catch (err) {
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      {/* Panneau gauche */}
      <div style={s.left}>
        <div style={s.leftContent}>
          <div style={s.leftLogo}>LIAS</div>
          <h1 style={s.leftTitle}>Laboratoire d'Intelligence Artificielle et Systèmes</h1>
          <p style={s.leftSub}>Université Hassan II de Casablanca — Faculté des Sciences Ben M'Sik</p>
          <div style={s.leftStats}>
            {[['230+', 'Publications indexées'], ['42', 'Doctorants actifs'], ['4', 'Équipes de recherche']].map(([v, l]) => (
              <div key={l} style={s.leftStat}>
                <div style={s.leftStatVal}>{v}</div>
                <div style={s.leftStatLab}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau droit */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardLogo}>LIAS</div>
            <h2 style={s.cardTitle}>Connexion</h2>
            <p style={s.cardSub}>Accédez à votre espace membre</p>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Adresse email</label>
              <input
                type="email"
                placeholder="prenom.nom@lias.ma"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={s.input}
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.motDePasse}
                onChange={e => setForm({ ...form, motDePasse: e.target.value })}
                style={s.input}
                required
              />
            </div>

            {error && (
              <div style={s.error}>⚠️ {error}</div>
            )}

            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p style={s.footer}>
            Laboratoire LIAS · FSBM · Université Hassan II
          </p>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1,
    background: 'linear-gradient(160deg, #0a2342 0%, #0f6e56 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
  },
  leftContent: { maxWidth: '420px' },
  leftLogo: {
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    fontWeight: '700',
    fontSize: '18px',
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  leftTitle: { color: 'white', fontSize: '26px', fontWeight: '600', lineHeight: '1.3', marginBottom: '1rem' },
  leftSub: { color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: '1.6', marginBottom: '2.5rem' },
  leftStats: { display: 'flex', gap: '2rem' },
  leftStat: { textAlign: 'center' },
  leftStatVal: { color: 'white', fontSize: '28px', fontWeight: '700' },
  leftStatLab: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' },
  right: {
    width: '480px',
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  cardHeader: { textAlign: 'center', marginBottom: '2rem' },
  cardLogo: {
    background: '#0a2342',
    color: 'white',
    fontWeight: '700',
    fontSize: '14px',
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  cardTitle: { fontSize: '22px', fontWeight: '600', color: '#0a2342', marginBottom: '6px' },
  cardSub: { color: '#666', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  input: {
    padding: '11px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '15px',
    background: '#fafafa',
  },
  error: {
    background: '#fff3f3',
    border: '1px solid #ffd0d0',
    color: '#c0392b',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  btn: {
    padding: '13px',
    background: '#0a2342',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    marginTop: '4px',
  },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#aaa', fontSize: '12px' },
}
