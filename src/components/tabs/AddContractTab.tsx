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

export default function AddContractTab({
  onContractAdded,
}: {
  onContractAdded: (contract: InsuranceContract) => void;
}) {
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
      fullText += textContent.items
        .map((item: unknown) => (item as { str?: string }).str || '')
        .join(' ') + '\n';
    }
    return fullText;
  };

  const handleFile = (f: File) => {
    setFile(f);
    setFileName(f.name);
    setContractName(f.name.replace(/\.[^/.]+$/, ''));
    setStep('upload');
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
      if (!text || text.length < 50) {
        throw new Error('Document illisible. Assurez-vous que le PDF contient du texte extractible.');
      }

      const res = await fetch('/api/analyze-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fileName: file.name }),
      });
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
      id: Date.now().toString(),
      name: analysis.productName || contractName,
      category,
      icon: '',
      insurer: analysis.insurer || 'Assureur inconnu',
      policyNumber: analysis.policyNumber || '',
      startDate: analysis.startDate || '',
      endDate: analysis.endDate || '',
      premium: analysis.premium || 0,
      franchise: analysis.franchise || 0,
      coverageStatus: 'unknown',
      coveredRisks: analysis.coveredRisks || [],
      excludedRisks: analysis.excludedRisks || [],
      plafonds: analysis.plafonds || [],
      conditions: analysis.conditions || '',
      notes: `Confiance: ${Math.round((analysis.confidence || 0) * 100)}%`,
    };
    const contract: InsuranceContract = {
      id: Date.now().toString(),
      userId: 'anonymous',
      name: contractName || analysis.productName || file.name,
      category,
      fileName: file.name,
      fileType: file.type === 'application/pdf' ? 'pdf' : file.type.startsWith('image/') ? 'image' : 'text',
      uploadedAt: new Date().toISOString(),
      analysis,
      coverageItems: [coverageItem],
    };
    onContractAdded(contract);
  };

  const reset = () => {
    setStep('upload');
    setFile(null);
    setFileName('');
    setContractName('');
    setCategory('other');
    setAnalysis(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (step === 'upload') {
    return (
      <div className="p-5 md:p-8 max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>Ajouter un contrat</h1>
        <p className="text-sm mb-6">Importez votre contrat pour l&apos;analyser automatiquement.</p>

        {/* Drop zone */}
        <div
          className="card p-8 text-center cursor-pointer transition-all"
          style={{ border: dragOver ? '2px solid var(--brand)' : '2px dashed var(--border-hover)' }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}
          >
            <Upload size={24} />
          </div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Glissez-déposez votre contrat</p>
          <p className="text-sm mb-4">PDF, photo ou texte</p>
          <span className="btn btn-brand btn-md inline-flex">Choisir un fichier</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*,.txt,.doc,.docx"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {fileName && (
          <div className="card p-4 mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
              {file?.type?.startsWith('image/') ? <Image size={18} /> : <FileText size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{fileName}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{file?.type}</p>
            </div>
            <button onClick={reset} className="p-2 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {file && (
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block">Nom du contrat</label>
              <input
                type="text"
                value={contractName}
                onChange={e => setContractName(e.target.value)}
                placeholder="ex: Ma mutuelle 2025"
                className="input"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block">Catégorie</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CoverageItem['category'])}
                className="input"
              >
                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <button onClick={handleAnalyze} className="btn btn-brand btn-lg w-full">
              <FileText size={18} />
              Analyser le contrat
            </button>
          </div>
        )}
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="p-5 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'var(--brand-light)' }}
        >
          <Loader2 size={36} style={{ color: 'var(--brand)' }} className="animate-spin" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Analyse en cours...</h2>
        <p className="text-sm text-center max-w-xs">Lecture du contrat en cours. Cela peut prendre quelques secondes.</p>
      </div>
    );
  }

  if (step === 'done' && analysis) {
    return (
      <div className="p-5 md:p-8 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Contrat analysé !</h1>
            <p className="text-sm">Confiance : {Math.round((analysis.confidence || 0) * 100)}%</p>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Assureur', value: analysis.insurer || '—' },
              { label: 'N° contrat', value: analysis.policyNumber || '—' },
              { label: 'Prime', value: `${analysis.premium || 0} €/mois` },
              { label: 'Franchise', value: `${analysis.franchise || 0} €` },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>

          {analysis.coveredRisks.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2">Risques couverts</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.coveredRisks.slice(0, 6).map((r, i) => (
                  <span key={i} className="badge badge-emerald">✓ {r}</span>
                ))}
              </div>
            </div>
          )}

          {analysis.excludedRisks.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2">Exclusions</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.excludedRisks.slice(0, 4).map((r, i) => (
                  <span key={i} className="badge badge-rose">✕ {r}</span>
                ))}
              </div>
            </div>
          )}

          {analysis.conditions && (
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1">Conditions</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{analysis.conditions}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={reset} className="btn btn-ghost btn-lg flex-1">Annuler</button>
          <button onClick={handleConfirm} className="btn btn-brand btn-lg flex-1">Confirmer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-lg mx-auto text-center">
      <div
        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        style={{ background: 'var(--rose-light)', color: 'var(--rose)' }}
      >
        <AlertCircle size={28} />
      </div>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Erreur d&apos;analyse</h2>
      <p className="text-sm mb-6">{error}</p>
      <button onClick={reset} className="btn btn-brand btn-lg">Réessayer</button>
    </div>
  );
}
