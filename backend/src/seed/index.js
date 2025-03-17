const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');
const Game = require('../models/Game');
const Transaction = require('../models/Transaction');
const { bcrypt: bcryptConfig } = require('../config');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/casino-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed Users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', bcryptConfig.saltRounds);
    
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      birthDate: new Date('1990-01-01'),
      wallet: {
        balance: 10000,
        currency: 'USD'
      },
      status: 'active',
      role: 'admin',
      lastLogin: new Date()
    });
    
    await admin.save();
    
    // Create regular users
    const regularUserNames = ['alice', 'bob', 'charlie', 'david', 'emma'];
    const userPasswordHash = await bcrypt.hash('password123', bcryptConfig.saltRounds);
    
    const userPromises = regularUserNames.map((username, index) => {
      const user = new User({
        username,
        email: `${username}@example.com`,
        passwordHash: userPasswordHash,
        firstName: username.charAt(0).toUpperCase() + username.slice(1),
        lastName: 'User',
        birthDate: new Date(`199${index}-01-01`),
        wallet: {
          balance: 1000 - (index * 100),
          currency: 'USD'
        },
        status: 'active',
        role: 'user',
        lastLogin: new Date()
      });
      
      return user.save();
    });
    
    await Promise.all(userPromises);
    
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Seed Games
const seedGames = async () => {
  try {
    // Clear existing games
    await Game.deleteMany({});
    
    // Create sample games
    const games = [
      {
        name: 'Classic Slots',
        type: 'slots',
        description: 'A classic 3-reel slot machine with traditional symbols.',
        rules: 'Match three symbols on a payline to win. Different symbols have different payout values.',
        minBet: 1,
        maxBet: 100,
        houseEdge: 5,
        isActive: true,
        image: 'https://via.placeholder.com/300x200?text=Classic+Slots'
      },
      {
        name: 'Fruit Frenzy',
        type: 'slots',
        description: 'A colorful 5-reel slot game with fruit symbols and bonus rounds.',
        rules: 'Match three or more fruit symbols to win. Get three scatter symbols to trigger the bonus round.',
        minBet: 0.5,
        maxBet: 50,
        houseEdge: 4,
        isActive: true,
        image: 'https://via.placeholder.com/300x200?text=Fruit+Frenzy'
      },
      {
        name: 'Blackjack Pro',
        type: 'blackjack',
        description: 'Professional blackjack table with standard rules and high stakes.',
        rules: 'Beat the dealer by getting a card total closer to 21 without going over. Blackjack pays 3:2.',
        minBet: 5,
        maxBet: 500,
        houseEdge: 0.5,
        isActive: true,
        image: 'https://via.placeholder.com/300x200?text=Blackjack+Pro'
      },
      {
        name: 'European Roulette',
        type: 'roulette',
        description: 'Classic European roulette with a single zero pocket.',
        rules: 'Place bets on where the ball will land. European roulette has numbers 0-36.',
        minBet: 1,
        maxBet: 200,
        houseEdge: 2.7,
        isActive: true,
        image: 'https://via.placeholder.com/300x200?text=European+Roulette'
      },
      {
        name: 'American Roulette',
        type: 'roulette',
        description: 'American-style roulette with double zero pocket.',
        rules: 'Place bets on where the ball will land. American roulette has numbers 0, 00, and 1-36.',
        minBet: 1,
        maxBet: 200,
        houseEdge: 5.26,
        isActive: true,
        image: 'https://via.placeholder.com/300x200?text=American+Roulette'
      },
      {
        name: 'Texas Hold\'em',
        type: 'poker',
        description: 'The most popular poker variant with community cards.',
        rules: 'Win by having the best hand or by making all other players fold.',
        minBet: 10,
        maxBet: 1000,
        houseEdge: 3,
        isActive: true,
        image: 'https://via.placeholder.com/300x200?text=Texas+Holdem'
      },
      {
        name: 'Mini Baccarat',
        type: 'baccarat',
        description: 'Simplified version of baccarat with lower stakes.',
        rules: 'Bet on whether the player or banker will have a hand closer to 9.',
        minBet: 5,
        maxBet: 300,
        houseEdge: 1.06,
        isActive: true,
        image: 'https://via.placeholder.com/300x200?text=Mini+Baccarat'
      }
    ];
    
    await Game.insertMany(games);
    
    console.log('Games seeded successfully');
  } catch (error) {
    console.error('Error seeding games:', error);
  }
};

// Seed Transactions
const seedTransactions = async () => {
  try {
    // Clear existing transactions
    await Transaction.deleteMany({});
    
    // Get users and games
    const users = await User.find({});
    const games = await Game.find({});
    
    // Create sample transactions
    const transactions = [];
    
    // Deposits
    users.forEach(user => {
      for (let i = 0; i < 3; i++) {
        const amount = Math.floor(Math.random() * 500) + 100;
        
        transactions.push({
          userId: user._id,
          type: 'deposit',
          amount,
          currency: 'USD',
          status: 'completed',
          completedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        });
      }
    });
    
    // Bets and wins
    users.forEach(user => {
      games.forEach(game => {
        for (let i = 0; i < 5; i++) {
          const betAmount = Math.floor(Math.random() * (game.maxBet/2)) + game.minBet;
          const isWin = Math.random() > 0.6;
          const winAmount = isWin ? betAmount * (1 + Math.random()) : 0;
          
          // Bet transaction
          transactions.push({
            userId: user._id,
            type: 'bet',
            amount: betAmount,
            currency: 'USD',
            gameId: game._id,
            status: 'completed',
            completedAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000)
          });
          
          // Win transaction (if applicable)
          if (isWin) {
            transactions.push({
              userId: user._id,
              type: 'win',
              amount: winAmount,
              currency: 'USD',
              gameId: game._id,
              status: 'completed',
              completedAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000),
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000)
            });
          }
        }
      });
    });
    
    // Add a few withdrawals
    users.forEach(user => {
      if (Math.random() > 0.5) {
        const amount = Math.floor(Math.random() * 300) + 50;
        
        transactions.push({
          userId: user._id,
          type: 'withdrawal',
          amount,
          currency: 'USD',
          status: 'completed',
          completedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
        });
      }
    });
    
    await Transaction.insertMany(transactions);
    
    console.log('Transactions seeded successfully');
  } catch (error) {
    console.error('Error seeding transactions:', error);
  }
};

// Run all seeds
const seedAll = async () => {
  try {
    await seedUsers();
    await seedGames();
    await seedTransactions();
    
    console.log('All data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAll();