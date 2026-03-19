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
    <div className="min-h-screen flex" style={{ background: '#FAFBFD' }}>
      {/* ─── LEFT: Branding panel ─── */}
      <div
        className="hidden lg:flex flex-col p-10 xl:p-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, #5B4CF5 0%, #6F58F0 25%, #7C5CF5 50%, #9B6CF5 100%)',
          width: 'clamp(360px, 42vw, 520px)',
          minWidth: '360px',
          maxWidth: '520px',
          flexShrink: 0,
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Glowing orb decorations */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-10 w-60 h-60 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Covera</span>
        </div>

        {/* Main headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 className="text-[2.1rem] xl:text-[2.5rem] font-extrabold text-white leading-[1.15] tracking-tight mb-4">
            Vos assurances,<br />crystal clear.
          </h2>
          <p className="text-white/65 text-base xl:text-lg leading-relaxed mb-10 max-w-sm">
            Importez vos contrats, comprenez exactement ce qui est couvert, et posez vos questions à l&apos;IA. En 30 secondes.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3 mb-8 overflow-hidden">
            <div className="flex -space-x-2 flex-shrink-0">
              {['EM', 'ML', 'AC', 'JR'].map(initial => (
                <div
                  key={initial}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white/20"
                  style={{ background: `hsl(${(initial.charCodeAt(0) * 47) % 360}, 60%, 65%)` }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-white font-semibold text-sm">+2 400 utilisateurs</p>
              <p className="text-white/55 text-xs truncate">contrats analysés ce mois</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-3 overflow-hidden">
            {[
              { quote: "Je ne savais même pas que mon téléphone était assuré pour le vol. Covera m'a permis de découvrir des garanties que je payais sans le savoir.", author: 'Sophie M.', role: 'Utilisatrice Covera depuis 3 mois' },
              { quote: "Quand j'ai eu un sinistre, j'ai pu répondre à l'assureur en connaissant exactement mes droits. Ça m'a économisé 400€.", author: 'Thomas L.', role: 'Utilisateur Covera depuis 6 mois' },
            ].map(({ quote, author, role }) => (
              <div
                key={author}
                className="p-4 rounded-xl w-full"
                style={{ background: 'rgba(255,255,255,0.11)', backdropFilter: 'blur(16px)', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                <p className="text-white/90 text-sm leading-relaxed mb-2" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    {author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold">{author}</p>
                    <p className="text-white/45 text-xs truncate">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-white/50 text-xs">© 2026 Covera · données chiffrées</p>
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Chiffrement de bout en bout
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Form ─── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 xl:p-16">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
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
            <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
              Bon retour 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Connectez-vous pour accéder à vos assurances.
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
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'var(--text-secondary)' }}
                >
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
                  className="input pr-12"
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl font-semibold text-white text-base py-3.5 transition-all mt-1"
              style={{
                background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)',
                boxShadow: '0 4px 20px rgba(91,76,245,0.35)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 28px rgba(91,76,245,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(91,76,245,0.35)')}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Connexion en cours...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              pas encore de compte ?
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <Link
            href="/auth/register"
            className="block w-full text-center py-3.5 rounded-xl font-semibold text-base transition-all"
            style={{
              background: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border)',
            }}
          >
            Créer un compte — c&apos;est gratuit
          </Link>
        </div>

        {/* Mobile footer */}
        <p className="lg:hidden text-center text-xs mt-10" style={{ color: 'var(--text-tertiary)' }}>
          © 2026 Covera · données chiffrées
        </p>
      </div>
    </div>
  );
}
