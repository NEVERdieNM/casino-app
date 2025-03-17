import React, { useState, useEffect } from 'react';

const RouletteGame = ({ game, session, gameState, onAction, balance }) => {
  const [selectedBets, setSelectedBets] = useState([]);
  const [currentBetType, setCurrentBetType] = useState('straight');
  const [currentBetAmount, setCurrentBetAmount] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    if (gameState && gameState.result) {
      setSpinning(false);
      setResult(gameState.result);
    }
  }, [gameState]);
  
  const handleBetTypeChange = (e) => {
    setCurrentBetType(e.target.value);
  };
  
  const handleBetAmountChange = (e) => {
    setCurrentBetAmount(parseInt(e.target.value));
  };
  
  const addBet = (betData) => {
    const newBet = {
      id: Date.now(),
      type: currentBetType,
      amount: currentBetAmount,
      ...betData
    };
    
    setSelectedBets([...selectedBets, newBet]);
  };
  
  const removeBet = (id) => {
    setSelectedBets(selectedBets.filter(bet => bet.id !== id));
  };
  
  const clearBets = () => {
    setSelectedBets([]);
  };
  
  const handleSpin = () => {
    if (selectedBets.length === 0) return;
    
    setSpinning(true);
    onAction('spin', { bets: selectedBets });
  };
  
  // Render roulette wheel
  const renderRouletteWheel = () => {
    if (!result) {
      return (
        <div className="w-64 h-64 rounded-full bg-casino-green-dark border-8 border-gray-800 flex items-center justify-center">
          <div className="w-56 h-56 rounded-full bg-casino-green flex items-center justify-center">
            <div className="text-4xl font-bold text-white">?</div>
          </div>
        </div>
      );
    }
    
    const colorClass = 
      result.color === 'red' ? 'bg-red-600' : 
      result.color === 'black' ? 'bg-black' : 
      'bg-green-600';
    
    return (
      <div className="w-64 h-64 rounded-full bg-casino-green-dark border-8 border-gray-800 flex items-center justify-center">
        <div className="w-56 h-56 rounded-full bg-casino-green flex items-center justify-center">
          <div className={`w-20 h-20 rounded-full ${colorClass} flex items-center justify-center`}>
            <div className="text-4xl font-bold text-white">{result.number}</div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render bet options
  const renderBetOptions = () => {
    const betTypes = [
      { value: 'straight', label: 'Straight (35:1)' },
      { value: 'split', label: 'Split (17:1)' },
      { value: 'corner', label: 'Corner (8:1)' },
      { value: 'dozen', label: 'Dozen (2:1)' },
      { value: 'column', label: 'Column (2:1)' },
      { value: 'red', label: 'Red (1:1)' },
      { value: 'black', label: 'Black (1:1)' },
      { value: 'even', label: 'Even (1:1)' },
      { value: 'odd', label: 'Odd (1:1)' },
      { value: 'low', label: '1-18 (1:1)' },
      { value: 'high', label: '19-36 (1:1)' }
    ];
    
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Bet Type
        </label>
        <select
          value={currentBetType}
          onChange={handleBetTypeChange}
          className="form-input"
          disabled={spinning}
        >
          {betTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
    );
  };
  
  // Render the betting board
  const renderBettingBoard = () => {
    const renderNumberButton = (number) => {
      const colorClass = 
        number === 0 ? 'bg-green-600' :
        number % 2 === 0 ? 'bg-black' : 'bg-red-600';
      
      return (
        <button
          key={number}
          onClick={() => addBet({ number })}
          className={`w-10 h-10 ${colorClass} text-white font-bold rounded-full flex items-center justify-center hover:opacity-80 focus:outline-none`}
          disabled={spinning}
        >
          {number}
        </button>
      );
    };
    
    // Generate numbers grid
    const numbers = [];
    for (let i = 0; i <= 36; i++) {
      numbers.push(renderNumberButton(i));
    }
    
    // Special bets
    const renderSpecialBet = (type, label) => (
      <button
        onClick={() => addBet({ type })}
        className="bg-casino-green-dark text-white px-4 py-2 rounded-md hover:bg-casino-green-light focus:outline-none"
        disabled={spinning}
      >
        {label}
      </button>
    );
    
    return (
      <div className="mb-8">
        <div className="grid grid-cols-6 gap-2 mb-4">
          {numbers}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {renderSpecialBet('red', 'Red')}
            {renderSpecialBet('black', 'Black')}
            {renderSpecialBet('odd', 'Odd')}
            {renderSpecialBet('even', 'Even')}
          </div>
          <div className="space-y-2">
            {renderSpecialBet('low', '1-18')}
            {renderSpecialBet('high', '19-36')}
            {renderSpecialBet('dozen1', '1st Dozen (1-12)')}
            {renderSpecialBet('dozen2', '2nd Dozen (13-24)')}
            {renderSpecialBet('dozen3', '3rd Dozen (25-36)')}
          </div>
        </div>
      </div>
    );
  };
  
  // Render selected bets
  const renderSelectedBets = () => {
    if (selectedBets.length === 0) {
      return (
        <div className="text-center text-gray-400 py-4">
          Place your bets by selecting options above
        </div>
      );
    }
    
    return (
      <div className="max-h-48 overflow-y-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-sm text-gray-400">Bet Type</th>
              <th className="text-left text-sm text-gray-400">Details</th>
              <th className="text-right text-sm text-gray-400">Amount</th>
              <th className="text-right text-sm text-gray-400"></th>
            </tr>
          </thead>
          <tbody>
            {selectedBets.map(bet => (
              <tr key={bet.id} className="border-t border-gray-700">
                <td className="py-2 text-white capitalize">{bet.type}</td>
                <td className="py-2 text-white">
                  {bet.number !== undefined && `Number ${bet.number}`}
                  {bet.type === 'red' && 'Red'}
                  {bet.type === 'black' && 'Black'}
                  {bet.type === 'odd' && 'Odd'}
                  {bet.type === 'even' && 'Even'}
                  {bet.type === 'low' && '1-18'}
                  {bet.type === 'high' && '19-36'}
                  {bet.type === 'dozen1' && '1st Dozen'}
                  {bet.type === 'dozen2' && '2nd Dozen'}
                  {bet.type === 'dozen3' && '3rd Dozen'}
                </td>
                <td className="py-2 text-white text-right">${bet.amount}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => removeBet(bet.id)}
                    className="text-red-500 hover:text-red-400"
                    disabled={spinning}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render result details
  const renderResultDetails = () => {
    if (!result) return null;
    
    return (
      <div className="mt-4 text-center">
        <div className="text-xl font-bold text-white">
          Result: {result.number} {result.color === 'red' ? '🔴' : result.color === 'black' ? '⚫' : '🟢'}
        </div>
        
        {gameState.winnings > 0 ? (
          <div className="text-xl font-bold text-casino-success mt-2">
            You won ${gameState.winnings.toFixed(2)}!
          </div>
        ) : (
          <div className="text-gray-400 mt-2">No win this time</div>
        )}
      </div>
    );
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Roulette</h2>
          <p className="text-gray-400">Place your bets and try your luck!</p>
        </div>
        
        <div className="flex justify-center mb-8">
          {renderRouletteWheel()}
        </div>
        
        {renderResultDetails()}
      </div>
      
      <div>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <span className="text-gray-400 text-sm">Balance:</span>
            <span className="text-white font-bold ml-2">${balance.toFixed(2)}</span>
          </div>
          <div>
            <label className="text-gray-400 text-sm mr-2">Bet Amount:</label>
            <select
              value={currentBetAmount}
              onChange={handleBetAmountChange}
              className="form-input w-24"
              disabled={spinning}
            >
              {[1, 5, 10, 25, 50, 100].map(amount => (
                <option key={amount} value={amount}>${amount}</option>
              ))}
            </select>
          </div>
        </div>
        
        {renderBetOptions()}
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">Selected Bets</h3>
            <button
              onClick={clearBets}
              className="text-sm text-casino-danger hover:text-red-400"
              disabled={spinning || selectedBets.length === 0}
            >
              Clear All
            </button>
          </div>
          
          {renderSelectedBets()}
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="text-gray-400 text-sm">Total Bet:</span>
              <span className="text-white font-bold ml-2">
                ${selectedBets.reduce((total, bet) => total + bet.amount, 0)}
              </span>
            </div>
            
            <button
              onClick={handleSpin}
              disabled={spinning || selectedBets.length === 0}
              className={`btn btn-primary ${spinning || selectedBets.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {spinning ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Spinning...
                </div>
              ) : (
                'Spin'
              )}
            </button>
          </div>
        </div>
        
        {renderBettingBoard()}
      </div>
    </div>
  );
};

export default RouletteGame;