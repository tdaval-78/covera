'use client';

import { useState } from 'react';
import { Car, Smartphone, Home, Heart, Users, PawPrint, Package, Plus, ChevronRight, TrendingUp, Shield, Trash2, Search, X } from 'lucide-react';
import type { InsuranceContract, CoverageItem } from '@/types';

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  vehicle: { label: 'Véhicules', icon: <Car size={20} />, color: '#3B82F6', bg: '#EFF6FF' },
  phone:   { label: 'Téléphones', icon: <Smartphone size={20} />, color: '#8B5CF6', bg: '#F5F3FF' },
  home:    { label: 'Habitat', icon: <Home size={20} />, color: '#10B981', bg: '#ECFDF5' },
  health:  { label: 'Santé', icon: <Heart size={20} />, color: '#EF4444', bg: '#FEF2F2' },
  person:  { label: 'Personnes', icon: <Users size={20} />, color: '#F59E0B', bg: '#FFFBEB' },
  animal:  { label: 'Animaux', icon: <PawPrint size={20} />, color: '#F97316', bg: '#FFF7ED' },
  other:   { label: 'Autres', icon: <Package size={20} />, color: '#6B7280', bg: '#F9FAFB' },
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
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 16,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, cursor: 'pointer', position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => { setShowDelete(true); (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; }}
      onMouseLeave={e => { setShowDelete(false); (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
      onClick={onClick}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
          style={{ position: 'absolute', top: 8, right: 8, padding: 6, borderRadius: 8, background: 'var(--rose-light)', color: 'var(--rose)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Supprimer"
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
    ? allItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.insurer.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  const handleItemClick = (item: CoverageItem) => {
    const contract = contracts.find(c => c.coverageItems.some(ci => ci.id === item.id));
    if (contract) onSelectContract(contract);
  };
  const handleDelete = (itemId: string) => {
    const contract = contracts.find(c => c.coverageItems.some(ci => ci.id === itemId));
    if (contract && onDeleteContract) onDeleteContract(contract.id);
  };

  // ─── EMPTY STATE ─────────────────────────────────────────
  if (contracts.length === 0) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', padding: '24px 20px 120px', boxSizing: 'border-box', overflowX: 'hidden' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 4px' }}>Bonjour 👋</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>Prêt à clarifier vos assurances ?</p>
          </div>

          {/* Purple banner */}
          <div style={{
            borderRadius: 20, padding: '24px 24px 24px', marginBottom: 20,
            background: 'linear-gradient(160deg, #4A3EE0 0%, #5B4CF5 40%, #7C5CF5 100%)',
            boxShadow: '0 8px 32px rgba(91,76,245,0.25)', color: 'white', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -64, right: -64, width: 192, height: 192, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -48, left: -32, width: 144, height: 144, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Shield size={16} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Covera</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Clarifiez vos assurances</h2>
              <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.6, margin: '0 0 20px' }}>
                Importez vos contrats, comprenez ce qui est couvert, et posez vos questions à l&apos;IA.
              </p>
              {onAddContract && (
                <button
                  onClick={onAddContract}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    borderRadius: 12, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)',
                    color: 'white', fontWeight: 700, fontSize: 14, border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <Plus size={16} />
                  Ajouter mon premier contrat
                </button>
              )}
            </div>
          </div>

          {/* Feature cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', boxSizing: 'border-box' }}>
            {[
              { icon: '📄', label: 'Upload', desc: 'PDF, photo' },
              { icon: '🧠', label: 'IA', desc: 'Analyse auto' },
              { icon: '💬', label: 'Chat', desc: 'Questions' },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{
                padding: 16, borderRadius: 16, background: 'var(--bg-card)',
                border: '1px solid var(--border)', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <p style={{ fontSize: 24, margin: '0 0 6px' }}>{icon}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGGED IN STATE ─────────────────────────────────────
  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '24px 20px 120px', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Heading */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 4px' }}>Ma situation</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            {total} élément{total > 1 ? 's' : ''} · {contracts.length} contrat{contracts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un contrat..."
            style={{
              width: '100%', padding: '14px 44px 14px 44px', boxSizing: 'border-box',
              background: 'var(--bg-card)', border: '1.5px solid var(--border)',
              borderRadius: 12, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, display: 'flex' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Stats banner */}
        <div style={{
          borderRadius: 20, padding: 24, marginBottom: 24,
          background: 'linear-gradient(135deg, #5B4CF5 0%, #7C5CF5 100%)',
          boxShadow: '0 8px 32px rgba(91,76,245,0.25)', color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={16} style={{ opacity: 0.7 }} />
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.7 }}>Vue d&apos;ensemble</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, margin: 0, letterSpacing: '-0.02em' }}>{total}</p>
              <p style={{ fontSize: 12, opacity: 0.7, margin: '4px 0 0' }}>contrats</p>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                <span style={{ fontSize: 22, fontWeight: 800 }}>{covered}</span>
              </div>
              <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>entièrement</p>
            </div>
            {partial > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                  <span style={{ fontSize: 22, fontWeight: 800 }}>{partial}</span>
                </div>
                <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>partiel</p>
              </div>
            )}
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', borderRadius: 3, background: 'white', width: total > 0 ? `${(covered / total) * 100}%` : '0%', transition: 'width 0.7s' }} />
          </div>
          <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>
            {total > 0 ? `${Math.round((covered / total) * 100)}% couverts` : 'Aucun contrat'}
          </p>
        </div>

        {/* Search results */}
        {query && (
          <div style={{ marginBottom: 24 }}>
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
              <div style={{ padding: 32, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }}>
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
        ).map(([category, items]) => {
          const cat = categoryConfig[category] || categoryConfig.other;
          return (
            <div key={category} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ color: cat.color, display: 'flex' }}>{cat.icon}</span>
                <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', margin: 0 }}>{cat.label}</h2>
                <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
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
