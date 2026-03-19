'use client';

import { FileText, AlertCircle, CheckCircle, Shield, Calendar, CreditCard } from 'lucide-react';
import type { InsuranceContract, CoverageItem } from '@/types';

export default function DetailsTab({
  contracts,
  selectedContract,
  onSelectContract,
}: {
  contracts: InsuranceContract[];
  selectedContract: InsuranceContract | null;
  onSelectContract: (c: InsuranceContract) => void;
}) {
  if (contracts.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vue détaillée</h1>
        <p className="text-gray-500 mb-8">Explorez vos contrats en détail</p>
        <div className="flex flex-col items-center justify-center py-20">
          <FileText size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">Aucun contrat à afficher.</p>
          <p className="text-gray-400 text-sm mt-1">Importez un premier contrat pour commencer.</p>
        </div>
      </div>
    );
  }

  const active = selectedContract || contracts[0];

  return (
    <div className="p-8 flex gap-8 h-full">
      {/* Left: contract list */}
      <div className="w-72 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Vue détaillée</h1>
        <div className="space-y-2">
          {contracts.map(contract => (
            <button
              key={contract.id}
              onClick={() => onSelectContract(contract)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                active.id === contract.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-white border border-gray-100 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-900 truncate">{contract.name}</p>
              <p className="text-sm text-gray-500 truncate">
                {active.analysis?.insurer || 'Analyse en cours...'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Right: contract details */}
      {active.analysis ? (
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{active.analysis.productName}</h2>
            <p className="text-gray-500 mt-1">{active.analysis.insurer} · {active.analysis.policyNumber}</p>
            <p className="mt-3 text-gray-700">{active.analysis.conditions}</p>
          </div>

          {/* Key numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <CreditCard size={16} /> Prime
              </div>
              <p className="text-xl font-bold text-gray-900">
                {active.analysis.premium} €<span className="text-sm font-normal text-gray-500">/mois</span>
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <AlertCircle size={16} /> Franchise
              </div>
              <p className="text-xl font-bold text-gray-900">
                {active.analysis.franchise} €
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar size={16} /> Début
              </div>
              <p className="text-xl font-bold text-gray-900">
                {active.analysis.startDate || '—'}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar size={16} /> Fin
              </div>
              <p className="text-xl font-bold text-gray-900">
                {active.analysis.endDate || '—'}
              </p>
            </div>
          </div>

          {/* Covered risks */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              Risques couverts ({active.analysis.coveredRisks.length})
            </h3>
            {active.analysis.coveredRisks.length > 0 ? (
              <ul className="space-y-2">
                {active.analysis.coveredRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {risk}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">Aucun risque listé dans le contrat</p>
            )}
          </div>

          {/* Exclusions */}
          {active.analysis.excludedRisks.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield size={18} className="text-red-500" />
                Exclusions ({active.analysis.excludedRisks.length})
              </h3>
              <ul className="space-y-2">
                {active.analysis.excludedRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-500 mt-0.5">✕</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Plafonds */}
          {active.analysis.plafonds.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Plafonds de garantie
              </h3>
              <div className="space-y-3">
                {active.analysis.plafonds.map((plafond, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-700">{plafond.label}</span>
                    <span className="font-semibold text-gray-900">
                      {plafond.amount.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-pulse">
            <div className="w-48 h-6 bg-gray-200 rounded mb-4 mx-auto" />
            <div className="w-32 h-4 bg-gray-200 rounded mx-auto" />
          </div>
          <p className="text-gray-500 mt-4">Analyse en cours...</p>
        </div>
      )}
    </div>
  );
}
