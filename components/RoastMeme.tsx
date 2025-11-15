
import React from 'react';

interface RoastMemeProps {
  memeUrl: string;
  onPlayAgain: () => void;
}

const RoastMeme: React.FC<RoastMemeProps> = ({ memeUrl, onPlayAgain }) => {
  return (
    <div className="w-full max-w-4xl text-center flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">
        You Got Roasted! 🔥
      </h2>
      <p className="text-gray-400 mb-8">
        Based on your answers, here's your personalized roast:
      </p>
      
      <div className="mb-8">
        <img 
          src={memeUrl} 
          alt="Roast meme" 
          className="max-w-full h-auto rounded-2xl shadow-2xl border-4 border-red-500/50"
        />
      </div>
      
      <button
        onClick={onPlayAgain}
        className="mt-4 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default RoastMeme;

