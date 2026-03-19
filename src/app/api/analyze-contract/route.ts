import { NextRequest, NextResponse } from 'next/server';
import { analyzeContractWithAI } from '@/lib/minimax';
import type { ContractAnalysis } from '@/types';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { text, fileName } = await req.json();

    if (!text || !fileName) {
      return NextResponse.json(
        { error: 'Missing text or fileName' },
        { status: 400 }
      );
    }

    const rawResponse = await analyzeContractWithAI(text, fileName);

    // Parse the JSON response from AI
    let analysis: ContractAnalysis;
    try {
      // Clean the response - remove markdown code blocks if any
      const cleaned = rawResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      analysis = JSON.parse(cleaned) as ContractAnalysis;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, rawResponse);
      return NextResponse.json(
        { error: 'Failed to parse contract analysis', raw: rawResponse },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analyze contract error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
