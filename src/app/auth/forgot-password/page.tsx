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
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-bg min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center animate-fade-in-scale">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email envoyé !</h2>
          <p className="text-gray-500 mb-6">
            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
            Vérifiez votre boîte de réception.
          </p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg" style={{boxShadow:'0 8px 24px rgba(99,102,241,0.3)'}}>
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text">Covera</h1>
        </div>

        <div className="glass rounded-3xl p-8 animate-fade-in-scale">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Mot de passe oublié ?</h2>
          <p className="text-gray-500 text-sm mb-6">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          {error && (
            <div className="flex items-center gap-3 p-4 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="w-full glass-input px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="spinner" /> Envoi...</>
              ) : (
                'Envoyer le lien'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link href="/auth/login" className="text-indigo-500 hover:text-indigo-700 font-semibold">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
