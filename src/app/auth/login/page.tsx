'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

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
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg" style={{boxShadow:'0 8px 24px rgba(99,102,241,0.3)'}}>
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Covera</h1>
          <p className="text-gray-500 text-sm mt-1">Tes assurances, clarifiées.</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 animate-fade-in-scale">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Se connecter</h2>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
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
                className="w-full glass-input px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400 text-base"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <Link href="/auth/forgot-password" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
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
                  className="w-full glass-input px-4 py-3 rounded-xl text-gray-900 pr-12 placeholder:text-gray-400 text-base"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 mt-5"
            >
              {loading ? (
                <><div className="spinner" /> Connexion...</>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Pas de compte ?{' '}
            <Link href="/auth/register" className="text-indigo-500 hover:text-indigo-700 font-semibold">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
