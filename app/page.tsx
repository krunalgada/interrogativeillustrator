'use client';

import React, { useState, useCallback } from 'react';
import { GameState } from '../types';
import type { Question } from '../types';
// API calls will be made through Next.js API routes
import SearchBar from '../components/SearchBar';
import ImageDisplay from '../components/ImageDisplay';
import Quiz from '../components/Quiz';
import RoastMeme from '../components/RoastMeme';
import Loader from '../components/Loader';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(GameState.SEARCH);
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [isGeneratingMeme, setIsGeneratingMeme] = useState(false);

  const isLoading = gameState === GameState.GENERATING && !isGeneratingMeme;

  const handleSearch = useCallback(async (searchPrompt: string) => {
    setPrompt(searchPrompt);
    setGameState(GameState.GENERATING);
    setError(null);
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: searchPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate game data');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      setQuestions(data.questions);
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
      setGameState(GameState.QUIZ);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setGameState(GameState.SEARCH);
    }
  }, []);

  const handleAnswerSubmit = async (answer: string) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered - generate roast meme
      setGameState(GameState.GENERATING);
      setIsGeneratingMeme(true);
      try {
        const response = await fetch('/api/meme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questions, answers: newAnswers }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate roast meme');
        }

        const data = await response.json();
        setMemeUrl(data.memeUrl);
        setGameState(GameState.MEME);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate roast meme.');
        setGameState(GameState.QUIZ);
      } finally {
        setIsGeneratingMeme(false);
      }
    }
  };

  const handlePlayAgain = () => {
    setGameState(GameState.SEARCH);
    setPrompt('');
    setImageUrl(null);
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setError(null);
    setMemeUrl(null);
    setIsGeneratingMeme(false);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.SEARCH:
        return (
          <>
            <SearchBar onSubmit={handleSearch} isLoading={isLoading} />
            {error && <p className="mt-4 text-red-400">{`Error: ${error}`}</p>}
          </>
        );
      case GameState.GENERATING:
        if (isGeneratingMeme && imageUrl) {
          // Show blurred image in background with loader overlay
          return (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-full max-w-lg">
                <ImageDisplay src={imageUrl} blurLevel={questions.length - 1} totalQuestions={questions.length} />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 rounded-2xl">
                  <Loader message="Processing your image..." />
                </div>
              </div>
            </div>
          );
        }
        return <Loader message="Generating your masterpiece & questions..." />;
      case GameState.QUIZ:
        return (
          <>
            <ImageDisplay src={imageUrl} blurLevel={currentQuestionIndex} totalQuestions={questions.length} />
            <Quiz
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswerSubmit={handleAnswerSubmit}
            />
          </>
        );
      case GameState.MEME:
        return memeUrl ? (
          <RoastMeme memeUrl={memeUrl} onPlayAgain={handlePlayAgain} />
        ) : (
          <Loader message="Processing your image..." />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-900 font-sans">
      <main className="w-full h-full flex flex-col items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
}

