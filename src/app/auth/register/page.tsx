'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

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
    if (password.length < 6) return { level: 1, color: 'var(--rose)', label: 'Faible' };
    if (password.length < 10) return { level: 2, color: 'var(--amber)', label: 'Moyen' };
    return { level: 3, color: 'var(--emerald)', label: 'Fort' };
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
      <div className="auth-bg p-4">
        <div className="w-full max-w-sm text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'var(--emerald-light)' }}
          >
            <CheckCircle size={32} style={{ color: 'var(--emerald)' }} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Compte créé !</h2>
          <p className="text-sm mb-6">
            Nous avons envoyé un email de confirmation à <strong>{email}</strong>.<br />
            Cliquez sur le lien pour activer votre compte.
          </p>
          <Link href="/auth/login" className="btn btn-brand btn-lg">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.3)' }}
          >
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Covera</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Tes assurances clarifiées</p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-5" style={{ color: 'var(--text-primary)' }}>Créer un compte</h2>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-4 rounded-xl text-sm" style={{ background: 'var(--rose-light)', color: 'var(--rose-text)' }}>
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block">Nom complet</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Thomas Dupont" required className="input" autoComplete="name" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com" required className="input" autoComplete="email" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block">Mot de passe</label>
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
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {s && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(s.level / 3) * 100}%`, background: s.color }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn btn-brand btn-lg w-full mt-2">
              {loading ? <><div className="spinner" /> Création...</> : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--text-secondary)' }}>
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--brand)' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
