'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
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
        .map((item: unknown) => {
          const textItem = item as { str?: string };
          return textItem.str || '';
        })
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
        // For images, we'll send base64 to the AI for vision analysis
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(file);
        });
        text = `[IMAGE:${file.name} - base64:${base64.substring(0, 100)}...]`;
      } else {
        text = await file.text();
      }

      if (!text || text.length < 50) {
        throw new Error('Impossible d\'extraire le texte du document. Assurez-vous que le PDF contient du texte extractible (pas uniquement des images scannées).');
      }

      const res = await fetch('/api/analyze-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fileName: file.name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      setAnalysis(data.analysis);
      setStep('done');
    } catch (err) {
      console.error('Analysis error:', err);
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
      notes: `Confiance de l'analyse: ${Math.round((analysis.confidence || 0) * 100)}%`,
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

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter un contrat</h1>
      <p className="text-gray-500 mb-8">
        Importez votre contrat d'assurance pour l'analyser automatiquement.
      </p>

      {/* Upload step */}
      {step === 'upload' && (
        <div>
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
            <Upload size={48} className={`mx-auto mb-4 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-gray-700 font-medium mb-1">
              Glissez-déposez votre contrat ici
            </p>
            <p className="text-gray-400 text-sm mb-4">
              PDF, image ou fichier texte accepté
            </p>
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
              Choisir un fichier
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*,.txt,.doc,.docx"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          {fileName && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 flex items-center gap-3">
              <FileText size={24} className="text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{fileName}</p>
                <p className="text-sm text-gray-500">{file?.type}</p>
              </div>
              <button
                onClick={reset}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {file && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du contrat
                </label>
                <input
                  type="text"
                  value={contractName}
                  onChange={e => setContractName(e.target.value)}
                  placeholder="ex: Ma mutuelle 2025"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as CoverageItem['category'])}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAnalyze}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={18} />
                Analyser le contrat
              </button>
            </div>
          )}
        </div>
      )}

      {/* Analyzing step */}
      {step === 'analyzing' && (
        <div className="text-center py-20">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Analyse en cours...
          </h2>
          <p className="text-gray-500">
            Lecture du contrat en cours. Cela peut prendre quelques secondes.
          </p>
          <div className="mt-6 max-w-xs mx-auto">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      )}

      {/* Done step */}
      {step === 'done' && analysis && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <CheckCircle size={24} className="text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Contrat analysé avec succès !</p>
              <p className="text-sm text-green-700">
                Confiance de l'analyse : {Math.round((analysis.confidence || 0) * 100)}%
              </p>
            </div>
          </div>

          {/* Analysis preview */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Résumé de l'analyse</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Assureur</p>
                <p className="font-medium text-gray-900">{analysis.insurer || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">N° de contrat</p>
                <p className="font-medium text-gray-900">{analysis.policyNumber || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prime</p>
                <p className="font-medium text-gray-900">{analysis.premium || 0} €/mois</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Franchise</p>
                <p className="font-medium text-gray-900">{analysis.franchise || 0} €</p>
              </div>
            </div>

            {analysis.coveredRisks.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Risques couverts</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.coveredRisks.slice(0, 6).map((r, i) => (
                    <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      ✓ {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.excludedRisks.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Exclusions</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.excludedRisks.slice(0, 4).map((r, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                      ✕ {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.conditions && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Conditions</p>
                <p className="text-gray-700 text-sm">{analysis.conditions}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Confirmer et ajouter
            </button>
          </div>
        </div>
      )}

      {/* Error step */}
      {step === 'error' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
            <AlertCircle size={24} className="text-red-600" />
            <div>
              <p className="font-semibold text-red-800">Erreur lors de l'analyse</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
