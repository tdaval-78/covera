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
    <div className="min-h-screen flex" style={{ background: '#F0F1FB' }}>
      {/* ─── LEFT: Branding panel ─── */}
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
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Orb decorations */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">Covera</span>
            <p className="text-white/60 text-xs mt-0.5">Tes assurances clarifiées</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center mt-8">
          <h2 className="text-white font-extrabold leading-tight mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '-0.03em' }}>
            Vos assurances,<br />crystal clear.
          </h2>
          <p className="text-white/75 text-base leading-relaxed mb-10 max-w-sm">
            Importez vos contrats, comprenez exactement ce qui est couvert, et posez vos questions à l&apos;IA. En 30 secondes.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2 flex-shrink-0">
              {['EM', 'ML', 'AC', 'JR'].map((initial, i) => (
                <div
                  key={initial}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white/30"
                  style={{ background: `hsl(${(initial.charCodeAt(0) * 47 + i * 30) % 360}, 55%, 60%)`, zIndex: 4 - i }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm">+2 400 utilisateurs</p>
              <p className="text-white/65 text-xs">contrats analysés ce mois</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-3 overflow-hidden">
            {[
              {
                quote: "Je ne savais même pas que mon téléphone était assuré pour le vol. Covera m'a permis de découvrir des garanties que je payais sans le savoir.",
                author: 'Sophie M.',
                role: 'Utilisatrice Covera depuis 3 mois',
              },
              {
                quote: "Quand j'ai eu un sinistre, j'ai pu répondre à l'assureur en connaissant exactement mes droits. Ça m'a économisé 400€.",
                author: 'Thomas L.',
                role: 'Utilisateur Covera depuis 6 mois',
              },
            ].map(({ quote, author, role }) => (
              <div
                key={author}
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  overflow: 'hidden',
                }}
              >
                <p className="text-white/90 text-sm leading-relaxed mb-3" style={{ wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    {author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold">{author}</p>
                    <p className="text-white/60 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between mt-8 gap-4">
          <p className="text-white/55 text-xs flex-shrink-0">© 2026 Covera · données chiffrées</p>
          <div className="flex items-center gap-1.5 text-white/55 text-xs flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Chiffrement bout en bout
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Form ─── */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 xl:p-16"
        style={{ minHeight: '100vh' }}
      >
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

        <div className="w-full" style={{ maxWidth: '400px' }}>
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
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl font-semibold text-white text-base transition-all mt-2"
              style={{
                padding: '15px 24px',
                background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)',
                boxShadow: '0 2px 8px rgba(91,76,245,0.3), 0 0 0 1px rgba(91,76,245,0.1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(91,76,245,0.4), 0 0 0 1px rgba(91,76,245,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(91,76,245,0.3), 0 0 0 1px rgba(91,76,245,0.1)')}
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
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Pas encore de compte ?</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Register */}
          <Link
            href="/auth/register"
            className="block w-full text-center font-semibold text-base transition-all"
            style={{
              padding: '15px 24px',
              borderRadius: '12px',
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
