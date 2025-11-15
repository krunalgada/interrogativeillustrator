import { NextRequest, NextResponse } from 'next/server';
import { generateRoastMeme } from '../../../services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questions, answers } = body;

    if (!questions || !answers) {
      return NextResponse.json(
        { error: 'Questions and answers are required' },
        { status: 400 }
      );
    }

    const memeUrl = await generateRoastMeme(questions, answers);
    return NextResponse.json({ memeUrl });
  } catch (error) {
    console.error('Error in meme API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

