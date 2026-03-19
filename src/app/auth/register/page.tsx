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
    if (password.length < 6) return { level: 1, color: '#EF4444', label: 'Trop court' };
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
        <div className="w-full max-w-sm text-center">
          <div
            className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'var(--emerald-light)' }}
          >
            <CheckCircle size={40} style={{ color: 'var(--emerald)' }} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Compte créé !
          </h2>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            Nous avons envoyé un email de confirmation à
          </p>
          <p className="font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>{email}</p>
          <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
            Cliquez sur le lien dans l&apos;email pour activer votre compte.
          </p>
          <Link href="/auth/login" className="btn btn-brand btn-lg w-full">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #F0F1FB 0%, #EEF0FE 40%, #F5F3FF 70%, #F0F9FF 100%)' }}
    >
      {/* Left — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'linear-gradient(160deg, #5B4CF5 0%, #7C5CF5 50%, #9B6CF5 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Covera</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Vos assurances,<br />enfin limpides.
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-6">
            Gratuit pour toujours. Analysez vos contrats en quelques secondes avec l&apos;IA.
          </p>
          <div className="space-y-3">
            {[
              { icon: '📄', text: 'Importez vos contrats PDF ou photo' },
              { icon: '🧠', text: 'L&apos;IA analyse et résume tout automatiquement' },
              { icon: '💬', text: 'Posez vos questions en langage naturel' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  {icon}
                </div>
                <p className="text-white/90 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs">© 2026 Covera · Tes assurances clarifiées</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Covera</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
              Créer un compte
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Gratuit, sans engagement, en 30 secondes.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-4 mb-5 rounded-xl text-sm" style={{ background: 'var(--rose-light)', color: 'var(--rose-text)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
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
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
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
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 caractères"
                  required
                  className="input pr-11"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {s && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(s.level / 4) * 100}%`, background: s.color }}
                      />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all mt-2"
              style={{
                background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)',
                boxShadow: '0 4px 16px rgba(91,76,245,0.3)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Création...
                </span>
              ) : 'Créer mon compte'}
            </button>

            <p className="text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className="underline" style={{ color: 'var(--brand)' }}>conditions</a>{' '}
              et notre{' '}
              <a href="#" className="underline" style={{ color: 'var(--brand)' }}>politique de confidentialité</a>.
            </p>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>déjà un compte ?</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <Link
            href="/auth/login"
            className="block w-full py-3.5 rounded-xl font-semibold text-center transition-all"
            style={{
              background: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border)',
            }}
          >
            Se connecter
          </Link>
        </div>

        <p className="lg:hidden text-center text-xs mt-8" style={{ color: 'var(--text-tertiary)' }}>
          © 2026 Covera
        </p>
      </div>
    </div>
  );
}
