'use client';

import { Car, Smartphone, Home, Heart, Users, PawPrint, Package } from 'lucide-react';
import type { InsuranceContract, CoverageItem } from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  vehicle: <Car size={32} />,
  phone: <Smartphone size={32} />,
  home: <Home size={32} />,
  health: <Heart size={32} />,
  person: <Users size={32} />,
  animal: <PawPrint size={32} />,
  other: <Package size={32} />,
};

const categoryLabels: Record<string, string> = {
  vehicle: 'Véhicule',
  phone: 'Téléphone',
  home: 'Habitat',
  health: 'Santé',
  person: 'Personne',
  animal: 'Animal',
  other: 'Autre',
};

function CoverageCard({ item }: { item: CoverageItem }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start gap-4">
        {/* Isometric-style icon container */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          {categoryIcons[item.category] || categoryIcons.other}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.insurer}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              item.coverageStatus === 'covered'
                ? 'bg-green-50 text-green-700'
                : item.coverageStatus === 'partial'
                ? 'bg-yellow-50 text-yellow-700'
                : item.coverageStatus === 'excluded'
                ? 'bg-red-50 text-red-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {item.coverageStatus === 'covered' ? '✓ Couvert'
                : item.coverageStatus === 'partial' ? '◐ Partiel'
                : item.coverageStatus === 'excluded' ? '✕ Exclu'
                : '? Inconnu'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick info */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Franchise</p>
          <p className="font-semibold text-gray-900">{item.franchise} €</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Risques couverts</p>
          <p className="font-semibold text-gray-900">{item.coveredRisks.length}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <Package size={40} className="text-blue-300" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Aucun contrat importé
      </h2>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        Ajoutez votre premier contrat d'assurance pour voir ici une vue d'ensemble de vos couvertures.
      </p>
    </div>
  );
}

export default function SituationTab({
  contracts,
  onSelectContract,
}: {
  contracts: InsuranceContract[];
  onSelectContract: (c: InsuranceContract) => void;
}) {
  const allItems = contracts.flatMap(c => c.coverageItems);
  const grouped = allItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CoverageItem[]>);

  if (contracts.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ma situation</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de mes assurances</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ma situation</h1>
        <p className="text-gray-500 mt-1">
          {allItems.length} élément{allItems.length > 1 ? 's' : ''} assuré{allItems.length > 1 ? 's' : ''} · {contracts.length} contrat{contracts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 rounded-2xl p-4">
          <p className="text-green-700 text-2xl font-bold">
            {allItems.filter(i => i.coverageStatus === 'covered').length}
          </p>
          <p className="text-green-600 text-sm">Entièrement couvert</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4">
          <p className="text-yellow-700 text-2xl font-bold">
            {allItems.filter(i => i.coverageStatus === 'partial').length}
          </p>
          <p className="text-yellow-600 text-sm">Partiellement couvert</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4">
          <p className="text-red-700 text-2xl font-bold">
            {allItems.filter(i => i.coverageStatus === 'excluded').length}
          </p>
          <p className="text-red-600 text-sm">Exclusions</p>
        </div>
      </div>

      {/* Grouped items */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-gray-400">{categoryIcons[category]}</span>
            {categoryLabels[category] || category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <CoverageCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
