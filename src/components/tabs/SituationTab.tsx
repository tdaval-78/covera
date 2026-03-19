'use client';

import { Car, Smartphone, Home, Heart, Users, PawPrint, Package, Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { InsuranceContract, CoverageItem } from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  vehicle: <Car size={28} />,
  phone: <Smartphone size={28} />,
  home: <Home size={28} />,
  health: <Heart size={28} />,
  person: <Users size={28} />,
  animal: <PawPrint size={28} />,
  other: <Package size={28} />,
};

const categoryLabels: Record<string, string> = {
  vehicle: 'Véhicules',
  phone: 'Téléphones',
  home: 'Habitat',
  health: 'Santé',
  person: 'Personnes',
  animal: 'Animaux',
  other: 'Autres',
};

function CoverageCard({
  item,
  onClick,
  compact = false,
}: {
  item: CoverageItem;
  onClick?: () => void;
  compact?: boolean;
}) {
  const statusConfig = {
    covered: { label: '✓ Couvert', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    partial: { label: '◐ Partiel', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    excluded: { label: '✕ Exclu', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    unknown: { label: '? Inconnu', bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400' },
  };
  const status = statusConfig[item.coverageStatus] || statusConfig.unknown;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="glass glass-hover rounded-2xl p-4 flex items-center gap-3 w-full text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
          {categoryIcons[item.category] || categoryIcons.other}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
          <p className="text-xs text-gray-500">{item.insurer}</p>
        </div>
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} title={status.label} />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="glass glass-hover rounded-2xl p-5 w-full text-left"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
          {categoryIcons[item.category] || categoryIcons.other}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.insurer}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-white/60 rounded-xl p-2.5 text-center">
          <p className="text-xs text-gray-500">Franchise</p>
          <p className="font-semibold text-gray-900 text-sm">{item.franchise} €</p>
        </div>
        <div className="flex-1 bg-white/60 rounded-xl p-2.5 text-center">
          <p className="text-xs text-gray-500">Risques</p>
          <p className="font-semibold text-gray-900 text-sm">{item.coveredRisks.length}</p>
        </div>
        {item.premium > 0 && (
          <div className="flex-1 bg-white/60 rounded-xl p-2.5 text-center">
            <p className="text-xs text-gray-500">Prime</p>
            <p className="font-semibold text-gray-900 text-sm">{item.premium} €</p>
          </div>
        )}
      </div>
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
  const grouped = allItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CoverageItem[]>);

  if (contracts.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ma situation</h1>
          <p className="text-gray-500 mt-0.5 text-sm md:text-base">Vue d&apos;ensemble de mes assurances</p>
        </div>
        <EmptyState
          icon={Package}
          title="Aucun contrat importé"
          description="Importez votre premier contrat d'assurance pour voir ici une vue d'ensemble de vos couvertures."
          action={onAddContract ? { label: 'Ajouter un contrat', onClick: onAddContract } : undefined}
        />
      </div>
    );
  }

  const covered = allItems.filter(i => i.coverageStatus === 'covered').length;
  const partial = allItems.filter(i => i.coverageStatus === 'partial').length;
  const excluded = allItems.filter(i => i.coverageStatus === 'excluded').length;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ma situation</h1>
        <p className="text-gray-500 mt-0.5 text-sm md:text-base">
          {allItems.length} élément{allItems.length > 1 ? 's' : ''} · {contracts.length} contrat{contracts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats cards — horizontal scroll on mobile */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:overflow-visible md:pb-0 md:grid md:grid-cols-3 md:mx-0 md:px-0 md:gap-4">
        <div className="glass rounded-2xl p-4 flex-shrink-0 w-36 md:w-auto">
          <p className="text-2xl font-bold text-emerald-600">{covered}</p>
          <p className="text-xs text-emerald-600 font-medium">Couverts</p>
        </div>
        <div className="glass rounded-2xl p-4 flex-shrink-0 w-36 md:w-auto">
          <p className="text-2xl font-bold text-amber-600">{partial}</p>
          <p className="text-xs text-amber-600 font-medium">Partiel</p>
        </div>
        <div className="glass rounded-2xl p-4 flex-shrink-0 w-36 md:w-auto">
          <p className="text-2xl font-bold text-red-500">{excluded}</p>
          <p className="text-xs text-red-500 font-medium">Exclus</p>
        </div>
      </div>

      {/* Quick list — horizontal scroll */}
      <div className="mt-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-4 md:px-0">
          Tous ({allItems.length})
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {allItems.map(item => (
            <div key={item.id} className="flex-shrink-0 w-52">
              <CoverageCard
                item={item}
                compact
                onClick={() => {
                  const contract = contracts.find(c => c.coverageItems.some(ci => ci.id === item.id));
                  if (contract) onSelectContract(contract);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Grouped by category */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="text-gray-400">{categoryIcons[category]}</span>
            {categoryLabels[category] || category}
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {items.map(item => (
              <CoverageCard
                key={item.id}
                item={item}
                onClick={() => {
                  const contract = contracts.find(c => c.coverageItems.some(ci => ci.id === item.id));
                  if (contract) onSelectContract(contract);
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
