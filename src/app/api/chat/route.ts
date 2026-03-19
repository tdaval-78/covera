import { NextRequest, NextResponse } from 'next/server';
import { askQuestionWithContext } from '@/lib/minimax';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { question, contractText, conversationHistory } = await req.json();

    if (!question || !contractText) {
      return NextResponse.json(
        { error: 'Missing question or contract text' },
        { status: 400 }
      );
    }

    const answer = await askQuestionWithContext(
      question,
      contractText,
      conversationHistory || ''
    );

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
