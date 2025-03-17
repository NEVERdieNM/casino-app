import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGames } from '../store/slices/gamesSlice';
import GameCard from '../components/games/GameCard';
import GameFilter from '../components/games/GameFilter';

const GameLobbyPage = () => {
  const [filteredGames, setFilteredGames] = useState([]);
  const [filter, setFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { games, isLoading, error } = useSelector(state => state.games);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllGames());
  }, [dispatch]);

  useEffect(() => {
    // Apply filters and search query
    let result = [...games];
    
    if (filter) {
      result = result.filter(game => game.type === filter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(game => 
        game.name.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredGames(result);
  }, [games, filter, searchQuery]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Game Lobby</h1>
        <p className="text-gray-400">Choose from our selection of exciting casino games</p>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-input"
            />
          </div>
          <div className="w-full md:flex-1">
            <GameFilter onFilter={handleFilterChange} />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-secondary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-900 bg-opacity-20 rounded-lg">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => dispatch(getAllGames())}
            className="mt-4 btn btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">No Games Found</h3>
          <p className="text-gray-400">
            {searchQuery || filter
              ? 'Try adjusting your filters or search query'
              : 'No games available at the moment. Please check back later.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameLobbyPage;