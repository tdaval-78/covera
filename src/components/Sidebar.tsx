'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageCircle, Plus, User, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: string;
  onToggleTheme: () => void;
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'situation', label: 'Situation', icon: Home },
    { id: 'details',   label: 'Mes contrats', icon: Search },
    { id: 'chat',      label: 'Chat', icon: MessageCircle },
    { id: 'add',       label: 'Ajouter', icon: Plus },
  ];

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur';

  return (
    <aside className="sidebar" style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 2px 8px rgba(91,76,245,0.3)' }}
          >
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
              <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Covera</span>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Tes assurances clarifiées</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1">
        <div className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id && pathname === '/';
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="sidebar-nav-item w-full"
                style={
                  isActive
                    ? { background: 'var(--brand-light)', color: '#5B4CF5', fontWeight: 600 }
                    : { color: 'var(--text-secondary)' }
                }
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 pt-2">
        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="sidebar-nav-item w-full mb-1"
          style={{ color: 'var(--text-secondary)' }}
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
          {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </button>

        {/* Account */}
        <Link
          href="/account"
          className="sidebar-nav-item w-full"
          style={pathname === '/account' ? { background: 'var(--brand-light)', color: '#5B4CF5', fontWeight: 600 } : { color: 'var(--text-secondary)' }}
        >
          <User size={18} strokeWidth={pathname === '/account' ? 2.5 : 2} />
          Mon compte
        </Link>

        {/* User info */}
        {user && (
          <div className="mt-2 px-3 py-2.5 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)' }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }} title={user.email || ''}>{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 mt-2 w-full px-2 py-1.5 rounded-lg transition-colors text-xs"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
