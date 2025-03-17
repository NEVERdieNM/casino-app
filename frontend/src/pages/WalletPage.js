import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalance, getTransactions } from '../store/slices/walletSlice';
import DepositForm from '../components/wallet/DepositForm';
import WithdrawForm from '../components/wallet/WithdrawForm';
import TransactionList from '../components/wallet/TransactionList';
import { ChartPieIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const { balance, currency, transactions, pagination } = useSelector(state => state.wallet);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getBalance());
    loadTransactions();
  }, [dispatch, currentPage, filter]);
  
  const loadTransactions = () => {
    dispatch(getTransactions({
      page: currentPage,
      limit: 10,
      type: filter
    }));
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Wallet</h1>
        <p className="text-gray-400">Manage your funds and view transaction history</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-casino-primary rounded-lg mb-6">
            <div className="border-b border-gray-800">
              <nav className="flex">
                <button
                  className={`px-4 py-3 text-sm font-medium flex items-center ${
                    activeTab === 'transactions'
                      ? 'text-white border-b-2 border-casino-secondary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('transactions')}
                >
                  <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
                  Transactions
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium flex items-center ${
                    activeTab === 'stats'
                      ? 'text-white border-b-2 border-casino-secondary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('stats')}
                >
                  <ChartPieIcon className="h-5 w-5 mr-2" />
                  Statistics
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'transactions' ? (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white mb-4 sm:mb-0">Transaction History</h2>
                    
                    <div className="w-full sm:w-auto">
                      <select
                        value={filter}
                        onChange={handleFilterChange}
                        className="form-input"
                      >
                        <option value="">All Transactions</option>
                        <option value="deposit">Deposits</option>
                        <option value="withdrawal">Withdrawals</option>
                        <option value="bet">Bets</option>
                        <option value="win">Wins</option>
                      </select>
                    </div>
                  </div>
                  
                  <TransactionList transactions={transactions} />
                  
                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center mt-6">
                      <nav className="inline-flex rounded-md shadow">
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-l-md text-sm font-medium ${
                            currentPage === 1
                              ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-800 text-white hover:bg-gray-700'
                          }`}
                        >
                          Previous
                        </button>
                        
                        {/* Page buttons */}
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm font-medium ${
                              currentPage === page
                                ? 'bg-casino-secondary text-white'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(Math.min(pagination.pages, currentPage + 1))}
                          disabled={currentPage === pagination.pages}
                          className={`px-3 py-1 rounded-r-md text-sm font-medium ${
                            currentPage === pagination.pages
                              ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-800 text-white hover:bg-gray-700'
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Activity Statistics</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-gray-400 text-sm mb-2">Total Deposits</h3>
                      <p className="text-2xl font-bold text-white">$1,250.00</p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-gray-400 text-sm mb-2">Total Withdrawals</h3>
                      <p className="text-2xl font-bold text-white">$500.00</p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-gray-400 text-sm mb-2">Total Bets</h3>
                      <p className="text-2xl font-bold text-white">$3,420.00</p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-gray-400 text-sm mb-2">Total Wins</h3>
                      <p className="text-2xl font-bold text-white">$3,120.00</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-white font-bold mb-4">Win/Loss Ratio</h3>
                    <div className="h-12 bg-gray-800 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-casino-success"
                        style={{ width: '48%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-casino-success">Win: 48%</span>
                      <span className="text-casino-danger">Loss: 52%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-casino-primary to-casino-dark rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Current Balance</h2>
            <div className="text-3xl font-bold text-casino-accent">
              {currency} {balance.toFixed(2)}
            </div>
          </div>
          
          {/* Deposit Form */}
          <DepositForm />
          
          {/* Withdraw Form */}
          <div className="mt-6">
            <WithdrawForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;