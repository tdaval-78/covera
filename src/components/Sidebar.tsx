'use client';

import Link from 'next/link';
import { Home, FileText, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { InsuranceContract } from '@/types';

const TABS = [
  { id: 'situation', label: 'Accueil', icon: Home },
  { id: 'details', label: 'Contrats', icon: FileText },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
];

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: string;
  onToggleTheme: () => void;
}

export default function Sidebar({ activeTab, onTabChange, theme, onToggleTheme }: Props) {
  const { user, signOut } = useAuth();

  const initials = user?.email?.slice(0, 2).toUpperCase() || '??';
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur';

  return (
    <aside style={{ width: 240, flexShrink: 0, height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px 16px', background: 'var(--bg-card)', borderRight: '1px solid var(--border)', position: 'sticky', top: 0 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(91,76,245,0.3)', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
            <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Covera</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12,
                background: isActive ? 'var(--brand-light)' : 'transparent',
                color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(91,76,245,0.15)' : '1px solid transparent',
                cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s',
                fontWeight: isActive ? 600 : 500, fontSize: 14,
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </button>
          );
        })}

        <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          <span>Compte</span>
        </Link>
      </nav>

      {/* User */}
      {user && (
        <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-subtle)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', borderRadius: 10,
              background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 500, transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      )}
    </aside>
  );
}
