const Game = require('../models/Game');
const GameSession = require('../models/GameSession');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { NotFoundError, ValidationError } = require('../utils/errors');
const SlotMachine = require('../services/gameLogic/slotMachine');
const BlackjackGame = require('../services/gameLogic/blackjack');
const RouletteGame = require('../services/gameLogic/roulette');

// Get all games
exports.getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find({ isActive: true });
    
    res.status(200).json({
      status: 'success',
      data: {
        games
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get game by ID
exports.getGameById = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      throw new NotFoundError('Game not found');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        game
      }
    });
  } catch (error) {
    next(error);
  }
};

// Start a game session
exports.startGameSession = async (req, res, next) => {
  try {
    const { id: gameId } = req.params;
    const { bet } = req.body;
    const userId = req.user.id;
    
    // Validate game exists
    const game = await Game.findById(gameId);
    if (!game) {
      throw new NotFoundError('Game not found');
    }
    
    // Validate bet amount
    if (!bet || bet < game.minBet || bet > game.maxBet) {
      throw new ValidationError(`Bet must be between ${game.minBet} and ${game.maxBet}`);
    }
    
    // Check if user has enough balance
    const user = await User.findById(userId);
    if (user.wallet.balance < bet) {
      throw new ValidationError('Insufficient funds');
    }
    
    // Create bet transaction
    const transaction = await Transaction.create({
      userId,
      type: 'bet',
      amount: bet,
      currency: user.wallet.currency,
      gameId: game._id,
      status: 'completed',
      completedAt: new Date()
    });
    
    // Update user balance
    user.wallet.balance -= bet;
    await user.save();
    
    // Create game session
    const session = new GameSession({
      userId,
      gameId: game._id,
      startBalance: user.wallet.balance + bet, // Balance before bet
      bets: [{
        amount: bet,
        timestamp: new Date()
      }]
    });
    
    await session.save();
    
    // Initialize game state based on game type
    let gameState = {};
    
    switch (game.type) {
      case 'slots':
        const slotMachine = new SlotMachine();
        gameState = {
          reels: [
            ['?', '?', '?'],
            ['?', '?', '?'],
            ['?', '?', '?']
          ],
          wins: [],
          bet
        };
        break;
        
      case 'blackjack':
        const blackjack = new BlackjackGame();
        blackjack.placeBet(bet);
        gameState = blackjack.getGameState();
        break;
        
      case 'roulette':
        gameState = {
          bets: [],
          result: null,
          bet
        };
        break;
        
      default:
        gameState = { bet };
    }
    
    // Update transaction with session id
    transaction.gameSessionId = session._id;
    await transaction.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        session,
        gameState
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update game session (make a move)
exports.updateGameSession = async (req, res, next) => {
  try {
    const { id: gameId, sessionId } = req.params;
    const { action, ...params } = req.body;
    const userId = req.user.id;
    
    // Validate game exists
    const game = await Game.findById(gameId);
    if (!game) {
      throw new NotFoundError('Game not found');
    }
    
    // Validate session exists and belongs to user
    const session = await GameSession.findOne({
      _id: sessionId,
      userId,
      gameId,
      status: 'active'
    });
    
    if (!session) {
      throw new NotFoundError('Game session not found or already completed');
    }
    
    // Get user for balance operations
    const user = await User.findById(userId);
    
    // Handle game action based on game type
    let gameState = {};
    let winAmount = 0;
    
    switch (game.type) {
      case 'slots':
        if (action === 'spin') {
          const slotMachine = new SlotMachine();
          const result = slotMachine.spin();
          
          // Calculate winnings from all winning lines
          let totalWin = 0;
          if (result.wins.length > 0) {
            result.wins.forEach(win => {
              const winMultiplier = win.multiplier;
              const lineWin = session.bets[0].amount * winMultiplier;
              totalWin += lineWin;
              
              // Add win info to each winning line
              win.amount = lineWin;
            });
          }
          
          winAmount = totalWin;
          gameState = {
            reels: result.reels,
            wins: result.wins,
            bet: session.bets[0].amount,
            winAmount,
            status: 'complete'
          };
        } else if (action === 'collect') {
          session.status = 'completed';
          session.endTime = new Date();
          session.endBalance = user.wallet.balance;
        }
        break;
        
      case 'blackjack':
        const blackjack = new BlackjackGame();
        
        // Recreate game state from session
        blackjack.bet = session.bets[0].amount;
        
        if (action === 'hit') {
          const result = blackjack.hit();
          gameState = result;
          
          if (result.outcome) {
            winAmount = result.winnings;
            session.status = 'completed';
            session.endTime = new Date();
            session.endBalance = user.wallet.balance + winAmount;
          }
        } else if (action === 'stand') {
          const result = blackjack.stand();
          gameState = result;
          winAmount = result.winnings;
          
          session.status = 'completed';
          session.endTime = new Date();
          session.endBalance = user.wallet.balance + winAmount;
        } else if (action === 'newGame') {
          // Start a new game session instead of updating this one
          return await this.startGameSession(req, res, next);
        }
        break;
        
      case 'roulette':
        if (action === 'spin') {
          const roulette = new RouletteGame();
          const result = roulette.spin();
          
          // Calculate winnings
          const bets = params.bets || [];
          winAmount = roulette.calculateWinnings(bets, result);
          
          gameState = {
            result,
            bets,
            winnings: winAmount,
            bet: session.bets[0].amount
          };
          
          session.status = 'completed';
          session.endTime = new Date();
          session.endBalance = user.wallet.balance + winAmount;
        }
        break;
        
      default:
        throw new ValidationError('Invalid game action');
    }
    
    // Update session
    session.bets[0].outcome = gameState;
    await session.save();
    
    // Handle winnings if any
    if (winAmount > 0) {
      // Create win transaction
      await Transaction.create({
        userId,
        type: 'win',
        amount: winAmount,
        currency: user.wallet.currency,
        gameId: game._id,
        gameSessionId: session._id,
        status: 'completed',
        completedAt: new Date()
      });
      
      // Update user balance
      user.wallet.balance += winAmount;
      await user.save();
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        session: session.status === 'completed' ? session : undefined,
        gameState
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get game session
exports.getGameSession = async (req, res, next) => {
  try {
    const { id: gameId, sessionId } = req.params;
    const userId = req.user.id;
    
    // Validate session exists and belongs to user
    const session = await GameSession.findOne({
      _id: sessionId,
      userId,
      gameId
    });
    
    if (!session) {
      throw new NotFoundError('Game session not found');
    }
    
    // Get the game state from the latest bet outcome
    const gameState = session.bets.length > 0 ? session.bets[0].outcome : {};
    
    res.status(200).json({
      status: 'success',
      data: {
        session,
        gameState
      }
    });
  } catch (error) {
    next(error);
  }
};