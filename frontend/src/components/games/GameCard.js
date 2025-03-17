import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  return (
    <div className="game-card bg-casino-primary rounded-lg overflow-hidden shadow-md hover:shadow-xl">
      <div className="relative pb-1/2">
        <img 
          src={game.image || '/placeholder-game.jpg'} 
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{game.description}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            <span className="mr-2">Min: ${game.minBet}</span>
            <span>Max: ${game.maxBet}</span>
          </div>
          <Link
            to={`/games/${game._id}`}
            className="btn btn-primary text-sm"
          >
            Play Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;