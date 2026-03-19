'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Mail, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

export default function AccountPage() {
  const { user, session, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-gray-500">Redirection...</p>
      </div>
    );
  }

  const createdDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="p-8 max-w-2xl mx-auto stagger">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon compte</h1>
      <p className="text-gray-500 mb-8">Gérez vos informations personnelles</p>

      {/* Profile card */}
      <div className="glass rounded-2xl p-6 mb-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{boxShadow:'0 4px 16px rgba(99,102,241,0.3)'}}>
            {user.user_metadata?.full_name
              ? user.user_metadata.full_name.charAt(0).toUpperCase()
              : user.email?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.user_metadata?.full_name || 'Utilisateur'}
            </h2>
            <p className="text-gray-500 text-sm">
              {user.email_confirmed_at ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={14} /> Email confirmé
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-600">
                  <AlertCircle size={14} /> Email non confirmé
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
            <Mail size={20} className="text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
            <Calendar size={20} className="text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Membre depuis</p>
              <p className="font-medium text-gray-900">{createdDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
            <User size={20} className="text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">ID utilisateur</p>
              <p className="font-medium text-gray-900 text-sm font-mono">{user.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass rounded-2xl p-6 animate-fade-in">
        <h3 className="font-semibold text-gray-900 mb-4">Déconnexion</h3>
        <p className="text-sm text-gray-500 mb-4">
          Vous &ecirc;tes actuellement connect&eacute;(e) avec <strong>{user.email}</strong>.
        </p>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="btn-secondary px-6 py-3 rounded-xl font-medium flex items-center gap-2"
        >
          {loading ? (
            <><div className="spinner !border-indigo-300 !border-t-indigo-600" />
            Déconnexion...</>
          ) : (
            <><LogOut size={18} /> Se déconnecter</>
          )}
        </button>
      </div>
    </div>
  );
}
