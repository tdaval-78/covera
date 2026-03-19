'use client';

import { Car, Smartphone, Home, Heart, Users, PawPrint, Package, Plus, ChevronRight, TrendingUp, Shield } from 'lucide-react';
import type { ReactNode } from 'react';
import type { InsuranceContract, CoverageItem } from '@/types';

const categoryConfig: Record<string, {
  label: string;
  icon: ReactNode;
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

const statusConfig = {
  covered:  { label: 'Couvert', dot: 'var(--emerald)', bg: 'var(--emerald-light)', text: 'var(--emerald-text)' },
  partial: { label: 'Partiel', dot: 'var(--amber)', bg: 'var(--amber-light)', text: 'var(--amber-text)' },
  excluded: { label: 'Exclu', dot: 'var(--rose)', bg: 'var(--rose-light)', text: 'var(--rose-text)' },
  unknown: { label: 'Inconnu', dot: 'var(--text-tertiary)', bg: 'var(--bg-subtle)', text: 'var(--text-secondary)' },
};

function CoverageCard({ item, onClick }: { item: CoverageItem; onClick?: () => void }) {
  const cat = categoryConfig[item.category] || categoryConfig.other;
  const status = statusConfig[item.coverageStatus] || statusConfig.unknown;

  return (
    <button
      onClick={onClick}
      className="card card-interactive p-4 w-full text-left flex items-center gap-3"
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
          <span className="status-dot" style={{ background: status.dot }} />
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{item.insurer}</p>
      </div>
      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
    </button>
  );
}

export default function SituationTab({
  contracts,
  onSelectContract,
  onAddContract,
}: {
  contracts: InsuranceContract[];
  onSelectContract: (c: InsuranceContract) => void;
  onAddContract?: () => void;
}) {
  const allItems = contracts.flatMap(c => c.coverageItems);
  const covered = allItems.filter(i => i.coverageStatus === 'covered').length;
  const partial = allItems.filter(i => i.coverageStatus === 'partial').length;
  const total = allItems.length;

  const handleItemClick = (item: CoverageItem) => {
    const contract = contracts.find(c => c.coverageItems.some(ci => ci.id === item.id));
    if (contract) onSelectContract(contract);
  };

  if (contracts.length === 0) {
    return (
      <div className="p-5 md:p-8">
        {/* Hero onboarding */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Bonjour 👋</h1>
          <p className="text-sm mt-1">Ajoutez vos contrats pour voir votre situation.</p>
        </div>

        <div className="hero-card mb-6">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="opacity-80" />
              <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Covera</span>
            </div>
            <h2 className="text-xl font-bold mb-1">Clarifiez vos assurances</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Importez vos contrats, comprenez ce qui est couvert, et posez vos questions à l&apos;IA.
            </p>
            {onAddContract && (
              <button
                onClick={onAddContract}
                className="mt-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <Plus size={16} />
                Ajouter mon premier contrat
              </button>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📄', label: 'Upload', desc: 'PDF, photo, texte' },
            { icon: '🧠', label: 'IA', desc: 'Analyse automatique' },
            { icon: '💬', label: 'Chat', desc: 'Questions réponses' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="card p-4 text-center">
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Ma situation
        </h1>
        <p className="text-sm mt-0.5">
          {total} élément{total > 1 ? 's' : ''} · {contracts.length} contrat{contracts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Hero stats */}
      <div className="hero-card mb-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="opacity-70" />
            <span className="text-xs font-semibold opacity-70 uppercase tracking-wider">Vue d&apos;ensemble</span>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <div>
              <p className="text-4xl font-extrabold tracking-tight">{total}</p>
              <p className="text-xs opacity-70 mt-0.5">contrats couverts</p>
            </div>
            <div className="flex-1" />
            <div className="text-right">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="status-dot status-covered" />
                <span className="text-xl font-bold">{covered}</span>
              </div>
              <p className="text-xs opacity-70">entièrement</p>
            </div>
            {partial > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="status-dot status-partial" />
                  <span className="text-xl font-bold">{partial}</span>
                </div>
                <p className="text-xs opacity-70">partiel</p>
              </div>
            )}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: total > 0 ? `${(covered / total) * 100}%` : '0%' }}
            />
          </div>
          <p className="text-xs opacity-60 mt-1.5">
            {total > 0 ? `${Math.round((covered / total) * 100)}% de vos contrats sont couverts` : 'Aucun contrat'}
          </p>
        </div>
      </div>

      {/* Recent items */}
      {allItems.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider">Mes assurances</h2>
          </div>
          <div className="space-y-2 stagger">
            {allItems.slice(0, 5).map(item => (
              <CoverageCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
            ))}
          </div>
        </div>
      )}

      {/* By category */}
      {Object.entries(
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
              <span className="badge badge-gray ml-auto">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map(item => (
                <CoverageCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Bottom padding for FAB */}
      <div className="h-20" />
    </div>
  );
}
