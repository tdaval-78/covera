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
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(91,76,245,0.2)', borderTopColor: '#5B4CF5', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    <div style={{ width: '100%', minHeight: '100vh', padding: '24px 20px 120px', boxSizing: 'border-box', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 24px' }}>Mon compte</h1>

        {/* Profile card */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(91,76,245,0.3)', flexShrink: 0 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>{initials}</span>
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>{user.user_metadata?.full_name || 'Utilisateur'}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                {user.email_confirmed_at ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--emerald)' }}>
                    <CheckCircle size={14} /> Email confirmé
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--amber)' }}>
                    <AlertCircle size={14} /> Email non confirmé
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--bg-subtle)', borderRadius: 14 }}>
              <Mail size={18} style={{ color: 'var(--brand)', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', margin: '0 0 2px' }}>Email</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{user.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--bg-subtle)', borderRadius: 14 }}>
              <Calendar size={18} style={{ color: 'var(--brand)', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', margin: '0 0 2px' }}>Membre depuis</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{createdDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
            padding: '15px 24px', borderRadius: 14, background: 'var(--bg-subtle)',
            color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, border: '1px solid var(--border)',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <><span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--text-primary)', animation: 'spin 0.7s linear infinite' }} />Déconnexion...</>
          ) : (
            <><LogOut size={18} />Se déconnecter</>
          )}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
