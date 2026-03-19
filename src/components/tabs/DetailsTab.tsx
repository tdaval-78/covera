'use client';

import { useState } from 'react';
import { FileText, AlertCircle, CheckCircle, Shield, Calendar, CreditCard, ChevronRight, X } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { InsuranceContract } from '@/types';

export default function DetailsTab({
  contracts,
  selectedContract,
  onSelectContract,
}: {
  contracts: InsuranceContract[];
  selectedContract: InsuranceContract | null;
  onSelectContract: (c: InsuranceContract) => void;
}) {
  const active = selectedContract || contracts[0];
  const [mobileContractOpen, setMobileContractOpen] = useState(false);

  if (contracts.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Contrats</h1>
        <p className="text-gray-500 mb-6 text-sm md:text-base">Explorez vos contrats en détail</p>
        <EmptyState
          icon={FileText}
          title="Aucun contrat à afficher"
          description="Importez un premier contrat pour commencer à explorer vos garanties en détail."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Mobile: contract selector as a bottom sheet trigger */}
      <div className="lg:hidden p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Contrats</h1>
        <button
          onClick={() => setMobileContractOpen(true)}
          className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left mt-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <FileText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{active?.name}</p>
            <p className="text-sm text-gray-500">{active?.analysis?.insurer}</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
        </button>
      </div>

      {/* Desktop sidebar list */}
      <div className="hidden lg:block w-72 border-r border-white/20 p-4 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Contrats</h1>
        <div className="space-y-2">
          {contracts.map(contract => (
            <button
              key={contract.id}
              onClick={() => onSelectContract(contract)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                active?.id === contract.id
                  ? 'bg-white/50 border border-indigo-200'
                  : 'glass hover:bg-white/40'
              }`}
            >
              <p className="font-semibold text-gray-900 truncate text-sm">{contract.name}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {contract.analysis?.insurer || 'Analyse en cours...'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Contract detail */}
      <div className="flex-1 overflow-auto p-4 md:p-6 pb-24 lg:pb-6">
        {active?.analysis ? (
          <div className="space-y-4 stagger">
            {/* Header */}
            <div className="glass rounded-2xl p-5 animate-fade-in">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{active.analysis.productName}</h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {active.analysis.insurer} · {active.analysis.policyNumber}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 flex-shrink-0">
                  {active.category}
                </span>
              </div>
              {active.analysis.conditions && (
                <p className="text-gray-600 text-sm leading-relaxed">{active.analysis.conditions}</p>
              )}
            </div>

            {/* Key numbers — 2x2 grid */}
            <div className="grid grid-cols-2 gap-3 animate-fade-in">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <CreditCard size={14} />
                  <span className="text-xs font-medium">Prime</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {active.analysis.premium} €<span className="text-sm font-normal text-gray-500">/mois</span>
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <AlertCircle size={14} />
                  <span className="text-xs font-medium">Franchise</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{active.analysis.franchise} €</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">Début</span>
                </div>
                <p className="text-base font-semibold text-gray-900">{active.analysis.startDate || '—'}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">Fin</span>
                </div>
                <p className="text-base font-semibold text-gray-900">{active.analysis.endDate || '—'}</p>
              </div>
            </div>

            {/* Covered risks */}
            <div className="glass rounded-2xl p-5 animate-fade-in">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                Risques couverts
                <span className="ml-auto text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                  {active.analysis.coveredRisks.length}
                </span>
              </h3>
              {active.analysis.coveredRisks.length > 0 ? (
                <ul className="space-y-2">
                  {active.analysis.coveredRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">Aucun risque listé dans le contrat</p>
              )}
            </div>

            {/* Exclusions */}
            {active.analysis.excludedRisks.length > 0 && (
              <div className="glass rounded-2xl p-5 animate-fade-in">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield size={18} className="text-red-500" />
                  Exclusions
                  <span className="ml-auto text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    {active.analysis.excludedRisks.length}
                  </span>
                </h3>
                <ul className="space-y-2">
                  {active.analysis.excludedRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">✕</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Plafonds */}
            {active.analysis.plafonds.length > 0 && (
              <div className="glass rounded-2xl p-5 animate-fade-in">
                <h3 className="font-semibold text-gray-900 mb-3">Plafonds de garantie</h3>
                <div className="space-y-2">
                  {active.analysis.plafonds.map((plafond, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{plafond.label}</span>
                      <span className="font-semibold text-gray-900 text-sm">
                        {plafond.amount.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-pulse">
              <div className="w-48 h-5 bg-gray-200 rounded mb-3 mx-auto" />
              <div className="w-32 h-4 bg-gray-100 rounded mx-auto" />
            </div>
            <p className="text-gray-400 text-sm mt-4">Analyse en cours...</p>
          </div>
        )}
      </div>

      {/* Mobile contract selector modal */}
      {mobileContractOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileContractOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl max-h-[70vh] overflow-auto animate-fade-in-scale">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Choisir un contrat</h2>
              <button onClick={() => setMobileContractOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {contracts.map(contract => (
                <button
                  key={contract.id}
                  onClick={() => {
                    onSelectContract(contract);
                    setMobileContractOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl ${
                    active?.id === contract.id ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{contract.name}</p>
                  <p className="text-sm text-gray-500">{contract.analysis?.insurer}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
