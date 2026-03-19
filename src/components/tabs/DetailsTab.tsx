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
      <div style={{ width: '100%', minHeight: '100vh', padding: '24px 20px 120px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 4px' }}>Mes contrats</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px' }}>Explorez vos contrats en détail</p>
          <div style={{ padding: 32, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <FileText size={28} style={{ color: 'var(--brand)' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>Aucun contrat</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>Importez un premier contrat pour commencer.</p>
          </div>
        </div>
      </div>
    );
  }

  const analysis = active?.analysis;
  const coverageItems = active?.coverageItems || [];
  const categories = ['covered', 'partial', 'excluded', 'unknown'] as const;

  const statusConfig = {
    covered: { label: 'Couvert', color: '#10B981', bg: '#ECFDF5' },
    partial: { label: 'Partiel', color: '#F59E0B', bg: '#FFFBEB' },
    excluded: { label: 'Exclu', color: '#EF4444', bg: '#FEF2F2' },
    unknown: { label: 'Inconnu', color: '#94A3B8', bg: '#F9FAFB' },
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      {/* Mobile header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="lg:hidden">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Contrats</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{contracts.length} contrat{contracts.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Desktop header */}
      <div style={{ padding: '24px 24px 0', display: 'none' }} className="lg:block">
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Mes contrats</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{contracts.length} contrat{contracts.length > 1 ? 's' : ''}</p>
      </div>

      {/* Contract list */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 8 }} className="lg:hidden">
        {contracts.map(c => (
          <div
            key={c.id}
            onClick={() => onSelectContract(c)}
            style={{
              padding: 16, borderRadius: 16, background: c.id === active?.id ? 'var(--brand-light)' : 'var(--bg-card)',
              border: c.id === active?.id ? '1.5px solid var(--brand)' : '1px solid var(--border)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.id === active?.id ? 'var(--brand)' : 'var(--brand-light)', color: c.id === active?.id ? 'white' : 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{c.analysis?.insurer || 'Analyse en cours...'}</p>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* Desktop sidebar list */}
      <div style={{ padding: '20px 24px', display: 'none', flexDirection: 'column', gap: 8 }} className="lg:flex">
        {contracts.map(c => (
          <div
            key={c.id}
            onClick={() => onSelectContract(c)}
            style={{
              padding: 16, borderRadius: 16, background: c.id === active?.id ? 'var(--brand-light)' : 'var(--bg-card)',
              border: c.id === active?.id ? '1.5px solid var(--brand)' : '1px solid var(--border)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.id === active?.id ? 'var(--brand)' : 'var(--brand-light)', color: c.id === active?.id ? 'white' : 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{c.analysis?.insurer || 'Analyse en cours...'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contract detail */}
      {active && (
        <div style={{ padding: '0 20px 20px', flex: 1 }} className="lg:px-6">
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            {/* Contract header */}
            <div style={{ padding: 20, background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>{active.name}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{active.analysis?.insurer || 'Assureur inconnu'}</p>
                </div>
              </div>

              {/* Key info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {[
                  { icon: <Shield size={14} />, label: 'N° contrat', value: analysis?.policyNumber || '—' },
                  { icon: <Calendar size={14} />, label: 'Début', value: analysis?.startDate || '—' },
                  { icon: <CreditCard size={14} />, label: 'Prime', value: analysis?.premium ? `${analysis.premium} €/mois` : '—' },
                  { icon: <AlertCircle size={14} />, label: 'Franchise', value: analysis?.franchise ? `${analysis.franchise} €` : '—' },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <span style={{ color: 'var(--brand)' }}>{icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>{label}</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage items */}
            {coverageItems.length > 0 && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Éléments couverts</h3>
                </div>
                {coverageItems.map((item, i) => {
                  const sc = statusConfig[item.coverageStatus] || statusConfig.unknown;
                  return (
                    <div key={item.id} style={{ padding: '14px 20px', borderBottom: i < coverageItems.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.coverageStatus === 'covered' ? <CheckCircle size={18} style={{ color: sc.color }} /> : item.coverageStatus === 'excluded' ? <X size={18} style={{ color: sc.color }} /> : <Info size={18} style={{ color: sc.color }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{item.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{item.insurer}</p>
                      </div>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color, flexShrink: 0 }}>
                        {sc.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Risks */}
            {(analysis?.coveredRisks?.length > 0 || analysis?.excludedRisks?.length > 0) && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {analysis.coveredRisks?.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--emerald)', margin: '0 0 12px' }}>✓ Risques couverts</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {analysis.coveredRisks.map((r, i) => (
                        <span key={i} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#ECFDF5', color: '#059669' }}>{r}</span>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.excludedRisks?.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--rose)', margin: '0 0 12px' }}>✕ Exclusions</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {analysis.excludedRisks.map((r, i) => (
                        <span key={i} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#FEF2F2', color: '#DC2626' }}>{r}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ height: 100 }} />
          </div>
        </div>
      )}
    </div>
  );
}
