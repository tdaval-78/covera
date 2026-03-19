'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageCircle, Plus, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type Tab = 'situation' | 'details' | 'chat' | 'add' | 'account';

const tabs: { id: Tab; label: string; icon: React.ReactNode; href: string }[] = [
  { id: 'situation', label: 'Situation', icon: <Home size={20} />, href: '/' },
  { id: 'details',   label: 'Détail',    icon: <Search size={20} />,   href: '/' },
  { id: 'chat',      label: 'Chat',       icon: <MessageCircle size={20} />, href: '/' },
  { id: 'add',       label: 'Ajouter',     icon: <Plus size={20} />,   href: '/' },
  { id: 'account',   label: 'Mon compte', icon: <User size={20} />,   href: '/account' },
];

export default function Sidebar({ activeTab, onTabChange }: {
  activeTab: string;
  onTabChange: (tab: Tab) => void;
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
  };

  const userInitial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || '?';

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur';

  return (
    <aside className="sidebar flex flex-col h-full w-64">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <h1 className="text-2xl font-bold gradient-text tracking-tight">Covera</h1>
        <p className="text-xs text-gray-500 mt-0.5">Tes assurances, clarifiées.</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map(tab => (
          tab.href === '/account' ? (
            <Link
              key={tab.id}
              href="/account"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                pathname === '/account'
                  ? 'bg-white/30 text-indigo-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-white/20 hover:text-gray-900'
              }`}
            >
              <span className={pathname === '/account' ? 'text-indigo-600' : 'text-gray-400'}>
                {tab.icon}
              </span>
              {tab.label}
            </Link>
          ) : (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === tab.id && pathname === '/'
                  ? 'bg-white/30 text-indigo-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-white/20 hover:text-gray-900'
              }`}
            >
              <span className={activeTab === tab.id && pathname === '/' ? 'text-indigo-600' : 'text-gray-400'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          )
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-white/20">
        {user ? (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        ) : null}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-white/20 hover:text-gray-700 transition-all"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
        <div className="text-xs text-gray-400 text-center mt-3">
          Powered by AI · Covera v0.1
        </div>
      </div>
    </aside>
  );
}
