'use client';

import { useState } from 'react';
import { Car, Smartphone, Home, Heart, Users, PawPrint, Package, Plus, ChevronRight, TrendingUp, Shield, Trash2, Search, X } from 'lucide-react';
import type { InsuranceContract, CoverageItem } from '@/types';

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  vehicle: { label: 'Véhicules', icon: <Car size={18} />, color: '#3B82F6', bg: '#EFF6FF' },
  phone:   { label: 'Téléphones', icon: <Smartphone size={18} />, color: '#8B5CF6', bg: '#F5F3FF' },
  home:    { label: 'Habitat', icon: <Home size={18} />, color: '#10B981', bg: '#ECFDF5' },
  health:  { label: 'Santé', icon: <Heart size={18} />, color: '#EF4444', bg: '#FEF2F2' },
  person:  { label: 'Personnes', icon: <Users size={18} />, color: '#F59E0B', bg: '#FFFBEB' },
  animal:  { label: 'Animaux', icon: <PawPrint size={18} />, color: '#F97316', bg: '#FFF7ED' },
  other:   { label: 'Autres', icon: <Package size={18} />, color: '#6B7280', bg: '#F9FAFB' },
};

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = { covered: '#10B981', partial: '#F59E0B', excluded: '#EF4444', unknown: '#CBD5E1' };
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[status] || colors.unknown, display: 'inline-block', flexShrink: 0 }} />;
}

