import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  HomeIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { balance, currency } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-casino-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-casino-accent">LuxeCasino</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-casino-secondary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/games"
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-casino-secondary transition-colors"
              >
                Games
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-casino-secondary transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/wallet"
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-casino-secondary transition-colors flex items-center"
                  >
                    <span className="mr-2">Wallet</span>
                    <span className="bg-casino-secondary rounded-full px-2 py-1 text-xs">
                      {currency} {balance.toFixed(2)}
                    </span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-casino-secondary transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-casino-danger transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-casino-secondary transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-casino-secondary text-white hover:bg-opacity-90 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            {isAuthenticated && (
              <Link
                to="/wallet"
                className="mr-4 px-2 py-1 rounded-md text-sm font-medium text-white bg-casino-secondary flex items-center"
              >
                <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                <span>{currency} {balance.toFixed(2)}</span>
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-casino-secondary focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-casino-primary pb-4 px-4">
          <div className="space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-casino-secondary transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Home
            </Link>
            <Link
              to="/games"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-casino-secondary transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Games
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-casino-secondary transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  My Profile
                </Link>
                <Link
                  to="/wallet"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-casino-secondary transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Wallet
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-casino-secondary transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-casino-danger transition-colors flex items-center"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-casino-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-casino-secondary text-white hover:bg-opacity-90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;