// Types pour Covera

export type CoverageStatus = 'covered' | 'partial' | 'excluded' | 'unknown';

export interface CoverageItem {
  id: string;
  name: string;
  category: 'vehicle' | 'phone' | 'home' | 'health' | 'person' | 'animal' | 'other';
  icon: string; // emoji ou nom Lucide
  insurer: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  premium: number; // euros/mois
  franchise: number; // euros
  coverageStatus: CoverageStatus;
  coveredRisks: string[];
  excludedRisks: string[];
  plafonds: Plafond[];
  conditions: string;
  documentUrl?: string;
  notes?: string;
}

export interface Plafond {
  label: string;
  amount: number;
  unit: 'eur' | 'eur_an' | 'eur_sinistre' | 'jours' | 'fois';
}

export interface ContractAnalysis {
  rawText: string;
  insurer: string;
  policyNumber: string;
  productName: string;
  startDate: string;
  endDate: string;
  premium: number;
  currency: string;
  franchise: number;
  coveredRisks: string[];
  excludedRisks: string[];
  plafonds: Plafond[];
  conditions: string;
  rawHtml: string; // pour affichage
  confidence: number; // 0-1
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[]; // extraits du contrat utilisés
  timestamp: Date;
}

export interface InsuranceContract {
  id: string;
  userId: string;
  name: string;
  category: CoverageItem['category'];
  fileName: string;
  fileType: 'pdf' | 'image' | 'text';
  uploadedAt: string;
  analysis: ContractAnalysis | null;
  coverageItems: CoverageItem[];
}

export interface UserSituation {
  userId: string;
  contracts: InsuranceContract[];
  coverageItems: CoverageItem[]; // computed flat list
}
