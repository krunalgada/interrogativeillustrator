import { NextRequest, NextResponse } from 'next/server';
import { generateGameData } from '../../../services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const data = await generateGameData(prompt);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in game API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

