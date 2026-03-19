'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error); setLoading(false); }
    else router.push('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F1FB' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .anim-fade-up { animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-fade-up-1 { animation: fadeUp 0.5s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-fade-up-2 { animation: fadeUp 0.5s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-fade-up-3 { animation: fadeUp 0.5s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-fade-up-4 { animation: fadeUp 0.5s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-fade-up-5 { animation: fadeUp 0.5s 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-fade { animation: fadeIn 0.4s ease both; }
      `}</style>

      {/* LEFT: Branding */}
      <div style={{
        display: 'none',
        width: 'clamp(380px, 44vw, 560px)', minWidth: '380px', flexShrink: 0,
        padding: 'clamp(32px, 4vw, 56px)',
        background: 'linear-gradient(160deg, #3D33D4 0%, #5B4CF5 35%, #7C5CF5 65%, #9B6CF5 100%)',
        position: 'relative', overflow: 'hidden',
        flexDirection: 'column', justifyContent: 'center',
      }} className="lg:flex flex-col">

        {/* Animated dot pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 20% 20%, white 1.5px, transparent 1.5px), radial-gradient(circle at 80% 80%, white 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '-96px', right: '-96px', width: '384px', height: '384px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.20) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-64px', width: '288px', height: '288px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '-32px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 65%)' }} />

        {/* Logo */}
        <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '56px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Covera</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>Tes assurances clarifiées</div>
          </div>
        </div>

        {/* Hero */}
        <div className="anim-fade-up-1" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Vos assurances,<br />crystal clear.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '360px' }}>
            Importez vos contrats, comprenez exactement ce qui est couvert, et posez vos questions à l&apos;IA. En 30 secondes.
          </p>
        </div>

        {/* Social proof */}
        <div className="anim-fade-up-2" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ display: 'flex' }}>
            {[{ i: 'EM', c: '#A78BFA' }, { i: 'ML', c: '#F472B6' }, { i: 'AC', c: '#34D399' }, { i: 'JR', c: '#FBBF24' }].map(({ i, c }, idx) => (
              <div key={i} style={{
                width: '36px', height: '36px', borderRadius: '50%', background: c,
                border: '2.5px solid rgba(255,255,255,0.35)', marginLeft: idx > 0 ? '-10px' : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: 'white', zIndex: 4 - idx, position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}>{i}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>+2 400 utilisateurs</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>contrats analysés ce mois</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="anim-fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {[
            { q: "Je ne savais même pas que mon téléphone était assuré pour le vol. Covera m'a permis de découvrir des garanties que je payais sans le savoir.", a: 'Sophie M.', r: 'Utilisatrice Covera · 3 mois' },
            { q: "Quand j'ai eu un sinistre, j'ai pu répondre à l'assureur en connaissant exactement mes droits. Ça m'a économisé 400€.", a: 'Thomas L.', r: 'Utilisateur Covera · 6 mois' },
          ].map(({ q, a, r }) => (
            <div key={a} style={{
              borderRadius: '16px', padding: '16px',
              background: 'rgba(255,255,255,0.11)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.92)', lineHeight: 1.7, marginBottom: '12px', wordBreak: 'break-word' }}>&ldquo;{q}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>{a.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>{a}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>{r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="anim-fade-up-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '8px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>© 2026 Covera · données chiffrées</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Chiffrement bout en bout
          </div>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', minHeight: '100vh' }}>
        {/* Mobile logo */}
        <div className="lg:hidden anim-fade" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Covera</span>
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="anim-fade-up" style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: '8px' }}>Bon retour 👋</h1>
            <p style={{ fontSize: '15px', color: '#64748B' }}>Connectez-vous pour accéder à vos assurances.</p>
          </div>

          {error && (
            <div className="anim-fade" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', background: '#FEF2F2', color: '#991B1B', fontSize: '14px', marginBottom: '20px', border: '1px solid #FECACA', boxShadow: '0 2px 8px rgba(239,68,68,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={doLogin} className="anim-fade-up-1" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: focused === 'email' ? '#5B4CF5' : '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', transition: 'color 0.2s' }}>Adresse email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="vous@exemple.com" required autoComplete="email"
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                  style={{
                    display: 'block', width: '100%', padding: '14px 16px', boxSizing: 'border-box',
                    background: '#FFFFFF', border: `1.5px solid ${focused === 'email' ? '#5B4CF5' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: '14px', fontSize: '15px', color: '#0F172A', outline: 'none',
                    boxShadow: focused === 'email' ? '0 0 0 3px rgba(91,76,245,0.12)' : '0 2px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: focused === 'pw' ? '#5B4CF5' : '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}>Mot de passe</label>
                <Link href="/auth/forgot-password" style={{ fontSize: '12px', fontWeight: 600, color: '#5B4CF5', textDecoration: 'none' }}>Oublié ?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required autoComplete="current-password"
                  onFocus={() => setFocused('pw')} onBlur={() => setFocused(null)}
                  style={{
                    display: 'block', width: '100%', padding: '14px 48px 14px 16px', boxSizing: 'border-box',
                    background: '#FFFFFF', border: `1.5px solid ${focused === 'pw' ? '#5B4CF5' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: '14px', fontSize: '15px', color: '#0F172A', outline: 'none',
                    boxShadow: focused === 'pw' ? '0 0 0 3px rgba(91,76,245,0.12)' : '0 2px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', display: 'flex', borderRadius: '6px', transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#5B4CF5')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#94A3B8')}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '15px 24px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #5B4CF5 0%, #7C5CF5 100%)',
                backgroundSize: '200% 100%',
                backgroundPosition: loading ? '0% center' : '100% center',
                color: 'white', fontSize: '15px', fontWeight: 600, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(91,76,245,0.3), 0 1px 3px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                animation: loading ? 'shimmer 1.5s linear infinite' : 'none',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(91,76,245,0.4), 0 1px 3px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(91,76,245,0.3), 0 1px 3px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {loading ? (
                <><span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />Connexion...</>
              ) : 'Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div className="anim-fade-up-2" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.06)' }} />
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B', whiteSpace: 'nowrap' }}>Pas encore de compte ?</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.06)' }} />
          </div>

          {/* Register */}
          <Link className="anim-fade-up-3" href="/auth/register"
            style={{
              display: 'block', width: '100%', padding: '15px 24px', borderRadius: '14px',
              background: '#F8FAFC', color: '#0F172A', fontSize: '15px', fontWeight: 600,
              textAlign: 'center', textDecoration: 'none',
              border: '1.5px solid rgba(0,0,0,0.06)',
              transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,76,245,0.3)'; (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.background = '#F8FAFC'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
          >
            Créer un compte — c&apos;est gratuit
          </Link>
        </div>

        <p className="lg:hidden anim-fade-up-4" style={{ fontSize: '11px', color: '#94A3B8', marginTop: '40px' }}>© 2026 Covera · données chiffrées</p>
      </div>
    </div>
  );
}
