import React, { useState } from 'react';

const GameFilter = ({ onFilter }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Games' },
    { id: 'slots', label: 'Slots' },
    { id: 'blackjack', label: 'Blackjack' },
    { id: 'roulette', label: 'Roulette' },
    { id: 'poker', label: 'Poker' },
    { id: 'baccarat', label: 'Baccarat' }
  ];

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    onFilter(filterId === 'all' ? null : filterId);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-casino-secondary text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => handleFilterClick(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default GameFilter;