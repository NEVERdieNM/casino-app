# Casino Application

A comprehensive, modular casino application with both frontend and backend components.

## Features

- User authentication and account management
- Multiple casino games (slots, blackjack, roulette)
- Wallet system with deposits, withdrawals, and transaction history
- Real-time game updates using Socket.io
- Responsive UI built with React and Tailwind CSS
- Admin dashboard with statistics and management tools

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.IO for real-time features

### Frontend
- React
- Redux for state management
- Tailwind CSS for styling
- Axios for API requests
- React Router for navigation
- Chart.js for visualizations

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/casino-app.git
cd casino-app
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory based on `.env.example`

5. Seed the database with sample data
```
cd ../backend
npm run seed
```

### Running the application

#### Development mode

1. Start the backend server
```
cd backend
npm run dev
```

2. Start the frontend development server
```
cd frontend
npm start
```

#### Production mode (Docker)

```
docker-compose up -d
```

## API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/password` - Change user password

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/activity` - Get user activity

### Wallet Routes
- `GET /api/wallet/balance` - Get user balance
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds
- `GET /api/wallet/transactions` - Get transaction history

### Game Routes
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get specific game details
- `POST /api/games/:id/session` - Start a game session
- `PUT /api/games/:id/session/:sessionId` - Update game state
- `GET /api/games/:id/session/:sessionId` - Get game state

### Admin Routes
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/games` - Get all games
- `POST /api/admin/games` - Create a new game
- `PUT /api/admin/games/:id` - Update a game
- `GET /api/admin/stats` - Get overall statistics

## Testing

To run tests:
```
cd backend
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Icons provided by HeroIcons
- Charts powered by Chart.js
- Socket.IO for real-time capabilities