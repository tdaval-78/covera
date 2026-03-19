'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, Image, X } from 'lucide-react';
import type { InsuranceContract, ContractAnalysis, CoverageItem } from '@/types';

type Step = 'upload' | 'analyzing' | 'done' | 'error';

const categoryOptions = [
  { value: 'vehicle', label: 'Véhicule' },
  { value: 'phone', label: 'Téléphone' },
  { value: 'home', label: 'Habitat' },
  { value: 'health', label: 'Santé' },
  { value: 'person', label: 'Personne' },
  { value: 'animal', label: 'Animal' },
  { value: 'other', label: 'Autre' },
];

export default function AddContractTab({ onContractAdded }: { onContractAdded: (contract: InsuranceContract) => void }) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [contractName, setContractName] = useState('');
  const [category, setCategory] = useState<CoverageItem['category']>('other');
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (f: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const arrayBuffer = await f.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: unknown) => (item as { str?: string }).str || '').join(' ') + '\n';
    }
    return fullText;
  };

  const handleFile = (f: File) => {
    setFile(f);
    setFileName(f.name);
    setContractName(f.name.replace(/\.[^/.]+$/, ''));
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStep('analyzing');
    setError('');
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }
      if (!text || text.length < 50) throw new Error('Document illisible. Assurez-vous que le PDF contient du texte extractible.');
      const res = await fetch('/api/analyze-contract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, fileName: file.name }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'analyse');
      setAnalysis(data.analysis);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setStep('error');
    }
  };

  const handleConfirm = () => {
    if (!analysis || !file) return;
    const coverageItem: CoverageItem = {
      id: Date.now().toString(), name: analysis.productName || contractName, category, icon: '',
      insurer: analysis.insurer || 'Assureur inconnu', policyNumber: analysis.policyNumber || '',
      startDate: analysis.startDate || '', endDate: analysis.endDate || '',
      premium: analysis.premium || 0, franchise: analysis.franchise || 0, coverageStatus: 'unknown',
      coveredRisks: analysis.coveredRisks || [], excludedRisks: analysis.excludedRisks || [],
      plafonds: analysis.plafonds || [], conditions: analysis.conditions || '',
      notes: `Confiance: ${Math.round((analysis.confidence || 0) * 100)}%`,
    };
    const contract: InsuranceContract = {
      id: Date.now().toString(), userId: 'anonymous', name: contractName || analysis.productName || file.name,
      category, fileName: file.name,
      fileType: file.type === 'application/pdf' ? 'pdf' : file.type.startsWith('image/') ? 'image' : 'text',
      uploadedAt: new Date().toISOString(), analysis, coverageItems: [coverageItem],
    };
    onContractAdded(contract);
  };

  const reset = () => {
    setStep('upload'); setFile(null); setFileName(''); setContractName('');
    setCategory('other'); setAnalysis(null); setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── UPLOAD STEP ─────────────────────────────────────────
  if (step === 'upload') {
    return (
      <div style={{ width: '100%', minHeight: '100vh', padding: '24px 20px 120px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 4px' }}>Ajouter un contrat</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px' }}>Importez votre contrat pour l&apos;analyser automatiquement.</p>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: 40, textAlign: 'center', cursor: 'pointer', borderRadius: 20,
              background: 'var(--bg-card)', border: dragOver ? '2px solid var(--brand)' : '2px dashed var(--border-hover)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'border-color 0.2s',
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Upload size={24} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>Glissez-déposez votre contrat</p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 20px' }}>PDF, photo ou texte</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', color: 'white', fontWeight: 600, fontSize: 14, boxShadow: '0 2px 8px rgba(91,76,245,0.25)' }}>Choisir un fichier</span>
          </div>

          <input ref={fileInputRef} type="file" accept=".pdf,image/*,.txt,.doc,.docx" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          {fileName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', marginTop: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {file?.type?.startsWith('image/') ? <Image size={18} /> : <FileText size={18} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{file?.type}</p>
              </div>
              <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 8, display: 'flex', borderRadius: 8 }}>
                <X size={16} />
              </button>
            </div>
          )}

          {file && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Nom du contrat</label>
                <input type="text" value={contractName} onChange={e => setContractName(e.target.value)} placeholder="ex: Ma mutuelle 2025"
                  style={{ display: 'block', width: '100%', padding: '14px 16px', boxSizing: 'border-box', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Catégorie</label>
                <select value={category} onChange={e => setCategory(e.target.value as CoverageItem['category'])}
                  style={{ display: 'block', width: '100%', padding: '14px 16px', boxSizing: 'border-box', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}>
                  {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <button onClick={handleAnalyze}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '15px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', color: 'white', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(91,76,245,0.25)' }}>
                <FileText size={18} />
                Analyser le contrat
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── LOADING STEP ────────────────────────────────────────
  if (step === 'analyzing') {
    return (
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Loader2 size={36} style={{ color: 'var(--brand)', animation: 'spin 0.7s linear infinite' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Analyse en cours...</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, maxWidth: 320, textAlign: 'center' }}>Lecture du contrat en cours. Cela peut prendre quelques secondes.</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── DONE STEP ───────────────────────────────────────────
  if (step === 'done' && analysis) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', padding: '24px 20px 120px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Contrat analysé !</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Confiance : {Math.round((analysis.confidence || 0) * 100)}%</p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Assureur', value: analysis.insurer || '—' },
                { label: 'N° contrat', value: analysis.policyNumber || '—' },
                { label: 'Prime', value: analysis.premium ? `${analysis.premium} €/mois` : '—' },
                { label: 'Franchise', value: analysis.franchise ? `${analysis.franchise} €` : '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', margin: '0 0 4px' }}>{label}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                </div>
              ))}
            </div>

            {analysis.coveredRisks?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#059669', margin: '0 0 10px' }}>✓ Risques couverts</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {analysis.coveredRisks.slice(0, 6).map((r, i) => (
                    <span key={i} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#ECFDF5', color: '#059669' }}>✓ {r}</span>
                  ))}
                </div>
              </div>
            )}
            {analysis.excludedRisks?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#DC2626', margin: '0 0 10px' }}>✕ Exclusions</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {analysis.excludedRisks.slice(0, 4).map((r, i) => (
                    <span key={i} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#FEF2F2', color: '#DC2626' }}>✕ {r}</span>
                  ))}
                </div>
              </div>
            )}
            {analysis.conditions && (
              <div style={{ padding: 12, background: 'var(--bg-subtle)', borderRadius: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', margin: '0 0 6px' }}>Conditions</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{analysis.conditions}</p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={reset} style={{ flex: 1, padding: '14px 24px', borderRadius: 12, background: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer' }}>Annuler</button>
            <button onClick={handleConfirm} style={{ flex: 1, padding: '14px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', color: 'white', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(91,76,245,0.25)' }}>Confirmer</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── ERROR STEP ──────────────────────────────────────────
  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--rose-light)', color: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <AlertCircle size={28} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Erreur d&apos;analyse</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px', maxWidth: 320, textAlign: 'center' }}>{error}</p>
      <button onClick={reset} style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #5B4CF5, #7C5CF5)', color: 'white', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(91,76,245,0.25)' }}>Réessayer</button>
    </div>
  );
}
