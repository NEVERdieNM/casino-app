import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGameById } from '../store/slices/gamesSlice';
import {
  startGameSession,
  updateGameSession,
  getGameSession,
  clearCurrentSession
} from '../store/slices/gameSessionSlice';
import { getBalance } from '../store/slices/walletSlice';
import { joinGame, leaveGame } from '../services/socketService';
import SlotMachineGame from '../components/games/SlotMachineGame';
import BlackjackGame from '../components/games/BlackjackGame';
import RouletteGame from '../components/games/RouletteGame';

const GamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGame } = useSelector(state => state.games);
  const { currentSession, gameState } = useSelector(state => state.gameSession);
  const { balance } = useSelector(state => state.wallet);
  const [betAmount, setBetAmount] = useState(1);
  
  // Load game data and user balance
  useEffect(() => {
    dispatch(getGameById(id));
    dispatch(getBalance());
    
    // Join the socket room for this game
    joinGame(id);
    
    // Cleanup on component unmount
    return () => {
      dispatch(clearCurrentSession());
      leaveGame(id);
    };
  }, [dispatch, id]);
  
  const handleBetChange = (e) => {
    const value = parseInt(e.target.value);
    setBetAmount(value);
  };
  
  const handleStartGame = () => {
    if (betAmount < currentGame.minBet || betAmount > currentGame.maxBet) {
      return;
    }
    
    dispatch(startGameSession({ gameId: id, bet: betAmount }));
  };
  
  const handleGameAction = (action, params = {}) => {
    if (currentSession) {
      dispatch(updateGameSession({
        gameId: id,
        sessionId: currentSession._id,
        action,
        params
      }));
    }
  };
  
  // Render appropriate game component based on game type
  const renderGameComponent = () => {
    if (!currentGame) return null;
    
    switch (currentGame.type) {
      case 'slots':
        return (
          <SlotMachineGame
            game={currentGame}
            session={currentSession}
            gameState={gameState}
            onAction={handleGameAction}
            balance={balance}
          />
        );
      case 'blackjack':
        return (
          <BlackjackGame
            game={currentGame}
            session={currentSession}
            gameState={gameState}
            onAction={handleGameAction}
            balance={balance}
          />
        );
      case 'roulette':
        return (
          <RouletteGame
            game={currentGame}
            session={currentSession}
            gameState={gameState}
            onAction={handleGameAction}
            balance={balance}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">Game type not supported yet.</p>
          </div>
        );
    }
  };
  
  if (!currentGame) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-secondary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{currentGame.name}</h1>
          <p className="text-gray-400">{currentGame.description}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <button
            onClick={() => navigate('/games')}
            className="btn btn-outline"
          >
            Back to Games
          </button>
        </div>
      </div>
      
      <div className="casino-table mb-8">
        {!currentSession ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Place Your Bet</h2>
            <div className="max-w-xs mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bet Amount
                </label>
                <input
                  type="range"
                  min={currentGame.minBet}
                  max={Math.min(currentGame.maxBet, balance)}
                  value={betAmount}
                  onChange={handleBetChange}
                  className="w-full"
                  disabled={balance < currentGame.minBet}
                />
                <div className="flex justify-between mt-1 text-sm text-gray-400">
                  <span>${currentGame.minBet}</span>
                  <span>${betAmount}</span>
                  <span>${Math.min(currentGame.maxBet, balance)}</span>
                </div>
              </div>
              
              <button
                onClick={handleStartGame}
                className="btn btn-primary w-full"
                disabled={balance < currentGame.minBet}
              >
                {balance < currentGame.minBet
                  ? 'Insufficient Balance'
                  : `Start Game with $${betAmount} Bet`}
              </button>
              
              {balance < currentGame.minBet && (
                <p className="mt-2 text-sm text-yellow-400">
                  You need at least ${currentGame.minBet} to play this game.{' '}
                  <button
                    onClick={() => navigate('/wallet')}
                    className="text-casino-secondary hover:text-casino-accent"
                  >
                    Deposit Funds
                  </button>
                </p>
              )}
            </div>
          </div>
        ) : (
          renderGameComponent()
        )}
      </div>
      
      <div className="bg-casino-primary rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Game Rules</h2>
        <div className="prose prose-invert max-w-none">
          <p>{currentGame.rules || 'No specific rules provided for this game.'}</p>
        </div>
      </div>
    </div>
  );
};

export default GamePage;