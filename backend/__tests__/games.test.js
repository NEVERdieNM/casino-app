const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/index');
const User = require('../src/models/User');
const Game = require('../src/models/Game');
const GameSession = require('../src/models/GameSession');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../src/config');

// Before all tests
beforeAll(async () => {
  // Create test user
  const user = new User({
    username: 'gameuser',
    email: 'game@example.com',
    passwordHash: await bcrypt.hash('Password123', 10),
    wallet: {
      balance: 1000,
      currency: 'USD'
    },
    status: 'active',
    role: 'user'
  });
  
  await user.save();
  
  // Generate token for this user
  testUserId = user._id;
  testToken = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
  
  // Create test game
  const game = new Game({
    name: 'Test Slots',
    type: 'slots',
    description: 'A test slot machine',
    minBet: 5,
    maxBet: 100,
    houseEdge: 5,
    isActive: true
  });
  
  await game.save();
  testGameId = game._id;
});

// After all tests
afterAll(async () => {
  await User.deleteMany({});
  await Game.deleteMany({});
  await GameSession.deleteMany({});
  await mongoose.connection.close();
});

describe('Games API', () => {
  // Test get all games
  describe('GET /api/games', () => {
    it('should get all games', async () => {
      const res = await request(app)
        .get('/api/games')
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('games');
      expect(Array.isArray(res.body.data.games)).toBe(true);
      expect(res.body.data.games.length).toBeGreaterThan(0);
    });
  });
  
  // Test get game by ID
  describe('GET /api/games/:id', () => {
    it('should get game by ID', async () => {
      const res = await request(app)
        .get(`/api/games/${testGameId}`)
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('game');
      expect(res.body.data.game).toHaveProperty('_id', testGameId.toString());
      expect(res.body.data.game).toHaveProperty('name', 'Test Slots');
    });
    
    it('should return error for invalid game ID', async () => {
      const res = await request(app)
        .get('/api/games/invalidid')
        .expect(400);
      
      expect(res.body.status).toBe('error');
    });
  });
  
  // Test game session
  describe('Game Session', () => {
    let sessionId;
    
    it('should start a game session', async () => {
      const res = await request(app)
        .post(`/api/games/${testGameId}/session`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ bet: 10 })
        .expect(201);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('session');
      expect(res.body.data.session).toHaveProperty('userId', testUserId.toString());
      expect(res.body.data.session).toHaveProperty('gameId', testGameId.toString());
      expect(res.body.data.session).toHaveProperty('bet', 10);
      
      sessionId = res.body.data.session._id;
      
      // Verify user balance was updated
      const user = await User.findById(testUserId);
      expect(user.wallet.balance).toBe(990); // 1000 - 10
    });
    
    it('should get game session', async () => {
      const res = await request(app)
        .get(`/api/games/${testGameId}/session/${sessionId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('session');
      expect(res.body.data.session).toHaveProperty('_id', sessionId);
    });
    
    it('should update game session', async () => {
      const res = await request(app)
        .put(`/api/games/${testGameId}/session/${sessionId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          action: 'spin',
          bet: 10
        })
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('gameState');
      expect(res.body.data.gameState).toHaveProperty('reels');
    });
  });
});