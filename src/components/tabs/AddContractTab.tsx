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
      const pageText = textContent.items
        .map((item: unknown) => (item as { str?: string }).str || '')
        .join(' ');
      fullText += `\n${pageText}`;
    }
    return fullText;
  };

  const handleFile = async (f: File) => {
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
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        text = await new Promise((resolve) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(`[IMAGE:${file.name} - base64 data]`);
          };
          reader.readAsDataURL(file);
        });
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

  // UPLOAD STEP
  if (step === 'upload') {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Ajouter un contrat</h1>
        <p className="text-gray-500 mb-6 text-sm md:text-base">
          Importez votre contrat pour l&apos;analyser automatiquement.
        </p>

        <div
          className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all cursor-pointer ${
            dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-white/50'
          }`}
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
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Upload size={28} className="text-indigo-500" />
          </div>
          <p className="font-semibold text-gray-800 mb-1">Glissez-déposez votre contrat</p>
          <p className="text-sm text-gray-400 mb-4">PDF, photo ou fichier texte</p>
          <div className="btn-primary inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold">
            Choisir un fichier
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*,.txt,.doc,.docx"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {fileName && (
          <div className="mt-4 glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
              {file?.type?.startsWith('image/') ? <Image size={20} /> : <FileText size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">{fileName}</p>
              <p className="text-xs text-gray-400">{file?.type}</p>
            </div>
            <button onClick={reset} className="p-1.5 text-gray-400 hover:text-red-500">
              <X size={18} />
            </button>
          </div>
        )}

        {file && (
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom du contrat</label>
              <input
                type="text"
                value={contractName}
                onChange={e => setContractName(e.target.value)}
                placeholder="ex: Ma mutuelle 2025"
                className="w-full glass-input px-4 py-3 rounded-xl text-gray-900 text-sm placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catégorie</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CoverageItem['category'])}
                className="w-full glass-input px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAnalyze}
              className="w-full btn-primary py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              Analyser le contrat
            </button>
          </div>
        )}
      </div>
    );
  }

  // ANALYZING STEP
  if (step === 'analyzing') {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6">
          <Loader2 size={40} className="text-indigo-500 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Analyse en cours...</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Lecture du contrat en cours. Cela peut prendre quelques secondes.
        </p>
        <div className="mt-6 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  // DONE STEP
  if (step === 'done' && analysis) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Analyse terminée</h1>

        <div className="glass rounded-2xl p-5 mt-5 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
            <CheckCircle size={24} className="text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-800">Contrat analysé !</p>
              <p className="text-xs text-emerald-700">Confiance: {Math.round((analysis.confidence || 0) * 100)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Assureur', value: analysis.insurer || '—' },
              { label: 'N° contrat', value: analysis.policyNumber || '—' },
              { label: 'Prime', value: `${analysis.premium || 0} €/mois` },
              { label: 'Franchise', value: `${analysis.franchise || 0} €` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/50 rounded-xl p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-semibold text-gray-900 text-sm truncate">{value}</p>
              </div>
            ))}
          </div>

          {analysis.coveredRisks.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Risques couverts</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.coveredRisks.slice(0, 6).map((r, i) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                    ✓ {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.excludedRisks.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Exclusions</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.excludedRisks.slice(0, 4).map((r, i) => (
                  <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                    ✕ {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.conditions && (
            <div className="bg-white/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1 font-medium">Conditions</p>
              <p className="text-sm text-gray-700 leading-relaxed">{analysis.conditions}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={reset} className="flex-1 btn-secondary py-3 rounded-xl font-semibold text-sm">
            Annuler
          </button>
          <button onClick={handleConfirm} className="flex-1 btn-primary py-3 rounded-xl font-semibold text-sm">
            Confirmer
          </button>
        </div>
      </div>
    );
  }

  // ERROR STEP
  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur d&apos;analyse</h2>
      <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">{error}</p>
      <button onClick={reset} className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm">
        Réessayer
      </button>
    </div>
  );
}
