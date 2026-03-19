'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await resetPassword(email);
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
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--emerald-light)' }}>
            <CheckCircle size={40} style={{ color: 'var(--emerald)' }} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Email envoyé !
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
            Vérifiez votre boîte de réception (et vos spams).
          </p>
          <Link href="/auth/login" className="btn btn-brand btn-lg w-full">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #F0F1FB 0%, #EEF0FE 50%, #F5F3FF 100%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Covera</span>
        </div>

        <div className="card p-6">
          <h1 className="text-xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
            Mot de passe oublié ?
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-4 rounded-xl text-sm" style={{ background: 'var(--rose-light)', color: 'var(--rose-text)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)',
                boxShadow: '0 4px 16px rgba(91,76,245,0.3)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Envoi...
                </span>
              ) : 'Envoyer le lien'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5">
          <Link href="/auth/login" className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
