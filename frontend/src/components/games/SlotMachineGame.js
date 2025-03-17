import React, { useState, useEffect } from 'react';

const SlotMachineGame = ({ game, session, gameState, onAction, balance }) => {
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(null);
  
  useEffect(() => {
    if (gameState && gameState.status === 'complete') {
      setSpinning(false);
      
      if (gameState.wins && gameState.wins.length > 0) {
        const totalWin = gameState.wins.reduce((total, win) => total + (win.amount || 0), 0);
        setWin(totalWin);
      } else {
        setWin(0);
      }
    }
  }, [gameState]);
  
  const handleSpin = () => {
    setSpinning(true);
    setWin(null);
    onAction('spin');
  };
  
  // Render slot machine reels
  const renderReels = () => {
    if (!gameState || !gameState.reels) {
      return (
        <div className="flex justify-center space-x-4 h-64">
          {[0, 1, 2].map((reel) => (
            <div key={reel} className="w-24 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-5xl">?</div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="flex justify-center space-x-4">
        {gameState.reels.map((reel, reelIndex) => (
          <div key={reelIndex} className="w-24 bg-gray-800 rounded-lg">
            {reel.map((symbol, symbolIndex) => (
              <div 
                key={symbolIndex} 
                className="h-24 flex items-center justify-center text-5xl"
              >
                {symbol}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  // Render win lines
  const renderWinLines = () => {
    if (!gameState || !gameState.wins || gameState.wins.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-4">
        <h3 className="text-xl font-bold text-casino-accent mb-2">Winning Lines</h3>
        <div className="space-y-2">
          {gameState.wins.map((win, index) => (
            <div key={index} className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-casino-accent flex items-center justify-center mr-2">
                {index + 1}
              </div>
              <div className="text-white">
                Line {win.payLine}: {win.symbols.join(' ')} - x{win.multiplier} Multiplier
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Slot Machine</h2>
        <p className="text-gray-400">Match symbols across paylines to win!</p>
      </div>
      
      {renderReels()}
      
      {renderWinLines()}
      
      <div className="mt-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-gray-400 text-sm">Bet:</span>
            <span className="text-white font-bold ml-2">${session.bet}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Balance:</span>
            <span className="text-white font-bold ml-2">${balance.toFixed(2)}</span>
          </div>
        </div>
        
        {win !== null && (
          <div className={`mb-4 text-center text-xl font-bold ${win > 0 ? 'text-casino-success' : 'text-gray-400'}`}>
            {win > 0 ? `You won $${win.toFixed(2)}!` : 'No win this time'}
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            onClick={handleSpin}
            disabled={spinning || balance < session.bet}
            className={`btn btn-primary w-full py-3 ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {spinning ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Spinning...
              </div>
            ) : (
              'Spin'
            )}
          </button>
          
          <button
            onClick={() => onAction('collect')}
            className="btn btn-outline w-1/3"
          >
            Collect
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotMachineGame;