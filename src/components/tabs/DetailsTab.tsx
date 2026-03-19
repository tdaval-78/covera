'use client';

import { useState } from 'react';
import { FileText, AlertCircle, CheckCircle, Shield, Calendar, CreditCard, ChevronRight, X, Info } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  if (contracts.length === 0) {
    return (
      <div className="p-5 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Mes contrats</h1>
        <p className="text-sm mb-8 mt-1">Explorez vos contrats en détail</p>
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--brand-light)' }}>
            <FileText size={28} style={{ color: 'var(--brand)' }} />
          </div>
          <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Aucun contrat</h3>
          <p className="text-sm">Importez un premier contrat pour commencer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Mobile contract picker */}
      <div className="lg:hidden p-5 pb-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Contrats</h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="card card-interactive w-full p-4 mt-3 flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{active?.name}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{active?.analysis?.insurer || 'Analyse...'}</p>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-72 flex-col border-r" style={{ borderColor: 'var(--border)' }}>
        <div className="p-5 pb-3">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Contrats</h1>
        </div>
        <div className="px-3 space-y-1.5 flex-1 overflow-auto">
          {contracts.map(contract => (
            <button
              key={contract.id}
              onClick={() => onSelectContract(contract)}
              className="card card-interactive w-full p-3.5 text-left"
              style={active?.id === contract.id ? { borderColor: 'var(--brand)', background: 'var(--brand-light)' } : {}}
            >
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{contract.name}</p>
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                {contract.analysis?.insurer || 'Analyse en cours...'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5 md:p-6 pb-24 lg:pb-6">
        {active?.analysis ? (
          <div className="max-w-xl space-y-4 stagger">
            {/* Header card */}
            <div className="card p-5 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-light)' }}>
                  <FileText size={22} style={{ color: 'var(--brand)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{active.analysis.productName}</h2>
                  <p className="text-sm mt-0.5">{active.analysis.insurer}</p>
                  {active.analysis.policyNumber && (
                    <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-tertiary)' }}>N° {active.analysis.policyNumber}</p>
                  )}
                </div>
              </div>
              {active.analysis.conditions && (
                <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {active.analysis.conditions}
                </p>
              )}
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3 animate-fade-in">
              {[
                { icon: <CreditCard size={16} />, label: 'Prime mensuelle', value: `${active.analysis.premium} €`, sub: '/mois' },
                { icon: <AlertCircle size={16} />, label: 'Franchise', value: `${active.analysis.franchise} €`, sub: '' },
                { icon: <Calendar size={16} />, label: 'Début', value: active.analysis.startDate || '—', sub: '' },
                { icon: <Calendar size={16} />, label: 'Fin', value: active.analysis.endDate || '—', sub: '' },
              ].map(({ icon, label, value, sub }) => (
                <div key={label} className="card p-4">
                  <div className="flex items-center gap-1.5 mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    {icon}
                    <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {value}
                    {sub && <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}> {sub}</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* Covered risks */}
            <div className="card p-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={18} style={{ color: 'var(--emerald)' }} />
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Risques couverts</h3>
                <span className="badge badge-emerald ml-auto">{active.analysis.coveredRisks.length}</span>
              </div>
              {active.analysis.coveredRisks.length > 0 ? (
                <div className="space-y-2">
                  {active.analysis.coveredRisks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}>
                        <CheckCircle size={11} />
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{risk}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Aucun risque listé.</p>
              )}
            </div>

            {/* Exclusions */}
            {active.analysis.excludedRisks.length > 0 && (
              <div className="card p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={18} style={{ color: 'var(--rose)' }} />
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Exclusions</h3>
                  <span className="badge badge-rose ml-auto">{active.analysis.excludedRisks.length}</span>
                </div>
                <div className="space-y-2">
                  {active.analysis.excludedRisks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--rose-light)', color: 'var(--rose)' }}>
                        <X size={11} />
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plafonds */}
            {active.analysis.plafonds.length > 0 && (
              <div className="card p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={18} style={{ color: 'var(--brand)' }} />
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Plafonds</h3>
                </div>
                <div className="space-y-2">
                  {active.analysis.plafonds.map((p, i) => (
                    <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {p.amount.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner-dark" />
            <p className="text-sm mt-4">Analyse en cours...</p>
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[60vh] overflow-auto animate-slide-up">
            <div className="sticky top-0 flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Choisir un contrat</h2>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-2">
              {contracts.map(contract => (
                <button
                  key={contract.id}
                  onClick={() => { onSelectContract(contract); setMobileOpen(false); }}
                  className="card card-interactive w-full p-4 text-left"
                  style={active?.id === contract.id ? { borderColor: 'var(--brand)', background: 'var(--brand-light)' } : {}}
                >
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{contract.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{contract.analysis?.insurer}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
