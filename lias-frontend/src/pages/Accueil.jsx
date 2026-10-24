import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Accueil() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',
    etablissementOrigine: '', motivation: ''
})

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/adhesions/soumettre', form)
      setSubmitted(true)
      setShowForm(false)
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de l\'envoi')
    }
  }

  return (
    <div style={s.page}>
      {/* NAVBAR publique */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navLogo}>LIAS</div>
          <div>
            <div style={s.navTitle}>Laboratoire LIAS</div>
            <div style={s.navSub}>Université Hassan II — FSBM Casablanca</div>
          </div>
        </div>
        <div style={s.navLinks}>
          <a href="#apropos" style={s.navLink}>À propos</a>
          <a href="#equipes" style={s.navLink}>Équipes</a>
          <a href="#publications" style={s.navLink}>Publications</a>
          <a href="#contact" style={s.navLink}>Contact</a>
          <button onClick={() => navigate('/login')} style={s.loginBtn}>Connexion membre</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>🔬 Laboratoire de Recherche</div>
          <h1 style={s.heroTitle}>
            Laboratoire d'Intelligence<br />Artificielle et Systèmes
          </h1>
          <p style={s.heroDesc}>
            Le LIAS est un laboratoire de recherche de la Faculté des Sciences Ben M'Sik,
            Université Hassan II de Casablanca. Nous travaillons sur l'intelligence artificielle,
            les systèmes intelligents, l'ingénierie logicielle et les technologies de l'information.
          </p>
          <div style={s.heroStats}>
            {[['14+', 'Membres permanents'], ['42+', 'Doctorants'], ['230+', 'Publications'], ['4', 'Équipes']].map(([v, l]) => (
              <div key={l} style={s.heroStat}>
                <div style={s.heroStatVal}>{v}</div>
                <div style={s.heroStatLab}>{l}</div>
              </div>
            ))}
          </div>
          <div style={s.heroBtns}>
            <button onClick={() => setShowForm(true)} style={s.joinBtn}>
              Rejoindre le laboratoire →
            </button>
            <button onClick={() => navigate('/login')} style={s.memberBtn}>
              Espace membres
            </button>
          </div>
        </div>
      </div>

      {/* ÉQUIPES */}
      <div id="equipes" style={s.section}>
        <h2 style={s.sectionTitle}>Nos équipes de recherche</h2>
        <div style={s.equipeGrid}>
          {[
            { nom: 'ISDIAC', full: 'Ingénierie des Systèmes de Données, IA et Cloud', desc: 'Intelligence artificielle, Cloud computing, NLP, Sciences de données', color: '#0a2342' },
            { nom: 'SIMA', full: 'Systèmes Intelligents et Modélisation Avancée', desc: 'Technologies cognitives, systèmes intelligents, modélisation', color: '#0f6e56' },
            { nom: 'SDTIC', full: 'Systèmes et Données pour les TIC', desc: 'IoT, architecture des systèmes, technologie intelligente', color: '#534ab7' },
            { nom: 'ILIAS', full: 'Ingénierie Logicielle et Architectures de données', desc: 'Génie logiciel, modélisation mathématique, architectures', color: '#854f0b' },
          ].map(eq => (
            <div key={eq.nom} style={s.equipeCard}>
              <div style={{ ...s.equipeIcon, background: eq.color }}>{eq.nom}</div>
              <h3 style={s.equipeNom}>{eq.full}</h3>
              <p style={s.equipeDesc}>{eq.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* À PROPOS */}
      <div id="apropos" style={{ ...s.section, background: '#0a2342' }}>
        <div style={s.aproposGrid}>
          <div>
            <h2 style={{ ...s.sectionTitle, color: 'white' }}>À propos du LIAS</h2>
            <p style={s.aproposText}>
              Fondé à la Faculté des Sciences Ben M'Sik, le laboratoire LIAS réunit des chercheurs
              permanents, associés et doctorants autour de thématiques de pointe en intelligence artificielle
              et systèmes informatiques.
            </p>
            <p style={s.aproposText}>
              Nos travaux s'inscrivent dans une dynamique d'innovation scientifique et technologique,
              avec des collaborations nationales et internationales, et une forte implication dans
              la formation doctorale.
            </p>
          </div>
          <div style={s.aproposStats}>
            {[['2010', 'Année de création'], ['4', 'Équipes de recherche'], ['8+', 'Projets actifs'], ['50+', 'Partenaires']].map(([v, l]) => (
              <div key={l} style={s.aproposStat}>
                <div style={s.aproposStatVal}>{v}</div>
                <div style={s.aproposStatLab}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ÉVÉNEMENTS RÉCENTS */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Événements récents</h2>
        <div style={s.eventGrid}>
          {[
            { titre: 'ICAIS 2025', type: 'Conférence', date: 'Nov 2025', desc: 'International Conference on Artificial Intelligence and Systems' },
            { titre: 'Journée Doctorale', type: 'Séminaire', date: 'Juil 2025', desc: 'Journée dédiée à la recherche et l\'innovation en IA' },
            { titre: 'ICISCT 2026', type: 'Conférence', date: 'Sep 2026', desc: 'International Conference on Innovative Smart City Technologies' },
          ].map(ev => (
            <div key={ev.titre} style={s.eventCard}>
              <span style={s.eventType}>{ev.type}</span>
              <h3 style={s.eventTitre}>{ev.titre}</h3>
              <p style={s.eventDesc}>{ev.desc}</p>
              <p style={s.eventDate}>📅 {ev.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* REJOINDRE CTA */}
      <div style={s.cta}>
        <h2 style={s.ctaTitle}>Vous souhaitez rejoindre le LIAS ?</h2>
        <p style={s.ctaDesc}>Soumettez votre candidature en ligne — notre directrice examinera votre demande</p>
        <button onClick={() => setShowForm(true)} style={s.ctaBtn}>
          Soumettre une demande d'adhésion
        </button>
      </div>

      {/* CONTACT */}
      <div id="contact" style={s.footer}>
        <div style={s.footerContent}>
          <div style={s.footerLogo}>LIAS</div>
          <div>
            <p style={s.footerText}>Faculté des Sciences Ben M'Sik</p>
            <p style={s.footerText}>Université Hassan II de Casablanca</p>
            <p style={s.footerText}>🌐 lias.ma</p>
          </div>
          <button onClick={() => navigate('/login')} style={s.footerBtn}>Espace membres</button>
        </div>
      </div>

      {/* MODAL FORMULAIRE ADHÉSION */}
      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Demande d'adhésion au LIAS</h2>
              <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
            </div>
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
              <div style={s.formField}>
                <label style={s.label}>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={s.input} required placeholder="votre@email.com" />
              </div>
              <div style={s.formRow}>
                <div style={s.formField}>
                  <label style={s.label}>Établissement d'origine *</label>
                  <input value={form.etablissementOrigine} onChange={e => setForm({...form, etablissementOrigine: e.target.value})} style={s.input} required placeholder="Université, école..." />
                </div>
              </div>
              <div style={s.formField}>
                <label style={s.label}>Lettre de motivation *</label>
                <textarea value={form.motivation} onChange={e => setForm({...form, motivation: e.target.value})} style={{...s.input, height: '120px', resize: 'vertical'}} required placeholder="Décrivez vos travaux de recherche et vos motivations pour rejoindre le LIAS..." />
              </div>
              <button type="submit" style={s.submitBtn}>📤 Envoyer ma demande</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMATION */}
      {submitted && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '60px', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#0a2342', fontSize: '22px', marginBottom: '1rem' }}>Demande envoyée !</h2>
            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
              Votre demande d'adhésion a été transmise à la directrice du laboratoire LIAS.
              Vous serez contacté par email une fois votre dossier examiné.
            </p>
            <button onClick={() => setSubmitted(false)} style={s.submitBtn}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" },
  nav: { background: '#0a2342', padding: '0 3rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  navBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
  navLogo: { background: 'white', color: '#0a2342', fontWeight: '700', fontSize: '14px', width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navTitle: { color: 'white', fontSize: '15px', fontWeight: '600' },
  navSub: { color: 'rgba(255,255,255,0.55)', fontSize: '11px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '8px' },
  navLink: { color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '6px 12px', fontSize: '14px', borderRadius: '6px' },
  loginBtn: { background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' },
  hero: { background: 'linear-gradient(135deg, #0a2342 0%, #0f6e56 100%)', padding: '6rem 3rem', display: 'flex', justifyContent: 'center' },
  heroContent: { maxWidth: '800px', textAlign: 'center' },
  heroBadge: { background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' },
  heroTitle: { color: 'white', fontSize: '42px', fontWeight: '700', lineHeight: '1.2', marginBottom: '1.5rem' },
  heroDesc: { color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: '1.7', marginBottom: '2.5rem', maxWidth: '650px', margin: '0 auto 2.5rem' },
  heroStats: { display: 'flex', gap: '3rem', justifyContent: 'center', marginBottom: '2.5rem' },
  heroStat: { textAlign: 'center' },
  heroStatVal: { color: 'white', fontSize: '32px', fontWeight: '700' },
  heroStatLab: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' },
  heroBtns: { display: 'flex', gap: '14px', justifyContent: 'center' },
  joinBtn: { background: 'white', color: '#0a2342', border: 'none', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  memberBtn: { background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  section: { padding: '5rem 3rem', background: 'white' },
  sectionTitle: { fontSize: '28px', fontWeight: '700', color: '#0a2342', textAlign: 'center', marginBottom: '3rem' },
  equipeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' },
  equipeCard: { background: '#f8f9fa', borderRadius: '14px', padding: '2rem', textAlign: 'center' },
  equipeIcon: { color: 'white', fontWeight: '700', fontSize: '16px', width: '60px', height: '60px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' },
  equipeNom: { fontSize: '14px', fontWeight: '600', color: '#0a2342', marginBottom: '8px', lineHeight: '1.4' },
  equipeDesc: { fontSize: '13px', color: '#666', lineHeight: '1.5' },
  aproposGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', maxWidth: '1100px', margin: '0 auto', alignItems: 'center' },
  aproposText: { color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: '1.7', marginBottom: '1rem' },
  aproposStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  aproposStat: { background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' },
  aproposStatVal: { color: 'white', fontSize: '32px', fontWeight: '700' },
  aproposStatLab: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '6px' },
  eventGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '1100px', margin: '0 auto' },
  eventCard: { border: '1.5px solid #e0e0e0', borderRadius: '12px', padding: '1.5rem' },
  eventType: { fontSize: '11px', background: '#e6f1fb', color: '#185fa5', padding: '3px 10px', borderRadius: '10px', fontWeight: '600' },
  eventTitre: { fontSize: '17px', fontWeight: '600', color: '#0a2342', margin: '10px 0 6px' },
  eventDesc: { fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '10px' },
  eventDate: { fontSize: '12px', color: '#888' },
  cta: { background: '#f0f2f5', padding: '5rem 3rem', textAlign: 'center' },
  ctaTitle: { fontSize: '28px', fontWeight: '700', color: '#0a2342', marginBottom: '1rem' },
  ctaDesc: { color: '#666', fontSize: '15px', marginBottom: '2rem' },
  ctaBtn: { background: '#0a2342', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  footer: { background: '#0a2342', padding: '2rem 3rem' },
  footerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1100px', margin: '0 auto' },
  footerLogo: { background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: '700', fontSize: '16px', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  footerText: { color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginBottom: '4px' },
  footerBtn: { background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { fontSize: '20px', fontWeight: '600', color: '#0a2342' },
  closeBtn: { background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  input: { padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', background: '#fafafa' },
  submitBtn: { padding: '13px', background: '#0a2342', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '6px' },
}
