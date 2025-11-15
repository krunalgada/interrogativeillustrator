
import React, { useState, useEffect, useRef } from 'react';
import type { Question } from '../types';

interface QuizProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (answer: string) => void;
}

const Quiz: React.FC<QuizProps> = ({ question, questionNumber, totalQuestions, onAnswerSubmit }) => {
  const [answer, setAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when a new question is displayed
    inputRef.current?.focus();
  }, [question]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswerSubmit(answer);
      setAnswer('');
    }
  };

  return (
    <div className="w-full max-w-lg mt-8 text-center">
      <p className="text-indigo-400 font-semibold mb-2">
        Question {questionNumber} of {totalQuestions}
      </p>
      <h2 className="text-2xl text-gray-200 mb-6">{question}</h2>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="flex-grow bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 transition duration-300"
          disabled={!answer.trim()}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Quiz;
