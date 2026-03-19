import { generateText } from 'ai';
import { createMinimax } from 'vercel-minimax-ai-provider';

function getMinimaxModel() {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error('MINIMAX_API_KEY is not set in environment variables');
  }
  const minimaxProvider = createMinimax({ apiKey });
  return minimaxProvider('MiniMax-Text-01');
}

export async function analyzeContractWithAI(
  documentText: string,
  fileName: string
): Promise<string> {
  'use server';

  const { text } = await generateText({
    model: getMinimaxModel(),
    prompt: `Tu es un analyste expert en contrats d'assurance. Analyse le texte suivant (provenant du fichier: ${fileName}) et EXTRAIS les informations structurées.

Réponds STRICTEMENT en JSON (sans markdown, sans code block, directement le JSON brut) avec ce format exact:

{
  "insurer": "nom de l'assureur",
  "policyNumber": "numéro de contrat",
  "productName": "nom du produit/contrat",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "premium": 0.00,
  "currency": "EUR",
  "franchise": 0.00,
  "coveredRisks": ["risque 1", "risque 2"],
  "excludedRisks": ["exclusion 1", "exclusion 2"],
  "plafonds": [{"label": "libellé", "amount": 0, "unit": "eur"}],
  "conditions": "résumé des conditions principales en français (2-3 phrases max)",
  "confidence": 0.0
}

Règles:
- premium = prime mensuelle en euros (ou annuelle si mensuel non disponible)
- franchise = montant de la franchise en euros
- coveredRisks = liste des risques couverts (extraits du texte)
- excludedRisks = liste des exclusions claires
- plafonds = les montants maximums garantis par catégorie
- confidence = score de confiance de ton analyse (0.0 à 1.0)
- Si une information n'est pas disponible, utilise null (pas une chaîne "null")
- Sois précis, ne fabriques pas d'informations qui ne sont pas dans le texte

Texte du document:
---
${documentText.substring(0, 15000)}
---`,
  });

  return text;
}

export async function askQuestionWithContext(
  question: string,
  contractText: string,
  conversationHistory: string
): Promise<string> {
  'use server';

  const { text } = await generateText({
    model: getMinimaxModel(),
    prompt: `Tu es un assistant expert en contrats d'assurance. Tu réponds en français, de manière claire et précise, en te basant UNIQUEMENT sur les informations du contrat fourni.

Tu ne dois JAMAIS inventer d'information. Si la réponse n'est pas dans le contrat, dis-le clairement.

Contexte du contrat:
---
${contractText.substring(0, 12000)}
---

Historique de la conversation:
---
${conversationHistory}
---

Question de l'utilisateur: ${question}

Réponds de manière concise (max 3-4 phrases) et cite les passages du contrat qui justifient ta réponse si possible.`,
  });

  return text;
}
