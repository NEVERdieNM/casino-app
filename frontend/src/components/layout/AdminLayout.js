import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import LoadingOverlay from '../ui/LoadingOverlay';
import { 
  HomeIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  PuzzlePieceIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const { isLoading } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Header */}
      <header className="bg-casino-primary shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-casino-accent">LuxeCasino</span>
                <span className="text-white ml-2">Admin</span>
              </Link>
            </div>
            
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-casino-secondary transition-colors"
              >
                <HomeIcon className="h-5 w-5 mr-1" />
                Casino
              </Link>
              
              <div className="ml-4 flex items-center">
                <span className="text-gray-400 mr-2">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-white hover:bg-casino-danger transition-colors"
                  title="Logout"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen">
          <nav className="mt-5 px-2">
            <Link
              to="/admin"
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-casino-primary"
            >
              <ChartBarIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-white" />
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-casino-primary"
            >
              <UsersIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-white" />
              Users
            </Link>
            <Link
              to="/admin/games"
              className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-casino-primary"
            >
              <PuzzlePieceIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-white" />
              Games
            </Link>
            <Link
              to="/admin/transactions"
              className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-casino-primary"
            >
              <CurrencyDollarIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-white" />
              Transactions
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-900">
          <main className="container mx-auto px-4 py-8">
            <Outlet />
          </main>
        </div>
      </div>

      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default AdminLayout;