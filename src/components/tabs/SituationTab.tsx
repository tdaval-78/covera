'use client';

import { useState } from 'react';
import { Car, Smartphone, Home, Heart, Users, PawPrint, Package, Plus, ChevronRight, TrendingUp, Shield, Trash2, Search, X } from 'lucide-react';
import type { InsuranceContract, CoverageItem } from '@/types';

const categoryConfig: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}> = {
  vehicle: { label: 'Véhicules', icon: <Car size={20} />, color: '#3B82F6', bg: '#EFF6FF' },
  phone:   { label: 'Téléphones', icon: <Smartphone size={20} />, color: '#8B5CF6', bg: '#F5F3FF' },
  home:    { label: 'Habitat', icon: <Home size={20} />, color: '#10B981', bg: '#ECFDF5' },
  health:  { label: 'Santé', icon: <Heart size={20} />, color: '#EF4444', bg: '#FEF2F2' },
  person:  { label: 'Personnes', icon: <Users size={20} />, color: '#F59E0B', bg: '#FFFBEB' },
  animal:  { label: 'Animaux', icon: <PawPrint size={20} />, color: '#F97316', bg: '#FFF7ED' },
  other:   { label: 'Autres', icon: <Package size={20} />, color: '#6B7280', bg: '#F9FAFB' },
};

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    covered: '#10B981',
    partial: '#F59E0B',
    excluded: '#EF4444',
    unknown: 'var(--text-tertiary)',
  };
  return <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[status] || colors.unknown }} />;
}

function CoverageCard({
  item,
  contracts,
  onClick,
  onDelete,
}: {
  item: CoverageItem;
  contracts: InsuranceContract[];
  onClick?: () => void;
  onDelete?: (id: string) => void;
}) {
  const cat = categoryConfig[item.category] || categoryConfig.other;
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="card p-4 flex items-center gap-3 relative transition-all"
      style={{ cursor: 'pointer' }}
      onMouseEnter={e => { setShowDelete(true); (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={e => { setShowDelete(false); (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}
      onClick={onClick}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: cat.bg, color: cat.color }}
      >
        {cat.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
          <StatusDot status={item.coverageStatus} />
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{item.insurer}</p>
      </div>
      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
      {showDelete && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="absolute top-2 right-2 p-1.5 rounded-lg transition-all"
          style={{ background: 'var(--rose-light)', color: 'var(--rose)' }}
          title="Supprimer le contrat"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

export default function SituationTab({
  contracts,
  onSelectContract,
  onAddContract,
  onDeleteContract,
}: {
  contracts: InsuranceContract[];
  onSelectContract: (c: InsuranceContract) => void;
  onAddContract?: () => void;
  onDeleteContract?: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const allItems = contracts.flatMap(c => c.coverageItems);
  const covered = allItems.filter(i => i.coverageStatus === 'covered').length;
  const partial = allItems.filter(i => i.coverageStatus === 'partial').length;
  const total = allItems.length;

  const filteredItems = query.trim()
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.insurer.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const handleItemClick = (item: CoverageItem) => {
    const contract = contracts.find(c => c.coverageItems.some(ci => ci.id === item.id));
    if (contract) onSelectContract(contract);
  };

  const handleDelete = (itemId: string) => {
    const contract = contracts.find(c => c.coverageItems.some(ci => ci.id === itemId));
    if (contract && onDeleteContract) {
      onDeleteContract(contract.id);
    }
  };

  if (contracts.length === 0) {
    return (
      <div className="p-5 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Bonjour 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Prêt à clarifier vos assurances ?
          </p>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'linear-gradient(135deg, #5B4CF5 0%, #7C5CF5 100%)', boxShadow: '0 8px 32px rgba(91,76,245,0.25)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="opacity-80" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Covera</span>
          </div>
          <h2 className="text-xl font-bold mb-1">Clarifiez vos assurances</h2>
          <p className="text-sm opacity-80 leading-relaxed mb-5">
            Importez vos contrats, comprenez ce qui est couvert, et posez vos questions à l&apos;IA.
          </p>
          {onAddContract && (
            <button
              onClick={onAddContract}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white' }}
            >
              <Plus size={16} />
              Ajouter mon premier contrat
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📄', label: 'Upload', desc: 'PDF, photo' },
            { icon: '🧠', label: 'IA', desc: 'Analyse auto' },
            { icon: '💬', label: 'Chat', desc: 'Questions' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="card p-4 text-center">
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Ma situation
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {total} élément{total > 1 ? 's' : ''} · {contracts.length} contrat{contracts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un contrat..."
          className="input pl-10 pr-10"
          style={{ background: 'var(--bg-card)' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Hero stats */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, #5B4CF5 0%, #7C5CF5 100%)', boxShadow: '0 8px 32px rgba(91,76,245,0.25)', color: 'white' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="opacity-70" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Vue d&apos;ensemble</span>
        </div>
        <div className="flex items-end gap-4 mb-4">
          <div>
            <p className="text-4xl font-extrabold tracking-tight">{total}</p>
            <p className="text-xs opacity-70 mt-0.5">contrats</p>
          </div>
          <div style={{ flex: 1 }} />
          <div className="text-right">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
              <span className="text-xl font-bold">{covered}</span>
            </div>
            <p className="text-xs opacity-70">entièrement</p>
          </div>
          {partial > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} />
                <span className="text-xl font-bold">{partial}</span>
              </div>
              <p className="text-xs opacity-70">partiel</p>
            </div>
          )}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: total > 0 ? `${(covered / total) * 100}%` : '0%', background: 'white' }}
          />
        </div>
        <p className="text-xs opacity-60 mt-2">
          {total > 0 ? `${Math.round((covered / total) * 100)}% couverts` : 'Aucun contrat'}
        </p>
      </div>

      {/* Search results or all items */}
      {query && (
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
            Résultats ({filteredItems.length})
          </p>
          {filteredItems.length > 0 ? (
            <div className="space-y-2">
              {filteredItems.map(item => (
                <CoverageCard
                  key={item.id}
                  item={item}
                  contracts={contracts}
                  onClick={() => handleItemClick(item)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Aucun résultat pour &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}

      {/* Grouped by category (when not searching) */}
      {!query && Object.entries(
        allItems.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {} as Record<string, CoverageItem[]>)
      ).map(([category, items]) => {
        const cat = categoryConfig[category] || categoryConfig.other;
        return (
          <div key={category} className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: cat.color }}>{cat.icon}</span>
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{cat.label}</h2>
              <span
                className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
              >
                {items.length}
              </span>
            </div>
            <div className="space-y-2">
              {items.map(item => (
                <CoverageCard
                  key={item.id}
                  item={item}
                  contracts={contracts}
                  onClick={() => handleItemClick(item)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        );
      })}

      <div className="h-20" />
    </div>
  );
}