function CoverageCard({ item, contracts, onClick, onDelete }: { item: CoverageItem; contracts: InsuranceContract[]; onClick?: () => void; onDelete?: (id: string) => void }) {
  const cat = categoryConfig[item.category] || categoryConfig.other;
  const [showDelete, setShowDelete] = useState(false);
  return (
    <div
      onMouseEnter={e => { setShowDelete(true); (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { setShowDelete(false); (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 14,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, cursor: 'pointer', position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s',
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 2px 8px ${cat.bg}` }}>
        {cat.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{item.name}</p>
          <StatusDot status={item.coverageStatus} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.insurer}</p>
      </div>
      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
      {showDelete && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          style={{ position: 'absolute', top: 8, right: 8, padding: 6, borderRadius: 8, background: '#FEF2F2', color: '#EF4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(239,68,68,0.15)' }}
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

export default function SituationTab({ contracts, onSelectContract, onAddContract, onDeleteContract }: {
  contracts: InsuranceContract[]; onSelectContract: (c: InsuranceContract) => void;
  onAddContract?: () => void; onDeleteContract?: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const allItems = contracts.flatMap(c => c.coverageItems);
  const covered = allItems.filter(i => i.coverageStatus === 'covered').length;
  const partial = allItems.filter(i => i.coverageStatus === 'partial').length;
  const total = allItems.length;
  const filteredItems = query.trim()
    ? allItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.insurer.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  const handleItemClick = (item: CoverageItem) => {
    const contract = contracts.find(c => c.coverageItems.some(ci => ci.id === item.id));
    if (contract) onSelectContract(contract);
  };
  const handleDelete = (itemId: string) => {
    const contract = contracts.find(c => c.coverageItems.some(ci => ci.id === itemId));
    if (contract && onDeleteContract) onDeleteContract(contract.id);
  };

  if (contracts.length === 0) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', padding: '24px 20px 120px', boxSizing: 'border-box' }}>
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
          .anim-up { animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .anim-up-1 { animation: fadeUp 0.5s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .anim-up-2 { animation: fadeUp 0.5s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .anim-up-3 { animation: fadeUp 0.5s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .anim-float { animation: float 3s ease-in-out infinite; }
        `}</style>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {/* Heading */}
          <div className="anim-up" style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: '0 0 4px' }}>Bonjour 👋</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>Prêt à clarifier vos assurances ?</p>
          </div>

          {/* Hero banner */}
          <div className="anim-up-1" style={{
            borderRadius: 24, padding: '28px 24px', marginBottom: 20,
            background: 'linear-gradient(160deg, #3D33D4 0%, #5B4CF5 40%, #7C5CF5 100%)',
            boxShadow: '0 8px 40px rgba(91,76,245,0.3), 0 2px 8px rgba(91,76,245,0.2)',
            color: 'white', position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative elements */}
            <div style={{ position: 'absolute', top: -64, right: -64, width: 192, height: 192, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)' }} />
            <div style={{ position: 'absolute', bottom: -48, left: -32, width: 144, height: 144, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', animation: 'float 4s ease-in-out infinite' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Shield size={16} style={{ opacity: 0.8 }} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.8 }}>Covera</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Clarifiez vos assurances</h2>
              <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 300 }}>
                Importez vos contrats, comprenez ce qui est couvert, et posez vos questions à l&apos;IA.
              </p>
              {onAddContract && (
                <button
                  onClick={onAddContract}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 20px',
                    borderRadius: 14, background: 'white', backdropFilter: 'blur(12px)',
                    color: '#5B4CF5', fontWeight: 700, fontSize: 14, border: 'none',
                    cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F8F8FF'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
                >
                  <Plus size={16} />
                  Ajouter mon premier contrat
                </button>
              )}
            </div>
          </div>

          {/* Feature cards */}
          <div className="anim-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>, label: 'Upload', desc: 'PDF, photo' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>, label: 'IA', desc: 'Analyse auto' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'Chat', desc: 'Questions' },
            ].map(({ icon, label, desc }, idx) => (
              <div key={label} style={{
                padding: 18, borderRadius: 18, background: 'var(--bg-card)',
                border: '1px solid var(--border)', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 2px 8px rgba(91,76,245,0.15)' }}>
                  {icon}
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '24px 20px 120px', boxSizing: 'border-box' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .anim-up { animation: fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-up-1 { animation: fadeUp 0.45s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-up-2 { animation: fadeUp 0.45s 0.16s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-up-3 { animation: fadeUp 0.45s 0.24s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Heading */}
        <div className="anim-up" style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: '0 0 4px' }}>Ma situation</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            {total} élément{total > 1 ? 's' : ''} · {contracts.length} contrat{contracts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        <div className="anim-up-1" style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un contrat..."
            style={{
              width: '100%', padding: '14px 44px 14px 44px', boxSizing: 'border-box',
              background: 'var(--bg-card)', border: '1.5px solid var(--border)',
              borderRadius: 14, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { (e.target as HTMLElement).style.borderColor = 'var(--brand)'; (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(91,76,245,0.1)'; }}
            onBlur={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex', borderRadius: 6 }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Stats banner */}
        <div className="anim-up-2" style={{
          borderRadius: 24, padding: 24, marginBottom: 24,
          background: 'linear-gradient(135deg, #5B4CF5 0%, #7C5CF5 100%)',
          boxShadow: '0 8px 32px rgba(91,76,245,0.25)',
          color: 'white', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -32, right: -32, width: 128, height: 128, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -24, left: -24, width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={16} style={{ opacity: 0.7 }} />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.7 }}>Vue d&apos;ensemble</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, margin: 0, letterSpacing: '-0.03em' }}>{total}</p>
                <p style={{ fontSize: 12, opacity: 0.65, margin: '4px 0 0' }}>contrats</p>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  <span style={{ fontSize: 24, fontWeight: 800 }}>{covered}</span>
                </div>
                <p style={{ fontSize: 12, opacity: 0.65, margin: 0 }}>entièrement</p>
              </div>
              {partial > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                    <span style={{ fontSize: 24, fontWeight: 800 }}>{partial}</span>
                  </div>
                  <p style={{ fontSize: 12, opacity: 0.65, margin: 0 }}>partiel</p>
                </div>
              )}
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)', overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ height: '100%', borderRadius: 3, background: 'white', width: total > 0 ? `${(covered / total) * 100}%` : '0%', transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)' }} />
            </div>
            <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>
              {total > 0 ? `${Math.round((covered / total) * 100)}% couverts` : 'Aucun contrat'}
            </p>
          </div>
        </div>

        {/* Search results */}
        {query && (
          <div className="anim-up-3" style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', margin: '0 0 12px' }}>
              Résultats ({filteredItems.length})
            </p>
            {filteredItems.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredItems.map(item => (
                  <CoverageCard key={item.id} item={item} contracts={contracts} onClick={() => handleItemClick(item)} onDelete={handleDelete} />
                ))}
              </div>
            ) : (
              <div style={{ padding: 32, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 14, color: 'var(--text-tertiary)', margin: 0 }}>Aucun résultat pour &quot;{query}&quot;</p>
              </div>
            )}
          </div>
        )}

        {/* Grouped by category */}
        {!query && Object.entries(
          allItems.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
          }, {} as Record<string, CoverageItem[]>)
        ).map(([category, items], catIdx) => {
          const cat = categoryConfig[category] || categoryConfig.other;
          return (
            <div key={category} style={{ marginBottom: 24, animation: `fadeUp 0.45s ${0.3 + catIdx * 0.08}s cubic-bezier(0.22, 1, 0.36, 1) both` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ color: cat.color, display: 'flex' }}>{cat.icon}</span>
                <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', margin: 0 }}>{cat.label}</h2>
                <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: cat.bg, color: cat.color }}>
                  {items.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(item => (
                  <CoverageCard key={item.id} item={item} contracts={contracts} onClick={() => handleItemClick(item)} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
