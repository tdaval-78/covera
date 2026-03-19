'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageCircle, Plus, User, Moon, Sun } from 'lucide-react';

const tabs = [
  { id: 'situation', label: 'Accueil', icon: Home },
  { id: 'details',   label: 'Contrats', icon: Search },
  { id: 'chat',      label: 'Chat', icon: MessageCircle },
  { id: 'account',   label: 'Compte', icon: User, href: '/account' },
];

export default function MobileNav({
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

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', boxShadow: '0 -4px 24px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center justify-around py-2 px-1 pb-safe">
        {tabs.map(({ id, label, icon: Icon, href }) => {
          const isActive = href === '/account'
            ? pathname === '/account'
            : activeTab === id && pathname === '/';

          return href === '/account' ? (
            <Link key={id} href="/account" className={`nav-tab ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span>{label}</span>
            </Link>
          ) : (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`nav-tab ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">
                {id === 'add' ? (
                  <div
                    className="nav-fab"
                    style={{ background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', boxShadow: '0 4px 16px rgba(91,76,245,0.4)' }}
                  >
                    <Plus size={22} strokeWidth={2.5} />
                  </div>
                ) : (
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                )}
              </span>
              {id !== 'add' && <span>{label}</span>}
            </button>
          );
        })}
      </div>
      {/* Theme toggle as extra button */}
      <div className="absolute top-2 right-2 lg:hidden">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl transition-colors"
          style={{ color: 'var(--text-tertiary)', background: 'transparent' }}
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <div style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}
