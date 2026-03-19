'use client';

import { Home, Search, MessageCircle, Plus } from 'lucide-react';

type Tab = 'situation' | 'details' | 'chat' | 'add';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'situation', label: 'Situation', icon: <Home size={20} /> },
  { id: 'details', label: 'Détail', icon: <Search size={20} /> },
  { id: 'chat', label: 'Chat', icon: <MessageCircle size={20} /> },
  { id: 'add', label: 'Ajouter', icon: <Plus size={20} /> },
];

export default function Sidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Covera
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Tes assurances, clarifiées.
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-400 text-center">
          Powered by AI · Covera v0.1
        </div>
      </div>
    </aside>
  );
}
