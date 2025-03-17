import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStats } from '../../store/slices/adminSlice';
import { 
  UsersIcon, 
  CurrencyDollarIcon,
  PuzzlePieceIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboardPage = () => {
  const { stats } = useSelector(state => state.admin);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);
  
  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-secondary"></div>
      </div>
    );
  }
  
  // Revenue chart data
  const revenueChartData = {
    labels: stats.revenueByMonth.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: stats.revenueByMonth.map(item => item.revenue),
        borderColor: '#1ABC9C',
        backgroundColor: 'rgba(26, 188, 156, 0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  };
  
  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          display: false
        }
      }
    }
  };
  
  // User activity chart data
  const userActivityChartData = {
    labels: stats.userActivityByDay.map(item => item.day),
    datasets: [
      {
        label: 'Active Users',
        data: stats.userActivityByDay.map(item => item.count),
        backgroundColor: '#F1C40F',
        borderRadius: 5
      }
    ]
  };
  
  const userActivityChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          display: false
        }
      }
    }
  };
  
  // Game popularity chart data
  const gamePopularityChartData = {
    labels: stats.gamePopularity.map(item => item.name),
    datasets: [
      {
        data: stats.gamePopularity.map(item => item.playCount),
        backgroundColor: [
          '#1ABC9C',
          '#3498DB',
          '#9B59B6',
          '#F1C40F',
          '#E74C3C'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const gamePopularityChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of casino performance and statistics</p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-casino-primary rounded-lg shadow-lg p-6">
          <div className="flex items-start">
            <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg mr-4">
              <UsersIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-white">{stats.userCount}</h3>
              <p className="text-xs text-green-500">
                +{stats.newUsersToday} today
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-casino-primary rounded-lg shadow-lg p-6">
          <div className="flex items-start">
            <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg mr-4">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <h3 className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</h3>
              <p className="text-xs text-green-500">
                +${stats.revenueTodayvsYesterday > 0 ? stats.revenueTodayvsYesterday.toFixed(2) : '0'} vs. yesterday
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-casino-primary rounded-lg shadow-lg p-6">
          <div className="flex items-start">
            <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg mr-4">
              <PuzzlePieceIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Games Played</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalGamesPlayed}</h3>
              <p className="text-xs text-green-500">
                +{stats.gamesPlayedToday} today
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-casino-primary rounded-lg shadow-lg p-6">
          <div className="flex items-start">
            <div className="p-2 bg-red-500 bg-opacity-20 rounded-lg mr-4">
              <ArrowTrendingUpIcon className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">House Edge %</p>
              <h3 className="text-2xl font-bold text-white">{stats.houseEdgePercentage}%</h3>
              <p className="text-xs text-green-500">
                Lifetime average
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-casino-primary rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Revenue Trend</h2>
          <div className="h-64">
            <Line data={revenueChartData} options={revenueChartOptions} />
          </div>
        </div>
        
        <div className="bg-casino-primary rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">User Activity</h2>
          <div className="h-64">
            <Bar data={userActivityChartData} options={userActivityChartOptions} />
          </div>
        </div>
      </div>
      
      {/* Additional Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-casino-primary rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Popular Games</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={gamePopularityChartData} options={gamePopularityChartOptions} />
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-casino-primary rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stats.recentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{transaction.username}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'deposit' || transaction.type === 'win' 
                          ? 'bg-green-900 text-green-200' 
                          : 'bg-red-900 text-red-200'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">${transaction.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;