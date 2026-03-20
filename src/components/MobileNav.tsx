'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, MessageCircle, User, Moon, Sun, Plus, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'situation', label: 'Accueil', icon: Home, href: '/' },
  { id: 'details', label: 'Contrats', icon: FileText, href: '/' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/' },
  { id: 'account', label: 'Compte', icon: User, href: '/account' },
];

export default function MobileNav({ activeTab, onTabChange, theme, onToggleTheme }: {
  activeTab: string; onTabChange: (tab: string) => void; theme: string; onToggleTheme: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 72,
      zIndex: 50, display: 'flex', flexDirection: 'column',
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border)',
      boxShadow: '2px 0 24px rgba(0,0,0,0.06)',
      paddingTop: 'env(safe-area-inset-top, 0px)',
    }} className="lg:hidden">
      {/* Logo */}
      <div style={{ padding: '20px 0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{ width: 40, height: 40, borderRadius: 14, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(91,76,245,0.3)', marginBottom: 6 }}>
          <Shield size={20} color="white" fill="white" style={{ opacity: 0.9 }} />
        </div>
        <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--brand)', letterSpacing: '0.04em' }}>COVERA</span>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 0' }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon, href }) => {
          const isActive = id !== 'account' && activeTab === id;
          const isAccount = id === 'account';
          const isCurrentPage = isAccount && pathname === href;

          if (id !== 'account') {
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                title={label}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 8px',
                  background: isActive ? 'rgba(91,76,245,0.1)' : 'transparent',
                  border: 'none', borderRadius: 16, cursor: 'pointer',
                  color: isActive ? 'var(--brand)' : 'var(--text-tertiary)',
                  transition: 'all 0.2s', width: 56,
                  boxShadow: isActive ? '0 2px 8px rgba(91,76,245,0.15)' : 'none',
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--brand)' : 'var(--text-tertiary)', lineHeight: 1.2, textAlign: 'center' }}>{label}</span>
              </button>
            );
          }

          return (
            <Link
              key={id}
              href={href}
              title={label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 8px',
                background: isCurrentPage ? 'rgba(91,76,245,0.1)' : 'transparent',
                border: 'none', borderRadius: 16, cursor: 'pointer', textDecoration: 'none',
                color: isCurrentPage ? 'var(--brand)' : 'var(--text-tertiary)',
                transition: 'all 0.2s', width: 56,
                boxShadow: isCurrentPage ? '0 2px 8px rgba(91,76,245,0.15)' : 'none',
              }}
            >
              <Icon size={22} strokeWidth={isCurrentPage ? 2.5 : 2} />
              <span style={{ fontSize: 9, fontWeight: isCurrentPage ? 700 : 500, color: isCurrentPage ? 'var(--brand)' : 'var(--text-tertiary)', lineHeight: 1.2, textAlign: 'center' }}>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Add button + theme toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '8px 0 20px' }}>
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          style={{ padding: 10, borderRadius: 14, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', transition: 'all 0.2s' }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Link
          href="/"
          onClick={(e) => { if (onTabChange) onTabChange('add-contract'); }}
          style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(91,76,245,0.35)', textDecoration: 'none', color: 'white' }}
        >
          <Plus size={20} strokeWidth={2.5} />
        </Link>
      </div>
    </nav>
  );
}
