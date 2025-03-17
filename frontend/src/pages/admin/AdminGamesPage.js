import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAdminGames, createGame, updateGame } from '../../store/slices/adminSlice';
import { format } from 'date-fns';

const AdminGamesPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'slots',
    description: '',
    rules: '',
    minBet: 1,
    maxBet: 100,
    houseEdge: 5,
    isActive: true,
    image: ''
  });
  
  const { games, isLoading } = useSelector(state => state.admin);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllAdminGames());
  }, [dispatch]);
  
  const handleOpenForm = (game = null) => {
    if (game) {
      setFormData({
        name: game.name,
        type: game.type,
        description: game.description || '',
        rules: game.rules || '',
        minBet: game.minBet,
        maxBet: game.maxBet,
        houseEdge: game.houseEdge,
        isActive: game.isActive,
        image: game.image || ''
      });
      setCurrentGame(game);
      setIsEditing(true);
    } else {
      setFormData({
        name: '',
        type: 'slots',
        description: '',
        rules: '',
        minBet: 1,
        maxBet: 100,
        houseEdge: 5,
        isActive: true,
        image: ''
      });
      setCurrentGame(null);
      setIsEditing(false);
    }
    
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setCurrentGame(null);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing && currentGame) {
      dispatch(updateGame({ 
        gameId: currentGame._id, 
        gameData: formData 
      }))
        .then(() => {
          handleCloseForm();
        });
    } else {
      dispatch(createGame(formData))
        .then(() => {
          handleCloseForm();
        });
    }
  };
  
  const renderGameForm = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-casino-primary rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Game' : 'Add New Game'}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-400 hover:text-white"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-400">
                  Game Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-400">
                  Game Type*
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="slots">Slots</option>
                  <option value="blackjack">Blackjack</option>
                  <option value="roulette">Roulette</option>
                  <option value="poker">Poker</option>
                  <option value="baccarat">Baccarat</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-400">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input h-24 resize-none"
                  placeholder="Enter game description"
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="rules" className="block mb-2 text-sm font-medium text-gray-400">
                  Rules
                </label>
                <textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  className="form-input h-24 resize-none"
                  placeholder="Enter game rules"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="minBet" className="block mb-2 text-sm font-medium text-gray-400">
                  Minimum Bet*
                </label>
                <input
                  type="number"
                  id="minBet"
                  name="minBet"
                  value={formData.minBet}
                  onChange={handleChange}
                  className="form-input"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="maxBet" className="block mb-2 text-sm font-medium text-gray-400">
                  Maximum Bet*
                </label>
                <input
                  type="number"
                  id="maxBet"
                  name="maxBet"
                  value={formData.maxBet}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="houseEdge" className="block mb-2 text-sm font-medium text-gray-400">
                  House Edge %*
                </label>
                <input
                  type="number"
                  id="houseEdge"
                  name="houseEdge"
                  value={formData.houseEdge}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  max="100"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-400">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-casino-secondary focus:ring-casino-secondary"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-white">
                    Active (available to users)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCloseForm}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {isEditing ? 'Update Game' : 'Add Game'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Management</h1>
          <p className="text-gray-400">Manage available games and settings</p>
        </div>
        
        <button
          onClick={() => handleOpenForm()}
          className="btn btn-primary"
        >
          Add New Game
        </button>
      </div>
      
      <div className="bg-casino-primary rounded-lg shadow-lg p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-secondary"></div>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No games found</p>
            <button
              onClick={() => handleOpenForm()}
              className="mt-4 btn btn-primary"
            >
              Add Your First Game
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Game
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bet Range
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    House Edge
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {games.map((game) => (
                  <tr key={game._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-700 flex items-center justify-center overflow-hidden">
                          {game.image ? (
                            <img src={game.image} alt={game.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xl text-white">{game.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{game.name}</div>
                          <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                            {game.description || 'No description available'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white capitalize">
                      {game.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ${game.minBet} - ${game.maxBet}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {game.houseEdge}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        game.isActive ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                      }`}>
                        {game.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {format(new Date(game.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleOpenForm(game)}
                        className="text-casino-secondary hover:text-casino-accent"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {isFormOpen && renderGameForm()}
    </div>
  );
};

export default AdminGamesPage;