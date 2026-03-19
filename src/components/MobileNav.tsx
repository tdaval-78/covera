'use client';

import { Home, Search, MessageCircle, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { id: 'situation', label: 'Accueil', icon: Home, href: '/' },
  { id: 'details',   label: 'Contrats', icon: Search, href: '/' },
  { id: 'chat',      label: 'Chat',     icon: MessageCircle, href: '/' },
  { id: 'add',       label: 'Ajouter',  icon: Plus, href: '/' },
  { id: 'account',   label: 'Compte',  icon: User, href: '/account' },
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
    <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden">
      <div className="glass border-t border-white/30 backdrop-blur-xl">
        <div className="flex items-center justify-around py-2 px-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = tab.href === '/account'
              ? pathname === '/account'
              : activeTab === tab.id && pathname === '/';

            return tab.href === '/account' ? (
              <Link
                key={tab.id}
                href="/account"
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] ${
                  pathname === '/account'
                    ? 'text-indigo-600'
                    : 'text-gray-400'
                }`}
              >
                <Icon size={22} strokeWidth={pathname === '/account' ? 2.5 : 2} />
                <span className={`text-[10px] font-medium ${pathname === '/account' ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </Link>
            ) : (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] ${
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                {tab.id === 'add' ? (
                  <div className="w-10 h-10 -mt-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white" style={{boxShadow:'0 4px 16px rgba(99,102,241,0.4)'}}>
                    <Plus size={22} strokeWidth={2.5} />
                  </div>
                ) : (
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                )}
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* Safe area for iPhone notch */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </nav>
  );
}
