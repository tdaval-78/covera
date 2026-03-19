'use client';

import Link from 'next/link';
import { Home, FileText, MessageCircle, Plus, Moon, Sun } from 'lucide-react';

const TABS = [
  { id: 'situation', label: 'Accueil', icon: Home },
  { id: 'details', label: 'Contrats', icon: FileText },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
];

export default function MobileNav({ activeTab, onTabChange, theme, onToggleTheme }: {
  activeTab: string; onTabChange: (tab: string) => void; theme: string; onToggleTheme: () => void;
}) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }} className="lg:hidden">
      {/* Theme toggle */}
      <div style={{ position: 'absolute', top: 8, right: 8 }}>
        <button
          onClick={onToggleTheme}
          style={{ padding: 8, borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 0' }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 16px',
                background: 'transparent', border: 'none', cursor: 'pointer', color: isActive ? 'var(--brand)' : 'var(--text-tertiary)',
                transition: 'color 0.15s',
              }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{label}</span>
            </button>
          );
        })}
        <Link href="/account" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 16px', color: 'var(--text-tertiary)', textDecoration: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          <span style={{ fontSize: 10, fontWeight: 500 }}>Compte</span>
        </Link>
      </div>
    </nav>
  );
}
