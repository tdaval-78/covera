'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Mail, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <div className="p-5 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="spinner-dark" />
      </div>
    );
  }

  const createdDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="p-5 md:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>Mon compte</h1>

      {/* Profile card */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.3)' }}
          >
            {initials}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {user.user_metadata?.full_name || 'Utilisateur'}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              {user.email_confirmed_at ? (
                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--emerald)' }}>
                  <CheckCircle size={14} />
                  Email confirmé
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--amber)' }}>
                  <AlertCircle size={14} />
                  Email non confirmé
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
            <Mail size={18} style={{ color: 'var(--brand)' }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5">Email</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
            <Calendar size={18} style={{ color: 'var(--brand)' }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5">Membre depuis</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{createdDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="btn btn-ghost btn-lg w-full"
      >
        {loading ? (
          <><div className="spinner !border-gray-300 !border-t-gray-600" /> Déconnexion...</>
        ) : (
          <><LogOut size={18} /> Se déconnecter</>
        )}
      </button>
    </div>
  );
}
