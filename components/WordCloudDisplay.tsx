
import React, { useMemo } from 'react';
import type { WordCloudWord } from '../types';

interface WordCloudDisplayProps {
  answers: string[];
  onPlayAgain: () => void;
}

const STOP_WORDS = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'is', 'am', 'are', 'was', 'were', 'it', 'i', 'you', 'he', 'she', 'they', 'we', 'and', 'or', 'but']);

const processWords = (answers: string[]): WordCloudWord[] => {
  const wordCounts: { [key: string]: number } = {};
  
  answers.forEach(answer => {
    answer
      .toLowerCase()
      .split(/\s+/)
      .forEach(word => {
        const cleanedWord = word.replace(/[^a-z]/g, '');
        if (cleanedWord.length > 2 && !STOP_WORDS.has(cleanedWord)) {
          wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
        }
      });
  });

  return Object.entries(wordCounts)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // Limit to top 50 words
};

const getWordClassName = (value: number) => {
  if (value > 5) return 'text-5xl text-indigo-400';
  if (value > 3) return 'text-4xl text-purple-400';
  if (value > 2) return 'text-3xl text-indigo-300';
  if (value > 1) return 'text-2xl text-purple-300';
  return 'text-xl text-gray-300';
};

const WordCloudDisplay: React.FC<WordCloudDisplayProps> = ({ answers, onPlayAgain }) => {
  const words = useMemo(() => processWords(answers), [answers]);

  return (
    <div className="w-full max-w-4xl text-center flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
        Your Word Cloud
      </h2>
      <p className="text-gray-400 mb-8">
        Here are the most frequent words from your answers.
      </p>
      
      {words.length > 0 ? (
        <div className="p-8 bg-gray-800/50 rounded-2xl flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
          {words.map((word) => (
            <span
              key={word.text}
              className={`${getWordClassName(word.value)} font-bold transition-all duration-300`}
            >
              {word.text}
            </span>
          ))}
        </div>
      ) : (
         <p className="text-gray-500 my-8">You didn't provide enough words to create a cloud!</p>
      )}
      
      <button
        onClick={onPlayAgain}
        className="mt-12 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default WordCloudDisplay;
