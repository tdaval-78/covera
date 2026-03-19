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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error); setLoading(false); }
    else router.push('/');
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #F0F1FB 0%, #EEF0FE 40%, #F5F3FF 70%, #F0F9FF 100%)' }}
    >
      {/* Left panel — branding (desktop only) */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'linear-gradient(160deg, #5B4CF5 0%, #7C5CF5 50%, #9B6CF5 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Covera</span>
        </div>

        {/* Hero text */}
        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Clarifiez vos assurances,<br />une bonne fois pour toutes.
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-8">
            Importez vos contrats, comprenez ce qui est couvert, et posez vos questions à l&apos;IA.
          </p>
          {/* Testimonials */}
          <div className="space-y-3">
            {[
              { quote: 'J&apos;ai enfin compris ce qui était couvert dans ma mutuelle.', author: 'Marie, 34 ans' },
              { quote: 'Avant je ne lisais jamais mes contrats. Maintenant je sais tout.', author: 'Lucas, 28 ans' },
            ].map(({ quote, author }) => (
              <div
                key={author}
                className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
              >
                <p className="text-white/90 text-sm leading-relaxed mb-2">&ldquo;{quote}&rdquo;</p>
                <p className="text-white/60 text-xs font-medium">{author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs">© 2026 Covera · Tes assurances clarifiées</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.3)' }}
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Covera</span>
        </div>

        {/* Form card */}
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
              Bon retour
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Connectez-vous pour accéder à vos assurances.
            </p>
          </div>

          {error && (
            <div
              className="flex items-center gap-2.5 p-4 mb-5 rounded-xl text-sm"
              style={{ background: 'var(--rose-light)', color: 'var(--rose-text)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Adresse email
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Mot de passe
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold transition-colors"
                  style={{ color: 'var(--brand)' }}
                >
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input pr-11"
                  autoComplete="current-password"
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
            </div>

            {/* Submit */}
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
                  Connexion...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>pas encore de compte ?</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Register link */}
          <Link
            href="/auth/register"
            className="block w-full py-3.5 rounded-xl font-semibold text-center transition-all"
            style={{
              background: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border)',
            }}
          >
            Créer un compte gratuitement
          </Link>
        </div>

        {/* Mobile footer */}
        <p className="lg:hidden text-center text-xs mt-8" style={{ color: 'var(--text-tertiary)' }}>
          © 2026 Covera · Tes assurances clarifiées
        </p>
      </div>
    </div>
  );
}
