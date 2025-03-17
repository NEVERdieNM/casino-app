import React, { useState, useEffect } from 'react';

const BlackjackGame = ({ game, session, gameState, onAction, balance }) => {
  const [outcome, setOutcome] = useState(null);
  
  useEffect(() => {
    if (gameState && gameState.outcome) {
      setOutcome(gameState.outcome);
    } else {
      setOutcome(null);
    }
  }, [gameState]);
  
  const renderCard = (card, hidden = false) => {
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-card-pattern rounded-md border border-gray-600 flex items-center justify-center">
          <div className="w-12 h-20 bg-gray-700 rounded"></div>
        </div>
      );
    }
    
    const color = card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-white';
    
    return (
      <div className="w-16 h-24 bg-white rounded-md shadow flex flex-col items-center justify-between p-1">
        <div className={`text-sm font-bold ${color} self-start`}>{card.value}</div>
        <div className={`text-2xl ${color}`}>{card.suit}</div>
        <div className={`text-sm font-bold ${color} self-end transform rotate-180`}>{card.value}</div>
      </div>
    );
  };
  
  const renderPlayerHand = () => {
    if (!gameState || !gameState.playerHand) {
      return null;
    }
    
    return (
      <div>
        <div className="flex space-x-2 mb-2">
          {gameState.playerHand.map((card, index) => renderCard(card))}
        </div>
        <div className="text-center text-white font-bold">
          Value: {gameState.playerValue}
        </div>
      </div>
    );
  };
  
  const renderDealerHand = () => {
    if (!gameState || !gameState.dealerHand) {
      return null;
    }
    
    return (
      <div>
        <div className="flex space-x-2 mb-2">
          {gameState.dealerHand.map((card, index) => 
            renderCard(card, card.hidden)
          )}
        </div>
        <div className="text-center text-white font-bold">
          Value: {gameState.dealerValue}
        </div>
      </div>
    );
  };
  
  const renderOutcome = () => {
    if (!outcome) return null;
    
    let message = '';
    let colorClass = '';
    
    switch (outcome) {
      case 'player-bust':
        message = 'Bust! Your hand exceeded 21.';
        colorClass = 'text-casino-danger';
        break;
      case 'dealer-bust':
        message = 'Dealer busts! You win!';
        colorClass = 'text-casino-success';
        break;
      case 'blackjack':
        message = 'Blackjack! You win!';
        colorClass = 'text-casino-success';
        break;
      case 'player-win':
        message = 'You win!';
        colorClass = 'text-casino-success';
        break;
      case 'dealer-win':
        message = 'Dealer wins.';
        colorClass = 'text-casino-danger';
        break;
      case 'push':
        message = 'Push. It\'s a tie!';
        colorClass = 'text-gray-400';
        break;
      default:
        return null;
    }
    
    return (
      <div className={`mt-4 text-center text-xl font-bold ${colorClass}`}>
        {message}
        {gameState.winnings > 0 && (
          <div className="text-casino-success">You won ${gameState.winnings.toFixed(2)}!</div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Blackjack</h2>
        <p className="text-gray-400">Beat the dealer without going over 21</p>
      </div>
      
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <div className="text-gray-400 mb-2">Dealer's Hand</div>
          {renderDealerHand()}
        </div>
        
        <div className="mb-8">
          <div className="text-gray-400 mb-2">Your Hand</div>
          {renderPlayerHand()}
        </div>
        
        {renderOutcome()}
        
        <div className="mt-8">
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
          
          {gameState && gameState.gameStatus === 'playing' ? (
            <div className="flex space-x-4">
              <button
                onClick={() => onAction('hit')}
                className="btn btn-primary flex-1"
              >
                Hit
              </button>
              <button
                onClick={() => onAction('stand')}
                className="btn btn-outline flex-1"
              >
                Stand
              </button>
            </div>
          ) : gameState && gameState.gameStatus === 'complete' ? (
            <button
              onClick={() => onAction('newGame')}
              className="btn btn-primary w-full"
              disabled={balance < session.bet}
            >
              {balance < session.bet ? 'Insufficient Balance' : 'Play Again'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;