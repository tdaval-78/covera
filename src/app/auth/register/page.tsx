'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = () => {
    if (!password) return null;
    if (password.length < 6) return { level: 1, color: '#EF4444', label: 'Trop faible' };
    if (password.length < 8) return { level: 2, color: '#F59E0B', label: 'Moyen' };
    if (password.length < 12) return { level: 3, color: '#10B981', label: 'Bon' };
    return { level: 4, color: '#059669', label: 'Excellent' };
  };
  const s = strength();

  const doRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) { setError(error); setLoading(false); }
    else { setSuccess(true); setLoading(false); }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #F0F1FB 0%, #EEF0FE 50%, #F5F3FF 100%)', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={40} color="#10B981" />
          </div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '12px' }}>Compte créé !</h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '8px' }}>Nous avons envoyé un email de confirmation à</p>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '24px' }}>{email}</p>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '32px' }}>Cliquez sur le lien dans l&apos;email pour activer votre compte. Pensez à vérifier vos spams.</p>
          <Link href="/auth/login" style={{ display: 'block', width: '100%', padding: '15px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', color: 'white', fontSize: '15px', fontWeight: 600, textAlign: 'center', textDecoration: 'none', boxShadow: '0 2px 8px rgba(91,76,245,0.25)' }}>Se connecter →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F1FB' }}>
      {/* LEFT: Branding */}
      <div style={{
        display: 'none',
        width: 'clamp(380px, 44vw, 560px)', minWidth: '380px', flexShrink: 0,
        padding: 'clamp(32px, 4vw, 56px)',
        background: 'linear-gradient(160deg, #4A3EE0 0%, #5B4CF5 35%, #7C5CF5 65%, #9B6CF5 100%)',
        position: 'relative', overflow: 'hidden',
        flexDirection: 'column', justifyContent: 'center',
      }} className="lg:flex flex-col">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.035, backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', top: '-96px', right: '-96px', width: '384px', height: '384px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-64px', width: '288px', height: '288px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Covera</div>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Comprenez enfin<br />vos contrats.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '360px' }}>
            Gratuit pour toujours. Analysez vos contrats en 30 secondes avec l&apos;IA. Aucune carte bancaire requise.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {[
            { icon: '📄', title: 'Importez en 30s', desc: 'PDF, photo ou texte' },
            { icon: '🧠', title: 'IA qui comprend tout', desc: 'Garanties et exclusions résumées' },
            { icon: '💬', title: 'Chattez avec votre contrat', desc: 'Questions en français, réponses fiables' },
            { icon: '🔒', title: 'Données protégées', desc: 'Chiffrement de bout en bout' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', width: 'fit-content' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'white' }}>Sécurité &amp; confidentialité garanties</span>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '8px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>© 2026 Covera · sans engagement</span>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }} className="lg:hidden">
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Covera</span>
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '8px' }}>Créer un compte ✨</h1>
            <p style={{ fontSize: '15px', color: '#64748B' }}>Gratuit · sans carte bancaire · 30 secondes.</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', background: '#FEF2F2', color: '#991B1B', fontSize: '14px', marginBottom: '20px', border: '1px solid #FECACA' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={doRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Nom complet</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Thomas Dupont" required autoComplete="name"
                style={{ width: '100%', padding: '14px 16px', background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: '12px', fontSize: '15px', color: '#0F172A', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = '#5B4CF5')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.06)')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" required autoComplete="email"
                style={{ width: '100%', padding: '14px 16px', background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: '12px', fontSize: '15px', color: '#0F172A', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = '#5B4CF5')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.06)')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 caractères" required autoComplete="new-password"
                  style={{ width: '100%', padding: '14px 48px 14px 16px', background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: '12px', fontSize: '15px', color: '#0F172A', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = '#5B4CF5')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.06)')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', display: 'flex' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {s && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '4px', borderRadius: '4px', background: '#F4F6F8', display: 'flex', gap: '4px', overflow: 'hidden' }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ flex: 1, borderRadius: '4px', background: i <= s.level ? s.color : 'transparent', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: s.color }}>{s.label}</span>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '15px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', color: 'white', fontSize: '15px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 2px 8px rgba(91,76,245,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
              {loading ? (
                <><span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />Création...</>
              ) : 'Créer mon compte'}
            </button>

            <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', lineHeight: 1.6, marginTop: '4px' }}>
              En créant un compte, vous acceptez nos <a href="#" style={{ color: '#5B4CF5', textDecoration: 'underline' }}>conditions</a> et notre <a href="#" style={{ color: '#5B4CF5', textDecoration: 'underline' }}>politique de confidentialité</a>.
            </p>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.06)' }} />
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B', whiteSpace: 'nowrap' }}>Déjà un compte ?</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.06)' }} />
          </div>

          <Link href="/auth/login" style={{ display: 'block', width: '100%', padding: '15px 24px', borderRadius: '12px', background: '#F4F6F8', color: '#0F172A', fontSize: '15px', fontWeight: 600, textAlign: 'center', textDecoration: 'none', border: '1.5px solid rgba(0,0,0,0.06)' }}>
            Se connecter
          </Link>
        </div>

        <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '40px' }} className="lg:hidden">© 2026 Covera · sans engagement</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
