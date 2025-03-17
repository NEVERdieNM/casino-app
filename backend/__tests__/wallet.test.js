const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/index');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../src/config');

// Before all tests
beforeAll(async () => {
  // Create a test user for wallet operations
  const user = new User({
    username: 'walletuser',
    email: 'wallet@example.com',
    passwordHash: await bcrypt.hash('Password123', 10),
    firstName: 'Wallet',
    lastName: 'User',
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
});

// After all tests
afterAll(async () => {
  await User.deleteMany({});
  await Transaction.deleteMany({});
  await mongoose.connection.close();
});

describe('Wallet API', () => {
  // Test get balance
  describe('GET /api/wallet/balance', () => {
    it('should get user balance', async () => {
      const res = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('balance', 1000);
      expect(res.body.data).toHaveProperty('currency', 'USD');
    });
    
    it('should not get balance without authentication', async () => {
      const res = await request(app)
        .get('/api/wallet/balance')
        .expect(401);
      
      expect(res.body.status).toBe('error');
    });
  });
  
  // Test deposit
  describe('POST /api/wallet/deposit', () => {
    it('should deposit funds', async () => {
      const res = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ amount: 500 })
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data.transaction).toHaveProperty('type', 'deposit');
      expect(res.body.data.transaction).toHaveProperty('amount', 500);
      expect(res.body.data).toHaveProperty('balance', 1500);
      
      // Verify the user's balance was updated in the database
      const user = await User.findById(testUserId);
      expect(user.wallet.balance).toBe(1500);
      
      // Verify transaction was created
      const transaction = await Transaction.findOne({ 
        userId: testUserId, 
        type: 'deposit',
        amount: 500
      });
      expect(transaction).toBeTruthy();
    });
    
    it('should not deposit invalid amount', async () => {
      const res = await request(app)
        .post('/api/wallet/deposit')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ amount: -100 })
        .expect(400);
      
      expect(res.body.status).toBe('error');
    });
  });
  
  // Test withdraw
  describe('POST /api/wallet/withdraw', () => {
    it('should withdraw funds', async () => {
      const res = await request(app)
        .post('/api/wallet/withdraw')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ amount: 300 })
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data.transaction).toHaveProperty('type', 'withdrawal');
      expect(res.body.data.transaction).toHaveProperty('amount', 300);
      expect(res.body.data).toHaveProperty('balance', 1200);
      
      // Verify the user's balance was updated in the database
      const user = await User.findById(testUserId);
      expect(user.wallet.balance).toBe(1200);
    });
    
    it('should not withdraw more than balance', async () => {
      const res = await request(app)
        .post('/api/wallet/withdraw')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ amount: 2000 })
        .expect(400);
      
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Insufficient funds');
    });
  });
  
  // Test get transactions
  describe('GET /api/wallet/transactions', () => {
    it('should get user transactions', async () => {
      const res = await request(app)
        .get('/api/wallet/transactions')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('transactions');
      expect(Array.isArray(res.body.data.transactions)).toBe(true);
      expect(res.body.data.transactions.length).toBe(2); // Deposit and withdrawal
    });
    
    it('should filter transactions by type', async () => {
      const res = await request(app)
        .get('/api/wallet/transactions?type=deposit')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data.transactions.length).toBe(1);
      expect(res.body.data.transactions[0].type).toBe('deposit');
    });
  });
});