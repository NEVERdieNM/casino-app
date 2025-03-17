import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-casino-primary py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and about */}
          <div>
            <Link to="/" className="text-xl font-bold text-casino-accent">LuxeCasino</Link>
            <p className="mt-2 text-gray-400 text-sm">
              Experience the thrill of a real casino from the comfort of your home.
              Play responsibly and enjoy our wide selection of games.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-medium mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/games" className="text-gray-400 hover:text-casino-secondary transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="text-gray-400 hover:text-casino-secondary transition-colors">
                  Wallet
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-casino-secondary transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Responsible gaming */}
          <div>
            <h3 className="text-white font-medium mb-2">Responsible Gaming</h3>
            <p className="text-gray-400 text-sm">
              We promote responsible gaming. Set limits, take breaks, and never
              chase losses. Gambling should be fun and entertaining.
            </p>
            <div className="mt-2">
              <a href="#" className="text-casino-secondary text-sm hover:underline">
                Responsible Gaming Policy
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} LuxeCasino. All rights reserved. 
            This is a demo project and does not involve real money gambling.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;