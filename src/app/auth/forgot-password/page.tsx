'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
      <div className="auth-bg p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'var(--emerald-light)' }}>
            <CheckCircle size={32} style={{ color: 'var(--emerald)' }} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Email envoyé !</h2>
          <p className="text-sm mb-6">
            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
            Vérifiez votre boîte de réception.
          </p>
          <Link href="/auth/login" className="btn btn-brand btn-lg">Retour à la connexion</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.3)' }}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Covera</h1>
        </div>

        <div className="card p-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Mot de passe oublié ?</h2>
          <p className="text-sm mb-5">Entrez votre email et nous vous enverrons un lien de réinitialisation.</p>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-4 rounded-xl text-sm" style={{ background: 'var(--rose-light)', color: 'var(--rose-text)' }}>
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com" required className="input" />
            <button type="submit" disabled={loading} className="btn btn-brand btn-lg w-full">
              {loading ? <><div className="spinner" /> Envoi...</> : 'Envoyer le lien'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5">
          <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--brand)' }}>
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
