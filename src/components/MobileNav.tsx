'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageCircle, Plus, User } from 'lucide-react';

const tabs = [
  { id: 'situation', label: 'Accueil', icon: Home },
  { id: 'details',   label: 'Contrats', icon: Search },
  { id: 'chat',      label: 'Chat', icon: MessageCircle },
  { id: 'account',   label: 'Compte', icon: User, href: '/account' },
];

export default function MobileNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', boxShadow: '0 -4px 24px rgba(0,0,0,0.06)' }}>
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
                  <div className="nav-fab">
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
      {/* iOS safe area */}
      <div style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}
