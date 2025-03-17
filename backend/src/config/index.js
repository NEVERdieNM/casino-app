module.exports = {
    jwt: {
      secret: process.env.JWT_SECRET || 'your-default-jwt-secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    },
    db: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/casino-app'
    },
    bcrypt: {
      saltRounds: 10
    }
  };