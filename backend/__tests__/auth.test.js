const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/index');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../src/config');

// Mock the MongoDB connection
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(actualMongoose),
  };
});

// Before all tests
beforeAll(async () => {
  // Clear the users collection
  await User.deleteMany({});
});

// After all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication API', () => {
  let token;
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123',
    firstName: 'Test',
    lastName: 'User',
    birthDate: '1990-01-01'
  };
  
  // Test registration
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user).toHaveProperty('username', testUser.username);
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
      expect(res.body.data).toHaveProperty('token');
      
      token = res.body.data.token;
    });
    
    it('should not register a user with existing username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);
      
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('already exists');
    });
    
    it('should not register a user without required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'Password123'
          // Missing username
        })
        .expect(400);
      
      expect(res.body.status).toBe('error');
    });
  });
  
  // Test login
  describe('POST /api/auth/login', () => {
    it('should login a registered user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        })
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user).toHaveProperty('username', testUser.username);
      expect(res.body.data).toHaveProperty('token');
    });
    
    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'WrongPassword'
        })
        .expect(401);
      
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid credentials');
    });
    
    it('should not login with non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'Password123'
        })
        .expect(401);
      
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid credentials');
    });
  });
  
  // Test authentication middleware
  describe('Auth Middleware', () => {
    it('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toHaveProperty('username', testUser.username);
    });
    
    it('should reject access without token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);
      
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('No token provided');
    });
    
    it('should reject access with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
      
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid token');
    });
  });
});