import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="relative py-16 bg-casino-dark rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-casino-pattern opacity-10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Welcome to <span className="text-casino-accent">LuxeCasino</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Experience the thrill of casino games from the comfort of your home.
            Enjoy our selection of slots, table games, and more!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/games" className="btn btn-primary text-lg px-8 py-3">
                Play Now
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary text-lg px-8 py-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-outline text-lg px-8 py-3">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Game categories */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Slots */}
          <div className="bg-casino-primary rounded-lg overflow-hidden shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="h-48 bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Slots</h3>
              <p className="text-gray-400 mb-4">
                Try your luck on our exciting slot machines with different themes and features.
              </p>
              <Link to="/games" className="text-casino-secondary hover:text-casino-accent transition-colors">
                View Slots →
              </Link>
            </div>
          </div>

          {/* Blackjack */}
          <div className="bg-casino-primary rounded-lg overflow-hidden shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="h-48 bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
                <path d="M7 9h2m4 0h4M7 13h4m4 0h2" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Blackjack</h3>
              <p className="text-gray-400 mb-4">
                Test your skills in the classic card game of blackjack. Will you beat the dealer?
              </p>
              <Link to="/games" className="text-casino-secondary hover:text-casino-accent transition-colors">
                Play Blackjack →
              </Link>
            </div>
          </div>

          {/* Roulette */}
          <div className="bg-casino-primary rounded-lg overflow-hidden shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="h-48 bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <circle cx="12" cy="12" r="6" strokeWidth="2" />
                <circle cx="12" cy="12" r="2" strokeWidth="2" />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Roulette</h3>
              <p className="text-gray-400 mb-4">
                Place your bets and watch the wheel spin in this exciting game of chance.
              </p>
              <Link to="/games" className="text-casino-secondary hover:text-casino-accent transition-colors">
                Play Roulette →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-casino-primary p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-casino-secondary p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Secure Platform</h3>
            </div>
            <p className="text-gray-400">
              We use the latest security measures to protect your data and ensure fair gaming.
            </p>
          </div>

          <div className="bg-casino-primary p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-casino-secondary p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Easy Transactions</h3>
            </div>
            <p className="text-gray-400">
              Quick and convenient deposit and withdrawal options to manage your funds.
            </p>
          </div>

          <div className="bg-casino-primary p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-casino-secondary p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Responsible Gaming</h3>
            </div>
            <p className="text-gray-400">
              We promote responsible gaming with tools to help you stay in control of your play.
            </p>
          </div>

          <div className="bg-casino-primary p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-casino-secondary p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Wide Game Selection</h3>
            </div>
            <p className="text-gray-400">
              Choose from a variety of games to suit every preference and playing style.
            </p>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="text-center py-12 bg-casino-primary rounded-lg">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Playing?</h2>
        <p className="text-xl text-gray-300 mb-8">
          Join now and get started with your casino adventure!
        </p>
        {isAuthenticated ? (
          <Link to="/games" className="btn btn-primary text-lg px-8 py-3">
            Browse Games
          </Link>
        ) : (
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Create Free Account
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;