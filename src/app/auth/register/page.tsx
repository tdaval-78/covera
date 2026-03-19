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
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: 'linear-gradient(135deg, #F0F1FB 0%, #EEF0FE 50%, #F5F3FF 100%)' }}
      >
        <div className="w-full text-center" style={{ maxWidth: '400px' }}>
          <div
            className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-fade-in-scale"
            style={{ background: 'var(--emerald-light)' }}
          >
            <CheckCircle size={40} style={{ color: 'var(--emerald)' }} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 animate-fade-in" style={{ color: 'var(--text-primary)' }}>
            Compte créé !
          </h2>
          <p className="text-base mb-2 animate-fade-in" style={{ color: 'var(--text-secondary)' }}>
            Nous avons envoyé un email de confirmation à
          </p>
          <p className="font-semibold mb-6 animate-fade-in" style={{ color: 'var(--text-primary)' }}>{email}</p>
          <p className="text-sm mb-8 animate-fade-in" style={{ color: 'var(--text-tertiary)' }}>
            Cliquez sur le lien dans l&apos;email pour activer votre compte. Pensez à vérifier vos spams.
          </p>
          <Link href="/auth/login" className="btn btn-brand btn-lg w-full">
            Se connecter →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F0F1FB' }}>
      {/* LEFT: Branding */}
      <div
        className="hidden lg:flex flex-col relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #4A3EE0 0%, #5B4CF5 35%, #7C5CF5 65%, #9B6CF5 100%)',
          width: 'clamp(380px, 44vw, 560px)',
          minWidth: '380px',
          flexShrink: 0,
          padding: 'clamp(32px, 4vw, 56px)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 65%)' }} />
        <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)' }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Covera</span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center mt-8">
          <h2 className="text-white font-extrabold leading-tight mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '-0.03em' }}>
            Comprenez enfin<br />vos contrats.
          </h2>
          <p className="text-white/75 text-base leading-relaxed mb-10 max-w-sm">
            Gratuit pour toujours. Analysez vos contrats en 30 secondes avec l&apos;IA. Aucune carte bancaire requise.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              { icon: '📄', title: 'Importez en 30s', desc: 'PDF, photo ou texte — ça marche avec tout' },
              { icon: '🧠', title: 'IA qui comprend tout', desc: 'Résume automatiquement vos garanties et exclusions' },
              { icon: '💬', title: 'Chattez avec votre contrat', desc: 'Posez des questions en français, elle répond' },
              { icon: '🔒', title: 'Vos données protégées', desc: 'Chiffrement de bout en bout, accès vous seul' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  {icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-white/55 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="font-medium">Sécurité &amp; confidentialité garanties</span>
          </div>
        </div>

        <div className="relative z-10 mt-8">
          <p className="text-white/50 text-xs">© 2026 Covera · sans engagement</p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 xl:p-16" style={{ minHeight: '100vh' }}>
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Covera</span>
        </div>

        <div className="w-full" style={{ maxWidth: '400px' }}>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
              Créer un compte ✨
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Gratuit, sans carte bancaire, en 30 secondes.
            </p>
          </div>

          {error && (
            <div
              className="flex items-center gap-3 p-4 mb-6 rounded-xl text-sm animate-fade-in"
              style={{ background: 'var(--rose-light)', color: 'var(--rose-text)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Thomas Dupont"
                required
                className="input"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  required
                  className="input pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors p-1"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {s && (
                <div className="mt-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 rounded-full overflow-hidden flex gap-1" style={{ background: 'var(--bg-subtle)' }}>
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className="flex-1 h-full rounded-full transition-all duration-300"
                          style={{ background: i <= s.level ? s.color : 'transparent' }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold" style={{ color: s.color }}>{s.label}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl font-semibold text-white text-base transition-all mt-2"
              style={{
                padding: '15px 24px',
                background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)',
                boxShadow: '0 4px 14px rgba(91,76,245,0.35)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(91,76,245,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(91,76,245,0.35)')}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Création...
                </span>
              ) : 'Créer mon compte'}
            </button>

            <p className="text-center text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className="underline" style={{ color: 'var(--brand)' }}>conditions d&apos;utilisation</a>{' '}
              et notre{' '}
              <a href="#" className="underline" style={{ color: 'var(--brand)' }}>politique de confidentialité</a>.
            </p>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Déjà un compte ?</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <Link
            href="/auth/login"
            className="block w-full text-center font-semibold text-base transition-all"
            style={{
              padding: '15px 24px',
              borderRadius: '12px',
              background: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border)',
            }}
          >
            Se connecter
          </Link>
        </div>

        <p className="lg:hidden text-center text-xs mt-10" style={{ color: 'var(--text-tertiary)' }}>
          © 2026 Covera · sans engagement
        </p>
      </div>
    </div>
  );
}
